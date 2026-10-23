import Foundation
import PresenteCore
import StoreKit

/// Compras con StoreKit 2: suscripción mensual (con prueba gratuita para quien califique)
/// y Lifetime (compra única). Independiente del motor de filtrado: el resto de la app
/// solo pregunta `state.unlocksFilters`.
@MainActor
final class SubscriptionStore: ObservableObject {
    /// Deben coincidir con App Store Connect y con Presente.storekit.
    static let monthlyID = "mx.xtudy.presente.monthly"
    static let lifetimeID = "mx.xtudy.presente.lifetime"

    @Published private(set) var monthly: Product?
    @Published private(set) var lifetime: Product?
    @Published private(set) var state: EntitlementState = .unknown
    /// StoreKit confirma que esta cuenta puede usar la prueba gratuita.
    @Published private(set) var isTrialEligible = false
    @Published private(set) var isLoadingProducts = false
    @Published private(set) var purchasing: Plan?
    @Published var message: String?

    private var updatesTask: Task<Void, Never>?

    #if DEBUG
    func setDemoState(_ demo: EntitlementState) { state = demo }

    /// Solo para capturas de pantalla automáticas (modo demo): planes con los precios de Presente.storekit.
    var demoOffers: [PlanOffer]?
    #endif

    var rules: PurchaseRules { PurchaseRules(state: state) }

    /// Lo que la pantalla de planes muestra de cada plan, siempre con datos de StoreKit.
    struct PlanOffer: Equatable {
        let plan: Plan
        let displayPrice: String
        /// Días de prueba gratuita que StoreKit confirma para esta cuenta (nil = sin prueba).
        let trialDays: Int?
        let trialUnit: TrialTerms.Unit?
        let trialValue: Int
    }

    func offer(for plan: Plan) -> PlanOffer? {
        #if DEBUG
        if let demoOffers { return demoOffers.first { $0.plan == plan } }
        #endif
        guard let product = product(for: plan) else { return nil }
        if plan == .monthly, let trial = visibleTrial {
            return PlanOffer(plan: plan, displayPrice: product.displayPrice,
                             trialDays: TrialTerms.days(unit: trial.trialUnit, value: trial.period.value),
                             trialUnit: trial.trialUnit, trialValue: trial.period.value)
        }
        return PlanOffer(plan: plan, displayPrice: product.displayPrice, trialDays: nil, trialUnit: nil, trialValue: 0)
    }

    func product(for plan: Plan) -> Product? {
        switch plan {
        case .monthly: return monthly
        case .lifetime: return lifetime
        }
    }

    /// Oferta de prueba gratuita del plan mensual, si existe en App Store Connect.
    var trialOffer: Product.SubscriptionOffer? {
        guard let offer = monthly?.subscription?.introductoryOffer, offer.paymentMode == .freeTrial else { return nil }
        return offer
    }

    /// Prueba que se mostraría: solo si existe y la cuenta califica.
    var visibleTrial: Product.SubscriptionOffer? { isTrialEligible ? trialOffer : nil }

    func start() async {
        if updatesTask == nil {
            // Renovaciones, reembolsos, cancelaciones y compras hechas fuera de la app (p. ej. "Pedir compra").
            updatesTask = Task { [weak self] in
                for await result in Transaction.updates {
                    await self?.handle(result)
                }
            }
        }
        await loadProducts()
        await refresh()
    }

    func loadProducts() async {
        message = nil
        isLoadingProducts = true
        defer { isLoadingProducts = false }
        do {
            let products = try await Product.products(for: [Self.monthlyID, Self.lifetimeID])
            monthly = products.first { $0.id == Self.monthlyID }
            lifetime = products.first { $0.id == Self.lifetimeID }
            if monthly == nil && lifetime == nil {
                message = String(localized: "Plans aren't available right now. Please try again later.")
            }
        } catch {
            message = String(localized: "We couldn't reach the App Store. Check your connection and try again.")
        }
        await refreshTrialEligibility()
    }

    func refreshTrialEligibility() async {
        if let subscription = monthly?.subscription, subscription.introductoryOffer != nil {
            isTrialEligible = await subscription.isEligibleForIntroOffer
        } else {
            isTrialEligible = false
        }
    }

    func purchase(_ plan: Plan) async {
        guard purchasing == nil, rules.canPurchase(plan), let product = product(for: plan) else { return }
        message = nil
        purchasing = plan
        defer { purchasing = nil }
        do {
            switch try await product.purchase() {
            case .success(let verification):
                guard case .verified(let transaction) = verification else {
                    message = String(localized: "We couldn't verify the purchase with Apple. Nothing was unlocked.")
                    return
                }
                await transaction.finish()
                await refresh()
            case .pending:
                message = String(localized: "Your purchase is pending approval. It will activate once it's confirmed.")
            case .userCancelled:
                break
            @unknown default:
                break
            }
        } catch {
            message = String(localized: "The purchase didn't go through. You weren't charged.")
        }
    }

    func restore() async {
        message = nil
        do {
            try await AppStore.sync()
        } catch {
            message = String(localized: "We couldn't restore your purchases. Please try again.")
            return
        }
        await refresh()
        if !state.unlocksFilters {
            message = String(localized: "We didn't find any purchases for this Apple Account.")
        }
    }

    func refresh() async {
        var facts: [EntitlementEvaluator.TransactionFacts] = []
        for await result in Transaction.currentEntitlements {
            // Solo cuentan transacciones firmadas y verificadas por StoreKit.
            guard case .verified(let t) = result else { continue }
            facts.append(.init(productID: t.productID, expirationDate: t.expirationDate,
                               revocationDate: t.revocationDate, isUpgraded: t.isUpgraded,
                               isIntroOffer: Self.isIntroductory(t)))
        }

        var inGrace = false
        var willRenew = true
        if let statuses = try? await monthly?.subscription?.status {
            for status in statuses {
                if status.state == .inGracePeriod { inGrace = true }
                if case .verified(let info) = status.renewalInfo, info.currentProductID == Self.monthlyID {
                    willRenew = info.willAutoRenew
                }
            }
        }
        state = EntitlementEvaluator.evaluate(subscriptionID: Self.monthlyID, lifetimeID: Self.lifetimeID,
                                              transactions: facts, inGracePeriod: inGrace, willRenew: willRenew)
        if state.unlocksFilters { message = nil }
        await refreshTrialEligibility()
    }

    private static func isIntroductory(_ t: Transaction) -> Bool {
        if #available(iOS 17.2, *) {
            return t.offer?.type == .introductory
        }
        return t.offerType == .introductory
    }

    private func handle(_ result: VerificationResult<Transaction>) async {
        guard case .verified(let transaction) = result else { return }
        await transaction.finish()
        await refresh()
    }
}

extension Product.SubscriptionOffer {
    var trialUnit: TrialTerms.Unit {
        switch period.unit {
        case .day: return .day
        case .week: return .week
        case .month: return .month
        case .year: return .year
        @unknown default: return .day
        }
    }
}

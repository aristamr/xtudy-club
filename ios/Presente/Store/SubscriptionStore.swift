import Foundation
import PresenteCore
import StoreKit

/// Suscripción mensual con StoreKit 2. Independiente del motor de filtrado:
/// el resto de la app solo pregunta `state.unlocksFilters`.
@MainActor
final class SubscriptionStore: ObservableObject {
    /// Debe coincidir con App Store Connect y con Presente.storekit.
    static let productID = "mx.xtudy.presente.monthly"

    @Published private(set) var product: Product?
    @Published private(set) var state: EntitlementState = .unknown
    @Published private(set) var isLoadingProduct = false
    @Published private(set) var isPurchasing = false
    @Published var message: String?

    private var updatesTask: Task<Void, Never>?

    func start() async {
        if updatesTask == nil {
            // Renovaciones, reembolsos y compras hechas fuera de la app (p. ej. "Ask to Buy").
            updatesTask = Task { [weak self] in
                for await result in Transaction.updates {
                    await self?.handle(result)
                }
            }
        }
        await loadProduct()
        await refresh()
    }

    func loadProduct() async {
        isLoadingProduct = true
        defer { isLoadingProduct = false }
        do {
            product = try await Product.products(for: [Self.productID]).first
            if product == nil {
                message = String(localized: "La suscripción no está disponible en este momento.")
            }
        } catch {
            message = String(localized: "No pudimos conectar con el App Store. Revisa tu conexión e inténtalo de nuevo.")
        }
    }

    func purchase() async {
        guard let product, !isPurchasing else { return }
        isPurchasing = true
        defer { isPurchasing = false }
        do {
            switch try await product.purchase() {
            case .success(let verification):
                guard case .verified(let transaction) = verification else {
                    message = String(localized: "No pudimos verificar la compra con Apple. No se activó la suscripción.")
                    return
                }
                await transaction.finish()
                await refresh()
            case .pending:
                message = String(localized: "Tu compra está pendiente de aprobación. Se activará en cuanto se confirme.")
            case .userCancelled:
                break
            @unknown default:
                break
            }
        } catch {
            message = String(localized: "La compra no se completó. No se hizo ningún cargo.")
        }
    }

    func restore() async {
        do {
            try await AppStore.sync()
        } catch {
            message = String(localized: "No pudimos restaurar tus compras. Inténtalo de nuevo.")
            return
        }
        await refresh()
        if !state.unlocksFilters {
            message = String(localized: "No encontramos una suscripción activa para este Apple ID.")
        }
    }

    func refresh() async {
        var facts: [EntitlementEvaluator.TransactionFacts] = []
        for await result in Transaction.currentEntitlements {
            // Solo cuentan transacciones firmadas y verificadas por StoreKit.
            guard case .verified(let t) = result else { continue }
            facts.append(.init(productID: t.productID, expirationDate: t.expirationDate,
                               revocationDate: t.revocationDate, isUpgraded: t.isUpgraded))
        }

        var inGrace = false
        var willRenew = true
        if let statuses = try? await product?.subscription?.status {
            for status in statuses {
                if status.state == .inGracePeriod { inGrace = true }
                if case .verified(let info) = status.renewalInfo, info.currentProductID == Self.productID {
                    willRenew = info.willAutoRenew
                }
            }
        }
        state = EntitlementEvaluator.evaluate(productID: Self.productID, transactions: facts,
                                              inGracePeriod: inGrace, willRenew: willRenew)
    }

    private func handle(_ result: VerificationResult<Transaction>) async {
        guard case .verified(let transaction) = result else { return }
        await transaction.finish()
        await refresh()
    }
}

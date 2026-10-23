import Foundation

/// Estado de acceso, independiente de StoreKit para poder probarlo.
public enum EntitlementState: Equatable, Sendable {
    case unknown
    /// Nunca compró, o no hay transacciones vigentes.
    case none
    /// Periodo de prueba gratuito de la suscripción mensual.
    case trial(expires: Date?, willRenew: Bool)
    /// Suscripción mensual pagada y vigente.
    case subscribed(expires: Date?, willRenew: Bool)
    /// Falló el cobro de la renovación; Apple reintenta y el acceso sigue.
    case inGracePeriod(expires: Date?)
    /// Compra única. `subscriptionStillRenews`: además tiene una suscripción que se seguirá cobrando
    /// hasta que la persona la cancele (Presente no puede cancelarla por ella).
    case lifetime(subscriptionStillRenews: Bool)
    case expired
    case revoked

    public var unlocksFilters: Bool {
        switch self {
        case .trial, .subscribed, .inGracePeriod, .lifetime: return true
        default: return false
        }
    }

    public var hasLifetime: Bool {
        if case .lifetime = self { return true }
        return false
    }

    /// Hay una suscripción vigente (prueba, pagada o en gracia), con o sin Lifetime.
    public var hasActiveSubscription: Bool {
        switch self {
        case .trial, .subscribed, .inGracePeriod: return true
        case .lifetime(let renews): return renews
        default: return false
        }
    }
}

public enum Plan: String, CaseIterable, Sendable {
    case monthly
    case lifetime
}

/// Qué se puede comprar en cada estado: evita compras duplicadas innecesarias.
public struct PurchaseRules: Equatable, Sendable {
    public let state: EntitlementState

    public init(state: EntitlementState) { self.state = state }

    public func canPurchase(_ plan: Plan) -> Bool {
        switch plan {
        case .monthly: return !state.hasLifetime && !state.hasActiveSubscription
        case .lifetime: return !state.hasLifetime
        }
    }

    /// Antes de comprar Lifetime con una suscripción activa, avisar que la suscripción
    /// no se cancela sola y ofrecer administrarla.
    public func needsSubscriptionWarning(before plan: Plan) -> Bool {
        plan == .lifetime && state.hasActiveSubscription && !state.hasLifetime
    }
}

public enum EntitlementEvaluator {
    /// Datos mínimos de una transacción verificada.
    public struct TransactionFacts: Equatable, Sendable {
        public var productID: String
        public var expirationDate: Date?
        public var revocationDate: Date?
        public var isUpgraded: Bool
        public var isIntroOffer: Bool

        public init(productID: String, expirationDate: Date?, revocationDate: Date?,
                    isUpgraded: Bool = false, isIntroOffer: Bool = false) {
            self.productID = productID
            self.expirationDate = expirationDate
            self.revocationDate = revocationDate
            self.isUpgraded = isUpgraded
            self.isIntroOffer = isIntroOffer
        }
    }

    /// - Parameters:
    ///   - transactions: transacciones verificadas de `Transaction.currentEntitlements`.
    ///   - inGracePeriod: el estado de renovación reportado por StoreKit es "periodo de gracia".
    ///   - willRenew: la renovación automática sigue activa.
    public static func evaluate(
        subscriptionID: String,
        lifetimeID: String,
        transactions: [TransactionFacts],
        inGracePeriod: Bool = false,
        willRenew: Bool = true,
        now: Date = Date()
    ) -> EntitlementState {
        let subscription = subscriptionState(productID: subscriptionID, transactions: transactions,
                                             inGracePeriod: inGracePeriod, willRenew: willRenew, now: now)
        let lifetime = transactions.filter { $0.productID == lifetimeID }
        if lifetime.contains(where: { $0.revocationDate == nil }) {
            let renews: Bool
            switch subscription {
            case .trial(_, let r), .subscribed(_, let r): renews = r
            case .inGracePeriod: renews = true
            default: renews = false
            }
            return .lifetime(subscriptionStillRenews: renews)
        }
        if !lifetime.isEmpty, !subscription.unlocksFilters { return .revoked }
        return subscription
    }

    static func subscriptionState(productID: String, transactions: [TransactionFacts],
                                  inGracePeriod: Bool, willRenew: Bool, now: Date) -> EntitlementState {
        let mine = transactions.filter { $0.productID == productID && !$0.isUpgraded }
        guard !mine.isEmpty else { return .none }
        if mine.allSatisfy({ $0.revocationDate != nil }) { return .revoked }
        let valid = mine.filter { $0.revocationDate == nil }
        guard let latest = valid.max(by: { ($0.expirationDate ?? .distantFuture) < ($1.expirationDate ?? .distantFuture) }) else {
            return .none
        }
        if let exp = latest.expirationDate, exp <= now {
            return inGracePeriod ? .inGracePeriod(expires: exp) : .expired
        }
        if inGracePeriod { return .inGracePeriod(expires: latest.expirationDate) }
        return latest.isIntroOffer
            ? .trial(expires: latest.expirationDate, willRenew: willRenew)
            : .subscribed(expires: latest.expirationDate, willRenew: willRenew)
    }
}

/// Fechas de la prueba gratuita, para mostrarlas antes de comprar.
public enum TrialTerms {
    public enum Unit: Sendable { case day, week, month, year }

    /// Fecha del primer cobro si la prueba empieza en `start`.
    public static func firstChargeDate(start: Date, unit: Unit, value: Int, calendar: Calendar = .current) -> Date {
        let component: Calendar.Component
        var amount = value
        switch unit {
        case .day: component = .day
        case .week: component = .day; amount = value * 7
        case .month: component = .month
        case .year: component = .year
        }
        return calendar.date(byAdding: component, value: amount, to: start) ?? start
    }

    /// Duración de la prueba en días (para el texto "7 días gratis").
    public static func days(unit: Unit, value: Int) -> Int? {
        switch unit {
        case .day: return value
        case .week: return value * 7
        case .month, .year: return nil
        }
    }
}

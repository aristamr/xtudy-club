import Foundation

/// Estado de la suscripción, independiente de StoreKit para poder probarlo.
public enum EntitlementState: Equatable, Sendable {
    case unknown
    case active(expires: Date?, willRenew: Bool)
    case inGracePeriod(expires: Date?)
    case expired
    case revoked
    case none

    public var unlocksFilters: Bool {
        switch self {
        case .active, .inGracePeriod: return true
        default: return false
        }
    }
}

public enum EntitlementEvaluator {
    /// Datos mínimos de una transacción verificada.
    public struct TransactionFacts: Equatable, Sendable {
        public var productID: String
        public var expirationDate: Date?
        public var revocationDate: Date?
        public var isUpgraded: Bool

        public init(productID: String, expirationDate: Date?, revocationDate: Date?, isUpgraded: Bool = false) {
            self.productID = productID
            self.expirationDate = expirationDate
            self.revocationDate = revocationDate
            self.isUpgraded = isUpgraded
        }
    }

    /// - Parameters:
    ///   - transactions: transacciones verificadas de `Transaction.currentEntitlements`.
    ///   - inGracePeriod: el estado de renovación reportado por StoreKit es "periodo de gracia".
    ///   - willRenew: la renovación automática sigue activa.
    public static func evaluate(
        productID: String,
        transactions: [TransactionFacts],
        inGracePeriod: Bool = false,
        willRenew: Bool = true,
        now: Date = Date()
    ) -> EntitlementState {
        let mine = transactions.filter { $0.productID == productID && !$0.isUpgraded }
        guard !mine.isEmpty else { return .none }
        if mine.allSatisfy({ $0.revocationDate != nil }) { return .revoked }
        let valid = mine.filter { $0.revocationDate == nil }
        let latest = valid.max { ($0.expirationDate ?? .distantFuture) < ($1.expirationDate ?? .distantFuture) }
        guard let latest else { return .none }
        if let exp = latest.expirationDate, exp <= now {
            return inGracePeriod ? .inGracePeriod(expires: exp) : .expired
        }
        if inGracePeriod { return .inGracePeriod(expires: latest.expirationDate) }
        return .active(expires: latest.expirationDate, willRenew: willRenew)
    }
}

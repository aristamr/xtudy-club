import Foundation

/// Evita bucles de recarga si un sitio nos devuelve repetidamente a una ruta que redirigimos.
/// Mismo criterio que `engine.js`: máximo 3 redirecciones por regla en 10 segundos.
public struct RedirectLoopGuard: Sendable {
    public var limit: Int
    public var window: TimeInterval
    private var history: [String: [Date]] = [:]

    public init(limit: Int = 3, window: TimeInterval = 10) {
        self.limit = limit
        self.window = window
    }

    /// Registra la redirección y devuelve false si ya se excedió el límite.
    public mutating func allow(rule: String, now: Date = Date()) -> Bool {
        var recent = (history[rule] ?? []).filter { now.timeIntervalSince($0) < window }
        guard recent.count < limit else {
            history[rule] = recent
            return false
        }
        recent.append(now)
        history[rule] = recent
        return true
    }
}

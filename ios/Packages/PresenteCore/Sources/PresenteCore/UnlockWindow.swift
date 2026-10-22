import Foundation

/// Ventana de desbloqueo temporal ("Necesito publicar").
///
/// DeviceActivity exige que un intervalo de monitoreo dure al menos 15 minutos.
/// Para desbloquear solo 5, el intervalo se programa terminando en `ahora + 5 min`
/// y empezando en el pasado lo suficiente para cumplir el mínimo. Al terminar el
/// intervalo, la extensión DeviceActivityMonitor vuelve a aplicar el bloqueo.
public struct UnlockWindow: Equatable, Codable, Sendable {
    public static let defaultDuration: TimeInterval = 5 * 60
    /// iOS exige 15 min; usamos 16 para no quedar justo en el límite (`intervalTooShort`).
    public static let minimumMonitoringInterval: TimeInterval = 16 * 60

    /// Inicio del intervalo de monitoreo (puede estar en el pasado).
    public let scheduleStart: Date
    /// Momento en que se restablece el bloqueo.
    public let end: Date

    public init(now: Date = Date(), duration: TimeInterval = UnlockWindow.defaultDuration) {
        let duration = max(duration, 60)
        end = now.addingTimeInterval(duration)
        scheduleStart = end.addingTimeInterval(-max(duration, Self.minimumMonitoringInterval))
    }

    public var monitoringInterval: TimeInterval { end.timeIntervalSince(scheduleStart) }

    public func isActive(at date: Date = Date()) -> Bool { date < end }

    public func remaining(at date: Date = Date()) -> TimeInterval { max(0, end.timeIntervalSince(date)) }

    /// Componentes de fecha completos (con día) para que un intervalo que cruza medianoche
    /// no se interprete como "mañana".
    public static func components(_ date: Date, calendar: Calendar = .current) -> DateComponents {
        calendar.dateComponents([.year, .month, .day, .hour, .minute, .second], from: date)
    }
}

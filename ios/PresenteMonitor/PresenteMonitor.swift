import DeviceActivity
import Foundation

/// Extensión que iOS ejecuta al terminar el desbloqueo temporal, aunque Presente esté cerrada.
final class PresenteMonitor: DeviceActivityMonitor {
    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        guard activity == .temporaryUnlock else { return }
        let shield = ShieldStore()
        // Si ya hay un desbloqueo más reciente en curso (p. ej. se pidió otro), no lo cortamos.
        // Tolerancia de 2 s porque la programación trunca los segundos.
        if let until = shield.unlockedUntil, until.timeIntervalSinceNow > 2 { return }
        shield.unlockedUntil = nil
        shield.applyIfNeeded()
    }
}

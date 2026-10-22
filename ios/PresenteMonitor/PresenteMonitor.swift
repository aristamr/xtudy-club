import DeviceActivity
import Foundation

/// Extensión que iOS ejecuta al terminar el desbloqueo temporal, aunque Presente esté cerrada.
final class PresenteMonitor: DeviceActivityMonitor {
    override func intervalDidEnd(for activity: DeviceActivityName) {
        super.intervalDidEnd(for: activity)
        guard activity == .temporaryUnlock else { return }
        let shield = ShieldStore()
        shield.unlockedUntil = nil
        shield.applyIfNeeded()
    }
}

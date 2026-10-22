import DeviceActivity
import FamilyControls
import Foundation
import ManagedSettings
import PresenteCore

/// Control opcional de las apps originales mediante las APIs oficiales de Screen Time.
///
/// Limitaciones de iOS (documentadas en docs/ARQUITECTURA.md):
/// - Solo bloquea (pantalla de "en pausa"); no puede modificar el interior de Instagram o YouTube.
/// - La persona elige las apps en el selector del sistema; Presente recibe tokens opacos.
/// - No funciona en el Simulador: requiere un iPhone real.
@MainActor
final class ScreenTimeController: ObservableObject {
    @Published private(set) var authorization: AuthorizationStatus
    @Published private(set) var selection: FamilyActivitySelection
    @Published private(set) var isEnabled: Bool
    @Published private(set) var unlockedUntil: Date?
    @Published var errorMessage: String?

    private let shield = ShieldStore()
    private let center = DeviceActivityCenter()

    init() {
        let stored = ShieldStore()
        authorization = AuthorizationCenter.shared.authorizationStatus
        selection = stored.selection
        isEnabled = stored.isEnabled
        unlockedUntil = stored.unlockedUntil
    }

    var isAuthorized: Bool { authorization == .approved }
    var hasSelection: Bool { shield.hasSelection }
    var selectedAppCount: Int { selection.applicationTokens.count + selection.categoryTokens.count }

    /// Bloqueo activo y vigente (no está en un desbloqueo temporal).
    var isBlocking: Bool {
        isAuthorized && isEnabled && hasSelection && !isTemporarilyUnlocked
    }

    var isTemporarilyUnlocked: Bool {
        guard let unlockedUntil else { return false }
        return unlockedUntil > Date()
    }

    func refresh() {
        authorization = AuthorizationCenter.shared.authorizationStatus
        if isAuthorized {
            shield.applyIfNeeded()
        }
        selection = shield.selection
        isEnabled = shield.isEnabled
        unlockedUntil = shield.unlockedUntil
    }

    /// Muestra el diálogo del sistema. Devuelve true si la persona lo aprobó.
    @discardableResult
    func requestAuthorization() async -> Bool {
        do {
            try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
        } catch {
            errorMessage = String(localized: "No se otorgó el permiso de Tiempo en pantalla. Puedes intentarlo de nuevo cuando quieras.")
        }
        authorization = AuthorizationCenter.shared.authorizationStatus
        return isAuthorized
    }

    func save(selection newValue: FamilyActivitySelection) {
        shield.selection = newValue
        let hasApps = !newValue.applicationTokens.isEmpty || !newValue.categoryTokens.isEmpty
        shield.isEnabled = hasApps
        refresh()
    }

    func setEnabled(_ enabled: Bool) {
        shield.isEnabled = enabled
        if !enabled {
            center.stopMonitoring([.temporaryUnlock])
            shield.unlockedUntil = nil
            shield.clear()
        }
        refresh()
    }

    /// "Necesito publicar": quita el bloqueo 5 minutos y programa que vuelva solo.
    ///
    /// Primero se programa el regreso del bloqueo; si eso falla, el bloqueo no se quita,
    /// para nunca dejar las apps libres sin una forma de restablecerlas.
    func temporaryUnlock(now: Date = Date()) -> Bool {
        guard isBlocking || isTemporarilyUnlocked else { return true }
        let window = UnlockWindow(now: now)
        let schedule = DeviceActivitySchedule(
            intervalStart: UnlockWindow.components(window.scheduleStart),
            intervalEnd: UnlockWindow.components(window.end),
            repeats: false
        )
        center.stopMonitoring([.temporaryUnlock])
        do {
            try center.startMonitoring(.temporaryUnlock, during: schedule)
        } catch {
            errorMessage = String(localized: "No pudimos programar el desbloqueo temporal. Las apps siguen bloqueadas.")
            return false
        }
        shield.unlockedUntil = window.end
        shield.clear()
        unlockedUntil = window.end
        return true
    }

    /// Termina el desbloqueo antes de tiempo.
    func endTemporaryUnlock() {
        center.stopMonitoring([.temporaryUnlock])
        shield.unlockedUntil = nil
        refresh()
    }
}

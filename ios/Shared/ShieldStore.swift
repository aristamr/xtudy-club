import DeviceActivity
import FamilyControls
import Foundation
import ManagedSettings

// Código compartido entre la app y la extensión DeviceActivityMonitor.
// Todo vive en el App Group del dispositivo; nada sale del iPhone.

enum AppGroup {
    static let identifier = "group.mx.xtudy.presente"
    static var defaults: UserDefaults { UserDefaults(suiteName: identifier) ?? .standard }
}

extension ManagedSettingsStore.Name {
    static let presente = Self("presente")
}

extension DeviceActivityName {
    /// Intervalo del desbloqueo temporal ("Necesito publicar").
    static let temporaryUnlock = Self("presente.temporaryUnlock")
}

/// Guarda qué apps eligió la persona en el selector de Screen Time y aplica o quita el bloqueo.
///
/// Los tokens de FamilyControls son opacos: Presente no sabe cuál app es Instagram,
/// solo puede bloquear o desbloquear exactamente lo que la persona seleccionó.
struct ShieldStore {
    private let defaults: UserDefaults
    private let store = ManagedSettingsStore(named: .presente)

    private enum Key {
        static let selection = "shield.selection"
        static let enabled = "shield.enabled"
        static let unlockedUntil = "shield.unlockedUntil"
    }

    init(defaults: UserDefaults = AppGroup.defaults) {
        self.defaults = defaults
    }

    var selection: FamilyActivitySelection {
        get {
            guard let data = defaults.data(forKey: Key.selection),
                  let value = try? JSONDecoder().decode(FamilyActivitySelection.self, from: data) else {
                return FamilyActivitySelection()
            }
            return value
        }
        nonmutating set {
            defaults.set(try? JSONEncoder().encode(newValue), forKey: Key.selection)
        }
    }

    /// La persona quiere que las apps originales estén bloqueadas.
    var isEnabled: Bool {
        get { defaults.bool(forKey: Key.enabled) }
        nonmutating set { defaults.set(newValue, forKey: Key.enabled) }
    }

    var unlockedUntil: Date? {
        get { defaults.object(forKey: Key.unlockedUntil) as? Date }
        nonmutating set { defaults.set(newValue, forKey: Key.unlockedUntil) }
    }

    var hasSelection: Bool {
        let s = selection
        return !s.applicationTokens.isEmpty || !s.categoryTokens.isEmpty
    }

    /// Aplica el bloqueo si está habilitado y no hay un desbloqueo vigente.
    func applyIfNeeded(now: Date = Date()) {
        if let until = unlockedUntil, until > now { return }
        unlockedUntil = nil
        guard isEnabled, hasSelection else {
            clear()
            return
        }
        let s = selection
        store.shield.applications = s.applicationTokens.isEmpty ? nil : s.applicationTokens
        store.shield.applicationCategories = s.categoryTokens.isEmpty ? nil : .specific(s.categoryTokens)
    }

    func clear() {
        store.shield.applications = nil
        store.shield.applicationCategories = nil
    }

    var isShieldActive: Bool {
        store.shield.applications?.isEmpty == false || store.shield.applicationCategories != nil
    }
}

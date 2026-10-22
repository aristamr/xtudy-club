import Foundation
import PresenteCore

/// Preferencias de la persona. Todo se guarda solo en este dispositivo.
@MainActor
final class AppModel: ObservableObject {
    @Published var onboardingCompleted: Bool { didSet { defaults.set(onboardingCompleted, forKey: Key.onboarding) } }
    @Published var settings: FilterSettings { didSet { save(settings, Key.settings) } }
    @Published var estimate: LifeEstimate { didSet { save(estimate, Key.estimate) } }
    @Published var channels: SavedChannelList { didSet { save(channels, Key.channels) } }

    private let defaults: UserDefaults

    private enum Key {
        static let onboarding = "onboardingCompleted"
        static let settings = "filterSettings"
        static let estimate = "lifeEstimate"
        static let channels = "youtubeChannels"
    }

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        onboardingCompleted = defaults.bool(forKey: Key.onboarding)
        settings = Self.load(FilterSettings.self, Key.settings, defaults) ?? .default
        estimate = Self.load(LifeEstimate.self, Key.estimate, defaults) ?? LifeEstimate()
        channels = Self.load(SavedChannelList.self, Key.channels, defaults) ?? SavedChannelList()
    }

    private func save<T: Encodable>(_ value: T, _ key: String) {
        defaults.set(try? JSONEncoder().encode(value), forKey: key)
    }

    private static func load<T: Decodable>(_ type: T.Type, _ key: String, _ defaults: UserDefaults) -> T? {
        guard let data = defaults.data(forKey: key) else { return nil }
        return try? JSONDecoder().decode(type, from: data)
    }
}

import Foundation

/// Las tres opciones que la persona ve en el onboarding. Todas activas por defecto.
public enum FilterOption: String, CaseIterable, Codable, Sendable {
    /// Reels (Instagram) y Shorts (YouTube).
    case shortForm
    /// Explore (Instagram) y Explorar/Tendencias (YouTube).
    case explore
    /// Publicaciones sugeridas, inicio algorítmico y reproducción automática.
    case recommendations
}

public struct FilterSettings: Codable, Equatable, Sendable {
    public var removeShortForm: Bool
    public var removeExplore: Bool
    public var hideRecommendations: Bool

    public init(removeShortForm: Bool = true, removeExplore: Bool = true, hideRecommendations: Bool = true) {
        self.removeShortForm = removeShortForm
        self.removeExplore = removeExplore
        self.hideRecommendations = hideRecommendations
    }

    public static let `default` = FilterSettings()

    public func isEnabled(_ option: FilterOption) -> Bool {
        switch option {
        case .shortForm: return removeShortForm
        case .explore: return removeExplore
        case .recommendations: return hideRecommendations
        }
    }

    public var enabledOptions: Set<FilterOption> {
        Set(FilterOption.allCases.filter(isEnabled))
    }

    public var anyEnabled: Bool { !enabledOptions.isEmpty }
}

import Foundation

/// Reglas declarativas de una plataforma (Resources/Rules/<plataforma>.json).
/// Es el único lugar que hay que editar cuando Instagram o YouTube cambian su HTML.
public struct PlatformRules: Codable, Equatable, Sendable {
    public struct Route: Codable, Equatable, Sendable {
        public var id: String
        public var option: FilterOption
        /// Expresión regular sobre `ruta + ?consulta`. Debe ser compatible con ICU y JavaScript.
        public var pattern: String
        /// Plantilla de reemplazo (`$1` para grupos capturados).
        public var redirect: String
    }

    public struct TextRule: Codable, Equatable, Sendable {
        public var option: FilterOption
        public var phrases: [String]
        public var containers: [String]
        public var maxDepth: Int
    }

    public struct Behavior: Codable, Equatable, Sendable {
        public var name: String
        public var option: FilterOption
    }

    public var platform: String
    public var version: Int
    public var routes: [Route]
    public var hide: [String: [String]]
    public var textRules: [TextRule]
    public var behaviors: [Behavior]

    public enum LoadError: Error {
        case missingResource(String)
    }

    public static func load(for platform: Platform, bundle: Bundle? = nil) throws -> PlatformRules {
        let bundle = bundle ?? .module
        guard let url = bundle.url(forResource: platform.rulesResourceName, withExtension: "json", subdirectory: "Resources/Rules") else {
            throw LoadError.missingResource("Rules/\(platform.rulesResourceName).json")
        }
        return try JSONDecoder().decode(PlatformRules.self, from: Data(contentsOf: url))
    }

    public func selectors(for options: Set<FilterOption>) -> [String] {
        FilterOption.allCases.filter(options.contains).flatMap { hide[$0.rawValue] ?? [] }
    }
}

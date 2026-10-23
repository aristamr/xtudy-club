import Foundation

/// Qué hacer con una navegación del marco principal.
public enum NavigationDecision: Equatable, Sendable {
    /// Cargar dentro de la vista filtrada.
    case allow
    /// Cargar otra URL en su lugar (p. ej. Reels → inicio de cuentas seguidas).
    case redirect(URL, rule: String)
    /// Abrir fuera de la app (Safari, Mail, etc.).
    case openExternally(URL)
    /// No hacer nada (esquemas desconocidos o intentos de abrir la app nativa).
    case cancel
}

/// Motor de filtrado de una plataforma: política de navegación (lado nativo) y
/// script inyectado (lado web). Ambos usan las mismas reglas para no divergir.
public struct FilterEngine: Sendable {
    public let platform: Platform
    public let rules: PlatformRules
    public let settings: FilterSettings

    public init(platform: Platform, settings: FilterSettings, rules: PlatformRules? = nil) throws {
        self.platform = platform
        self.settings = settings
        self.rules = try rules ?? PlatformRules.load(for: platform)
    }

    var activeRoutes: [PlatformRules.Route] {
        rules.routes.filter { settings.isEnabled($0.option) }
    }

    // MARK: Navegación

    public func decision(for url: URL) -> NavigationDecision {
        guard let scheme = url.scheme?.lowercased() else { return .cancel }
        switch scheme {
        case "http", "https":
            break
        case "about", "blob", "data":
            return .allow
        case "mailto", "tel", "sms":
            return .openExternally(url)
        default:
            // instagram://, youtube://, intent:// … no saltamos a la app nativa sin que la persona lo pida.
            return .cancel
        }
        guard let host = url.host?.lowercased() else { return .cancel }

        if platform == .youtube, host == "youtu.be" {
            let id = url.path.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
            if !id.isEmpty, let target = URL(string: "https://m.youtube.com/watch?v=\(id)") {
                return .redirect(target, rule: "youtu.be")
            }
        }

        if platform.isAuthHost(host) { return .allow }
        guard platform.isContentHost(host) else { return .openExternally(url) }

        if let hit = redirectPath(for: Self.pathAndQuery(of: url)),
           var components = URLComponents(url: url, resolvingAgainstBaseURL: false) {
            let parts = hit.target.split(separator: "?", maxSplits: 1, omittingEmptySubsequences: false)
            components.percentEncodedPath = String(parts[0])
            components.percentEncodedQuery = parts.count > 1 ? String(parts[1]) : nil
            components.fragment = nil
            if let target = components.url { return .redirect(target, rule: hit.rule) }
        }
        return .allow
    }

    /// Evalúa las rutas igual que `engine.js`: la primera regla que coincide decide.
    public func redirectPath(for pathAndQuery: String) -> (target: String, rule: String)? {
        let range = NSRange(pathAndQuery.startIndex..., in: pathAndQuery)
        for route in activeRoutes {
            guard let regex = try? NSRegularExpression(pattern: route.pattern),
                  regex.firstMatch(in: pathAndQuery, range: range) != nil else { continue }
            let target = regex.stringByReplacingMatches(in: pathAndQuery, range: range, withTemplate: route.redirect)
            return target == pathAndQuery ? nil : (target, route.id)
        }
        return nil
    }

    static func pathAndQuery(of url: URL) -> String {
        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        var path = components?.percentEncodedPath ?? "/"
        if path.isEmpty { path = "/" }
        if let query = components?.percentEncodedQuery { return path + "?" + query }
        return path
    }

    // MARK: Script

    /// Configuración que recibe `engine.js`.
    public struct ScriptConfig: Codable, Equatable {
        public var platform: String
        public var routes: [PlatformRules.Route]
        public var hide: [String]
        public var textRules: [PlatformRules.TextRule]
        public var behaviors: [BehaviorConfig]
        public var labels: [String: String]
    }

    public struct BehaviorConfig: Codable, Equatable {
        public var name: String
        public var params: [String: [String]]
    }

    public func scriptConfig(labels: [String: String] = [:]) -> ScriptConfig {
        let options = settings.enabledOptions
        return ScriptConfig(
            platform: platform.rawValue,
            routes: activeRoutes,
            hide: rules.selectors(for: options),
            textRules: rules.textRules.filter { options.contains($0.option) },
            behaviors: rules.behaviors.filter { options.contains($0.option) }
                .map { BehaviorConfig(name: $0.name, params: $0.params ?? [:]) },
            labels: labels
        )
    }

    /// Script completo para inyectar al inicio del documento.
    public func userScript(labels: [String: String] = [:], bundle: Bundle? = nil) throws -> String {
        let bundle = bundle ?? .module
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.sortedKeys]
        let configJSON = String(decoding: try encoder.encode(scriptConfig(labels: labels)), as: UTF8.self)
        let engine = try Self.resource("engine", bundle: bundle)
        let common = try Self.resource("common", bundle: bundle)
        let behaviors = try Self.resource(platform.scriptResourceName, bundle: bundle)
        return """
        (function () {
        'use strict';
        if (!/(^|\\.)(\(platform.contentHosts.map { NSRegularExpression.escapedPattern(for: $0) }.joined(separator: "|")))$/.test(location.hostname)) { return; }
        const PRESENTE_CONFIG = \(configJSON);
        \(engine)
        \(common)
        \(behaviors)
        presenteStart(PRESENTE_CONFIG, PRESENTE_BEHAVIORS);
        })();
        """
    }

    static func resource(_ name: String, bundle: Bundle) throws -> String {
        guard let url = bundle.url(forResource: name, withExtension: "js", subdirectory: "FilterResources/Scripts") else {
            throw PlatformRules.LoadError.missingResource("Scripts/\(name).js")
        }
        return try String(contentsOf: url, encoding: .utf8)
    }
}

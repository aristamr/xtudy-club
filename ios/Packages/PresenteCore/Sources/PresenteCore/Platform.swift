import Foundation

/// Plataformas soportadas. Agregar una nueva = un caso aquí + un archivo de reglas + un script.
public enum Platform: String, CaseIterable, Codable, Identifiable, Sendable {
    case instagram
    case youtube

    public var id: String { rawValue }

    public var displayName: String {
        switch self {
        case .instagram: return "Instagram"
        case .youtube: return "YouTube"
        }
    }

    /// Página inicial de la experiencia filtrada.
    public var startURL: URL {
        switch self {
        case .instagram: return URL(string: "https://www.instagram.com/?variant=following")!
        case .youtube: return URL(string: "https://m.youtube.com/")!
        }
    }

    /// Dominios cuyo contenido se muestra (y filtra) dentro de la app.
    public var contentHosts: [String] {
        switch self {
        case .instagram: return ["instagram.com"]
        case .youtube: return ["youtube.com", "youtube-nocookie.com"]
        }
    }

    /// Dominios de inicio de sesión oficiales que se permiten sin filtrar.
    /// Presente nunca inyecta scripts en ellos ni lee lo que se escribe ahí.
    public var authHosts: [String] {
        switch self {
        case .instagram: return ["facebook.com", "accountscenter.instagram.com"]
        case .youtube: return ["accounts.google.com", "accounts.youtube.com"]
        }
    }

    /// Esquema para abrir la app nativa ("Necesito publicar").
    public var nativeAppURL: URL {
        switch self {
        case .instagram: return URL(string: "instagram://app")!
        case .youtube: return URL(string: "youtube://")!
        }
    }

    /// Respaldo si la app nativa no está instalada.
    public var webFallbackURL: URL {
        switch self {
        case .instagram: return URL(string: "https://www.instagram.com/")!
        case .youtube: return URL(string: "https://www.youtube.com/")!
        }
    }

    public var rulesResourceName: String { rawValue }
    public var scriptResourceName: String { rawValue }

    /// Devuelve true si `host` es `domain` o un subdominio de él.
    static func host(_ host: String, isWithin domain: String) -> Bool {
        let h = host.lowercased()
        return h == domain || h.hasSuffix("." + domain)
    }

    func isContentHost(_ host: String) -> Bool {
        contentHosts.contains { Platform.host(host, isWithin: $0) }
    }

    func isAuthHost(_ host: String) -> Bool {
        authHosts.contains { Platform.host(host, isWithin: $0) }
    }
}

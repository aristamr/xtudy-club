import Foundation

/// Nivel de soporte real de una plataforma. Se muestra a la persona tal cual:
/// nunca se presenta como completa una plataforma que no se ha verificado.
public enum SupportLevel: String, Codable, Sendable, Comparable {
    /// Filtros verificados en un iPhone real contra el sitio actual.
    case verified
    /// Funciona, con limitaciones conocidas y documentadas.
    case partial
    /// Reglas escritas pero sin verificar en dispositivo; puede fallar.
    case experimental
    /// No hay una forma permitida de ofrecer la versión filtrada.
    case unavailable

    private var rank: Int {
        switch self {
        case .verified: return 0
        case .partial: return 1
        case .experimental: return 2
        case .unavailable: return 3
        }
    }

    public static func < (lhs: SupportLevel, rhs: SupportLevel) -> Bool { lhs.rank < rhs.rank }
}

/// Plataformas. Agregar una nueva = un caso aquí + Rules/<plataforma>.json + Scripts/<plataforma>.js.
public enum Platform: String, CaseIterable, Codable, Identifiable, Sendable {
    case instagram
    case youtube
    case tiktok
    case facebook
    case x
    case reddit
    case linkedin
    case threads
    case pinterest
    case snapchat

    public var id: String { rawValue }

    public var displayName: String {
        switch self {
        case .instagram: return "Instagram"
        case .youtube: return "YouTube"
        case .tiktok: return "TikTok"
        case .facebook: return "Facebook"
        case .x: return "X"
        case .reddit: return "Reddit"
        case .linkedin: return "LinkedIn"
        case .threads: return "Threads"
        case .pinterest: return "Pinterest"
        case .snapchat: return "Snapchat"
        }
    }

    /// Estado actual. Cámbialo solo después de completar docs/QA.md en un iPhone real.
    public var support: SupportLevel {
        switch self {
        case .instagram, .youtube: return .partial
        case .tiktok, .facebook, .x, .reddit, .linkedin, .threads, .pinterest: return .experimental
        // web.snapchat.com solo funciona en navegadores de escritorio.
        case .snapchat: return .unavailable
        }
    }

    /// Hay versión filtrada dentro de la app (independiente del bloqueo con Screen Time).
    public var hasFilteredWeb: Bool { support != .unavailable }

    /// Activas por defecto en la pantalla principal.
    public static let defaultActive: [Platform] = [.instagram, .youtube]

    /// Página inicial de la experiencia filtrada.
    public var startURL: URL {
        switch self {
        case .instagram: return URL(string: "https://www.instagram.com/?variant=following")!
        case .youtube: return URL(string: "https://m.youtube.com/")!
        case .tiktok: return URL(string: "https://www.tiktok.com/following")!
        case .facebook: return URL(string: "https://m.facebook.com/")!
        case .x: return URL(string: "https://x.com/home")!
        case .reddit: return URL(string: "https://www.reddit.com/")!
        case .linkedin: return URL(string: "https://www.linkedin.com/feed/")!
        case .threads: return URL(string: "https://www.threads.com/")!
        case .pinterest: return URL(string: "https://www.pinterest.com/")!
        case .snapchat: return URL(string: "https://www.snapchat.com/")!
        }
    }

    /// Dominios cuyo contenido se muestra (y filtra) dentro de la app.
    public var contentHosts: [String] {
        switch self {
        case .instagram: return ["instagram.com"]
        case .youtube: return ["youtube.com", "youtube-nocookie.com"]
        case .tiktok: return ["tiktok.com"]
        case .facebook: return ["facebook.com"]
        case .x: return ["x.com", "twitter.com"]
        case .reddit: return ["reddit.com"]
        case .linkedin: return ["linkedin.com"]
        case .threads: return ["threads.com", "threads.net"]
        case .pinterest: return ["pinterest.com"]
        case .snapchat: return ["snapchat.com"]
        }
    }

    /// Dominios de inicio de sesión oficiales que se permiten sin filtrar.
    /// Presente nunca inyecta scripts en ellos ni lee lo que se escribe ahí.
    public var authHosts: [String] {
        switch self {
        case .instagram: return ["facebook.com", "accountscenter.instagram.com"]
        case .youtube: return ["accounts.google.com", "accounts.youtube.com"]
        case .tiktok: return ["accounts.google.com", "appleid.apple.com"]
        case .facebook: return ["accountscenter.facebook.com"]
        case .x: return ["accounts.google.com", "appleid.apple.com"]
        case .reddit: return ["accounts.google.com", "appleid.apple.com"]
        case .linkedin: return ["accounts.google.com", "appleid.apple.com"]
        case .threads: return ["instagram.com", "facebook.com"]
        case .pinterest: return ["accounts.google.com", "appleid.apple.com", "facebook.com"]
        case .snapchat: return ["accounts.snapchat.com"]
        }
    }

    /// Esquema para abrir la app nativa ("Necesito publicar").
    public var nativeAppURL: URL {
        switch self {
        case .instagram: return URL(string: "instagram://app")!
        case .youtube: return URL(string: "youtube://")!
        case .tiktok: return URL(string: "tiktok://")!
        case .facebook: return URL(string: "fb://")!
        case .x: return URL(string: "twitter://")!
        case .reddit: return URL(string: "reddit://")!
        case .linkedin: return URL(string: "linkedin://")!
        case .threads: return URL(string: "barcelona://")!
        case .pinterest: return URL(string: "pinterest://")!
        case .snapchat: return URL(string: "snapchat://")!
        }
    }

    /// Respaldo si la app nativa no está instalada.
    public var webFallbackURL: URL {
        URL(string: "https://www.\(contentHosts[0])/")!
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

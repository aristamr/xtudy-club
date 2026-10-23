import PresenteCore
import SwiftUI

/// Paleta: blanco cálido, gris suave, negro elegante y acentos verde salvia.
/// Todos los colores tienen variante oscura en Assets.xcassets.
enum Theme {
    static let background = Color("Background")
    static let surface = Color("Surface")
    static let surfaceStrong = Color("SurfaceStrong")
    static let ink = Color("Ink")
    static let softInk = Color("SoftInk")
    static let accent = Color("Sage")

    // Cuadrícula de semanas
    static let lived = Color("Ink").opacity(0.82)
    static let free = Color("FreeTime")
    static let scroll = Color("ScrollTime")
    static let sleep = Color("SoftInk").opacity(0.28)

    static let cornerRadius: CGFloat = 22
    static let padding: CGFloat = 24

    static func title(_ size: CGFloat = 34) -> Font { .system(size: size, weight: .semibold, design: .default) }
}

/// Botón principal: grande, de ancho completo, sin adornos.
struct PrimaryButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .multilineTextAlignment(.center)
            .padding(.horizontal, 16)
            .frame(maxWidth: .infinity, minHeight: 56)
            .foregroundStyle(Theme.background)
            .background(Theme.ink.opacity(isEnabled ? 1 : 0.25), in: RoundedRectangle(cornerRadius: 18, style: .continuous))
            .opacity(configuration.isPressed ? 0.85 : 1)
            .scaleEffect(configuration.isPressed ? 0.985 : 1)
            .animation(.easeOut(duration: 0.15), value: configuration.isPressed)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.body.weight(.medium))
            .multilineTextAlignment(.center)
            .padding(.horizontal, 14)
            .frame(maxWidth: .infinity, minHeight: 50)
            .foregroundStyle(Theme.ink)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
            .opacity(configuration.isPressed ? 0.7 : 1)
    }
}

extension ButtonStyle where Self == PrimaryButtonStyle {
    static var primary: PrimaryButtonStyle { PrimaryButtonStyle() }
}

extension ButtonStyle where Self == SecondaryButtonStyle {
    static var secondary: SecondaryButtonStyle { SecondaryButtonStyle() }
}

/// Tarjeta neutra reutilizable.
struct Card<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        content
            .padding(18)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cornerRadius, style: .continuous))
    }
}

/// Etiqueta pequeña (p. ej. "Beta").
struct Tag: View {
    let text: LocalizedStringKey
    var tint: Color = Theme.accent

    var body: some View {
        Text(text)
            .font(.caption2.weight(.semibold))
            .textCase(.uppercase)
            .padding(.horizontal, 7)
            .padding(.vertical, 3)
            .foregroundStyle(tint)
            .overlay(Capsule().strokeBorder(tint.opacity(0.6), lineWidth: 1))
    }
}

extension PlatformID {
    /// Símbolos genéricos del sistema: no usamos logotipos de terceros.
    var symbolName: String {
        switch self {
        case .instagram: return "camera"
        case .youtube: return "play.rectangle"
        case .tiktok: return "music.note"
        case .facebook: return "person.2"
        case .x: return "text.bubble"
        case .reddit: return "bubble.left.and.bubble.right"
        case .linkedin: return "briefcase"
        case .threads: return "at"
        case .pinterest: return "pin"
        case .snapchat: return "camera.viewfinder"
        }
    }

    /// Lo que la persona conserva, en una línea.
    var keepsSummary: LocalizedStringKey {
        switch self {
        case .instagram: return "People you follow, profiles and messages"
        case .youtube: return "Search, your channels and full videos"
        case .tiktok: return "Following, search and profiles"
        case .facebook: return "Friends' posts, groups and profiles"
        case .x: return "Following, messages and search"
        case .reddit: return "Your communities, chat and search"
        case .linkedin: return "Your network, messages and jobs"
        case .threads: return "Following, profiles and search"
        case .pinterest: return "Search, boards and profiles"
        case .snapchat: return "Only app pausing is available"
        }
    }

    var supportTag: LocalizedStringKey? {
        switch support {
        case .verified, .partial: return nil
        case .experimental: return "Beta"
        case .unavailable: return "Not available"
        }
    }
}

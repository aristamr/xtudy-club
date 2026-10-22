import PresenteCore
import SwiftUI

enum Theme {
    static let accent = Color("AccentColor")
    /// Semanas vividas.
    static let lived = Color.primary.opacity(0.78)
    /// Semanas libres (lo que queda para la vida).
    static let free = Color("FreeTime")
    /// Semanas equivalentes de scroll.
    static let scroll = Color("ScrollTime")
    /// Semanas equivalentes de sueño.
    static let sleep = Color.secondary.opacity(0.28)

    static let cornerRadius: CGFloat = 20
    static let padding: CGFloat = 24
}

/// Botón principal: grande, de ancho completo, sin adornos.
struct PrimaryButtonStyle: ButtonStyle {
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .frame(maxWidth: .infinity, minHeight: 54)
            .foregroundStyle(Color(uiColor: .systemBackground))
            .background(Color.primary.opacity(isEnabled ? 1 : 0.3), in: RoundedRectangle(cornerRadius: 16, style: .continuous))
            .opacity(configuration.isPressed ? 0.8 : 1)
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeOut(duration: 0.15), value: configuration.isPressed)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.body.weight(.medium))
            .frame(maxWidth: .infinity, minHeight: 48)
            .foregroundStyle(.primary)
            .background(Color.primary.opacity(0.06), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
            .opacity(configuration.isPressed ? 0.7 : 1)
    }
}

extension ButtonStyle where Self == PrimaryButtonStyle {
    static var primary: PrimaryButtonStyle { PrimaryButtonStyle() }
}

extension ButtonStyle where Self == SecondaryButtonStyle {
    static var secondary: SecondaryButtonStyle { SecondaryButtonStyle() }
}

extension PresenteCore.Platform {
    var symbolName: String {
        switch self {
        case .instagram: return "camera"
        case .youtube: return "play.rectangle"
        }
    }

    /// Lo que la persona conserva, en una línea.
    var keepsSummary: LocalizedStringKey {
        switch self {
        case .instagram: return "Cuentas que sigues, perfiles y mensajes"
        case .youtube: return "Búsqueda, tus canales y videos completos"
        }
    }
}

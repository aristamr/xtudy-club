import PresenteCore
import SwiftUI
import WebKit

struct SettingsView: View {
    @EnvironmentObject private var model: AppModel
    @Environment(\.dismiss) private var dismiss
    @State private var confirmSignOut = false
    @State private var signedOut = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 28) {
                    section("Filtros", footer: "Los cambios se aplican la próxima vez que abras Instagram o YouTube.") {
                        FilterToggles(settings: $model.settings)
                    }

                    section("Apps originales") {
                        AppBlockingCard()
                    }

                    section("Suscripción") {
                        SubscriptionOffer()
                    }

                    section("Tú") {
                        NavigationLink {
                            ScrollView {
                                LifeWeeksView(estimate: $model.estimate).padding(Theme.padding)
                            }
                        } label: {
                            Label("Tu vida en semanas", systemImage: "square.grid.3x3")
                        }
                        .buttonStyle(.secondary)
                    }

                    section("Privacidad", footer: "Presente no pide ni guarda tus contraseñas. Inicias sesión directamente en las páginas oficiales y la sesión se queda en este iPhone. No usamos analítica ni publicidad.") {
                        Button(role: .destructive) { confirmSignOut = true } label: {
                            Label(signedOut ? LocalizedStringKey("Sesiones cerradas") : LocalizedStringKey("Cerrar sesión en Instagram y YouTube"),
                                  systemImage: "rectangle.portrait.and.arrow.right")
                        }
                        .buttonStyle(.secondary)
                        .disabled(signedOut)
                    }

                    Text("Versión \(Bundle.main.versionString)")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .frame(maxWidth: .infinity)
                }
                .padding(Theme.padding)
            }
            .navigationTitle(Text("Configuración"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) { Button("Listo") { dismiss() } }
            }
            .confirmationDialog("¿Cerrar sesión en Instagram y YouTube dentro de Presente?", isPresented: $confirmSignOut, titleVisibility: .visible) {
                Button("Cerrar sesiones", role: .destructive) { signOut() }
            }
        }
    }

    private func section<Content: View>(_ title: LocalizedStringKey, footer: LocalizedStringKey? = nil,
                                        @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.footnote.weight(.semibold))
                .foregroundStyle(.secondary)
                .textCase(.uppercase)
            content()
            if let footer {
                Text(footer)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private func signOut() {
        WKWebsiteDataStore.default().removeData(ofTypes: WKWebsiteDataStore.allWebsiteDataTypes(), modifiedSince: .distantPast) {
            signedOut = true
        }
    }
}

extension Bundle {
    var versionString: String {
        let version = infoDictionary?["CFBundleShortVersionString"] as? String ?? "?"
        let build = infoDictionary?["CFBundleVersion"] as? String ?? "?"
        return "\(version) (\(build))"
    }
}

import PresenteCore
import SwiftUI

/// Pantalla principal: un estado, dos accesos y nada más.
struct HomeView: View {
    @EnvironmentObject private var model: AppModel
    @EnvironmentObject private var store: SubscriptionStore
    @EnvironmentObject private var screenTime: ScreenTimeController

    @State private var openPlatform: PresenteCore.Platform?
    @State private var showPaywall = false
    @State private var showSettings = false
    @State private var showPublishChoice = false

    private var isProtected: Bool { store.state.unlocksFilters && model.settings.anyEnabled }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Spacer()
                Button { showSettings = true } label: {
                    Image(systemName: "gearshape").font(.title3)
                }
                .foregroundStyle(.secondary)
                .accessibilityLabel(Text("Configuración"))
            }
            .padding(.top, 8)

            Spacer(minLength: 24)

            VStack(alignment: .leading, spacing: 10) {
                Text(title)
                    .font(.largeTitle.bold())
                    .contentTransition(.opacity)
                StatusLine()
            }

            Spacer(minLength: 32)

            VStack(spacing: 14) {
                ForEach(PresenteCore.Platform.allCases) { platform in
                    PlatformCard(platform: platform) { open(platform) }
                }
            }

            Spacer(minLength: 24)

            Button {
                showPublishChoice = true
            } label: {
                Label("Necesito publicar", systemImage: "square.and.arrow.up")
            }
            .buttonStyle(.secondary)
            .padding(.bottom, 8)
        }
        .padding(.horizontal, Theme.padding)
        .padding(.bottom, Theme.padding)
        .fullScreenCover(item: $openPlatform) { platform in
            BrowserScreen(platform: platform)
        }
        .sheet(isPresented: $showPaywall) { PaywallSheet() }
        .sheet(isPresented: $showSettings) { SettingsView() }
        .sheet(isPresented: $showPublishChoice) { PublishSheet() }
    }

    private var title: LocalizedStringKey {
        if !store.state.unlocksFilters {
            if case .unknown = store.state { return "Presente" }
            return "Activa Presente para empezar."
        }
        return isProtected ? "Estás protegido." : "Filtros en pausa."
    }

    private func open(_ platform: PresenteCore.Platform) {
        if store.state.unlocksFilters {
            openPlatform = platform
        } else {
            showPaywall = true
        }
    }
}

private struct StatusLine: View {
    @EnvironmentObject private var model: AppModel
    @EnvironmentObject private var store: SubscriptionStore
    @EnvironmentObject private var screenTime: ScreenTimeController

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            row(on: store.state.unlocksFilters && model.settings.anyEnabled, filtersText)
            TimelineView(.periodic(from: .now, by: 1)) { context in
                appsRow(now: context.date)
            }
        }
        .font(.subheadline)
        .foregroundStyle(.secondary)
    }

    private var filtersText: LocalizedStringKey {
        if !store.state.unlocksFilters { return "Sin suscripción activa" }
        return model.settings.anyEnabled ? "Filtros activos" : "Todos los filtros están apagados"
    }

    @ViewBuilder
    private func appsRow(now: Date) -> some View {
        if let until = screenTime.unlockedUntil, until > now {
            let remaining = Int(until.timeIntervalSince(now))
            row(on: false, "Apps originales abiertas por \(remaining / 60):\(String(format: "%02d", remaining % 60))")
        } else if screenTime.isBlocking {
            row(on: true, "Apps originales en pausa")
        } else {
            row(on: false, "Apps originales sin bloquear")
        }
    }

    private func row(on: Bool, _ text: LocalizedStringKey) -> some View {
        HStack(spacing: 8) {
            Circle().fill(on ? Theme.free : Color.secondary.opacity(0.4)).frame(width: 8, height: 8)
            Text(text)
        }
        .accessibilityElement(children: .combine)
    }
}

private struct PlatformCard: View {
    let platform: PresenteCore.Platform
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: platform.symbolName)
                    .font(.title2)
                    .frame(width: 44, height: 44)
                    .background(Theme.accent.opacity(0.12), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                    .foregroundStyle(Theme.accent)
                VStack(alignment: .leading, spacing: 2) {
                    Text(platform.displayName).font(.title3.weight(.semibold))
                    Text(platform.keepsSummary).font(.subheadline).foregroundStyle(.secondary)
                }
                Spacer()
                Image(systemName: "chevron.right").foregroundStyle(.tertiary)
            }
            .padding(20)
            .frame(maxWidth: .infinity, minHeight: 96)
            .background(Color.primary.opacity(0.05), in: RoundedRectangle(cornerRadius: Theme.cornerRadius, style: .continuous))
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityHint(Text("Abre \(platform.displayName) sin distracciones"))
    }
}

/// "Necesito publicar": abre la app original; si está bloqueada, la libera 5 minutos.
private struct PublishSheet: View {
    @EnvironmentObject private var screenTime: ScreenTimeController
    @Environment(\.dismiss) private var dismiss
    @Environment(\.openURL) private var openURL

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 16) {
                Text(screenTime.isBlocking || screenTime.isTemporarilyUnlocked
                     ? LocalizedStringKey("Tendrás 5 minutos en la app original. Después se vuelve a pausar sola.")
                     : LocalizedStringKey("Abriremos la app original para que publiques."))
                    .foregroundStyle(.secondary)
                if screenTime.isBlocking || screenTime.isTemporarilyUnlocked {
                    Text("Por privacidad, iOS no nos dice cuál app es cuál: se liberan todas las apps que elegiste.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
                ForEach(PresenteCore.Platform.allCases) { platform in
                    Button {
                        publish(on: platform)
                    } label: {
                        Label("Abrir \(platform.displayName)", systemImage: platform.symbolName)
                    }
                    .buttonStyle(.secondary)
                }
                if let error = screenTime.errorMessage {
                    Text(error).font(.footnote).foregroundStyle(.red)
                }
                Spacer()
            }
            .padding(Theme.padding)
            .navigationTitle(Text("Necesito publicar"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancelar") { dismiss() } }
            }
        }
        .presentationDetents([.medium])
    }

    private func publish(on platform: PresenteCore.Platform) {
        guard screenTime.temporaryUnlock() else { return }
        dismiss()
        openURL(platform.nativeAppURL) { accepted in
            if !accepted { openURL(platform.webFallbackURL) }
        }
    }
}

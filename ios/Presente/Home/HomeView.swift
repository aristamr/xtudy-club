import PresenteCore
import SwiftUI

/// Pantalla principal: estado, redes activas, acceso a cada una y Configuración. Nada más.
struct HomeView: View {
    @EnvironmentObject private var model: AppModel
    @EnvironmentObject private var store: SubscriptionStore
    @EnvironmentObject private var screenTime: ScreenTimeController

    @State private var openPlatform: PlatformID?
    @State private var showPaywall = false
    @State private var showSettings = false
    @State private var showPublish = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 28) {
                HStack {
                    Spacer()
                    Button { showSettings = true } label: {
                        Image(systemName: "gearshape").font(.title3).frame(width: 44, height: 44)
                    }
                    .foregroundStyle(Theme.softInk)
                    .accessibilityLabel(Text("Settings"))
                }

                VStack(alignment: .leading, spacing: 12) {
                    Text(title)
                        .font(Theme.title(36))
                        .foregroundStyle(Theme.ink)
                        .contentTransition(.opacity)
                        .accessibilityAddTraits(.isHeader)
                    StatusLines()
                    if !store.state.unlocksFilters, store.state != .unknown {
                        Button("See plans") { showPaywall = true }
                            .buttonStyle(.secondary)
                            .padding(.top, 4)
                    }
                }

                VStack(spacing: 12) {
                    ForEach(model.activePlatforms) { platform in
                        PlatformRow(platform: platform) { open(platform) }
                    }
                    if model.activePlatforms.isEmpty {
                        Button("Add a network") { showSettings = true }
                            .buttonStyle(.secondary)
                    }
                }

                Button { showPublish = true } label: {
                    Label("I need to post", systemImage: "square.and.arrow.up")
                }
                .buttonStyle(.secondary)
            }
            .padding(.horizontal, Theme.padding)
            .padding(.bottom, Theme.padding)
        }
        .background(Theme.background.ignoresSafeArea())
        .fullScreenCover(item: $openPlatform) { BrowserScreen(platform: $0) }
        .sheet(isPresented: $showPaywall) { PaywallSheet() }
        .sheet(isPresented: $showSettings) { SettingsView() }
        .sheet(isPresented: $showPublish) { PublishSheet() }
    }

    private var title: LocalizedStringKey {
        switch store.state {
        case .unknown: return "Presente"
        case let s where !s.unlocksFilters: return "Your space is ready."
        default: return model.settings.anyEnabled ? "Your space is clear." : "Your filters are paused."
        }
    }

    private func open(_ platform: PlatformID) {
        if store.state.unlocksFilters { openPlatform = platform } else { showPaywall = true }
    }
}

private struct StatusLines: View {
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
        .foregroundStyle(Theme.softInk)
    }

    private var filtersText: LocalizedStringKey {
        if !store.state.unlocksFilters { return "Filters unlock with a plan" }
        return model.settings.anyEnabled ? "Filters on" : "All filters are off"
    }

    @ViewBuilder
    private func appsRow(now: Date) -> some View {
        if let until = screenTime.unlockedUntil, until > now {
            let remaining = Int(until.timeIntervalSince(now))
            row(on: false, "Original apps open for \(remaining / 60):\(String(format: "%02d", remaining % 60))")
        } else if screenTime.isBlocking {
            row(on: true, "Original apps paused")
        } else {
            row(on: false, "Original apps not paused")
        }
    }

    private func row(on: Bool, _ text: LocalizedStringKey) -> some View {
        HStack(spacing: 8) {
            Circle().fill(on ? Theme.accent : Theme.softInk.opacity(0.4)).frame(width: 8, height: 8)
            Text(text)
        }
        .accessibilityElement(children: .combine)
    }
}

private struct PlatformRow: View {
    let platform: PlatformID
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: platform.symbolName)
                    .font(.title3)
                    .frame(width: 46, height: 46)
                    .background(Theme.accent.opacity(0.14), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
                    .foregroundStyle(Theme.accent)
                VStack(alignment: .leading, spacing: 3) {
                    HStack(spacing: 8) {
                        Text(verbatim: platform.displayName).font(.title3.weight(.semibold)).foregroundStyle(Theme.ink)
                        if let tag = platform.supportTag { Tag(text: tag) }
                    }
                    Text(platform.keepsSummary).font(.subheadline).foregroundStyle(Theme.softInk)
                        .fixedSize(horizontal: false, vertical: true)
                }
                Spacer(minLength: 0)
                Image(systemName: "chevron.forward").foregroundStyle(Theme.softInk.opacity(0.6))
            }
            .padding(18)
            .frame(maxWidth: .infinity)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cornerRadius, style: .continuous))
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .accessibilityHint(Text("Opens \(platform.displayName) without distractions"))
    }
}

/// "I need to post": abre la app original; si está en pausa, la libera 5 minutos.
struct PublishSheet: View {
    @EnvironmentObject private var screenTime: ScreenTimeController
    @EnvironmentObject private var model: AppModel
    @Environment(\.dismiss) private var dismiss
    @Environment(\.openURL) private var openURL

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    if screenTime.isBlocking || screenTime.isTemporarilyUnlocked {
                        Text("You'll have 5 minutes in the original app. Then it pauses again on its own.")
                            .foregroundStyle(Theme.softInk)
                        Text("For privacy, iOS doesn't tell us which app is which, so all the apps you chose are unlocked.")
                            .font(.footnote)
                            .foregroundStyle(Theme.softInk)
                    } else {
                        Text("We'll open the original app so you can post.")
                            .foregroundStyle(Theme.softInk)
                    }
                    ForEach(PlatformID.allCases.filter { model.isActive($0) || $0 == .snapchat }) { platform in
                        Button { publish(on: platform) } label: {
                            Label {
                                Text("Open \(platform.displayName)")
                            } icon: {
                                Image(systemName: platform.symbolName)
                            }
                        }
                        .buttonStyle(.secondary)
                    }
                    if let error = screenTime.errorMessage {
                        Text(error).font(.footnote).foregroundStyle(.red)
                    }
                }
                .padding(Theme.padding)
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle(Text("I need to post"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
            }
        }
        .presentationDetents([.medium, .large])
    }

    private func publish(on platform: PlatformID) {
        guard screenTime.temporaryUnlock() else { return }
        dismiss()
        openURL(platform.nativeAppURL) { accepted in
            if !accepted { openURL(platform.webFallbackURL) }
        }
    }
}

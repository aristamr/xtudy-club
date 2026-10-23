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
                VStack(alignment: .leading, spacing: 30) {
                    section("Your networks", footer: "Beta networks use filters that haven't been verified on a real iPhone yet. Some distractions may slip through.") {
                        VStack(spacing: 0) {
                            ForEach(PlatformID.allCases) { platform in
                                NetworkToggle(platform: platform)
                                if platform != PlatformID.allCases.last { Divider().padding(.leading, 46) }
                            }
                        }
                        .padding(.horizontal, 16)
                        .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cornerRadius, style: .continuous))
                    }

                    section("Filters", footer: "Changes apply the next time you open a network.") {
                        FilterToggles(settings: $model.settings)
                    }

                    section("Original apps") { AppBlockingCard() }

                    section("Your plan") { PlanStatusView() }

                    section("You") {
                        NavigationLink {
                            ScrollView {
                                VStack(spacing: 24) {
                                    DailyMinutesEditor(minutes: $model.estimate.dailyScrollMinutes)
                                    LifeWeeksContent(estimate: $model.estimate)
                                }
                                .padding(Theme.padding)
                            }
                            .background(Theme.background.ignoresSafeArea())
                        } label: {
                            Label("Your life in weeks", systemImage: "square.grid.3x3")
                        }
                        .buttonStyle(.secondary)
                    }

                    section("Privacy", footer: "Presente never asks for or stores your passwords. You sign in on the official websites and the session stays on this iPhone. No accounts, no analytics, no ads.") {
                        VStack(spacing: 10) {
                            Link(destination: PaywallView.privacyURL) {
                                Label("Privacy policy", systemImage: "hand.raised")
                            }
                            .buttonStyle(.secondary)
                            Button(role: .destructive) { confirmSignOut = true } label: {
                                Label(signedOut ? LocalizedStringKey("Signed out") : LocalizedStringKey("Sign out of all networks"),
                                      systemImage: "rectangle.portrait.and.arrow.right")
                            }
                            .buttonStyle(.secondary)
                            .disabled(signedOut)
                        }
                    }

                    Text("Version \(Bundle.main.versionString)")
                        .font(.footnote)
                        .foregroundStyle(Theme.softInk)
                        .frame(maxWidth: .infinity)
                }
                .padding(Theme.padding)
            }
            .background(Theme.background.ignoresSafeArea())
            .navigationTitle(Text("Settings"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) { Button("Done") { dismiss() } }
            }
            .confirmationDialog("Sign out of every network inside Presente?", isPresented: $confirmSignOut, titleVisibility: .visible) {
                Button("Sign out", role: .destructive) { signOut() }
            }
        }
    }

    private func section<Content: View>(_ title: LocalizedStringKey, footer: LocalizedStringKey? = nil,
                                        @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(.footnote.weight(.semibold))
                .foregroundStyle(Theme.softInk)
                .textCase(.uppercase)
                .accessibilityAddTraits(.isHeader)
            content()
            if let footer {
                Text(footer)
                    .font(.footnote)
                    .foregroundStyle(Theme.softInk)
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

private struct NetworkToggle: View {
    let platform: PlatformID
    @EnvironmentObject private var model: AppModel

    var body: some View {
        Toggle(isOn: Binding(get: { model.isActive(platform) }, set: { model.setActive(platform, $0) })) {
            HStack(spacing: 12) {
                Image(systemName: platform.symbolName)
                    .frame(width: 30)
                    .foregroundStyle(Theme.accent)
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 6) {
                        Text(verbatim: platform.displayName).foregroundStyle(Theme.ink)
                        if let tag = platform.supportTag { Tag(text: tag, tint: platform.hasFilteredWeb ? Theme.accent : Theme.softInk) }
                    }
                    if !platform.hasFilteredWeb {
                        Text("Its website only works on computers. You can still pause the app with Screen Time.")
                            .font(.caption)
                            .foregroundStyle(Theme.softInk)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }
        }
        .disabled(!platform.hasFilteredWeb)
        .tint(Theme.accent)
        .padding(.vertical, 10)
    }
}

/// Las tres opciones de filtrado.
struct FilterToggles: View {
    @Binding var settings: FilterSettings

    var body: some View {
        VStack(spacing: 10) {
            row("Remove Reels and Shorts", "No more endless short videos.", "rectangle.stack.badge.minus", $settings.removeShortForm)
            row("Remove Explore", "Searching for people stays.", "safari", $settings.removeExplore)
            row("Hide recommendations", "Only accounts you follow. No autoplay, no endless feeds.", "sparkles", $settings.hideRecommendations)
        }
    }

    private func row(_ title: LocalizedStringKey, _ detail: LocalizedStringKey, _ symbol: String, _ isOn: Binding<Bool>) -> some View {
        Toggle(isOn: isOn) {
            HStack(spacing: 14) {
                Image(systemName: symbol).font(.title3).frame(width: 28).foregroundStyle(Theme.accent).accessibilityHidden(true)
                VStack(alignment: .leading, spacing: 2) {
                    Text(title).font(.body.weight(.semibold)).foregroundStyle(Theme.ink)
                    Text(detail).font(.subheadline).foregroundStyle(Theme.softInk).fixedSize(horizontal: false, vertical: true)
                }
            }
        }
        .tint(Theme.accent)
        .padding(16)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
    }
}

/// Editor compacto del tiempo diario (Configuración).
struct DailyMinutesEditor: View {
    @Binding var minutes: Int

    var body: some View {
        Card {
            HStack {
                Text("Daily time on social media").foregroundStyle(Theme.ink)
                Spacer()
                Stepper(value: $minutes, in: 5...LifeEstimate.minutesRange.upperBound, step: 5) {
                    Text(DurationText.short(minutes: minutes)).monospacedDigit().foregroundStyle(Theme.ink)
                }
                .fixedSize()
            }
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

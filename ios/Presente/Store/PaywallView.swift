import PresenteCore
import StoreKit
import SwiftUI

/// Pantalla 5 y hoja de planes. Dos planes con las mismas funciones; precios y fechas
/// siempre desde StoreKit. Nada se compra sin elegir un plan y tocar el botón de compra.
struct PaywallView: View {
    enum Context { case onboarding, sheet }

    let context: Context
    var done: () -> Void = {}

    @EnvironmentObject private var store: SubscriptionStore
    @State private var selected: Plan?
    var initialSelection: Plan?
    @State private var confirmLifetime = false
    @State private var showManage = false

    // Publica estas páginas antes de enviar a revisión (ver docs/APP-STORE.md y docs/PRIVACY.md).
    static let termsURL = URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!
    static let privacyURL = URL(string: "https://xtudy.mx/presente/privacy/")!

    var body: some View {
        VStack(spacing: 12) {
            if context == .onboarding {
                HStack {
                    Spacer()
                    Button(store.state.unlocksFilters ? LocalizedStringKey("Continue") : LocalizedStringKey("Not now"), action: done)
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(Theme.softInk)
                }
                .padding(.horizontal, Theme.padding)
            }

            ScrollView {
                VStack(alignment: .leading, spacing: 22) {
                    StepTitle(title: "Make space for what matters.", subtitle: "Less scrolling. More living.")

                    if store.state.unlocksFilters {
                        PlanStatusView()
                    } else {
                        features
                        plans
                        disclosure
                    }

                    if let message = store.message {
                        Text(message)
                            .font(.footnote)
                            .foregroundStyle(Theme.softInk)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
                .padding(.horizontal, Theme.padding)
                .padding(.bottom, 12)
            }
            .scrollIndicators(.hidden)

            if !store.state.unlocksFilters {
                VStack(spacing: 10) {
                    summary
                    buyButton
                    footer
                }
                .padding(.horizontal, Theme.padding)
                .padding(.bottom, 8)
            }
        }
        .background(Theme.background.ignoresSafeArea())
        .confirmationDialog("Your monthly plan won't be cancelled automatically",
                            isPresented: $confirmLifetime, titleVisibility: .visible) {
            Button("Buy Lifetime") { Task { await store.purchase(.lifetime) } }
            Button("Manage subscription") { showManage = true }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Apple will keep charging the monthly plan until you cancel it in your Apple Account settings. Presente can't cancel it for you.")
        }
        .manageSubscriptionsSheet(isPresented: $showManage)
        .onAppear { if selected == nil { selected = initialSelection } }
        .onChange(of: store.state) { _, state in
            if state.unlocksFilters, context == .sheet { done() }
        }
    }

    private var features: some View {
        VStack(alignment: .leading, spacing: 8) {
            feature("Instagram, YouTube and more without Reels, Shorts or suggested posts")
            feature("Optional pausing of the original apps, with 5 minutes to post")
            feature("Private by design: no accounts, no ads, nothing leaves your iPhone")
            Text("Both plans include the same features.")
                .font(.footnote)
                .foregroundStyle(Theme.softInk)
        }
    }

    private func feature(_ text: LocalizedStringKey) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 10) {
            Image(systemName: "checkmark").font(.caption.weight(.bold)).foregroundStyle(Theme.accent)
            Text(text).font(.subheadline).foregroundStyle(Theme.ink).fixedSize(horizontal: false, vertical: true)
        }
    }

    @ViewBuilder private var plans: some View {
        let monthly = store.offer(for: .monthly)
        let lifetime = store.offer(for: .lifetime)
        if monthly == nil && lifetime == nil {
            if store.isLoadingProducts {
                ProgressView().frame(maxWidth: .infinity, minHeight: 120)
            } else {
                Button("Try again") { Task { await store.loadProducts() } }
                    .buttonStyle(.secondary)
            }
        } else {
            VStack(spacing: 12) {
                if let monthly {
                    PlanCard(isSelected: selected == .monthly,
                             title: "Monthly",
                             price: Text("\(monthly.displayPrice) / month"),
                             detail: monthlyDetail(monthly),
                             badge: monthly.trialDays != nil ? LocalizedStringKey("\(monthly.trialDays ?? 0) days free") : nil,
                             enabled: store.rules.canPurchase(.monthly)) { selected = .monthly }
                }
                if let lifetime {
                    PlanCard(isSelected: selected == .lifetime,
                             title: "Lifetime",
                             price: Text("\(lifetime.displayPrice) once"),
                             detail: Text("One-time payment. No subscription."),
                             badge: "Pay once",
                             emphasized: true,
                             enabled: store.rules.canPurchase(.lifetime)) { selected = .lifetime }
                }
            }
        }
    }

    private func monthlyDetail(_ monthly: SubscriptionStore.PlanOffer) -> Text {
        if let days = monthly.trialDays {
            return Text("Free for \(days) days, then \(monthly.displayPrice) per month. Cancel anytime.")
        }
        return Text("Renews monthly. Cancel anytime.")
    }

    private var buyButton: some View {
        Button {
            guard let selected else { return }
            if store.rules.needsSubscriptionWarning(before: selected) {
                confirmLifetime = true
            } else {
                Task { await store.purchase(selected) }
            }
        } label: {
            if store.purchasing != nil {
                ProgressView().tint(Theme.background)
            } else {
                Text(buyTitle)
            }
        }
        .buttonStyle(.primary)
        .disabled(selected == nil || store.purchasing != nil || !(selected.map(store.rules.canPurchase) ?? false))
    }

    private var buyTitle: LocalizedStringKey {
        switch selected {
        case .none:
            return "Choose a plan"
        case .monthly?:
            if store.offer(for: .monthly)?.trialDays != nil { return "Start free trial" }
            return "Subscribe for \(store.offer(for: .monthly)?.displayPrice ?? "") per month"
        case .lifetime?:
            return "Buy Lifetime for \(store.offer(for: .lifetime)?.displayPrice ?? "")"
        }
    }

    /// Condiciones de cobro del plan elegido, antes de comprar.
    @ViewBuilder private var disclosure: some View {
        Group {
            switch selected {
            case .monthly?:
                if let monthly = store.offer(for: .monthly) {
                    if let unit = monthly.trialUnit {
                        let charge = TrialTerms.firstChargeDate(start: Date(), unit: unit, value: monthly.trialValue)
                        Text("Free until \(charge.formatted(date: .long, time: .omitted)). Then \(monthly.displayPrice) per month, charged to your Apple Account and renewed automatically until you cancel. Cancel at least 24 hours before the trial ends to avoid being charged. Manage or cancel anytime in Settings › your name › Subscriptions.")
                    } else {
                        Text("\(monthly.displayPrice) per month, charged to your Apple Account when you confirm. Renews automatically unless cancelled at least 24 hours before the end of the period. Manage or cancel anytime in Settings › your name › Subscriptions.")
                    }
                }
            case .lifetime?:
                if let lifetime = store.offer(for: .lifetime) {
                    Text("\(lifetime.displayPrice) one-time payment, charged to your Apple Account when you confirm. No subscription; nothing renews.")
                }
            case .none:
                Text("Choose a plan to see its billing terms.")
            }
        }
        .font(.caption)
        .foregroundStyle(Theme.softInk)
        .fixedSize(horizontal: false, vertical: true)
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    /// Resumen de una línea junto al botón; las condiciones completas están arriba, bajo los planes.
    @ViewBuilder private var summary: some View {
        Group {
            switch selected {
            case .monthly?:
                if let monthly = store.offer(for: .monthly) {
                    if let unit = monthly.trialUnit {
                        let charge = TrialTerms.firstChargeDate(start: Date(), unit: unit, value: monthly.trialValue)
                        Text("Free until \(charge.formatted(date: .abbreviated, time: .omitted)), then \(monthly.displayPrice) per month. Cancel anytime.")
                    } else {
                        Text("\(monthly.displayPrice) per month. Renews automatically. Cancel anytime.")
                    }
                }
            case .lifetime?:
                if let lifetime = store.offer(for: .lifetime) {
                    Text("\(lifetime.displayPrice) once. No subscription.")
                }
            case .none:
                EmptyView()
            }
        }
        .font(.footnote.weight(.medium))
        .foregroundStyle(Theme.ink)
        .multilineTextAlignment(.center)
        .fixedSize(horizontal: false, vertical: true)
    }

    private var footer: some View {
        ViewThatFits(in: .horizontal) {
            HStack(spacing: 14) {
                restoreButton
                Spacer()
                legalLinks
            }
            VStack(spacing: 6) {
                restoreButton
                HStack(spacing: 14) { legalLinks }
            }
        }
        .font(.footnote)
        .foregroundStyle(Theme.softInk)
    }

    private var restoreButton: some View {
        Button("Restore purchases") { Task { await store.restore() } }
            .lineLimit(1)
    }

    @ViewBuilder private var legalLinks: some View {
        Link("Terms", destination: Self.termsURL).lineLimit(1)
        Link("Privacy", destination: Self.privacyURL).lineLimit(1)
    }
}

private struct PlanCard: View {
    let isSelected: Bool
    let title: LocalizedStringKey
    let price: Text
    let detail: Text
    var badge: LocalizedStringKey?
    var emphasized = false
    var enabled = true
    let select: () -> Void

    var body: some View {
        Button(action: select) {
            HStack(alignment: .top, spacing: 14) {
                Image(systemName: isSelected ? "largecircle.fill.circle" : "circle")
                    .font(.title3)
                    .foregroundStyle(isSelected ? Theme.ink : Theme.softInk)
                VStack(alignment: .leading, spacing: 4) {
                    HStack(spacing: 8) {
                        Text(title).font(.headline).foregroundStyle(Theme.ink)
                        if let badge { Tag(text: badge) }
                    }
                    price.font(.title3.weight(.semibold)).foregroundStyle(Theme.ink)
                    detail.font(.footnote).foregroundStyle(Theme.softInk).fixedSize(horizontal: false, vertical: true)
                }
                Spacer(minLength: 0)
            }
            .padding(18)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: Theme.cornerRadius, style: .continuous)
                    .strokeBorder(isSelected ? Theme.ink : (emphasized ? Theme.accent.opacity(0.6) : .clear),
                                  lineWidth: isSelected ? 2 : 1)
            )
        }
        .buttonStyle(.plain)
        .disabled(!enabled)
        .opacity(enabled ? 1 : 0.5)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }
}

/// Estado del plan actual (Configuración y paywall cuando ya hay acceso).
struct PlanStatusView: View {
    @EnvironmentObject private var store: SubscriptionStore
    @State private var showManage = false
    @State private var showPlans = false

    var body: some View {
        Card {
            VStack(alignment: .leading, spacing: 10) {
                status
                if store.state.hasActiveSubscription || store.state == .expired {
                    Button("Manage subscription") { showManage = true }
                        .buttonStyle(.secondary)
                }
                if !store.state.unlocksFilters || store.rules.canPurchase(.lifetime) {
                    Button(store.state.unlocksFilters ? LocalizedStringKey("See Lifetime") : LocalizedStringKey("See plans")) { showPlans = true }
                        .buttonStyle(.secondary)
                }
                Button("Restore purchases") { Task { await store.restore() } }
                    .font(.footnote)
                    .foregroundStyle(Theme.softInk)
                if let message = store.message {
                    Text(message).font(.footnote).foregroundStyle(Theme.softInk)
                }
            }
        }
        .manageSubscriptionsSheet(isPresented: $showManage)
        .sheet(isPresented: $showPlans) { PaywallSheet() }
    }

    @ViewBuilder private var status: some View {
        switch store.state {
        case .lifetime(let stillRenews):
            Label("Lifetime — yours to keep", systemImage: "checkmark.seal").font(.headline)
            if stillRenews {
                Text("Your monthly subscription is still active and will keep renewing. Cancel it if you don't want to be charged again.")
                    .font(.footnote).foregroundStyle(Theme.softInk).fixedSize(horizontal: false, vertical: true)
            }
        case .trial(let expires, let willRenew):
            Label("Free trial", systemImage: "leaf").font(.headline)
            if let expires {
                Group {
                    if willRenew {
                        Text("Your first charge is on \(expires.formatted(date: .long, time: .omitted)).")
                    } else {
                        Text("Your trial ends on \(expires.formatted(date: .long, time: .omitted)). You won't be charged.")
                    }
                }
                .font(.footnote).foregroundStyle(Theme.softInk)
            }
        case .subscribed(let expires, let willRenew):
            Label("Monthly plan", systemImage: "checkmark.seal").font(.headline)
            if let expires {
                Group {
                    if willRenew {
                        Text("Renews on \(expires.formatted(date: .long, time: .omitted)).")
                    } else {
                        Text("Ends on \(expires.formatted(date: .long, time: .omitted)). You won't be charged again.")
                    }
                }
                .font(.footnote).foregroundStyle(Theme.softInk)
            }
        case .inGracePeriod:
            Label("There's a problem with your payment method. Update it to keep access.", systemImage: "exclamationmark.circle")
                .font(.subheadline)
        case .expired:
            Label("Your plan has ended.", systemImage: "clock").font(.headline)
        case .revoked:
            Label("This purchase was refunded.", systemImage: "arrow.uturn.backward").font(.headline)
        case .none, .unknown:
            Label("No plan yet", systemImage: "circle.dashed").font(.headline)
        }
    }
}

/// Hoja con los planes (si alguien sin acceso intenta abrir una red).
struct PaywallSheet: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            PaywallView(context: .sheet) { dismiss() }
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) { Button("Close") { dismiss() } }
                }
        }
    }
}

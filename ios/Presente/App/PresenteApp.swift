import PresenteCore
import SwiftUI

@main
struct PresenteApp: App {
    @StateObject private var model = AppModel()
    @StateObject private var store = SubscriptionStore()
    @StateObject private var screenTime = ScreenTimeController()
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            root
                .environmentObject(model)
                .environmentObject(store)
                .environmentObject(screenTime)
                .tint(Theme.ink)
                .task {
                    screenTime.refresh()
                    #if DEBUG
                    if DemoMode.current != nil { DemoMode.prepare(model: model, store: store); return }
                    #endif
                    await store.start()
                }
                .onChange(of: scenePhase) { _, phase in
                    guard phase == .active else { return }
                    // Si el desbloqueo temporal ya venció (o la extensión no corrió), se restablece aquí.
                    screenTime.refresh()
                    #if DEBUG
                    if DemoMode.current != nil { return }
                    #endif
                    Task { await store.refresh() }
                }
        }
    }

    @ViewBuilder private var root: some View {
        #if DEBUG
        if let demo = DemoMode.current {
            DemoMode.view(for: demo)
        } else {
            RootView()
        }
        #else
        RootView()
        #endif
    }
}

struct RootView: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        Group {
            if model.onboardingCompleted {
                HomeView().transition(.opacity)
            } else {
                OnboardingView().transition(.opacity)
            }
        }
        .animation(.easeInOut(duration: 0.35), value: model.onboardingCompleted)
    }
}

#if DEBUG
/// Capturas de pantalla automáticas (CI): `-PresenteDemo <pantalla>`. No existe en Release.
enum DemoMode: String {
    case onboarding1, onboarding2, onboarding3, onboarding4, onboarding5, onboarding5Selected, home, settings

    static var current: DemoMode? {
        UserDefaults.standard.string(forKey: "PresenteDemo").flatMap(DemoMode.init(rawValue:))
    }

    @MainActor
    static func prepare(model: AppModel, store: SubscriptionStore) {
        model.estimate = LifeEstimate(age: 30, dailyScrollMinutes: 120)
        // Mismos precios que Presente.storekit, con el formato de moneda del dispositivo.
        let format: (Decimal) -> String = { $0.formatted(.currency(code: "MXN")) }
        store.demoOffers = [
            .init(plan: .monthly, displayPrice: format(39), trialDays: 7, trialUnit: .week, trialValue: 1),
            .init(plan: .lifetime, displayPrice: format(499), trialDays: nil, trialUnit: nil, trialValue: 0),
        ]
        if current == .home || current == .settings {
            model.activePlatforms = [.instagram, .youtube, .x]
            store.setDemoState(.subscribed(expires: Date().addingTimeInterval(30 * 86400), willRenew: true))
        }
    }

    @MainActor @ViewBuilder
    static func view(for demo: DemoMode) -> some View {
        switch demo {
        case .onboarding1: OnboardingView(start: .howItWorks)
        case .onboarding2: OnboardingView(start: .dailyTime)
        case .onboarding3: OnboardingView(start: .lifeWeeks)
        case .onboarding4: OnboardingView(start: .recover)
        case .onboarding5: OnboardingView(start: .plans)
        case .onboarding5Selected: PaywallView(context: .onboarding, initialSelection: .monthly)
        case .home: HomeView()
        case .settings: SettingsView()
        }
    }
}
#endif

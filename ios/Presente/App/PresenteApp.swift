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
            RootView()
                .environmentObject(model)
                .environmentObject(store)
                .environmentObject(screenTime)
                .tint(Theme.accent)
                .task { await store.start() }
                .onChange(of: scenePhase) { _, phase in
                    guard phase == .active else { return }
                    // Si el desbloqueo temporal ya venció (o la extensión no corrió), se restablece aquí.
                    screenTime.refresh()
                    Task { await store.refresh() }
                }
        }
    }
}

struct RootView: View {
    @EnvironmentObject private var model: AppModel

    var body: some View {
        Group {
            if model.onboardingCompleted {
                HomeView()
                    .transition(.opacity)
            } else {
                OnboardingView()
                    .transition(.opacity)
            }
        }
        .animation(.easeInOut(duration: 0.35), value: model.onboardingCompleted)
    }
}

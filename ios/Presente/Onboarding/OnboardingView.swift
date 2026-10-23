import PresenteCore
import SwiftUI

/// Cinco pantallas, sin registro ni preguntas extra.
struct OnboardingView: View {
    enum Step: Int, CaseIterable { case howItWorks, dailyTime, lifeWeeks, recover, plans }

    @EnvironmentObject private var model: AppModel
    @State private var step: Step
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    init(start: Step = .howItWorks) {
        _step = State(initialValue: start)
    }

    var body: some View {
        VStack(spacing: 0) {
            header
            Group {
                switch step {
                case .howItWorks:
                    BeforeAfterStep { go(.dailyTime) }
                case .dailyTime:
                    DailyTimeStep(minutes: $model.estimate.dailyScrollMinutes) { go(.lifeWeeks) }
                case .lifeWeeks:
                    LifeWeeksStep(estimate: $model.estimate) { go(.recover) }
                case .recover:
                    RecoverStep(minutesPerDay: model.estimate.dailyScrollMinutes) { go(.plans) }
                case .plans:
                    PaywallView(context: .onboarding) { model.onboardingCompleted = true }
                }
            }
            .frame(maxHeight: .infinity)
            .transition(reduceMotion ? .opacity : .asymmetric(
                insertion: .move(edge: .trailing).combined(with: .opacity),
                removal: .move(edge: .leading).combined(with: .opacity)))
        }
        .background(Theme.background.ignoresSafeArea())
    }

    private var header: some View {
        HStack {
            Button {
                go(Step(rawValue: step.rawValue - 1) ?? .howItWorks)
            } label: {
                Image(systemName: "chevron.left").font(.body.weight(.semibold))
                    .frame(width: 44, height: 44)
            }
            .opacity(step == .howItWorks ? 0 : 1)
            .disabled(step == .howItWorks)
            .accessibilityLabel(Text("Back"))
            Spacer()
            ProgressDots(current: step.rawValue, total: Step.allCases.count)
            Spacer()
            Color.clear.frame(width: 44, height: 44)
        }
        .foregroundStyle(Theme.ink)
        .padding(.horizontal, 12)
    }

    private func go(_ next: Step) {
        withAnimation(reduceMotion ? .none : .spring(response: 0.5, dampingFraction: 0.9)) { step = next }
    }
}

private struct ProgressDots: View {
    let current: Int
    let total: Int

    var body: some View {
        HStack(spacing: 6) {
            ForEach(0..<total, id: \.self) { i in
                Capsule()
                    .fill(i <= current ? Theme.ink : Theme.ink.opacity(0.14))
                    .frame(width: i == current ? 20 : 6, height: 6)
            }
        }
        .animation(.easeInOut(duration: 0.3), value: current)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text("Step \(current + 1) of \(total)"))
    }
}

/// Encabezado común de cada pantalla.
struct StepTitle: View {
    let title: LocalizedStringKey
    var subtitle: LocalizedStringKey?

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(Theme.title())
                .foregroundStyle(Theme.ink)
                .fixedSize(horizontal: false, vertical: true)
            if let subtitle {
                Text(subtitle)
                    .font(.title3)
                    .foregroundStyle(Theme.softInk)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(.isHeader)
    }
}

/// Contenido desplazable + botón fijo abajo.
struct StepScaffold<Content: View>: View {
    let buttonTitle: LocalizedStringKey
    let action: () -> Void
    @ViewBuilder var content: Content

    var body: some View {
        VStack(spacing: 12) {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) { content }
                    .padding(.horizontal, Theme.padding)
                    .padding(.top, 8)
                    .padding(.bottom, 16)
            }
            .scrollIndicators(.hidden)
            Button(buttonTitle, action: action)
                .buttonStyle(.primary)
                .padding(.horizontal, Theme.padding)
                .padding(.bottom, 12)
        }
    }
}

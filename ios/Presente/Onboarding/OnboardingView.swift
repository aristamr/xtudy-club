import PresenteCore
import SwiftUI

/// Cuatro pantallas, sin registro ni preguntas extra.
struct OnboardingView: View {
    enum Step: Int, CaseIterable { case welcome, life, filters, activation }

    @EnvironmentObject private var model: AppModel
    @State private var step: Step = .welcome
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        VStack(spacing: 0) {
            if step != .welcome {
                HStack {
                    Button {
                        go(Step(rawValue: step.rawValue - 1) ?? .welcome)
                    } label: {
                        Image(systemName: "chevron.left").font(.body.weight(.semibold))
                    }
                    .accessibilityLabel(Text("Atrás"))
                    Spacer()
                    ProgressDots(current: step.rawValue, total: Step.allCases.count)
                    Spacer()
                    Color.clear.frame(width: 20, height: 20)
                }
                .padding(.horizontal, Theme.padding)
                .padding(.top, 8)
            }

            Group {
                switch step {
                case .welcome:
                    WelcomeStep { go(.life) }
                case .life:
                    LifeStep(estimate: $model.estimate) { go(.filters) }
                case .filters:
                    FiltersStep(settings: $model.settings) { go(.activation) }
                case .activation:
                    ActivationStep { model.onboardingCompleted = true }
                }
            }
            .transition(reduceMotion ? .opacity : .asymmetric(insertion: .move(edge: .trailing).combined(with: .opacity),
                                                             removal: .opacity))
        }
    }

    private func go(_ next: Step) {
        withAnimation(.easeInOut(duration: 0.3)) { step = next }
    }
}

private struct ProgressDots: View {
    let current: Int
    let total: Int

    var body: some View {
        HStack(spacing: 6) {
            ForEach(0..<total, id: \.self) { i in
                Capsule()
                    .fill(i <= current ? Color.primary : Color.primary.opacity(0.15))
                    .frame(width: i == current ? 18 : 6, height: 6)
            }
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text("Paso \(current + 1) de \(total)"))
    }
}

// MARK: Pantalla 1

private struct WelcomeStep: View {
    let next: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Spacer()
            Image(systemName: "leaf")
                .font(.system(size: 40, weight: .light))
                .foregroundStyle(Theme.accent)
                .accessibilityHidden(true)
            Text("Tu tiempo es tuyo.")
                .font(.system(.largeTitle, design: .default).weight(.bold))
            Text("Usa las redes sin perderte en ellas.")
                .font(.title3)
                .foregroundStyle(.secondary)
            Spacer()
            Button("Comenzar", action: next)
                .buttonStyle(.primary)
        }
        .padding(Theme.padding)
    }
}

// MARK: Pantalla 2

private struct LifeStep: View {
    @Binding var estimate: LifeEstimate
    let next: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            ScrollView {
                LifeWeeksView(estimate: $estimate)
                    .padding(.horizontal, Theme.padding)
                    .padding(.top, 16)
            }
            Button("Continuar", action: next)
                .buttonStyle(.primary)
                .padding(.horizontal, Theme.padding)
                .padding(.bottom, Theme.padding)
        }
    }
}

// MARK: Pantalla 3

private struct FiltersStep: View {
    @Binding var settings: FilterSettings
    let next: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            Text("Quédate con las personas. Elimina el algoritmo.")
                .font(.largeTitle.bold())
                .padding(.top, 24)
            FilterToggles(settings: $settings)
            Spacer()
            Button("Eliminar distracciones", action: next)
                .buttonStyle(.primary)
        }
        .padding(Theme.padding)
    }
}

/// Las tres opciones, reutilizadas en Configuración.
struct FilterToggles: View {
    @Binding var settings: FilterSettings

    var body: some View {
        VStack(spacing: 12) {
            row("Eliminar Reels y Shorts", "Videos cortos infinitos fuera.", "rectangle.stack.badge.minus", $settings.removeShortForm)
            row("Eliminar Explore", "La búsqueda de perfiles se queda.", "safari", $settings.removeExplore)
            row("Ocultar recomendaciones", "Solo cuentas que sigues; sin reproducción automática.", "sparkles", $settings.hideRecommendations)
        }
    }

    private func row(_ title: LocalizedStringKey, _ detail: LocalizedStringKey, _ symbol: String, _ isOn: Binding<Bool>) -> some View {
        Toggle(isOn: isOn) {
            HStack(spacing: 14) {
                Image(systemName: symbol)
                    .font(.title3)
                    .frame(width: 28)
                    .foregroundStyle(Theme.accent)
                    .accessibilityHidden(true)
                VStack(alignment: .leading, spacing: 2) {
                    Text(title).font(.body.weight(.semibold))
                    Text(detail).font(.subheadline).foregroundStyle(.secondary)
                }
            }
        }
        .padding(16)
        .background(Color.primary.opacity(0.05), in: RoundedRectangle(cornerRadius: 16, style: .continuous))
    }
}

// MARK: Pantalla 4

private struct ActivationStep: View {
    let finish: () -> Void
    @EnvironmentObject private var store: SubscriptionStore

    var body: some View {
        VStack(spacing: 16) {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Activa Presente")
                        .font(.largeTitle.bold())
                        .padding(.top, 16)
                    AppBlockingCard()
                    SubscriptionOffer()
                }
                .padding(.horizontal, Theme.padding)
            }
            Button(store.state.unlocksFilters ? LocalizedStringKey("Empezar") : LocalizedStringKey("Ahora no"), action: finish)
                .buttonStyle(store.state.unlocksFilters ? AnyButtonStyle(PrimaryButtonStyle()) : AnyButtonStyle(SecondaryButtonStyle()))
                .padding(.horizontal, Theme.padding)
                .padding(.bottom, Theme.padding)
        }
    }
}

/// Permite alternar estilos de botón sin duplicar la vista.
struct AnyButtonStyle: ButtonStyle {
    private let make: (Configuration) -> AnyView
    init<S: ButtonStyle>(_ style: S) { make = { AnyView(style.makeBody(configuration: $0)) } }
    func makeBody(configuration: Configuration) -> some View { make(configuration) }
}

import PresenteCore
import SwiftUI

/// Pantalla 2: tiempo diario en redes. Valor inicial 2 h; editable minuto a minuto.
struct DailyTimeStep: View {
    @Binding var minutes: Int
    let next: () -> Void

    private let presets = [30, 60, 120, 180, 240, 300]
    private let range = LifeEstimate.minutesRange

    var body: some View {
        StepScaffold(buttonTitle: "Continue", action: next) {
            StepTitle(title: "How much time do you spend on social media every day?")

            VStack(spacing: 18) {
                HStack(spacing: 18) {
                    stepButton("minus", delta: -5)
                    Text(DurationText.short(minutes: minutes))
                        .font(.system(size: 48, weight: .semibold, design: .rounded))
                        .monospacedDigit()
                        .foregroundStyle(Theme.ink)
                        .frame(maxWidth: .infinity)
                        .contentTransition(.numericText())
                        .animation(.snappy, value: minutes)
                    stepButton("plus", delta: 5)
                }
                .accessibilityElement(children: .ignore)
                .accessibilityLabel(Text("Daily time on social media"))
                .accessibilityValue(Text(DurationText.short(minutes: minutes)))
                .accessibilityAdjustableAction { direction in
                    adjust(direction == .increment ? 5 : -5)
                }

                Slider(
                    value: Binding(get: { Double(min(minutes, 360)) }, set: { minutes = Int($0) }),
                    in: 5...360, step: 5
                )
                .accessibilityHidden(true)

                FlowChips(presets: presets, selected: minutes) { minutes = $0 }
            }
            .padding(20)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cornerRadius, style: .continuous))

            Label("Your answer stays on this iPhone.", systemImage: "lock")
                .font(.footnote)
                .foregroundStyle(Theme.softInk)
        }
    }

    private func stepButton(_ symbol: String, delta: Int) -> some View {
        Button { adjust(delta) } label: {
            Image(systemName: symbol)
                .font(.title3.weight(.semibold))
                .frame(width: 48, height: 48)
                .background(Theme.background, in: Circle())
                .foregroundStyle(Theme.ink)
        }
        .buttonRepeatBehavior(.enabled)
    }

    private func adjust(_ delta: Int) {
        minutes = min(range.upperBound, max(5, minutes + delta))
    }
}

/// Atajos de tiempo. El último ("5 h+") permite seguir subiendo con +.
private struct FlowChips: View {
    let presets: [Int]
    let selected: Int
    let choose: (Int) -> Void

    var body: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 84), spacing: 8)], spacing: 8) {
            ForEach(presets, id: \.self) { value in
                let isLast = value == presets.last
                let isOn = isLast ? selected >= value : selected == value
                Button { choose(value) } label: {
                    Text(isLast ? DurationText.atLeast(minutes: value) : DurationText.short(minutes: value))
                        .font(.subheadline.weight(.medium))
                        .frame(maxWidth: .infinity, minHeight: 40)
                        .background(isOn ? Theme.ink : Theme.background, in: Capsule())
                        .foregroundStyle(isOn ? Theme.background : Theme.ink)
                }
                .buttonStyle(.plain)
                .accessibilityAddTraits(isOn ? .isSelected : [])
            }
        }
    }
}

/// Duraciones con el formato del idioma del dispositivo ("2 h 15 min", "2 Std. 15 Min."…).
enum DurationText {
    static func short(minutes: Int) -> String {
        let formatter = DateComponentsFormatter()
        formatter.allowedUnits = minutes >= 60 ? [.hour, .minute] : [.minute]
        formatter.unitsStyle = .short
        formatter.zeroFormattingBehavior = .dropAll
        return formatter.string(from: TimeInterval(minutes * 60)) ?? "\(minutes)"
    }

    static func atLeast(minutes: Int) -> String {
        short(minutes: minutes) + "+"
    }

    static func hours(_ hours: Double) -> String {
        hours.formatted(.number.precision(.fractionLength(0)))
    }
}

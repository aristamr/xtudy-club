import PresenteCore
import SwiftUI

/// Pantalla 4: cuánto tiempo podrías recuperar. Mismos supuestos que la cuadrícula de semanas.
struct RecoverStep: View {
    let minutesPerDay: Int
    let next: () -> Void

    private var projection: TimeProjection { TimeProjection(minutesPerDay: minutesPerDay) }

    var body: some View {
        StepScaffold(buttonTitle: "Take back my time", action: next) {
            StepTitle(title: "Your time is worth more.",
                      subtitle: "At \(DurationText.short(minutes: minutesPerDay)) a day, scrolling adds up to:")

            VStack(spacing: 0) {
                stat("This week", Text("\(Int(projection.hoursPerWeek.rounded())) hours"))
                Divider()
                stat("This year", Text("\(Int(projection.hoursPerYear.rounded())) hours · \(Int(projection.fullDaysPerYear.rounded())) full days"))
                Divider()
                stat("In 10 years", Text("\(Int(projection.fullDaysPerTenYears.rounded())) full days"))
            }
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: Theme.cornerRadius, style: .continuous))

            VStack(alignment: .leading, spacing: 12) {
                Text("If you took back just half, one year could hold:")
                    .font(.headline)
                    .foregroundStyle(Theme.ink)
                LazyVGrid(columns: [GridItem(.flexible(), spacing: 10), GridItem(.flexible(), spacing: 10)], spacing: 10) {
                    activity(.book, "book", "books read")
                    activity(.workout, "figure.walk", "workouts")
                    activity(.languageLesson, "character.bubble", "language lessons")
                    activity(.afternoonTogether, "person.3", "afternoons with family and friends")
                    activity(.nightOfRest, "moon", "full nights of rest")
                }
            }

            Text("Estimates based on your answer. A book ≈ 6 h, a workout 45 min, a lesson 30 min, an afternoon 3 h, a night of rest 8 h. Presente helps you scroll less; it can't promise how much time you'll get back.")
                .font(.caption)
                .foregroundStyle(Theme.softInk)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private func stat(_ title: LocalizedStringKey, _ value: Text) -> some View {
        HStack(alignment: .firstTextBaseline) {
            Text(title).foregroundStyle(Theme.softInk)
            Spacer(minLength: 12)
            value
                .font(.headline)
                .foregroundStyle(Theme.ink)
                .multilineTextAlignment(.trailing)
                .monospacedDigit()
        }
        .padding(16)
        .accessibilityElement(children: .combine)
    }

    private func activity(_ kind: TimeProjection.Activity, _ symbol: String, _ label: LocalizedStringKey) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Image(systemName: symbol).foregroundStyle(Theme.accent)
            Text(projection.yearlyCount(of: kind).formatted())
                .font(.title2.weight(.semibold))
                .monospacedDigit()
                .foregroundStyle(Theme.ink)
            Text(label)
                .font(.footnote)
                .foregroundStyle(Theme.softInk)
                .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, minHeight: 104, alignment: .topLeading)
        .padding(14)
        .background(Theme.surface, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
        .accessibilityElement(children: .combine)
    }
}

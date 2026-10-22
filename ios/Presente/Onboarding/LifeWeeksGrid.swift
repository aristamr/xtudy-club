import PresenteCore
import SwiftUI

/// Cuadrícula de la vida en semanas: 52 columnas (semanas) × horizonte en filas (años).
/// Se dibuja con Canvas porque son miles de cuadros.
struct LifeWeeksGrid: View {
    let breakdown: LifeWeeksBreakdown
    let columns = LifeWeeksBreakdown.weeksPerYear

    private var rows: Int { max(1, Int(ceil(Double(breakdown.total) / Double(columns)))) }

    var body: some View {
        GeometryReader { geo in
            let rows = self.rows
            let cell = geo.size.width / CGFloat(columns)
            let gap = max(0.6, cell * 0.18)
            let width = cell * CGFloat(columns)
            Canvas { context, _ in
                for index in 0..<breakdown.total {
                    let x = CGFloat(index % columns) * cell
                    let y = CGFloat(index / columns) * cell
                    let rect = CGRect(x: x, y: y, width: cell - gap, height: cell - gap)
                    context.fill(Path(roundedRect: rect, cornerRadius: cell * 0.2), with: .color(color(for: breakdown.kind(at: index))))
                }
            }
            .frame(width: width, height: cell * CGFloat(rows))
        }
        // El alto se deriva del ancho: dentro de un ScrollView no hay alto propuesto.
        .aspectRatio(CGFloat(columns) / CGFloat(rows), contentMode: .fit)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text("Tu vida en semanas"))
        .accessibilityValue(Text("\(breakdown.lived) semanas vividas, \(breakdown.free) libres, \(breakdown.scroll) equivalentes de scroll y \(breakdown.sleep) de sueño."))
    }

    private func color(for kind: LifeWeeksBreakdown.Kind) -> Color {
        switch kind {
        case .lived: return Theme.lived
        case .free: return Theme.free
        case .scroll: return Theme.scroll
        case .sleep: return Theme.sleep
        }
    }
}

struct LifeWeeksLegend: View {
    let breakdown: LifeWeeksBreakdown

    var body: some View {
        Grid(alignment: .leading, horizontalSpacing: 16, verticalSpacing: 6) {
            GridRow {
                item(Theme.lived, "Vivido", breakdown.lived)
                item(Theme.free, "Libre", breakdown.free)
            }
            GridRow {
                item(Theme.scroll, "Scroll", breakdown.scroll)
                item(Theme.sleep, "Sueño", breakdown.sleep)
            }
        }
        .font(.footnote)
    }

    private func item(_ color: Color, _ title: LocalizedStringKey, _ weeks: Int) -> some View {
        HStack(spacing: 6) {
            RoundedRectangle(cornerRadius: 2).fill(color).frame(width: 10, height: 10)
            Text(title)
            Text("\(weeks) sem.").foregroundStyle(.secondary).monospacedDigit()
        }
        .accessibilityElement(children: .combine)
    }
}

/// Pantalla 2 del onboarding (también accesible desde Configuración).
struct LifeWeeksView: View {
    @Binding var estimate: LifeEstimate
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        let breakdown = LifeWeeksBreakdown(estimate)
        let years = ScrollProjection.projectionYears(for: estimate)
        let days = ScrollProjection.fullDays(minutesPerDay: estimate.normalized.dailyScrollMinutes, years: Double(years))

        VStack(alignment: .leading, spacing: 16) {
            Text("Tu vida en semanas")
                .font(.largeTitle.bold())
            Text("Cada cuadro es una semana de una vida de \(estimate.horizonYears) años.")
                .foregroundStyle(.secondary)

            LifeWeeksGrid(breakdown: breakdown)
                .frame(maxWidth: 420)
                .frame(maxWidth: .infinity)
                .animation(reduceMotion ? nil : .easeInOut(duration: 0.4), value: breakdown)

            LifeWeeksLegend(breakdown: breakdown)

            Text(projectionSentence(minutes: estimate.normalized.dailyScrollMinutes, days: days, years: years))
                .font(.title3.weight(.semibold))
                .fixedSize(horizontal: false, vertical: true)

            VStack(spacing: 10) {
                Stepper(value: $estimate.age, in: LifeEstimate.ageRange) {
                    LabeledContent("Tu edad", value: "\(estimate.age)")
                }
                VStack(alignment: .leading, spacing: 4) {
                    LabeledContent("Scroll al día (estimado)") {
                        Text(minutesLabel(estimate.dailyScrollMinutes)).monospacedDigit()
                    }
                    Slider(
                        value: Binding(
                            get: { Double(estimate.dailyScrollMinutes) },
                            set: { estimate.dailyScrollMinutes = Int($0) }
                        ),
                        in: Double(LifeEstimate.minutesRange.lowerBound)...Double(LifeEstimate.minutesRange.upperBound),
                        step: 15
                    )
                    .accessibilityLabel(Text("Minutos de scroll al día"))
                    .accessibilityValue(Text(minutesLabel(estimate.dailyScrollMinutes)))
                }
            }

            Text("Es una estimación con tus respuestas, no una medición. Supone 8 horas de sueño. Los cuadros muestran tiempo equivalente, no semanas concretas.")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }

    private func projectionSentence(minutes: Int, days: Int, years: Int) -> LocalizedStringKey {
        "Si sigues dedicando \(minutes) minutos diarios al scroll, equivalen a \(days) días completos durante los próximos \(years) años."
    }

    private func minutesLabel(_ minutes: Int) -> String {
        let h = minutes / 60, m = minutes % 60
        if h == 0 { return String(localized: "\(m) min") }
        if m == 0 { return String(localized: "\(h) h") }
        return String(localized: "\(h) h \(m) min")
    }
}

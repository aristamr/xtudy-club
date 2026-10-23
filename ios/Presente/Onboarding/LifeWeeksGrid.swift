import PresenteCore
import SwiftUI

/// Cuadrícula de la vida en semanas: 52 columnas × horizonte en filas. Canvas porque son miles de cuadros.
/// `progress` (0…1) revela los cuadros en orden: vivido → sueño → scroll → libre.
struct LifeWeeksGrid: View {
    let breakdown: LifeWeeksBreakdown
    var progress: Double = 1
    let columns = LifeWeeksBreakdown.weeksPerYear

    private var rows: Int { max(1, Int(ceil(Double(breakdown.total) / Double(columns)))) }

    var body: some View {
        GeometryReader { geo in
            let rows = self.rows
            let cell = geo.size.width / CGFloat(columns)
            let gap = max(0.6, cell * 0.2)
            let shown = Int((Double(breakdown.total) * progress).rounded(.up))
            Canvas { context, _ in
                for index in 0..<breakdown.total {
                    let x = CGFloat(index % columns) * cell
                    let y = CGFloat(index / columns) * cell
                    let rect = CGRect(x: x, y: y, width: cell - gap, height: cell - gap)
                    let color = index < shown ? color(for: breakdown.kind(at: index)) : Theme.ink.opacity(0.06)
                    context.fill(Path(roundedRect: rect, cornerRadius: cell * 0.22), with: .color(color))
                }
            }
            .frame(width: cell * CGFloat(columns), height: cell * CGFloat(rows))
        }
        .aspectRatio(CGFloat(columns) / CGFloat(rows), contentMode: .fit)
        .environment(\.layoutDirection, .leftToRight)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text("Your life in weeks"))
        .accessibilityValue(Text("\(breakdown.lived) weeks lived, \(breakdown.sleep) equivalent to sleep, \(breakdown.scroll) equivalent to scrolling and \(breakdown.free) left for everything else."))
    }

    private func color(for kind: LifeWeeksBreakdown.Kind) -> Color {
        switch kind {
        case .lived: return Theme.lived
        case .sleep: return Theme.sleep
        case .scroll: return Theme.scroll
        case .free: return Theme.free
        }
    }
}

struct LifeWeeksLegend: View {
    let breakdown: LifeWeeksBreakdown

    var body: some View {
        Grid(alignment: .leading, horizontalSpacing: 16, verticalSpacing: 8) {
            GridRow {
                item(Theme.lived, "Lived", breakdown.lived)
                item(Theme.sleep, "Sleep", breakdown.sleep)
            }
            GridRow {
                item(Theme.scroll, "Scrolling", breakdown.scroll)
                item(Theme.free, "Everything else", breakdown.free)
            }
        }
        .font(.footnote)
    }

    private func item(_ color: Color, _ title: LocalizedStringKey, _ weeks: Int) -> some View {
        HStack(spacing: 6) {
            RoundedRectangle(cornerRadius: 3).fill(color).frame(width: 11, height: 11)
            VStack(alignment: .leading, spacing: 0) {
                Text(title).foregroundStyle(Theme.ink)
                Text("\(weeks) weeks").foregroundStyle(Theme.softInk).monospacedDigit()
            }
        }
        .accessibilityElement(children: .combine)
    }
}

/// Pantalla 3 del onboarding.
struct LifeWeeksStep: View {
    @Binding var estimate: LifeEstimate
    let next: () -> Void

    var body: some View {
        StepScaffold(buttonTitle: "Continue", action: next) {
            LifeWeeksContent(estimate: $estimate)
        }
    }
}

/// Contenido reutilizable (también desde Configuración).
struct LifeWeeksContent: View {
    @Binding var estimate: LifeEstimate
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var start = Date()
    @State private var finished = false
    private let duration: TimeInterval = 2.6

    var body: some View {
        let breakdown = LifeWeeksBreakdown(estimate)
        VStack(alignment: .leading, spacing: 20) {
            StepTitle(title: "Your life in weeks",
                      subtitle: "Each square is one week of a 90-year life.")

            HStack {
                Text("Your age").foregroundStyle(Theme.ink)
                Spacer()
                Stepper(value: $estimate.age, in: LifeEstimate.ageRange) {
                    Text("\(estimate.age)")
                        .font(.title3.weight(.semibold))
                        .monospacedDigit()
                        .foregroundStyle(Theme.ink)
                }
                .fixedSize()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(Theme.surface, in: RoundedRectangle(cornerRadius: 16, style: .continuous))

            // Se anima una vez y luego se detiene (no redibuja a 60 fps sin motivo).
            TimelineView(.animation(paused: reduceMotion || finished)) { context in
                let elapsed = context.date.timeIntervalSince(start)
                let t = (reduceMotion || finished) ? 1 : min(1, elapsed / duration)
                LifeWeeksGrid(breakdown: breakdown, progress: easeInOut(t))
            }
            .frame(maxWidth: 440)
            .frame(maxWidth: .infinity)

            LifeWeeksLegend(breakdown: breakdown)

            Text("Ninety years is an illustration, not a prediction. Assumes 8 hours of sleep. Squares show equivalent time, not specific weeks.")
                .font(.caption)
                .foregroundStyle(Theme.softInk)
                .fixedSize(horizontal: false, vertical: true)
        }
        .onAppear { start = Date() }
        .task {
            try? await Task.sleep(nanoseconds: UInt64((duration + 0.2) * 1_000_000_000))
            finished = true
        }
    }

    private func easeInOut(_ t: Double) -> Double { t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2 }
}

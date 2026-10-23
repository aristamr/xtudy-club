import Foundation

/// Proyección del tiempo de scroll declarado por la persona (pantallas 2–4 del onboarding).
/// Usa el mismo año promedio (365.25 días) que `ScrollProjection` para que todas las pantallas cuadren.
public struct TimeProjection: Equatable, Sendable {
    public static let daysPerYear = 365.25

    public let minutesPerDay: Int

    public init(minutesPerDay: Int) {
        self.minutesPerDay = max(0, minutesPerDay)
    }

    public var minutesPerWeek: Double { Double(minutesPerDay) * 7 }
    public var minutesPerYear: Double { Double(minutesPerDay) * Self.daysPerYear }
    public var minutesPerTenYears: Double { minutesPerYear * 10 }

    public var hoursPerWeek: Double { minutesPerWeek / 60 }
    public var hoursPerYear: Double { minutesPerYear / 60 }
    /// Días completos de 24 horas.
    public var fullDaysPerYear: Double { minutesPerYear / 1440 }
    public var fullDaysPerTenYears: Double { minutesPerTenYears / 1440 }

    /// Parte del tiempo que se ilustra como "recuperable". No prometemos el 100 %.
    public static let illustrativeShare = 0.5

    /// Cuántas veces cabe una actividad en la parte recuperable de un año.
    public func yearlyCount(of activity: Activity, share: Double = TimeProjection.illustrativeShare) -> Int {
        Int((minutesPerYear * share / activity.minutes).rounded(.down))
    }

    /// Actividades de ejemplo con su supuesto de duración (se muestran en pantalla).
    public enum Activity: String, CaseIterable, Sendable {
        /// Un libro de ~250 páginas a ~40 páginas por hora ≈ 6 h.
        case book
        /// Sesión de ejercicio de 45 min.
        case workout
        /// Lección de idioma de 30 min.
        case languageLesson
        /// Noche completa de descanso: 8 h.
        case nightOfRest
        /// Tarde con familia o amigos: 3 h.
        case afternoonTogether

        public var minutes: Double {
            switch self {
            case .book: return 360
            case .workout: return 45
            case .languageLesson: return 30
            case .nightOfRest: return 480
            case .afternoonTogether: return 180
            }
        }
    }
}

import Foundation

/// Estimación que la persona escribe en el onboarding. No es una medición.
public struct LifeEstimate: Codable, Equatable, Sendable {
    public static let ageRange = 10...89
    public static let minutesRange = 0...600
    public static let horizonRange = 60...110

    public var age: Int
    public var dailyScrollMinutes: Int
    /// Horizonte visual (90 años por defecto). No es una predicción de esperanza de vida.
    public var horizonYears: Int
    /// Horas de sueño por día usadas para el cálculo.
    public var sleepHoursPerDay: Double

    public init(age: Int = 30, dailyScrollMinutes: Int = 120, horizonYears: Int = 90, sleepHoursPerDay: Double = 8) {
        self.age = age
        self.dailyScrollMinutes = dailyScrollMinutes
        self.horizonYears = horizonYears
        self.sleepHoursPerDay = sleepHoursPerDay
    }

    /// Valores dentro de rangos válidos; el scroll nunca supera las horas despierto.
    public var normalized: LifeEstimate {
        var e = self
        e.horizonYears = min(max(e.horizonYears, Self.horizonRange.lowerBound), Self.horizonRange.upperBound)
        e.age = min(max(e.age, 0), e.horizonYears)
        e.sleepHoursPerDay = min(max(e.sleepHoursPerDay, 0), 24)
        let awakeMinutes = Int(((24 - e.sleepHoursPerDay) * 60).rounded(.down))
        e.dailyScrollMinutes = min(max(e.dailyScrollMinutes, 0), awakeMinutes)
        return e
    }
}

/// Reparto de las semanas del horizonte en categorías que no se traslapan.
///
/// Cada cuadro es una semana. Las semanas futuras se reparten de forma proporcional:
/// `sueño = futuro × horas de sueño / 24`, `scroll = futuro × minutos / 1440` y el resto
/// queda libre. Son equivalencias de tiempo agregado, no semanas concretas del calendario,
/// y la suma siempre es exactamente `total`.
public struct LifeWeeksBreakdown: Equatable, Sendable {
    public static let weeksPerYear = 52

    public let total: Int
    public let lived: Int
    public let sleep: Int
    public let scroll: Int
    public let free: Int

    public var future: Int { total - lived }

    public init(_ estimate: LifeEstimate) {
        let e = estimate.normalized
        total = e.horizonYears * Self.weeksPerYear
        lived = min(e.age * Self.weeksPerYear, total)
        let future = total - lived
        let sleepWeeks = Int((Double(future) * e.sleepHoursPerDay / 24).rounded())
        let scrollWeeks = Int((Double(future) * Double(e.dailyScrollMinutes) / 1440).rounded())
        sleep = min(sleepWeeks, future)
        scroll = min(scrollWeeks, future - sleep)
        free = future - sleep - scroll
    }

    public enum Kind: Equatable, Sendable { case lived, free, scroll, sleep }

    /// Categoría del cuadro `index` (0 = primera semana). Orden: vivido, libre, scroll, sueño.
    public func kind(at index: Int) -> Kind {
        if index < lived { return .lived }
        if index < lived + free { return .free }
        if index < lived + free + scroll { return .scroll }
        return .sleep
    }
}

public enum ScrollProjection {
    /// Días completos (24 h) equivalentes a `minutesPerDay` durante `years` años.
    public static func fullDays(minutesPerDay: Int, years: Double) -> Int {
        let minutes = Double(max(minutesPerDay, 0)) * 365.25 * max(years, 0)
        return Int((minutes / 1440).rounded())
    }

    /// Años a proyectar: 10, o lo que quede del horizonte si es menos.
    public static func projectionYears(for estimate: LifeEstimate, preferred: Int = 10) -> Int {
        let e = estimate.normalized
        return max(0, min(preferred, e.horizonYears - e.age))
    }
}

import XCTest
@testable import PresenteCore

final class LifeWeeksTests: XCTestCase {
    func testCategoriesAlwaysSumToTotal() {
        for age in stride(from: 0, through: 95, by: 5) {
            for minutes in stride(from: 0, through: 1440, by: 37) {
                let b = LifeWeeksBreakdown(LifeEstimate(age: age, dailyScrollMinutes: minutes))
                XCTAssertEqual(b.lived + b.free + b.scroll + b.sleep, b.total, "age \(age) min \(minutes)")
                XCTAssertGreaterThanOrEqual(b.free, 0)
                XCTAssertGreaterThanOrEqual(b.scroll, 0)
            }
        }
    }

    func testTypicalEstimate() {
        let b = LifeWeeksBreakdown(LifeEstimate(age: 30, dailyScrollMinutes: 120))
        XCTAssertEqual(b.total, 4680)
        XCTAssertEqual(b.lived, 1560)
        XCTAssertEqual(b.future, 3120)
        XCTAssertEqual(b.sleep, 1040)          // 3120 × 8/24
        XCTAssertEqual(b.scroll, 260)          // 3120 × 120/1440
        XCTAssertEqual(b.free, 1820)
    }

    func testScrollCannotExceedAwakeTime() {
        let e = LifeEstimate(age: 20, dailyScrollMinutes: 2000).normalized
        XCTAssertEqual(e.dailyScrollMinutes, 960)
        let b = LifeWeeksBreakdown(e)
        XCTAssertEqual(b.free, 0)
    }

    func testAgeBeyondHorizon() {
        let b = LifeWeeksBreakdown(LifeEstimate(age: 120, dailyScrollMinutes: 60))
        XCTAssertEqual(b.lived, b.total)
        XCTAssertEqual(b.future, 0)
    }

    func testKindOrdering() {
        let b = LifeWeeksBreakdown(LifeEstimate(age: 30, dailyScrollMinutes: 120))
        XCTAssertEqual(b.kind(at: 0), .lived)
        XCTAssertEqual(b.kind(at: b.lived), .sleep)
        XCTAssertEqual(b.kind(at: b.lived + b.sleep), .scroll)
        XCTAssertEqual(b.kind(at: b.lived + b.sleep + b.scroll), .free)
        XCTAssertEqual(b.kind(at: b.total - 1), .free)
    }

    func testTenYearProjection() {
        // 120 min/día × 3652.5 días = 438,300 min = 304.4 días
        XCTAssertEqual(ScrollProjection.fullDays(minutesPerDay: 120, years: 10), 304)
        XCTAssertEqual(ScrollProjection.fullDays(minutesPerDay: 0, years: 10), 0)
        XCTAssertEqual(ScrollProjection.projectionYears(for: LifeEstimate(age: 85)), 5)
        XCTAssertEqual(ScrollProjection.projectionYears(for: LifeEstimate(age: 30)), 10)
    }
}

final class TimeProjectionTests: XCTestCase {
    func testTwoHoursADay() {
        let p = TimeProjection(minutesPerDay: 120)
        XCTAssertEqual(p.hoursPerWeek, 14)
        XCTAssertEqual(p.hoursPerYear, 730.5, accuracy: 0.001)
        XCTAssertEqual(p.fullDaysPerYear, 30.4375, accuracy: 0.0001)
        XCTAssertEqual(p.fullDaysPerTenYears, 304.375, accuracy: 0.001)
        // Coincide con la frase de la cuadrícula de semanas.
        XCTAssertEqual(Int(p.fullDaysPerTenYears.rounded()), ScrollProjection.fullDays(minutesPerDay: 120, years: 10))
    }

    func testIllustrativeHalfShare() {
        let p = TimeProjection(minutesPerDay: 120)
        // 730.5 h / 2 = 365.25 h al año
        XCTAssertEqual(p.yearlyCount(of: .book), 60)            // 365.25 / 6
        XCTAssertEqual(p.yearlyCount(of: .workout), 487)        // 21915 / 45
        XCTAssertEqual(p.yearlyCount(of: .languageLesson), 730) // 21915 / 30
        XCTAssertEqual(p.yearlyCount(of: .nightOfRest), 45)     // 21915 / 480
        XCTAssertEqual(p.yearlyCount(of: .afternoonTogether), 121)
    }

    func testZeroAndNegative() {
        XCTAssertEqual(TimeProjection(minutesPerDay: -5).minutesPerDay, 0)
        XCTAssertEqual(TimeProjection(minutesPerDay: 0).yearlyCount(of: .book), 0)
    }
}

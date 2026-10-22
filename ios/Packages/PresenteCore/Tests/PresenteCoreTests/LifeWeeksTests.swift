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
        XCTAssertEqual(b.kind(at: b.lived), .free)
        XCTAssertEqual(b.kind(at: b.lived + b.free), .scroll)
        XCTAssertEqual(b.kind(at: b.total - 1), .sleep)
    }

    func testTenYearProjection() {
        // 120 min/día × 3652.5 días = 438,300 min = 304.4 días
        XCTAssertEqual(ScrollProjection.fullDays(minutesPerDay: 120, years: 10), 304)
        XCTAssertEqual(ScrollProjection.fullDays(minutesPerDay: 0, years: 10), 0)
        XCTAssertEqual(ScrollProjection.projectionYears(for: LifeEstimate(age: 85)), 5)
        XCTAssertEqual(ScrollProjection.projectionYears(for: LifeEstimate(age: 30)), 10)
    }
}

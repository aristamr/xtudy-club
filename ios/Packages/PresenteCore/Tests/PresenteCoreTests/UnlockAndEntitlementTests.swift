import XCTest
@testable import PresenteCore

final class UnlockWindowTests: XCTestCase {
    func testFiveMinuteUnlockMeetsDeviceActivityMinimum() {
        let now = Date(timeIntervalSince1970: 1_800_000_000)
        let w = UnlockWindow(now: now)
        XCTAssertEqual(w.end, now.addingTimeInterval(300))
        XCTAssertEqual(w.monitoringInterval, 16 * 60)
        XCTAssertLessThan(w.scheduleStart, now)
        XCTAssertTrue(w.isActive(at: now))
        XCTAssertFalse(w.isActive(at: now.addingTimeInterval(301)))
        XCTAssertEqual(w.remaining(at: now.addingTimeInterval(60)), 240)
    }

    func testLongUnlockStartsNow() {
        let now = Date()
        let w = UnlockWindow(now: now, duration: 30 * 60)
        XCTAssertEqual(w.scheduleStart.timeIntervalSince1970, now.timeIntervalSince1970, accuracy: 0.001)
    }

    func testComponentsIncludeDaySoMidnightIsSafe() {
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone(identifier: "America/Mexico_City")!
        let now = cal.date(from: DateComponents(year: 2026, month: 3, day: 10, hour: 0, minute: 2))!
        let w = UnlockWindow(now: now)
        let start = UnlockWindow.components(w.scheduleStart, calendar: cal)
        let end = UnlockWindow.components(w.end, calendar: cal)
        XCTAssertEqual(start.day, 9)
        XCTAssertEqual(start.hour, 23)
        XCTAssertEqual(start.minute, 51)
        XCTAssertEqual(end.day, 10)
        XCTAssertEqual(end.minute, 7)
    }
}

final class EntitlementTests: XCTestCase {
    let id = "mx.xtudy.presente.monthly"
    let now = Date(timeIntervalSince1970: 1_800_000_000)

    func testNoTransactions() {
        XCTAssertEqual(EntitlementEvaluator.evaluate(productID: id, transactions: [], now: now), .none)
    }

    func testActive() {
        let t = EntitlementEvaluator.TransactionFacts(productID: id, expirationDate: now + 1000, revocationDate: nil)
        let s = EntitlementEvaluator.evaluate(productID: id, transactions: [t], willRenew: false, now: now)
        XCTAssertEqual(s, .active(expires: now + 1000, willRenew: false))
        XCTAssertTrue(s.unlocksFilters)
    }

    func testExpiredAndGrace() {
        let t = EntitlementEvaluator.TransactionFacts(productID: id, expirationDate: now - 1, revocationDate: nil)
        XCTAssertEqual(EntitlementEvaluator.evaluate(productID: id, transactions: [t], now: now), .expired)
        XCTAssertTrue(EntitlementEvaluator.evaluate(productID: id, transactions: [t], inGracePeriod: true, now: now).unlocksFilters)
    }

    func testRevokedAndOtherProducts() {
        let revoked = EntitlementEvaluator.TransactionFacts(productID: id, expirationDate: now + 1000, revocationDate: now - 10)
        XCTAssertEqual(EntitlementEvaluator.evaluate(productID: id, transactions: [revoked], now: now), .revoked)
        let other = EntitlementEvaluator.TransactionFacts(productID: "other", expirationDate: now + 1000, revocationDate: nil)
        XCTAssertEqual(EntitlementEvaluator.evaluate(productID: id, transactions: [other], now: now), .none)
    }
}

final class SavedChannelTests: XCTestCase {
    func testParsesHandles() {
        XCTAssertEqual(SavedChannel.from(url: URL(string: "https://m.youtube.com/@veritasium/videos"))?.handle, "@veritasium")
        XCTAssertEqual(SavedChannel.from(url: URL(string: "https://www.youtube.com/@a.b_c-d"))?.handle, "@a.b_c-d")
        XCTAssertNil(SavedChannel.from(url: URL(string: "https://m.youtube.com/watch?v=1")))
        XCTAssertNil(SavedChannel.from(url: URL(string: "https://example.com/@x")))
    }

    func testListDeduplicatesAndSorts() {
        var list = SavedChannelList()
        list.add(SavedChannel(handle: "@zeta"))
        list.add(SavedChannel(handle: "@Alpha"))
        list.add(SavedChannel(handle: "@alpha"))
        XCTAssertEqual(list.channels.map(\.handle), ["@Alpha", "@zeta"])
        list.remove(SavedChannel(handle: "@ALPHA"))
        XCTAssertEqual(list.channels.map(\.handle), ["@zeta"])
    }
}

final class RedirectLoopGuardTests: XCTestCase {
    func testStopsAfterThreeRedirectsInTenSeconds() {
        var guardrail = RedirectLoopGuard()
        let t0 = Date(timeIntervalSince1970: 1_000)
        XCTAssertTrue(guardrail.allow(rule: "home", now: t0))
        XCTAssertTrue(guardrail.allow(rule: "home", now: t0 + 1))
        XCTAssertTrue(guardrail.allow(rule: "home", now: t0 + 2))
        XCTAssertFalse(guardrail.allow(rule: "home", now: t0 + 3))
        XCTAssertTrue(guardrail.allow(rule: "reels", now: t0 + 3), "cada regla cuenta por separado")
        XCTAssertTrue(guardrail.allow(rule: "home", now: t0 + 12), "la ventana se libera")
    }
}

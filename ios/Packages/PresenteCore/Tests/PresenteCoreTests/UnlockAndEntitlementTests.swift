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
    let sub = "mx.xtudy.presente.monthly"
    let life = "mx.xtudy.presente.lifetime"
    let now = Date(timeIntervalSince1970: 1_800_000_000)
    typealias T = EntitlementEvaluator.TransactionFacts

    func eval(_ t: [T], grace: Bool = false, renew: Bool = true) -> EntitlementState {
        EntitlementEvaluator.evaluate(subscriptionID: sub, lifetimeID: life, transactions: t,
                                      inGracePeriod: grace, willRenew: renew, now: now)
    }

    func testNoTransactions() {
        XCTAssertEqual(eval([]), .none)
        XCTAssertFalse(eval([]).unlocksFilters)
    }

    func testTrialThenPaid() {
        let trial = T(productID: sub, expirationDate: now + 7 * 86400, revocationDate: nil, isIntroOffer: true)
        XCTAssertEqual(eval([trial]), .trial(expires: now + 7 * 86400, willRenew: true))
        XCTAssertTrue(eval([trial]).unlocksFilters)
        let paid = T(productID: sub, expirationDate: now + 30 * 86400, revocationDate: nil)
        XCTAssertEqual(eval([paid], renew: false), .subscribed(expires: now + 30 * 86400, willRenew: false))
    }

    func testExpiredAndGrace() {
        let t = T(productID: sub, expirationDate: now - 1, revocationDate: nil)
        XCTAssertEqual(eval([t]), .expired)
        XCTAssertTrue(eval([t], grace: true).unlocksFilters)
    }

    func testRevokedAndOtherProducts() {
        XCTAssertEqual(eval([T(productID: sub, expirationDate: now + 1000, revocationDate: now - 10)]), .revoked)
        XCTAssertEqual(eval([T(productID: "other", expirationDate: now + 1000, revocationDate: nil)]), .none)
    }

    func testLifetimeWinsAndSurvivesSubscriptionEnd() {
        let lifetime = T(productID: life, expirationDate: nil, revocationDate: nil)
        let expiredSub = T(productID: sub, expirationDate: now - 1, revocationDate: nil)
        XCTAssertEqual(eval([lifetime]), .lifetime(subscriptionStillRenews: false))
        XCTAssertEqual(eval([lifetime, expiredSub]), .lifetime(subscriptionStillRenews: false))
        let activeSub = T(productID: sub, expirationDate: now + 1000, revocationDate: nil)
        XCTAssertEqual(eval([activeSub, lifetime]), .lifetime(subscriptionStillRenews: true))
        XCTAssertEqual(eval([activeSub, lifetime], renew: false), .lifetime(subscriptionStillRenews: false))
    }

    func testRefundedLifetime() {
        let refunded = T(productID: life, expirationDate: nil, revocationDate: now - 5)
        XCTAssertEqual(eval([refunded]), .revoked)
        XCTAssertFalse(eval([refunded]).unlocksFilters)
        let activeSub = T(productID: sub, expirationDate: now + 1000, revocationDate: nil)
        XCTAssertTrue(eval([refunded, activeSub]).unlocksFilters, "la suscripción sigue valiendo")
    }

    func testPurchaseRulesPreventDuplicates() {
        let none = PurchaseRules(state: .none)
        XCTAssertTrue(none.canPurchase(.monthly))
        XCTAssertTrue(none.canPurchase(.lifetime))
        XCTAssertFalse(none.needsSubscriptionWarning(before: .lifetime))

        let subscribed = PurchaseRules(state: .subscribed(expires: nil, willRenew: true))
        XCTAssertFalse(subscribed.canPurchase(.monthly))
        XCTAssertTrue(subscribed.canPurchase(.lifetime))
        XCTAssertTrue(subscribed.needsSubscriptionWarning(before: .lifetime))

        let lifetime = PurchaseRules(state: .lifetime(subscriptionStillRenews: false))
        XCTAssertFalse(lifetime.canPurchase(.monthly))
        XCTAssertFalse(lifetime.canPurchase(.lifetime))

        let expired = PurchaseRules(state: .expired)
        XCTAssertTrue(expired.canPurchase(.monthly))
    }

    func testTrialChargeDate() {
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone(identifier: "America/Mexico_City")!
        let start = cal.date(from: DateComponents(year: 2026, month: 12, day: 28, hour: 10))!
        let charge = TrialTerms.firstChargeDate(start: start, unit: .week, value: 1, calendar: cal)
        XCTAssertEqual(cal.dateComponents([.year, .month, .day], from: charge), DateComponents(year: 2027, month: 1, day: 4))
        XCTAssertEqual(TrialTerms.days(unit: .week, value: 1), 7)
        XCTAssertEqual(TrialTerms.days(unit: .day, value: 7), 7)
        XCTAssertNil(TrialTerms.days(unit: .month, value: 1))
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

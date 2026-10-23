import StoreKitTest
import XCTest
@testable import Presente

/// Prueba las compras contra Presente.storekit (sin cobrar, sin App Store Connect).
/// Ejecutar en el Simulador: Product › Test (⌘U). No prueban producción: ver docs/QA.md (Sandbox/TestFlight).
@MainActor
final class SubscriptionStoreTests: XCTestCase {
    private var session: SKTestSession!

    override func setUp() async throws {
        session = try SKTestSession(configurationFileNamed: "Presente")
        session.resetToDefaultState()
        session.clearTransactions()
        session.disableDialogs = true
        session.askToBuyEnabled = false
        session.storefront = "MEX"
    }

    override func tearDown() async throws {
        session.clearTransactions()
    }

    private func makeStore() async -> SubscriptionStore {
        let store = SubscriptionStore()
        await store.start()
        return store
    }

    /// StoreKit Test aplica cambios de forma asíncrona; en la app, `Transaction.updates` dispara `refresh()`.
    private func waitFor(_ store: SubscriptionStore, timeout: TimeInterval = 15,
                         _ condition: (EntitlementState) -> Bool) async {
        let deadline = Date().addingTimeInterval(timeout)
        while !condition(store.state), Date() < deadline {
            try? await Task.sleep(nanoseconds: 500_000_000)
            await store.refresh()
        }
    }

    private func identifier(of productID: String) throws -> UInt {
        try XCTUnwrap(session.allTransactions().last { $0.productIdentifier == productID }).identifier
    }

    // MARK: Productos

    func testProductsLoadWithMexicanPricesAndTrial() async throws {
        let store = await makeStore()
        let monthly = try XCTUnwrap(store.monthly)
        let lifetime = try XCTUnwrap(store.lifetime)
        XCTAssertEqual(monthly.price, 39)
        XCTAssertEqual(monthly.subscription?.subscriptionPeriod.unit, .month)
        XCTAssertEqual(monthly.subscription?.subscriptionPeriod.value, 1)
        let trial = try XCTUnwrap(store.trialOffer)
        XCTAssertEqual(trial.paymentMode, .freeTrial)
        XCTAssertEqual(TrialTerms.days(unit: trial.trialUnit, value: trial.period.value), 7)
        XCTAssertEqual(lifetime.price, 499)
        XCTAssertEqual(lifetime.type, .nonConsumable)
    }

    func testNoPurchaseMeansLocked() async {
        let store = await makeStore()
        XCTAssertEqual(store.state, EntitlementState.none)
        XCTAssertFalse(store.state.unlocksFilters)
        XCTAssertTrue(store.rules.canPurchase(.monthly))
        XCTAssertTrue(store.rules.canPurchase(.lifetime))
    }

    // MARK: Mensual con prueba gratuita

    func testNewUserIsEligibleAndTrialStartsOnPurchase() async {
        let store = await makeStore()
        XCTAssertTrue(store.isTrialEligible)
        XCTAssertNotNil(store.visibleTrial)
        await store.purchase(.monthly)
        guard case .trial = store.state else { return XCTFail("Se esperaba prueba gratuita: \(store.state)") }
        XCTAssertTrue(store.state.unlocksFilters)
        XCTAssertFalse(store.isTrialEligible, "la prueba es una sola vez")
        XCTAssertFalse(store.rules.canPurchase(.monthly), "no se puede volver a comprar el mismo plan")
    }

    func testAfterTrialTheMonthlyChargeStarts() async throws {
        let store = await makeStore()
        await store.purchase(.monthly)
        // Simula el fin de los 7 días: StoreKit renueva y cobra el primer mes.
        try session.forceRenewalOfSubscription(productIdentifier: SubscriptionStore.monthlyID)
        await waitFor(store) { if case .subscribed = $0 { return true } else { return false } }
        guard case .subscribed(_, let willRenew) = store.state else { return XCTFail("Se esperaba suscripción pagada: \(store.state)") }
        XCTAssertTrue(willRenew)
    }

    func testCancelledAutoRenewStaysActiveUntilExpiry() async throws {
        let store = await makeStore()
        await store.purchase(.monthly)
        try session.disableAutoRenewForTransaction(identifier: identifier(of: SubscriptionStore.monthlyID))
        await waitFor(store) { if case .trial(_, false) = $0 { return true } else { return false } }
        guard case .trial(_, let willRenew) = store.state else { return XCTFail("Debe seguir activa hasta que venza") }
        XCTAssertFalse(willRenew)
    }

    func testExpiredSubscriptionLocksAgain() async throws {
        let store = await makeStore()
        await store.purchase(.monthly)
        XCTAssertTrue(store.state.unlocksFilters)
        try session.expireSubscription(productIdentifier: SubscriptionStore.monthlyID)
        await waitFor(store) { !$0.unlocksFilters }
        XCTAssertFalse(store.state.unlocksFilters)
        XCTAssertFalse(store.isTrialEligible, "quien ya usó la prueba no vuelve a calificar")
    }

    func testRefundedSubscriptionRevokesAccess() async throws {
        let store = await makeStore()
        await store.purchase(.monthly)
        try session.refundTransaction(identifier: identifier(of: SubscriptionStore.monthlyID))
        await waitFor(store) { !$0.unlocksFilters }
        XCTAssertFalse(store.state.unlocksFilters)
    }

    // MARK: Lifetime

    func testLifetimePurchaseUnlocksForever() async {
        let store = await makeStore()
        await store.purchase(.lifetime)
        XCTAssertEqual(store.state, .lifetime(subscriptionStillRenews: false))
        XCTAssertFalse(store.rules.canPurchase(.lifetime))
        XCTAssertFalse(store.rules.canPurchase(.monthly))
    }

    func testLifetimeAfterSubscriptionWarnsAndKeepsAccessAfterExpiry() async throws {
        let store = await makeStore()
        await store.purchase(.monthly)
        XCTAssertTrue(store.rules.needsSubscriptionWarning(before: .lifetime))
        await store.purchase(.lifetime)
        XCTAssertEqual(store.state, .lifetime(subscriptionStillRenews: true), "la suscripción no se cancela sola")
        try session.expireSubscription(productIdentifier: SubscriptionStore.monthlyID)
        await waitFor(store) { $0 == .lifetime(subscriptionStillRenews: false) }
        XCTAssertEqual(store.state, .lifetime(subscriptionStillRenews: false))
        XCTAssertTrue(store.state.unlocksFilters)
    }

    func testRefundedLifetimeRevokesAccess() async throws {
        let store = await makeStore()
        await store.purchase(.lifetime)
        try session.refundTransaction(identifier: identifier(of: SubscriptionStore.lifetimeID))
        await waitFor(store) { !$0.unlocksFilters }
        XCTAssertFalse(store.state.unlocksFilters)
    }

    func testRestoreBringsBackLifetime() async {
        let store = await makeStore()
        await store.purchase(.lifetime)
        let fresh = await makeStore()
        await fresh.restore()
        XCTAssertTrue(fresh.state.hasLifetime)
        XCTAssertNil(fresh.message)
    }

    // MARK: Errores

    func testRestoreWithoutPurchaseExplainsIt() async {
        let store = await makeStore()
        await store.restore()
        XCTAssertFalse(store.state.unlocksFilters)
        XCTAssertNotNil(store.message)
    }

    func testFailedPurchaseShowsMessageAndStaysLocked() async {
        session.failTransactionsEnabled = true
        let store = await makeStore()
        await store.purchase(.lifetime)
        XCTAssertFalse(store.state.unlocksFilters)
        XCTAssertNotNil(store.message)
    }

    func testPendingPurchaseIsExplained() async {
        session.askToBuyEnabled = true
        let store = await makeStore()
        await store.purchase(.monthly)
        XCTAssertFalse(store.state.unlocksFilters)
        XCTAssertNotNil(store.message)
    }
}

/// Las reglas y scripts del paquete se empaquetan en la app y el navegador filtrado se puede crear en iOS.
@MainActor
final class BrowserSetupTests: XCTestCase {
    func testFilteredBrowsersCanBeCreatedForEveryAvailablePlatform() throws {
        for platform in [.instagram, .youtube, .tiktok, .facebook, .x, .reddit, .linkedin, .threads, .pinterest] as [PlatformID] {
            let browser = try BrowserModel(platform: platform, settings: .init())
            XCTAssertEqual(browser.webView.configuration.userContentController.userScripts.count, 1, platform.rawValue)
            browser.teardown()
        }
    }
}

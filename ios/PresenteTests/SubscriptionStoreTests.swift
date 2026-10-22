import StoreKitTest
import XCTest
@testable import Presente

/// Prueba la suscripción contra Presente.storekit (sin cobrar, sin App Store Connect).
/// Ejecutar en el Simulador: Product › Test (⌘U).
@MainActor
final class SubscriptionStoreTests: XCTestCase {
    private var session: SKTestSession!

    override func setUp() async throws {
        session = try SKTestSession(configurationFileNamed: "Presente")
        session.resetToDefaultState()
        session.clearTransactions()
        session.disableDialogs = true
        session.storefront = "MEX"
    }

    override func tearDown() async throws {
        session.clearTransactions()
    }

    /// StoreKit Test aplica expiraciones y reembolsos de forma asíncrona; en la app,
    /// `Transaction.updates` dispara `refresh()`. Aquí refrescamos hasta que cambie o venza el plazo.
    private func waitUntilLocked(_ store: SubscriptionStore, timeout: TimeInterval = 15) async {
        let deadline = Date().addingTimeInterval(timeout)
        while store.state.unlocksFilters, Date() < deadline {
            try? await Task.sleep(nanoseconds: 500_000_000)
            await store.refresh()
        }
    }

    func testProductLoadsWithMexicanPrice() async throws {
        let store = SubscriptionStore()
        await store.loadProduct()
        let product = try XCTUnwrap(store.product)
        XCTAssertEqual(product.id, SubscriptionStore.productID)
        XCTAssertEqual(product.price, 39)
        XCTAssertEqual(product.subscription?.subscriptionPeriod.unit, .month)
        XCTAssertEqual(product.subscription?.subscriptionPeriod.value, 1)
    }

    func testNoPurchaseMeansLocked() async {
        let store = SubscriptionStore()
        await store.start()
        XCTAssertFalse(store.state.unlocksFilters)
    }

    func testPurchaseUnlocksFilters() async throws {
        let store = SubscriptionStore()
        await store.start()
        await store.purchase()
        guard case .active = store.state else {
            return XCTFail("Se esperaba suscripción activa, estado: \(store.state)")
        }
    }

    func testExpiredSubscriptionLocksAgain() async throws {
        let store = SubscriptionStore()
        await store.start()
        await store.purchase()
        XCTAssertTrue(store.state.unlocksFilters)
        try session.expireSubscription(productIdentifier: SubscriptionStore.productID)
        await waitUntilLocked(store)
        XCTAssertFalse(store.state.unlocksFilters)
    }

    func testRefundRevokesAccess() async throws {
        let store = SubscriptionStore()
        await store.start()
        await store.purchase()
        let transaction = try XCTUnwrap(session.allTransactions().first)
        try session.refundTransaction(identifier: UInt(transaction.identifier))
        await waitUntilLocked(store)
        XCTAssertFalse(store.state.unlocksFilters)
    }

    func testCancelledAutoRenewStaysActiveUntilExpiry() async throws {
        let store = SubscriptionStore()
        await store.start()
        await store.purchase()
        try session.disableAutoRenewForTransaction(identifier: UInt(try XCTUnwrap(session.allTransactions().first).identifier))
        await store.refresh()
        guard case .active(_, let willRenew) = store.state else {
            return XCTFail("Debe seguir activa hasta que venza")
        }
        XCTAssertFalse(willRenew)
    }

    func testRestoreWithoutPurchaseExplainsIt() async {
        let store = SubscriptionStore()
        await store.start()
        await store.restore()
        XCTAssertFalse(store.state.unlocksFilters)
        XCTAssertNotNil(store.message)
    }

    func testFailedPurchaseShowsMessageAndStaysLocked() async throws {
        session.failTransactionsEnabled = true
        let store = SubscriptionStore()
        await store.start()
        await store.purchase()
        XCTAssertFalse(store.state.unlocksFilters)
        XCTAssertNotNil(store.message)
    }
}

/// Las reglas y scripts del paquete se empaquetan en la app y el navegador filtrado se puede crear en iOS.
@MainActor
final class BrowserSetupTests: XCTestCase {
    func testFilteredBrowsersCanBeCreated() throws {
        let instagram = try BrowserModel(platform: .instagram, settings: .init())
        let youtube = try BrowserModel(platform: .youtube, settings: .init())
        XCTAssertEqual(instagram.webView.configuration.userContentController.userScripts.count, 1)
        XCTAssertEqual(youtube.webView.configuration.userContentController.userScripts.count, 1)
        instagram.teardown()
        youtube.teardown()
    }
}

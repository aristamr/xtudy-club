import Combine
import PresenteCore
import UIKit
import WebKit

/// Vista web filtrada de una plataforma.
///
/// - La sesión vive en el almacén de datos de WebKit del dispositivo; Presente no lee cookies ni contraseñas.
/// - El filtrado ocurre localmente: política de navegación (aquí) + script inyectado (engine.js).
@MainActor
final class BrowserModel: NSObject, ObservableObject {
    let platform: PresenteCore.Platform
    let webView: WKWebView
    private let engine: FilterEngine

    @Published private(set) var canGoBack = false
    @Published private(set) var isLoading = false
    @Published private(set) var progress: Double = 0
    @Published private(set) var currentURL: URL?
    @Published private(set) var loadError: String?
    @Published private(set) var notice: String?

    private var observations: [NSKeyValueObservation] = []
    private var loopGuard = RedirectLoopGuard()
    private var noticeTask: Task<Void, Never>?

    init(platform: PresenteCore.Platform, settings: FilterSettings) throws {
        let engine = try FilterEngine(platform: platform, settings: settings)

        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.allowsInlineMediaPlayback = true
        // Nada se reproduce solo: los videos empiezan cuando la persona toca "play".
        configuration.mediaTypesRequiringUserActionForPlayback = .all
        configuration.defaultWebpagePreferences.preferredContentMode = .mobile

        let script = try engine.userScript(labels: BrowserModel.scriptLabels)
        configuration.userContentController.addUserScript(
            WKUserScript(source: script, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        )

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.allowsBackForwardNavigationGestures = true

        self.platform = platform
        self.engine = engine
        self.webView = webView
        super.init()

        configuration.userContentController.add(WeakMessageHandler(self), name: "presente")
        webView.navigationDelegate = self
        webView.uiDelegate = self

        observations = [
            webView.observe(\.canGoBack, options: [.initial, .new]) { [weak self] web, _ in
                let value = web.canGoBack
                Task { @MainActor in self?.canGoBack = value }
            },
            webView.observe(\.estimatedProgress, options: [.new]) { [weak self] web, _ in
                let value = web.estimatedProgress
                Task { @MainActor in self?.progress = value }
            },
            webView.observe(\.url, options: [.initial, .new]) { [weak self] web, _ in
                let value = web.url
                Task { @MainActor in self?.currentURL = value }
            },
            webView.observe(\.isLoading, options: [.new]) { [weak self] web, _ in
                let value = web.isLoading
                Task { @MainActor in self?.isLoading = value }
            },
        ]
    }

    func start() {
        guard webView.url == nil else { return }
        load(platform.startURL)
    }

    func load(_ url: URL) {
        loadError = nil
        webView.load(URLRequest(url: url))
    }

    func reload() {
        loadError = nil
        if webView.url == nil { start() } else { webView.reload() }
    }

    func goBack() { webView.goBack() }

    func teardown() {
        webView.stopLoading()
        webView.configuration.userContentController.removeScriptMessageHandler(forName: "presente")
        observations.removeAll()
    }

    // MARK: Avisos discretos

    static var scriptLabels: [String: String] {
        [
            "calmTitle": String(localized: "Busca lo que quieres ver."),
            "calmSubtitle": String(localized: "Sin recomendaciones. Solo lo que tú elijas."),
            "searchPlaceholder": String(localized: "Buscar en YouTube"),
            "searchButton": String(localized: "Buscar"),
        ]
    }

    static func noticeText(forRule rule: String) -> String? {
        if rule.hasPrefix("reel") { return String(localized: "Reels está desactivado") }
        if rule.hasPrefix("short") { return String(localized: "Shorts está desactivado") }
        if rule.hasPrefix("explore") { return String(localized: "Explore está desactivado; la búsqueda sigue disponible") }
        if rule == "trending" { return String(localized: "Las tendencias están ocultas") }
        if rule == "autoplay" { return String(localized: "Se detuvo la reproducción automática") }
        return nil
    }

    fileprivate func show(noticeForRule rule: String) {
        guard let text = Self.noticeText(forRule: rule) else { return }
        notice = text
        UIAccessibility.post(notification: .announcement, argument: text)
        noticeTask?.cancel()
        noticeTask = Task { [weak self] in
            try? await Task.sleep(nanoseconds: 2_500_000_000)
            guard !Task.isCancelled else { return }
            self?.notice = nil
        }
    }
}

// MARK: - Navegación

extension BrowserModel: WKNavigationDelegate {
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction) async -> WKNavigationActionPolicy {
        guard let url = navigationAction.request.url else { return .cancel }
        // Subrecursos e iframes no cambian la página que se ve.
        if let frame = navigationAction.targetFrame, !frame.isMainFrame { return .allow }

        switch engine.decision(for: url) {
        case .allow:
            return .allow
        case .redirect(let target, let rule):
            // Si el sitio insiste en volver a esta ruta, la dejamos pasar en lugar de recargar sin fin.
            guard loopGuard.allow(rule: rule) else { return .allow }
            show(noticeForRule: rule)
            webView.load(URLRequest(url: target))
            return .cancel
        case .openExternally(let external):
            _ = await UIApplication.shared.open(external)
            return .cancel
        case .cancel:
            return .cancel
        }
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        handle(error)
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        handle(error)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        loadError = nil
    }

    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        // WebKit cerró el proceso web (memoria); recargamos en lugar de mostrar una página en blanco.
        webView.reload()
    }

    private func handle(_ error: Error) {
        let ns = error as NSError
        // Cancelaciones normales: redirecciones nuestras o navegación interrumpida.
        if ns.domain == NSURLErrorDomain, ns.code == NSURLErrorCancelled { return }
        if ns.domain == "WebKitErrorDomain", ns.code == 102 { return }
        if ns.domain == NSURLErrorDomain,
           [NSURLErrorNotConnectedToInternet, NSURLErrorNetworkConnectionLost, NSURLErrorTimedOut].contains(ns.code) {
            loadError = String(localized: "Sin conexión. Revisa tu internet e inténtalo de nuevo.")
        } else {
            loadError = String(localized: "No se pudo cargar la página.")
        }
    }
}

// MARK: - Ventanas nuevas (target=_blank) se abren en la misma vista

extension BrowserModel: WKUIDelegate {
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration,
                 for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if navigationAction.targetFrame == nil, navigationAction.request.url != nil {
            webView.load(navigationAction.request)
        }
        return nil
    }
}

// MARK: - Mensajes del script

extension BrowserModel: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        let host = message.frameInfo.securityOrigin.host
        guard message.frameInfo.isMainFrame,
              platform.contentHosts.contains(where: { host == $0 || host.hasSuffix("." + $0) }),
              let body = message.body as? [String: Any],
              let type = body["type"] as? String else { return }
        switch type {
        case "redirected":
            if let rule = body["rule"] as? String { show(noticeForRule: rule) }
        case "autoplayBlocked":
            show(noticeForRule: "autoplay")
        default:
            break
        }
    }
}

/// Evita el ciclo de retención WKUserContentController → handler.
private final class WeakMessageHandler: NSObject, WKScriptMessageHandler {
    weak var target: WKScriptMessageHandler?
    init(_ target: WKScriptMessageHandler) { self.target = target }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        target?.userContentController(userContentController, didReceive: message)
    }
}

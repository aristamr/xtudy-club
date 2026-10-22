import PresenteCore
import SwiftUI
import WebKit

/// Pantalla completa con la versión filtrada de una plataforma.
struct BrowserScreen: View {
    let platform: PresenteCore.Platform
    @EnvironmentObject private var model: AppModel
    @Environment(\.dismiss) private var dismiss
    @State private var browser: BrowserModel?
    @State private var setupError = false

    var body: some View {
        VStack(spacing: 0) {
            if let browser {
                BrowserContent(browser: browser, close: close)
            } else if setupError {
                ContentUnavailableView {
                    Label("No se pudo preparar el filtro", systemImage: "exclamationmark.triangle")
                } description: {
                    Text("Por seguridad no abrimos \(platform.displayName) sin filtros. Cierra e inténtalo de nuevo.")
                } actions: {
                    Button("Cerrar", action: close)
                }
            } else {
                ProgressView()
            }
        }
        .task {
            guard browser == nil else { return }
            do {
                let b = try BrowserModel(platform: platform, settings: model.settings)
                b.start()
                browser = b
            } catch {
                setupError = true
            }
        }
    }

    private func close() {
        browser?.teardown()
        dismiss()
    }
}

private struct BrowserContent: View {
    @ObservedObject var browser: BrowserModel
    let close: () -> Void
    @EnvironmentObject private var model: AppModel
    @State private var showChannels = false

    var body: some View {
        VStack(spacing: 0) {
            toolbar
            ZStack(alignment: .top) {
                WebViewContainer(webView: browser.webView)
                    .ignoresSafeArea(edges: .bottom)

                if browser.isLoading, browser.progress < 1 {
                    ProgressView(value: browser.progress)
                        .progressViewStyle(.linear)
                        .tint(Theme.accent)
                }

                if let error = browser.loadError {
                    ContentUnavailableView {
                        Label(error, systemImage: "wifi.slash")
                    } actions: {
                        Button("Reintentar") { browser.reload() }
                    }
                    .background(Color(uiColor: .systemBackground))
                }

                if let notice = browser.notice {
                    Text(notice)
                        .font(.subheadline.weight(.medium))
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(.regularMaterial, in: Capsule())
                        .padding(.top, 12)
                        .transition(.move(edge: .top).combined(with: .opacity))
                }
            }
            .animation(.easeInOut(duration: 0.25), value: browser.notice)
        }
        .sheet(isPresented: $showChannels) {
            ChannelsSheet(current: SavedChannel.from(url: browser.currentURL)) { channel in
                browser.load(channel.videosURL)
            }
        }
    }

    private var toolbar: some View {
        HStack(spacing: 20) {
            Button(action: close) {
                Image(systemName: "xmark").font(.body.weight(.semibold))
            }
            .accessibilityLabel(Text("Cerrar"))

            Button { browser.goBack() } label: {
                Image(systemName: "chevron.left").font(.body.weight(.semibold))
            }
            .disabled(!browser.canGoBack)
            .accessibilityLabel(Text("Atrás"))

            Spacer()
            HStack(spacing: 6) {
                Circle().fill(Theme.free).frame(width: 7, height: 7)
                Text(browser.platform.displayName).font(.headline)
            }
            .accessibilityElement(children: .combine)
            .accessibilityLabel(Text("\(browser.platform.displayName), filtros activos"))
            Spacer()

            if browser.platform == .youtube {
                Button { showChannels = true } label: {
                    Image(systemName: "person.2").font(.body.weight(.semibold))
                }
                .accessibilityLabel(Text("Mis canales"))
            }

            Button { browser.reload() } label: {
                Image(systemName: "arrow.clockwise").font(.body.weight(.semibold))
            }
            .accessibilityLabel(Text("Recargar"))
        }
        .padding(.horizontal, 16)
        .frame(height: 48)
        .background(Color(uiColor: .systemBackground))
        .overlay(alignment: .bottom) { Divider() }
    }
}

private struct WebViewContainer: UIViewRepresentable {
    let webView: WKWebView
    func makeUIView(context: Context) -> WKWebView { webView }
    func updateUIView(_ uiView: WKWebView, context: Context) {}
}

/// Canales de YouTube guardados en el dispositivo (alternativa a "Suscripciones" sin iniciar sesión).
struct ChannelsSheet: View {
    let current: SavedChannel?
    let open: (SavedChannel) -> Void
    @EnvironmentObject private var model: AppModel
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List {
                if let current {
                    Section {
                        if model.channels.contains(current) {
                            Button(role: .destructive) { model.channels.remove(current) } label: {
                                Label("Quitar \(current.handle)", systemImage: "minus.circle")
                            }
                        } else {
                            Button { model.channels.add(current) } label: {
                                Label("Guardar \(current.handle)", systemImage: "plus.circle")
                            }
                        }
                    }
                }
                Section {
                    if model.channels.channels.isEmpty {
                        Text("Abre la página de un canal y guárdalo aquí. Verás sus videos más recientes, en orden, sin recomendaciones.")
                            .foregroundStyle(.secondary)
                    }
                    ForEach(model.channels.channels) { channel in
                        Button(channel.handle) {
                            open(channel)
                            dismiss()
                        }
                    }
                    .onDelete { offsets in
                        let removed = offsets.map { model.channels.channels[$0] }
                        removed.forEach { model.channels.remove($0) }
                    }
                } header: {
                    Text("Mis canales")
                } footer: {
                    Text("Se guardan solo en este iPhone.")
                }
            }
            .navigationTitle(Text("Mis canales"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) { Button("Listo") { dismiss() } }
            }
        }
        .presentationDetents([.medium, .large])
    }
}

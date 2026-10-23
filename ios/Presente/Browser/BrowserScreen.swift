import PresenteCore
import SwiftUI
import WebKit

/// Pantalla completa con la versión filtrada de una plataforma.
struct BrowserScreen: View {
    let platform: PlatformID
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
                    Label("The filter couldn't be prepared", systemImage: "exclamationmark.triangle")
                } description: {
                    Text("To be safe, we don't open \(platform.displayName) without filters. Close and try again.")
                } actions: {
                    Button("Close", action: close)
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
            if browser.platform.support == .experimental {
                Text("Beta: filters for \(browser.platform.displayName) haven't been verified yet. Some distractions may slip through.")
                    .font(.caption)
                    .foregroundStyle(Theme.softInk)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 6)
                    .background(Theme.surface)
            }
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
                        Button("Try again") { browser.reload() }
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
            .accessibilityLabel(Text("Close"))

            Button { browser.goBack() } label: {
                Image(systemName: "chevron.left").font(.body.weight(.semibold))
            }
            .disabled(!browser.canGoBack)
            .accessibilityLabel(Text("Back"))

            Spacer()
            HStack(spacing: 6) {
                Circle().fill(Theme.free).frame(width: 7, height: 7)
                Text(browser.platform.displayName).font(.headline)
            }
            .accessibilityElement(children: .combine)
            .accessibilityLabel(Text("\(browser.platform.displayName), filters on"))
            Spacer()

            if browser.platform == .youtube {
                Button { showChannels = true } label: {
                    Image(systemName: "person.2").font(.body.weight(.semibold))
                }
                .accessibilityLabel(Text("My channels"))
            }

            Button { browser.reload() } label: {
                Image(systemName: "arrow.clockwise").font(.body.weight(.semibold))
            }
            .accessibilityLabel(Text("Reload"))
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
                                Label("Remove \(current.handle)", systemImage: "minus.circle")
                            }
                        } else {
                            Button { model.channels.add(current) } label: {
                                Label("Save \(current.handle)", systemImage: "plus.circle")
                            }
                        }
                    }
                }
                Section {
                    if model.channels.channels.isEmpty {
                        Text("Open a channel's page and save it here. You'll see its latest videos, in order, with no recommendations.")
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
                    Text("My channels")
                } footer: {
                    Text("Saved only on this iPhone.")
                }
            }
            .navigationTitle(Text("My channels"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) { Button("Done") { dismiss() } }
            }
        }
        .presentationDetents([.medium, .large])
    }
}

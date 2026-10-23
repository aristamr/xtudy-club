import PresenteCore
import SwiftUI

/// Pantalla 1: comparación ANTES / DESPUÉS, interactiva (arrastra la línea).
/// Los dibujos son ilustraciones genéricas, sin logotipos ni capturas de terceros,
/// y muestran solo lo que el filtro realmente hace.
struct BeforeAfterStep: View {
    let next: () -> Void
    @State private var platform: PlatformID = .instagram
    @State private var split: CGFloat = 0.12
    @State private var didIntro = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    /// Solo plataformas con soporte comprobado aparecen en la demostración.
    private let demoPlatforms: [PlatformID] = [.instagram, .youtube]

    var body: some View {
        StepScaffold(buttonTitle: "Continue", action: next) {
            StepTitle(title: "Your social apps. Without the noise.")

            Picker(selection: $platform) {
                ForEach(demoPlatforms) { Text(verbatim: $0.displayName).tag($0) }
            } label: {
                Text("Platform")
            }
            .pickerStyle(.segmented)

            comparison
                .frame(maxWidth: 360)
                .frame(maxWidth: .infinity)

            Summary(platform: platform)
        }
        .onAppear(perform: intro)
    }

    private var comparison: some View {
        GeometryReader { geo in
            let w = geo.size.width
            ZStack(alignment: .leading) {
                MockScreen(platform: platform, filtered: false)
                MockScreen(platform: platform, filtered: true)
                    .mask(alignment: .leading) {
                        Rectangle().frame(width: max(0, w * split))
                    }
                Rectangle()
                    .fill(Theme.background)
                    .frame(width: 3)
                    .overlay {
                        Circle()
                            .fill(Theme.background)
                            .frame(width: 34, height: 34)
                            .shadow(color: .black.opacity(0.15), radius: 6, y: 2)
                            .overlay(Image(systemName: "arrow.left.and.right").font(.caption.weight(.bold)).foregroundStyle(Theme.ink))
                    }
                    .offset(x: w * split - 1.5)
                VStack {
                    HStack {
                        Label("After", systemImage: "leaf").labelStyle(PillLabelStyle())
                        Spacer()
                        Label("Before", systemImage: "infinity").labelStyle(PillLabelStyle())
                    }
                    Spacer()
                }
                .padding(10)
            }
            .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: 28, style: .continuous).strokeBorder(Theme.ink.opacity(0.08)))
            .contentShape(Rectangle())
            .gesture(DragGesture(minimumDistance: 0).onChanged { value in
                split = min(1, max(0, value.location.x / max(w, 1)))
            })
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(Text("Before and after comparison"))
            .accessibilityValue(Text(platform == .instagram
                ? LocalizedStringKey("Before: Reels, Explore and suggested posts. After: posts from people you follow, search and messages.")
                : LocalizedStringKey("Before: Shorts and recommended videos. After: a calm search and your channels.")))
            .accessibilityAdjustableAction { direction in
                split = direction == .increment ? min(1, split + 0.25) : max(0, split - 0.25)
            }
        }
        .aspectRatio(0.62, contentMode: .fit)
        // Es una ilustración: la línea se mueve igual en idiomas de derecha a izquierda.
        .environment(\.layoutDirection, .leftToRight)
    }

    private func intro() {
        guard !didIntro else { return }
        didIntro = true
        if reduceMotion { split = 0.5; return }
        withAnimation(.easeInOut(duration: 1.4).delay(0.4)) { split = 0.88 }
        withAnimation(.easeInOut(duration: 0.9).delay(2.0)) { split = 0.5 }
    }
}

private struct PillLabelStyle: LabelStyle {
    func makeBody(configuration: Configuration) -> some View {
        HStack(spacing: 4) { configuration.icon; configuration.title }
            .font(.caption.weight(.semibold))
            .padding(.horizontal, 9)
            .padding(.vertical, 5)
            .background(.ultraThinMaterial, in: Capsule())
            .foregroundStyle(Theme.ink)
    }
}

/// Qué se queda y qué se va, en dos líneas.
private struct Summary: View {
    let platform: PlatformID

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            row(icon: "checkmark", tint: Theme.accent, text: platform == .instagram
                ? "Kept: messages, people you follow, profiles and search."
                : "Kept: search, your saved channels and full videos.")
            row(icon: "minus", tint: Theme.softInk, text: platform == .instagram
                ? "Removed: Reels, Explore and suggested posts."
                : "Removed: Shorts, recommendations and autoplay.")
        }
        .font(.subheadline)
    }

    private func row(icon: String, tint: Color, text: LocalizedStringKey) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 10) {
            Image(systemName: icon).font(.caption.weight(.bold)).foregroundStyle(tint).frame(width: 16)
            Text(text).foregroundStyle(Theme.ink).fixedSize(horizontal: false, vertical: true)
        }
    }
}

/// Ilustración de una app social antes/después del filtro.
private struct MockScreen: View {
    let platform: PlatformID
    let filtered: Bool

    var body: some View {
        VStack(spacing: 10) {
            HStack {
                Text(verbatim: platform.displayName).font(.subheadline.weight(.bold))
                Spacer()
                Image(systemName: "paperplane")
            }
            .foregroundStyle(Theme.ink)
            .padding(.horizontal, 14)
            .padding(.top, 44)

            if platform == .instagram { instagram } else { youtube }

            Spacer(minLength: 0)
            tabBar
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(filtered ? Theme.background : Theme.surfaceStrong)
    }

    @ViewBuilder private var instagram: some View {
        HStack(spacing: 10) {
            ForEach(0..<5, id: \.self) { i in
                Circle().strokeBorder(filtered ? Theme.accent : Color.pink.opacity(0.7), lineWidth: 2)
                    .background(Circle().fill(Theme.ink.opacity(0.08 + Double(i) * 0.02)))
                    .frame(width: 38, height: 38)
            }
        }
        .padding(.horizontal, 14)
        if filtered {
            post(name: "Ana", tag: nil)
            post(name: "Diego", tag: nil)
        } else {
            post(name: "", tag: "Suggested for you")
            reelTile
        }
    }

    @ViewBuilder private var youtube: some View {
        if filtered {
            VStack(spacing: 10) {
                Text("Search for what you came for.").font(.footnote.weight(.semibold)).foregroundStyle(Theme.ink)
                RoundedRectangle(cornerRadius: 10).strokeBorder(Theme.ink.opacity(0.2)).frame(height: 34)
                    .overlay(alignment: .leading) {
                        Image(systemName: "magnifyingglass").foregroundStyle(Theme.softInk).padding(.leading, 10)
                    }
            }
            .padding(.horizontal, 18)
            .padding(.top, 24)
            VStack(alignment: .leading, spacing: 8) {
                Text("Your channels").font(.caption.weight(.semibold)).foregroundStyle(Theme.softInk)
                ForEach(0..<3, id: \.self) { _ in
                    HStack {
                        Circle().fill(Theme.ink.opacity(0.12)).frame(width: 24, height: 24)
                        RoundedRectangle(cornerRadius: 4).fill(Theme.ink.opacity(0.12)).frame(width: 110, height: 9)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 18)
        } else {
            VStack(alignment: .leading, spacing: 8) {
                Text("Recommended").font(.caption.weight(.semibold)).foregroundStyle(Theme.softInk)
                RoundedRectangle(cornerRadius: 10).fill(Theme.ink.opacity(0.18)).frame(height: 96)
                    .overlay(Image(systemName: "play.fill").foregroundStyle(.white.opacity(0.9)))
                Text("Shorts").font(.caption.weight(.semibold)).foregroundStyle(Theme.softInk)
                HStack(spacing: 6) {
                    ForEach(0..<3, id: \.self) { _ in
                        RoundedRectangle(cornerRadius: 8).fill(Color.red.opacity(0.25)).frame(height: 92)
                    }
                }
            }
            .padding(.horizontal, 14)
        }
    }

    private func post(name: String, tag: LocalizedStringKey?) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(spacing: 6) {
                Circle().fill(Theme.ink.opacity(0.15)).frame(width: 20, height: 20)
                if let tag {
                    Text(tag).font(.caption2.weight(.semibold)).foregroundStyle(Theme.softInk)
                } else {
                    Text(verbatim: name).font(.caption2.weight(.semibold)).foregroundStyle(Theme.ink)
                }
            }
            RoundedRectangle(cornerRadius: 10)
                .fill(filtered ? Theme.accent.opacity(0.25) : Color.orange.opacity(0.28))
                .frame(height: 74)
        }
        .padding(.horizontal, 14)
    }

    private var reelTile: some View {
        RoundedRectangle(cornerRadius: 10)
            .fill(Color.purple.opacity(0.22))
            .frame(height: 74)
            .overlay(Label("Reels", systemImage: "play.rectangle.on.rectangle").font(.caption.weight(.semibold)).foregroundStyle(Theme.ink))
            .padding(.horizontal, 14)
    }

    private var tabBar: some View {
        let icons: [String]
        if platform == .instagram {
            icons = filtered ? ["house", "magnifyingglass", "paperplane", "person"]
                             : ["house", "safari", "play.rectangle.on.rectangle", "paperplane", "person"]
        } else {
            icons = filtered ? ["house", "person.2", "person"]
                             : ["house", "bolt", "plus.circle", "person.2", "person"]
        }
        return HStack {
            ForEach(icons, id: \.self) { name in
                Image(systemName: name).frame(maxWidth: .infinity)
            }
        }
        .font(.body)
        .foregroundStyle(Theme.ink.opacity(0.8))
        .padding(.vertical, 12)
        .background(Theme.ink.opacity(0.04))
    }
}

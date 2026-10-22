import Foundation

/// Canales de YouTube guardados localmente.
///
/// Google bloquea el inicio de sesión dentro de vistas web integradas, así que la página
/// de suscripciones de YouTube puede no estar disponible. Esta lista local (solo en el
/// dispositivo) es la alternativa permitida para "seguir" canales sin algoritmo.
public struct SavedChannel: Codable, Equatable, Hashable, Identifiable, Sendable {
    public var handle: String
    public var id: String { handle.lowercased() }

    public init(handle: String) { self.handle = handle }

    public var videosURL: URL {
        URL(string: "https://m.youtube.com/\(handle)/videos")!
    }

    /// Extrae `@canal` de una URL de YouTube (`/@canal`, `/@canal/videos`, …).
    public static func from(url: URL?) -> SavedChannel? {
        guard let url, let host = url.host, Platform.host(host, isWithin: "youtube.com") else { return nil }
        let first = url.path.split(separator: "/").first.map(String.init) ?? ""
        guard first.count > 1, first.hasPrefix("@") else { return nil }
        let allowed = CharacterSet.alphanumerics.union(CharacterSet(charactersIn: "._-@%"))
        guard first.unicodeScalars.allSatisfy(allowed.contains) else { return nil }
        return SavedChannel(handle: first)
    }
}

public struct SavedChannelList: Codable, Equatable, Sendable {
    public private(set) var channels: [SavedChannel]

    public init(channels: [SavedChannel] = []) { self.channels = channels }

    public func contains(_ channel: SavedChannel) -> Bool { channels.contains { $0.id == channel.id } }

    public mutating func add(_ channel: SavedChannel) {
        guard !contains(channel) else { return }
        channels.append(channel)
        channels.sort { $0.handle.localizedCaseInsensitiveCompare($1.handle) == .orderedAscending }
    }

    public mutating func remove(_ channel: SavedChannel) {
        channels.removeAll { $0.id == channel.id }
    }
}

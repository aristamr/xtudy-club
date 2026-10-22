import Foundation
import PresenteCore

// Uso: presente-script <instagram|youtube> [opciones-desactivadas…]
// Imprime el script exacto que la app inyecta, para las pruebas de ios/web-tests.
let args = CommandLine.arguments.dropFirst()
guard let name = args.first, let platform = Platform(rawValue: name) else {
    FileHandle.standardError.write(Data("uso: presente-script <instagram|youtube> [shortForm|explore|recommendations…]\n".utf8))
    exit(2)
}
var settings = FilterSettings.default
for off in args.dropFirst() {
    switch FilterOption(rawValue: off) {
    case .shortForm: settings.removeShortForm = false
    case .explore: settings.removeExplore = false
    case .recommendations: settings.hideRecommendations = false
    case nil: break
    }
}
let engine = try FilterEngine(platform: platform, settings: settings)
print(try engine.userScript())

// swift-tools-version:5.9
import PackageDescription

// PresenteCore contiene toda la lógica que no depende de UIKit/SwiftUI/Screen Time:
// reglas de filtrado por plataforma, política de navegación, composición de scripts,
// cálculo de "tu vida en semanas" y la ventana de desbloqueo temporal.
// Compila en iOS, macOS y Linux para poder probarla sin simulador.
let package = Package(
    name: "PresenteCore",
    defaultLocalization: "es",
    platforms: [.iOS(.v17), .macOS(.v13)],
    products: [
        .library(name: "PresenteCore", targets: ["PresenteCore"]),
    ],
    targets: [
        .target(
            name: "PresenteCore",
            resources: [.copy("Resources")]
        ),
        // Herramienta de desarrollo: imprime el script compuesto para las pruebas web (Playwright).
        .executableTarget(
            name: "presente-script",
            dependencies: ["PresenteCore"]
        ),
        .testTarget(
            name: "PresenteCoreTests",
            dependencies: ["PresenteCore"]
        ),
    ]
)

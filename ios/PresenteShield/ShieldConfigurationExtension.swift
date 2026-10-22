import ManagedSettings
import ManagedSettingsUI
import UIKit

/// Texto de la pantalla de pausa que iOS muestra al abrir una app bloqueada.
final class ShieldConfigurationExtension: ShieldConfigurationDataSource {
    override func configuration(shielding application: Application) -> ShieldConfiguration {
        Self.configuration
    }

    override func configuration(shielding application: Application, in category: ActivityCategory) -> ShieldConfiguration {
        Self.configuration
    }

    private static var configuration: ShieldConfiguration {
        ShieldConfiguration(
            backgroundBlurStyle: .systemMaterial,
            backgroundColor: nil,
            icon: UIImage(systemName: "leaf"),
            title: ShieldConfiguration.Label(
                text: String(localized: "Esta app está en pausa"),
                color: .label
            ),
            subtitle: ShieldConfiguration.Label(
                text: String(localized: "Abre Presente para ver a tus personas sin el algoritmo. Si necesitas publicar, toca «Necesito publicar» en Presente."),
                color: .secondaryLabel
            ),
            primaryButtonLabel: ShieldConfiguration.Label(text: String(localized: "Entendido"), color: .systemBackground),
            primaryButtonBackgroundColor: .label,
            secondaryButtonLabel: nil
        )
    }
}

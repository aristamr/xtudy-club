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
                text: String(localized: "This app is paused"),
                color: .label
            ),
            subtitle: ShieldConfiguration.Label(
                text: String(localized: "Open Presente to see your people without the noise. Need to post? Tap “I need to post” in Presente."),
                color: .secondaryLabel
            ),
            primaryButtonLabel: ShieldConfiguration.Label(text: String(localized: "Got it"), color: .systemBackground),
            primaryButtonBackgroundColor: .label,
            secondaryButtonLabel: nil
        )
    }
}

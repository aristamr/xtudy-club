import FamilyControls
import SwiftUI

/// Tarjeta para bloquear (opcionalmente) las apps originales. Se usa en el onboarding y en Configuración.
struct AppBlockingCard: View {
    @EnvironmentObject private var screenTime: ScreenTimeController
    @State private var showPicker = false
    @State private var pickerSelection = FamilyActivitySelection()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Bloquear las apps originales", systemImage: "hourglass")
                .font(.headline)
            Text("Opcional. Usa el permiso de Tiempo en pantalla de Apple para poner en pausa Instagram y YouTube, y así abrirlos aquí, sin distracciones.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            if !screenTime.isAuthorized {
                Text("Apple te pedirá permiso. Presente no ve qué apps usas ni cuánto tiempo: solo puede pausar las apps que tú elijas.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
                Button("Permitir Tiempo en pantalla") {
                    Task {
                        if await screenTime.requestAuthorization() { openPicker() }
                    }
                }
                .buttonStyle(.secondary)
            } else if !screenTime.hasSelection {
                Text("En la siguiente ventana, elige Instagram y YouTube.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                Button("Elegir apps", action: openPicker)
                    .buttonStyle(.secondary)
            } else {
                Toggle(isOn: Binding(get: { screenTime.isEnabled }, set: { screenTime.setEnabled($0) })) {
                    Text("Apps elegidas: \(screenTime.selectedAppCount)")
                }
                Button("Cambiar apps", action: openPicker)
                    .font(.subheadline)
            }

            if let error = screenTime.errorMessage {
                Text(error).font(.footnote).foregroundStyle(.red)
            }
        }
        .padding(16)
        .background(Color.primary.opacity(0.05), in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .familyActivityPicker(isPresented: $showPicker, selection: $pickerSelection)
        .onChange(of: showPicker) { _, isShowing in
            if !isShowing { screenTime.save(selection: pickerSelection) }
        }
    }

    private func openPicker() {
        pickerSelection = screenTime.selection
        showPicker = true
    }
}

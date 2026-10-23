import FamilyControls
import SwiftUI

/// Tarjeta para bloquear (opcionalmente) las apps originales. Se usa en el onboarding y en Configuración.
struct AppBlockingCard: View {
    @EnvironmentObject private var screenTime: ScreenTimeController
    @State private var showPicker = false
    @State private var pickerSelection = FamilyActivitySelection()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Pause the original apps", systemImage: "hourglass")
                .font(.headline)
            Text("Optional. Uses Apple's Screen Time permission to pause the apps you choose, so you open them here, without the noise.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            if !screenTime.isAuthorized {
                Text("Apple will ask for permission. Presente can't see which apps you use or for how long: it can only pause the apps you choose.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
                Button("Allow Screen Time") {
                    Task {
                        if await screenTime.requestAuthorization() { openPicker() }
                    }
                }
                .buttonStyle(.secondary)
            } else if !screenTime.hasSelection {
                Text("In the next window, choose the social apps you want to pause.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                Button("Choose apps", action: openPicker)
                    .buttonStyle(.secondary)
            } else {
                Toggle(isOn: Binding(get: { screenTime.isEnabled }, set: { screenTime.setEnabled($0) })) {
                    if screenTime.selectedCategoryCount > 0 {
                        Text("Apps chosen: \(screenTime.selectedAppCount) · categories: \(screenTime.selectedCategoryCount)")
                    } else {
                        Text("Apps chosen: \(screenTime.selectedAppCount)")
                    }
                }
                Button("Change apps", action: openPicker)
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

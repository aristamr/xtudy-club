import PresenteCore
import StoreKit
import SwiftUI

/// Oferta de suscripción: precio real del App Store, qué incluye, cuándo se cobra y cómo cancelar.
struct SubscriptionOffer: View {
    @EnvironmentObject private var store: SubscriptionStore
    @State private var showManage = false

    // Reemplaza con tus URLs publicadas antes de enviar a revisión (ver docs/APP-STORE.md).
    static let termsURL = URL(string: "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/")!
    static let privacyURL = URL(string: "https://xtudy.mx/presente/privacidad")!

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            switch store.state {
            case .active(let expires, let willRenew):
                activeView(expires: expires, willRenew: willRenew)
            case .inGracePeriod:
                Label("Hay un problema con tu método de pago. Actualízalo para no perder el acceso.", systemImage: "exclamationmark.circle")
                    .font(.subheadline)
                Button("Administrar suscripción") { showManage = true }
                    .buttonStyle(.secondary)
            default:
                offerView
            }

            if let message = store.message {
                Text(message)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding(16)
        .background(Color.primary.opacity(0.05), in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .manageSubscriptionsSheet(isPresented: $showManage)
    }

    private func activeView(expires: Date?, willRenew: Bool) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Suscripción activa", systemImage: "checkmark.seal")
                .font(.headline)
            if let expires {
                Group {
                    if willRenew {
                        Text("Se renueva el \(expires.formatted(date: .long, time: .omitted)).")
                    } else {
                        Text("Termina el \(expires.formatted(date: .long, time: .omitted)). No se volverá a cobrar.")
                    }
                }
                .font(.subheadline)
                .foregroundStyle(.secondary)
            }
            Button("Administrar suscripción") { showManage = true }
                .buttonStyle(.secondary)
        }
    }

    @ViewBuilder
    private var offerView: some View {
        Label("Suscripción mensual", systemImage: "leaf")
            .font(.headline)

        VStack(alignment: .leading, spacing: 6) {
            bullet("Instagram sin Reels, sin Explore y sin sugerencias")
            bullet("YouTube sin Shorts, sin recomendaciones ni reproducción automática")
            bullet("Bloqueo opcional de las apps originales y 5 minutos para publicar")
        }
        .font(.subheadline)

        if let product = store.product {
            Text("\(product.displayPrice) al mes")
                .font(.title2.bold())
            Text("Se cobra a tu Apple ID al confirmar la compra y se renueva cada mes automáticamente, salvo que la canceles al menos 24 horas antes de que termine el periodo. Cancela cuando quieras en Ajustes › tu nombre › Suscripciones.")
                .font(.caption)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
            Button {
                Task { await store.purchase() }
            } label: {
                if store.isPurchasing {
                    ProgressView()
                } else {
                    Text("Suscribirme por \(product.displayPrice) al mes")
                }
            }
            .buttonStyle(.primary)
            .disabled(store.isPurchasing)
        } else if store.isLoadingProduct {
            ProgressView().frame(maxWidth: .infinity)
        } else {
            Button("Reintentar") { Task { await store.loadProduct() } }
                .buttonStyle(.secondary)
        }

        HStack {
            Button("Restaurar compras") { Task { await store.restore() } }
            Spacer()
            Link("Términos", destination: Self.termsURL)
            Text("·").foregroundStyle(.secondary)
            Link("Privacidad", destination: Self.privacyURL)
        }
        .font(.footnote)
    }

    private func bullet(_ text: LocalizedStringKey) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 8) {
            Image(systemName: "checkmark").font(.caption.weight(.bold)).foregroundStyle(Theme.accent)
            Text(text).fixedSize(horizontal: false, vertical: true)
        }
    }
}

/// Hoja que aparece si alguien sin suscripción intenta abrir una plataforma.
struct PaywallSheet: View {
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject private var store: SubscriptionStore

    var body: some View {
        NavigationStack {
            ScrollView {
                SubscriptionOffer().padding(Theme.padding)
            }
            .navigationTitle(Text("Activa Presente"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cerrar") { dismiss() }
                }
            }
            .onChange(of: store.state) { _, state in
                if state.unlocksFilters { dismiss() }
            }
        }
        .presentationDetents([.large])
    }
}

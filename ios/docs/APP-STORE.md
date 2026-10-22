# Checklist TestFlight y App Store

## Antes de todo (empieza hoy: tarda)

- [ ] Cuenta Apple Developer de pago (organización recomendada: Xtudy).
- [ ] **Solicitar el entitlement Family Controls (Distribution)**: https://developer.apple.com/contact/request/family-controls-distribution — uno por cada bundle ID: `mx.xtudy.presente`, `mx.xtudy.presente.monitor`, `mx.xtudy.presente.shield`. Explica: bloqueo voluntario de apps para bienestar digital, uso individual (`.individual`), sin recolección de datos.
- [ ] Revisión legal breve de términos de Meta e Instagram y de YouTube/Google sobre presentación de su sitio en un WebView (ver riesgos en ARQUITECTURA.md).
- [ ] Verificar que el nombre "Presente" esté disponible en App Store y sin conflicto de marca en México.

## App Store Connect

- [ ] Crear la app con bundle `mx.xtudy.presente`, idioma principal Español (México).
- [ ] Acuerdo de apps de pago firmado, datos bancarios y fiscales completos.
- [ ] **Suscripción**: grupo "Presente", producto auto‑renovable `mx.xtudy.presente.monthly`, duración 1 mes, precio **MXN 39.00** (México); revisar los precios equivalentes que Apple propone para otros países o limitar la disponibilidad.
- [ ] Nombre visible y descripción del producto en es‑MX y en‑US, captura de la pantalla de compra para revisión.
- [ ] (Opcional) Oferta introductoria. No está en el MVP.
- [ ] App Privacy: **Data Not Collected**.
- [ ] Clasificación de edad: cuestionario (contenido web sin restricciones → probablemente 17+ por acceso a web sin filtrar; confirmarlo en el cuestionario actual).
- [ ] URL de política de privacidad publicada y actualizada en `SubscriptionOffer.privacyURL` (hoy apunta a `https://xtudy.mx/presente/privacidad`, **hay que publicarla**).
- [ ] Términos: se usa el EULA estándar de Apple (enlace en la oferta). Si se usa uno propio, actualizar `termsURL` y App Store Connect.
- [ ] URL de soporte.

## Build

- [ ] `DEVELOPMENT_TEAM` en `project.yml`, `xcodegen`.
- [ ] Subir `CURRENT_PROJECT_VERSION` en cada build.
- [ ] `xcodebuild test` en verde (PresenteCore + StoreKit) y `web-tests` en verde.
- [ ] QA.md secciones B–F completas en iPhone real.
- [ ] Product › Archive → Distribute App → App Store Connect.
- [ ] Probar en TestFlight con cuenta Sandbox: compra, restauración, expiración.

## Metadatos (sin usar marcas ajenas como propias)

- [ ] No usar logotipos de Instagram/YouTube en el ícono ni en capturas como si fueran nuestros. Mencionar nombres solo de forma descriptiva ("funciona con…").
- [ ] Descripción honesta: qué filtra, qué no puede hacer (no modifica las apps nativas; YouTube puede no permitir iniciar sesión).
- [ ] Capturas: onboarding, inicio "Estás protegido.", vista filtrada, pantalla de pausa.

## Notas para el revisor (pegar en "App Review Information")

> Presente es una app de bienestar digital. Abre los sitios web oficiales de Instagram y YouTube en un WKWebView y, localmente en el dispositivo, oculta los videos cortos (Reels/Shorts), Explore y las recomendaciones algorítmicas. La persona inicia sesión directamente en las páginas oficiales; la app no pide, ve ni almacena credenciales, no tiene servidor y no recolecta datos.
> De forma opcional, con permiso de Tiempo en pantalla (FamilyControls, autorización individual), la persona puede pausar las apps nativas que elija; "Necesito publicar" las libera 5 minutos usando DeviceActivity.
> Para revisar sin cuenta de Instagram: YouTube funciona sin iniciar sesión. La suscripción mensual desbloquea las vistas filtradas; Tiempo en pantalla y la configuración funcionan sin pagar.

## Guías relevantes a releer antes de enviar

- 2.5.1 (APIs públicas), 3.1.1 y 3.1.2 (compras dentro de la app y suscripciones: precio, periodo, renovación, cancelación visibles antes de comprar — implementado en `SubscriptionOffer`).
- 4.2 (funcionalidad mínima), 5.1.1 (privacidad), 5.2.2 y 5.2.3 (servicios y contenido de terceros).
- Lineamientos de Family Controls / Screen Time API.
- No usar Stripe ni enlaces de pago externos para desbloquear funciones digitales en iOS.

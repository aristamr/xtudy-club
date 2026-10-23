# Checklist TestFlight y App Store

## Antes de todo (empieza hoy: tarda)

- [ ] Cuenta Apple Developer de pago (organización recomendada: Xtudy).
- [ ] **Solicitar el entitlement Family Controls (Distribution)**: https://developer.apple.com/contact/request/family-controls-distribution — uno por cada bundle ID: `mx.xtudy.presente`, `mx.xtudy.presente.monitor`, `mx.xtudy.presente.shield`. Explica: pausa voluntaria de apps para bienestar digital, uso individual (`.individual`), sin recolección de datos.
- [ ] Revisión legal breve de los términos de Meta (Instagram, Facebook, Threads), Google (YouTube), ByteDance (TikTok), X, Reddit, LinkedIn y Pinterest sobre mostrar su sitio en un WebView con elementos ocultos (ver riesgos en ARQUITECTURA.md).
- [ ] Verificar que el nombre "Presente" esté disponible en App Store y sin conflicto de marca en los países donde se publique.

## App Store Connect

- [ ] Crear la app con bundle `mx.xtudy.presente`. Idioma principal: inglés (o español); añadir es, fr, de, pt-BR, it.
- [ ] Acuerdo de apps de pago firmado, datos bancarios y fiscales completos.
- [ ] **Producto A — Suscripción** (Auto-Renewable): grupo "Presente", ID `mx.xtudy.presente.monthly`, duración 1 mes, precio **MXN 39.00** en México.
  - [ ] **Oferta introductoria**: *Free trial*, **1 semana** (7 días), para nuevos suscriptores. StoreKit decide la elegibilidad; la app solo muestra la prueba si `isEligibleForIntroOffer` es verdadero.
- [ ] **Producto B — Lifetime** (Non-Consumable): ID `mx.xtudy.presente.lifetime`, precio **MXN 499.00** en México.
- [ ] Revisar los precios equivalentes que Apple propone para otros países (la app nunca convierte monedas: muestra `displayPrice`).
- [ ] Nombre y descripción de ambos productos en los 6 idiomas; captura de la pantalla de compra para revisión.
- [ ] App Privacy: **Data Not Collected**.
- [ ] Clasificación de edad: cuestionario (acceso a sitios web de redes sociales → probablemente 17+; confirmarlo).
- [ ] **Publicar la política de privacidad** (`public/presente/privacy/index.html` → `https://xtudy.mx/presente/privacy/`, la URL que usa la app) y **poner un correo de contacto real** donde dice "[contact email]".
- [ ] Términos: se usa el EULA estándar de Apple (enlace en la pantalla de planes). Si se usa uno propio, actualizar `PaywallView.termsURL` y App Store Connect.
- [ ] URL de soporte.

## Build

- [ ] `DEVELOPMENT_TEAM` en `project.yml`, `xcodegen`.
- [ ] Subir `CURRENT_PROJECT_VERSION` en cada build.
- [ ] CI en verde: PresenteCore, filtro web, traducciones, Xcode + StoreKit, compilación sin cuenta.
- [ ] `docs/QA.md` secciones B–F completas en un iPhone real.
- [ ] Product › Archive → Distribute App → App Store Connect.
- [ ] TestFlight con cuenta Sandbox: prueba gratuita, renovación acelerada, cancelación, Lifetime, restaurar, reembolso (desde la cuenta Sandbox).

## Metadatos (sin usar marcas ajenas como propias)

- [ ] No usar logotipos de las redes en el ícono ni en capturas. Mencionarlas solo de forma descriptiva ("works with…").
- [ ] Descripción honesta: qué filtra, qué no (no modifica las apps nativas; YouTube puede no permitir iniciar sesión; las redes "Beta" pueden dejar pasar distracciones).
- [ ] Capturas: se pueden partir de `docs/evidence/screenshots/` (generadas por CI).

## Notas para el revisor (pegar en "App Review Information")

> Presente is a digital-wellbeing app. It opens the official mobile websites of social networks in a WKWebView and, locally on the device, hides short-video feeds (Reels/Shorts), Explore and algorithmic recommendations. People sign in directly on the official pages; the app never asks for, sees or stores credentials, has no server and collects no data.
> Optionally, with Screen Time permission (FamilyControls, individual authorization), people can pause the native apps they choose; "I need to post" unlocks them for 5 minutes using DeviceActivity.
> Plans: a monthly auto-renewable subscription (7-day free trial for eligible new subscribers) or a one-time Lifetime purchase; both unlock the same features. Screen Time pausing and settings work without paying.
> To review without accounts: YouTube and Reddit work without signing in.

## Guías relevantes a releer antes de enviar

- 2.5.1 (APIs públicas), 3.1.1 y 3.1.2 (compras y suscripciones: precio, periodo, prueba, renovación y cancelación visibles antes de comprar — implementado en `PaywallView`).
- 4.2 (funcionalidad mínima), 5.1.1 (privacidad), 5.2.2 y 5.2.3 (servicios y contenido de terceros).
- Lineamientos de Family Controls / Screen Time API.
- No usar Stripe ni enlaces de pago externos para desbloquear funciones digitales en iOS.

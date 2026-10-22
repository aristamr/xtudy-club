# Presente — Arquitectura, viabilidad y riesgos

> "Quédate con las personas. Elimina el algoritmo."
> Nombre de trabajo: **Presente** (bundle `mx.xtudy.presente`). Cambiarlo es editar `project.yml` y `CFBundleDisplayName`.

## 1. Resumen honesto

iOS **no permite** que una app modifique el interior de otra app (Instagram o YouTube nativos). Por eso Presente combina dos mecanismos permitidos:

1. **Experiencia filtrada propia**: Instagram y YouTube se abren en un `WKWebView` dentro de Presente, cargando sus sitios web móviles oficiales. Un filtro local (en el iPhone) oculta Reels, Shorts, Explore y recomendaciones.
2. **Bloqueo opcional de las apps nativas** con las APIs oficiales de Screen Time (`FamilyControls`, `ManagedSettings`, `DeviceActivity`). No modifica las apps: muestra la pantalla "en pausa" de iOS y la persona usa la versión filtrada.

Lo que **no** hace Presente: no pide contraseñas, no lee cookies, no envía sesiones a ningún servidor, no tiene backend, no usa analítica ni publicidad, no evade restricciones de Apple, Instagram o Google (no falsifica el user agent ni oculta que es un WebView).

## 2. Matriz de funcionalidades

| Función | Estado | Cómo / por qué |
|---|---|---|
| **Instagram** | | |
| Bloquear el feed de Reels (`/reels/`) | ✅ Viable | Redirección nativa (política de navegación) + JS (rutas SPA y toques interceptados). Probado. |
| Quitar Reels de la navegación | ✅ Viable | CSS sobre `a[href^="/reels/"]`. Probado en fixtures; **verificar en dispositivo** (ver QA). |
| Reel individual compartido por un amigo | ⚠️ Parcial | Se abre como publicación (`/p/<id>/`), sin el carrusel infinito. Depende de que Instagram siga sirviendo reels en `/p/`. Verificar en dispositivo. |
| Eliminar Explore | ✅ Viable | `/explore/` → `/explore/search/` (la búsqueda de perfiles se conserva); `/explore/tags|locations` bloqueados. |
| Ocultar sugerencias | ⚠️ Parcial | Inicio forzado a `/?variant=following` (solo cuentas seguidas, cronológico) + ocultado por texto ("Sugerencias para ti", "Suggested for you", …). Instagram puede cambiar textos o la variante; las reglas se actualizan en un JSON. |
| Publicaciones de cuentas seguidas, perfiles | ✅ Viable | No se tocan. |
| Mensajes directos | ⚠️ Depende de Instagram | `/direct/` funciona en la web móvil hoy. Instagram ha limitado funciones de DM en web en el pasado; si lo hace, no hay alternativa permitida. |
| Iniciar sesión | ⚠️ Depende de Instagram | Login oficial de instagram.com dentro del WebView. Instagram puede pedir verificación adicional o bloquear WebViews. "Continuar con Facebook" se permite (dominio facebook.com) sin inyectar scripts. |
| Publicar contenido | ➡️ App nativa | La web móvil permite publicar de forma limitada. Para publicar se usa "Necesito publicar" (abre la app original; si está bloqueada, la libera 5 min). |
| **YouTube** | | |
| Bloquear Shorts | ✅ Viable | Pestaña, estantes y resultados ocultos; enlaces `/shorts/<id>` se abren como video normal (`/watch?v=<id>`). |
| Ocultar recomendaciones del inicio | ✅ Viable | El inicio se sustituye por un buscador propio, local. |
| Búsqueda intencional | ✅ Viable | Buscador del inicio y de YouTube intactos. |
| Videos normales | ✅ Viable | Reproductor oficial de YouTube; nada se reproduce sin un toque (`mediaTypesRequiringUserActionForPlayback = .all`). |
| Evitar reproducción encadenada | ⚠️ Mejor esfuerzo | Se ocultan relacionados y pantalla final, se apaga el interruptor de autoplay y se revierte un cambio de video sin toque. Verificar en dispositivo. |
| Suscripciones (feed de canales) | ⚠️ Parcial | **Google bloquea el inicio de sesión en WebViews integrados** ("este navegador no es seguro"). No lo evadimos. Alternativa: **"Mis canales"**, lista local de canales (`@canal/videos`, orden cronológico). Si el login de Google sí funcionara, `/feed/subscriptions` está permitido. |
| **Control de apps** | | |
| Bloquear apps nativas | ✅ Viable con permiso | `ManagedSettingsStore.shield`. Requiere aprobación de la persona (Tiempo en pantalla) y el *entitlement* Family Controls (distribución requiere solicitud a Apple). **No funciona en Simulador.** |
| Identificar automáticamente Instagram/YouTube | ❌ No viable | Los tokens son opacos; la persona elige las apps en `FamilyActivityPicker`. |
| "Necesito publicar" (5 min) | ✅ Viable con matiz | `DeviceActivity` exige intervalos ≥ 15 min (usamos 16 por margen). Se programa un intervalo que **termina** en ahora+5 min (empieza 11 min en el pasado, para un intervalo de 16 min). Al terminar, la extensión `PresenteMonitor` reaplica el bloqueo. Respaldo: al volver a primer plano, Presente reaplica si ya venció. Libera **todas** las apps elegidas (iOS no dice cuál es cuál). Verificar en dispositivo. |
| Datos reales de Tiempo en pantalla en "tu vida en semanas" | ❌ No en el MVP | `DeviceActivityReport` solo muestra datos dentro de una extensión aislada; la app no puede leer los números. Se usa una estimación declarada y se rotula como tal. |
| **Negocio** | | |
| Suscripción $39 MXN/mes | ✅ Viable | StoreKit 2, un solo producto `mx.xtudy.presente.monthly`. El precio mostrado siempre es `Product.displayPrice`. |

## 3. Arquitectura

```
ios/
├── project.yml                  XcodeGen → Presente.xcodeproj
├── Packages/PresenteCore/       Lógica pura (iOS/macOS/Linux), con pruebas
│   ├── Resources/Rules/*.json   Reglas por plataforma  ← lo que se edita cuando cambia el HTML
│   ├── Resources/Scripts/       engine.js (genérico) + instagram.js / youtube.js (comportamientos)
│   ├── FilterEngine.swift       Política de navegación + composición del script
│   ├── LifeWeeks.swift          Matemática de "tu vida en semanas"
│   ├── UnlockWindow.swift       Ventana de 5 min compatible con DeviceActivity
│   ├── Entitlement.swift        Estado de suscripción (independiente de StoreKit)
│   └── SavedChannels.swift      "Mis canales" de YouTube
├── Presente/                    App SwiftUI
│   ├── Onboarding/              4 pantallas
│   ├── Home/                    "Estás protegido." + 2 accesos + "Necesito publicar"
│   ├── Browser/                 WKWebView filtrado
│   ├── ScreenTime/              FamilyControls / ManagedSettings / DeviceActivity
│   ├── Store/                   StoreKit 2 (desacoplado del filtrado)
│   └── Settings/
├── Shared/ShieldStore.swift     Compartido app ↔ extensión (App Group)
├── PresenteMonitor/             Extensión DeviceActivityMonitor (reaplica el bloqueo)
├── PresenteShield/              Extensión ShieldConfiguration (texto de la pantalla de pausa)
├── PresenteTests/               Pruebas StoreKit (SKTestSession) en Simulador
└── web-tests/                   Pruebas del filtro JS con Playwright
```

### Motor de filtrado (por plataforma, separado)

Una sola fuente de verdad por plataforma, `Rules/<plataforma>.json`:

- `routes`: regex sobre `ruta?consulta` → redirección. Se evalúa **dos veces con la misma regla**: en Swift (`decidePolicyFor`, cargas completas) y en JS (navegación SPA con `history.pushState`, toques en enlaces). La primera regla que coincide decide.
- `hide`: selectores CSS por opción (una regla CSS por selector para que uno inválido no rompa los demás).
- `textRules`: frases que, si aparecen como texto exacto, ocultan su contenedor (`article`), con salvaguarda: nunca se oculta un elemento que contenga `main`, `nav` u otras publicaciones.
- `behaviors`: funciones con nombre en `instagram.js`/`youtube.js` (p. ej. `calmHome`, `autoplayGuard`).

Cada regla pertenece a una de las tres opciones del onboarding; apagar una opción quita exactamente sus reglas.

El script se inyecta con `WKUserScript(.atDocumentStart, forMainFrameOnly: true)` y **sale inmediatamente si el dominio no es de la plataforma**, de modo que nunca corre en páginas de inicio de sesión de Facebook/Google. El script no lee formularios, cookies, `localStorage` ni hace peticiones de red (hay una prueba que lo verifica).

Mantenimiento cuando Instagram/YouTube cambian: editar el JSON → `swift test` + `npm test` en `web-tests` → nueva versión en App Store. (Una mejora futura sería descargar reglas firmadas sin publicar versión; se dejó fuera del MVP para no tener backend.)

### Navegación

- Dominios de la plataforma → se muestran filtrados.
- Dominios de login oficiales → se muestran sin filtrar.
- Cualquier otro dominio → se abre en Safari (no somos un navegador general).
- Esquemas `instagram://`, `youtube://`, `intent://` → cancelados (evita que la web te mande a la app nativa sin pedirlo).
- `target=_blank` → misma vista. Si WebKit cierra su proceso, se recarga.

### Screen Time

- `AuthorizationCenter.requestAuthorization(for: .individual)` (iOS 16+), solicitado de forma contextual en la pantalla 4 o en Configuración, nunca al abrir la app.
- La selección (`FamilyActivitySelection`, Codable) se guarda en el App Group `group.mx.xtudy.presente` para que la extensión la lea.
- Antes de quitar el bloqueo, se programa su regreso; si eso falla, el bloqueo no se quita.

### Suscripción (StoreKit 2)

`SubscriptionStore` → `Product.products`, `purchase()`, `Transaction.updates`, `Transaction.currentEntitlements` (solo transacciones `.verified`), `AppStore.sync()` para restaurar, `manageSubscriptionsSheet`, periodo de gracia y renovación vía `subscription.status`. La decisión "¿tiene acceso?" vive en `EntitlementEvaluator` (puro, probado). El motor de filtrado no sabe nada de pagos.

Qué desbloquea la suscripción: abrir Instagram/YouTube filtrados. El onboarding, la configuración, el bloqueo de apps y "Necesito publicar" funcionan sin pagar (no retenemos a nadie con sus apps bloqueadas).

### Privacidad

- Sin cuentas propias, sin servidor, sin SDKs de terceros, sin analítica.
- Sesiones de Instagram/YouTube en `WKWebsiteDataStore.default()` del dispositivo; "Cerrar sesión" en Configuración las borra.
- `PrivacyInfo.xcprivacy`: sin tracking, sin datos recolectados; solo declara `UserDefaults` (CA92.1, 1C8F.1).

## 4. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| **App Store 4.2 / 5.2.2 / 5.2.3** (envoltorio web de servicios de terceros) | Media | Rechazo | La app aporta funcionalidad nativa real (Screen Time, onboarding, filtro), no se presenta como Instagram/YouTube, no usa sus logos, abre los sitios oficiales y no descarga contenido. Existen apps comparables aprobadas, pero no es garantía. Notas de revisión claras (ver APP-STORE.md). |
| **Términos de Meta/Google** (modificar la presentación de su sitio) | Media | Bloqueo o reclamo | Filtrado 100 % local y cosmético, sin scraping, sin automatización de cuentas, sin recolectar datos, sin ocultar anuncios (no es un bloqueador de publicidad). Recomendable revisión legal antes del lanzamiento. |
| **Cambios de HTML** en Instagram/YouTube | Alta (continua) | Filtros dejan de funcionar | Reglas en JSON, pruebas automáticas, checklist manual semanal; la redirección de rutas no depende del HTML y es la parte más estable. |
| **Login de Google bloqueado en WebView** | Alta | Sin suscripciones de YouTube | "Mis canales" local. No evadimos la política. |
| **Instagram bloquea o limita el WebView / DMs en web** | Baja-media | Pérdida de funciones | Sin alternativa permitida; se informaría y se ajustaría la oferta. |
| **Family Controls (distribución)** | Media | No se puede publicar la parte de bloqueo | Solicitar el *entitlement* a Apple desde el inicio (requiere uno por cada bundle ID: app y 2 extensiones). Si se niega, la app funciona sin bloqueo (es opcional) y hay que quitar el entitlement y el texto de la oferta. |
| **DeviceActivity no dispara `intervalDidEnd`** en algún caso | Baja | Apps quedan desbloqueadas más tiempo | Respaldo al abrir Presente; validar en dispositivo real con el plan de QA. |
| **Precio**: $39 MXN debe existir como punto de precio en App Store Connect | Baja | Precio distinto | Configurar en App Store Connect; la app solo muestra `displayPrice`. |

## 5. Qué está verificado y qué no

- ✅ **Verificado automáticamente en este repositorio**: 32 pruebas de `PresenteCore` (Swift 6.1, Linux) y 19 pruebas del filtro JS en Chromium contra páginas que imitan la estructura de Instagram y YouTube.
- ⚠️ **Escrito pero no compilado aquí**: la app SwiftUI, las extensiones y las pruebas de StoreKit requieren Xcode en macOS (este entorno es Linux). Primer paso en Mac: `xcodegen && xcodebuild test` (ver INSTALAR.md).
- ⚠️ **Requiere verificación manual en iPhone real**: selectores contra los sitios reales de hoy, Screen Time, desbloqueo de 5 min, login. Ver `QA.md`. **Ninguna función debe anunciarse como lista hasta marcarla en QA.**

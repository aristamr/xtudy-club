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
| Mensual $39 MXN con 7 días gratis | ✅ Viable | StoreKit 2, suscripción `mx.xtudy.presente.monthly` con oferta introductoria gratuita de 1 semana. La prueba solo se muestra si StoreKit confirma la elegibilidad. |
| Lifetime $499 MXN | ✅ Viable | Compra no consumible `mx.xtudy.presente.lifetime`. Gana sobre cualquier suscripción; si había una activa, se avisa que no se cancela sola y se ofrece administrarla. |

### Estado por plataforma

| Plataforma | Estado | Qué se filtra | Qué se conserva | Límites conocidos |
|---|---|---|---|---|
| Instagram | Parcial | Reels (pestaña y feed), Explore (→ búsqueda), sugerencias; inicio en "Siguiendo" | Mensajes, perfiles, publicaciones de cuentas seguidas, búsqueda | Verificar en iPhone; DMs en web dependen de Meta |
| YouTube | Parcial | Shorts, inicio algorítmico (→ buscador), relacionados, pantalla final, autoplay | Búsqueda, videos completos, "Mis canales" | Google bloquea el login en WebViews |
| TikTok | Experimental | "Para ti" (→ Siguiendo), Explore, LIVE, sugerencias | Búsqueda, perfiles, Siguiendo (con sesión) | La web casi no tiene mensajes; todo es video corto |
| Facebook | Experimental | Reels, Watch, sugerencias; inicio "Más recientes"; tope de feed | Publicaciones de amigos, perfiles, grupos | Messenger web móvil suele mandar a la app |
| X | Experimental | "Para ti" (→ Siguiendo), tendencias, "A quién seguir"; tope de feed | Mensajes, perfiles, búsqueda | Login de X puede pedir verificaciones |
| Reddit | Experimental | Popular, All, Explore, carruseles; tope de feed | Comunidades, chat, búsqueda | Inicio de Reddit mezcla recomendaciones |
| LinkedIn | Experimental | Publicaciones sugeridas, video; tope de feed | Red, mensajes, empleos, perfiles | Mensajería web móvil puede mandar a la app |
| Threads | Experimental | "Para ti" (→ Siguiendo), sugerencias; tope de feed | Perfiles, búsqueda | Selectores sin verificar |
| Pinterest | Experimental | Inicio (→ buscador), "Hoy", "Más ideas" | Búsqueda, tableros, perfiles | Casi todo Pinterest es recomendación |
| Snapchat | No disponible | — | Pausa de la app con Tiempo en pantalla | web.snapchat.com solo funciona en computadora |

"Experimental" se muestra en la app como **Beta**, con un aviso dentro de la red. Nada pasa a "Verificada" sin completar `QA.md` en un iPhone real (`Platform.support` en `PresenteCore`; hay una prueba que impide marcar algo como verificado por accidente).

## 3. Arquitectura

```
ios/
├── project.yml                  XcodeGen → Presente.xcodeproj
├── Packages/PresenteCore/       Lógica pura (iOS/macOS/Linux), con pruebas
│   ├── FilterResources/Rules/*.json   Reglas por plataforma  ← lo que se edita cuando cambia el HTML
│   ├── FilterResources/Scripts/     engine.js + common.js (genéricos) + <plataforma>.js
│   ├── FilterEngine.swift       Política de navegación + composición del script
│   ├── LifeWeeks.swift          Matemática de "tu vida en semanas"
│   ├── UnlockWindow.swift       Ventana de 5 min compatible con DeviceActivity
│   ├── Entitlement.swift        Acceso (mensual, prueba, Lifetime) y reglas anti-duplicado
│   ├── TimeProjection.swift     Semana / año / 10 años y equivalencias
│   └── SavedChannels.swift      "Mis canales" de YouTube
├── Presente/                    App SwiftUI
│   ├── Onboarding/              5 pantallas
│   ├── Home/                    "Your space is clear." + redes activas + "I need to post"
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
- `behaviors`: funciones con nombre y parámetros. Genéricas en `common.js`: `calmHome` (inicio → buscador), `preferTab` (elige "Siguiendo"; solo hace clic en `role="tab"`, nunca en botones de seguir), `feedCap` (cierra feeds infinitos tras N publicaciones). Específicas en `<plataforma>.js` (p. ej. `autoplayGuard` de YouTube).
- Mensajes: las mismas rutas se aplican dentro de los chats, así que un Reel o un Explore compartido no abre el feed infinito, pero el historial, la escritura y el regreso a la bandeja no se tocan (probado con fixtures).

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

`SubscriptionStore` → `Product.products` (mensual + Lifetime), `isEligibleForIntroOffer`, `purchase()`, `Transaction.updates`, `Transaction.currentEntitlements` (solo transacciones `.verified`), `AppStore.sync()` para restaurar, `manageSubscriptionsSheet`, periodo de gracia y renovación vía `subscription.status`. La decisión "¿tiene acceso?" vive en `EntitlementEvaluator` y "¿qué se puede comprar?" en `PurchaseRules` (ambos puros y probados). El motor de filtrado no sabe nada de pagos. Precios y fechas siempre de StoreKit; nada se compra sin elegir un plan y tocar el botón.

Qué desbloquean los planes: abrir las redes filtradas. El onboarding, la configuración, el bloqueo de apps y "Necesito publicar" funcionan sin pagar (no retenemos a nadie con sus apps bloqueadas).

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

- ✅ **Verificado automáticamente (CI)**: 47 pruebas de `PresenteCore`, 26 pruebas del filtro JS contra páginas que imitan cada red, traducciones completas en 6 idiomas, y en Xcode: app + 2 extensiones + 16 pruebas en Simulador (15 de StoreKit). También compila sin cuenta de Apple Developer con el Xcode más reciente.
- 📸 **Evidencia visual**: `docs/evidence/screenshots/` (generadas por CI) y `docs/evidence/live-sites/` (sitios reales, sin sesión).
- ⚠️ **Requiere verificación manual en iPhone real**: selectores contra los sitios reales de hoy, Screen Time, desbloqueo de 5 min, login. Ver `QA.md`. **Ninguna función debe anunciarse como lista hasta marcarla en QA.**

# Presente v2 — Reporte de entrega

_2026-10-23 · rama `claude/scroll-addiction-app-64hn7k`_

> "Keep the social. Lose the noise."
> Este reporte separa lo verificado de lo que falta probar. Nada se marca como listo sin evidencia.

## 1. Cambios realizados

- **Redes:** Instagram y YouTube (parciales) + TikTok, Facebook, X, Reddit, LinkedIn, Threads y Pinterest (Beta) + Snapchat (no disponible; solo pausa con Tiempo en pantalla). Motor modular: un JSON de reglas por red, comportamientos genéricos reutilizables (`calmHome`, `preferTab`, `feedCap`) y estado de soporte honesto por red.
- **Mensajería sin distracciones:** los enlaces compartidos a Reels/Explore dentro de un chat no abren el feed infinito; el historial, la escritura y el regreso a la bandeja no se tocan.
- **Onboarding de 5 pantallas:** Antes/Después interactivo, tiempo diario (2 h por defecto, editable de 5 en 5 min hasta 12 h), vida en semanas con animación progresiva, tiempo recuperable (semana, año, 10 años + equivalencias con supuestos visibles), y planes.
- **Pagos:** mensual $39 MXN con 7 días gratis para cuentas elegibles (StoreKit decide), y Lifetime $499 MXN de pago único. Aviso y enlace a "Administrar suscripción" si se compra Lifetime con el mensual activo. Sin compras duplicadas. Precios y fechas siempre de StoreKit.
- **Identidad visual:** blanco cálido, gris suave, negro elegante, verde salvia; modo claro y oscuro; pantalla principal "Your space is clear."; nuevo ícono.
- **Idiomas:** inglés (base), español, francés, alemán, portugués e italiano con String Catalog; verificador automático de completitud.
- **Privacidad:** política en inglés y español (`docs/PRIVACY.md`, versión web lista en `public/presente/privacy/`).
- **Evidencia automática en CI:** capturas del onboarding en 6 idiomas, modo oscuro e iPhone pequeño; verificación contra los sitios reales.

## 2. Estado por categoría

### ✅ Implementado y verificado (automáticamente)

| Qué | Evidencia |
|---|---|
| La app y sus 2 extensiones compilan en Xcode 16 y en el Xcode más reciente, también **sin cuenta de Apple Developer** | CI de GitHub |
| Cálculos: semanas vividas/sueño/scroll/libre suman exacto; 2 h/día = 14 h/semana, 731 h y 30 días al año, 304 días en 10 años; equivalencias; coherencia entre pantallas 3 y 4 | 47 pruebas del núcleo |
| Compras con StoreKit Testing: productos y precios, elegibilidad de prueba, inicio de prueba, cobro tras la prueba, cancelación, expiración, reembolso de mensual y de Lifetime, Lifetime después de suscripción (aviso + acceso tras expirar), restaurar, compra fallida, compra pendiente | 15 pruebas en Simulador |
| Motor de filtrado contra páginas de prueba de cada red (incluye DMs y "nunca tocar botones de seguir") | 26 pruebas |
| YouTube real, sin sesión: inicio algorítmico oculto + buscador; Shorts fuera de la barra, de búsquedas y estantes; relacionados ocultos | `docs/evidence/live-sites/` |
| Redirecciones reales: Instagram Explore → búsqueda, TikTok → Siguiendo, Reddit Popular → inicio, Facebook → Más recientes, Pinterest inicio → buscador | `docs/evidence/live-sites/` |
| Traducciones completas en 6 idiomas (196 cadenas, mismos marcadores de formato) | `scripts/l10n.py check` |
| Diseño de las 8 pantallas principales en 6 idiomas, claro/oscuro | `docs/evidence/screenshots/` (revisadas una por una; problemas encontrados y corregidos) |

### 🟡 Implementado, pendiente de prueba real

| Qué | Por qué falta | Cómo probarlo |
|---|---|---|
| Filtros con sesión iniciada en todas las redes | Requiere cuentas reales en un iPhone | `QA.md` sección F |
| Bloqueo de apps con Tiempo en pantalla y "I need to post" (5 min) | No funciona en Simulador; requiere iPhone real | `QA.md` sección H |
| Pagos reales (Sandbox/TestFlight) | StoreKit Testing no prueba producción; requiere App Store Connect | `QA.md` sección G |
| VoiceOver, Dynamic Type XXL, otros tamaños de iPhone | Las capturas automáticas usan tamaño de texto estándar | `QA.md` sección B7 |
| Estabilidad prolongada | Requiere uso real | `QA.md` sección I |

### 🟠 Parcialmente implementado

| Qué | Límite |
|---|---|
| YouTube suscripciones | Google bloquea el inicio de sesión en vistas web integradas; alternativa "Mis canales" local |
| TikTok, Facebook, X, Reddit, LinkedIn, Threads, Pinterest | Reglas escritas, **sin verificar con sesión**; se muestran como Beta con aviso |
| Tope de feeds infinitos | Funciona en pruebas; los selectores de publicación de cada red deben confirmarse con sesión |
| Mensajes en TikTok, Facebook y LinkedIn | La web móvil de esas redes tiene mensajería limitada o manda a la app |
| X | El sitio mostró un desafío anti-bots en la verificación automática; no se pudo comprobar |

### ⛔ No viable o bloqueado

| Qué | Motivo |
|---|---|
| Modificar el interior de las apps nativas | iOS no lo permite a ninguna app |
| Snapchat filtrado | web.snapchat.com solo funciona en computadora; se ofrece solo la pausa de la app |
| Saber cuál app eligió la persona en Tiempo en pantalla | Apple entrega identificadores opacos; por eso "I need to post" libera todas las apps elegidas |
| Usar datos reales de Tiempo en pantalla en el onboarding | Apple solo los muestra dentro de una extensión aislada; se usa la estimación de la persona y se rotula así |
| Análisis de la grabación de SocialLite | La grabación no llegó a esta sesión; el onboarding es diseño original |
| Publicar sin el permiso Family Controls de distribución | Hay que solicitarlo a Apple (ver APP-STORE.md) |

## 3. Pendientes del negocio (requieren tu cuenta)

1. Solicitar a Apple el entitlement **Family Controls (Distribution)** para los 3 bundle IDs.
2. Crear en App Store Connect: suscripción mensual con prueba de 1 semana y producto Lifetime (ver APP-STORE.md).
3. Publicar la política de privacidad y poner un **correo de contacto real** (hoy dice "[contact email]").
4. Revisión legal de términos de las redes.
5. Probar en un iPhone real con `QA.md` y subir a TestFlight.

## 4. Cómo ver la app hoy

- **Simulador (gratis, sin cuenta):** `cd ~/xtudy-club/ios && git pull && xcodegen && open Presente.xcodeproj`, elegir un iPhone y ⌘R.
- **iPhone real:** `docs/INSTALAR.md` (requiere cuenta de Apple Developer para Tiempo en pantalla).

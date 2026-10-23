# Plan de pruebas y validación (v2)

Marca cada casilla con fecha, versión de iOS y resultado. **Una función no se anuncia hasta que su fila está en verde en un iPhone real.** Nunca se inventan resultados: lo que no se probó dice "pendiente".

## A. Automáticas (CI de GitHub en cada cambio)

| Suite | Dónde | Cubre | Último resultado |
|---|---|---|---|
| PresenteCore | Linux, Swift 6.1 · también en Xcode | Rutas y redirecciones de las 9 redes, opciones apagadas, script sin acceso a credenciales, niveles de soporte honestos, semanas de vida (suma exacta, sueño/scroll/libre), proyección semana/año/10 años y equivalencias, ventana de desbloqueo (mínimo de 15 min con margen, medianoche), acceso mensual/prueba/Lifetime/reembolso, reglas anti-compra-duplicada, fecha del primer cobro, protección contra bucles | ✅ 47/47 |
| Filtro web | Chromium (Playwright) contra páginas de prueba | Instagram (Siguiendo, Reels, sugerencias, Explore→búsqueda, reel→publicación, DMs, SPA), YouTube (inicio tranquilo, Shorts, relacionados, autoplay), X (pestaña Siguiendo sin tocar botones de seguir, tendencias, tope de feed), mensajes que no escapan a Reels/Explore, TikTok, Reddit, Pinterest, Facebook | ✅ 26/26 |
| Traducciones | `scripts/l10n.py check` | 192 cadenas × en, es, fr, de, pt, it; marcadores de formato idénticos; ninguna cadena del código sin traducir | ✅ completas |
| Xcode 16 + StoreKit | macOS 15, Simulador | Compila app + 2 extensiones; productos y precios ($39 mensual con 7 días gratis, $499 Lifetime); elegibilidad; inicio de prueba; cobro después de la prueba (renovación forzada); cancelación de renovación; expiración; reembolso de suscripción y de Lifetime; Lifetime para siempre; Lifetime después de suscripción (aviso + acceso tras expirar); restaurar; restaurar sin compras; compra fallida; compra pendiente ("pedir compra"); navegador filtrado creable para las 9 redes | ✅ 16/16 (+ núcleo) |
| Sin cuenta, Xcode más reciente | macOS 26, Xcode 26.6, firma por defecto | Compila como en una Mac sin Apple Developer | ✅ |
| Capturas | Simulador, modo demo | 8 pantallas × 6 idiomas, modo oscuro, iPhone pequeño | ver `docs/evidence/screenshots/` |
| Sitios reales | WebKit (motor de Safari), sin sesión | Ver tabla E | ✅ ejecutado (ver resultados) |

> Las pruebas con páginas de prueba garantizan que el motor hace lo que dicen las reglas, **no** que las reglas coincidan con el HTML real de hoy; eso lo cubren las secciones E y F.
> StoreKit Testing simula al App Store: **no prueba pagos en producción**. Eso requiere Sandbox/TestFlight (sección G).

## B. Onboarding (iPhone o Simulador)

| # | Paso | Esperado | ✓ |
|---|---|---|---|
| B1 | Instalar limpio | Pantalla 1 "Your social apps. Without the noise." con comparación Antes/Después que se mueve sola y se puede arrastrar; Instagram/YouTube | |
| B2 | Pantalla 2 | Valor inicial 2 h; −/+ de 5 en 5 min (hasta 12 h), deslizador, atajos 30 min…5 h+ | |
| B3 | Pantalla 3 | Edad editable; cuadrícula de 90×52 que se llena en orden (vivido, sueño, scroll, libre); leyenda con semanas | |
| B4 | Pantalla 4 | Con 2 h: 14 h/semana, 731 h y 30 días al año, 304 días en 10 años; "si recuperaras la mitad": 60 libros, 487 entrenamientos, 730 lecciones, 121 tardes, 45 noches | |
| B5 | Pantalla 5 | Dos planes, ninguno preseleccionado; condiciones de cobro cambian según el plan; Restaurar, Términos, Privacidad; "Not now" | |
| B6 | Tiempo sin permisos ni compra | < 60 s | |
| B7 | Modo oscuro, Dynamic Type XXL, VoiceOver | Legible, sin cortes; VoiceOver lee resúmenes de la comparación y de la cuadrícula | |
| B8 | iPhone en es, fr, de, pt, it | Todo traducido, sin textos cortados | |

## C. Pantalla principal y Configuración

| # | Acción | Esperado | ✓ |
|---|---|---|---|
| C1 | Con plan | "Your space is clear.", estado de filtros y de apps originales, redes activas | |
| C2 | Sin plan | "Your space is ready." + "See plans"; tocar una red abre los planes | |
| C3 | Configuración › Your networks | Activar X/Reddit… aparecen en inicio con etiqueta Beta; Snapchat deshabilitado con explicación | |
| C4 | Sign out of all networks | Borra sesiones | |

## D. Mensajería (iPhone, con sesión)

| # | Acción | Esperado | ✓ |
|---|---|---|---|
| D1 | Instagram › Mensajes › conversación larga | Se lee completa, se desplaza, se escribe y responde | |
| D2 | Tocar un reel compartido | Se abre como publicación individual, sin carrusel | |
| D3 | Tocar un enlace a Explore/Reels | Regresa a búsqueda/inicio con aviso | |
| D4 | Volver a la bandeja | Funciona | |
| D5 | X › Mensajes | Funciona | |

## E. Filtros contra sitios reales — automático (WebKit, sin sesión)

Resultado del CI del 2026-10-23 (`docs/evidence/live-sites/`):

| Red | Prueba | Resultado observado |
|---|---|---|
| YouTube | Inicio | ✅ Inicio algorítmico oculto, buscador propio visible, pestaña Shorts oculta |
| YouTube | Búsqueda | ✅ 8 Shorts, 2 estantes de Shorts, 6 resultados que eran Shorts y 34 enlaces a Shorts ocultos |
| YouTube | Video | ✅ Sección de relacionados oculta |
| Instagram | `/explore/` | ✅ Redirigido a `/explore/search/` (luego Instagram pide iniciar sesión) |
| TikTok | `/` | ✅ Redirigido a `/following` |
| Reddit | `/r/popular/` | ✅ Redirigido a `/` |
| Facebook | `/` | ✅ Redirigido a "Más recientes" (`?sk=h_chr`); luego pide iniciar sesión |
| Pinterest | `/` | ✅ Inicio sustituido por buscador |
| X | `/explore` | ⚠️ No verificable: X mostró un desafío anti-bots (Cloudflare) |
| LinkedIn, Threads, Instagram (perfil) | — | ⚠️ No verificable sin sesión (piden iniciar sesión) |

## F. Filtros con sesión (iPhone real) — pendiente

Repetir **semanalmente** y después de cada actualización de iOS o de una red.

| # | Red | Acción | Esperado | ✓ |
|---|---|---|---|---|
| F1 | Instagram | Iniciar sesión | Login oficial; Presente nunca muestra su propio campo de contraseña | |
| F2 | Instagram | Inicio | Solo cuentas seguidas; sin "Sugerencias para ti" | |
| F3 | Instagram | Barra | Sin Reels; Inicio, Buscar, Mensajes y Perfil visibles | |
| F4 | YouTube | Iniciar sesión con Google | **Esperado: Google lo bloquea.** Documentar | |
| F5 | YouTube | Dejar terminar un video | No empieza otro solo | |
| F6 | TikTok | Con sesión | Abre en Siguiendo; perfiles y búsqueda | |
| F7 | X | Con sesión | Pestaña Siguiendo elegida; sin tendencias; tope tras 40 publicaciones | |
| F8 | Reddit, Facebook, LinkedIn, Threads, Pinterest | Con sesión | Lo de la tabla de ARQUITECTURA.md; anotar qué falla | |
| F9 | Cualquiera | Enlace externo | Se abre en Safari | |
| F10 | Cualquiera | Modo avión | "You're offline" + Try again; sin cierre | |
| F11 | Cualquiera | Apagar cada filtro y reabrir | Solo desaparece ese filtro | |

Cuando una red Beta pase su fila F, cambia su `support` en `Platform.swift` y en la tabla de ARQUITECTURA.md.

## G. Compras en Sandbox / TestFlight — pendiente

| # | Acción | Esperado | ✓ |
|---|---|---|---|
| G1 | Precios | Los de App Store Connect ($39 MXN y $499 MXN en México) | |
| G2 | Cuenta Sandbox nueva › Mensual | "7 days free" visible; hoja de Apple; estado "Free trial" con fecha del primer cobro | |
| G3 | Esperar renovaciones aceleradas | Pasa a "Monthly plan" | |
| G4 | Cancelar en Ajustes | Sigue activa hasta vencer; luego pierde acceso | |
| G5 | Cuenta que ya usó la prueba | No se muestra "7 days free" | |
| G6 | Lifetime con mensual activo | Aviso de que el mensual no se cancela solo + enlace para administrarlo; después "Lifetime — yours to keep" | |
| G7 | Borrar app, reinstalar, Restaurar | Recupera acceso | |
| G8 | Sin red en la pantalla de planes | Mensaje + Try again | |

## H. Control de apps (solo iPhone real) — pendiente

Igual que la versión anterior: permiso, elegir apps, pantalla de pausa, "I need to post" 5 min (también con la app cerrada y cerca de medianoche), reinicio del iPhone, apagar el interruptor, revocar el permiso.

## I. Estabilidad — pendiente

- [ ] 30 min de uso mixto sin cierres (Xcode › Organizer › Crashes).
- [ ] Memoria estable al abrir/cerrar redes 20 veces (Instruments › Leaks).

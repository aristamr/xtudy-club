# Plan de pruebas y validación

Marca cada casilla con fecha, versión de iOS y resultado. **Una función no se anuncia hasta que su fila está en verde en un iPhone real.**

## A. Automáticas (en cada cambio)

| Suite | Comando | Cubre | Último resultado |
|---|---|---|---|
| PresenteCore | `cd Packages/PresenteCore && swift test` | Política de navegación (Reels, Explore, inicio, Shorts, youtu.be, dominios externos, login), opciones apagadas, script sin acceso a credenciales, matemática de semanas, proyección a 10 años, ventana de desbloqueo (mínimo de 15 min, medianoche), estados de suscripción, canales guardados | ✅ 32/32 (Swift 6.1.3, Linux) |
| Filtro web | `cd web-tests && npm test` | Inicio en "Siguiendo", Reels oculto en navegación, sugerencias ocultas (también las que llegan con scroll), SPA hacia Reels, Explore → búsqueda, reel de amigo → publicación, DMs intactos, opción apagada, script inactivo en Facebook; YouTube: inicio tranquilo + buscador, Shorts ocultos, `/shorts/id` → video, relacionados/pantalla final ocultos, autoplay apagado y revertido, video elegido sí abre; protección contra bucles de redirección | ✅ 19/19 (Chromium 1194) |
| StoreKit | `xcodebuild test -scheme Presente …` | Producto y precio $39 MXN mensual, sin compra = bloqueado, compra activa, expiración, reembolso, renovación cancelada sigue activa hasta vencer, restaurar sin compra, compra fallida | ⏳ Pendiente de correr en Mac |

> Las pruebas web usan páginas que imitan la estructura de Instagram/YouTube. Garantizan que el motor hace lo que dicen las reglas, **no** que las reglas coincidan con el HTML real de hoy. Eso lo valida la sección C.

## B. Onboarding (iPhone o Simulador)

| # | Paso | Esperado | ✓ |
|---|---|---|---|
| B1 | Instalar limpio y abrir | Pantalla "Tu tiempo es tuyo." | |
| B2 | Comenzar → semanas | Cuadrícula de 90×52, leyenda, frase "Si sigues dedicando 120 minutos…, equivalen a 304 días completos durante los próximos 10 años." | |
| B3 | Cambiar edad y minutos | La cuadrícula y la frase cambian al instante; suma de categorías constante | |
| B4 | Continuar → filtros | Tres opciones activadas | |
| B5 | Eliminar distracciones → activación | Tarjeta de Screen Time + oferta con precio del App Store, qué incluye, cuándo se cobra y cómo cancelar | |
| B6 | Tiempo total sin permisos | < 60 s | |
| B7 | Modo oscuro, Dynamic Type XXL, VoiceOver | Legible, sin cortes; VoiceOver lee el resumen de la cuadrícula | |
| B8 | Idioma del iPhone en inglés | Textos en inglés | |

## C. Filtros contra los sitios reales (iPhone, con sesión iniciada)

Repetir **semanalmente** y después de cada actualización de iOS.

| # | Acción | Esperado | ✓ |
|---|---|---|---|
| C1 | Abrir Instagram e iniciar sesión | Login oficial funciona; Presente nunca muestra su propio campo de contraseña | |
| C2 | Inicio | Solo cuentas seguidas (`?variant=following`); sin "Sugerencias para ti" | |
| C3 | Barra inferior | Sin Reels; Inicio, Buscar, Mensajes y Perfil visibles | |
| C4 | Tocar Buscar | Abre búsqueda de perfiles, sin cuadrícula de Explore | |
| C5 | Abrir `instagram.com/reels/` desde un enlace | Regresa al inicio con aviso "Reels está desactivado" | |
| C6 | Abrir un reel enviado por DM | Se ve como publicación individual, sin deslizar a otros reels | |
| C7 | Mensajes directos | Lista y conversación funcionan; se pueden enviar mensajes | |
| C8 | Perfil de otra cuenta | Visible con sus publicaciones | |
| C9 | Abrir YouTube | Inicio sin recomendaciones; buscador propio | |
| C10 | Buscar "receta" | Resultados sin Shorts | |
| C11 | Reproducir un video | Solo empieza al tocar; sin relacionados debajo | |
| C12 | Dejar terminar el video | No empieza otro solo (o se revierte con aviso) | |
| C13 | Abrir un enlace `youtube.com/shorts/…` | Se abre como video normal | |
| C14 | Canal → Mis canales → Guardar | Aparece en la lista y abre `/@canal/videos` | |
| C15 | Iniciar sesión en Google | **Esperado: Google lo bloquea.** Documentar el resultado | |
| C16 | Enlace externo en una bio | Se abre en Safari | |
| C17 | Modo avión | Mensaje "Sin conexión" + Reintentar; sin cierre | |
| C18 | Apagar cada opción en Configuración y reabrir | Solo desaparece el filtro de esa opción | |

## D. Control de apps (solo iPhone real)

| # | Acción | Esperado | ✓ |
|---|---|---|---|
| D1 | Permitir Tiempo en pantalla | Diálogo del sistema; estado aprobado | |
| D2 | Elegir Instagram y YouTube | "Apps elegidas: 2"; inicio dice "Apps originales en pausa" | |
| D3 | Abrir Instagram nativo | Pantalla "Esta app está en pausa" de Presente | |
| D4 | Necesito publicar → Abrir Instagram | Instagram abre sin bloqueo; contador en el inicio de Presente | |
| D5 | Esperar 5 min **sin abrir Presente** | Instagram vuelve a bloquearse solo (extensión) | |
| D6 | Necesito publicar, cerrar Presente a la fuerza, esperar 5 min | Se vuelve a bloquear | |
| D7 | Necesito publicar a las 23:58 | Se vuelve a bloquear a las 00:03 (no mañana) | |
| D8 | Reiniciar el iPhone con bloqueo activo | Sigue bloqueado | |
| D9 | Apagar el interruptor | Apps libres de inmediato | |
| D10 | Revocar permiso en Ajustes › Tiempo en pantalla | Presente lo detecta al volver y ofrece permitir de nuevo | |

## E. Suscripción en Sandbox/TestFlight

| # | Acción | Esperado | ✓ |
|---|---|---|---|
| E1 | Precio en la oferta | El configurado en App Store Connect ($39 MXN en México) | |
| E2 | Comprar | Hoja de Apple; al confirmar, "Suscripción activa" y acceso a plataformas | |
| E3 | Cancelar y dejar vencer | Pierde acceso; vuelve a ver la oferta | |
| E4 | Borrar app, reinstalar, Restaurar | Recupera acceso | |
| E5 | Administrar suscripción | Abre la hoja del sistema | |
| E6 | Sin red al abrir la oferta | Mensaje claro + Reintentar | |

## F. Estabilidad

- [ ] 30 min de uso mixto sin cierres (revisar Xcode › Organizer › Crashes).
- [ ] Memoria estable al abrir/cerrar plataformas 20 veces (Instruments › Leaks).

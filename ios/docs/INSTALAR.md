# Instalar Presente en tu iPhone

Necesitas una Mac con **Xcode 16 o posterior** y un iPhone con **iOS 17 o posterior**.

## 1. Preparar (una sola vez)

```bash
# Homebrew: https://brew.sh
brew install xcodegen
git clone <este repositorio> && cd xtudy-club/ios
xcodegen            # crea Presente.xcodeproj a partir de project.yml
open Presente.xcodeproj
```

## 2. Firmar

1. En Xcode, selecciona el proyecto **Presente** → pestaña **Signing & Capabilities**.
2. Para **cada uno** de los 4 targets (Presente, PresenteMonitor, PresenteShield, PresenteTests) elige tu **Team**.
   - Para no repetirlo, pon tu Team ID en `project.yml` (`DEVELOPMENT_TEAM`) y vuelve a correr `xcodegen`.
3. Si el bundle `mx.xtudy.presente` ya está tomado en tu cuenta, cámbialo en `project.yml` (los 3 bundle IDs y el App Group `group.mx.xtudy.presente` en los 3 `.entitlements` y en `Shared/ShieldStore.swift`).
4. Capacidades que Xcode debe mostrar (ya vienen en los `.entitlements`):
   - **Family Controls** (app y las dos extensiones).
   - **App Groups** → `group.mx.xtudy.presente` (app y las dos extensiones).

> **Family Controls en desarrollo** funciona con una cuenta de desarrollador de pago, sin aprobación previa.
> **Para TestFlight/App Store** necesitas pedir el *entitlement* de distribución a Apple (ver APP-STORE.md).
> Con una cuenta gratuita (Personal Team) Family Controls no está disponible: quita esa capacidad para probar solo el filtrado.

## 3. Correr pruebas

```bash
# Lógica (no necesita simulador; también corre en Linux)
cd Packages/PresenteCore && swift test

# Filtro JS contra páginas de prueba (Node 20+)
cd ../../web-tests && npm install && npm test

# App + StoreKit en Simulador
cd .. && xcodebuild test -scheme Presente -destination 'platform=iOS Simulator,name=iPhone 16'
```

## 4. Instalar en el iPhone

1. Conecta el iPhone por cable (o misma red Wi‑Fi tras emparejarlo una vez).
2. En el iPhone: **Ajustes › Privacidad y seguridad › Modo de desarrollador** → actívalo y reinicia.
3. En Xcode elige tu iPhone como destino y pulsa **Run (⌘R)**.
4. La primera vez: **Ajustes › General › VPN y gestión de dispositivos** → confía en tu certificado de desarrollador.

## 5. Probar la suscripción

- **Simulador o iPhone desde Xcode**: el esquema usa `Presente.storekit` (precio $39 MXN). Las compras son simuladas; en Xcode › Debug › StoreKit › Manage Transactions puedes expirarlas, reembolsarlas o cancelar la renovación.
- **TestFlight / Sandbox**: crea el producto en App Store Connect (ver APP-STORE.md) y usa una cuenta Sandbox (Ajustes › App Store › Cuenta Sandbox).

## 6. Probar Screen Time

Solo en iPhone real (el Simulador no aplica bloqueos). Sigue la sección "Control de apps" de `QA.md`.

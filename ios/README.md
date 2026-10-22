# Presente (iOS)

Instagram y YouTube sin Reels, Shorts, Explore ni recomendaciones. *Quédate con las personas. Elimina el algoritmo.*

- **Arquitectura, matriz de viabilidad y riesgos** → [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md)
- **Instalar en un iPhone** → [docs/INSTALAR.md](docs/INSTALAR.md)
- **Plan de pruebas** → [docs/QA.md](docs/QA.md)
- **TestFlight / App Store** → [docs/APP-STORE.md](docs/APP-STORE.md)

```bash
brew install xcodegen && xcodegen && open Presente.xcodeproj   # app
cd Packages/PresenteCore && swift test                          # lógica
cd web-tests && npm install && npm test                         # filtro web
```

Cuando Instagram o YouTube cambien su HTML, edita `Packages/PresenteCore/Sources/PresenteCore/Resources/Rules/<plataforma>.json` y vuelve a correr las pruebas.

#!/bin/bash
# Capturas automáticas en el Simulador (modo demo, solo Debug). Uso: scripts/screenshots.sh <carpeta-salida>
# Requiere haber compilado: xcodebuild build -scheme Presente -destination 'generic/platform=iOS Simulator' -derivedDataPath build
set -euo pipefail
OUT="${1:-screenshots}"
APP=$(find build/Build/Products/Debug-iphonesimulator -maxdepth 1 -name 'Presente.app' | head -1)
BUNDLE=mx.xtudy.presente
mkdir -p "$OUT"

pick() { # primer simulador disponible cuyo nombre coincida
  xcrun simctl list devices available -j | python3 -c "
import json,sys
names=sys.argv[1:]
devs=[d for k,v in json.load(sys.stdin)['devices'].items() if 'iOS' in k for d in v]
for n in names:
    for d in devs:
        if d['name']==n: print(d['udid']); sys.exit()
for d in devs:
    if d['name'].startswith('iPhone'): print(d['udid']); sys.exit()
" "$@"
}

# Ejecuta un comando con límite de tiempo (macOS no trae `timeout`).
limit() { local secs=$1; shift; perl -e 'alarm shift; exec @ARGV' "$secs" "$@"; }

shoot() { # udid etiqueta idioma apariencia pantallas...
  local udid=$1 label=$2 lang=$3 look=$4; shift 4
  xcrun simctl ui "$udid" appearance "$look"
  for screen in "$@"; do
    local file="$OUT/${lang}-${look}-${label}-${screen}.png"
    echo "$(date +%T) $file"
    limit 30 xcrun simctl terminate "$udid" "$BUNDLE" >/dev/null 2>&1 || true
    limit 60 xcrun simctl launch "$udid" "$BUNDLE" -PresenteDemo "$screen" -AppleLanguages "($lang)" -AppleLocale "$lang" >/dev/null || { echo "  no se pudo abrir"; continue; }
    sleep 5
    limit 30 xcrun simctl io "$udid" screenshot --type=png "$file" >/dev/null 2>&1 || { echo "  sin captura"; continue; }
    sips -Z 900 "$file" >/dev/null
  done
}

SCREENS=(onboarding1 onboarding2 onboarding3 onboarding4 onboarding5 onboarding5Selected home settings)
BIG=$(pick "iPhone 17" "iPhone 16" "iPhone 16 Pro")
SMALL=$(pick "iPhone SE (3rd generation)" "iPhone 16e" "iPhone 13 mini")
echo "Simuladores: grande=$BIG pequeño=$SMALL"
for udid in "$BIG" "$SMALL"; do
  xcrun simctl boot "$udid" 2>/dev/null || true
  limit 300 xcrun simctl bootstatus "$udid" -b >/dev/null || echo "bootstatus tardó demasiado: $udid"
  limit 120 xcrun simctl install "$udid" "$APP"
done
# Calentamiento: el primer arranque tras instalar puede tardar; no queremos perder esas capturas.
for udid in "$BIG" "$SMALL"; do
  limit 90 xcrun simctl launch "$udid" "$BUNDLE" -PresenteDemo home >/dev/null 2>&1 || true
  sleep 12
  limit 30 xcrun simctl terminate "$udid" "$BUNDLE" >/dev/null 2>&1 || true
done
xcrun simctl status_bar "$BIG" override --time 9:41 --batteryLevel 100 --cellularBars 4 2>/dev/null || true

for lang in en es fr de pt it; do
  shoot "$BIG" phone "$lang" light "${SCREENS[@]}"
done
shoot "$BIG" phone en dark "${SCREENS[@]}"
shoot "$BIG" phone es dark onboarding1 onboarding3 onboarding5Selected home
shoot "$SMALL" small en light "${SCREENS[@]}"
shoot "$SMALL" small de light onboarding1 onboarding4 onboarding5Selected settings
echo "Capturas en $OUT: $(ls "$OUT" | wc -l)"

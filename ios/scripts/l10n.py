#!/usr/bin/env python3
"""Localización de Presente.

  python3 scripts/l10n.py extract   # lista las cadenas visibles encontradas en el código
  python3 scripts/l10n.py build     # genera Localization/Localizable.xcstrings desde translations.json
  python3 scripts/l10n.py check     # falla si falta una traducción, un idioma o un marcador de formato

La fuente de verdad es Localization/translations.json: { "clave en inglés": { "en": …, "es": …, … } }.
Un idioma solo se declara disponible si TODAS sus cadenas están traducidas (check lo garantiza).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCES = [ROOT / "Presente", ROOT / "PresenteShield"]
TABLE = ROOT / "Localization" / "translations.json"
CATALOG = ROOT / "Localization" / "Localizable.xcstrings"
LANGUAGES = ["en", "es", "fr", "de", "pt", "it"]

# Llamadas cuyos literales son visibles para la persona.
CALLS = (r"(?:Text|Button|Label|Link|Toggle|LocalizedStringKey|StepTitle|Tag|PlanCard|section|row|feature|item|activity|stat"
         r"|confirmationDialog|navigationTitle|StepScaffold)\(")
LITERAL = r'"((?:[^"\\]|\\.)*)"'
SPEC = re.compile(r"%(?:\d+\$)?(?:lld|@|ld|d|lf|f)")
STRING_TYPED = ("displayName", "handle", "displayPrice", "formatted(", "DurationText", "String(format",
                "versionString", "?? \"\"")


def placeholder(expr: str) -> str:
    return "%@" if any(token in expr for token in STRING_TYPED) else "%lld"


def scan_literal(text: str, i: int):
    """text[i] == '"'. Devuelve (contenido crudo, índice después de la comilla final).
    Respeta interpolaciones \\( … ) que a su vez contienen cadenas."""
    assert text[i] == '"'
    j = i + 1
    while j < len(text):
        c = text[j]
        if c == "\\" and text.startswith("\\(", j):
            depth, k = 1, j + 2
            while depth and k < len(text):
                if text[k] == '"':
                    _, k = scan_literal(text, k)
                    continue
                depth += {"(": 1, ")": -1}.get(text[k], 0)
                k += 1
            j = k
        elif c == "\\":
            j += 2
        elif c == '"':
            return text[i + 1:j], j + 1
        elif c == "\n":
            return None, j
        else:
            j += 1
    return None, j


def to_key(literal: str) -> str:
    out, i = [], 0
    while i < len(literal):
        if literal.startswith("\\(", i):
            depth, j = 1, i + 2
            while depth and j < len(literal):
                if literal[j] == '"':
                    _, j = scan_literal(literal, j)
                    continue
                depth += {"(": 1, ")": -1}.get(literal[j], 0)
                j += 1
            out.append(placeholder(literal[i + 2:j - 1]))
            i = j
        elif literal.startswith('\\"', i):
            out.append('"'); i += 2
        elif literal.startswith("\\\\", i):
            out.append("\\"); i += 2
        else:
            out.append(literal[i]); i += 1
    return "".join(out)


# Palabras sueltas en minúscula que SÍ se muestran (el resto se trata como identificador interno).
VISIBLE_SINGLE_WORDS = {"workouts"}


def looks_visible(key: str) -> bool:
    if key in VISIBLE_SINGLE_WORDS:
        return True
    if not key or key.startswith(("http", "#")):
        return False
    if re.fullmatch(r"[a-z][A-Za-z0-9.\-]*", key):  # símbolos SF, identificadores internos
        return False
    letters = SPEC.sub("", key)
    return bool(re.search(r"[A-Za-z]", letters))


def literals(text: str):
    """Todos los literales de cadena del archivo, con su posición (ignora comentarios //)."""
    i = 0
    while i < len(text):
        if text.startswith("//", i):
            i = text.find("\n", i)
            if i < 0:
                return
            continue
        if text[i] == '"':
            if text.startswith('"""', i):
                i = text.find('"""', i + 3) + 3
                continue
            content, end = scan_literal(text, i)
            if content is not None:
                yield i, content
            i = end
            continue
        i += 1


VISIBLE_BEFORE = re.compile(
    r"(?:\b(?:Text|Button|Label|Link|Toggle|LocalizedStringKey|StepTitle|Tag|section|row|feature|item|activity|stat"
    r"|confirmationDialog|StepScaffold)\(\s*|String\(localized:\s*|(?:title|subtitle|text|badge|buttonTitle|footer):\s*"
    r"|\breturn\s+|[?:]\s*|,\s*)$")


def extract():
    keys = {}
    for base in SOURCES:
        for path in sorted(base.rglob("*.swift")):
            text = path.read_text(encoding="utf-8")
            for pos, content in literals(text):
                before = text[max(0, pos - 60):pos]
                if "verbatim:" in before[-12:] or "forKey" in before[-20:]:
                    continue
                if not VISIBLE_BEFORE.search(before):
                    continue
                key = to_key(content)
                if looks_visible(key):
                    keys.setdefault(key, path.name)
    for internal in ["PresenteDemo", "Presente"]:
        keys.pop(internal, None)
    return keys




def specs(s: str):
    return sorted(re.sub(r"\d+\$", "", x) for x in SPEC.findall(s))


def check():
    table = json.loads(TABLE.read_text(encoding="utf-8"))
    found = extract()
    errors = []
    for key, where in sorted(found.items()):
        if key not in table:
            errors.append(f"sin traducción: {key!r} ({where})")
    for key, langs in table.items():
        for lang in LANGUAGES:
            value = langs.get(lang, "").strip()
            if not value:
                errors.append(f"[{lang}] falta: {key!r}")
            elif specs(value) != specs(key):
                errors.append(f"[{lang}] marcadores distintos en {key!r}: {value!r}")
    unused = sorted(set(table) - set(found))
    for key in unused:
        print(f"aviso: clave sin uso en el código: {key!r}")
    if errors:
        print("\n".join(errors))
        print(f"\n{len(errors)} problema(s)")
        sys.exit(1)
    print(f"OK: {len(table)} cadenas × {len(LANGUAGES)} idiomas, todas completas")


def build():
    table = json.loads(TABLE.read_text(encoding="utf-8"))
    strings = {}
    for key in sorted(table):
        locs = {}
        for lang in LANGUAGES:
            value = table[key].get(lang)
            if value and not (lang == "en" and value == key):
                locs[lang] = {"stringUnit": {"state": "translated", "value": value}}
        entry = {"extractionState": "manual"}
        if locs:
            entry["localizations"] = locs
        strings[key] = entry
    catalog = {"sourceLanguage": "en", "strings": strings, "version": "1.0"}
    CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(f"escrito {CATALOG.relative_to(ROOT)} ({len(strings)} cadenas)")


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "check"
    if cmd == "extract":
        for key, where in sorted(extract().items()):
            print(f"{where}\t{key}")
    elif cmd == "build":
        build()
    else:
        check()

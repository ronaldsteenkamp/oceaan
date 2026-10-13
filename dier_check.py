"""Controleert of een of meer dier-sleutels overal in src/ geregistreerd zijn.
Gebruik (vanuit de repo): python dier_check.py bruinvis platvis"""
import re, sys
from pathlib import Path

SRC = Path("src")
text = {p.name: p.read_text(encoding="utf-8") for p in SRC.glob("*.js")}

def block(name):
    for f, t in text.items():
        m = re.search(r"(?:const|let)\s+" + name + r"\s*=\s*\{", t)
        if m:
            depth, i = 0, m.end() - 1
            while i < len(t):
                depth += {"{": 1, "}": -1}.get(t[i], 0)
                if depth == 0:
                    return t[m.end():i]
                i += 1
    return ""

TABLES = ["NAMES", "NAMES_EN", "LOG_SUBS", "SHINY_N", "SCI", "SHINY_PAL", "BASE_HUE",
          "FACTS", "FACTS_EN", "FIELD_NOTES", "FIELD_NOTES_EN"]
blocks = {n: block(n) for n in TABLES}
basis = text["01-basis.js"]
shiny_keys = re.search(r"const SHINY_KEYS = \[(.*?)\];", basis, re.S).group(1)
aq_lists = " ".join(re.findall(r"const (?:NEW|W\d)_[A-Z]+ = \[(.*?)\];", basis, re.S))
waters = basis[basis.find("const WATERS"):]
alltext = "\n".join(text.values())

ok = True
for key in sys.argv[1:]:
    has_key = lambda b: re.search(r'(?<![\w"])' + key + r'\s*:', b) is not None
    quoted = lambda b: f'"{key}"' in b
    checks = {t: has_key(blocks[t]) or (t == "LOG_SUBS" and quoted(blocks[t])) for t in TABLES}
    # BASE_HUE gets extra keys via Object.assign in later files
    checks["BASE_HUE"] = checks["BASE_HUE"] or re.search(r"Object\.assign\(BASE_HUE,[^)]*?\b" + key + r"\s*:", alltext, re.S) is not None
    checks["SHINY_KEYS"] = quoted(shiny_keys)
    # a shiny needs its own colour scheme (SHINY_PAL) or at least a base hue (BASE_HUE)
    checks["shiny-kleuren (SHINY_PAL of BASE_HUE)"] = checks.pop("SHINY_PAL") or checks.pop("BASE_HUE")
    checks.pop("BASE_HUE", None)
    checks["aquarium-lijst (append-only)"] = quoted(aq_lists) or quoted(basis[basis.find("const PROP_KEYS"):basis.find("const AQ_ALL")])
    checks["een water (life/visitors/props)"] = re.search(r'(?<![\w"])' + key + r'\s*:\s*[\d.]', waters) is not None or quoted(waters.split("const PROP_KEYS")[0] + waters[waters.find("const WAVE"):waters.find("const PROP_KEYS")])
    checks["tekening (FAUNA/THUMBS)"] = re.search(r'(?<![\w"])' + key + r'\s*:\s*\{\s*(kind|size)', alltext) is not None or re.search(r'(?<![\w"])' + key + r'\s*:\s*\(\)\s*=>\s*draw', alltext) is not None
    print(f"\n{key}")
    for name, good in checks.items():
        print(f"  {'ok ' if good else 'MIST'}  {name}")
        ok &= good
sys.exit(0 if ok else 1)

"""Controleert de oceaan voordat hij online gaat.

Gebruik: python check.py [pagina] [--zaden-vastleggen]
Standaard wordt dist/oceaan.html gecontroleerd (eerst bouwen met python build.py). Het script:
  1. opent de pagina met #zelftest in een onzichtbare Chrome en leest de uitslag;
  2. vergelijkt 35 vaste oceanen (seeds 1 tot 30 en vijf Waddenzee-seeds) met zaden.json en meldt welke gedeelde links er nu anders uitzien
     (een waarschuwing, geen fout; met --zaden-vastleggen wordt de nieuwe stand de standaard);
  3. maakt schermafbeeldingen op computer-, tablet- en telefoonformaat in checks/.
Geeft exitcode 1 als de zelftest een fout vindt.

Chrome wordt gezocht via de omgevingsvariabele CHROME, daarna op de gebruikelijke plekken (Windows, macOS, Linux).
"""
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import tempfile
from html import unescape
from pathlib import Path

HERE = Path(__file__).parent
SHOTS = HERE / "checks"
SEEDS = HERE / "zaden.json"


def find_chrome():
    if os.environ.get("CHROME"):
        return os.environ["CHROME"]
    for name in ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome"]:
        if shutil.which(name):
            return shutil.which(name)
    for path in [r"C:\Program Files\Google\Chrome\Application\chrome.exe", r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
                 "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"]:
        if Path(path).exists():
            return path
    sys.exit("Chrome niet gevonden. Zet het pad in de omgevingsvariabele CHROME.")


CHROME = find_chrome()


def chrome(args, timeout=120):
    with tempfile.TemporaryDirectory() as profile:
        cmd = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", f"--user-data-dir={profile}"]
        if platform.system() == "Linux":
            cmd += ["--no-sandbox", "--disable-dev-shm-usage"]  # needed in containers such as GitHub Actions
        return subprocess.run([*cmd, *args], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=timeout)


def self_test(url, count=40):
    res = chrome(["--virtual-time-budget=60000", "--dump-dom", f"{url}#zelftest-{count}"], timeout=600)
    m = re.search(r'<pre id="selftest"[^>]*>(.*?)</pre>', res.stdout, re.S)
    if not m:
        return False, "geen uitslag van de zelftest (de pagina startte misschien niet)\n" + res.stderr[-1500:]
    text = unescape(m.group(1)).strip()
    p = re.search(r'<pre id="seedprints"[^>]*>(.*?)</pre>', res.stdout, re.S)
    if p:
        text += "\n" + compare_seeds(json.loads(unescape(p.group(1))))
    return text.startswith("OK"), text


def compare_seeds(prints):
    """Vergelijkt de vingerafdruk van de vaste oceanen met zaden.json. Een verschil is geen fout (soms is het
    de bedoeling), maar wel iets om te weten: wie een oude link opent, ziet dan een andere oceaan."""
    if "--zaden-vastleggen" in sys.argv or not SEEDS.exists():
        SEEDS.write_text(json.dumps(prints, indent=1, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
        return f"zaden: {len(prints)} oceanen vastgelegd in {SEEDS.name}"
    old = json.loads(SEEDS.read_text(encoding="utf-8"))
    changed = []
    for sd, now in prints.items():
        before = old.get(sd) or {}
        if before != now:
            parts = sorted(k for k in set(now) | set(before) if before.get(k) != now.get(k))
            changed.append(f"  oceaan {sd}: {', '.join(parts)}")
    if not changed:
        return f"zaden: de {len(prints)} vaste oceanen zijn hetzelfde als voorheen"
    return (f"LET OP: {len(changed)} van de {len(prints)} gedeelde oceanen zien er nu anders uit (oude links tonen iets anders):\n"
            + "\n".join(changed) + "\nIs dat de bedoeling? Leg de nieuwe stand vast met: python build.py --zaden-vastleggen")


def framed(url, w, h):
    """Headless Chrome lays pages out at least 500px wide, so narrow screens are shown inside an iframe of the exact width."""
    page = SHOTS / f"_frame-{w}.html"
    page.write_text(f'<!doctype html><body style="margin:0;background:#000"><iframe src="{url}" style="border:0;width:{w}px;height:{h}px;display:block"></iframe></body>', encoding="utf-8")
    return page.resolve().as_uri()


def screenshots(url):
    SHOTS.mkdir(exist_ok=True)
    made = []
    for w, h, name in [(1440, 900, "computer"), (1024, 768, "tablet"), (390, 844, "telefoon")]:
        for view in ["", "-logboek", "-detail", "-ontdek", "-menu", "-welkom"]:
            out = SHOTS / f"{name}{view or '-oceaan'}.png"
            out.unlink(missing_ok=True)
            target = f"{url}#schermtest-7{view}"
            if w < 500:
                target = framed(target, w, h)
            for _ in range(3):  # headless Chrome hangs now and then; a couple of retries is enough
                try:
                    chrome([f"--window-size={max(w, 500)},{h}", "--virtual-time-budget=2500", f"--screenshot={out}", target], timeout=90)
                except subprocess.TimeoutExpired:
                    pass
                if out.exists() and w < 500:
                    from PIL import Image
                    with Image.open(out) as im:
                        im.crop((0, 0, w, h)).save(out)
                if out.exists():
                    made.append(out.name)
                    break
            else:
                print(f"let op: geen schermafbeelding van {out.name}")
    return made


def main():
    page = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else (HERE / "dist" / "oceaan.html").resolve()
    url = page.as_uri()
    ok, report = self_test(url)
    print(report)
    shots = screenshots(url)
    print(f"{len(shots)} schermafbeeldingen in {SHOTS.name}/")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()

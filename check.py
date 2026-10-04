"""Controleert de oceaan voordat hij online gaat.

Gebruik: python check.py [pagina]
Standaard wordt ../oceaan.html gecontroleerd. Het script:
  1. opent de pagina met #zelftest in een onzichtbare Chrome en leest de uitslag;
  2. maakt schermafbeeldingen op computer-, tablet- en telefoonformaat in checks/.
Geeft exitcode 1 als de zelftest een fout vindt.
"""
import re
import subprocess
import sys
import tempfile
from html import unescape
from pathlib import Path

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
HERE = Path(__file__).parent
SHOTS = HERE / "checks"


def chrome(args, timeout=120):
    with tempfile.TemporaryDirectory() as profile:
        cmd = [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
               f"--user-data-dir={profile}", *args]
        return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=timeout)


def self_test(url):
    res = chrome(["--virtual-time-budget=60000", "--dump-dom", url + "#zelftest-40"], timeout=300)
    m = re.search(r'<pre id="selftest"[^>]*>(.*?)</pre>', res.stdout, re.S)
    if not m:
        return False, "geen uitslag van de zelftest (de pagina startte misschien niet)"
    text = unescape(m.group(1)).strip()
    return text.startswith("OK"), text


def framed(url, w, h):
    """Headless Chrome lays pages out at least 500px wide, so narrow screens are shown inside an iframe of the exact width."""
    page = SHOTS / f"_frame-{w}.html"
    page.write_text(f'<!doctype html><body style="margin:0;background:#000"><iframe src="{url}" style="border:0;width:{w}px;height:{h}px;display:block"></iframe></body>', encoding="utf-8")
    return page.resolve().as_uri()


def screenshots(url):
    SHOTS.mkdir(exist_ok=True)
    made = []
    for w, h, name in [(1440, 900, "computer"), (1024, 768, "tablet"), (390, 844, "telefoon")]:
        for view in ["", "-logboek", "-menu", "-welkom"]:
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
    page = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else (HERE.parent / "oceaan.html").resolve()
    url = page.as_uri()
    ok, report = self_test(url)
    print(report)
    shots = screenshots(url)
    print(f"{len(shots)} schermafbeeldingen in {SHOTS.name}/")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()

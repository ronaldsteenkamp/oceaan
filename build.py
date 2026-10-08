"""Bouwt de oceaan uit de bronbestanden in src/.

Gebruik: python build.py [--zonder-controle]

1. Voegt src/ samen tot ../oceaan.html (de pagina die ook als claude.ai-artifact wordt gepubliceerd).
2. Draait check.py: een zelftest in een onzichtbare Chrome plus schermafbeeldingen. Bij een fout stopt de build.
3. Schrijft de app-versie: index.html, sw.js, manifest en iconen.

Daarna committen en pushen. Bij elke build gaat het versienummer omhoog,
zodat geïnstalleerde apps de nieuwe versie ophalen.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).parent
SRC = HERE / "src"
SOURCE = HERE.parent / "oceaan.html"
STATE = HERE / "version.json"


def assemble_page():
    """Voegt src/ samen tot ../oceaan.html: de pagina die ook als artifact wordt gepubliceerd."""
    def read(name):
        return (SRC / name).read_text(encoding="utf-8")
    scripts = sorted(SRC.glob("[0-9][0-9]-*.js"))
    page = (read("head.html") + "<style>\n" + read("styles.css") + "</style>\n" + read("body.html")
            + "<script>\n(() => {\n" + "".join(p.read_text(encoding="utf-8") for p in scripts) + "})();\n</script>\n")
    SOURCE.write_text(page, encoding="utf-8", newline="\n")
    return page


def next_version():
    n = 1
    if STATE.exists():
        n = json.loads(STATE.read_text(encoding="utf-8"))["version"] + 1
    STATE.write_text(json.dumps({"version": n}), encoding="utf-8")
    return n


def build_index(version):
    page = SOURCE.read_text(encoding="utf-8")
    # alles tot en met de eerste </style> hoort in de head, de rest in de body
    cut = page.index("</style>") + len("</style>")
    head_part, body_part = page[:cut], page[cut:]
    html = f"""<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#06182a">
<meta name="description" content="Een levende onderwaterwereld vol zeedieren, wrakken en schatten, die elke keer anders is.">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Oceaan">
<style>
  *, *::before, *::after {{ box-sizing: border-box; }}
  body {{ margin: 0; }}
  img {{ max-width: 100%; }}
  [hidden] {{ display: none !important; }}
</style>
{head_part}
</head>
<body>
{body_part}
<style>
  .update-bar {{
    position: fixed; left: 50%; top: calc(14px + env(safe-area-inset-top, 0px)); transform: translateX(-50%); z-index: 10;
    display: flex; align-items: center; gap: 12px; max-width: calc(100% - 32px);
    padding: 8px 8px 8px 16px; border-radius: 12px; font: 13px "Figtree", system-ui, sans-serif;
    color: #eaf4f6; background: rgba(7, 24, 39, 0.94); border: 1px solid rgba(220, 236, 240, 0.28); box-shadow: 0 14px 44px rgba(0, 0, 0, 0.38);
  }}
  .update-bar button {{ font: inherit; font-weight: 600; color: #05221f; background: #7fd8c9; border: 0; border-radius: 8px; padding: 7px 12px; cursor: pointer; }}
</style>
<script>
  // maakt de oceaan installeerbaar en speelbaar zonder internet, en meldt een nieuwe versie
  if ("serviceWorker" in navigator) {{
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", () => {{
      if (!hadController || document.querySelector(".update-bar")) return;
      const nl = document.documentElement.lang !== "en";
      const bar = document.createElement("div");
      bar.className = "update-bar";
      bar.setAttribute("role", "status");
      const text = document.createElement("span");
      text.textContent = nl ? "Er is een nieuwe versie van de oceaan." : "A new version of the ocean is ready.";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = nl ? "Vernieuwen" : "Refresh";
      btn.addEventListener("click", () => location.reload());
      bar.append(text, btn);
      document.body.appendChild(bar);
    }});
    addEventListener("load", () => navigator.serviceWorker.register("sw.js?v={version}").catch(() => {{}}));
  }}
</script>
</body>
</html>
"""
    (HERE / "index.html").write_text(html, encoding="utf-8")


def build_sw(version):
    sw = f"""// Service worker: maakt de oceaan installeerbaar en speelbaar zonder internet.
const VERSION = "v{version}";
const SHELL = `oceaan-shell-${{VERSION}}`;
const FONTS = "oceaan-fonts-1";
const SHELL_FILES = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", event => {{
  event.waitUntil(caches.open(SHELL).then(c => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
}});

self.addEventListener("activate", event => {{
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("oceaan-shell-") && k !== SHELL).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
}});

self.addEventListener("fetch", event => {{
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // lettertypes van Google: eerst uit de cache, zodat ze offline ook werken
  if (url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com") {{
    event.respondWith(
      caches.open(FONTS).then(async cache => {{
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok || res.type === "opaque") await cache.put(req, res.clone());
        return res;
      }})
    );
    return;
  }}
  if (url.origin !== location.origin) return;

  // de app zelf: netwerk eerst, zodat updates binnenkomen; de cache als je offline bent
  event.respondWith(
    fetch(req)
      .then(res => {{
        if (res.ok) {{ const copy = res.clone(); caches.open(SHELL).then(c => c.put(req, copy)); }}
        return res;
      }})
      .catch(async () =>
        (await caches.match(req, {{ ignoreSearch: true }})) ||
        (req.mode === "navigate" ? caches.match("index.html") : Response.error()))
  );
}});
"""
    (HERE / "sw.js").write_text(sw, encoding="utf-8")


def build_manifest():
    manifest = {
        "name": "Oceaan",
        "short_name": "Oceaan",
        "description": "Een levende onderwaterwereld vol zeedieren, wrakken en schatten, die elke keer anders is.",
        "lang": "nl",
        "start_url": "./",
        "scope": "./",
        "display": "fullscreen",
        "background_color": "#06182a",
        "theme_color": "#06182a",
        "categories": ["entertainment", "games"],
        "icons": [
            {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
    }
    (HERE / "manifest.webmanifest").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")


def draw_icon(size, maskable=False):
    """Een vis in diep water, met een paar belletjes. Getekend op 4x en verkleind voor zachte randen."""
    s = size * 4
    img = Image.new("RGB", (s, s), "#06182a")
    d = ImageDraw.Draw(img)
    for y in range(s):  # verloop van turquoise naar diepblauw
        f = y / s
        c = tuple(int(a + (b - a) * f) for a, b in zip((58, 170, 182), (8, 34, 60)))
        d.line([(0, y), (s, y)], fill=c)
    pad = 0.18 if maskable else 0.06
    def P(x, y):
        return (s * (pad + x * (1 - 2 * pad)), s * (pad + y * (1 - 2 * pad)))
    # lichtbundel
    d.polygon([P(0.30, 0.0), P(0.46, 0.0), P(0.70, 1.0), P(0.38, 1.0)], fill=(70, 185, 196))
    # vis
    d.polygon([P(0.22, 0.52), P(0.06, 0.36), P(0.10, 0.52), P(0.06, 0.68)], fill=(138, 88, 16))
    d.ellipse([P(0.18, 0.38), P(0.78, 0.66)], fill=(242, 177, 52))
    d.polygon([P(0.38, 0.40), P(0.50, 0.26), P(0.60, 0.40)], fill=(138, 88, 16))
    d.ellipse([P(0.62, 0.46), P(0.68, 0.52)], fill=(40, 30, 10))
    # belletjes
    for x, y, r in [(0.80, 0.30, 0.035), (0.86, 0.20, 0.025), (0.78, 0.12, 0.02)]:
        cx, cy = P(x, y)
        rr = r * s
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=(230, 250, 255), width=max(2, s // 128))
    # zand
    d.polygon([P(-0.2, 0.86), P(1.2, 0.80), P(1.2, 1.3), P(-0.2, 1.3)], fill=(205, 187, 142))
    return img.resize((size, size), Image.LANCZOS)


def build_icons():
    out = HERE / "icons"
    out.mkdir(exist_ok=True)
    draw_icon(192).save(out / "icon-192.png")
    draw_icon(512).save(out / "icon-512.png")
    draw_icon(512, maskable=True).save(out / "icon-maskable-512.png")
    draw_icon(180).save(out / "apple-touch-icon.png")


if __name__ == "__main__":
    assemble_page()
    if "--zonder-controle" not in sys.argv:
        import check
        ok, report = check.self_test(SOURCE.resolve().as_uri())
        print(report)
        if not ok:
            sys.exit("De zelftest vond een fout; er is niets gebouwd.")
        print(f"{len(check.screenshots(SOURCE.resolve().as_uri()))} schermafbeeldingen in checks/")
    v = next_version()
    build_index(v)
    build_sw(v)
    build_manifest()
    build_icons()
    print(f"Oceaan v{v} gebouwd")

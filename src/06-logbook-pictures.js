  // ---- the ghost ship ----------------------------------------------------
  // ---- logbook pictures -------------------------------------------------
  // Each picture reuses the real drawing code, inside a tiny stand-in world of 120 by 84.
  const TW = 120, TH = 84;
  const THUMB_WATER = Object.assign({}, WATERS[0], { name: "thumb", tintK: 0, glow: false, surface: true });
  const FULL_THUMBS = new Set([...WATERS.map(w => "w:" + w.name), "canyon", "storm"]);
  const FLOOR_THUMBS = new Set([...PROP_KEYS.filter(k => k !== "canyon"), "moray", "treasure", "eels", "crab", "starfish", "urchin", "octopus", "hermit", "slugs", "mantis", "eruption", "coralspawn", "whalefall",
    "goldpearl", "cassiopea", "lobster", "isopod", "pistol", "spidercrab", "parrotfish", "crabmarch", "quake"]);
  const thumbCache = new Map();

  function thumbScene() {
    return {
      sand: { frac: 0.16, o1: 0, o2: 0 }, canyon: null, floorL: 0, floorR: TW, ground: [], shinies: [], jellies: [], squids: [], combs: [],
      penguins: [], otters: [], floes: [], boat: null, boatTimer: 1e9, gull: null, gullTimer: 1e9, species: [], hidden: [],
      moon: { x: 0, phase: 0.5 }, visitorPool: [], season: "zomer",
    };
  }

  function star(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.lineTo(x + r * 0.22, y - r * 0.22); ctx.lineTo(x + r, y); ctx.lineTo(x + r * 0.22, y + r * 0.22);
    ctx.lineTo(x, y + r); ctx.lineTo(x - r * 0.22, y + r * 0.22); ctx.lineTo(x - r, y); ctx.lineTo(x - r * 0.22, y - r * 0.22);
    ctx.fill();
  }

  function waterThumb(name) {
    const w = WATERS.find(x => x.name === name);
    const g = ctx.createLinearGradient(0, 0, 0, TH);
    g.addColorStop(0, w.top); g.addColorStop(0.6, w.mid); g.addColorStop(1, w.bottom);
    ctx.fillStyle = g; ctx.fillRect(0, 0, TW, TH);
    ctx.fillStyle = `rgba(${w.ray},${w.rayA * 1.6})`;
    for (const rx of [30, 78]) { ctx.beginPath(); ctx.moveTo(rx - 6, 0); ctx.lineTo(rx + 6, 0); ctx.lineTo(rx + 22, 70); ctx.lineTo(rx - 4, 70); ctx.fill(); }
    ctx.strokeStyle = w.kelp[0]; ctx.lineWidth = 2.5; ctx.lineCap = "round";
    const tall = w.denseKelp ? 62 : w.fewKelp ? 18 : 34;
    for (const kx of w.denseKelp ? [12, 28, 52, 70, 96, 108] : [16, 98]) { ctx.beginPath(); ctx.moveTo(kx, 76); ctx.quadraticCurveTo(kx + 6, 76 - tall / 2, kx - 2, 76 - tall); ctx.stroke(); }
    if (w.glow) { ctx.fillStyle = "rgba(120,240,255,0.8)"; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc((i * 37) % TW, (i * 23) % 60 + 6, 1, 0, TAU); ctx.fill(); } }
    if (w.surface) { ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 8); for (let x = 0; x <= TW; x += 6) ctx.lineTo(x, 8 + Math.sin(x * 0.12) * 1.5); ctx.stroke(); }
    if (w.ice) { ctx.fillStyle = "rgba(240,250,255,0.95)"; ctx.fillRect(18, 0, 40, 9); ctx.fillRect(74, 0, 28, 7); }
    if (w.caustics) {
      ctx.strokeStyle = "rgba(255,255,230,0.5)"; ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); for (let x = 0; x <= TW; x += 6) ctx.lineTo(x, 66 + i * 3 + Math.sin(x * 0.2 + i * 2) * 2); ctx.stroke(); }
    }
    if (w.sargasso) {
      ctx.fillStyle = "#8a7a2a";
      for (const [x, n] of [[24, 7], [80, 9]]) for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.ellipse(x - 14 + i * 4, 11 + (i % 3) * 3, 4, 1.6, i, 0, TAU); ctx.fill(); }
    }
    if (w.mangrove) {
      ctx.strokeStyle = "#3a2c1e"; ctx.lineWidth = 3;
      for (const [x0, x1] of [[30, 6], [30, 46], [86, 64], [86, 114]]) { ctx.beginPath(); ctx.moveTo(x0, 0); ctx.quadraticCurveTo(x0 + (x1 - x0) * 0.3, 30, x1, 76); ctx.stroke(); }
    }
    if (w.cave) {
      ctx.fillStyle = "#151a1c";
      for (const pts of [[[0, 14], [10, 10], [16, 22], [22, 11], [34, 13], [40, 26], [46, 9], [52, 3], [52, 0]], [[72, 0], [72, 4], [80, 10], [86, 24], [92, 11], [104, 12], [110, 28], [116, 11], [120, 12], [120, 0]]]) {
        ctx.beginPath(); ctx.moveTo(pts[0][0], 0);
        for (const [x, y] of pts) ctx.lineTo(x, y);
        ctx.closePath(); ctx.fill();
      }
    }
    ctx.fillStyle = w.sand[0];
    ctx.beginPath(); ctx.moveTo(0, TH); for (let x = 0; x <= TW; x += 6) ctx.lineTo(x, 74 + Math.sin(x * 0.05) * 2); ctx.lineTo(TW, TH); ctx.fill();
  }

  const THUMBS = {
    wreck: () => drawWreck({ x: 62, y0: 78, w: 100, tilt: -0.04, dir: 1, mastBroken: false, moray: null }),
    plane: () => drawPlane({ x: 60, w: 110, tilt: -0.05, dir: 1 }),
    chest: () => drawChest({ x: 60, s: 30, eel: 0, sparkles: [[-0.6, -1.2, 0], [0.5, -1.4, 1], [0, -1.0, 2]] }),
    treasure: () => {
      drawChest({ x: 66, s: 26, eel: 0, sparkles: [[-0.5, -1.2, 0], [0.4, -1.3, 1.5]] });
      ctx.strokeStyle = "#e0453a"; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(18, 72); ctx.lineTo(30, 82); ctx.moveTo(30, 72); ctx.lineTo(18, 82); ctx.stroke();
    },
    anchor: () => drawAnchor({ x: 50, s: 52, tilt: 0.25, dir: 1 }),
    cannon: () => drawCannon({ x: 68, s: 56, tilt: -0.05, dir: 1 }),
    ruins: () => drawRuins({ x: 56, s: 32, broken: 0.5 }),
    statue: () => drawStatue({ x: 52, s: 25, dir: 1 }),
    city: () => drawCity({ x: 60, w: 112, s: 13, houses: [{ dx: 22, w: 24, h: 24, tilt: 0 }, { dx: 50, w: 20, h: 32, tilt: 0.04 }, { dx: 74, w: 14, h: 20, tilt: -0.05 }] }),
    arch: () => drawArch({ x: 58, s: 32, eyes: true }),
    helmet: () => drawHelmet({ x: 60, s: 24, crab: true, e: 1 }),
    mine: () => drawMine({ x: 60, s: 12, h: 44, ph: 0 }),
    bottle: () => drawBottle({ x: 60, s: 30, tilt: Math.PI / 2 - 0.2 }),
    skull: () => drawSkull({ x: 60, s: 13 }),
    coral: () => drawCoral({ x: 60, parts: buildCoral(95) }),
    anemone: () => drawAnemone({ x: 60, s: 22, color: "#d98fcf", clown: false }),
    vent: () => drawVent({ x: 60, s: 44, worms: [{ dx: -30, h: 16, e: 1 }, { dx: -18, h: 22, e: 1 }, { dx: 22, h: 18, e: 1 }, { dx: 34, h: 14, e: 1 }] }, 0),
    volcano: () => drawVolcano({ x: 60, s: 34, timer: 1e9, erupt: 0.2, lava: [], steam: [] }, 0),
    brine: () => drawBrine({ x: 60, s: 38 }),
    rocks: () => drawRocks({ x: 60, stones: [[-24, 24, 14], [6, 30, 20], [32, 16, 10]] }),
    canyon: () => {
      waterThumb("noordzee");
      scene.canyon = { side: 1, x0: 64 };
      ctx.fillStyle = "rgba(0,4,12,0.75)"; ctx.fillRect(64, 40, TW - 64, TH - 40);
      drawSand();
    },
    eels: () => drawGardenEels({ x: 60, e: 1, eels: [{ dx: -24, h: 34, ph: 0 }, { dx: -6, h: 44, ph: 1 }, { dx: 12, h: 36, ph: 2 }, { dx: 28, h: 26, ph: 3 }] }),
    fish: () => drawFishShape(60, 42, 0.1, 26, "#f2b134", "#8a5810", 0.5, false),
    lantern: () => {
      drawFishShape(60, 42, 0, 26, "#1c2633", "#0b1119", 0.5, false);
      ctx.fillStyle = "rgba(140,230,255,0.95)";
      for (const o of [-0.5, 0, 0.5]) { ctx.beginPath(); ctx.arc(60 + 26 * o, 47, 2.2, 0, TAU); ctx.fill(); }
    },
    jelly: () => { scene.jellies = [{ x: 60, y: 30, r: 20, ph: 1.2, sp: 0, drift: 0, col: "255,196,224", tl: 2 }]; updateAndDrawJellies(0); },
    crab: () => drawCrab({ x: 60, dir: 1, s: 26, speed: 0, pause: 9, leg: 0, color: "#d9543b" }, 0),
    starfish: () => drawStarfish({ x: 60, s: 22, rot: 0.25, color: "#e8743b" }),
    urchin: () => drawUrchin({ x: 60, s: 15, color: "#3b2340" }),
    octopus: () => drawOctopus({ x: 60, dir: 1, s: 30, hue: 18, cool: 1e9, dash: 0, scare: 0 }, 0),
    ray: () => drawRay({ x: 72, dir: 1, s: 42, speed: 0, ph: 0, lift: 22 }, 0),
    seahorse: () => drawSeahorse({ px: 60, py: 52, s: 32, dir: 1, ph: 0, color: "#f2b134" }),
    puffer: () => drawPuffer({ x: 60, y: 42, vx: 0.35, s: 17, inflate: 0.6, ph: 0 }, 0),
    angler: () => drawAngler({ x: 50, y: 50, dir: 1, s: 30, ph: 0 }, 0),
    squid: () => { scene.squids = [{ x: 64, y: 42, vx: 0.5, vy: 0, dir: 1, s: 24, pulse: 1e9, hue: 340, face: 1 }]; updateAndDrawSquids(0); },
    hermit: () => drawHermit({ x: 62, dir: 1, s: 24, hide: 0, leg: 0, shell: "#d8b48a" }, 0),
    slugs: () => drawSlug({ x: 60, dir: 1, s: 26, type: "nudi", ph: 1, body: "#7b4fd6", tip: "#ff9a3c", color: "#7a3b2e" }, 0),
    comb: () => { scene.combs = [{ x: 60, y: 42, r: 24, ph: 0, drift: 0 }]; drawCombs(0, false); drawCombs(0, true); },
    otters: () => { ctx.translate(0, 26); scene.otters = [{ x: 60, vx: 0, s: 50, ph: 0, shell: true }]; drawSurface(0, 0); },
    seal: () => drawSeal({ x: 60, y0: -28, ph: Math.PI / 2, dir: 1, s: 80 }, 0),
    penguins: () => { scene.penguins = [{ ph: 2.2, x: 60, depth: 30, sp: 0, s: 24, dir: 1 }]; drawPenguins(0); },
    clown: () => drawFishShape(60, 42, 0.1, 22, "#f07c1e", "#1d1d1d", 0.5, true),
    moray: () => {
      drawRocks({ x: 60, stones: [[-6, 46, 34]] });
      ctx.fillStyle = "#0a0806";
      ctx.beginPath(); ctx.ellipse(62, 66, 11, 7, 0, 0, TAU); ctx.fill();
      const body = sh("#6f7d3a");
      ctx.strokeStyle = body; ctx.lineWidth = 9; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(62, 68); ctx.quadraticCurveTo(76, 48, 56, 36); ctx.stroke();
      ctx.fillStyle = sh("#3d4520");
      for (const [x, y] of [[66, 58], [70, 50], [64, 42]]) { ctx.beginPath(); ctx.arc(x, y, 1.3, 0, TAU); ctx.fill(); }
      ctx.save(); ctx.translate(54, 34); ctx.rotate(-2.5);
      ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(-4, 0, 10, 6, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#2a1a12"; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(-5, 3); ctx.lineTo(-5, -1); ctx.fill();
      ctx.fillStyle = "#f2e9c8"; ctx.beginPath(); ctx.arc(-6, -2.5, 1.6, 0, TAU); ctx.fill();
      ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(-6.3, -2.5, 0.8, 0, TAU); ctx.fill();
      ctx.restore();
    },
    mantis: () => drawMantis({ x: 60, s: 30, cool: 1e9, strike: 0 }, 0),
    archer: () => drawArcher({ x: 60, vx: 0.5, s: 24, cool: 1e9, face: 1 }, 0),
    flyingfish: () => drawFlyingFish({ x: 60, y: 44, dir: 1, vx: 3, vy: -0.6, air: true, ph: 1, s: 30 }),
    cleaners: () => {
      drawFishShape(44, 36, 0.3, 14, sh("#58b4f2"), sh("#10202e"), 0.5, false);
      drawFishShape(76, 50, -0.2, 14, sh("#58b4f2"), sh("#10202e"), 1.5, false);
    },
    grouper: () => {
      drawFishShape(60, 42, 0, 32, sh("#7a5a3a"), sh("#3e2c1c"), 0.5, false);
      ctx.fillStyle = sh("#5a3f26");
      for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(60 + ((i % 4) * 0.3 - 0.45) * 32, 42 + (Math.floor(i / 4) * 0.2 - 0.12) * 32, 1.6, 0, TAU); ctx.fill(); }
    },
    whale: () => drawWhale({ x: 66, y: 42, dir: 1, size: 100, ph: 0, yOff: 0 }),
    humpback: () => drawHumpback({ x: 64, y: 38, dir: 1, size: 100, ph: 0, yOff: 0 }),
    shark: () => drawShark({ x: 62, y: 44, dir: 1, size: 100, ph: 0, yOff: 0 }),
    turtle: () => drawTurtle({ x: 56, y: 44, dir: 1, size: 70, ph: 0, yOff: 0 }),
    manta: () => drawManta({ x: 66, y: 42, dir: 1, size: 64, ph: 0, yOff: 0 }),
    dolphins: () => drawDolphin(62, 42, 1, -0.1, 96, 0),
    swordfish: () => drawSwordfish({ x: 52, y: 46, dir: 1, size: 90, ph: 0, yOff: 0 }),
    sub: () => drawSub({ x: 62, y: 46, dir: 1, size: 90, ph: 0, yOff: 0 }),
    narwhal: () => drawNarwhal({ x: 42, y: 48, dir: 1, size: 70, ph: 0, yOff: 0 }),
    mermaid: () => drawMermaid({ x: 70, y: 42, dir: 1, size: 90, ph: 0, yOff: 0 }),
    giant: () => {
      drawTentacle({ bx: -6, by: 72, ang: -0.6, len: 110, w: 13, ph: 0, curl: 1.6, side: 1 }, 1, sh("#7a2a2a"), sh("#d08a7a"), 1);
      drawTentacle({ bx: 126, by: 64, ang: Math.PI + 0.5, len: 90, w: 10, ph: 2, curl: -1.4, side: -1 }, 1, sh("#7a2a2a"), sh("#d08a7a"), 1);
    },
    kraken: () => {
      [[22, 0.25, 1.5], [60, -0.1, -1.6], [98, -0.3, 1.4]].forEach(([bx, a, c], i) => drawTentacle({ bx, by: 92, ang: -Math.PI / 2 + a, len: 82, w: 16, ph: i, curl: c, side: Math.sign(c) }, 1, sh("#6a1f2e"), sh("#e0a0a0"), 1));
      ctx.fillStyle = "#e8c23a"; ctx.beginPath(); ctx.ellipse(60, 80, 14, 8, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#120808"; ctx.beginPath(); ctx.ellipse(60, 80, 9, 2, 0, 0, TAU); ctx.fill();
    },
    ghost: () => { const img = makeGhost(); ctx.globalAlpha = 0.85; ctx.drawImage(img, 60 - img.width / 2, 72 - img.height * 0.72); ctx.globalAlpha = 1; },
    whalefall: () => drawWhalefall({ x: 60, w: 112, dir: 1 }),
    baitball: () => {
      for (let i = 0; i < 40; i++) {
        const a = i * 2.4, r = 6 + (i % 7) * 3.4;
        drawFishShape(66 + Math.cos(a) * r, 40 + Math.sin(a) * r * 0.75, a + Math.PI / 2, 4.5, sh("#cfd8dc"), sh("#5a6a74"), i, false);
      }
      drawDolphin(22, 20, 1, 0.35, 44, 0);
    },
    spawning: () => {
      drawFishShape(38, 38, 0.1, 16, "#ef6f5e", "#7d2b22", 0.5, false);
      drawFishShape(84, 50, Math.PI - 0.1, 16, "#ef6f5e", "#7d2b22", 1.5, false);
      ctx.fillStyle = "rgba(255,240,200,0.9)";
      for (let i = 0; i < 26; i++) { ctx.beginPath(); ctx.arc(60 + Math.cos(i * 2.4) * (4 + i * 0.9), 44 + Math.sin(i * 2.4) * (3 + i * 0.6), 1.3, 0, TAU); ctx.fill(); }
    },
    coralspawn: () => {
      drawCoral({ x: 60, parts: buildCoral(90) });
      ctx.fillStyle = "rgba(255,170,200,0.95)";
      for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.arc(20 + (i * 29) % 80, 8 + (i * 17) % 50, 1.5, 0, TAU); ctx.fill(); }
    },
    storm: () => {
      const g = ctx.createLinearGradient(0, 0, 0, TH);
      g.addColorStop(0, "#2a3c4a"); g.addColorStop(1, "#0a1620");
      ctx.fillStyle = g; ctx.fillRect(0, 0, TW, TH);
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1;
      for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse(8 + i * 13, 10, 4, 1, 0, 0, TAU); ctx.stroke(); }
      ctx.strokeStyle = "rgba(235,240,255,0.95)"; ctx.lineWidth = 2.5; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(70, 0); ctx.lineTo(58, 26); ctx.lineTo(68, 28); ctx.lineTo(54, 60); ctx.stroke();
    },
    eruption: () => drawVolcano({
      x: 60, s: 34, timer: 1e9, erupt: 1,
      steam: [{ x: 58, y: 30, r: 6, a: 0.4, vx: 0 }, { x: 63, y: 20, r: 9, a: 0.3, vx: 0 }, { x: 57, y: 8, r: 12, a: 0.2, vx: 0 }],
      lava: [[-14, 30], [10, 22], [20, 34], [-6, 16], [2, 28]].map(([dx, y]) => ({ x: 60 + dx, y, vx: 0, vy: 0, r: 3, life: 0.95 })),
    }, 0),
    task: () => {
      drawSeahorse({ px: 60, py: 52, s: 30, dir: 1, ph: 0, color: "#f2b134" });
      star(36, 24, 5, "rgba(255,240,180,0.95)"); star(84, 30, 4, "rgba(255,240,180,0.95)"); star(78, 62, 3, "rgba(255,240,180,0.9)");
    },
  };
  for (const w of WATERS) THUMBS["w:" + w.name] = () => waterThumb(w.name);

  function thumbURL(key, seenIt, scale = 2) {
    const ck = key + (seenIt ? "|1|" : "|0|") + scale;
    if (!thumbCache.has(ck)) thumbCache.set(ck, renderThumb(key, seenIt, scale));
    return thumbCache.get(ck);
  }

  function renderThumb(key, seenIt, TS = 2) {
    const base = key.startsWith("shiny:") ? key.slice(6) : key, shiny = base !== key, fn = THUMBS[base];
    const layer = document.createElement("canvas");
    layer.width = TW * TS; layer.height = TH * TS;
    if (fn) {
      // swap the real world for the tiny one, and put everything back afterwards
      const saved = { ctx, W, H, u, dpr, scene, water, t, rng, bubbles, smoke, dust, ink, coins, abyssGlows, active: pointer.active, diverMode, feeding };
      try {
        ctx = layer.getContext("2d");
        ctx.setTransform(TS, 0, 0, TS, 0, 0);
        W = TW; H = TH; u = 1; dpr = TS; t = 1.3; rng = mulberry32(4242);
        pointer.active = false; diverMode = false; feeding = false;
        bubbles = []; smoke = []; dust = []; ink = []; coins = []; abyssGlows = [];
        water = THUMB_WATER; scene = thumbScene();
        const THUMB_BASE = { fish: hexHue("#f2b134"), crab: hexHue("#d9543b"), starfish: hexHue("#e8743b"), seahorse: hexHue("#f2b134"), slugs: hexHue("#7b4fd6"), jelly: rgbHue(255, 196, 224) };
        if (shiny && seenIt && beginShiny()) { fn(); endShiny(base, THUMB_BASE[base] !== undefined ? { shinyBase: THUMB_BASE[base] } : null); } else fn();
      } catch (e) {
        // a picture that cannot be drawn just stays empty
      } finally {
        ({ ctx, W, H, u, dpr, scene, water, t, rng, bubbles, smoke, dust, ink, coins, abyssGlows, diverMode, feeding } = saved);
        pointer.active = saved.active;
      }
    }
    if (!seenIt && !FULL_THUMBS.has(base)) {
      // not found yet: only a dark outline shows
      const lc = layer.getContext("2d");
      lc.setTransform(1, 0, 0, 1, 0, 0);
      lc.globalCompositeOperation = "source-atop";
      lc.fillStyle = "rgba(4,18,30,0.94)";
      lc.fillRect(0, 0, layer.width, layer.height);
    }
    const out = document.createElement("canvas");
    out.width = layer.width; out.height = layer.height;
    const o = out.getContext("2d");
    o.scale(TS, TS);
    const g = o.createLinearGradient(0, 0, 0, TH);
    g.addColorStop(0, "#1f6a82"); g.addColorStop(1, "#0b2c46");
    o.fillStyle = g; o.fillRect(0, 0, TW, TH);
    const floor = FLOOR_THUMBS.has(base);
    const sandLine = (x, off) => TH * 0.84 + Math.sin(x * 0.006) * 8 + Math.sin(x * 0.017) * 3 + off;
    const sandFill = off => {
      o.fillStyle = WATERS[0].sand[0];
      o.beginPath(); o.moveTo(0, TH);
      for (let x = 0; x <= TW; x += 4) o.lineTo(x, sandLine(x, off + (off ? Math.sin(x * 0.03) * 2 : 0)));
      o.lineTo(TW, TH); o.fill();
    };
    if (floor) sandFill(0);
    o.drawImage(layer, 0, 0, TW, TH);
    if (floor) sandFill(7);
    if (shiny && seenIt) {
      o.setTransform(TS, 0, 0, TS, 0, 0);
      const keep = ctx;
      ctx = o;
      star(30, 22, 4, "rgba(255,252,235,0.95)"); star(88, 30, 3, "rgba(255,252,235,0.9)"); star(70, 62, 2.5, "rgba(255,252,235,0.85)");
      ctx = keep;
    }
    try { return out.toDataURL("image/png"); } catch (e) { return ""; }
  }

  function makeGhost() {
    const L = Math.min(W * 0.55, 420 * u);
    const c = document.createElement("canvas");
    c.width = Math.ceil(L * 1.5); c.height = Math.ceil(L * 1.0);
    const saved = ctx;
    ctx = c.getContext("2d");
    drawWreck({ x: c.width / 2, y0: c.height * 0.72, w: L, tilt: 0.04, dir: 1, mastBroken: false, moray: null });
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = "rgba(150,255,215,0.85)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx = saved;
    return c;
  }

  function drawGhost(k) {
    const gs = scene.ghost;
    if (!gs.img) gs.img = makeGhost();
    const w = gs.img.width;
    gs.x += gs.dir * 0.15 * u * k;
    if (gs.dir > 0 && gs.x - w / 2 > W) gs.x = -w / 2;
    if (gs.dir < 0 && gs.x + w / 2 < 0) gs.x = W + w / 2;
    ctx.save();
    ctx.globalAlpha = 0.1 + 0.04 * Math.sin(t * 1.3) + 0.14 * night;
    ctx.translate(gs.x, gs.y + Math.sin(t * 0.4) * 10 * u);
    ctx.scale(gs.dir, 1);
    ctx.rotate(Math.sin(t * 0.3) * 0.03);
    ctx.drawImage(gs.img, -w / 2, -gs.img.height * 0.72);
    ctx.restore();
  }


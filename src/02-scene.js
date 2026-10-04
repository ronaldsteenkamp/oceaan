  // ---- state -------------------------------------------------------------
  let W = 0, H = 0, dpr = 1, u = 1;
  let seed, rng, water, scene;
  let t = 0, last = performance.now(), fade = 1;
  let bgGrad, vignette;
  const pointer = { x: 0, y: 0, active: false };
  let bubbles = [], ink = [], smoke = [], food = [], coins = [], streaks = [];
  let day = 1, night = 0, glowF = 0, current = 0, feeding = false;
  let eggs = [], dust = [], rings = [], jets = [], coralSpawn = [], abyssGlows = [], ripples = [];
  let frameNo = 0, paused = false, diverMode = false, aquarium = null, mapT = 0, panelTab = "log", aqDraft = null;
  const diver = { x: 0, y: 0, vx: 0, vy: 0, face: 1, kick: 0, bub: 1, ang: 0 };

  const pick = arr => arr[Math.floor(rng() * arr.length)];
  const range = (a, b) => a + rng() * (b - a);
  const chance = p => rng() < p;
  // In diver mode the creatures react to the diver instead of the pointer.
  const near = (x, y, R) => {
    if (!diverMode && !pointer.active) return 0;
    const d = diverMode ? Math.hypot(x - diver.x, y - diver.y) : Math.hypot(x - pointer.x, y - pointer.y);
    return d < R ? 1 - d / R : 0;
  };

  // Mix every landmark colour a little towards the water, so deep scenes stay dim.
  const shadeCache = new Map();
  function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function sh(hex, extra = 0) {
    const key = hex + water.name + extra;
    let v = shadeCache.get(key);
    if (!v) {
      const a = hexRgb(hex), b = hexRgb(water.mid), k = Math.min(0.9, water.tintK + extra);
      v = `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)})`;
      shadeCache.set(key, v);
    }
    return v;
  }

  function sandY(x) {
    const s = scene.sand;
    let y = H * (1 - s.frac) + Math.sin(x * 0.006 + s.o1) * 8 * u + Math.sin(x * 0.017 + s.o2) * 3 * u;
    const c = scene.canyon;
    if (c) {
      const d = (x - c.x0) * c.side;
      if (d > 0) { const f = Math.min(1, d / (120 * u)); y += f * f * (3 - 2 * f) * H * 0.6; }
    }
    return y;
  }

  // ---- scene -------------------------------------------------------------
  function buildCoral(w) {
    const parts = [];
    const colors = ["#ff7f6b", "#f2a2c0", "#c77dff", "#ffb347", "#e85d75", "#6fd3c1"];
    const n = 3 + Math.floor(rng() * 3);
    for (let i = 0; i < n; i++) {
      const dx = (rng() - 0.5) * w;
      const type = pick(["branch", "branch", "brain", "fan", "tubes"]);
      const color = pick(colors);
      if (type === "branch") {
        const segs = [];
        const grow = (x, y, a, len, d) => {
          const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
          segs.push([x, y, x2, y2, Math.max(1.2, len * 0.22)]);
          if (d > 0) {
            grow(x2, y2, a - range(0.25, 0.6), len * range(0.65, 0.82), d - 1);
            grow(x2, y2, a + range(0.25, 0.6), len * range(0.65, 0.82), d - 1);
          }
        };
        grow(0, 0, -Math.PI / 2 + range(-0.2, 0.2), range(14, 24) * u, 4);
        parts.push({ type, dx, color, segs });
      } else if (type === "brain") {
        parts.push({ type, dx, color, r: range(14, 26) * u });
      } else if (type === "fan") {
        const h = range(40, 70) * u, rays = [];
        for (let k = 0; k < 13; k++) {
          const a = -Math.PI / 2 + (k - 6) * 0.12 + range(-0.04, 0.04);
          rays.push([Math.cos(a) * h, Math.sin(a) * h * 1.05]);
        }
        parts.push({ type, dx, color, rays });
      } else {
        parts.push({ type, dx, color, tubes: Array.from({ length: 3 + Math.floor(rng() * 3) }, () => [range(-12, 12) * u, range(18, 42) * u, range(4, 7) * u]) });
      }
    }
    parts.sort((a, b) => (a.type === "brain") - (b.type === "brain"));
    return parts;
  }

  function placeGround(items) {
    const placed = [];
    for (const it of items) {
      if (scene.floorR - scene.floorL < it.w * 0.6) continue;
      for (let tries = 0; tries < 25; tries++) {
        const x = range(scene.floorL + it.w * 0.3, scene.floorR - it.w * 0.3);
        const ok = placed.every(p => Math.abs(p.x - x) > (p.w + it.w) * 0.5 + 10 * u);
        if (ok) { it.x = x; placed.push(it); break; }
      }
    }
    return placed;
  }

  function buildScene() {
    shadeCache.clear();
    const wi = Math.floor(rng() * WATERS.length);
    water = aquarium ? aqWater(aquarium) : WATERS[wi];
    const density = Math.max(0.45, Math.min(1.2, (W * H) / (1280 * 800)));
    const P = water.props, Lf = water.life;
    const s = { sand: { frac: range(0.08, 0.13), o1: range(0, TAU), o2: range(0, TAU) } };
    scene = s;
    s.waterIndex = aquarium ? aquarium.water : wi;
    s.floorL = 0; s.floorR = W; s.canyon = null;
    if (chance(P.canyon)) {
      const side = chance(0.5) ? -1 : 1;
      s.canyon = { side, x0: side > 0 ? W * range(0.62, 0.78) : W * range(0.22, 0.38) };
      if (side > 0) s.floorR = s.canyon.x0 - 20 * u; else s.floorL = s.canyon.x0 + 20 * u;
    }
    if (aquarium) s.rares = RARE_KEYS.filter(k => aquarium.set.has(k));
    else {
      const rr = rng();
      s.rares = rr < 0.06 ? ["mermaid"] : rr < 0.12 ? ["kraken"] : rr < 0.18 ? ["ghost"] : rr < 0.23 ? ["whalefall"]
        : rr < 0.27 ? ["serpent"] : rr < 0.31 ? ["megalodon"] : rr < 0.34 ? ["goldpearl"] : [];
    }
    s.rare = s.rares[0] || null;

    s.rays = Array.from({ length: 3 + Math.floor(rng() * 4) }, () => ({
      x: rng(), w: range(0.04, 0.12), slant: range(-0.25, 0.25), ph: range(0, TAU), sp: range(0.15, 0.4),
    }));

    // Landmarks on the sea floor, biggest first so they get a spot.
    const big = [], small = [];
    if (chance(P.wreck)) big.push({ kind: "wreck", w: Math.min(W * 0.75, 520 * u), tilt: range(-0.16, 0.12), dir: chance(0.5) ? 1 : -1, mastBroken: chance(0.5) });
    if (chance(P.vent)) big.push({ kind: "vent", w: 110 * u, s: range(70, 110) * u });
    if (chance(P.ruins)) big.push({ kind: "ruins", w: 170 * u, s: range(70, 95) * u, broken: range(0.4, 0.7) });
    if (chance(P.coral)) { const n = 2 + Math.floor(rng() * 2); for (let i = 0; i < n; i++) small.push({ kind: "coral", w: 120 * u, parts: buildCoral(110 * u) }); }
    if (chance(P.anemone)) small.push({ kind: "anemone", w: 70 * u, s: range(26, 36) * u, color: pick(["#d98fcf", "#9fd36b", "#f0a35e"]), clown: water.name === "rif" });
    if (chance(P.chest)) small.push({ kind: "chest", w: 90 * u, s: range(34, 46) * u, sparkles: Array.from({ length: 6 }, () => [range(-1, 1), range(-1.6, -0.6), range(0, TAU)]) });
    if (chance(P.anchor)) small.push({ kind: "anchor", w: 80 * u, s: range(55, 80) * u, tilt: range(-0.5, 0.5), dir: chance(0.5) ? 1 : -1 });
    if (chance(P.cannon)) small.push({ kind: "cannon", w: 90 * u, s: range(50, 70) * u, tilt: range(-0.12, 0.12), dir: chance(0.5) ? 1 : -1 });
    if (chance(P.rocks)) small.push({ kind: "rocks", w: 110 * u, stones: Array.from({ length: 3 + Math.floor(rng() * 3) }, () => [range(-45, 45) * u, range(16, 38) * u, range(10, 28) * u]) });
    if (chance(P.bottle)) small.push({ kind: "bottle", w: 40 * u, s: range(20, 28) * u, tilt: range(-0.3, 0.3) + Math.PI / 2 * (chance(0.5) ? 1 : -1) });
    if (chance(P.skull)) small.push({ kind: "skull", w: 40 * u, s: range(10, 14) * u });
    if (chance(Lf.eels)) small.push({ kind: "eels", w: 90 * u, eels: Array.from({ length: 5 + Math.floor(rng() * 6) }, () => ({ dx: range(-40, 40) * u, h: range(30, 60) * u, ph: range(0, TAU) })), e: 1 });
    if (chance(P.plane * (big.some(b => b.kind === "wreck") ? 0.5 : 1))) big.push({ kind: "plane", w: Math.min(W * 0.55, 380 * u), tilt: range(-0.12, 0.1), dir: chance(0.5) ? 1 : -1 });
    if (chance(P.statue)) big.push({ kind: "statue", w: 230 * u, s: range(55, 75) * u, dir: chance(0.5) ? 1 : -1 });
    if (chance(P.arch)) big.push({ kind: "arch", w: 190 * u, s: range(55, 80) * u, eyes: chance(0.75) });
    if (chance(P.helmet)) small.push({ kind: "helmet", w: 70 * u, s: range(20, 27) * u, crab: chance(0.8), e: 1 });
    if (chance(P.mine)) small.push({ kind: "mine", w: 60 * u, s: range(14, 20) * u, h: range(70, 150) * u, ph: range(0, TAU) });
    if (s.rares.includes("whalefall")) big.unshift({ kind: "whalefall", w: Math.min(W * 0.6, 420 * u), dir: chance(0.5) ? 1 : -1 });
    if (chance(P.volcano)) big.push({ kind: "volcano", w: 170 * u, s: range(55, 80) * u, timer: range(6, 16), erupt: 0, lava: [], steam: [] });
    if (chance(P.city)) big.push(makeCity(W < 600 ? 0.7 : 1));
    if (chance(P.brine)) small.push({ kind: "brine", w: 170 * u, s: range(50, 70) * u });
    addMoreGround(s, P, big, small);
    // on a phone the big landmarks shrink so more of them fit side by side
    if (W < 600) for (const g of big) if (g.kind !== "city") { g.w *= 0.7; if (g.s) g.s *= 0.7; }
    s.ground = placeGround([...big, ...small.sort(() => rng() - 0.5)]);
    s.ground.forEach(g => { if (g.kind === "eels") g.eels.sort((a, b) => a.dx - b.dx); });
    s.wreck = s.ground.find(g => g.kind === "wreck");
    s.vent = s.ground.find(g => g.kind === "vent");
    if (s.wreck) s.wreck.moray = chance(Lf.moray) ? { e: 0, ph: range(0, TAU) } : null;
    if (s.vent) s.vent.worms = Array.from({ length: 9 }, () => ({ dx: range(-55, 55) * u, h: range(14, 30) * u, e: 1 }));

    // Kelp grows in clumps.
    const clumps = Array.from({ length: (water.denseKelp ? 6 : 2) + Math.floor(rng() * 3) }, () => rng() * W);
    const kelpMul = water.denseKelp ? (W < 600 ? 1.2 : 2.4) : water.fewKelp ? 0.35 : 1;
    const makeKelp = (n, layer) => Array.from({ length: Math.round(n * kelpMul) }, () => ({
      x: pick(clumps) + (rng() - 0.5) * 130 * u,
      h: H * (layer ? range(0.12, 0.32) : range(0.2, 0.5)) * (water.denseKelp ? 1.7 : 1),
      segs: 14, ph: range(0, TAU), w: range(2.5, 5) * u * (layer ? 1.15 : 0.9),
      color: pick(water.kelp),
    }));
    s.kelpBack = makeKelp(Math.round(8 + 14 * density), 0);
    s.kelpFront = makeKelp(Math.round(2 + 5 * density), 1);

    // Schools of fish, one species per school.
    const colors = water.fish.slice().sort(() => rng() - 0.5);
    const nSpecies = 2 + (chance(0.6) ? 1 : 0);
    s.species = [];
    for (let i = 0; i < nSpecies; i++) {
      const size = range(5, 13);
      const sp = {
        main: colors[i % colors.length][0], dark: colors[i % colors.length][1],
        size, speed: range(1.0, 1.7) - size * 0.025,
        bandC: range(0.2, 0.55), bandH: range(0.1, 0.2),
        count: Math.round(Math.max(8, Math.min(60, (58 - size * 3.4) * density))),
        fish: [],
      };
      const cx = rng() * W, cy = H * sp.bandC;
      for (let k = 0; k < sp.count; k++) {
        const a = range(0, TAU);
        sp.fish.push({
          x: cx + (rng() - 0.5) * 160 * u, y: cy + (rng() - 0.5) * 80 * u,
          vx: Math.cos(a) * sp.speed * u, vy: Math.sin(a) * sp.speed * u * 0.3,
          ph: range(0, TAU), scale: range(0.85, 1.15),
        });
      }
      s.species.push(sp);
    }
    s.species.sort((a, b) => a.size - b.size);
    if (chance(Lf.lantern)) {
      const sp = { main: "#1c2633", dark: "#0b1119", size: 5, speed: 1.4, bandC: range(0.3, 0.6), bandH: 0.15, count: Math.round(8 + 28 * density), fish: [], lantern: true };
      const cx = rng() * W, cy = H * sp.bandC;
      for (let k = 0; k < sp.count; k++) {
        const a = range(0, TAU);
        sp.fish.push({ x: cx + (rng() - 0.5) * 160 * u, y: cy + (rng() - 0.5) * 80 * u, vx: Math.cos(a) * sp.speed * u, vy: Math.sin(a) * sp.speed * u * 0.3, ph: range(0, TAU), scale: range(0.85, 1.15) });
      }
      s.species.unshift(sp);
    }
    // a small food chain: the smallest fish graze plankton, the biggest school hunts them
    const grazers = s.species.filter(x => !x.lantern);
    if (grazers.length) grazers[0].plankton = true;
    if (grazers.length >= 2) {
      const big = grazers[grazers.length - 1], small = grazers[0];
      if (big.size >= 8.5) {
        big.predator = true; big.prey = small; small.hunter = big;
        big.fish.length = Math.min(big.fish.length, 12);
        big.fish.forEach(f => { f.hunger = range(5, 20); });
      }
    }

    s.jellies = Array.from({ length: Math.round((water.glow ? range(4, 8) : range(2, 5)) * Math.max(0.7, density)) }, () => ({
      x: rng() * W, y: rng() * H * 0.8, r: range(12, 30) * u,
      ph: range(0, TAU), sp: range(0.7, 1.2), drift: range(0, TAU),
      col: pick(water.jelly), tl: range(2.2, 3.4),
    }));

    // Creatures on and near the bottom.
    const crabColors = ["#d9543b", "#e07a3a", "#b84a5a", "#c9603c"];
    s.crabs = chance(Lf.crab) ? Array.from({ length: 1 + Math.floor(rng() * 3) }, () => ({
      x: rng() * W, dir: chance(0.5) ? 1 : -1, s: range(12, 20) * u, speed: range(0.4, 0.8),
      pause: 0, leg: 0, color: pick(crabColors),
    })) : [];
    s.starfish = chance(Lf.starfish) ? Array.from({ length: 2 + Math.floor(rng() * 3) }, () => ({
      x: rng() * W, s: range(9, 15) * u, rot: range(0, TAU), color: pick(["#e8743b", "#c94f7c", "#8e5bd0", "#f0b13c", "#d9473d"]),
    })) : [];
    s.urchins = chance(Lf.urchin) ? Array.from({ length: 1 + Math.floor(rng() * 3) }, () => ({
      x: rng() * W, s: range(7, 11) * u, color: pick(["#3b2340", "#2a2a3d", "#4a2a2a"]),
    })) : [];
    s.octopus = chance(Lf.octopus) ? {
      x: range(0.15, 0.85) * W, dir: chance(0.5) ? 1 : -1, s: range(26, 36) * u,
      hue: pick([10, 18, 340, 28]), cool: 0, dash: 0, scare: 0,
    } : null;
    s.ray = chance(Lf.ray) ? {
      x: rng() * W, dir: chance(0.5) ? 1 : -1, s: range(45, 70) * u, speed: range(0.35, 0.6), ph: 0, lift: range(12, 30) * u,
    } : null;
    s.seahorses = chance(Lf.seahorse) ? Array.from({ length: 1 + Math.floor(rng() * 2) }, () => {
      const x = pick(clumps) + range(-60, 60) * u;
      return { x, y0: 0, lift: range(60, 150) * u, ph: range(0, TAU), s: range(20, 28) * u, dir: chance(0.5) ? 1 : -1, color: pick(["#f2b134", "#e86f5a", "#d9c46a", "#b77ad6"]) };
    }) : [];
    s.puffer = chance(Lf.puffer) ? {
      x: rng() * W, y: H * range(0.4, 0.62), vx: (chance(0.5) ? 1 : -1) * 0.35, s: range(13, 17) * u, inflate: 0, ph: 0,
    } : null;
    s.angler = chance(Lf.angler) ? {
      x: rng() * W, y: H * range(0.5, 0.68), dir: chance(0.5) ? 1 : -1, s: range(26, 36) * u, ph: range(0, TAU),
    } : null;

    s.squids = chance(Lf.squid) ? (() => {
      const cx = rng() * W, cy = H * range(0.25, 0.55);
      return Array.from({ length: 3 + Math.floor(rng() * 4) }, () => ({
        x: cx + range(-60, 60) * u, y: cy + range(-40, 40) * u, vx: 0, vy: 0, dir: chance(0.5) ? 1 : -1,
        s: range(10, 16) * u, pulse: range(0, 1.5), hue: range(330, 370),
      }));
    })() : [];
    s.hermits = chance(Lf.hermit) ? Array.from({ length: 1 + Math.floor(rng() * 2) }, () => ({
      x: rng() * W, dir: chance(0.5) ? 1 : -1, s: range(10, 14) * u, hide: 0, leg: 0,
      shell: pick(["#d8b48a", "#c98f6b", "#e6d2b0", "#b9a6c9"]),
    })) : [];
    s.slugs = chance(Lf.slugs) ? Array.from({ length: 2 + Math.floor(rng() * 3) }, () => ({
      x: rng() * W, dir: chance(0.5) ? 1 : -1, s: range(10, 16) * u, type: chance(0.5) ? "cucumber" : "nudi", ph: range(0, TAU),
      color: pick(["#7a3b2e", "#5a3a2a", "#8a5a3a"]), body: pick(["#7b4fd6", "#2f6fe0", "#e8e0f0", "#f05a8a"]), tip: pick(["#ff9a3c", "#ffd23c", "#ff5a5a"]),
    })) : [];
    s.combs = chance(Lf.comb) ? Array.from({ length: 2 + Math.floor(rng() * 3) }, () => ({
      x: rng() * W, y: H * range(0.15, 0.7), r: range(10, 18) * u, ph: range(0, TAU), drift: range(0, TAU),
    })) : [];
    s.otters = chance(Lf.otters) && water.surface ? Array.from({ length: 1 + Math.floor(rng() * 2) }, () => ({
      x: rng() * W, vx: range(-0.15, 0.15), s: range(26, 34) * u, ph: range(0, TAU), shell: chance(0.6),
    })) : [];
    s.seal = chance(Lf.seal) ? { x: rng() * W, y0: H * range(0.3, 0.5), ph: range(0, TAU), dir: chance(0.5) ? 1 : -1, s: range(50, 70) * u } : null;
    s.penguins = chance(Lf.penguins) && water.ice ? Array.from({ length: 3 + Math.floor(rng() * 4) }, () => ({
      ph: range(0, TAU), x: rng() * W, depth: H * range(0.2, 0.55), sp: range(0.35, 0.6), s: range(14, 18) * u, dir: chance(0.5) ? 1 : -1,
    })) : [];
    s.floes = water.ice ? Array.from({ length: 3 + Math.floor(rng() * 3) }, () => ({
      x: rng() * W, w: range(90, 220) * u, d: range(14, 30) * u, sp: range(0.05, 0.15), seed: range(0, 10),
    })) : [];
    s.boat = null; s.boatTimer = range(6, 20);
    s.gull = null; s.gullTimer = range(3, 12);

    // Light, currents and the rare finds that belong to this seed.
    s.dayOffset = chance(0.25) ? range(0.42, 0.55) : range(-0.05, 0.08);
    s.currentTarget = 0; s.currentTimer = range(20, 45);
    s.visitorPool = water.visitors.slice();
    s.forceVisitor = null;
    if (s.rares.includes("mermaid")) { s.visitorPool.push("mermaid", "mermaid", "mermaid"); s.forceVisitor = "mermaid"; }
    s.kraken = { enabled: s.rares.includes("kraken"), active: false, timer: range(4, 9), list: [], reach: 0, side: 1 };
    s.giant = { enabled: !!water.giantSquid, active: false, timer: range(12, 25), list: [], reach: 0, side: 1 };
    s.ghost = s.rares.includes("ghost") ? { x: rng() * W, y: H * range(0.25, 0.42), dir: chance(0.5) ? 1 : -1, img: null } : null;

    s.season = chance(0.5) ? "zomer" : "herfst";
    s.mantis = chance(Lf.mantis) ? { x: rng() * W, s: range(13, 17) * u, cool: 0, strike: 0 } : null;
    s.archer = chance(Lf.archer) && water.surface ? { x: rng() * W, vx: chance(0.5) ? 0.5 : -0.5, s: range(13, 17) * u, cool: 1, face: 1 } : null;
    const host = s.ground.find(g => ["coral", "rocks", "arch", "anemone"].includes(g.kind));
    s.station = host && chance(Lf.cleaners) ? {
      x: host.x,
      grouper: { x: rng() * W, y: H * 0.45, wx: rng() * W, wy: H * range(0.35, 0.6), face: 1, state: "wander", timer: range(6, 15), s: range(26, 34) * u, ph: 0 },
    } : null;
    s.hidden = s.kelpBack.length >= 3 ? Array.from({ length: 3 }, () => ({
      k: Math.floor(rng() * s.kelpBack.length), seg: 5 + Math.floor(rng() * 7), found: false, dir: chance(0.5) ? 1 : -1, flash: 0,
    })) : [];
    s.moon = { x: W * range(0.2, 0.8), phase: chance(0.3) ? 1 : range(0.15, 0.9) };
    s.storm = { enabled: !!water.surface, active: false, age: 0, timer: range(50, 130), flash: 0, nextFlash: 0 };
    s.bait = { enabled: water.name !== "diepzee", active: false, timer: range(35, 70), fish: [], att: [] };
    s.flyers = { enabled: chance(Lf.flyingfish) && !!water.surface, timer: range(8, 22), fish: [] };
    s.turnTimer = range(10, 20);
    s.taskT0 = t;
    s.spawnTimer = range(25, 50);
    s.treasure = null;
    if (s.ground.some(g => g.kind === "bottle")) {
      for (let i = 0; i < 25 && !s.treasure; i++) {
        const x = range(s.floorL + 40 * u, s.floorR - 40 * u);
        if (s.ground.every(g => Math.abs(g.x - x) > g.w * 0.5 + 45 * u)) s.treasure = { x, dug: false };
      }
    }

    s.snow = Array.from({ length: Math.round((80 + 80 * density) * (s.season === "herfst" ? 2.2 : 1)) }, () => ({
      x: rng() * W, y: rng() * H, r: range(0.4, 1.6) * u, a: range(0.15, 0.55),
      sp: range(0.05, 0.25), ph: range(0, TAU),
    }));

    s.visitor = null;
    s.visitorTimer = range(2, 6);
    bubbles = []; ink = []; smoke = []; food = []; coins = []; streaks = [];
    eggs = []; dust = []; rings = []; jets = []; coralSpawn = []; abyssGlows = []; ripples = [];
    current = 0; mapT = 0; busyUntil = 0;

    // keep everything that lives on the floor away from the canyon
    const remap = x => (x >= s.floorL && x <= s.floorR) ? x : s.floorL + (((x % W) + W) % W) / W * (s.floorR - s.floorL);
    for (const arr of [s.crabs, s.starfish, s.urchins, s.hermits, s.slugs, s.kelpBack, s.kelpFront, s.seahorses]) for (const o of arr) o.x = remap(o.x);
    if (s.octopus) s.octopus.x = remap(s.octopus.x);
    if (s.mantis) s.mantis.x = remap(s.mantis.x);
    buildMore(s, Lf, clumps, remap);

    seen("w:" + water.name);
    for (const g of s.ground) seen(g.kind);
    if (s.canyon) seen("canyon");
    if (s.ground.some(g => g.kind === "anemone" && g.clown)) seen("clown");
    seen("fish");
    if (s.jellies.length) seen("jelly");
    const lifeNow = presentLife(s);
    for (const key in lifeNow) if (lifeNow[key]) seen(key);
    if (s.station) seen("grouper");
    if (s.ghost) seen("ghost");
    registerShinies(s);

    bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, water.top);
    bgGrad.addColorStop(0.55, water.mid);
    bgGrad.addColorStop(1, water.bottom);
    vignette = ctx.createRadialGradient(W / 2, H * 0.35, Math.min(W, H) * 0.25, W / 2, H * 0.45, Math.max(W, H) * 0.85);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.45)");
  }

  function newVariant(s, soft) {
    seed = s >>> 0;
    rng = mulberry32(seed);
    buildScene();
    seedEl.textContent = seed + (aquarium ? " · aquarium" : "");
    rareEl.hidden = !scene.rare;
    rareEl.textContent = scene.rare ? L("zeldzaam: ", "rare: ") + nm(scene.rare).toLowerCase() : "";
    try { history.replaceState(null, "", "#" + (aquarium ? aqCode() : seed)); } catch (e) {}
    updateTask();
    updateClock();
    describeScene();
    fade = soft ? 0.9 : 1;
  }

  // A short spoken summary of the ocean, for people who use a screen reader.
  function describeScene() {
    const S = scene, life = presentLife(S);
    const things = [...new Set(S.ground.filter(g => NAMES[g.kind]).map(g => nm(g.kind)))];
    const animals = ["fish", "jelly", ...LIFE_KEYS].filter(k => k === "fish" || (k === "jelly" ? S.jellies.length : life[k])).map(k => nm(k).toLowerCase());
    const text = `${nm("w:" + water.name)}, ${clockEl.textContent}. ` +
      (things.length ? L("Op de bodem: ", "On the seabed: ") + things.join(", ").toLowerCase() + ". " : "") +
      L("Dieren: ", "Animals: ") + animals.join(", ") + "." + (S.rare ? L(" Zeldzaam: ", " Rare: ") + nm(S.rare).toLowerCase() + "." : "");
    sceneDescEl.textContent = text;
    canvas.setAttribute("aria-label", L("Onderwaterwereld. ", "Underwater world. ") + text);
  }

  function randomSeed() { return Math.floor(Math.random() * 1e9); }
  function seedFromHash() {
    const h = (location.hash || "").slice(1);
    const aq = parseAq(h);
    if (aq) { aquarium = { water: aq.water, set: aq.set }; return aq.seed; }
    const m = /^(\d{1,10})$/.exec(h);
    if (m) { aquarium = null; return Number(m[1]); }
    return null;
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    W = innerWidth; H = innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    u = Math.max(0.6, Math.min(1.6, Math.min(W, H) / 700));
    // the same ocean rebuilt at a new size is not a new encounter
    if (seed !== undefined) { rng = mulberry32(seed); rebuilding = true; buildScene(); rebuilding = false; }
  }


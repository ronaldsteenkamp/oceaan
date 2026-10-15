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
  const diver = { x: 0, y: 0, vx: 0, vy: 0, face: 1, kick: 0, bub: 1, ang: 0, heading: 0, roll: 1 };

  // The diver's lamp: only what comes into its beam goes into the logbook. A brighter lamp reaches further.
  function lightCone() {
    // the diver keeps the small headlamp: finding things in its narrow beam is part of the challenge
    return { len: 150 * u, half: 0.32, near: 40 * u, level: 1 };
  }
  function inBeam(x, y, r, ox, oy, th, len, half, nearR) {
    const dx = x - ox, dy = y - oy, d = Math.hypot(dx, dy);
    if (d < nearR + r) return true;
    if (d > len + r) return false;
    let a = Math.atan2(dy, dx) - th;
    a = Math.atan2(Math.sin(a), Math.cos(a));
    return Math.abs(a) < half + Math.atan2(r, Math.max(d, 1));
  }
  // A passing submarine shines a searchlight ahead of it, a little downwards.
  function subLamp() {
    const v = scene && scene.visitor;
    if (!v || v.type !== "sub") return null;
    const L = v.size;
    return { x: v.x + v.dir * L * 0.46, y: v.y + v.yOff + L * 0.03, th: v.dir > 0 ? 0.3 : Math.PI - 0.3, len: 330 * u, half: 0.3 };
  }
  // Is a spot in the diver's lamp, or in the submarine's searchlight?
  function lit(x, y, r = 0) {
    if (!isFinite(x) || !isFinite(y)) return false;
    if (diverMode) { const c = lightCone(); if (inBeam(x, y, r, diver.x, diver.y, diver.heading, c.len, c.half, c.near)) return true; }
    const s = subLamp();
    return !!s && inBeam(x, y, r, s.x, s.y, s.th, s.len, s.half, 0);
  }
  // Animals seen during a moment go into the logbook as their own kind, once per ocean.
  function sight(key, pos) {
    if (!scene.sighted) scene.sighted = new Set();
    if (scene.sighted.has(key)) return;
    scene.sighted.add(key);
    seen(key, pos);
  }
  // Something in the ocean that is waiting for the lamp. get() gives one point or a list of points (or nothing yet).
  function watch(key, get, r = 0) {
    if (!scene || !scene.watch || scene.watch.some(w => w.key === key)) return;
    scene.watch.push({ key, get, r });
  }
  // Something new for the logbook needs a moment in the lamp: a ring fills up in about a second (half a second in calm
  // mode), and it is forgiving: when the lamp slips off, the ring only slowly runs back. What is already in the logbook,
  // and the water itself, count at once.
  const holdNeed = key => selfTesting || key.startsWith("w:") || logbook.has(key) || !LOGGABLE.has(key) ? 0 : restMode ? 0.5 : 1;
  function checkWatch() {
    if ((!diverMode && !subLamp()) || !scene.watch.length) return;
    const dt = Math.min(0.1, frameK / 60);
    scene.watch = scene.watch.filter(w => {
      let pts;
      try { pts = w.get(); } catch (e) { return false; }
      const p = !pts || !pts.length ? null : (Array.isArray(pts[0]) ? pts : [pts]).find(q => q && lit(q[0], q[1], w.r));
      if (!p) { if (w.hold) w.hold = Math.max(0, w.hold - dt * 0.4); return true; }
      w.need = holdNeed(w.key); w.hold = (w.hold || 0) + dt; w.at = p;
      if (w.hold < w.need) return true;
      seen(w.key, p);
      return false;
    });
  }
  // The same ring for things that turn up on their own (visitors, moments, legends, shinies): call hold() every frame
  // that the thing is in the lamp; it says true once the ring is full. Many members of one moment (a school of glass
  // eels) share one ring, which fills once per frame.
  function hold(key, at) {
    const need = holdNeed(key);
    if (!need) return true;
    if (!scene.holds) scene.holds = {};
    const h = scene.holds[key] || (scene.holds[key] = { hold: 0 });
    if (h.frame !== frameNo) { h.frame = frameNo; h.hold += Math.min(0.1, frameK / 60); }
    h.at = at; h.need = need;
    if (h.hold < need) return false;
    delete scene.holds[key];
    return true;
  }
  const spot = (key, x, y, r) => lit(x, y, r) && hold(key, [x, y]);
  // the rings of the finds that are filling up in the lamp
  function drawHoldRings() {
    const held = Object.entries(scene.holds || {}).map(([key, h]) => {
      // out of the lamp this frame: the ring slowly runs back
      if (h.frame !== frameNo) { h.hold -= Math.min(0.1, frameK / 60) * 0.4; if (h.hold <= 0) delete scene.holds[key]; }
      return h;
    }).filter(h => h.hold > 0);
    for (const w of [...(scene.watch || []), ...held]) {
      if (!w.hold || !w.need || !w.at) continue;
      const f = Math.min(1, w.hold / w.need), [x, y] = w.at, r = 15 * u;
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(4,20,34,0.45)"; ctx.lineWidth = 5 * u;
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
      ctx.strokeStyle = "rgba(255,248,222,0.95)"; ctx.lineWidth = 3 * u;
      ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + f * TAU); ctx.stroke();
    }
  }

  const pick = arr => arr[Math.floor(rng() * arr.length)];
  // A seed must give the same ocean on every screen and in every browser. Everything whose number of dice rolls
  // depends on the size of the screen (how many fish fit, where things land) rolls from its own side stream,
  // so the main stream (water, season, which animals) never shifts.
  function hashStr(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619); return h >>> 0; }
  function sub(name, fn) {
    const keep = rng;
    rng = mulberry32((seed ^ hashStr(name)) >>> 0);
    try { return fn(); } finally { rng = keep; }
  }
  // a fair shuffle with a fixed number of rolls (sort with a random comparator rolls a different number of times per browser)
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }
  const range = (a, b) => a + rng() * (b - a);
  const chance = p => rng() < p;
  // The creatures only react to the diver, never to the mouse or a finger.
  const near = (x, y, R) => {
    if (!diverMode) return 0;
    const d = Math.hypot(x - diver.x, y - diver.y);
    return d < R ? 1 - d / R : 0;
  };

  // Mix every landmark colour a little towards the water, so deep scenes stay dim.
  const shadeCache = new Map();
  function hexRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function sh(hex, extra = 0) {
    if (shinyPal) hex = shinySwap(hex);
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

  // Everything gets a spot: where it fits without touching anything, or else (on a narrow screen) where it has the most room.
  function placeGround(items) {
    const placed = [];
    for (const it of items) {
      const lo = scene.floorL + Math.min(it.w * 0.3, (scene.floorR - scene.floorL) * 0.3), hi = scene.floorR - Math.min(it.w * 0.3, (scene.floorR - scene.floorL) * 0.3);
      let best = null, bestRoom = -Infinity;
      for (let tries = 0; tries < 25; tries++) {
        const x = range(lo, hi);
        const room = placed.reduce((m, p) => Math.min(m, Math.abs(p.x - x) - (p.w + it.w) * 0.5 - 10 * u), Infinity);
        if (room > bestRoom) { bestRoom = room; best = x; }
        if (room > 0) break;
      }
      it.x = best;
      placed.push(it);
    }
    return placed;
  }

  // A random ocean keeps its floor calm: at most two big landmarks, and everything on the sand together stays within
  // a fixed width, counted in u (so the same on every screen; a wreck counts at its full size). What you play with
  // (a chest, a bottle, a clam, a volcano, a whale fall) and one of every kind that goes into the logbook always stay.
  // Big things come first, so they keep their spot; an aquarium keeps everything that was chosen.
  const FLOOR_KEEP = new Set(["whalefall", "chest", "bottle", "clam", "volcano"]);
  const FLOOR_FULL_W = { wreck: 520, plane: 380, whalefall: 420, city: 340 };
  const FLOOR_BUDGET = 820, FLOOR_BIG = 2;
  // Every water has its own things on the floor; anything else that only decorates (a diving helmet, a phone box,
  // amphorae outside the cave) is "general", and a random ocean gets at most one of those.
  const OWN_PROPS = {
    rif: ["coral", "anemone", "sponges", "seagrass", "wreck", "rocks"],
    diepzee: ["vent", "brine", "volcano", "rocks", "wreck"],
    noordzee: ["wreck", "mine", "anchor", "plane", "bell", "rocks", "car"],
    kelpwoud: ["rocks", "arch", "anchor", "wheel", "seagrass"],
    ijszee: ["rocks", "anchor", "wreck", "brine"],
    mangrove: ["seagrass", "rocks", "idol", "wheel"],
    grot: ["ruins", "statue", "amphora", "idol", "skull", "rocks", "arch"],
    lagune: ["seagrass", "coral", "anemone", "sponges", "rocks"],
    sargasso: ["wreck", "bell", "wheel", "plane", "cannon", "anchor"],
    wadden: ["wreck", "anchor", "bell", "seagrass", "rocks"],
  };
  function calmFloor(big, small) {
    const own = new Set(OWN_PROPS[water.name] || []);
    let general = 0;
    const once = g => !PROP_KEYS.includes(g.kind) || own.has(g.kind) || FLOOR_KEEP.has(g.kind) || LOGGABLE.has(g.kind) || general++ < 1;
    big = big.filter(once); small = small.filter(once);
    const width = g => (FLOOR_FULL_W[g.kind] || g.w / u) + 30;
    const must = new Set(), kinds = new Set();
    for (const g of [...big, ...small]) if ((FLOOR_KEEP.has(g.kind) || LOGGABLE.has(g.kind)) && !kinds.has(g.kind)) { must.add(g); kinds.add(g.kind); }
    let budget = FLOOR_BUDGET, bigLeft = FLOOR_BIG;
    for (const g of must) { budget -= width(g); if (big.includes(g)) bigLeft--; }
    const keep = new Set(must);
    for (const g of big) if (!keep.has(g) && bigLeft > 0 && width(g) <= budget) { keep.add(g); budget -= width(g); bigLeft--; }
    for (const g of small) if (!keep.has(g) && width(g) <= budget) { keep.add(g); budget -= width(g); }
    return [big.filter(g => keep.has(g)), small.filter(g => keep.has(g))];
  }

  // After the practice dives an ocean holds at most four animals that are not in your logbook yet (visitors that may
  // come by count too). Which four is fixed per seed. The others are left out by building the ocean again with their
  // chance set to nothing: every die still rolls, so the rest of the ocean stays as it was. The choice is kept for
  // this ocean, so turning the phone does not bring them back. Waters, moments, rare things and shinies do not count,
  // fish schools and jellies are always there, and an aquarium keeps what was chosen.
  const NEW_LIMIT = 4;
  let leaveOut = null;
  function newHere() {
    const life = presentLife(scene);
    return [...new Set([...Object.keys(life).filter(k => life[k]), ...scene.visitorPool])]
      .filter(k => ANIMALS[k] && !logbook.has(k) && k !== "fish" && k !== "jelly").sort();
  }
  function buildLimited(limit) {
    leaveOut = null;
    buildScene();
    if (!limit) return;
    const keep = new Set(sub("nieuw", () => shuffle(newHere())).slice(0, NEW_LIMIT));
    const out = new Set();
    // leaving something out can let another animal in (the dice fall a little differently): then that one goes too
    for (let i = 0; i < 6; i++) {
      const extra = newHere().filter(k => !keep.has(k));
      if (!extra.length) break;
      for (const k of extra) out.add(k);
      leaveOut = out; rng = mulberry32(seed); buildScene();
    }
  }

  function buildScene() {
    shadeCache.clear();
    const wi = waterOfSeed(seed, rng());
    water = aquarium ? aqWater(aquarium) : WATERS[wi];
    if (leaveOut && leaveOut.size && !aquarium) water = Object.assign({}, water, {
      life: Object.fromEntries(Object.entries(water.life).map(([k, v]) => [k, leaveOut.has(k) ? 0 : v])),
      visitors: water.visitors.filter(k => !leaveOut.has(k)),
    });
    const density = Math.max(0.45, Math.min(1.2, (W * H) / (1280 * 800)));
    const P = water.props, Lf = water.life;
    const s = { sand: { frac: range(0.08, 0.13), o1: range(0, TAU), o2: range(0, TAU) } };
    // upright, the floor rises, so the seabed is not a thin strip at the bottom
    if (tallScreen()) s.sand.frac = Math.min(0.24, s.sand.frac * 1.7);
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
      const rr = rng(), list = RARES_BY_WATER[water.name] || [];
      s.rares = rr < RARE_RATE && list.length ? [list[Math.min(list.length - 1, Math.floor(rr / RARE_RATE * list.length))]] : [];
    }
    // a calendar event can bring something rare to an ocean that has nothing rare (own stream, so the rest stays put)
    const ev = aquarium ? null : activeEvent();
    s.event = ev ? ev.id : null;
    if (ev && ev.rare && !s.rares.length) sub("event", () => {
      const fits = ev.rare.keys.filter(k => (RARES_BY_WATER[water.name] || []).includes(k));
      if (fits.length && rng() < ev.rare.chance) s.rares = [fits[Math.floor(rng() * fits.length)]];
    });
    s.rare = s.rares[0] || null;

    s.rays = Array.from({ length: 3 + Math.floor(rng() * 4) }, () => ({
      x: rng(), w: range(0.04, 0.12), slant: range(-0.25, 0.25), ph: range(0, TAU), sp: range(0.15, 0.4),
    }));

    // Landmarks on the sea floor, biggest first so they get a spot.
    let big = [], small = [];
    if (chance(P.wreck)) big.push({ kind: "wreck", w: Math.min(W * 0.75, 520 * u), tilt: range(-0.16, 0.12), dir: chance(0.5) ? 1 : -1, mastBroken: chance(0.5) });
    if (chance(P.vent)) big.push({ kind: "vent", w: 110 * u, s: range(70, 110) * u });
    if (chance(P.ruins)) big.push({ kind: "ruins", w: 170 * u, s: range(70, 95) * u, broken: range(0.4, 0.7) });
    if (chance(P.coral)) { const n = 2 + Math.floor(rng() * 2); for (let i = 0; i < n; i++) small.push({ kind: "coral", w: 120 * u, parts: buildCoral(110 * u) }); }
    if (chance(P.anemone)) small.push({ kind: "anemone", w: 70 * u, s: range(26, 36) * u, color: pick(["#d98fcf", "#9fd36b", "#f0a35e"]), clown: water.name === "rif" });
    if (chance(P.chest)) small.push({ kind: "chest", w: 90 * u, s: range(34, 46) * u, mimic: chance(0.1), sparkles: Array.from({ length: 6 }, () => [range(-1, 1), range(-1.6, -0.6), range(0, TAU)]) });
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
    addWave2Ground(s, P, big, small);
    if (!aquarium) [big, small] = calmFloor(big, small);
    // on a phone the big landmarks shrink so more of them fit side by side
    if (W < 600) for (const g of big) if (g.kind !== "city") { g.w *= 0.7; if (g.s) g.s *= 0.7; }
    shuffle(small);
    s.ground = sub("place", () => placeGround([...big, ...small]));
    s.ground.forEach(g => { if (g.kind === "eels") g.eels.sort((a, b) => a.dx - b.dx); });
    s.wreck = s.ground.find(g => g.kind === "wreck");
    s.vent = s.ground.find(g => g.kind === "vent");
    // the moray is rolled whether or not the wreck found a spot, so the dice stay in step on every screen
    const morayHere = chance(Lf.moray), morayPh = range(0, TAU);
    if (s.wreck) s.wreck.moray = morayHere ? { e: 0, ph: morayPh } : null;
    if (s.vent) s.vent.worms = sub("worms", () => Array.from({ length: 9 }, () => ({ dx: range(-55, 55) * u, h: range(14, 30) * u, e: 1 })));

    // Kelp grows in clumps.
    const clumps = Array.from({ length: (water.denseKelp ? 6 : 2) + Math.floor(rng() * 3) }, () => rng() * W);
    const kelpMul = water.denseKelp ? (W < 600 ? 1.2 : 2.4) : water.fewKelp ? 0.35 : 1;
    const makeKelp = (n, layer) => Array.from({ length: Math.round(n * kelpMul) }, () => ({
      x: pick(clumps) + (rng() - 0.5) * 130 * u,
      h: H * (layer ? range(0.12, 0.32) : range(0.2, 0.5)) * (water.denseKelp ? 1.7 : 1),
      segs: 14, ph: range(0, TAU), w: range(2.5, 5) * u * (layer ? 1.15 : 0.9),
      color: pick(water.kelp),
    }));
    s.kelpBack = sub("kelp", () => makeKelp(Math.round(8 + 14 * density), 0));
    s.kelpFront = sub("kelp2", () => makeKelp(Math.round(2 + 5 * density), 1));

    // Schools of fish, one species per school.
    const colors = shuffle(water.fish.slice());
    const nSpecies = 2 + (chance(0.6) ? 1 : 0);
    s.species = [];
    for (let i = 0; i < nSpecies; i++) {
      const size = range(5, 13);
      const sp = {
        main: colors[i % colors.length][0], dark: colors[i % colors.length][1],
        size, speed: range(1.0, 1.7) - size * 0.025,
        bandC: spread(range(0.2, 0.55)), bandH: range(0.1, 0.2) * (tallScreen() ? 1.3 : 1),
        count: Math.round(Math.max(8, Math.min(60, (58 - size * 3.4) * density))),
        fish: [],
      };
      sub("school" + i, () => {
        const cx = rng() * W, cy = H * sp.bandC;
        for (let k = 0; k < sp.count; k++) {
          const a = range(0, TAU);
          sp.fish.push({
            x: cx + (rng() - 0.5) * 160 * u, y: cy + (rng() - 0.5) * 80 * u,
            vx: Math.cos(a) * sp.speed * u, vy: Math.sin(a) * sp.speed * u * 0.3,
            ph: range(0, TAU), scale: range(0.85, 1.15),
          });
        }
      });
      s.species.push(sp);
    }
    s.species.sort((a, b) => a.size - b.size);
    if (chance(Lf.lantern)) {
      const sp = { main: "#1c2633", dark: "#0b1119", size: 5, speed: 1.4, bandC: spread(range(0.3, 0.6)), bandH: 0.15, count: Math.round(8 + 28 * density), fish: [], lantern: true };
      sub("lanterns", () => {
      const cx = rng() * W, cy = H * sp.bandC;
      for (let k = 0; k < sp.count; k++) {
        const a = range(0, TAU);
        sp.fish.push({ x: cx + (rng() - 0.5) * 160 * u, y: cy + (rng() - 0.5) * 80 * u, vx: Math.cos(a) * sp.speed * u, vy: Math.sin(a) * sp.speed * u * 0.3, ph: range(0, TAU), scale: range(0.85, 1.15) });
      }
      });
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
        sub("hunger", () => big.fish.forEach(f => { f.hunger = range(5, 20); }));
      }
    }

    s.jellies = sub("jellies", () => Array.from({ length: Math.round((water.glow ? range(4, 8) : range(2, 5)) * Math.max(0.7, density)) }, () => ({
      x: rng() * W, y: rng() * H * 0.8, r: range(12, 30) * u,
      ph: range(0, TAU), sp: range(0.7, 1.2), drift: range(0, TAU),
      col: pick(water.jelly), tl: range(2.2, 3.4),
    })));

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
      x: rng() * W, dir: chance(0.5) ? 1 : -1, s: range(10, 16) * u, ph: range(0, TAU),
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

    // four seasons, one roll of the seed as before (so the rest of a shared ocean stays the same)
    { const sr = rng(); s.season = sr < 0.25 ? "lente" : sr < 0.5 ? "zomer" : sr < 0.75 ? "herfst" : "winter"; }
    const cold = ["noordzee", "kelpwoud", "ijszee"].includes(water.name), xr = mulberry32((seed ^ 0x5eaf00d) >>> 0);
    s.cold = cold;
    // winter in the North Sea and the kelp forest: drifting ice floes
    if (s.season === "winter" && water.surface && !water.ice && cold) s.floes = Array.from({ length: 2 + Math.floor(xr() * 2) }, () => ({ x: xr() * W, w: (70 + xr() * 110) * u, d: (10 + xr() * 14) * u, sp: 0.05 + xr() * 0.1, seed: xr() * 10 }));
    s.mantis = chance(Lf.mantis) ? { x: rng() * W, s: range(13, 17) * u, cool: 0, strike: 0 } : null;
    s.archer = chance(Lf.archer) && water.surface ? { x: rng() * W, vx: chance(0.5) ? 0.5 : -0.5, s: range(13, 17) * u, cool: 1, face: 1 } : null;
    const host = s.ground.find(g => ["coral", "rocks", "arch", "anemone"].includes(g.kind));
    const cleanersHere = chance(Lf.cleaners);
    s.station = host && cleanersHere ? sub("station", () => ({
      x: host.x,
      grouper: { x: rng() * W, y: H * 0.45, wx: rng() * W, wy: H * range(0.35, 0.6), face: 1, state: "wander", timer: range(6, 15), s: range(26, 34) * u, ph: 0 },
    })) : null;
    s.hidden = s.kelpBack.length >= 3 ? sub("hidden", () => Array.from({ length: 3 }, () => ({
      k: Math.floor(rng() * s.kelpBack.length), seg: 5 + Math.floor(rng() * 7), found: false, dir: chance(0.5) ? 1 : -1, flash: 0,
    }))) : [];
    s.moon = { x: W * range(0.2, 0.8), phase: chance(0.3) ? 1 : range(0.15, 0.9) };
    s.storm = { enabled: !!water.surface, active: false, age: 0, timer: range(50, 130), flash: 0, nextFlash: 0 };
    s.bait = { enabled: water.name !== "diepzee", active: false, timer: range(35, 70), fish: [], att: [] };
    s.flyers = { enabled: chance(Lf.flyingfish) && !!water.surface, timer: range(8, 22), fish: [] };
    s.turnTimer = range(10, 20);
    s.taskT0 = t;
    s.spawnTimer = range(25, 50);
    s.treasure = null;
    // a bottle always holds a map: the treasure lies in the freest spot of sand (on a narrow screen it may lie close to something)
    if (s.ground.some(g => g.kind === "bottle")) sub("treasure", () => {
      let best = null, bestRoom = -Infinity;
      for (let i = 0; i < 60; i++) {
        const x = range(s.floorL + 40 * u, s.floorR - 40 * u);
        const room = s.ground.reduce((m, g) => g.kind === "bottle" ? m : Math.min(m, Math.abs(g.x - x) - g.w * 0.5), Infinity);
        if (room > bestRoom) { bestRoom = room; best = x; }
        if (room > 45 * u) break;
      }
      s.treasure = { x: best, dug: false };
    });

    s.snow = sub("snow", () => Array.from({ length: Math.round((80 + 80 * density) * (s.season === "herfst" ? 2.2 : s.season === "lente" ? 1.7 : 1)) }, () => ({
      x: rng() * W, y: rng() * H, r: range(0.4, 1.6) * u, a: range(0.15, 0.55),
      sp: range(0.05, 0.25), ph: range(0, TAU),
    })));

    s.visitor = null;
    s.visitorTimer = range(2, 6);
    s.visitorPace = s.season === "zomer" ? 0.6 : s.season === "winter" ? 1.4 : 1; // more visitors in summer, fewer in winter
    bubbles = []; ink = []; smoke = []; food = []; coins = []; streaks = [];
    eggs = []; dust = []; rings = []; jets = []; coralSpawn = []; abyssGlows = []; ripples = [];
    current = 0; mapT = 0; busyUntil = 0;

    // keep everything that lives on the floor away from the canyon
    const remap = x => (x >= s.floorL && x <= s.floorR) ? x : s.floorL + (((x % W) + W) % W) / W * (s.floorR - s.floorL);
    for (const arr of [s.crabs, s.starfish, s.urchins, s.hermits, s.slugs, s.kelpBack, s.kelpFront, s.seahorses]) for (const o of arr) o.x = remap(o.x);
    if (s.octopus) s.octopus.x = remap(s.octopus.x);
    if (s.mantis) s.mantis.x = remap(s.mantis.x);
    buildMore(s, Lf, clumps, remap);
    buildWave2(s, Lf, remap);
    buildFauna(s, Lf, remap);
    buildWave6(s);

    s.watch = [];
    // the water itself is logged as soon as the diver goes in
    watch("w:" + water.name, () => diverMode ? [diver.x, diver.y] : null);
    for (const g of s.ground) watch(g.kind, () => [g.x, sandY(g.x) - (g.s || 20 * u) * 0.5], Math.min(g.w * 0.35, 120 * u));
    if (s.canyon) watch("canyon", () => { const x = s.canyon.x0 + s.canyon.side * 150 * u; return [x, sandY(x) - 60 * u]; }, 80 * u);
    const clownHome = s.ground.find(g => g.kind === "anemone" && g.clown);
    if (clownHome) watch("clown", () => [clownHome.x, sandY(clownHome.x) - clownHome.s], clownHome.s);
    watch("fish", () => s.species.filter(sp => !sp.lantern).flatMap(sp => sp.fish.filter((f, i) => i % 3 === 0).map(f => [f.x, f.y])), 6 * u);
    if (s.jellies.length) watch("jelly", () => s.jellies.map(j => [j.x, j.y]), 15 * u);
    const lifeNow = presentLife(s), where = lifePoints(s);
    for (const key in lifeNow) if (lifeNow[key]) watch(key, where[key] || (() => diverMode ? [diver.x, diver.y] : null), 14 * u);
    if (s.station) watch("grouper", () => [s.station.grouper.x, s.station.grouper.y], 20 * u);
    if (s.ghost) watch("ghost", () => [s.ghost.x, s.ghost.y], 90 * u);
    if (ev && ev.aurora && water.surface && s.aurora) s.aurora.enabled = true;
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
    const ev = aquarium ? null : activeEvent();
    oceanBoost = (personalOcean && !aquarium && !selfTesting ? glintBoost() : 1) * (ev && ev.shiny || 1);
    buildLimited(!aquarium && !selfTesting);
    if (personalOcean && !aquarium && !selfTesting) store.set(GLINT_KEY, store.get(GLINT_KEY, 0) + 1);
    personalOcean = false;
    seedEl.textContent = seed + oceanTag();
    biomeEl.textContent = nm("w:" + water.name) + oceanTag();
    rareEl.hidden = !scene.rare;
    rareEl.textContent = scene.rare ? L("zeldzaam: ", "rare: ") + nm(scene.rare).toLowerCase() : "";
    try { history.replaceState(null, "", "#" + (aquarium ? aqCode() : seed)); } catch (e) {}
    setTimeout(huntNotice, 1200);
    // the first ocean of an event day says what is going on
    if (ev && !selfTesting) {
      const told = `${ev.id}-${new Date().toDateString()}`;
      if (store.get("oceaan-event", "") !== told) { store.set("oceaan-event", told); setTimeout(() => toast(L(ev.say[0], ev.say[1]), "important"), 900); }
    }
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

  function randomSeed() { return Math.floor(Math.random() * SEED_RANGE); }
  function seedFromHash() {
    const h = (location.hash || "").slice(1);
    const aq = parseAq(h);
    if (aq) { aquarium = { water: aq.water, set: aq.set, shiny: aq.shiny }; return aq.seed; }
    const m = /^(\d{1,10})$/.exec(h);
    if (m) { aquarium = null; return Number(m[1]); }
    return null;
  }

  // The size unit: the short side of the window over 700. A phone held upright counts its width over 560, so the
  // animals are a little bigger there and fill the narrow screen better.
  const uFor = (w, h) => Math.max(0.6, Math.min(w, h) / (h > w * 1.25 ? 560 : 700));
  // On a tall screen there is much more open water above the floor than on a computer: what swims at a height set as
  // a part of the screen is spread over more of it, so the middle is not empty. Only the layout changes, never a die.
  const tallScreen = () => H > W * 1.25;
  const spread = f => tallScreen() ? Math.min(0.72, 0.1 + (f - 0.15) * 1.5) : f;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    W = innerWidth; H = innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    // everything is sized by the window, with no upper limit: zooming the browser out (a bigger window in CSS pixels)
    // makes everything bigger in step, so you always see the same ocean, as at 100%. Small phones keep a lower limit.
    u = uFor(W, H);
    // the same ocean rebuilt at a new size is not a new encounter
    if (seed !== undefined) { rng = mulberry32(seed); rebuilding = true; buildScene(); rebuilding = false; }
  }


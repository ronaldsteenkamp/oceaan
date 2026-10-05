  // ---- shiny animals ----------------------------------------------------
  // Creatures that exist when the ocean is built are rolled from the seed, so a shared seed keeps its shinies.
  function registerShinies(s) {
    const sr = mulberry32((seed ^ 0x9e3779b9) >>> 0);
    const list = [];
    // obj is the creature that gets recoloured; get() says where it is, for the glints and the logbook
    const add = (key, obj, r, get, alive) => { if (sr() < shinyChance(key)) { obj.shiny = key; list.push({ key, obj, r, get, alive }); } };
    const tag = (obj, hue) => { obj.shinyBase = hue; return obj; };
    const floorY = x => sandY(x) + 5 * u;
    for (const sp of s.species) for (const f of sp.fish) add(sp.lantern ? "lantern" : "fish", sp.lantern ? f : tag(f, hexHue(sp.main)), sp.size * u, () => [f.x, f.y], () => sp.fish.includes(f));
    for (const j of s.jellies) { const [r, g, b] = j.col.split(",").map(Number); add("jelly", tag(j, rgbHue(r, g, b)), j.r, () => [j.x, j.y - j.r * 0.3]); }
    for (const c of s.crabs) add("crab", tag(c, hexHue(c.color)), c.s * 0.8, () => [c.x, floorY(c.x) - c.s * 0.45]);
    for (const f of s.starfish) add("starfish", tag(f, hexHue(f.color)), f.s * 0.8, () => [f.x, sandY(f.x) + 3 * u - f.s * 0.55]);
    for (const o of s.urchins) add("urchin", o, o.s, () => [o.x, floorY(o.x) - o.s * 0.4]);
    if (s.octopus) { const o = s.octopus; add("octopus", o, o.s * 0.8, () => [o.x, floorY(o.x) - o.s * 0.9]); }
    if (s.ray) {
      const r = s.ray;
      add("ray", r, r.s * 0.5, () => [r.x, Math.min(sandY(r.x), H * (1 - s.sand.frac) + 12 * u) + 6 * u - r.lift - Math.sin(r.ph * 0.3) * 6 * u]);
    }
    for (const g of s.ground) {
      if (g.kind === "eels") for (const e of g.eels) add("eels", e, 5 * u, () => [g.x + e.dx, sandY(g.x + e.dx) + 6 * u - e.h * g.e * 0.6], () => g.e > 0.3);
      if (g.kind === "anemone" && g.clown) {
        g.clownObjs = [{}, {}];
        g.clownObjs.forEach((o, i) => add("clown", o, g.s * 0.35, () => {
          const a = t * 0.9 + i * Math.PI;
          return [g.x + Math.cos(a) * g.s * 1.3, sandY(g.x) + 5 * u - g.s * 1.3 + Math.sin(a * 1.3) * g.s * 0.35];
        }));
      }
    }
    for (const h of s.seahorses) add("seahorse", tag(h, hexHue(h.color)), h.s * 0.6, () => [h.x + Math.sin(t * 0.3 + h.ph) * 10 * u, sandY(h.x) - h.lift + Math.sin(t * 0.8 + h.ph) * 10 * u - h.s * 0.3]);
    if (s.puffer) { const pf = s.puffer; add("puffer", pf, pf.s, () => [pf.x, pf.y]); }
    if (s.angler) { const a = s.angler; add("angler", a, a.s * 0.7, () => [a.x, a.y + Math.sin(a.ph) * 8 * u]); }
    for (const q of s.squids) add("squid", q, q.s * 0.7, () => [q.x, q.y]);
    for (const h of s.hermits) add("hermit", h, h.s * 0.7, () => [h.x, floorY(h.x) - h.s * 0.6]);
    for (const o of s.slugs) add("slugs", tag(o, o.type === "nudi" ? hexHue(o.body) : hexHue(o.color)), o.s * 0.7, () => [o.x, floorY(o.x) - o.s * 0.3]);
    for (const c of s.combs) add("comb", c, c.r * 0.7, () => [c.x, c.y]);
    for (const o of s.otters) add("otters", o, o.s * 0.5, () => [o.x, waveY(o.x)]);
    if (s.seal) { const se = s.seal; add("seal", se, se.s * 0.4, () => [se.x, se.y !== undefined ? se.y : se.y0]); }
    for (const pg of s.penguins) add("penguins", pg, pg.s * 0.7, () => [pg.x, waveY(pg.x) + 6 * u + Math.max(0, Math.sin((pg.ph % TAU) * 0.5)) * pg.depth]);
    if (s.mantis) { const m = s.mantis; add("mantis", m, m.s * 0.6, () => [m.x, sandY(m.x) + 6 * u - m.s * 0.7]); }
    if (s.archer) { const a = s.archer; add("archer", a, a.s * 0.8, () => [a.x, waveY(a.x) + 28 * u]); }
    if (s.station) {
      const st = s.station, gp = st.grouper;
      add("grouper", gp, gp.s * 0.7, () => [gp.x, gp.y]);
      st.cleanObjs = [{}, {}, {}];
      st.cleanObjs.forEach((o, i) => add("cleaners", o, 4 * u, () => st["c" + i] || [st.x, sandY(st.x) - 55 * u]));
    }
    registerMoreShinies(s, add, tag);
    registerWave2Shinies(s, add);
    registerRareShinies(s, add);
    s.shinies = list;
  }

  // A shiny's colour sits far round the colour wheel from the animal's own colour.
  const BASE_HUE = {
    octopus: 18, ray: 30, eels: 45, puffer: 45, squid: 340, hermit: 15, otters: 25, clown: 25, mantis: 140, archer: 190,
    cleaners: 205, grouper: 30, turtle: 40, swordfish: 220, mermaid: 170, urchin: 290, comb: 200, angler: 220,
    whale: 210, humpback: 210, shark: 205, manta: 210, dolphins: 205, narwhal: 200, seal: 210, penguins: 210, lantern: 215,
  };
  // The rare things can be shiny too; they are rolled with the ocean, so a shared seed keeps them.
  function registerRareShinies(s, add) {
    const R = s.rares;
    if (R.includes("kraken")) add("kraken", s.kraken, 70 * u, () => s.kraken.eye ? [s.kraken.eye.x, s.kraken.eye.y] : [W / 2, H + 100], () => s.kraken.active && s.kraken.reach > 0.4);
    if (R.includes("ghost") && s.ghost) add("ghost", s.ghost, 90 * u, () => [s.ghost.x, s.ghost.y]);
    for (const g of s.ground) {
      if (g.kind === "whalefall") add("whalefall", g, g.w * 0.3, () => [g.x, sandY(g.x) - 15 * u]);
      if (g.kind === "clam" && g.pearl === "gold") add("goldpearl", g, g.s, () => [g.x, sandY(g.x) - g.s * 0.4], () => g.pearl === "gold");
    }
    if (R.includes("serpent")) add("serpent", s.serpent, 34 * u, () => [s.serpent.hx === undefined ? -999 : s.serpent.hx, s.serpent.hy || 0], () => s.serpent.active);
    if (R.includes("megalodon")) add("megalodon", s.megalodon, 120 * u, () => [s.megalodon.x, s.megalodon.y], () => s.megalodon.active);
    if (s.aurora) add("aurora", s.aurora, 80 * u, () => [W / 2, H * 0.12], () => night > 0.5);
    if (R.includes("mobydick")) add("mobydick", s.moby, 100 * u, () => [s.moby.x, s.moby.y], () => s.moby.active);
    if (s.ghostDiver) add("ghostdiver", s.ghostDiver, 24 * u, () => [s.ghostDiver.x, s.ghostDiver.cy || s.ghostDiver.y]);
  }
  Object.assign(BASE_HUE, { hatchlings: 60, eelmigration: 200, giant: 0 });
  Object.assign(BASE_HUE, { kraken: 350, ghost: 160, whalefall: 40, serpent: 140, megalodon: 210, goldpearl: 45, aurora: 140, mobydick: 50, ghostdiver: 160 });

  // A creature that has left and come back (or is new) gets a fresh shiny roll.
  function maybeShiny(key, obj, r, get, alive) {
    // only creatures that have really gone are tidied away; a kraken that is resting stays on the list
    scene.shinies = scene.shinies.filter(e => e.obj !== obj && !(e.temp && e.alive && !e.alive()));
    delete obj.shiny;
    if (Math.random() < shinyChance(key)) { obj.shiny = key; scene.shinies.push({ key, obj, r, get, alive, temp: true }); }
  }

  // ---- coming and going ----------------------------------------------------
  // Now and then a school swims off or a crab walks away, and new ones arrive, each with its own shiny chance.
  function updateTurnover(dtSec) {
    const S = scene;
    S.turnTimer -= dtSec;
    if (S.turnTimer > 0) return;
    S.turnTimer = 14 + Math.random() * 18;
    const schools = S.species.filter(sp => !sp.leaving && sp.fish.length);
    const crabExit = S.floorL <= 0 || S.floorR >= W;
    const options = [];
    if (schools.length) options.push("school");
    if (S.crabs.length && crabExit && !S.crabs.some(c => c.leaving)) options.push("crab");
    if (!options.length) return;
    if (options[Math.floor(Math.random() * options.length)] === "school") {
      const sp = schools[Math.floor(Math.random() * schools.length)];
      let cx = 0;
      for (const f of sp.fish) cx += f.x;
      sp.leaving = cx / sp.fish.length < W / 2 ? -1 : 1;
    } else {
      const c = S.crabs[Math.floor(Math.random() * S.crabs.length)];
      const leftOk = S.floorL <= 0, rightOk = S.floorR >= W;
      c.leaving = leftOk && (!rightOk || c.x < W / 2) ? -1 : 1;
      c.dir = c.leaving; c.pause = 0;
    }
  }

  function renewSchool(sp) {
    const pal = water.fish[Math.floor(Math.random() * water.fish.length)];
    if (!sp.lantern) { sp.main = pal[0]; sp.dark = pal[1]; }
    sp.leaving = 0;
    const from = Math.random() < 0.5 ? -1 : 1, n = sp.predator ? Math.min(12, sp.count) : sp.count, cy = H * sp.bandC;
    sp.fish = Array.from({ length: n }, () => {
      const f = {
        x: from < 0 ? -60 * u - Math.random() * 140 * u : W + 60 * u + Math.random() * 140 * u,
        y: cy + (Math.random() - 0.5) * 80 * u, vx: -from * sp.speed * u, vy: 0,
        ph: Math.random() * TAU, scale: 0.85 + Math.random() * 0.3, shinyBase: hexHue(sp.main),
      };
      if (sp.predator) f.hunger = 5 + Math.random() * 15;
      maybeShiny(sp.lantern ? "lantern" : "fish", f, sp.size * u, () => [f.x, f.y], () => sp.fish.includes(f));
      return f;
    });
  }

  function renewCrab(c) {
    const S = scene, sides = [];
    if (S.floorL <= 0) sides.push(-1);
    if (S.floorR >= W) sides.push(1);
    const side = sides[Math.floor(Math.random() * sides.length)] || -1;
    c.leaving = 0;
    c.x = side < 0 ? -30 : W + 30;
    c.dir = -side;
    c.color = ["#d9543b", "#e07a3a", "#b84a5a", "#c9603c"][Math.floor(Math.random() * 4)];
    c.s = (12 + Math.random() * 8) * u;
    c.shinyBase = hexHue(c.color);
    maybeShiny("crab", c, c.s * 0.8, () => [c.x, floorY(c.x) - c.s * 0.45]);
  }

  function renewJelly(j) {
    j.col = water.jelly[Math.floor(Math.random() * water.jelly.length)];
    j.r = (12 + Math.random() * 18) * u;
    const [r, g, b] = j.col.split(",").map(Number);
    j.shinyBase = rgbHue(r, g, b);
    maybeShiny("jelly", j, j.r, () => [j.x, j.y - j.r * 0.3]);
  }

  // Feeding brings a few new fish in from the nearest side.
  function bringNewcomers() {
    const cands = scene.species.filter(sp => !sp.predator && !sp.lantern && !sp.leaving && sp.fish.length < sp.count * 1.5);
    if (!cands.length) return;
    const sp = cands[Math.floor(Math.random() * cands.length)], side = pointer.x < W / 2 ? -1 : 1, n = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      const f = {
        x: side < 0 ? -40 * u - i * 18 * u : W + 40 * u + i * 18 * u,
        y: Math.max(pointer.y + (Math.random() - 0.5) * 60 * u, (water.surface ? waveY(pointer.x) : 0) + 30 * u),
        vx: -side * sp.speed * u, vy: 0, ph: Math.random() * TAU, scale: 0.85 + Math.random() * 0.3, shinyBase: hexHue(sp.main),
      };
      sp.fish.push(f);
      maybeShiny("fish", f, sp.size * u, () => [f.x, f.y], () => sp.fish.includes(f));
    }
  }

  function rgbHue(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (!d) return 0;
    const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return (h * 60 + 360) % 360;
  }
  const hexHue = hex => { const [r, g, b] = hexRgb(hex); return rgbHue(r, g, b); };
  function shinyHueFor(key, obj) {
    const base = obj && obj.shinyBase !== undefined ? obj.shinyBase : BASE_HUE[key] !== undefined ? BASE_HUE[key] : 200;
    return (base + 150) % 360;
  }

  // A shiny creature is drawn into a spare layer, recoloured there, and then put back.
  // The spare layers match whatever is being drawn on: the ocean itself, or a small logbook picture.
  let shinyA = null, shinyB = null, shinyMain = null;
  const shinyBufs = new Map();
  function beginShiny() {
    const target = ctx.canvas;
    if (shinyMain || !target || !target.width || !target.height) return false;
    const key = target.width + "x" + target.height;
    let bufs = shinyBufs.get(key);
    if (!bufs) {
      if (shinyBufs.size > 3) shinyBufs.clear();
      bufs = [document.createElement("canvas"), document.createElement("canvas")];
      for (const c of bufs) { c.width = target.width; c.height = target.height; }
      shinyBufs.set(key, bufs);
    }
    [shinyA, shinyB] = bufs;
    const a = shinyA.getContext("2d");
    a.setTransform(1, 0, 0, 1, 0, 0);
    a.clearRect(0, 0, shinyA.width, shinyA.height);
    a.setTransform(ctx.getTransform());
    a.globalAlpha = ctx.globalAlpha;
    shinyMain = ctx;
    ctx = a;
    return true;
  }
  function endShiny(key, obj) {
    if (!shinyMain) return;
    const a = ctx, w = shinyA.width, h = shinyA.height;
    ctx = shinyMain;
    shinyMain = null;
    const b = shinyB.getContext("2d");
    b.setTransform(1, 0, 0, 1, 0, 0);
    b.globalCompositeOperation = "copy";
    b.drawImage(shinyA, 0, 0);
    b.globalCompositeOperation = "source-over";
    a.setTransform(1, 0, 0, 1, 0, 0);
    a.globalAlpha = 1;
    // keep the shading of the animal, but swap its colour; whites and blacks get a tint too
    const hue = shinyHueFor(key, obj);
    a.globalCompositeOperation = "color";
    a.fillStyle = `hsl(${hue} 80% ${50 + 8 * Math.sin(t * 2.5)}%)`;
    a.fillRect(0, 0, w, h);
    a.globalCompositeOperation = "multiply";
    a.globalAlpha = 0.45;
    a.fillStyle = `hsl(${hue} 85% 72%)`;
    a.fillRect(0, 0, w, h);
    a.globalCompositeOperation = "screen";
    a.globalAlpha = 0.35;
    a.fillStyle = `hsl(${hue} 70% 32%)`;
    a.fillRect(0, 0, w, h);
    a.globalAlpha = 1;
    a.globalCompositeOperation = "destination-in";
    a.drawImage(shinyB, 0, 0);
    a.globalCompositeOperation = "source-over";
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(shinyA, 0, 0);
    ctx.restore();
  }
  // Draw something; recolour it when the creature is shiny.
  function shinyDraw(obj, fn) {
    if (obj && obj.shiny && beginShiny()) { fn(); endShiny(obj.shiny, obj); }
    else fn();
  }

  function drawShinies() {
    for (const e of scene.shinies) {
      if (e.alive && !e.alive()) continue;
      const [x, y] = e.get();
      if (!isFinite(x) || !isFinite(y) || !isFinite(e.r)) continue; // a zero-size pane can give odd positions
      if (x < -60 || x > W + 60 || y < -60 || y > H + 60) continue;
      if (!e.told && x > 0 && x < W && y > 0 && y < H) {
        // the first time it swims into view: a chime, and a note in the logbook
        e.told = true;
        const key = "shiny:" + e.key, isNew = !logbook.has(key);
        seen(key);
        if (!isNew) toast(L(`Er is een ${nm(key).toLowerCase()} in de buurt!`, `There is a ${nm(key).toLowerCase()} nearby!`));
        sfxShiny();
        buzz([30, 40, 30]);
      }
      // small glints that flash on the body itself
      for (let i = 0; i < 3; i++) {
        const slot = Math.floor(t * 1.6 + i * 0.37), ph = (t * 1.6 + i * 0.37) % 1;
        const tw = Math.sin(ph * Math.PI);
        if (tw < 0.15) continue;
        const rx = Math.sin(slot * 12.9898 + i * 78.233) * 0.5, ry = Math.sin(slot * 39.346 + i * 11.135) * 0.35;
        const sx = x + rx * e.r * 1.4, sy = y + ry * e.r * 1.4, sz = (1.5 + 2.5 * tw) * u;
        ctx.fillStyle = `rgba(255,252,235,${0.9 * tw})`;
        ctx.beginPath();
        ctx.moveTo(sx, sy - sz); ctx.lineTo(sx + sz * 0.22, sy - sz * 0.22); ctx.lineTo(sx + sz, sy); ctx.lineTo(sx + sz * 0.22, sy + sz * 0.22);
        ctx.lineTo(sx, sy + sz); ctx.lineTo(sx - sz * 0.22, sy + sz * 0.22); ctx.lineTo(sx - sz, sy); ctx.lineTo(sx - sz * 0.22, sy - sz * 0.22);
        ctx.fill();
      }
    }
  }


  // ---- mangroves, caves and everything that came with them --------------
  // Two more waters, five finds, seven animals, five visitors, four moments and three rare things.

  // ---- building -----------------------------------------------------------
  // Finds on the floor go into the same lists as the other landmarks, so they get a fair spot.
  function addMoreGround(s, P, big, small) {
    if (chance(P.car || 0)) big.push({ kind: "car", w: 170 * u, s: range(46, 58) * u, tilt: range(-0.12, 0.08), dir: chance(0.5) ? 1 : -1, color: pick(["#6f8fa6", "#a65f4a", "#8aa070", "#c9b27a"]) });
    if (chance(P.amphora || 0)) {
      small.push({ kind: "amphora", w: 100 * u, jars: Array.from({ length: 2 + Math.floor(rng() * 3) }, (_, i) => ({
        dx: (i - 1) * 26 * u + range(-6, 6) * u, s: range(20, 30) * u,
        tilt: chance(0.5) ? range(-0.2, 0.2) : (chance(0.5) ? 1 : -1) * range(1.2, 1.5), color: pick(["#b8653a", "#c47a48", "#a8583a"]),
      })) });
    }
    if (chance(P.bell || 0)) small.push({ kind: "bell", w: 60 * u, s: range(22, 28) * u, tilt: range(0.25, 0.7) * (chance(0.5) ? 1 : -1) });
    // the golden pearl always comes with a clam, and that clam gets placed first
    const pearl = s.rares.includes("goldpearl");
    if (pearl || chance(P.clam || 0)) {
      (pearl ? big : small).push({ kind: "clam", w: 80 * u, s: range(24, 30) * u, ph: range(0, TAU), open: 0.6, shut: 0,
        pearl: pearl ? "gold" : chance(0.5) ? "white" : null, mantle: pick(["#3fa0d8", "#7a5ad8", "#3fc0a0", "#d8a03f"]) });
    }
    if (chance(P.seagrass || 0)) {
      small.push({ kind: "seagrass", w: 150 * u, blades: Array.from({ length: 22 + Math.floor(rng() * 14) }, () => ({
        dx: range(-70, 70) * u, h: range(22, 50) * u, ph: range(0, TAU), c: pick(["#6a9a3a", "#7aaa48", "#5a8a32"]),
      })) });
    }
  }

  function buildMore(s, Lf, clumps, remap) {
    // mangrove roots hang down from the trees above the water
    const trees = 2 + Math.floor(rng() * 2);
    s.mangrove = water.mangrove ? Array.from({ length: trees }, (_, i) => ({
      x: W * (i + 0.5) / trees + range(-0.1, 0.1) * W,
      roots: Array.from({ length: 7 + Math.floor(rng() * 4) }, (_, j) => {
        const side = j % 2 ? 1 : -1;
        return { dx0: side * range(4, 22) * u, dx1: side * range(40, 190) * u, y0: range(0.0, 0.12), w: range(4, 7) * u };
      }),
      aerial: Array.from({ length: 4 + Math.floor(rng() * 4) }, () => ({ dx: range(-60, 60) * u, len: range(0.15, 0.4), ph: range(0, TAU) })),
    })) : null;
    // a cave has a rock roof with one opening where the light comes in
    if (water.cave) {
      const ox = range(0.3, 0.7), ow = range(0.1, 0.16), roof = [];
      for (let x = 0; x <= W + 40 * u; x += 20 * u) roof.push(H * range(0.07, 0.12));
      const stal = [];
      for (let i = 0; i < Math.round(W / (26 * u)); i++) {
        const x = rng() * W;
        if (Math.abs(x / W - ox) < ow * 0.8) continue;
        stal.push({ x, len: range(14, 70) * u, w: range(6, 14) * u });
      }
      s.cave = { ox, ow, roof, stal, dots: Array.from({ length: 40 }, () => ({ x: rng() * W, ph: range(0, TAU) })) };
    } else s.cave = null;

    s.cassio = chance(Lf.cassiopea || 0) ? Array.from({ length: 2 + Math.floor(rng() * 3) }, () => ({ x: rng() * W, s: range(12, 18) * u, ph: range(0, TAU), col: pick(["#8aa86a", "#6a9aa8", "#a89a6a"]) })) : [];
    s.lionfish = chance(Lf.lionfish || 0) ? { x: rng() * W, y: H * range(0.5, 0.7), dir: chance(0.5) ? 1 : -1, s: range(28, 36) * u, ph: range(0, TAU), tx: rng() * W } : null;
    s.cuttle = chance(Lf.cuttlefish || 0) ? { x: rng() * W, y: H * range(0.4, 0.65), dir: chance(0.5) ? 1 : -1, s: range(30, 40) * u, ph: range(0, TAU), tx: rng() * W, flash: 0 } : null;
    s.lobsters = chance(Lf.lobster || 0) ? Array.from({ length: 1 + Math.floor(rng() * 2) }, () => ({ x: rng() * W, dir: chance(0.5) ? 1 : -1, s: range(26, 34) * u, leg: 0, pause: 0, speed: range(0.25, 0.45) })) : [];
    s.nautilus = chance(Lf.nautilus || 0) ? { x: rng() * W, y: H * range(0.3, 0.6), dir: chance(0.5) ? 1 : -1, s: range(16, 22) * u, ph: range(0, TAU) } : null;
    s.isopods = chance(Lf.isopod || 0) ? Array.from({ length: 1 + Math.floor(rng() * 2) }, () => ({ x: rng() * W, dir: chance(0.5) ? 1 : -1, s: range(22, 30) * u, leg: 0, speed: range(0.15, 0.3) })) : [];
    s.dragon = chance(Lf.seadragon || 0) ? { x: pick(clumps), y: H * range(0.45, 0.65), dir: chance(0.5) ? 1 : -1, s: range(34, 44) * u, ph: range(0, TAU) } : null;
    for (const arr of [s.cassio, s.lobsters, s.isopods]) for (const o of arr) o.x = remap(o.x);

    s.bloom = { timer: range(60, 140), logged: false };
    s.glowtide = { enabled: !!water.surface && !water.ice, active: false, age: 0, timer: range(10, 30), sparks: [] };
    s.hatch = { enabled: !!water.surface && water.visitors.includes("turtle"), timer: range(40, 110), list: [], logged: false };
    s.serpent = { enabled: s.rares.includes("serpent"), active: false, timer: range(6, 14) };
    s.megalodon = { enabled: s.rares.includes("megalodon"), active: false, timer: range(8, 16) };
    s.songRings = [];
  }

  function registerMoreShinies(s, add, tag) {
    const fy = x => sandY(x) + 5 * u;
    for (const c of s.cassio) add("cassiopea", tag(c, hexHue(c.col)), c.s, () => [c.x, fy(c.x) - c.s * 0.3]);
    if (s.lionfish) { const f = s.lionfish; add("lionfish", f, f.s * 0.6, () => [f.x, f.cy || f.y]); }
    if (s.cuttle) { const c = s.cuttle; add("cuttlefish", c, c.s * 0.6, () => [c.x, c.cy || c.y]); }
    for (const l of s.lobsters) add("lobster", l, l.s * 0.6, () => [l.x, fy(l.x) - l.s * 0.25]);
    if (s.nautilus) { const n = s.nautilus; add("nautilus", n, n.s * 0.8, () => [n.x, n.cy || n.y]); }
    for (const o of s.isopods) add("isopod", o, o.s * 0.6, () => [o.x, fy(o.x) - o.s * 0.15]);
    if (s.dragon) { const d = s.dragon; add("seadragon", d, d.s * 0.6, () => [d.x, d.cy || d.y]); }
  }
  Object.assign(BASE_HUE, { lionfish: 10, cuttlefish: 30, lobster: 220, nautilus: 25, isopod: 300, seadragon: 40, manatee: 60, orca: 210, hammerhead: 205, sunfish: 210, beluga: 200 });

  // ---- the water itself -----------------------------------------------------
  function drawMangrove() {
    const m = scene.mangrove;
    if (!m) return;
    const wood = sh("#4a3a28"), dark = sh("#2e2418"), shell = sh("#d8d0b8", 0.1);
    ctx.lineCap = "round";
    const top = -10 * u;
    for (const tr of m) {
      // thin aerial roots hang straight down from the branches
      ctx.strokeStyle = dark; ctx.lineWidth = 1.6 * u;
      for (const a of tr.aerial) {
        const x = tr.x + a.dx, sw = Math.sin(t * 0.6 + a.ph) * 3 * u;
        ctx.beginPath(); ctx.moveTo(x, top); ctx.quadraticCurveTo(x + sw, H * a.len * 0.5, x + sw * 1.5, H * a.len); ctx.stroke();
      }
      // stilt roots arch out from the trunk and dive into the mud
      for (const r of tr.roots) {
        const x0 = tr.x + r.dx0, y0 = top + H * r.y0, x1 = tr.x + r.dx1, y1 = sandY(x1) + 8 * u;
        const c1x = x0 + (x1 - x0) * 0.55, c1y = y0 + (y1 - y0) * 0.05, c2x = x1, c2y = y0 + (y1 - y0) * 0.35;
        for (const [col, w] of [[dark, r.w + 2 * u], [wood, r.w]]) {
          ctx.strokeStyle = col; ctx.lineWidth = w;
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(c1x, c1y, c2x, c2y, x1, y1); ctx.stroke();
        }
        // barnacles and oysters grow on the roots
        ctx.fillStyle = shell;
        for (let f = 0.45; f < 0.9; f += 0.13) {
          const g = 1 - f;
          const bx = g * g * g * x0 + 3 * g * g * f * c1x + 3 * g * f * f * c2x + f * f * f * x1;
          const by = g * g * g * y0 + 3 * g * g * f * c1y + 3 * g * f * f * c2y + f * f * f * y1;
          ctx.beginPath(); ctx.arc(bx + r.w * 0.3, by, r.w * 0.32, 0, TAU); ctx.fill();
        }
      }
      // the trunk itself, rising out of the water
      ctx.fillStyle = dark;
      ctx.beginPath(); ctx.moveTo(tr.x - 16 * u, top); ctx.lineTo(tr.x + 16 * u, top); ctx.lineTo(tr.x + 9 * u, H * 0.1); ctx.lineTo(tr.x - 9 * u, H * 0.1); ctx.closePath(); ctx.fill();
    }
  }

  function roofY(x) {
    const c = scene.cave, step = 20 * u;
    const i = Math.max(0, Math.min(c.roof.length - 2, Math.floor(x / step))), f = Math.max(0, Math.min(1, x / step - i));
    const base = c.roof[i] + (c.roof[i + 1] - c.roof[i]) * f;
    const o0 = (c.ox - c.ow / 2) * W, o1 = (c.ox + c.ow / 2) * W;
    if (x > o0 && x < o1) return 0;
    const dist = x <= o0 ? o0 - x : x - o1;
    return base * (0.25 + 0.75 * Math.min(1, dist / (90 * u)));
  }

  function drawCaveRoof() {
    const c = scene.cave;
    if (!c) return;
    const o0 = (c.ox - c.ow / 2) * W, o1 = (c.ox + c.ow / 2) * W;
    ctx.fillStyle = sh("#1c2224", 0.15);
    for (const [a, b] of [[-10 * u, o0], [o1, W + 10 * u]]) {
      ctx.beginPath(); ctx.moveTo(a, -2);
      for (let x = a; x < b; x += 10 * u) ctx.lineTo(x, roofY(Math.max(0, x)));
      ctx.lineTo(b, 0); ctx.lineTo(b, -2); ctx.closePath(); ctx.fill();
    }
    for (const st of c.stal) {
      const y = roofY(st.x) - 3 * u;
      ctx.beginPath(); ctx.moveTo(st.x - st.w / 2, y); ctx.lineTo(st.x + st.w / 2, y); ctx.lineTo(st.x + st.w * 0.08, y + st.len); ctx.closePath(); ctx.fill();
    }
    // glowworms on the roof give off a soft blue light
    ctx.globalCompositeOperation = "lighter";
    for (const d of c.dots) {
      const y = roofY(d.x);
      if (y <= 0) continue;
      ctx.fillStyle = `rgba(120,220,255,${0.35 + 0.3 * Math.sin(t * 1.5 + d.ph)})`;
      ctx.beginPath(); ctx.arc(d.x, y + 2 * u, 1.3 * u, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  // ---- finds on the floor ----------------------------------------------------
  function drawCar(g) {
    const s = g.s, y0 = sandY(g.x) + s * 0.12;
    const paint = sh(g.color), dark = sh("#1a2228"), rust = sh("#7a4a2a"), glass = sh("#2a4a58", 0.1);
    ctx.save(); ctx.translate(g.x, y0); ctx.scale(faceOf(g), 1); ctx.rotate(g.tilt);
    // a round old car, half sunk in the sand
    ctx.fillStyle = paint;
    ctx.beginPath();
    ctx.moveTo(-s * 1.4, 0);
    ctx.quadraticCurveTo(-s * 1.45, -s * 0.5, -s * 1.0, -s * 0.6);
    ctx.quadraticCurveTo(-s * 0.7, -s * 1.15, 0, -s * 1.15);
    ctx.quadraticCurveTo(s * 0.7, -s * 1.15, s * 0.95, -s * 0.6);
    ctx.quadraticCurveTo(s * 1.45, -s * 0.5, s * 1.4, 0);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = glass;
    ctx.beginPath(); ctx.moveTo(-s * 0.75, -s * 0.62); ctx.quadraticCurveTo(-s * 0.55, -s * 1.02, -s * 0.05, -s * 1.03); ctx.lineTo(-s * 0.05, -s * 0.62); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s * 0.05, -s * 0.62); ctx.lineTo(s * 0.05, -s * 1.03); ctx.quadraticCurveTo(s * 0.55, -s * 1.02, s * 0.72, -s * 0.62); ctx.closePath(); ctx.fill();
    ctx.fillStyle = dark;
    for (const wx of [-0.85, 0.85]) { ctx.beginPath(); ctx.arc(wx * s, -s * 0.05, s * 0.3, Math.PI, TAU); ctx.fill(); }
    ctx.fillStyle = rust;
    for (const [rx, ry, rr] of [[-0.9, -0.4, 0.12], [0.4, -0.75, 0.08], [1.1, -0.25, 0.1], [-0.3, -0.35, 0.07]]) { ctx.beginPath(); ctx.ellipse(rx * s, ry * s, rr * s, rr * s * 0.7, 0.3, 0, TAU); ctx.fill(); }
    ctx.fillStyle = sh("#d8d8c0"); ctx.beginPath(); ctx.arc(s * 1.18, -s * 0.42, s * 0.1, 0, TAU); ctx.fill();
    // sea life has moved in on the roof
    ctx.fillStyle = sh("#e87a6a"); ctx.beginPath(); ctx.arc(-s * 0.2, -s * 1.13, s * 0.1, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = sh("#d8b04a"); ctx.fillRect(s * 0.3, -s * 1.3, s * 0.08, s * 0.18); ctx.fillRect(s * 0.42, -s * 1.24, s * 0.07, s * 0.12);
    ctx.restore();
  }

  function drawAmphora(g) {
    for (const j of g.jars) {
      const x = g.x + j.dx, s = j.s, lying = Math.abs(j.tilt) > 1;
      const c = sh(j.color), d = sh("#6a3420");
      ctx.save(); ctx.translate(x, sandY(x) + (lying ? 4 * u - s * 0.32 : 6 * u)); ctx.rotate(j.tilt);
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(-s * 0.12, -s * 1.2); ctx.lineTo(s * 0.12, -s * 1.2); ctx.lineTo(s * 0.1, -s * 0.95);
      ctx.quadraticCurveTo(s * 0.48, -s * 0.8, s * 0.38, -s * 0.35);
      ctx.quadraticCurveTo(s * 0.25, -s * 0.05, 0, 0);
      ctx.quadraticCurveTo(-s * 0.25, -s * 0.05, -s * 0.38, -s * 0.35);
      ctx.quadraticCurveTo(-s * 0.48, -s * 0.8, -s * 0.1, -s * 0.95);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = c; ctx.lineWidth = s * 0.06;
      for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sd * s * 0.1, -s * 1.1); ctx.quadraticCurveTo(sd * s * 0.35, -s * 1.12, sd * s * 0.28, -s * 0.85); ctx.stroke(); }
      ctx.strokeStyle = d; ctx.lineWidth = Math.max(0.8, s * 0.03);
      ctx.beginPath(); ctx.moveTo(-s * 0.36, -s * 0.6); ctx.quadraticCurveTo(0, -s * 0.52, s * 0.36, -s * 0.6); ctx.stroke();
      ctx.restore();
    }
  }

  function drawBell(g) {
    const s = g.s, bronze = sh("#a8803a"), green = sh("#5a9a7a"), dark = sh("#3a2a14");
    // a ship's bell, half sunk and leaning over, with its clapper hanging out
    ctx.save(); ctx.translate(g.x, sandY(g.x) + 6 * u); ctx.rotate(g.tilt); ctx.translate(0, -s * 0.5);
    ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(s * 0.08, s * 0.62, s * 0.1, 0, TAU); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = s * 0.05; ctx.beginPath(); ctx.moveTo(0, s * 0.3); ctx.lineTo(s * 0.08, s * 0.55); ctx.stroke();
    ctx.fillStyle = bronze;
    ctx.beginPath(); ctx.moveTo(-s * 0.28, -s * 0.45); ctx.quadraticCurveTo(-s * 0.32, s * 0.15, -s * 0.55, s * 0.42);
    ctx.quadraticCurveTo(-s * 0.62, s * 0.5, -s * 0.5, s * 0.52); ctx.lineTo(s * 0.5, s * 0.52); ctx.quadraticCurveTo(s * 0.62, s * 0.5, s * 0.55, s * 0.42);
    ctx.quadraticCurveTo(s * 0.32, s * 0.15, s * 0.28, -s * 0.45); ctx.quadraticCurveTo(0, -s * 0.62, -s * 0.28, -s * 0.45); ctx.fill();
    ctx.strokeStyle = sh("#c8a050"); ctx.lineWidth = Math.max(0.8, s * 0.04);
    ctx.beginPath(); ctx.moveTo(-s * 0.42, s * 0.32); ctx.quadraticCurveTo(0, s * 0.26, s * 0.42, s * 0.32); ctx.stroke();
    ctx.fillStyle = green;
    for (const [px, py, pr] of [[-0.15, -0.2, 0.12], [0.2, 0.15, 0.1], [-0.3, 0.3, 0.08]]) { ctx.beginPath(); ctx.arc(px * s, py * s, pr * s, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = bronze; ctx.lineWidth = s * 0.08; ctx.beginPath(); ctx.arc(0, -s * 0.58, s * 0.12, Math.PI, TAU); ctx.stroke();
    ctx.restore();
  }

  // A giant clam opens and closes slowly. Tap it and it snaps shut, unless there is a golden pearl to take.
  function drawClam(g, k) {
    g.ph += 0.008 * k;
    g.shut = Math.max(0, (g.shut || 0) - 0.006 * k);
    const target = g.shut > 0 ? 0 : 0.35 + 0.65 * Math.max(0, Math.sin(g.ph));
    g.open += (target - g.open) * Math.min(1, (g.shut > 0 ? 0.2 : 0.03) * Math.max(k, 0.0001));
    if (k === 0) g.open = target;
    const s = g.s, y = sandY(g.x) + 5 * u, lip = s * (0.06 + g.open * 0.3), cy = -s * 0.38;
    const shell = sh("#d8d0c0"), ridge = sh("#a89c88");
    ctx.save(); ctx.translate(g.x, y);
    ctx.fillStyle = sh(g.mantle);
    ctx.beginPath(); ctx.ellipse(0, cy, s * 0.85, lip + s * 0.04, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.arc(i * s * 0.2, cy + Math.sin(i + g.ph * 3) * lip * 0.3, s * 0.035, 0, TAU); ctx.fill(); }
    if (g.pearl && g.open > 0.45) {
      const gold = g.pearl === "gold";
      ctx.fillStyle = gold ? "#f2c440" : "#f4f0ea";
      ctx.beginPath(); ctx.arc(0, cy, s * (gold ? 0.17 : 0.12), 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(-s * 0.04, cy - s * 0.04, s * 0.035, 0, TAU); ctx.fill();
      if (gold) { const tw = 0.5 + 0.5 * Math.sin(t * 3); ctx.fillStyle = `rgba(255,240,170,${0.25 * tw})`; ctx.beginPath(); ctx.arc(0, cy, s * 0.3, 0, TAU); ctx.fill(); }
    }
    // lower shell with a wavy rim
    ctx.fillStyle = shell;
    ctx.beginPath(); ctx.moveTo(-s, cy + lip * 0.3);
    for (let i = 0; i <= 10; i++) ctx.lineTo(-s + i * s * 0.2, cy + lip * 0.3 + (i % 2 ? s * 0.08 : 0));
    ctx.quadraticCurveTo(s * 0.9, s * 0.05, 0, s * 0.05); ctx.quadraticCurveTo(-s * 0.9, s * 0.05, -s, cy + lip * 0.3); ctx.fill();
    // upper shell lifts as it opens
    const top = cy - lip;
    ctx.beginPath(); ctx.moveTo(-s, top);
    for (let i = 0; i <= 10; i++) ctx.lineTo(-s + i * s * 0.2, top - (i % 2 ? s * 0.08 : 0));
    ctx.quadraticCurveTo(s * 0.9, top - s * 0.4, 0, top - s * 0.42); ctx.quadraticCurveTo(-s * 0.9, top - s * 0.4, -s, top); ctx.fill();
    ctx.strokeStyle = ridge; ctx.lineWidth = Math.max(0.7, s * 0.03);
    for (let i = 1; i < 10; i += 2) {
      const x = -s + i * s * 0.2;
      ctx.beginPath(); ctx.moveTo(x, cy + lip * 0.3 + s * 0.08); ctx.lineTo(x * 0.5, s * 0.02); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, top - s * 0.08); ctx.lineTo(x * 0.5, top - s * 0.38); ctx.stroke();
    }
    ctx.restore();
  }

  function tapClam(x, y) {
    for (const g of scene.ground) {
      if (g.kind !== "clam" || Math.hypot(x - g.x, y - (sandY(g.x) - g.s * 0.35)) > g.s * 1.2) continue;
      if (g.pearl === "gold" && g.open > 0.45) {
        g.pearl = null;
        seen("goldpearl");
        sfxChest();
        buzz([40, 50, 80]);
        for (let i = 0; i < 16; i++) {
          const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.8, v = (1 + Math.random() * 2.5) * u;
          coins.push({ x: g.x, y: sandY(g.x) - g.s * 0.4, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 4 * u, rot: Math.random() * TAU, spin: 0.2, life: 4 });
        }
      } else g.shut = 1;
      return true;
    }
    return false;
  }

  function drawSeagrass(g) {
    ctx.lineCap = "round";
    for (const b of g.blades) {
      const x = g.x + b.dx, y = sandY(x) + 6 * u, sway = Math.sin(t * 0.9 + b.ph + x * 0.01) * 0.25 + current * 0.15;
      ctx.strokeStyle = sh(b.c); ctx.lineWidth = 2.6 * u;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sway * b.h * 0.3, y - b.h * 0.6, x + sway * b.h, y - b.h); ctx.stroke();
    }
  }
  Object.assign(GROUND_DRAW, { car: drawCar, amphora: drawAmphora, bell: drawBell, clam: drawClam, seagrass: drawSeagrass });

  // ---- animals ----------------------------------------------------------------
  // An upside-down jellyfish lies on the sand with its arms up towards the light.
  function drawCassio(c, k) {
    c.ph += 0.03 * k;
    const s = c.s, p = 1 + Math.sin(c.ph) * 0.08;
    ctx.save(); ctx.translate(c.x, sandY(c.x) + 4 * u);
    // the bell lies flat on the sand, pulsing
    ctx.fillStyle = sh("#c8bc90");
    ctx.beginPath(); ctx.ellipse(0, 0, s * p, s * 0.26, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#a89c70"); ctx.lineWidth = Math.max(0.6, s * 0.03);
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(i * s * 0.14, s * 0.05); ctx.lineTo(i * s * 0.28 * p, s * 0.2); ctx.stroke(); }
    // frilly arms point up towards the light, like little bushes
    const arms = sh(c.col), dark = sh(c.col, 0.2);
    for (let i = 0; i < 8; i++) {
      const ax = (i - 3.5) * s * 0.2, h = s * (0.32 + ((i * 5) % 3) * 0.08) + Math.sin(c.ph + i) * s * 0.03;
      ctx.strokeStyle = dark; ctx.lineWidth = s * 0.08; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(ax * 0.6, -s * 0.05); ctx.lineTo(ax, -h); ctx.stroke();
      ctx.fillStyle = arms;
      for (const [dx, dy, r] of [[0, 0, 0.11], [-0.08, 0.05, 0.08], [0.08, 0.05, 0.08]]) { ctx.beginPath(); ctx.arc(ax + dx * s, -h + dy * s, r * s, 0, TAU); ctx.fill(); }
    }
    ctx.fillStyle = sh("#f0ecc0");
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc((i - 2.5) * s * 0.27, -s * 0.36 - (i % 2) * s * 0.08, s * 0.045, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // Hovers slowly from spot to spot, its venomous spines spread like a fan.
  function drawLionfish(f, k) {
    f.ph += 0.05 * k;
    if (Math.abs(f.tx - f.x) < 10 * u) f.tx = Math.max(40 * u, Math.min(W - 40 * u, f.x + (Math.random() - 0.5) * 400 * u));
    const dx = f.tx - f.x;
    f.x += Math.sign(dx) * 0.25 * u * k;
    if (Math.abs(dx) > 5 * u) f.dir = Math.sign(dx);
    const y = f.y + Math.sin(f.ph * 0.4) * 6 * u, s = f.s;
    f.cy = y;
    ctx.save(); ctx.translate(f.x, y); ctx.scale(faceOf(f), 1);
    ctx.fillStyle = "rgba(220,150,120,0.35)";
    ctx.beginPath(); ctx.moveTo(s * 0.05, s * 0.05);
    for (let i = 0; i <= 8; i++) { const a = 2.2 + i * 0.16; ctx.lineTo(s * 0.05 + Math.cos(a) * s * 0.75, s * 0.05 + Math.sin(a) * s * 0.75); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = sh("#e8c8b0"); ctx.lineWidth = Math.max(0.6, s * 0.025);
    for (let i = 0; i < 9; i++) {
      const a = 2.2 + i * 0.16 + Math.sin(f.ph + i * 0.3) * 0.05;
      ctx.beginPath(); ctx.moveTo(s * 0.05, s * 0.05); ctx.lineTo(s * 0.05 + Math.cos(a) * s * 0.75, s * 0.05 + Math.sin(a) * s * 0.75); ctx.stroke();
    }
    ctx.strokeStyle = sh("#c84a3a");
    for (let i = 0; i < 9; i++) { const x0 = -s * 0.25 + i * s * 0.07; ctx.beginPath(); ctx.moveTo(x0, -s * 0.12); ctx.lineTo(x0 - s * 0.08, -s * (0.45 + Math.sin(i * 1.7) * 0.08)); ctx.stroke(); }
    ctx.fillStyle = "rgba(220,150,120,0.5)";
    ctx.beginPath(); ctx.moveTo(-s * 0.38, 0); ctx.lineTo(-s * 0.62, -s * 0.13); ctx.lineTo(-s * 0.62, s * 0.13); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh("#f2e6d8");
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.42, s * 0.16, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.fillStyle = sh("#b8392c");
    for (let i = -5; i <= 5; i++) { ctx.beginPath(); ctx.ellipse(i * s * 0.09, 0, s * 0.025, s * 0.2, 0.15, 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.fillStyle = "#1a1010"; ctx.beginPath(); ctx.arc(s * 0.3, -s * 0.03, s * 0.035, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // Colour waves roll over the cuttlefish; come too close and it flashes pale and backs away.
  const CUTTLE_MANTLE = "M 46 0 C 46 -16 30 -22 0 -22 C -28 -22 -48 -14 -52 0 C -48 14 -28 22 0 22 C 30 22 46 16 46 0 Z";
  const CUTTLE_HEAD = "M 44 -12 C 54 -14 62 -10 64 -4 L 64 4 C 62 10 54 14 44 12 Z";
  function drawCuttle(c, k) {
    c.ph += 0.06 * k;
    const p = poke(), d = p.on ? Math.hypot(p.x - c.x, p.y - (c.cy || c.y)) : 1e9;
    if (d < 120 * u && c.flash <= 0) { c.flash = 1; c.tx = c.x + Math.sign(c.x - p.x || 1) * 200 * u; }
    c.flash = Math.max(0, c.flash - 0.012 * k);
    if (Math.abs(c.tx - c.x) < 8 * u) c.tx = Math.max(50 * u, Math.min(W - 50 * u, c.x + (Math.random() - 0.5) * 360 * u));
    c.tx = Math.max(30 * u, Math.min(W - 30 * u, c.tx));
    const dx = c.tx - c.x, back = c.flash > 0.5;
    c.x += Math.sign(dx) * (back ? 1.6 : 0.3) * u * k;
    if (!back && Math.abs(dx) > 5 * u) c.dir = Math.sign(dx); // it backs away without turning round
    const y = c.y + Math.sin(c.ph * 0.3) * 8 * u, s = c.s;
    c.cy = y;
    ctx.save(); ctx.translate(c.x, y); ctx.scale(faceOf(c) * s / 100, s / 100);
    const pale = c.flash > 0.3, skin = sh(pale ? "#ece6dc" : "#a07850"), fin = sh("#c8a888");
    // the thin fin around the mantle ripples in a wave
    ctx.fillStyle = fin; ctx.beginPath();
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * TAU, w = 1 + Math.sin(a * 9 + c.ph * 3) * 0.05;
      const px = Math.cos(a) * 52 * w - 4, py = Math.sin(a) * 26 * w;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = skin; ctx.fill(P(CUTTLE_MANTLE));
    ctx.save(); ctx.clip(P(CUTTLE_MANTLE));
    ctx.strokeStyle = pale ? `rgba(40,20,10,${0.5 * c.flash})` : "rgba(60,35,20,0.4)"; ctx.lineWidth = 4; ctx.lineCap = "round";
    for (let i = 0; i < 9; i++) { const px = -48 + ((i * 12 + c.ph * 8) % 108); ctx.beginPath(); ctx.moveTo(px, -22); ctx.quadraticCurveTo(px + 6, 0, px, 22); ctx.stroke(); }
    ctx.fillStyle = "rgba(255,240,220,0.18)"; ctx.beginPath(); ctx.ellipse(0, -8, 36, 6, 0, 0, TAU); ctx.fill();
    ctx.restore();
    // head and the arms held together in a point
    ctx.fillStyle = sh("#b08860"); ctx.fill(P(CUTTLE_HEAD));
    ctx.strokeStyle = sh("#b08860"); ctx.lineWidth = 4; ctx.lineCap = "round";
    for (let i = 0; i < 4; i++) { const yy = (i - 1.5) * 3.4; ctx.beginPath(); ctx.moveTo(62, yy); ctx.quadraticCurveTo(74, yy + Math.sin(c.ph + i) * 3, 84, yy * 1.6); ctx.stroke(); }
    ctx.fillStyle = "#e8d8a0"; ctx.beginPath(); ctx.arc(52, -5, 5, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#1a1208"; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(49, -6); ctx.lineTo(51, -4); ctx.lineTo(52, -5.5); ctx.lineTo(53, -4); ctx.lineTo(55, -6); ctx.stroke();
    ctx.restore();
  }

  // A lobster: a spiny shell with a pointed beak, a segmented tail ending in a fan,
  // and two big claws that open and close in turn.
  const LOB_SHELL = "M 30 -16 C 29 -26 16 -30 2 -29 C -8 -28 -15 -25 -18 -19 L -18 -10 C -10 -6 10 -6 26 -10 C 29 -11.5 30.5 -13.5 30 -16 Z M 28 -22 L 40 -24 L 29 -19 Z";
  const LOB_ABDOMEN = "M -16 -27 C -30 -28 -46 -25 -62 -20 L -64 -12 C -48 -10 -30 -9 -16 -10 Z";
  const LOB_TAIL = "M -62 -20 L -82 -30 C -85 -20 -85 -10 -82 -1 L -64 -12 Z";
  const LOB_CLAW = "M 0 -6 C 12 -10 26 -9 34 -5 L 42 -6 C 42 -2 38 2 32 3 C 22 6 10 6 0 6 Z";
  const LOB_FINGER = "M 26 -5 C 33 -10 41 -12 47 -10 C 41 -7 33 -4 28 -2 Z";
  function drawLobster(l, k) {
    if (l.pause > 0) l.pause -= k / 60;
    else {
      l.x += l.dir * l.speed * u * k; l.leg += 0.25 * k;
      if (Math.random() < 0.003 * k) l.pause = 1 + Math.random() * 3;
      if (Math.random() < 0.0015 * k) l.dir *= -1;
    }
    if (l.x < scene.floorL + 30 * u) l.dir = 1;
    if (l.x > scene.floorR - 30 * u) l.dir = -1;
    const s = l.s, body = sh("#2f4a78"), dark = sh("#1c2c4a"), light = sh("#5a78a8");
    ctx.save(); ctx.translate(l.x, sandY(l.x) + 3 * u); ctx.scale(faceOf(l) * s / 100, s / 100);
    // walking legs
    ctx.strokeStyle = dark; ctx.lineWidth = 2.6; ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (let i = 0; i < 4; i++) { const x0 = 18 - i * 9, sw = Math.sin(l.leg + i) * 4; ctx.beginPath(); ctx.moveTo(x0, -12); ctx.lineTo(x0 + sw + 5, -5); ctx.lineTo(x0 + sw, 0); ctx.stroke(); }
    // the far claw, a shade darker
    const clawAt = (ph, col, dy) => {
      const open = 0.15 + Math.max(0, Math.sin(t * 1.3 + ph)) * 0.35;
      ctx.strokeStyle = col; ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.moveTo(24, -16 + dy); ctx.quadraticCurveTo(36, -24 + dy, 44, -16 + dy); ctx.stroke();
      ctx.save(); ctx.translate(44, -16 + dy); ctx.rotate(-0.1);
      ctx.fillStyle = col; ctx.fill(P(LOB_CLAW));
      ctx.save(); ctx.translate(28, -3); ctx.rotate(-open); ctx.translate(-28, 3); ctx.fill(P(LOB_FINGER)); ctx.restore();
      ctx.restore();
    };
    clawAt(1.5, dark, -3);
    ctx.fillStyle = body;
    ctx.fill(P(LOB_TAIL)); ctx.fill(P(LOB_ABDOMEN)); ctx.fill(P(LOB_SHELL));
    ctx.strokeStyle = dark; ctx.lineWidth = 1.2;
    ctx.beginPath(); for (const sx of [-26, -36, -45, -54]) { ctx.moveTo(sx, -26 + (sx + 16) * -0.12); ctx.lineTo(sx + 1, -10); } ctx.moveTo(-64, -16); ctx.lineTo(-80, -20); ctx.moveTo(-64, -14); ctx.lineTo(-81, -9); ctx.stroke();
    ctx.fillStyle = light; ctx.beginPath(); ctx.ellipse(8, -24, 14, 2.6, -0.05, 0, TAU); ctx.fill();
    clawAt(0, body, 2);
    // long antennae, eye on a stalk
    ctx.strokeStyle = sh("#a05a3a"); ctx.lineWidth = 1.2;
    for (const a of [0, 1]) { ctx.beginPath(); ctx.moveTo(30, -24); ctx.quadraticCurveTo(60, -55 - a * 10 + Math.sin(t * 2 + a) * 5, 90 + a * 10, -30 - a * 15); ctx.stroke(); }
    ctx.fillStyle = "#0e0e10"; ctx.beginPath(); ctx.arc(26, -29, 2.4, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // The nautilus swims shell first, its tentacles trailing behind.
  function drawNautilus(n, k) {
    n.ph += 0.04 * k;
    n.x += n.dir * 0.3 * u * k;
    if (n.x < 30 * u) n.dir = 1;
    if (n.x > W - 30 * u) n.dir = -1;
    const y = n.y + Math.sin(n.ph * 0.5) * 20 * u, s = n.s;
    n.cy = y;
    ctx.save(); ctx.translate(n.x, y); ctx.scale(-n.dir, 1);
    ctx.strokeStyle = sh("#e8c8a8"); ctx.lineWidth = Math.max(0.7, s * 0.06); ctx.lineCap = "round";
    for (let i = 0; i < 7; i++) { const yy = (i - 3) * s * 0.08; ctx.beginPath(); ctx.moveTo(s * 0.55, yy * 0.6); ctx.quadraticCurveTo(s * 0.85, yy + Math.sin(n.ph * 2 + i) * s * 0.08, s * (1.0 + (i % 3) * 0.08), yy * 1.4); ctx.stroke(); }
    ctx.fillStyle = sh("#b07858"); ctx.beginPath(); ctx.ellipse(s * 0.5, -s * 0.05, s * 0.2, s * 0.25, 0.2, 0, TAU); ctx.fill();
    ctx.fillStyle = "#151010"; ctx.beginPath(); ctx.arc(s * 0.55, s * 0.05, s * 0.06, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#f2e8d8"); ctx.beginPath(); ctx.arc(0, 0, s * 0.62, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, s * 0.62, 0, TAU); ctx.clip();
    ctx.strokeStyle = sh("#b0603a"); ctx.lineWidth = s * 0.09;
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI * 0.95 + i * 0.32;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * s * 0.2, Math.sin(a) * s * 0.2);
      ctx.quadraticCurveTo(Math.cos(a + 0.3) * s * 0.5, Math.sin(a + 0.3) * s * 0.5, Math.cos(a + 0.2) * s * 0.7, Math.sin(a + 0.2) * s * 0.7); ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = sh("#c8b8a0"); ctx.lineWidth = Math.max(0.8, s * 0.04);
    ctx.beginPath(); ctx.arc(-s * 0.05, s * 0.05, s * 0.28, 0, TAU * 0.8); ctx.stroke();
    ctx.restore();
  }

  function drawIsopod(o, k) {
    o.x += o.dir * o.speed * u * k; o.leg += 0.3 * k;
    if (o.x < scene.floorL + 20 * u) o.dir = 1;
    if (o.x > scene.floorR - 20 * u) o.dir = -1;
    const s = o.s;
    ctx.save(); ctx.translate(o.x, sandY(o.x) + 4 * u); ctx.scale(faceOf(o), 1);
    ctx.strokeStyle = sh("#8a7a8a"); ctx.lineWidth = Math.max(0.7, s * 0.03);
    for (let i = 0; i < 7; i++) { const x0 = -s * 0.4 + i * s * 0.12, sw = Math.sin(o.leg + i * 0.9) * s * 0.04; ctx.beginPath(); ctx.moveTo(x0, -s * 0.06); ctx.lineTo(x0 + sw, 0); ctx.stroke(); }
    ctx.fillStyle = sh("#a898a8"); ctx.beginPath(); ctx.moveTo(-s * 0.45, -s * 0.08); ctx.lineTo(-s * 0.62, -s * 0.16); ctx.lineTo(-s * 0.62, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh("#b8a8b8"); ctx.beginPath(); ctx.ellipse(0, -s * 0.1, s * 0.5, s * 0.17, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#857585"); ctx.lineWidth = Math.max(0.7, s * 0.025);
    for (let i = 1; i < 9; i++) {
      const x = -s * 0.5 + i * s * 0.11, h = s * 0.16 * Math.sqrt(Math.max(0, 1 - (x / (s * 0.5)) ** 2));
      ctx.beginPath(); ctx.moveTo(x, -s * 0.1 - h); ctx.lineTo(x + s * 0.02, -s * 0.1 + h * 0.6); ctx.stroke();
    }
    ctx.strokeStyle = sh("#8a7a8a"); ctx.beginPath(); ctx.moveTo(s * 0.45, -s * 0.12); ctx.quadraticCurveTo(s * 0.65, -s * 0.3, s * 0.75, -s * 0.12); ctx.stroke();
    ctx.fillStyle = "#1a141a"; ctx.beginPath(); ctx.ellipse(s * 0.38, -s * 0.14, s * 0.04, s * 0.025, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // A leafy seadragon drifts by like a loose piece of seaweed.
  function drawDragon(d, k) {
    d.ph += 0.03 * k;
    d.x += d.dir * 0.12 * u * k;
    if (d.x < 40 * u) d.dir = 1;
    if (d.x > W - 40 * u) d.dir = -1;
    const y = d.y + Math.sin(d.ph * 0.6) * 10 * u, s = d.s, body = sh("#d8a040"), leaf = sh("#9aa040");
    d.cy = y;
    ctx.save(); ctx.translate(d.x, y); ctx.scale(faceOf(d), 1); ctx.rotate(Math.sin(d.ph * 0.5) * 0.06);
    const pts = [];
    for (let i = 0; i <= 12; i++) { const f = i / 12; pts.push([s * (0.5 - f), Math.sin(f * 3 + 0.4) * s * 0.12 + f * f * s * 0.15]); }
    ctx.fillStyle = leaf;
    for (const i of [2, 4, 6, 8, 10]) {
      const [x, yy] = pts[i];
      for (const side of [-1, 1]) {
        ctx.save(); ctx.translate(x, yy); ctx.rotate(side * (1.2 + Math.sin(d.ph * 2 + i) * 0.15) - 0.3);
        ctx.beginPath(); ctx.ellipse(s * 0.12, 0, s * 0.13, s * 0.04, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(s * 0.2, s * 0.03, s * 0.07, s * 0.03, 0.5, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }
    ctx.strokeStyle = body; ctx.lineCap = "round";
    for (let i = 0; i < 12; i++) { ctx.lineWidth = s * (0.11 - i * 0.007); ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke(); }
    ctx.lineWidth = s * 0.035; ctx.beginPath(); ctx.moveTo(s * 0.5, pts[0][1]); ctx.lineTo(s * 0.78, pts[0][1] + s * 0.04); ctx.stroke();
    ctx.fillStyle = "#1a1208"; ctx.beginPath(); ctx.arc(s * 0.47, pts[0][1] - s * 0.02, s * 0.02, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawMoreFloor(k) {
    const S = scene;
    for (const c of S.cassio) shinyDraw(c, () => drawCassio(c, k));
    for (const o of S.isopods) shinyDraw(o, () => drawIsopod(o, k));
    for (const l of S.lobsters) shinyDraw(l, () => drawLobster(l, k));
  }
  function drawMoreMid(k) {
    const S = scene;
    if (S.dragon) shinyDraw(S.dragon, () => drawDragon(S.dragon, k));
    if (S.lionfish) shinyDraw(S.lionfish, () => drawLionfish(S.lionfish, k));
    if (S.cuttle) shinyDraw(S.cuttle, () => drawCuttle(S.cuttle, k));
    if (S.nautilus) shinyDraw(S.nautilus, () => drawNautilus(S.nautilus, k));
  }

  // ---- visitors -----------------------------------------------------------
  function drawManatee(v) {
    const L = v.size, skin = sh("#8a8a80"), dark = sh("#5a5a52");
    ctx.save(); ctx.translate(v.x, v.y + v.yOff); ctx.scale(faceOf(v), 1); ctx.rotate(Math.sin(v.ph) * 0.03);
    ctx.fillStyle = skin;
    ctx.save(); ctx.translate(-L * 0.42, 0); ctx.rotate(Math.sin(v.ph * 2) * 0.25);
    ctx.beginPath(); ctx.ellipse(-L * 0.1, 0, L * 0.14, L * 0.1, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, 0, L * 0.45, L * 0.16, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(L * 0.42, L * 0.03, L * 0.12, L * 0.1, 0.2, 0, TAU); ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.ellipse(L * 0.5, L * 0.07, L * 0.05, L * 0.04, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(L * 0.42, -L * 0.02, L * 0.012, 0, TAU); ctx.fill();
    ctx.fillStyle = skin;
    ctx.save(); ctx.translate(L * 0.25, L * 0.1); ctx.rotate(0.6 + Math.sin(v.ph * 2) * 0.3); ctx.beginPath(); ctx.ellipse(0, L * 0.06, L * 0.03, L * 0.08, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(0.7, L * 0.006);
    for (const x of [-0.1, 0, 0.1]) { ctx.beginPath(); ctx.moveTo(L * x, -L * 0.14); ctx.lineTo(L * (x + 0.04), -L * 0.1); ctx.stroke(); }
    ctx.fillStyle = "rgba(90,130,60,0.35)"; ctx.beginPath(); ctx.ellipse(-L * 0.05, -L * 0.12, L * 0.18, L * 0.04, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // An orca: a tall dorsal fin standing up from the middle of the back, a grey saddle behind it,
  // the white eye patch, white chin and belly with the white flank sweep, and round paddle flippers.
  const ORCA_BODY = "M 50 2 C 49 -6 44 -11 34 -13.5 C 14 -16.5 -14 -13 -32 -6 C -40 -3 -46 -1 -48 0 C -42 3 -32 6 -12 9.5 C 12 13 38 11 47 7 C 50 5.5 50 3.5 50 2 Z";
  const ORCA_FIN = "M 7 -15 C 6 -24 3 -32 -1 -39 C -3 -30 -8 -20 -15 -12.5 Z";
  const ORCA_SADDLE = "M -13 -12.5 C -19 -13.5 -27 -11 -31 -6.5 C -25 -8.5 -17 -9.5 -11 -9.5 Z";
  const ORCA_BELLY = "M 49 5 C 40 9.5 26 11.5 8 10.5 C -2 10 -9 8.5 -12 6.5 C 2 5.5 22 6.5 36 4.5 C 42 4 46 4.2 49 5 Z";
  const ORCA_FLANK = "M 2 9.5 C -8 8.5 -17 4 -23 -1.5 C -25.5 -4 -21 -4.5 -17.5 -2 C -12 1.5 -5 4.5 2 6 Z";
  const ORCA_FLIPPER = "M 0 0 C 4 5 6 12 3 16 C 0 18.5 -4.5 16.5 -4.5 10.5 C -4.5 6 -2.5 2 0 0 Z";
  const ORCA_FLUKE = "M 2 0 C -4 -3 -9 -7 -14 -10 C -12 -4 -11 -1 -11 0 C -11 1 -12 4 -14 10 C -9 7 -4 3 2 0 Z";
  function drawOrca(v) {
    const L = v.size, black = sh("#14181c"), white = sh("#f0f0ea");
    ctx.save(); ctx.translate(v.x, v.y + v.yOff); ctx.scale(faceOf(v) * L / 100, L / 100); ctx.rotate(Math.sin(v.ph) * 0.03);
    ctx.fillStyle = black;
    ctx.save(); ctx.translate(-47, 0); ctx.rotate(Math.sin(v.ph * 2) * 0.2); ctx.fill(P(ORCA_FLUKE)); ctx.restore();
    ctx.fill(P(ORCA_FIN));
    ctx.fill(P(ORCA_BODY));
    ctx.fillStyle = white; ctx.fill(P(ORCA_BELLY)); ctx.fill(P(ORCA_FLANK));
    ctx.beginPath(); ctx.ellipse(29, -6.5, 6.5, 2.4, -0.18, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#9aa2a8"); ctx.fill(P(ORCA_SADDLE));
    ctx.fillStyle = black;
    ctx.save(); ctx.translate(26, 7); ctx.rotate(0.55 + Math.sin(v.ph * 1.5) * 0.15); ctx.fill(P(ORCA_FLIPPER)); ctx.restore();
    ctx.fillStyle = "#2a3036"; ctx.beginPath(); ctx.arc(37, -4.5, 0.9, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawHammerhead(v) {
    const L = v.size, skin = sh("#7a8a94"), belly = sh("#d8dde0"), dark = sh("#4a5862");
    ctx.save(); ctx.translate(v.x, v.y + v.yOff); ctx.scale(faceOf(v), 1);
    ctx.fillStyle = skin;
    ctx.save(); ctx.translate(-L * 0.38, 0); ctx.rotate(Math.sin(v.ph * 2) * 0.12);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-L * 0.12, -L * 0.17); ctx.lineTo(-L * 0.08, 0); ctx.lineTo(-L * 0.13, L * 0.07); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(L * 0.4, 0);
    ctx.bezierCurveTo(L * 0.3, -L * 0.09, -L * 0.1, -L * 0.08, -L * 0.4, -L * 0.01);
    ctx.lineTo(-L * 0.4, L * 0.02);
    ctx.bezierCurveTo(-L * 0.1, L * 0.07, L * 0.3, L * 0.07, L * 0.4, 0); ctx.fill();
    ctx.beginPath(); ctx.moveTo(L * 0.08, -L * 0.07); ctx.lineTo(-L * 0.04, -L * 0.24); ctx.lineTo(-L * 0.08, -L * 0.06); ctx.fill();
    ctx.beginPath(); ctx.moveTo(L * 0.15, L * 0.04); ctx.lineTo(L * 0.02, L * 0.16); ctx.lineTo(L * 0.05, L * 0.04); ctx.fill();
    // the wide hammer-shaped head, seen a little from above, with an eye at each end
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.moveTo(L * 0.32, -L * 0.04); ctx.lineTo(L * 0.38, -L * 0.1); ctx.quadraticCurveTo(L * 0.46, -L * 0.12, L * 0.45, -L * 0.07);
    ctx.lineTo(L * 0.44, L * 0.07); ctx.quadraticCurveTo(L * 0.45, L * 0.12, L * 0.38, L * 0.1); ctx.lineTo(L * 0.32, L * 0.04); ctx.closePath(); ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.ellipse(L * 0.44, 0, L * 0.012, L * 0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(L * 0.15, L * 0.04, L * 0.2, L * 0.022, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#0b0f12";
    for (const ey of [-0.09, 0.09]) { ctx.beginPath(); ctx.arc(L * 0.42, L * ey, L * 0.013, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(0.7, L * 0.005);
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(L * (0.3 - i * 0.025), -L * 0.03); ctx.lineTo(L * (0.29 - i * 0.025), L * 0.02); ctx.stroke(); }
    ctx.restore();
  }

  function drawSunfish(v) {
    const L = v.size, skin = sh("#9aa4ae"), dark = sh("#6a747e"), light = sh("#c8d0d6"), flap = Math.sin(v.ph * 2.5) * 0.35;
    ctx.save(); ctx.translate(v.x, v.y + v.yOff); ctx.scale(faceOf(v), 1); ctx.rotate(Math.sin(v.ph) * 0.06);
    ctx.fillStyle = dark;
    // tall fins above and below beat from side to side
    ctx.save(); ctx.translate(-L * 0.12, -L * 0.3); ctx.rotate(-0.25 + flap); ctx.beginPath(); ctx.moveTo(-L * 0.08, 0); ctx.quadraticCurveTo(0, -L * 0.45, L * 0.08, 0); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(-L * 0.12, L * 0.3); ctx.rotate(0.25 - flap); ctx.beginPath(); ctx.moveTo(-L * 0.08, 0); ctx.quadraticCurveTo(0, L * 0.45, L * 0.08, 0); ctx.fill(); ctx.restore();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(0, 0, L * 0.35, L * 0.33, 0, 0, TAU); ctx.fill();
    // instead of a tail it has a frilly edge
    ctx.fillStyle = dark; ctx.beginPath();
    for (let i = 0; i <= 8; i++) { const a = Math.PI * 0.7 + i * (Math.PI * 0.6 / 8), r = L * (0.35 + (i % 2) * 0.05); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = light; ctx.beginPath(); ctx.ellipse(L * 0.05, L * 0.1, L * 0.22, L * 0.15, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#1a1e22"; ctx.beginPath(); ctx.arc(L * 0.22, -L * 0.06, L * 0.03, 0, TAU); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(L * 0.33, L * 0.04, L * 0.025, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(L * 0.12, L * 0.03); ctx.rotate(flap); ctx.beginPath(); ctx.ellipse(0, 0, L * 0.06, L * 0.025, 0.3, 0, TAU); ctx.fill(); ctx.restore();
    ctx.restore();
  }

  function drawBeluga(v) {
    const L = v.size, skin = sh("#eef2f2"), shade = sh("#c8d2d6");
    ctx.save(); ctx.translate(v.x, v.y + v.yOff); ctx.scale(faceOf(v), 1); ctx.rotate(Math.sin(v.ph) * 0.04);
    ctx.fillStyle = skin;
    ctx.save(); ctx.translate(-L * 0.44, 0); ctx.rotate(Math.sin(v.ph * 2) * 0.22);
    ctx.beginPath(); ctx.moveTo(L * 0.04, 0); ctx.quadraticCurveTo(-L * 0.05, -L * 0.03, -L * 0.12, -L * 0.09); ctx.quadraticCurveTo(-L * 0.07, 0, -L * 0.12, L * 0.09); ctx.quadraticCurveTo(-L * 0.05, L * 0.03, L * 0.04, 0); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(L * 0.5, L * 0.03);
    ctx.bezierCurveTo(L * 0.5, -L * 0.12, L * 0.38, -L * 0.17, L * 0.28, -L * 0.12);
    ctx.bezierCurveTo(L * 0.1, -L * 0.15, -L * 0.25, -L * 0.1, -L * 0.45, 0);
    ctx.quadraticCurveTo(-L * 0.25, L * 0.1, L * 0.1, L * 0.13);
    ctx.quadraticCurveTo(L * 0.42, L * 0.13, L * 0.5, L * 0.03); ctx.fill();
    ctx.fillStyle = shade; ctx.beginPath(); ctx.ellipse(-L * 0.05, L * 0.06, L * 0.3, L * 0.04, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#8a9498"); ctx.lineWidth = Math.max(0.8, L * 0.008);
    ctx.beginPath(); ctx.moveTo(L * 0.48, L * 0.05); ctx.quadraticCurveTo(L * 0.42, L * 0.08, L * 0.36, L * 0.05); ctx.stroke();
    ctx.fillStyle = "#20282c"; ctx.beginPath(); ctx.arc(L * 0.33, -L * 0.02, L * 0.014, 0, TAU); ctx.fill();
    ctx.fillStyle = skin;
    ctx.save(); ctx.translate(L * 0.22, L * 0.09); ctx.rotate(0.7 + Math.sin(v.ph * 1.5) * 0.2); ctx.beginPath(); ctx.ellipse(0, L * 0.04, L * 0.025, L * 0.06, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.restore();
  }

  Object.assign(VISITOR_DRAW, { manatee: drawManatee, orca: drawOrca, hammerhead: drawHammerhead, sunfish: drawSunfish, beluga: drawBeluga });
  Object.assign(VISITOR_SPEED, { manatee: 0.4, orca: 1.4, hammerhead: 1.0, sunfish: 0.35, beluga: 0.7 });
  Object.assign(VISITOR_PHASE, { manatee: 0.02, orca: 0.03, hammerhead: 0.05, sunfish: 0.03, beluga: 0.03 });
  const MORE_SIZE = {
    manatee: () => (130 + Math.random() * 40) * u, orca: () => (170 + Math.random() * 70) * u, hammerhead: () => (150 + Math.random() * 60) * u,
    sunfish: () => (90 + Math.random() * 40) * u, beluga: () => (120 + Math.random() * 40) * u,
  };

  // ---- the giant squid ---------------------------------------------------------
  // It swims across the deep sea tail first, with its arms and two long hunting tentacles trailing behind.
  function updateAndDrawGiant(k, dtSec) {
    const G = scene.giant;
    if (!G.active) {
      G.timer -= dtSec;
      if (G.timer <= 0) {
        if (!claim(16)) { G.timer = 8 + Math.random() * 10; return; }
        G.active = true; G.dir = Math.random() < 0.5 ? 1 : -1; G.L = Math.min(W * 0.8, 620 * u);
        G.x = G.dir > 0 ? -G.L * 0.6 : W + G.L * 0.6; G.y0 = H * (0.35 + Math.random() * 0.25); G.y = G.y0; G.ph = 0;
        sfxRumble(0.4);
        watch("giant", () => G.active ? [[G.x, G.y], [G.x - G.dir * G.L * 0.3, G.y]] : null, 40 * u);
      }
      return;
    }
    G.ph += 0.03 * k;
    const surge = Math.max(0, Math.sin(G.ph * 2));
    G.x += G.dir * (0.7 + 2.2 * surge) * u * k;
    G.y = G.y0 + Math.sin(G.ph * 0.7) * 14 * u;
    drawGiantSquid(G.x, G.y, G.dir, G.L, G.ph);
    const back = G.x - G.dir * G.L * 0.95;
    if (G.dir > 0 ? back > W + 20 * u : back < -20 * u) {
      if (G.shiny) G.dir *= -1;
      else { G.active = false; G.timer = 40 + Math.random() * 40; }
    }
  }

  function drawGiantSquid(x, y, dir, L, ph) {
    const body = sh("#8a2e2a"), dark = sh("#5a1a18"), light = sh("#c86a5a"), pulse = 1 + Math.sin(ph * 2) * 0.07;
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
    ctx.strokeStyle = body; ctx.lineCap = "round";
    // two long hunting tentacles with clubs at the end
    for (const sd of [-1, 1]) {
      const ey = sd * L * 0.05 + Math.sin(ph * 1.6 + sd) * L * 0.06;
      ctx.lineWidth = L * 0.011;
      ctx.beginPath(); ctx.moveTo(-L * 0.08, sd * L * 0.02);
      ctx.bezierCurveTo(-L * 0.4, sd * L * 0.06 + Math.sin(ph + sd) * L * 0.05, -L * 0.7, sd * L * 0.02 + Math.sin(ph * 1.3 + sd) * L * 0.07, -L * 0.92, ey); ctx.stroke();
      ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(-L * 0.92, ey, L * 0.05, L * 0.017, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = light; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-L * (0.89 + i * 0.018), ey + L * 0.006, L * 0.004, 0, TAU); ctx.fill(); }
    }
    // eight arms, thick at the base and waving
    for (let i = 0; i < 8; i++) {
      const off = (i - 3.5) * L * 0.011;
      ctx.lineWidth = L * (0.024 - (i % 2) * 0.005);
      ctx.beginPath(); ctx.moveTo(-L * 0.06, off);
      ctx.quadraticCurveTo(-L * 0.25, off * 1.8 + Math.sin(ph * 1.5 + i) * L * 0.04, -L * (0.42 + (i % 3) * 0.03), off * 2.6 + Math.sin(ph * 2 + i) * L * 0.05);
      ctx.stroke();
    }
    // head with the biggest eye in the animal world
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(-L * 0.02, 0, L * 0.075, L * 0.058, 0, 0, TAU); ctx.fill();
    // the long mantle; it squeezes to push water out and shoot forward
    ctx.beginPath(); ctx.moveTo(0, -L * 0.062 * pulse); ctx.quadraticCurveTo(L * 0.3, -L * 0.078 * pulse, L * 0.56, 0); ctx.quadraticCurveTo(L * 0.3, L * 0.078 * pulse, 0, L * 0.062 * pulse); ctx.closePath(); ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.moveTo(L * 0.36, 0); ctx.lineTo(L * 0.5, -L * 0.075); ctx.lineTo(L * 0.57, 0); ctx.lineTo(L * 0.5, L * 0.075); ctx.closePath(); ctx.fill();
    ctx.fillStyle = light;
    for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc(L * (0.05 + ((i * 0.037) % 0.42)), ((i * 7) % 5 - 2) * L * 0.012, L * 0.006, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#f2e8c8"; ctx.beginPath(); ctx.arc(-L * 0.025, -L * 0.02, L * 0.024, 0, TAU); ctx.fill();
    ctx.fillStyle = "#0a0a0a"; ctx.beginPath(); ctx.arc(-L * 0.03, -L * 0.02, L * 0.014, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ---- moments and rare things ----------------------------------------------
  function updateMore(k, dtSec) {
    const S = scene;
    // a swarm of jellyfish drifts through
    const B = S.bloom;
    B.timer -= dtSec;
    if (B.timer <= 0) {
      B.timer = 150 + Math.random() * 120;
      if (claim(25)) {
        const side = Math.random() < 0.5 ? -1 : 1, n = 12 + Math.floor(Math.random() * 10), col = water.jelly[Math.floor(Math.random() * water.jelly.length)];
        const [cr, cg, cb] = col.split(",").map(Number);
        B.logged = false;
        for (let i = 0; i < n; i++) {
          const r = (8 + Math.random() * 12) * u;
          const j = {
            x: side < 0 ? -r * 2 - Math.random() * W * 0.6 : W + r * 2 + Math.random() * W * 0.6, y: H * (0.15 + Math.random() * 0.6), r,
            ph: Math.random() * TAU, sp: 0.8 + Math.random() * 0.4, drift: Math.random() * TAU, col, tl: 2.2 + Math.random(),
            hd: -side * (0.7 + Math.random() * 0.4), bloom: -side, shinyBase: rgbHue(cr, cg, cb),
          };
          S.jellies.push(j);
          maybeShiny("jelly", j, j.r, () => [j.x, j.y - j.r * 0.3], () => scene.jellies.includes(j));
        }
      }
    }
    if (S.jellies.some(j => j.bloom)) {
      if (!B.logged && S.jellies.some(j => j.bloom && lit(j.x, j.y, j.r))) { B.logged = true; seen("jellybloom"); sight("jelly"); }
      S.jellies = S.jellies.filter(j => !j.bloom || j.shiny || (j.bloom > 0 ? j.x < W + j.r * 3 : j.x > -j.r * 3));
    }

    // on a dark night the water starts to sparkle
    const G = S.glowtide;
    if (G.enabled) {
      if (!G.active) {
        G.timer -= dtSec;
        if (G.timer <= 0) { G.timer = 30 + Math.random() * 40; if (night > 0.85 && claim(35)) { G.active = true; G.age = 0; watch("glowtide", () => G.active && night > 0.75 && diverMode ? [diver.x, diver.y] : null); } }
      } else {
        G.age += dtSec;
        // only on a dark night: when the sky starts to brighten it is over
        if (G.age > 35 || night < 0.5) G.active = false;
      }
    }

    // baby turtles paddle along just under the surface
    const Hh = S.hatch;
    if (Hh.enabled && !Hh.list.length) {
      Hh.timer -= dtSec;
      if (Hh.timer <= 0) {
        Hh.timer = 120 + Math.random() * 120;
        if (claim(20)) {
          const dir = Math.random() < 0.5 ? 1 : -1, n = 8 + Math.floor(Math.random() * 7);
          Hh.logged = false;
          for (let i = 0; i < n; i++) {
            const h = { x: dir > 0 ? -20 * u - Math.random() * 260 * u : W + 20 * u + Math.random() * 260 * u, y: H * (0.08 + Math.random() * 0.2), dir, s: (9 + Math.random() * 3) * u, ph: Math.random() * TAU, sp: 0.8 + Math.random() * 0.5 };
            Hh.list.push(h);
            maybeShiny("hatchlings", h, h.s, () => [h.x, h.cy || h.y], () => scene.hatch.list.includes(h));
          }
        }
      }
    }

    const Sp = S.serpent;
    if (Sp.enabled && !Sp.active) {
      Sp.timer -= dtSec;
      if (Sp.timer <= 0) {
        Sp.timer = 45 + Math.random() * 40;
        if (claim(22)) {
          Sp.active = true; Sp.dir = Math.random() < 0.5 ? 1 : -1; Sp.len = Math.min(W * 1.1, 1100 * u);
          Sp.x = Sp.dir > 0 ? -40 * u : W + 40 * u; Sp.y0 = H * (0.3 + Math.random() * 0.25); Sp.logged = false;
        }
      }
    }

    const M = S.megalodon;
    if (M.enabled && !M.active) {
      M.timer -= dtSec;
      if (M.timer <= 0) {
        M.timer = 50 + Math.random() * 40;
        if (claim(20)) {
          M.active = true; M.dir = Math.random() < 0.5 ? 1 : -1; M.size = Math.min(W * 1.1, 1000 * u);
          M.x = M.dir > 0 ? -M.size * 0.6 : W + M.size * 0.6; M.y = H * (0.35 + Math.random() * 0.2); M.ph = 0; M.logged = false;
        }
      }
    }

    // the giant squid can be shiny, rolled each time it reaches out of the deep
    const Gs = S.giant;
    if (Gs.active && !Gs.rolled) {
      Gs.rolled = true;
      maybeShiny("giant", Gs, 70 * u, () => [Gs.x, Gs.y], () => Gs.active);
    }
    if (!Gs.active) Gs.rolled = false;

    // a humpback sometimes sings while it swims past
    const v = S.visitor;
    if (v && v.type === "humpback" && v.song === undefined && v.x > W * 0.25 && v.x < W * 0.75) {
      v.song = Math.random() < 0.7 ? 7 : 0;
      if (v.song) { watch("whalesong", () => v.song > 0 && scene.visitor === v ? [v.x, v.y + v.yOff] : null, v.size * 0.4); whaleSong(); }
    }
    if (v && v.song > 0) {
      v.song -= dtSec;
      v.ring = (v.ring || 0) - dtSec;
      if (v.ring <= 0) { v.ring = 0.8; S.songRings.push({ x: v.x + v.dir * v.size * 0.4, y: v.y + v.yOff, r: 10 * u, a: 0.45 }); }
    }
  }

  function whaleSong() {
    tone({ freqs: [[180, 0], [260, 1.0], [150, 2.2]], dur: 2.6, gain: 0.05, attack: 0.4, release: 0.8, lp: 900, vib: [5, 8] });
    tone({ freqs: [[300, 0], [220, 1.4]], dur: 1.8, gain: 0.03, attack: 0.3, release: 0.6, lp: 1200, vib: [6, 10], delay: 2.8 });
  }

  function drawSongRings(k) {
    const S = scene;
    if (!S.songRings.length) return;
    S.songRings = S.songRings.filter(r => {
      r.r += 1.2 * u * k; r.a -= 0.005 * k;
      if (r.a <= 0) return false;
      ctx.strokeStyle = `rgba(220,240,255,${r.a})`; ctx.lineWidth = 2 * u;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, TAU); ctx.stroke();
      return true;
    });
  }

  function drawHatchling(x, y, dir, s, ph) {
    const skin = sh("#5a5e48"), shell = sh("#4a4430"), ridge = sh("#6e6648"), belly = sh("#c8c098");
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
    ctx.fillStyle = skin;
    // big front flippers paddle hard, small back flippers steer
    for (const sd of [-1, 1]) {
      ctx.save(); ctx.translate(s * 0.18, sd * s * 0.12); ctx.rotate(sd * (0.7 + Math.sin(ph) * 0.6));
      ctx.beginPath(); ctx.ellipse(-s * 0.2, 0, s * 0.34, s * 0.09, 0, 0, TAU); ctx.fill(); ctx.restore();
      ctx.save(); ctx.translate(-s * 0.3, sd * s * 0.12); ctx.rotate(sd * (0.9 + Math.sin(ph + 1) * 0.3));
      ctx.beginPath(); ctx.ellipse(-s * 0.06, 0, s * 0.12, s * 0.05, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
    ctx.beginPath(); ctx.ellipse(s * 0.48, 0, s * 0.17, s * 0.13, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(0, s * 0.12, s * 0.36, s * 0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = shell; ctx.beginPath(); ctx.ellipse(0, -s * 0.02, s * 0.42, s * 0.26, 0, 0, TAU); ctx.fill();
    // ridges and plates on the little shell
    ctx.strokeStyle = ridge; ctx.lineWidth = Math.max(0.5, s * 0.04);
    ctx.beginPath(); ctx.moveTo(-s * 0.36, -s * 0.04); ctx.lineTo(s * 0.36, -s * 0.04);
    for (const px of [-0.2, 0, 0.2]) { ctx.moveTo(px * s, -s * 0.25); ctx.lineTo(px * s + s * 0.04, s * 0.15); }
    ctx.stroke();
    ctx.fillStyle = "#0a0a08"; ctx.beginPath(); ctx.arc(s * 0.54, -s * 0.04, s * 0.035, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawHatchlings(k) {
    const Hh = scene.hatch;
    for (let i = Hh.list.length - 1; i >= 0; i--) {
      const h = Hh.list[i];
      h.ph += 0.2 * k; h.x += h.dir * h.sp * u * k;
      const y = Math.max(h.y + Math.sin(h.ph * 0.3) * 6 * u, water.surface ? waveY(h.x) + 8 * u : 0);
      if (!Hh.logged && lit(h.x, h.cy || h.y, h.s)) { Hh.logged = true; seen("hatchlings"); sight("turtle", [h.x, h.cy || h.y]); }
      h.cy = y;
      shinyDraw(h, () => drawHatchling(h.x, y, h.dir, h.s, h.ph));
      if (h.dir > 0 ? h.x > W + 30 * u : h.x < -30 * u) { if (h.shiny) h.dir *= -1; else Hh.list.splice(i, 1); }
    }
  }

  // A sea serpent winds through the middle of the water, a red crest along its back.
  function drawSerpent(k) {
    const Sp = scene.serpent;
    if (!Sp.active) return;
    Sp.x += Sp.dir * 1.6 * u * k;
    const sc = Sp.sc || u, amp = Sp.amp || 55 * u, seg = 14 * sc, n = Math.floor(Sp.len / seg), pts = [];
    for (let i = 0; i <= n; i++) {
      const x = Sp.x - Sp.dir * i * seg;
      pts.push([x, Sp.y0 + Math.sin(x * 0.012 / sc * u - t * 1.8 * Sp.dir) * amp * Math.min(1, i / 6 + 0.3)]);
    }
    const green = sh("#2f6a4a"), belly = sh("#a8c070"), fin = sh("#c84a3a"), width = i => 26 * sc * (1 - i / n) + 6 * sc;
    ctx.lineCap = "round";
    ctx.fillStyle = fin;
    for (let i = 2; i < n; i += 2) {
      const [x, y] = pts[i], w = width(i);
      ctx.beginPath(); ctx.moveTo(x - 5 * sc, y - w * 0.35); ctx.lineTo(x, y - w * 0.85); ctx.lineTo(x + 5 * sc, y - w * 0.35); ctx.fill();
    }
    ctx.strokeStyle = green;
    for (let i = n - 1; i >= 0; i--) { ctx.lineWidth = width(i); ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke(); }
    ctx.strokeStyle = belly;
    for (let i = n - 1; i >= 0; i--) { const w = width(i); ctx.lineWidth = w * 0.3; ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1] + w * 0.25); ctx.lineTo(pts[i + 1][0], pts[i + 1][1] + w * 0.25); ctx.stroke(); }
    const [hx, hy] = pts[0], ang = Math.atan2(pts[0][1] - pts[1][1], pts[0][0] - pts[1][0]);
    Sp.hx = hx; Sp.hy = hy;
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang); if (Math.cos(ang) < 0) ctx.scale(1, -1);
    ctx.fillStyle = green; ctx.beginPath(); ctx.ellipse(10 * sc, 0, 26 * sc, 15 * sc, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = fin; ctx.beginPath(); ctx.moveTo(-4 * sc, -12 * sc); ctx.lineTo(-18 * sc, -28 * sc); ctx.lineTo(6 * sc, -13 * sc); ctx.fill();
    ctx.fillStyle = "#f2d04a"; ctx.beginPath(); ctx.arc(18 * sc, -5 * sc, 3.5 * sc, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.ellipse(18.5 * sc, -5 * sc, 1 * sc, 3 * sc, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#1a3a28"); ctx.lineWidth = 1.5 * sc; ctx.beginPath(); ctx.moveTo(34 * sc, 4 * sc); ctx.lineTo(16 * sc, 6 * sc); ctx.stroke();
    ctx.restore();
    if (!Sp.logged && pts.some((p, i) => i % 4 === 0 && lit(p[0], p[1], 20 * sc))) { Sp.logged = true; seen("serpent"); }
    if (Sp.dir > 0 ? pts[n][0] > W + 60 * sc : pts[n][0] < -60 * sc) {
      if (Sp.shiny) { Sp.dir *= -1; Sp.x = Sp.dir > 0 ? -40 * u : W + 40 * u; }
      else Sp.active = false;
    }
  }

  // The megalodon is only ever a huge dark shape, far behind everything else.
  function drawMegalodon(k) {
    const M = scene.megalodon;
    if (!M.active) return;
    M.x += M.dir * 0.9 * u * k; M.ph += 0.03 * k;
    if (!M.img || M.img.w !== M.size) M.img = megaShape(M.size);
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.translate(M.x, M.y + Math.sin(M.ph * 0.5) * 10 * u);
    ctx.scale(faceOf(M), 1);
    ctx.rotate(Math.sin(M.ph) * 0.03);
    ctx.drawImage(M.img, -M.img.width / 2, -M.img.height / 2);
    ctx.restore();
    if (!M.logged && lit(M.x, M.y, M.size * 0.3)) { M.logged = true; seen("megalodon"); }
    if (M.dir > 0 ? M.x > W + M.size * 0.7 : M.x < -M.size * 0.7) { if (M.shiny) M.dir *= -1; else M.active = false; }
  }

  // The shark shape is drawn once and darkened, then reused every frame.
  function megaShape(size) {
    const c = document.createElement("canvas");
    c.width = Math.ceil(size * 1.3); c.height = Math.ceil(size * 0.7);
    const saved = ctx;
    ctx = c.getContext("2d");
    drawShark({ x: c.width / 2, y: c.height / 2, dir: 1, size, ph: 0, yOff: 0 });
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = "rgba(4,10,18,0.9)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx = saved;
    c.w = size;
    return c;
  }

  // Sea sparkle: tiny plankton light up wherever the water moves.
  function drawGlowtide(k) {
    const G = scene.glowtide;
    // it fades along with the darkness, so it never sparkles in daylight
    const dark = Math.min(1, Math.max(0, night - 0.5) / 0.3);
    const lv = G.active ? Math.max(0, Math.min(1, G.age / 3, (35 - G.age) / 4)) * dark : 0;
    if (lv > 0) {
      for (let i = 0; i < 4; i++) if (Math.random() < lv) { const x = Math.random() * W; G.sparks.push({ x, y: waveY(x) + Math.random() * 10 * u, a: 1, r: (0.8 + Math.random() * 1.4) * u }); }
      for (const sp of scene.species) for (let n = 0; n < 2; n++) {
        const f = sp.fish[Math.floor(Math.random() * sp.fish.length)];
        if (f && Math.random() < 0.5 * lv) G.sparks.push({ x: f.x, y: f.y, a: 0.9, r: (0.6 + Math.random()) * u });
      }
      const p = poke();
      if (p.on) for (let n = 0; n < 3; n++) G.sparks.push({ x: p.x + (Math.random() - 0.5) * 30 * u, y: p.y + (Math.random() - 0.5) * 30 * u, a: 1, r: (0.8 + Math.random() * 1.5) * u });
    }
    if (!G.sparks.length) return;
    if (G.sparks.length > 600) G.sparks.splice(0, G.sparks.length - 600);
    ctx.globalCompositeOperation = "lighter";
    G.sparks = G.sparks.filter(s => {
      s.a -= 0.02 * k; s.y += 0.05 * u * k;
      if (s.a <= 0) return false;
      ctx.fillStyle = `rgba(90,200,255,${s.a * 0.8})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * (1.5 - s.a * 0.5), 0, TAU); ctx.fill();
      return true;
    });
    ctx.globalCompositeOperation = "source-over";
  }

  // ---- logbook pictures -------------------------------------------------------
  Object.assign(THUMBS, {
    amphora: () => drawAmphora({ x: 60, jars: [{ dx: -18, s: 26, tilt: 0.1, color: "#b8653a" }, { dx: 18, s: 22, tilt: 1.3, color: "#c47a48" }] }),
    car: () => drawCar({ x: 60, s: 32, tilt: -0.04, dir: 1, color: "#6f8fa6" }),
    bell: () => drawBell({ x: 60, s: 34, tilt: 0.35 }),
    clam: () => drawClam({ x: 60, s: 30, ph: Math.PI / 2, open: 1, shut: 0, pearl: "white", mantle: "#3fa0d8" }, 0),
    goldpearl: () => drawClam({ x: 60, s: 30, ph: Math.PI / 2, open: 1, shut: 0, pearl: "gold", mantle: "#7a5ad8" }, 0),
    seagrass: () => drawSeagrass({ x: 60, blades: Array.from({ length: 18 }, (_, i) => ({ dx: (i - 9) * 5, h: 24 + (i * 7) % 22, ph: i, c: ["#6a9a3a", "#7aaa48", "#5a8a32"][i % 3] })) }),
    cassiopea: () => drawCassio({ x: 60, s: 36, ph: 1, col: "#8aa86a" }, 0),
    lionfish: () => drawLionfish({ x: 60, y: 44, dir: 1, s: 52, ph: 1, tx: 1000 }, 0),
    cuttlefish: () => drawCuttle({ x: 52, y: 42, dir: 1, s: 56, ph: 1, tx: 1000, flash: 0 }, 0),
    lobster: () => drawLobster({ x: 58, dir: 1, s: 52, leg: 0, pause: 9, speed: 0 }, 0),
    nautilus: () => drawNautilus({ x: 52, y: 42, dir: -1, s: 30, ph: 0 }, 0),
    isopod: () => drawIsopod({ x: 60, dir: 1, s: 56, leg: 0, speed: 0 }, 0),
    seadragon: () => drawDragon({ x: 60, y: 42, dir: 1, s: 70, ph: 0 }, 0),
    manatee: () => drawManatee({ x: 60, y: 44, dir: 1, size: 100, ph: 0, yOff: 0 }),
    orca: () => drawOrca({ x: 64, y: 50, dir: 1, size: 100, ph: 0, yOff: 0 }),
    hammerhead: () => drawHammerhead({ x: 62, y: 44, dir: 1, size: 100, ph: 0, yOff: 0 }),
    sunfish: () => drawSunfish({ x: 60, y: 42, dir: 1, size: 80, ph: 0, yOff: 0 }),
    beluga: () => drawBeluga({ x: 62, y: 44, dir: 1, size: 100, ph: 0, yOff: 0 }),
    jellybloom: () => {
      scene.jellies = Array.from({ length: 9 }, (_, i) => ({ x: 14 + (i * 37) % 96, y: 30 + (i * 23) % 40, r: 8 + (i % 3) * 2, ph: i, sp: 0, drift: i, col: "255,196,224", tl: 2.2, hd: 0, bloom: 1 }));
      updateAndDrawJellies(0);
    },
    glowtide: () => {
      const g = ctx.createLinearGradient(0, 0, 0, TH);
      g.addColorStop(0, "#0c2a40"); g.addColorStop(1, "#02070e");
      ctx.fillStyle = g; ctx.fillRect(0, 0, TW, TH);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 70; i++) {
        const x = (i * 53) % TW, y = i < 40 ? 10 + Math.sin(x * 0.12) * 2 + (i % 5) : 30 + (i * 17) % 40;
        ctx.fillStyle = `rgba(90,200,255,${0.4 + (i % 4) * 0.15})`;
        ctx.beginPath(); ctx.arc(x, y, 0.8 + (i % 3) * 0.6, 0, TAU); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      drawFishShape(70, 46, 0.1, 16, "#0e2a3a", "#06141c", 0.5, false);
    },
    hatchlings: () => { for (const [x, y, ph] of [[28, 24, 0], [64, 32, 1], [98, 22, 2], [42, 58, 3], [84, 60, 4]]) drawHatchling(x, y, 1, 24, ph); },
    whalesong: () => {
      drawHumpback({ x: 56, y: 46, dir: 1, size: 90, ph: 0, yOff: 0 });
      ctx.strokeStyle = "rgba(220,240,255,0.8)"; ctx.lineWidth = 1.5;
      for (const r of [8, 16, 24]) { ctx.beginPath(); ctx.arc(96, 40, r, -0.8, 0.8); ctx.stroke(); }
    },
    serpent: () => {
      scene.serpent = { active: true, dir: 1, len: 150, x: 94, y0: 46, logged: true, sc: 0.6, amp: 14 };
      drawSerpent(0);
    },
    megalodon: () => {
      const img = megaShape(116);
      ctx.globalAlpha = 0.75; ctx.drawImage(img, 60 - img.width / 2, 44 - img.height / 2); ctx.globalAlpha = 1;
      drawFishShape(100, 22, 0, 8, "#f2b134", "#8a5810", 0.5, false);
    },
  });

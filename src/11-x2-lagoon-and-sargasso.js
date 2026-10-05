  // ---- lagoons, the Sargasso Sea and the third wave of life ---------------
  // Two more waters, four finds, five animals, five visitors, four moments and three rare things.

  // ---- building -----------------------------------------------------------
  function addWave2Ground(s, P, big, small) {
    if (chance(P.wheel || 0)) small.push({ kind: "wheel", w: 80 * u, s: range(26, 34) * u, tilt: range(-0.5, 0.5), spin: range(0, TAU) });
    if (chance(P.idol || 0)) small.push({ kind: "idol", w: 50 * u, s: range(20, 26) * u, ph: range(0, TAU) });
    if (chance(P.phonebox || 0)) big.push({ kind: "phonebox", w: 110 * u, s: range(28, 34) * u, tilt: range(0.5, 1.2) * (chance(0.5) ? 1 : -1) });
    if (chance(P.sponges || 0)) {
      small.push({ kind: "sponges", w: 110 * u, parts: Array.from({ length: 3 + Math.floor(rng() * 3) }, () => ({
        dx: range(-45, 45) * u, h: range(26, 70) * u, w: range(10, 22) * u, color: pick(["#d8743a", "#9a5ab8", "#e0b83a", "#c8504a"]), type: chance(0.5) ? "barrel" : "tube",
      })) });
    }
  }

  function buildWave2(s, Lf, remap) {
    // floating mats of sargassum weed drift along the surface
    s.sargassum = water.surface && (water.sargasso || (Lf.sargassumfish || 0) > 0) ? Array.from({ length: water.sargasso ? 4 + Math.floor(rng() * 3) : 2 }, () => ({
      x: rng() * W, w: range(90, 200) * u, ph: range(0, TAU),
      leaves: Array.from({ length: 26 }, () => ({ dx: range(-0.5, 0.5), dy: range(0, 1), a: range(0, TAU), b: chance(0.4) })),
    })) : [];
    s.parrot = chance(Lf.parrotfish || 0) ? { x: rng() * W, dir: chance(0.5) ? 1 : -1, s: range(30, 38) * u, ph: range(0, TAU), tx: rng() * W, nibble: 0, cool: range(3, 8), hue: pick(["#3fbfa8", "#4a8ad8", "#5ac070"]) } : null;
    s.boxfish = chance(Lf.boxfish || 0) ? { x: rng() * W, y: H * range(0.45, 0.68), dir: chance(0.5) ? 1 : -1, s: range(18, 24) * u, ph: range(0, TAU), tx: rng() * W } : null;
    s.pistol = chance(Lf.pistol || 0) ? { x: rng() * W, ph: range(0, TAU), cool: range(2, 6), snap: 0, out: 0 } : null;
    const mat = s.sargassum.length ? s.sargassum[0] : null;
    s.frogfish = chance(Lf.sargassumfish || 0) && mat ? { mat, dx: range(-0.2, 0.2), s: range(22, 28) * u, ph: range(0, TAU), gulp: 0, cool: range(4, 9) } : null;
    s.spider = chance(Lf.spidercrab || 0) ? { x: rng() * W, dir: chance(0.5) ? 1 : -1, s: range(26, 34) * u, leg: 0, speed: range(0.15, 0.3), pause: 0 } : null;
    if (s.pistol) s.pistol.x = remap(s.pistol.x);
    if (s.spider) s.spider.x = remap(s.spider.x);

    s.eels = { enabled: ["sargasso", "noordzee", "kelpwoud", "mangrove"].includes(water.name), timer: range(50, 120), list: [], logged: false };
    s.quake = { timer: range(110, 260), age: -1 };
    s.march = { enabled: !s.canyon, timer: range(70, 160), queue: [], list: [], next: 0, logged: false };
    s.bubbleRings = [];
    s.aurora = s.rares.includes("aurora") && water.surface ? { logged: false } : null;
    if (s.aurora) s.dayOffset = range(0.45, 0.52); // the northern lights need a dark sky
    s.moby = { enabled: s.rares.includes("mobydick"), active: false, timer: range(8, 16) };
    s.ghostDiver = s.rares.includes("ghostdiver") ? { x: rng() * W, y: H * range(0.3, 0.55), dir: chance(0.5) ? 1 : -1, ph: range(0, TAU), logged: false } : null;
  }

  function registerWave2Shinies(s, add) {
    const fy = x => sandY(x) + 5 * u;
    if (s.parrot) { const p = s.parrot; add("parrotfish", p, p.s * 0.6, () => [p.x, p.cy || fy(p.x) - 40 * u]); }
    if (s.boxfish) { const b = s.boxfish; add("boxfish", b, b.s * 0.7, () => [b.x, b.cy || b.y]); }
    if (s.pistol) { const p = s.pistol; add("pistol", p, 10 * u, () => [p.x, fy(p.x) - 8 * u]); }
    if (s.frogfish) { const f = s.frogfish; add("sargassumfish", f, f.s * 0.6, () => [f.cx || 0, f.cy || 0]); }
    if (s.spider) { const c = s.spider; add("spidercrab", c, c.s, () => [c.x, fy(c.x) - c.s * 0.5]); }
  }
  Object.assign(BASE_HUE, { parrotfish: 170, boxfish: 50, pistol: 20, sargassumfish: 40, spidercrab: 20, crocodile: 80, whaleshark: 210, sealion: 30, eagleray: 220, spermwhale: 210 });

  // ---- the water itself -----------------------------------------------------
  // Sunlight dancing over the sand of a shallow lagoon.
  function drawCaustics() {
    if (!water.caustics) return;
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `rgba(255,255,225,${0.16 + 0.16 * day})`;
    ctx.lineWidth = 1.8 * u;
    // two crossing sets of wavy lines make a net of light on the sand
    for (const dir of [1, -1]) {
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 12 * u) {
          const top = sandY(x) + 2 * u, depth = H - top;
          const y = top + depth * (i + 0.5) / 7 + Math.sin(x * 0.035 * dir + t * 1.2 + i * 1.9) * 4 * u + Math.sin(x * 0.013 - t * 0.6 * dir + i) * 5 * u;
          x ? ctx.lineTo(x, Math.max(top, y)) : ctx.moveTo(x, Math.max(top, y));
        }
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function drawSargassum(k) {
    const S = scene;
    for (const m of S.sargassum) {
      m.x += (0.06 + current * 0.3) * u * k;
      if (m.x - m.w > W) m.x = -m.w;
      if (m.x + m.w < 0) m.x = W + m.w;
      const y0 = waveY(m.x);
      for (const l of m.leaves) {
        const x = m.x + l.dx * m.w, y = y0 + 2 * u + l.dy * 26 * u * (1 - Math.abs(l.dx) * 1.2) + Math.sin(t + l.a) * 2 * u;
        ctx.fillStyle = sh(l.b ? "#a89030" : "#7a6a24");
        ctx.save(); ctx.translate(x, y); ctx.rotate(l.a + Math.sin(t * 0.8 + l.a) * 0.2);
        ctx.beginPath(); ctx.ellipse(0, 0, 7 * u, 2.6 * u, 0, 0, TAU); ctx.fill();
        if (l.b) { ctx.fillStyle = sh("#c8a840"); ctx.beginPath(); ctx.arc(6 * u, 3 * u, 2 * u, 0, TAU); ctx.fill(); }
        ctx.restore();
      }
    }
  }

  // ---- finds on the floor ----------------------------------------------------
  function drawWheel(g) {
    const s = g.s, wood = sh("#7a5232"), dark = sh("#4a3020");
    ctx.save(); ctx.translate(g.x, sandY(g.x) + 6 * u - s * 0.55); ctx.rotate(g.tilt);
    ctx.strokeStyle = wood; ctx.lineCap = "round";
    ctx.lineWidth = s * 0.1;
    for (let i = 0; i < 8; i++) {
      const a = g.spin + i * TAU / 8;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * s * 0.12, Math.sin(a) * s * 0.12); ctx.lineTo(Math.cos(a) * s * 0.85, Math.sin(a) * s * 0.85); ctx.stroke();
    }
    ctx.lineWidth = s * 0.12; ctx.strokeStyle = dark;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.6, 0, TAU); ctx.stroke();
    ctx.fillStyle = sh("#a88a5a"); ctx.beginPath(); ctx.arc(0, 0, s * 0.14, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#5a8a6a");
    for (const a of [0.6, 2.4, 4.2]) { ctx.beginPath(); ctx.arc(Math.cos(a) * s * 0.6, Math.sin(a) * s * 0.6, s * 0.08, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  function drawIdol(g, k) {
    g.ph += 0.02 * k;
    const s = g.s, gold = sh("#d8a830"), dark = sh("#8a6418");
    ctx.save(); ctx.translate(g.x, sandY(g.x) + 6 * u);
    ctx.fillStyle = gold;
    // a small squat golden statue with big eyes
    ctx.beginPath(); ctx.moveTo(-s * 0.45, 0); ctx.lineTo(-s * 0.4, -s * 0.6); ctx.lineTo(s * 0.4, -s * 0.6); ctx.lineTo(s * 0.45, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, -s * 0.9, s * 0.42, s * 0.36, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 1.2); ctx.lineTo(0, -s * 1.5); ctx.lineTo(s * 0.3, -s * 1.2); ctx.fill();
    ctx.fillStyle = dark;
    for (const ex of [-0.16, 0.16]) { ctx.beginPath(); ctx.arc(ex * s, -s * 0.95, s * 0.08, 0, TAU); ctx.fill(); }
    ctx.fillRect(-s * 0.15, -s * 0.74, s * 0.3, s * 0.05);
    ctx.fillRect(-s * 0.3, -s * 0.35, s * 0.6, s * 0.05);
    ctx.fillStyle = "#e84a3a"; ctx.beginPath(); ctx.arc(0, -s * 0.48, s * 0.06, 0, TAU); ctx.fill();
    // it glitters now and then
    const tw = Math.max(0, Math.sin(g.ph * 3)) ** 8;
    if (tw > 0.05) star(s * 0.25, -s * 1.1, s * 0.25 * tw + 1, `rgba(255,250,210,${tw})`);
    ctx.restore();
  }

  function drawPhonebox(g) {
    const s = g.s, red = sh("#c0302a"), dark = sh("#7a1c18"), glass = sh("#3a5a68", 0.1);
    ctx.save(); ctx.translate(g.x, sandY(g.x) + 8 * u); ctx.rotate(g.tilt); ctx.translate(0, -s * 0.5);
    ctx.fillStyle = red; ctx.fillRect(-s * 0.5, -s * 2.4, s, s * 2.4);
    ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 2.4); ctx.quadraticCurveTo(0, -s * 2.75, s * 0.55, -s * 2.4); ctx.fill();
    ctx.fillStyle = sh("#e8e0c8"); ctx.fillRect(-s * 0.4, -s * 2.3, s * 0.8, s * 0.16);
    ctx.fillStyle = glass;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) ctx.fillRect(-s * 0.38 + c * s * 0.4, -s * 2.0 + r * s * 0.38, s * 0.36, s * 0.32);
    ctx.fillStyle = dark; ctx.fillRect(-s * 0.55, -s * 0.12, s * 1.1, s * 0.12);
    ctx.fillStyle = "rgba(90,130,60,0.5)";
    for (const [x, y, r] of [[-0.3, -0.4, 0.2], [0.35, -1.2, 0.15], [-0.2, -2.5, 0.12]]) { ctx.beginPath(); ctx.arc(x * s, y * s, r * s, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  function drawSponges(g) {
    for (const p of g.parts) {
      const x = g.x + p.dx, y = sandY(x) + 6 * u, c = sh(p.color), d = sh(p.color, 0.25);
      if (p.type === "barrel") {
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.moveTo(x - p.w * 0.7, y); ctx.quadraticCurveTo(x - p.w * 1.1, y - p.h * 0.6, x - p.w * 0.9, y - p.h); ctx.lineTo(x + p.w * 0.9, y - p.h); ctx.quadraticCurveTo(x + p.w * 1.1, y - p.h * 0.6, x + p.w * 0.7, y); ctx.fill();
        ctx.fillStyle = d; ctx.beginPath(); ctx.ellipse(x, y - p.h, p.w * 0.9, p.w * 0.25, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = d; ctx.lineWidth = Math.max(0.8, p.w * 0.06);
        for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - p.w * 0.95, y - p.h * i / 4); ctx.lineTo(x + p.w * 0.95, y - p.h * i / 4); ctx.stroke(); }
      } else {
        for (let i = 0; i < 3; i++) {
          const tx = x + (i - 1) * p.w * 0.7, th = p.h * (0.6 + 0.2 * ((i + 1) % 3));
          ctx.fillStyle = c; ctx.fillRect(tx - p.w * 0.25, y - th, p.w * 0.5, th);
          ctx.fillStyle = d; ctx.beginPath(); ctx.ellipse(tx, y - th, p.w * 0.25, p.w * 0.1, 0, 0, TAU); ctx.fill();
        }
      }
    }
  }
  Object.assign(GROUND_DRAW, { wheel: drawWheel, idol: drawIdol, phonebox: drawPhonebox, sponges: drawSponges });

  // ---- animals ----------------------------------------------------------------
  // A parrotfish bites at the coral now and then and leaves a puff of fine white sand.
  function drawParrot(p, k) {
    p.ph += 0.06 * k;
    p.cool -= k / 60;
    if (p.nibble > 0) p.nibble -= k / 60;
    else if (p.cool <= 0) { p.cool = 4 + Math.random() * 6; p.nibble = 1.4; }
    if (Math.abs(p.tx - p.x) < 10 * u) p.tx = Math.max(40 * u, Math.min(W - 40 * u, p.x + (Math.random() - 0.5) * 420 * u));
    const dx = p.tx - p.x;
    if (p.nibble <= 0) { p.x += Math.sign(dx) * 0.5 * u * k; if (Math.abs(dx) > 5 * u) p.dir = Math.sign(dx); }
    const floor = sandY(p.x), dip = p.nibble > 0 ? Math.sin(Math.min(1, (1.4 - p.nibble) / 1.4) * Math.PI) : 0;
    const y = floor - 46 * u + dip * 30 * u + Math.sin(p.ph * 0.4) * 4 * u, s = p.s;
    p.cy = y;
    if (dip > 0.95 && k > 0 && Math.random() < 0.3) puff(p.x + p.dir * s * 0.5, floor + 2 * u, 2);
    ctx.save(); ctx.translate(p.x, y); ctx.scale(p.dir, 1); ctx.rotate(dip * 0.5);
    const body = sh(p.hue), dark = sh(p.hue, 0.3);
    ctx.fillStyle = dark;
    ctx.save(); ctx.translate(-s * 0.45, 0); ctx.rotate(Math.sin(p.ph) * 0.3);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s * 0.25, -s * 0.18); ctx.quadraticCurveTo(-s * 0.18, 0, -s * 0.25, s * 0.18); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.5, s * 0.24, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.2); ctx.quadraticCurveTo(0, -s * 0.36, s * 0.25, -s * 0.2); ctx.fill();
    ctx.strokeStyle = sh("#f08ab0"); ctx.lineWidth = Math.max(0.6, s * 0.02);
    for (let i = -3; i <= 2; i++) { ctx.beginPath(); ctx.arc(i * s * 0.11, 0, s * 0.08, -1, 1); ctx.stroke(); }
    ctx.fillStyle = sh("#f2eee0"); ctx.beginPath(); ctx.moveTo(s * 0.45, -s * 0.06); ctx.quadraticCurveTo(s * 0.62, 0, s * 0.45, s * 0.08); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.34, -s * 0.07, s * 0.035, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawBoxfish(b, k) {
    b.ph += 0.15 * k;
    if (Math.abs(b.tx - b.x) < 10 * u) b.tx = Math.max(40 * u, Math.min(W - 40 * u, b.x + (Math.random() - 0.5) * 300 * u));
    const dx = b.tx - b.x;
    b.x += Math.sign(dx) * 0.35 * u * k;
    if (Math.abs(dx) > 5 * u) b.dir = Math.sign(dx);
    const y = b.y + Math.sin(b.ph * 0.1) * 8 * u, s = b.s;
    b.cy = y;
    ctx.save(); ctx.translate(b.x, y); ctx.scale(b.dir, 1);
    const yel = sh("#f2d030"), dark = sh("#b89818");
    ctx.fillStyle = dark;
    ctx.save(); ctx.translate(-s * 0.6, 0); ctx.rotate(Math.sin(b.ph) * 0.4); ctx.beginPath(); ctx.ellipse(-s * 0.15, 0, s * 0.18, s * 0.12, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = yel;
    const r = s * 0.12;
    ctx.beginPath();
    ctx.moveTo(-s * 0.6 + r, -s * 0.4); ctx.lineTo(s * 0.5 - r, -s * 0.4); ctx.quadraticCurveTo(s * 0.55, -s * 0.4, s * 0.55, -s * 0.3);
    ctx.lineTo(s * 0.55, s * 0.3); ctx.quadraticCurveTo(s * 0.55, s * 0.4, s * 0.5 - r, s * 0.4); ctx.lineTo(-s * 0.6 + r, s * 0.4);
    ctx.quadraticCurveTo(-s * 0.65, s * 0.4, -s * 0.65, s * 0.3); ctx.lineTo(-s * 0.65, -s * 0.3); ctx.quadraticCurveTo(-s * 0.65, -s * 0.4, -s * 0.6 + r, -s * 0.4);
    ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.arc(-s * 0.45 + (i % 4) * s * 0.26, -s * 0.22 + Math.floor(i / 4) * s * 0.22, s * 0.04, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s * 0.3, -s * 0.15, s * 0.1, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.33, -s * 0.15, s * 0.05, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#e8a030"); ctx.beginPath(); ctx.ellipse(s * 0.58, s * 0.08, s * 0.06, s * 0.05, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(240,220,120,0.6)";
    ctx.beginPath(); ctx.ellipse(s * 0.05, s * 0.18, s * 0.06, s * 0.14 * (0.6 + 0.4 * Math.sin(b.ph * 2)), 0.4, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // A goby keeps watch at the burrow while the pistol shrimp digs; now and then the shrimp snaps its claw with a loud click.
  function drawPistol(p, k) {
    p.ph += 0.05 * k;
    p.cool -= k / 60;
    p.out = Math.max(0, Math.min(1, p.out + (Math.sin(p.ph * 0.3) > -0.2 ? 0.03 : -0.05) * k));
    if (p.cool <= 0) {
      p.cool = 4 + Math.random() * 6; p.snap = 1;
      rings.push({ x: p.x + 22 * u, y: sandY(p.x) - 4 * u, r: 2 * u, a: 0.9 });
      sfxClick();
    }
    p.snap = Math.max(0, p.snap - 0.05 * k);
    const x = p.x, y = sandY(x) + 5 * u;
    ctx.save(); ctx.translate(x, y);
    // a small mound of sand around the burrow
    ctx.fillStyle = sh(water.sand[0], 0.05);
    ctx.beginPath(); ctx.ellipse(0, 0, 16 * u, 5 * u, 0, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.beginPath(); ctx.ellipse(0, 0, 7 * u, 3 * u, 0, 0, TAU); ctx.fill();
    // the goby keeps watch at the entrance
    drawFishShape(-5 * u, -9 * u, -0.15, 11 * u, sh("#e8d8b0"), sh("#8a6a3a"), p.ph, false);
    ctx.fillStyle = sh("#c8783a");
    for (const dx of [-8, -4, 0]) { ctx.beginPath(); ctx.arc((dx - 5) * u, -9 * u, 0.9 * u, 0, TAU); ctx.fill(); }
    // the shrimp comes out to push sand
    const sx = 4 * u + p.out * 9 * u, body = sh("#e8603a"), stripe = sh("#f2d0a0");
    ctx.save(); ctx.translate(sx, -2.5 * u);
    ctx.strokeStyle = body; ctx.lineWidth = 0.7 * u; ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo((-2 + i * 2) * u, 1 * u); ctx.lineTo((-2.5 + i * 2) * u, 3 * u); ctx.stroke(); }
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.moveTo(-7 * u, 0); ctx.lineTo(-9.5 * u, -2 * u); ctx.lineTo(-9.5 * u, 2 * u); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse((-5.5 + i * 2.6) * u, 0, 1.8 * u, 2.2 * u, 0, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = stripe; ctx.lineWidth = 0.6 * u;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo((-5.5 + i * 2.6) * u, -2 * u); ctx.lineTo((-5.5 + i * 2.6) * u, 2 * u); ctx.stroke(); }
    // one claw is much bigger than the other: that is the one that snaps
    ctx.fillStyle = body;
    ctx.save(); ctx.translate(4 * u, -0.5 * u); ctx.rotate(-0.15);
    ctx.beginPath(); ctx.ellipse(3.5 * u, 0, 4.2 * u, 2.4 * u, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = stripe;
    ctx.beginPath(); ctx.moveTo(6.5 * u, -1 * u); ctx.lineTo(9 * u, -1.6 * u - (1 - p.snap) * 1.5 * u); ctx.lineTo(7.5 * u, 0.3 * u); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = sh("#f0a070"); ctx.lineWidth = 0.5 * u;
    ctx.beginPath(); ctx.moveTo(3 * u, -1.5 * u); ctx.quadraticCurveTo(8 * u, -7 * u, 13 * u, -5 * u); ctx.moveTo(3 * u, -1.5 * u); ctx.quadraticCurveTo(7 * u, -8 * u, 11 * u, -8.5 * u); ctx.stroke();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(2.6 * u, -1.6 * u, 0.6 * u, 0, TAU); ctx.fill();
    ctx.restore();
    if (p.snap > 0.5) { ctx.fillStyle = `rgba(255,255,255,${p.snap})`; ctx.beginPath(); ctx.arc(sx + 15 * u, -4.5 * u, 4 * u * p.snap, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // A sargassumfish clings to the floating weed, perfectly camouflaged, and gulps at passing prey.
  function drawFrog(f, k) {
    f.ph += 0.03 * k;
    f.cool -= k / 60;
    if (f.cool <= 0) { f.cool = 5 + Math.random() * 6; f.gulp = 1; }
    f.gulp = Math.max(0, f.gulp - 0.04 * k);
    const m = f.mat, x = m.x + f.dx * m.w, y = waveY(x) + 24 * u + Math.sin(f.ph) * 2 * u, s = f.s;
    f.cx = x; f.cy = y;
    const body = sh("#b8902e"), dark = sh("#6a5218");
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(f.ph * 0.7) * 0.08);
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.45, s * 0.38, 0, 0, TAU); ctx.fill();
    // frilly skin flaps look just like the weed
    for (let i = 0; i < 9; i++) {
      const a = i * TAU / 9 + 0.2;
      ctx.beginPath(); ctx.ellipse(Math.cos(a) * s * 0.42, Math.sin(a) * s * 0.36, s * 0.12, s * 0.05, a, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = dark;
    for (const [px, py] of [[-0.2, -0.1], [0.1, 0.15], [-0.05, 0.2], [0.2, -0.15]]) { ctx.beginPath(); ctx.arc(px * s, py * s, s * 0.06, 0, TAU); ctx.fill(); }
    // arm-like fins grip the weed
    ctx.strokeStyle = body; ctx.lineWidth = s * 0.08; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.3); ctx.lineTo(-s * 0.25, -s * 0.6); ctx.moveTo(s * 0.15, -s * 0.3); ctx.lineTo(s * 0.3, -s * 0.58); ctx.stroke();
    ctx.fillStyle = "#1a1408"; ctx.beginPath(); ctx.ellipse(s * 0.38, s * 0.05, s * 0.06, s * (0.03 + f.gulp * 0.12), 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#f0e8a0"; ctx.beginPath(); ctx.arc(s * 0.22, -s * 0.12, s * 0.06, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.23, -s * 0.12, s * 0.03, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // A Japanese spider crab picks its way over the floor on very long legs.
  function drawSpider(c, k) {
    if (c.pause > 0) c.pause -= k / 60;
    else {
      c.x += c.dir * c.speed * u * k; c.leg += 0.12 * k;
      if (Math.random() < 0.003 * k) c.pause = 1 + Math.random() * 3;
    }
    if (c.x < scene.floorL + 40 * u) c.dir = 1;
    if (c.x > scene.floorR - 40 * u) c.dir = -1;
    const s = c.s, y = sandY(c.x) + 5 * u, body = sh("#d8783a"), joint = sh("#f0d8b0");
    ctx.save(); ctx.translate(c.x, y);
    ctx.strokeStyle = body; ctx.lineWidth = Math.max(1, s * 0.06); ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (let i = 0; i < 4; i++) {
      for (const side of [-1, 1]) {
        const ph = c.leg + i * 0.8 + (side > 0 ? Math.PI : 0), lift = Math.max(0, Math.sin(ph)) * s * 0.15;
        const kx = side * s * (0.6 + i * 0.25), ky = -s * (1.0 + i * 0.05) - lift, fx = side * s * (1.1 + i * 0.35) + Math.cos(ph) * s * 0.1;
        ctx.beginPath(); ctx.moveTo(side * s * 0.15, -s * 0.5); ctx.lineTo(kx, ky); ctx.lineTo(fx, -lift * 0.3); ctx.stroke();
        ctx.fillStyle = joint; ctx.beginPath(); ctx.arc(kx, ky, s * 0.04, 0, TAU); ctx.fill();
      }
    }
    ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(0, -s * 0.55, s * 0.28, s * 0.24, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = joint;
    for (const [px, py] of [[-0.1, -0.6], [0.12, -0.5], [0, -0.7], [-0.15, -0.45]]) { ctx.beginPath(); ctx.arc(px * s, py * s, s * 0.035, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(c.dir * s * 0.12, -s * 0.76, s * 0.03, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawWave2Floor(k) {
    const S = scene;
    if (S.pistol) shinyDraw(S.pistol, () => drawPistol(S.pistol, k));
    if (S.spider) shinyDraw(S.spider, () => drawSpider(S.spider, k));
    if (S.parrot) shinyDraw(S.parrot, () => drawParrot(S.parrot, k));
  }
  function drawWave2Mid(k) {
    const S = scene;
    if (S.boxfish) shinyDraw(S.boxfish, () => drawBoxfish(S.boxfish, k));
  }

  // ---- visitors -----------------------------------------------------------
  function drawCrocodile(v) {
    const L = v.size, skin = sh("#5a6a3a"), dark = sh("#3a4628"), belly = sh("#b8b088");
    const y = water.surface ? waveY(v.x) + L * 0.04 : v.y + v.yOff;
    ctx.save(); ctx.translate(v.x, y); ctx.scale(v.dir, 1);
    // the long tail sweeps from side to side
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.moveTo(-L * 0.1, -L * 0.04);
    for (let i = 0; i <= 10; i++) { const f = i / 10; ctx.lineTo(-L * (0.1 + f * 0.45), -L * 0.04 * (1 - f) + Math.sin(v.ph * 3 - f * 3) * L * 0.04 * f); }
    for (let i = 10; i >= 0; i--) { const f = i / 10; ctx.lineTo(-L * (0.1 + f * 0.45), L * 0.04 * (1 - f) + Math.sin(v.ph * 3 - f * 3) * L * 0.04 * f); }
    ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, L * 0.18, L * 0.055, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(L * 0.15, -L * 0.035); ctx.lineTo(L * 0.45, -L * 0.012); ctx.lineTo(L * 0.45, L * 0.015); ctx.lineTo(L * 0.15, L * 0.04); ctx.fill();
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(0, L * 0.03, L * 0.15, L * 0.018, 0, 0, TAU); ctx.fill();
    // ridges along the back
    ctx.fillStyle = dark;
    for (let i = 0; i < 14; i++) { const x = L * (0.14 - i * 0.04); ctx.beginPath(); ctx.moveTo(x - L * 0.012, -L * 0.04 * (i < 5 ? 1 : 1 - (i - 5) / 10)); ctx.lineTo(x, -L * (0.065 - i * 0.002)); ctx.lineTo(x + L * 0.012, -L * 0.04 * (i < 5 ? 1 : 1 - (i - 5) / 10)); ctx.fill(); }
    ctx.fillStyle = skin;
    for (const lx of [0.1, -0.08]) { ctx.save(); ctx.translate(L * lx, L * 0.04); ctx.rotate(0.9 + Math.sin(v.ph * 2 + lx * 10) * 0.2); ctx.beginPath(); ctx.ellipse(0, L * 0.03, L * 0.012, L * 0.04, 0, 0, TAU); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = "#e8d870"; ctx.beginPath(); ctx.arc(L * 0.24, -L * 0.04, L * 0.012, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.ellipse(L * 0.24, -L * 0.04, L * 0.003, L * 0.009, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#f0f0e0"); ctx.lineWidth = Math.max(0.8, L * 0.004);
    ctx.beginPath(); for (let i = 0; i < 8; i++) { const x = L * (0.2 + i * 0.03); ctx.moveTo(x, L * 0.008); ctx.lineTo(x + L * 0.008, L * 0.018); } ctx.stroke();
    ctx.restore();
  }

  function drawWhaleshark(v) {
    const L = v.size, skin = sh("#3a5068"), spot = sh("#dfe8ee"), belly = sh("#c8d4dc");
    ctx.save(); ctx.translate(v.x, v.y + v.yOff); ctx.scale(v.dir, 1);
    ctx.fillStyle = skin;
    ctx.save(); ctx.translate(-L * 0.42, 0); ctx.rotate(Math.sin(v.ph * 2) * 0.12);
    ctx.beginPath(); ctx.moveTo(L * 0.02, 0); ctx.lineTo(-L * 0.12, -L * 0.2); ctx.lineTo(-L * 0.08, 0); ctx.lineTo(-L * 0.12, L * 0.12); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(L * 0.5, -L * 0.02);
    ctx.bezierCurveTo(L * 0.45, -L * 0.13, L * 0.0, -L * 0.13, -L * 0.42, -L * 0.02);
    ctx.lineTo(-L * 0.42, L * 0.02);
    ctx.bezierCurveTo(L * 0.0, L * 0.11, L * 0.45, L * 0.1, L * 0.5, L * 0.02); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(L * 0.0, -L * 0.1); ctx.lineTo(-L * 0.1, -L * 0.22); ctx.lineTo(-L * 0.14, -L * 0.09); ctx.fill();
    ctx.beginPath(); ctx.moveTo(L * 0.2, L * 0.06); ctx.lineTo(L * 0.05, L * 0.2); ctx.lineTo(L * 0.08, L * 0.06); ctx.fill();
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(L * 0.1, L * 0.06, L * 0.32, L * 0.03, 0, 0, TAU); ctx.fill();
    // the wide mouth filters plankton
    ctx.fillStyle = "#0e1820"; ctx.beginPath(); ctx.ellipse(L * 0.49, L * 0.0, L * 0.012, L * 0.03 + Math.sin(v.ph) * L * 0.008, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = spot;
    for (let i = 0; i < 40; i++) {
      const x = L * (0.4 - (i % 10) * 0.08), y = -L * 0.09 + Math.floor(i / 10) * L * 0.035 + ((i * 7) % 3) * L * 0.004;
      if (Math.abs(y) < L * 0.1 * (1 - Math.abs(x) / (L * 0.55))) { ctx.beginPath(); ctx.arc(x, y, L * 0.007, 0, TAU); ctx.fill(); }
    }
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(L * 0.42, -L * 0.03, L * 0.008, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // A sea lion loops and rolls as it swims.
  function drawSealion(v) {
    const L = v.size, skin = sh("#7a5a3a"), light = sh("#a88a64");
    const loop = Math.sin(v.ph * 1.5), y = v.y + v.yOff + loop * 50 * u;
    ctx.save(); ctx.translate(v.x, y); ctx.scale(v.dir, 1); ctx.rotate(Math.cos(v.ph * 1.5) * -0.6);
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.moveTo(L * 0.42, 0);
    ctx.bezierCurveTo(L * 0.35, -L * 0.12, -L * 0.1, -L * 0.12, -L * 0.4, -L * 0.02);
    ctx.lineTo(-L * 0.4, L * 0.02);
    ctx.bezierCurveTo(-L * 0.1, L * 0.1, L * 0.35, L * 0.1, L * 0.42, 0); ctx.fill();
    ctx.save(); ctx.translate(-L * 0.4, 0); ctx.rotate(Math.sin(v.ph * 4) * 0.3);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-L * 0.12, -L * 0.05); ctx.lineTo(-L * 0.12, L * 0.05); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(L * 0.12, L * 0.06); ctx.rotate(0.8 + Math.sin(v.ph * 4) * 0.4);
    ctx.beginPath(); ctx.ellipse(0, L * 0.07, L * 0.03, L * 0.09, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = light; ctx.beginPath(); ctx.ellipse(L * 0.05, L * 0.04, L * 0.25, L * 0.03, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(L * 0.33, -L * 0.04, L * 0.015, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(L * 0.42, -L * 0.005, L * 0.01, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#d8c8a8"); ctx.lineWidth = Math.max(0.6, L * 0.003);
    for (const dy of [-0.01, 0.01]) { ctx.beginPath(); ctx.moveTo(L * 0.4, L * dy); ctx.lineTo(L * 0.47, L * dy * 2.5); ctx.stroke(); }
    ctx.restore();
  }

  function drawEagleray(v) {
    const L = v.size, skin = sh("#2a3442"), spot = sh("#e8eef2"), flap = Math.sin(v.ph * 3);
    ctx.save(); ctx.translate(v.x, v.y + v.yOff); ctx.scale(v.dir, 1);
    ctx.strokeStyle = skin; ctx.lineWidth = Math.max(1, L * 0.012);
    ctx.beginPath(); ctx.moveTo(-L * 0.2, 0); ctx.quadraticCurveTo(-L * 0.6, Math.sin(v.ph * 2) * L * 0.05, -L * 0.95, Math.sin(v.ph * 2 + 1) * L * 0.08); ctx.stroke();
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.moveTo(L * 0.3, 0);
    ctx.quadraticCurveTo(L * 0.1, -L * 0.1, -L * 0.05, -L * (0.4 * (0.6 + 0.4 * flap)));
    ctx.quadraticCurveTo(-L * 0.12, -L * 0.1, -L * 0.22, 0);
    ctx.quadraticCurveTo(-L * 0.12, L * 0.08, -L * 0.05, L * (0.25 * (0.6 - 0.4 * flap)));
    ctx.quadraticCurveTo(L * 0.1, L * 0.08, L * 0.3, 0);
    ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.ellipse(L * 0.32, 0, L * 0.07, L * 0.03, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.beginPath();
    ctx.moveTo(L * 0.3, 0);
    ctx.quadraticCurveTo(L * 0.1, -L * 0.1, -L * 0.05, -L * (0.4 * (0.6 + 0.4 * flap)));
    ctx.quadraticCurveTo(-L * 0.12, -L * 0.1, -L * 0.22, 0);
    ctx.quadraticCurveTo(-L * 0.12, L * 0.08, -L * 0.05, L * (0.25 * (0.6 - 0.4 * flap)));
    ctx.quadraticCurveTo(L * 0.1, L * 0.08, L * 0.3, 0);
    // white spots, kept inside the body and the wings
    ctx.save(); ctx.clip();
    ctx.fillStyle = spot;
    for (let i = 0; i < 26; i++) {
      const fx = ((i * 37) % 100) / 100, fy = ((i * 61) % 100) / 100;
      const x = L * (0.25 - fx * 0.45), top = -L * 0.38 * (0.6 + 0.4 * flap), bot = L * 0.23 * (0.6 - 0.4 * flap);
      ctx.beginPath(); ctx.arc(x, top + (bot - top) * fy, L * 0.01, 0, TAU); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(L * 0.24, -L * 0.03, L * 0.01, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawSpermWhaleShape(x, y, dir, L, ph, col, dark) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph) * 0.02);
    ctx.fillStyle = col;
    ctx.save(); ctx.translate(-L * 0.48, 0); ctx.rotate(Math.sin(ph * 2) * 0.18);
    ctx.beginPath(); ctx.moveTo(L * 0.03, 0); ctx.quadraticCurveTo(-L * 0.05, -L * 0.03, -L * 0.12, -L * 0.09); ctx.quadraticCurveTo(-L * 0.08, 0, -L * 0.12, L * 0.09); ctx.quadraticCurveTo(-L * 0.05, L * 0.03, L * 0.03, 0); ctx.fill();
    ctx.restore();
    // the huge boxy head holds the biggest brain on earth
    ctx.beginPath();
    ctx.moveTo(L * 0.5, -L * 0.08); ctx.quadraticCurveTo(L * 0.52, L * 0.0, L * 0.48, L * 0.06);
    ctx.lineTo(L * 0.15, L * 0.1); ctx.quadraticCurveTo(-L * 0.2, L * 0.08, -L * 0.48, L * 0.01);
    ctx.lineTo(-L * 0.48, -L * 0.02); ctx.quadraticCurveTo(-L * 0.2, -L * 0.07, L * 0.05, -L * 0.1);
    ctx.quadraticCurveTo(L * 0.4, -L * 0.13, L * 0.5, -L * 0.08); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(0.7, L * 0.003);
    for (let i = 0; i < 9; i++) { const x0 = -L * (0.05 + i * 0.045); ctx.beginPath(); ctx.moveTo(x0, -L * 0.05); ctx.quadraticCurveTo(x0 - L * 0.01, 0, x0, L * 0.05); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(L * 0.47, L * 0.05); ctx.lineTo(L * 0.2, L * 0.08); ctx.stroke();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(L * 0.2, L * 0.02, L * 0.008, 0, TAU); ctx.fill();
    ctx.fillStyle = col; ctx.save(); ctx.translate(L * 0.12, L * 0.08); ctx.rotate(0.8 + Math.sin(ph * 1.5) * 0.15); ctx.beginPath(); ctx.ellipse(0, L * 0.03, L * 0.015, L * 0.04, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.restore();
  }
  const drawSpermwhale = v => drawSpermWhaleShape(v.x, v.y + v.yOff, v.dir, v.size, v.ph, sh("#5a6068"), sh("#3a3e44"));

  Object.assign(VISITOR_DRAW, { crocodile: drawCrocodile, whaleshark: drawWhaleshark, sealion: drawSealion, eagleray: drawEagleray, spermwhale: drawSpermwhale });
  Object.assign(VISITOR_SPEED, { crocodile: 0.5, whaleshark: 0.45, sealion: 1.5, eagleray: 0.8, spermwhale: 0.4 });
  Object.assign(VISITOR_PHASE, { crocodile: 0.02, whaleshark: 0.02, sealion: 0.04, eagleray: 0.03, spermwhale: 0.012 });
  Object.assign(MORE_SIZE, {
    crocodile: () => (200 + Math.random() * 60) * u, whaleshark: () => Math.min(W * 0.6, (380 + Math.random() * 120) * u), sealion: () => (90 + Math.random() * 30) * u,
    eagleray: () => (110 + Math.random() * 40) * u, spermwhale: () => Math.min(W * 0.55, (420 + Math.random() * 120) * u),
  });

  // ---- moments and rare things ----------------------------------------------
  function updateWave2(k, dtSec) {
    const S = scene;
    // glass eels on their long journey wriggle past in a stream
    const E = S.eels;
    if (E.enabled && !E.list.length) {
      E.timer -= dtSec;
      if (E.timer <= 0) {
        E.timer = 140 + Math.random() * 120;
        if (claim(18)) {
          const dir = Math.random() < 0.5 ? 1 : -1, cy = H * (0.25 + Math.random() * 0.35);
          E.logged = false;
          for (let i = 0; i < 40; i++) {
            const e = { x: dir > 0 ? -20 * u - i * 18 * u - Math.random() * 30 * u : W + 20 * u + i * 18 * u + Math.random() * 30 * u, y: cy + (Math.random() - 0.5) * 70 * u, dir, ph: Math.random() * TAU, s: (12 + Math.random() * 6) * u, sp: 1.2 + Math.random() * 0.5 };
            E.list.push(e);
            maybeShiny("eelmigration", e, 8 * u, () => [e.x, e.y], () => scene.eels.list.includes(e));
          }
        }
      }
    }

    // a seaquake: the screen trembles and sand rises from the floor
    const Q = S.quake;
    if (Q.age < 0 && canvas.style.transform) canvas.style.transform = ""; // a new ocean during a quake
    if (Q.age < 0) {
      Q.timer -= dtSec;
      if (Q.timer <= 0) {
        Q.timer = 220 + Math.random() * 200;
        if (claim(8)) {
          Q.age = 0; seen("quake"); sfxRumble(1); buzz([200, 80, 300]);
          for (const sp of S.species) for (const f of sp.fish) { f.vx += (Math.random() - 0.5) * 6 * u; f.vy += (Math.random() - 0.5) * 3 * u; }
        }
      }
    } else {
      Q.age += dtSec;
      const amp = Math.max(0, 1 - Q.age / 4) * 6;
      canvas.style.transform = amp > 0.1 ? `translate(${(Math.random() - 0.5) * amp}px,${(Math.random() - 0.5) * amp}px)` : "";
      if (Q.age < 3 && Math.random() < 0.5 * k) { const x = Math.random() * W; puff(x, sandY(x) + 4 * u, 3); }
      if (Q.age > 4) { Q.age = -1; canvas.style.transform = ""; }
    }

    // a march of red crabs crosses the floor
    const C = S.march;
    if (C.enabled && !C.queue.length && !C.list.length) {
      C.timer -= dtSec;
      if (C.timer <= 0) {
        C.timer = 200 + Math.random() * 160;
        if (claim(20)) {
          const dir = Math.random() < 0.5 ? 1 : -1, n = 18 + Math.floor(Math.random() * 12);
          C.logged = false;
          for (let i = 0; i < n; i++) C.queue.push({ dir, s: (8 + Math.random() * 4) * u, speed: 1.1 + Math.random() * 0.5, pause: 0, leg: Math.random() * TAU, color: "#d8302a", leaving: dir });
        }
      }
    }
    if (C.queue.length) {
      C.next -= dtSec;
      if (C.next <= 0) {
        const c = C.queue.shift(); c.x = c.dir > 0 ? -30 : W + 30; C.list.push(c); C.next = 0.25 + Math.random() * 0.35;
        c.shinyBase = hexHue(c.color);
        maybeShiny("crab", c, c.s * 0.8, () => [c.x, sandY(c.x) + 5 * u - c.s * 0.45], () => scene.march.list.includes(c));
      }
    }

    // dolphins sometimes blow rings of air that wobble up to the surface
    const v = S.visitor;
    if (v && v.type === "dolphins" && v.ringsLeft === undefined && v.x > W * 0.2 && v.x < W * 0.8) v.ringsLeft = Math.random() < 0.6 ? 3 + Math.floor(Math.random() * 3) : 0;
    if (v && v.ringsLeft > 0) {
      v.ringT = (v.ringT || 0) - dtSec;
      if (v.ringT <= 0) {
        v.ringT = 1.3; v.ringsLeft--;
        const d = v.pod[0];
        S.bubbleRings.push({ x: v.x + d.dx * v.dir + v.dir * v.size * 0.4, y: v.y + d.dy, r: 14 * u, ph: Math.random() * TAU });
        seen("bubblerings");
      }
    }

    const M = S.moby;
    if (M.enabled && !M.active) {
      M.timer -= dtSec;
      if (M.timer <= 0) {
        M.timer = 60 + Math.random() * 50;
        if (claim(25)) {
          M.active = true; M.dir = Math.random() < 0.5 ? 1 : -1; M.size = Math.min(W * 0.75, 650 * u);
          M.x = M.dir > 0 ? -M.size * 0.6 : W + M.size * 0.6; M.y = H * (0.3 + Math.random() * 0.2); M.ph = 0; M.logged = false;
        }
      }
    }
  }

  function drawWave2Front(k) {
    const S = scene;
    // glass eels: see-through, with just a dark eye and a silver gut
    const E = S.eels;
    if (E.list.length) {
      ctx.lineCap = "round";
      for (let i = E.list.length - 1; i >= 0; i--) {
        const e = E.list[i];
        e.ph += 0.35 * k; e.x += e.dir * e.sp * u * k;
        if (!E.logged && e.x > 0 && e.x < W) { E.logged = true; seen("eelmigration"); }
        shinyDraw(e, () => {
          ctx.strokeStyle = e.shiny ? "rgba(220,240,255,0.9)" : "rgba(220,240,255,0.35)"; ctx.lineWidth = 2.2 * u;
          ctx.beginPath();
          for (let j = 0; j <= 6; j++) { const f = j / 6, x = e.x - e.dir * f * e.s, y = e.y + Math.sin(e.ph - f * 4) * 2.5 * u * f; j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
          ctx.stroke();
          ctx.fillStyle = "#101820"; ctx.beginPath(); ctx.arc(e.x, e.y, 1 * u, 0, TAU); ctx.fill();
        });
        if (e.dir > 0 ? e.x > W + 30 * u : e.x < -30 * u) E.list.splice(i, 1);
      }
    }
    const C = S.march;
    for (let i = C.list.length - 1; i >= 0; i--) {
      const c = C.list[i];
      if (c.dir > 0 ? c.x > W + 28 : c.x < -28) { C.list.splice(i, 1); continue; }
      if (!C.logged && c.x > 0 && c.x < W) { C.logged = true; seen("crabmarch"); }
      shinyDraw(c, () => drawCrab(c, k));
    }
    S.bubbleRings = S.bubbleRings.filter(r => {
      r.y -= 0.6 * u * k; r.ph += 0.08 * k; r.r += 0.03 * u * k;
      const top = water.surface ? waveY(r.x) + 4 * u : -20 * u;
      if (r.y < top) { if (water.surface) ripples.push({ x: r.x, r: 1, a: 0.6 }); return false; }
      const w = r.r * (1 + Math.sin(r.ph) * 0.12), h = r.r * 0.3 * (1 - Math.sin(r.ph) * 0.2);
      ctx.strokeStyle = "rgba(235,248,255,0.7)"; ctx.lineWidth = 3 * u;
      ctx.beginPath(); ctx.ellipse(r.x, r.y, w, h, Math.sin(r.ph * 0.5) * 0.15, 0, TAU); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 1 * u;
      ctx.beginPath(); ctx.ellipse(r.x, r.y - h * 0.3, w * 0.8, h * 0.6, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      return true;
    });
    if (S.ghostDiver) shinyDraw(S.ghostDiver, () => drawGhostDiver(S.ghostDiver, k));
  }

  // Moby Dick: a white sperm whale glides past, far away.
  function drawMoby(k) {
    const M = scene.moby;
    if (!M.active) return;
    M.x += M.dir * 0.5 * u * k; M.ph += 0.012 * k;
    ctx.save(); ctx.globalAlpha = 0.85;
    drawSpermWhaleShape(M.x, M.y + Math.sin(M.ph * 0.7) * 8 * u, M.dir, M.size, M.ph, sh("#eceae4"), sh("#a8a6a0"));
    ctx.restore();
    if (!M.logged && M.x > 0 && M.x < W) { M.logged = true; seen("mobydick"); }
    if (M.dir > 0 ? M.x > W + M.size * 0.7 : M.x < -M.size * 0.7) M.active = false;
  }

  // The ghost of an old helmet diver drifts through the water and waves.
  function drawGhostDiverShape(x, y, dir, s, ph, alpha) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(150,255,215,0.9)"; ctx.strokeStyle = "rgba(150,255,215,0.9)";
    ctx.lineCap = "round";
    ctx.lineWidth = s * 0.22;
    ctx.beginPath(); ctx.moveTo(-s * 0.1, s * 0.5); ctx.lineTo(-s * 0.2 + Math.sin(ph) * s * 0.1, s * 1.1); ctx.moveTo(s * 0.12, s * 0.5); ctx.lineTo(s * 0.2 - Math.sin(ph) * s * 0.1, s * 1.1); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, s * 0.15, s * 0.32, s * 0.45, 0, 0, TAU); ctx.fill();
    // one arm waves
    ctx.beginPath(); ctx.moveTo(s * 0.2, -s * 0.05); ctx.lineTo(s * 0.55, -s * 0.35 + Math.sin(ph * 3) * s * 0.15); ctx.moveTo(-s * 0.2, 0); ctx.lineTo(-s * 0.4, s * 0.35); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -s * 0.45, s * 0.34, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(10,40,40,0.8)"; ctx.beginPath(); ctx.arc(s * 0.1, -s * 0.45, s * 0.17, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function drawGhostDiver(g, k) {
    g.ph += 0.02 * k;
    g.x += g.dir * 0.22 * u * k;
    if (g.x > W + 60 * u) g.x = -60 * u;
    if (g.x < -60 * u) g.x = W + 60 * u;
    const y = g.y + Math.sin(g.ph * 0.8) * 16 * u, a = 0.18 + 0.1 * Math.sin(t * 1.1) + 0.2 * night;
    g.cy = y;
    ctx.globalCompositeOperation = "lighter";
    drawGhostDiverShape(g.x, y, g.dir, 30 * u, g.ph, a);
    ctx.globalCompositeOperation = "source-over";
    if (!g.logged && g.x > 0 && g.x < W) { g.logged = true; seen("ghostdiver"); }
  }

  // The northern lights shimmer through the surface in green and violet curtains.
  function drawAurora() {
    const A = scene.aurora;
    if (!A) return;
    const lv = Math.max(0, night - 0.2) / 0.8;
    if (lv <= 0) return;
    if (!A.logged && lv > 0.5) { A.logged = true; seen("aurora"); }
    ctx.globalCompositeOperation = "lighter";
    const h = H * 0.38;
    for (let x = 0; x < W; x += 6 * u) {
      const wave = 0.5 + 0.5 * Math.sin(x * 0.006 + t * 0.4) * Math.sin(x * 0.017 - t * 0.25);
      const a = 0.13 * lv * wave;
      if (a < 0.01) continue;
      const len = h * (0.5 + 0.5 * Math.sin(x * 0.01 + t * 0.3));
      const g = ctx.createLinearGradient(0, 0, 0, len);
      const [c1, c2] = A.shiny ? ["255,120,200", "255,200,110"] : ["120,255,170", "150,120,255"];
      g.addColorStop(0, `rgba(${c1},${a})`);
      g.addColorStop(0.6, `rgba(${c2},${a * 0.6})`);
      g.addColorStop(1, `rgba(${c2},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(x, 0, 6 * u, len);
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function drawWave2Top(k) {
    drawSargassum(k);
    if (scene.frogfish) shinyDraw(scene.frogfish, () => drawFrog(scene.frogfish, k));
    drawAurora();
  }

  // ---- logbook pictures -------------------------------------------------------
  Object.assign(THUMBS, {
    wheel: () => drawWheel({ x: 60, s: 32, tilt: 0.2, spin: 0.3 }),
    idol: () => drawIdol({ x: 60, s: 26, ph: Math.PI / 6 }, 0),
    phonebox: () => drawPhonebox({ x: 46, s: 20, tilt: 0.9 }),
    sponges: () => drawSponges({ x: 60, parts: [{ dx: -26, h: 50, w: 16, color: "#d8743a", type: "barrel" }, { dx: 18, h: 44, w: 14, color: "#9a5ab8", type: "tube" }, { dx: 40, h: 26, w: 10, color: "#e0b83a", type: "barrel" }] }),
    parrotfish: () => { scene.parrot = null; drawParrot({ x: 60, dir: 1, s: 60, ph: 1, tx: 1000, nibble: 0, cool: 1e9, hue: "#3fbfa8" }, 0); },
    boxfish: () => drawBoxfish({ x: 60, y: 42, dir: 1, s: 40, ph: 1, tx: 1000 }, 0),
    pistol: () => { ctx.save(); ctx.translate(56, 58); ctx.scale(1.7, 1.7); ctx.translate(-58, -72); drawPistol({ x: 58, ph: 1, cool: 1e9, snap: 0.8, out: 1 }, 0); ctx.restore(); },
    sargassumfish: () => {
      const m = { x: 60, w: 110, ph: 0, leaves: Array.from({ length: 26 }, (_, i) => ({ dx: ((i * 37) % 100) / 100 - 0.5, dy: ((i * 53) % 100) / 100, a: i * 1.3, b: i % 3 === 0 })) };
      scene.sargassum = [m]; drawSargassum(0);
      drawFrog({ mat: m, dx: 0, s: 36, ph: 0, gulp: 0.5, cool: 1e9 }, 0);
    },
    spidercrab: () => drawSpider({ x: 60, dir: 1, s: 30, leg: 0.5, speed: 0, pause: 9 }, 0),
    crocodile: () => drawCrocodile({ x: 64, y: 40, dir: 1, size: 120, ph: 0, yOff: 0 }),
    whaleshark: () => drawWhaleshark({ x: 60, y: 42, dir: 1, size: 116, ph: 0, yOff: 0 }),
    sealion: () => drawSealion({ x: 60, y: 42, dir: 1, size: 100, ph: 0, yOff: 0 }),
    eagleray: () => drawEagleray({ x: 64, y: 44, dir: 1, size: 80, ph: 0.5, yOff: 0 }),
    spermwhale: () => drawSpermwhale({ x: 58, y: 44, dir: 1, size: 100, ph: 0, yOff: 0 }),
    eelmigration: () => {
      ctx.strokeStyle = "rgba(220,240,255,0.7)"; ctx.lineWidth = 2; ctx.lineCap = "round";
      for (let i = 0; i < 14; i++) {
        const x0 = 14 + (i * 41) % 92, y0 = 18 + (i * 29) % 50;
        ctx.beginPath(); for (let j = 0; j <= 6; j++) { const x = x0 - j * 3, y = y0 + Math.sin(i + j) * 2; j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
        ctx.fillStyle = "#101820"; ctx.beginPath(); ctx.arc(x0, y0, 1, 0, TAU); ctx.fill();
      }
    },
    quake: () => {
      drawRocks({ x: 60, stones: [[-26, 24, 14], [4, 30, 18], [30, 18, 11]] });
      ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 1.5;
      for (const [x, y] of [[20, 30], [100, 34], [60, 14]]) { ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x - 2, y - 4); ctx.lineTo(x + 2, y + 4); ctx.lineTo(x + 6, y); ctx.stroke(); }
      dust = []; for (let i = 0; i < 18; i++) dust.push({ x: 10 + i * 6, y: 70 - (i % 4) * 4, vx: 0, vy: 0, r: 3 + (i % 3), a: 0.4 }); drawDust(0);
    },
    crabmarch: () => { for (let i = 0; i < 6; i++) drawCrab({ x: 12 + i * 19, dir: 1, s: 12, speed: 0, pause: 9, leg: i, color: "#d8302a", leaving: 1 }, 0); },
    bubblerings: () => {
      drawDolphin(30, 56, 1, -0.2, 50, 0);
      for (const [x, y, r] of [[70, 40, 10], [84, 22, 12], [96, 8, 13]]) { ctx.strokeStyle = "rgba(235,248,255,0.85)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.3, 0, 0, TAU); ctx.stroke(); }
    },
    aurora: () => {
      const g = ctx.createLinearGradient(0, 0, 0, TH); g.addColorStop(0, "#0c2238"); g.addColorStop(1, "#03080e");
      ctx.fillStyle = g; ctx.fillRect(0, 0, TW, TH);
      for (let x = 0; x < TW; x += 3) {
        const a = 0.85 * (0.5 + 0.5 * Math.sin(x * 0.08) * Math.sin(x * 0.03 + 1)), len = 40 + 20 * Math.sin(x * 0.05);
        const gg = ctx.createLinearGradient(0, 0, 0, len); gg.addColorStop(0, `rgba(120,255,170,${a})`); gg.addColorStop(1, "rgba(150,120,255,0)");
        ctx.fillStyle = gg; ctx.fillRect(x, 0, 3, len);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.beginPath(); ctx.moveTo(0, 10); for (let x = 0; x <= TW; x += 6) ctx.lineTo(x, 10 + Math.sin(x * 0.12) * 1.5); ctx.stroke();
    },
    mobydick: () => drawSpermWhaleShape(58, 44, 1, 100, 0, "#eceae4", "#a8a6a0"),
    ghostdiver: () => drawGhostDiverShape(60, 40, 1, 26, 1, 0.8),
  });

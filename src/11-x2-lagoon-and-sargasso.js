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
    s.sonar = { cool: 0, rings: [], echoAt: -1, side: 0, arrow: 0, dir: 0 };
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
  const PARROT_BODY = "M 50 2 C 48 -12 36 -22 14 -23 C -10 -24 -30 -16 -42 -5 L -42 5 C -30 15 -10 22 12 22 C 34 21 46 14 50 2 Z";
  const PARROT_DORSAL = "M 32 -18 C 12 -36 -24 -32 -43 -5 L -36 -7 C -22 -20 6 -24 32 -18 Z";
  const PARROT_ANAL = "M 14 20 C -4 32 -28 26 -43 6 L -36 7 C -24 17 -4 21 14 20 Z";
  const PARROT_TAIL = "M 2 0 C -6 -8 -12 -16 -20 -20 C -15 -8 -15 8 -20 20 C -12 16 -6 8 2 0 Z";
  const PARROT_BEAK = "M 47 -5 C 55 -5 60 -1 60 2 C 60 5 55 8 47 7 C 49 3 49 -1 47 -5 Z";
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
    ctx.save(); ctx.translate(p.x, y); ctx.scale(p.dir * s / 100, s / 100); ctx.rotate(dip * 0.5);
    const body = sh(p.hue), dark = sh(p.hue, 0.3), pink = sh("#f08ab0");
    // a parrotfish: a deep body with a long low dorsal and anal fin, scales outlined in pink,
    // a lyre-shaped tail and the fused white teeth that make its beak
    ctx.fillStyle = dark;
    ctx.save(); ctx.translate(-44, 0); ctx.rotate(Math.sin(p.ph) * 0.3); ctx.fill(P(PARROT_TAIL)); ctx.restore();
    ctx.fill(P(PARROT_DORSAL)); ctx.fill(P(PARROT_ANAL));
    ctx.fillStyle = body; ctx.fill(P(PARROT_BODY));
    ctx.save(); ctx.clip(P(PARROT_BODY));
    ctx.strokeStyle = pink; ctx.lineWidth = 1.6;
    for (let r = -1; r <= 1; r++) for (let i = -3; i <= 2; i++) { ctx.beginPath(); ctx.arc(i * 10 + (r & 1) * 5, r * 9, 5, -1.1, 1.1); ctx.stroke(); }
    // the head is a different colour, with pink lines around the eye
    ctx.fillStyle = sh("#f2c060", 0.05); ctx.globalAlpha *= 0.55; ctx.beginPath(); ctx.ellipse(40, -2, 14, 20, 0, 0, TAU); ctx.fill(); ctx.globalAlpha /= 0.55;
    ctx.beginPath(); ctx.moveTo(48, -4); ctx.lineTo(28, -10); ctx.moveTo(48, 4); ctx.lineTo(28, 8); ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.translate(6, 1); ctx.scale(0.55, 0.55); ctx.translate(34, 8); ctx.rotate(Math.sin(p.ph * 2) * 0.3); ctx.translate(-34, -8); ctx.fillStyle = dark; ctx.globalAlpha *= 0.8; ctx.fill(P(FISH_PEC)); ctx.restore();
    ctx.fillStyle = sh("#f2eee0"); ctx.fill(P(PARROT_BEAK));
    ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(48, 1.5); ctx.lineTo(57, 1.5); ctx.stroke();
    ctx.fillStyle = "#fff8e0"; ctx.beginPath(); ctx.arc(36, -7, 4.2, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(36.6, -7, 2.8, 0, TAU); ctx.fill();
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
    // the yellow watchman goby keeps watch at the entrance
    ctx.save(); ctx.translate(-5 * u, -6.5 * u); ctx.rotate(-0.12); ctx.scale(22 * u / 100, 22 * u / 100);
    drawGobyShape(sh("#f2c830"), sh("#c8961a"), sh("#4aa8f0"), p.ph);
    ctx.restore();
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
    drawFauna(k, "floor");
    if (S.pistol) shinyDraw(S.pistol, () => drawPistol(S.pistol, k));
    if (S.spider) shinyDraw(S.spider, () => drawSpider(S.spider, k));
    if (S.parrot) shinyDraw(S.parrot, () => drawParrot(S.parrot, k));
  }
  function drawWave2Mid(k) {
    const S = scene;
    drawFauna(k, "mid");
    if (S.boxfish) shinyDraw(S.boxfish, () => drawBoxfish(S.boxfish, k));
  }

  // ---- visitors -----------------------------------------------------------
  // A crocodile: a heavy body, a long snout with a raised eye bump and nostrils, bent legs held close,
  // a thick tail that sweeps from side to side, and rows of scutes along the back.
  const CROC_BODY = "M 46 -1 C 44 -3.5 36 -4.5 27 -5 C 24 -7.5 19 -8 15 -6.5 C 6 -7.5 -6 -7.5 -14 -5.5 L -14 5.5 C -6 7.5 6 7.5 14 6.5 C 24 5.5 36 4 46 1.5 Z";
  const CROC_FRONTLEG = "M 0 0 C 3 4 2 8 -3 10 L -9 10.5 C -9 9 -6 8.5 -4 7 C -3 5 -4 3 -4 0 Z";
  const CROC_HINDLEG = "M 0 0 C 4 4 2 9 -5 11 L -12 11 C -12 9.5 -8 9 -6 7.5 C -5 5 -6 2.5 -6 0 Z";
  function drawCrocodile(v) {
    const L = v.size, skin = sh("#5a6a3a"), dark = sh("#3a4628"), belly = sh("#b8b088");
    const y = water.surface ? waveY(v.x) + L * 0.04 : v.y + v.yOff;
    ctx.save(); ctx.translate(v.x, y); ctx.scale(v.dir * L / 100, L / 100);
    // the far legs, a shade darker
    ctx.fillStyle = dark;
    ctx.save(); ctx.translate(10, 4); ctx.rotate(0.3 + Math.sin(v.ph * 2 + 1) * 0.2); ctx.fill(P(CROC_FRONTLEG)); ctx.restore();
    ctx.save(); ctx.translate(-10, 4); ctx.rotate(0.3 + Math.sin(v.ph * 2) * 0.2); ctx.fill(P(CROC_HINDLEG)); ctx.restore();
    // the thick tail, tapering, sweeping in a wave
    ctx.fillStyle = skin;
    const tail = [];
    for (let i = 0; i <= 14; i++) { const f = i / 14; tail.push([-12 - f * 44, Math.sin(v.ph * 3 - f * 3) * 4 * f, 5.5 * (1 - f * 0.9)]); }
    ctx.beginPath(); tail.forEach(([tx, ty, w], i) => i ? ctx.lineTo(tx, ty - w) : ctx.moveTo(tx, ty - w));
    for (let i = tail.length - 1; i >= 0; i--) ctx.lineTo(tail[i][0], tail[i][1] + tail[i][2]);
    ctx.closePath(); ctx.fill();
    ctx.fill(P(CROC_BODY));
    ctx.save(); ctx.clip(P(CROC_BODY)); ctx.fillStyle = belly; ctx.fillRect(-20, 3.2, 70, 6); ctx.restore();
    // scutes along the back and the top of the tail
    ctx.fillStyle = dark;
    for (let i = 0; i < 9; i++) { const sx = 12 - i * 3.2; ctx.beginPath(); ctx.moveTo(sx - 1.2, -6.5); ctx.lineTo(sx, -9); ctx.lineTo(sx + 1.2, -6.5); ctx.fill(); }
    for (let i = 1; i < 12; i++) { const [tx, ty, w] = tail[i]; ctx.beginPath(); ctx.moveTo(tx - 1.1, ty - w); ctx.lineTo(tx, ty - w - 2.4 * (1 - i / 14)); ctx.lineTo(tx + 1.1, ty - w); ctx.fill(); }
    ctx.globalAlpha *= 0.35;
    for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.arc(10 - i * 2.6, -3 + (i % 2) * 2.4, 0.9, 0, TAU); ctx.fill(); }
    ctx.globalAlpha /= 0.35;
    // near legs, eye on its bump, nostrils and the teeth along the jaw
    ctx.fillStyle = skin;
    ctx.save(); ctx.translate(8, 5); ctx.rotate(0.3 + Math.sin(v.ph * 2) * 0.2); ctx.fill(P(CROC_FRONTLEG)); ctx.restore();
    ctx.save(); ctx.translate(-12, 5); ctx.rotate(0.3 + Math.sin(v.ph * 2 + 1) * 0.2); ctx.fill(P(CROC_HINDLEG)); ctx.restore();
    ctx.beginPath(); ctx.ellipse(44, -2.4, 2, 1.4, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#e8d870"; ctx.beginPath(); ctx.arc(21, -7, 1.6, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.ellipse(21, -7, 0.45, 1.3, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(45, -3, 0.5, 0, TAU); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(46, 0.2); ctx.lineTo(22, 1.2); ctx.quadraticCurveTo(19, 1.4, 17, 0); ctx.stroke();
    ctx.strokeStyle = sh("#f0f0e0"); ctx.lineWidth = 0.6;
    ctx.beginPath(); for (let i = 0; i < 9; i++) { const tx = 22 + i * 2.6; ctx.moveTo(tx, 0.4); ctx.lineTo(tx + 0.6, i % 2 ? 2 : -1.2); } ctx.stroke();
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
  // A sea lion looping through the water: a sleek body with a pointed snout and a tiny ear flap,
  // long front flippers that it "flies" with, and hind flippers trailing behind.
  const SL_BODY = "M 46 -1.5 C 44 -6.5 38 -9 32 -9 C 26 -9 22 -7.5 18 -8 C 4 -10 -16 -9.5 -30 -4.5 C -38 -1.5 -42 -0.5 -44 0 C -38 3 -28 6.5 -10 8.5 C 10 10.5 26 8.5 34 4.5 C 40 3 44 1.5 46 -1.5 Z";
  const SL_FLIPPER = "M 0 -2 C -2 8 -6 18 -14 26 C -16.5 28 -19.5 26 -18 23 C -14 14 -10 6 -6 -2.5 Z";
  const SL_HIND = "M 0 -2 L -15 -7.5 C -13 -2.5 -13 2.5 -15 7.5 L 0 2 Z";
  function drawSealion(v) {
    const L = v.size, skin = sh("#7a5a3a"), light = sh("#a88a64"), dark = sh("#5a4028");
    const loop = Math.sin(v.ph * 1.5), y = v.y + v.yOff + loop * 50 * u;
    ctx.save(); ctx.translate(v.x, y); ctx.scale(v.dir * L / 100, L / 100); ctx.rotate(Math.cos(v.ph * 1.5) * -0.6);
    const beat = Math.sin(v.ph * 4);
    ctx.fillStyle = dark;
    ctx.save(); ctx.translate(14, 3); ctx.rotate(0.5 - beat * 0.45); ctx.fill(P(SL_FLIPPER)); ctx.restore();
    ctx.save(); ctx.translate(-42, 0); ctx.rotate(beat * 0.3); ctx.fill(P(SL_HIND)); ctx.restore();
    ctx.fillStyle = skin; ctx.fill(P(SL_BODY));
    ctx.save(); ctx.clip(P(SL_BODY)); ctx.fillStyle = light; ctx.beginPath(); ctx.ellipse(4, 9, 40, 5, 0.04, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(28, -8.6, 1.6, 1, -0.5, 0, TAU); ctx.fill();
    ctx.fillStyle = skin;
    ctx.save(); ctx.translate(18, 4); ctx.rotate(0.3 + beat * 0.45); ctx.fill(P(SL_FLIPPER)); ctx.restore();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(34, -4.5, 1.6, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(45.5, -1.6, 0.9, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#d8c8a8"); ctx.lineWidth = 0.4;
    for (const dy of [-1, 0.5, 2]) { ctx.beginPath(); ctx.moveTo(43, dy); ctx.lineTo(50, dy * 2.4); ctx.stroke(); }
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
          Q.age = 0; watch("quake", () => Q.age >= 0 && diverMode ? [diver.x, diver.y] : null); sfxRumble(1); buzz([200, 80, 300]);
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
        watch("bubblerings", () => S.bubbleRings.map(r => [r.x, r.y]), 12 * u);
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
        if (!E.logged && lit(e.x, e.y, 6 * u)) { E.logged = true; seen("eelmigration"); }
        shinyDraw(e, () => {
          ctx.strokeStyle = e.shiny ? "rgba(220,240,255,0.9)" : "rgba(220,240,255,0.35)"; ctx.lineWidth = 2.2 * u;
          ctx.beginPath();
          for (let j = 0; j <= 6; j++) { const f = j / 6, x = e.x - e.dir * f * e.s, y = e.y + Math.sin(e.ph - f * 4) * 2.5 * u * f; j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
          ctx.stroke();
          ctx.fillStyle = "#101820"; ctx.beginPath(); ctx.arc(e.x, e.y, 1 * u, 0, TAU); ctx.fill();
        });
        if (e.dir > 0 ? e.x > W + 30 * u : e.x < -30 * u) { if (e.shiny) e.dir *= -1; else E.list.splice(i, 1); }
      }
    }
    const C = S.march;
    for (let i = C.list.length - 1; i >= 0; i--) {
      const c = C.list[i];
      if (c.dir > 0 ? c.x > W + 28 : c.x < -28) { if (c.shiny) { c.dir *= -1; c.leaving = c.dir; } else { C.list.splice(i, 1); continue; } }
      if (!C.logged && lit(c.x, sandY(c.x), c.s)) { C.logged = true; seen("crabmarch"); sight("crab", [c.x, sandY(c.x)]); }
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
    if (!M.logged && lit(M.x, M.y, M.size * 0.3)) { M.logged = true; seen("mobydick"); }
    if (M.dir > 0 ? M.x > W + M.size * 0.7 : M.x < -M.size * 0.7) { if (M.shiny) M.dir *= -1; else M.active = false; }
  }

  // The ghost of a diver: the same diver you swim with yourself, but pale green and see-through,
  // with an empty dark mask and a slow lazy kick.
  function drawGhostDiverShape(x, y, dir, s, ph, alpha) {
    const L = s * 1.55;
    ctx.save(); ctx.translate(x + dir * L * 0.12, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph * 0.9) * 0.08);
    ctx.globalAlpha = alpha;
    drawDiverBody(L, ph * 2.2, { suit: "rgba(150,255,215,0.8)", fin: "rgba(150,255,215,0.55)", tank: "rgba(205,255,235,0.85)", gear: "rgba(150,255,215,0.6)", mask: `rgba(6,30,32,${0.85 * alpha})`, hollow: true });
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
    if (!g.logged && lit(g.x, y, 24 * u)) { g.logged = true; seen("ghostdiver"); }
  }

  // The northern lights shimmer through the surface in green and violet curtains.
  function drawAurora() {
    const A = scene.aurora;
    if (!A) return;
    const lv = Math.min(1, Math.max(0, night - 0.1) / 0.6);
    if (lv <= 0) return;
    if (!A.logged && lv > 0.5 && diverMode) { A.logged = true; seen("aurora"); }
    const [c1, c2] = A.shiny ? ["255,120,200", "255,200,110"] : ["110,255,170", "170,120,255"];
    ctx.globalCompositeOperation = "lighter";
    // a soft glow of colour over the upper water
    const wash = ctx.createLinearGradient(0, 0, 0, H * 0.75);
    wash.addColorStop(0, `rgba(${c1},${0.22 * lv})`);
    wash.addColorStop(0.5, `rgba(${c2},${0.08 * lv})`);
    wash.addColorStop(1, `rgba(${c2},0)`);
    ctx.fillStyle = wash; ctx.fillRect(0, 0, W, H * 0.75);
    // waving curtains of light that hang down through the surface
    const h = H * 0.6, g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, `rgba(${c1},1)`);
    g.addColorStop(0.45, `rgba(${c1},0.6)`);
    g.addColorStop(0.75, `rgba(${c2},0.35)`);
    g.addColorStop(1, `rgba(${c2},0)`);
    ctx.fillStyle = g;
    const step = 5 * u;
    for (let x = 0; x < W; x += step) {
      const w1 = 0.5 + 0.5 * Math.sin(x * 0.0045 + t * 0.35), w2 = 0.5 + 0.5 * Math.sin(x * 0.012 - t * 0.7 + 1.3);
      const a = 0.42 * lv * (0.15 + 0.85 * w1 * w2);
      if (a < 0.02) continue;
      const lift = (1 - (0.45 + 0.55 * w1)) * h; // shorter curtains sit higher up
      ctx.globalAlpha = a;
      ctx.save(); ctx.translate(x + Math.sin(t * 0.5 + x * 0.01) * 3 * u, -lift); ctx.fillRect(0, 0, step + 1, h); ctx.restore();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function drawWave2Top(k) {
    drawFauna(k, "top");
    drawSargassum(k);
    if (scene.frogfish) shinyDraw(scene.frogfish, () => drawFrog(scene.frogfish, k));
  }

  // ---- the diver's sonar ------------------------------------------------------
  // A ping goes out from the diver. If something rare lives in this ocean, a golden echo comes back from its direction.
  const SONAR_HINTS = {
    mermaid: ["Er klinkt een zacht gezang terug...", "A soft song echoes back..."],
    kraken: ["Er antwoordt iets enorms uit de diepte...", "Something enormous answers from the deep..."],
    megalodon: ["Een gigantische schaduw weerkaatst je sonar...", "A gigantic shadow bounces your sonar back..."],
    whalefall: ["Je sonar vindt grote botten op de bodem...", "Your sonar finds huge bones on the seabed..."],
    serpent: ["Iets lang en kronkelends weerkaatst je sonar...", "Something long and winding bounces your sonar back..."],
    goldpearl: ["Er glinstert iets kostbaars in een schelp...", "Something precious glints inside a shell..."],
    aurora: ["De echo komt gekleurd terug van het oppervlak...", "The echo comes back coloured from the surface..."],
    mobydick: ["Een witte reus antwoordt met diepe klikken...", "A white giant answers with deep clicks..."],
    ghost: ["De echo komt hol en spookachtig terug...", "The echo comes back hollow and ghostly..."],
    ghostdiver: ["Er tikt iets terug, als een oude koperen helm...", "Something taps back, like an old copper helmet..."],
  };

  function sonarSource(S) {
    const r = S.rares[0], side = (S.sonar.side = S.sonar.side || (Math.random() < 0.5 ? -1 : 1));
    const g = S.ground.find(x => x.kind === (r === "goldpearl" ? "clam" : "whalefall") && (r !== "goldpearl" || x.pearl === "gold"));
    if ((r === "goldpearl" || r === "whalefall") && g) return [g.x, sandY(g.x) - 10 * u];
    if (r === "ghost" && S.ghost) return [S.ghost.x, S.ghost.y];
    if (r === "ghostdiver" && S.ghostDiver) return [S.ghostDiver.x, S.ghostDiver.cy || S.ghostDiver.y];
    if (r === "kraken") return S.kraken.eye ? [S.kraken.eye.x, S.kraken.eye.y] : [W * 0.5, H + 60 * u];
    if (r === "aurora") return [W * 0.5, -60 * u];
    if (r === "megalodon" && S.megalodon.active) return [S.megalodon.x, S.megalodon.y];
    if (r === "mobydick" && S.moby.active) return [S.moby.x, S.moby.y];
    if (r === "serpent" && S.serpent.active) return [S.serpent.hx || W / 2, S.serpent.hy || H / 2];
    return [side < 0 ? -80 * u : W + 80 * u, H * 0.45];
  }

  function sonarPing() {
    const S = scene, so = S.sonar;
    if (!diverMode || so.cool > 0) return;
    so.cool = 5;
    so.rings.push({ x: diver.x, y: diver.y, r: 6 * u, a: 0.8, gold: false });
    so.rings.push({ x: diver.x, y: diver.y, r: -30 * u, a: 0.8, gold: false });
    tone({ freqs: [[1500, 0], [1420, 0.4]], dur: 0.7, gain: 0.06, attack: 0.005, release: 0.5, verb: 0.9 });
    buzz(20);
    so.echoAt = 1.3;
  }

  function updateAndDrawSonar(k, dtSec) {
    const S = scene, so = S.sonar;
    if (so.cool > 0) so.cool -= dtSec;
    sonarBtn.classList.toggle("cooling", so.cool > 0);
    if (so.echoAt > 0) {
      so.echoAt -= dtSec;
      if (so.echoAt <= 0) {
        if (S.rares.some(r => r !== "aurora")) {
          const [sx, sy] = sonarSource(S);
          for (let i = 0; i < 3; i++) so.rings.push({ x: sx, y: sy, r: -i * 40 * u, a: 0.9, gold: true });
          so.dir = Math.atan2(sy - diver.y, sx - diver.x); so.arrow = 2.5;
          tone({ type: "triangle", freqs: [[900, 0], [1200, 0.25], [1000, 0.6]], dur: 0.9, gain: 0.05, attack: 0.02, release: 0.5, verb: 0.9 });
          buzz([30, 60, 30]);
          const h = SONAR_HINTS[S.rares[0]];
          toast(h ? L(h[0], h[1]) : L("Er komt een gouden echo terug!", "A golden echo comes back!"));
        } else {
          toast(L("Alleen stilte. Hier zwemt niets zeldzaams.", "Only silence. Nothing rare swims here."));
        }
      }
    }
    if (!so.rings.length && !(so.arrow > 0)) return;
    ctx.globalCompositeOperation = "lighter";
    so.rings = so.rings.filter(r => {
      r.r += (r.gold ? 4.5 : 5) * u * k;
      if (r.r < 0) return true;
      r.a -= (r.gold ? 0.006 : 0.008) * k;
      if (r.a <= 0) return false;
      // the golden echo is drawn solid, so it stands out in bright water too
      ctx.globalCompositeOperation = r.gold ? "source-over" : "lighter";
      if (r.gold) { ctx.strokeStyle = `rgba(90,60,10,${r.a * 0.5})`; ctx.lineWidth = 5 * u; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, TAU); ctx.stroke(); }
      ctx.strokeStyle = r.gold ? `rgba(255,200,80,${r.a})` : `rgba(140,230,255,${r.a * 0.8})`;
      ctx.lineWidth = (r.gold ? 3 : 2) * u;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, TAU); ctx.stroke();
      return true;
    });
    // a small golden arrow by the diver points to where the echo came from
    if (so.arrow > 0 && diverMode) {
      so.arrow -= dtSec;
      const a = Math.min(1, so.arrow), d = 46 * u, x = diver.x + Math.cos(so.dir) * d, y = diver.y + Math.sin(so.dir) * d;
      ctx.globalCompositeOperation = "source-over";
      ctx.save(); ctx.translate(x, y); ctx.rotate(so.dir);
      ctx.beginPath(); ctx.moveTo(12 * u, 0); ctx.lineTo(-6 * u, -8 * u); ctx.lineTo(-1 * u, 0); ctx.lineTo(-6 * u, 8 * u); ctx.closePath();
      ctx.fillStyle = `rgba(255,200,80,${a})`; ctx.fill();
      ctx.strokeStyle = `rgba(90,60,10,${0.7 * a})`; ctx.lineWidth = 1.5 * u; ctx.stroke();
      ctx.restore();
    }
    ctx.globalCompositeOperation = "source-over";
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
    ghostdiver: () => drawGhostDiverShape(66, 44, 1, 34, 1, 0.9),
  });

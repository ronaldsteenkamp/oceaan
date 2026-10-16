  // ---- the eighth round: six animals for the emptiest waters -------------------------------
  // Sand eels and a compass jellyfish for the Wadden Sea and the North Sea, a young loggerhead in the Sargasso weed,
  // a blind cave fish, a tripod fish on the deep-sea floor and polar cod under the Arctic ice. Like the seventh round
  // they roll from their own random stream (stream: true in the table at the end), so older oceans stay the same.

  // ---- sand eels ----------------------------------------------------------------------------
  // A little group of slender, silvery sand eels with green-grey backs and a jutting lower jaw, swimming just above
  // the sand. When the diver comes close they dive head first into the sand, one after the other; a moment later
  // a few heads poke back out. When it is quiet again they come out and swim on.
  const EEL_BODY = "M 50 0 C 46 -3 36 -5 20 -5.5 C 0 -6 -26 -5 -42 -2.5 L -42 2.5 C -26 4.5 0 5 20 5 C 36 4.6 46 3 50 0 Z";
  const EEL_JAW = "M 49 0.5 L 55 2 L 47 3.6 Z";
  const EEL_BACK = "M -60 -10 L 60 -10 L 60 -0.5 C 20 -2.5 -20 -1.5 -60 0 Z";
  const EEL_FIN = "M 26 -5 C 10 -9 -20 -8.5 -40 -3.5 L -38 -2 C -20 -6 6 -6.5 26 -5 Z";
  const EEL_TAIL = "M 0 0 L -12 -7 L -8 0 L -12 7 Z";
  // where each eel of a group swims: x and y as a fraction of the group, its own phase, and how late it dives
  const EEL_SPOTS = [[0.38, -0.06, 0.3, 0.05], [0.12, 0.08, 1.9, 0.22], [-0.1, -0.1, 3.1, 0.12], [-0.3, 0.05, 4.4, 0.36], [0.25, 0.16, 5.2, 0.48], [-0.42, -0.04, 2.5, 0.3], [0.0, 0.16, 0.9, 0.58]];
  const smooth01 = x => x * x * (3 - 2 * x);
  function drawSandEels(f) {
    const s = f.s, d = faceOf(f), hide = f.hide || 0, rising = !!f.rising, l = s * 0.32;
    const body = sh("#c8d4d0"), back = sh("#4e6e62"), fin = sh("#8aa49a"), belly = sh("#eef2ee");
    for (const [ox, oy, p0, late] of EEL_SPOTS) {
      const p = Math.max(0, Math.min(1, hide * 1.6 - late));
      const sx = f.x + d * ox * s * 1.2, sy = f.cy + oy * s;
      const floor = sandY(sx) + 2 * u;
      let x = sx, y = sy, a = 0;
      if (p > 0) {
        if (p <= 0.5) {
          // diving in head first, or (on the way back) coming out head first
          const q = smooth01(p / 0.5);
          a = (rising ? -1.35 : 1.35) * Math.min(1, p * 3);
          y = sy + (floor + l * 0.55 - sy) * q;
          x = sx + d * l * 0.25 * q;
        } else {
          // only the head pokes out of the sand, nose up
          const q = smooth01((p - 0.5) / 0.5);
          a = -Math.PI / 2;
          x = sx + d * l * 0.25;
          y = floor + l * 0.55 - l * 0.4 * q + Math.sin(f.ph * 2 + p0) * l * 0.02;
        }
      }
      ctx.save();
      if (p > 0) { ctx.beginPath(); ctx.rect(x - l, y - l * 2, l * 2, floor - (y - l * 2)); ctx.clip(); }
      ctx.translate(x, y + (p > 0 ? 0 : Math.sin(f.ph * 0.8 + p0) * 2 * u)); ctx.scale(d * l / 100, l / 100); ctx.rotate(a);
      ctx.save(); ctx.translate(-41, 0); ctx.rotate(Math.sin(f.ph * 4 + p0) * 0.3); fillWith(P(EEL_TAIL), fin); ctx.restore();
      fillWith(P(EEL_FIN), fin);
      fillWith(P(EEL_BODY), body);
      fillWith(P(EEL_JAW), body);
      paintInside(P(EEL_BODY), back, P(EEL_BACK));
      ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(6, 2.8, 36, 1.5, 0, 0, TAU); ctx.fill();
      eye(41, -1.4, 2.3, "#101010");
      ctx.restore();
    }
  }
  // the group dives when the diver comes close and stays down for a few seconds after it has gone
  function hideSandEels(f, F, k) {
    const dt = k / 60;
    if (f.hide === undefined) { f.hide = 0; f.calm = 0; }
    if (near(f.x, f.cy, 150 * u) > 0) {
      if (f.hide < 0.05) puff(f.x, sandY(f.x) + 4 * u, 4);
      f.hide = Math.min(1, f.hide + 0.035 * k); f.calm = 3.5; f.rising = false;
    } else if ((f.calm -= dt) <= 0 && f.hide > 0) { f.hide = Math.max(0, f.hide - 0.008 * k); f.rising = true; }
    // a buried group stays where it is
    if (f.hide > 0.02) { f.tx = f.x; f.vx = 0; }
  }

  // ---- compass jellyfish -------------------------------------------------------------------
  // A cream bell with sixteen brown V shapes around a dark spot (we see the front half of them), a fringe of brown
  // lappets, long fine tentacles and four frilly mouth arms. When the diver comes close it pulls its tentacles in
  // and pumps itself away.
  const COMPASS_BELL = "M -30 0 C -31 -15 -18 -25 0 -25 C 18 -25 31 -15 30 0 C 20 2.5 -20 2.5 -30 0 Z";
  function drawCompass(f) {
    const s = f.s, pl = Math.sin(f.ph * 1.3), shrink = f.shrink === undefined ? 1 : f.shrink, tl = (f.tl || 120) * shrink;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(s / 100, s / 100); ctx.rotate(Math.sin(f.ph * 0.5) * 0.06);
    const cream = sh("#f0e2c8"), brown = sh("#9a5430"), spot = sh("#6a3418"), tent = sh("#c8a078"), arm = sh("#e6cfae");
    ctx.lineCap = "round";
    // the long tentacles from the rim
    ctx.strokeStyle = tent; ctx.lineWidth = 1; ctx.globalAlpha = 0.7;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const x0 = -27 + i * 6, len = tl * (0.7 + ((i * 7) % 5) / 12);
      ctx.moveTo(x0, 1);
      for (let j = 1; j <= 8; j++) { const fr = j / 8; ctx.lineTo(x0 * (1 - fr * 0.3) + Math.sin(f.ph * 1.1 - fr * 4 + i) * 6 * fr, 1 + len * fr); }
    }
    ctx.stroke();
    // four frilly mouth arms, shorter and wider
    ctx.strokeStyle = arm; ctx.lineWidth = 3.6; ctx.globalAlpha = 0.8;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const x0 = -6 + i * 4, len = tl * 0.55;
      ctx.moveTo(x0, 0);
      for (let j = 1; j <= 8; j++) { const fr = j / 8; ctx.lineTo(x0 + (i - 1.5) * 4 * fr + Math.sin(f.ph * 1.6 - fr * 6 + i * 2) * 4 * fr, len * fr); }
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
    // the bell, breathing in and out
    ctx.save(); ctx.scale(1 + pl * 0.06, 1 - pl * 0.05);
    ctx.globalAlpha = 0.88; fillWith(P(COMPASS_BELL), cream); ctx.globalAlpha = 1;
    ctx.save(); ctx.clip(P(COMPASS_BELL));
    // the front seven of the sixteen V shapes, narrow at the top and open towards the rim
    ctx.fillStyle = brown; ctx.beginPath();
    for (let i = -3; i <= 3; i++) {
      const t = i / 3.6, tx = t * 9, rx = t * 29;
      ctx.moveTo(tx, -20); ctx.lineTo(rx - 4.5, 0); ctx.lineTo(rx - 1.6, 0); ctx.lineTo((tx + rx) / 2, -9); ctx.lineTo(rx + 1.6, 0); ctx.lineTo(rx + 4.5, 0); ctx.closePath();
    }
    ctx.fill();
    ctx.fillStyle = spot; ctx.beginPath(); ctx.ellipse(0, -21.5, 6, 2.6, 0, 0, TAU); ctx.fill();
    ctx.restore();
    // the fringe of brown lappets along the rim
    ctx.fillStyle = brown; ctx.beginPath();
    for (let i = -7; i <= 7; i++) { const x = i * 4; ctx.moveTo(x + 2, 0.6); ctx.arc(x, 0.6, 2, 0, Math.PI); }
    ctx.fill();
    ctx.restore();
    ctx.restore();
  }
  function shyCompass(f, F, k) {
    if (f.shrink === undefined) f.shrink = 1;
    if (near(f.x, f.cy, 140 * u) > 0) {
      f.shrink = Math.max(0.35, f.shrink - 0.05 * k);
      f.ph += 0.06 * k; // pumps faster
      f.tx = Math.max(30 * u, Math.min(W - 30 * u, f.x + (Math.sign(f.x - diver.x) || 1) * 120 * u));
    } else f.shrink = Math.min(1, f.shrink + 0.006 * k);
  }

  // ---- a young loggerhead turtle -------------------------------------------------------------
  // A hatchling a few months old: a brown, keeled shell, a big head and big front flippers. It drifts with a mat of
  // sargassum weed, paddling a little to stay with it. When the diver comes close it ducks under the weed and
  // comes back up a few seconds later.
  // the shell seen from the side, with the low bumps of its keels along the top
  const LH_SHELL = "M 30 4 C 29 -2 22 -6 14 -7 L 10 -9 L 6 -7 C 0 -8 -6 -8 -10 -7.5 L -14 -9.5 L -18 -7 C -26 -6 -34 -2 -38 4 C -30 9 -12 11 6 10.5 C 18 10 27 8 30 4 Z";
  const LH_HEAD = "M 22 2 C 24 -6 34 -9 43 -8 C 52 -6 56 0 54 5 C 52 10 44 12 36 11 C 28 10 23 7 22 2 Z";
  const LH_FRONT = "M 2 -3 C -6 0 -18 7 -32 16 C -35 18 -33 21 -29 20 C -15 16 -4 10 4 3 Z";
  const LH_HIND = "M 0 0 C -4 4 -10 6 -14 5 C -11 1 -6 -2 0 -2 Z";
  function veilBelow(path, y) { ctx.save(); ctx.clip(path); ctx.fillStyle = "rgba(30,80,120,0.42)"; ctx.fillRect(-200, y, 400, 300); ctx.restore(); }
  function drawLoggerhead(f) {
    const s = f.s, dip = f.dip || 0, stroke = Math.sin(f.ph * 1.8), veil = -dip * 40;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(Math.sin(f.ph * 0.9) * 0.04 + dip * 0.15);
    const shell = sh("#6a4a2a"), keel = sh("#8a6a42"), pale = sh("#d8c8a0"), skin = sh("#5a3e24"), edge = sh("#a88a5a");
    // the far flippers, under water
    ctx.save(); ctx.translate(-30, 7); ctx.rotate(0.2 - stroke * 0.3); fillUnder(P(LH_HIND), skin); ctx.restore();
    ctx.save(); ctx.translate(10, 6); ctx.rotate(0.15 - stroke * 0.3); fillUnder(P(LH_FRONT), skin); ctx.restore();
    // a big head, as its name says, with a paler jaw
    fillWith(P(LH_HEAD), skin);
    paintInside(P(LH_HEAD), edge, P("M 30 6 C 40 8 48 7 58 4 L 58 20 L 30 20 Z"));
    eye(44, -1, 2, "#101010");
    veilBelow(P(LH_HEAD), veil);
    fillWith(P(LH_SHELL), shell);
    // a thin pale rim of belly shell along the bottom, and the plates of the shell
    paintInside(P(LH_SHELL), pale, P("M -50 7 C -20 10 10 9 40 4 L 40 30 L -50 30 Z"));
    ctx.save(); ctx.clip(P(LH_SHELL)); ctx.fillStyle = keel;
    for (const [x, y] of [[17, -1], [5, -3], [-8, -3], [-21, -1], [-31, 3]]) { ctx.beginPath(); ctx.ellipse(x, y, 5, 2.4, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
    veilBelow(P(LH_SHELL), veil);
    // the near front flipper, long and swept back like a paddle, with a pale trailing edge
    ctx.save(); ctx.translate(16, 7); ctx.rotate(-0.1 + stroke * 0.35); fillUnder(P(LH_FRONT), skin); paintInside(P(LH_FRONT), edge, P("M -40 16 C -20 14 -6 8 6 2 L 6 30 L -40 30 Z")); ctx.restore();
    if (dip < 0.3) ripple(-38, 34, f.ph);
    ctx.restore();
  }
  function moveLoggerhead(f, F, k) {
    f.ph += 0.05 * k;
    const dt = k / 60, mats = scene.sargassum || [];
    if (f.dip === undefined) { f.dip = 0; f.duck = 0; f.off = (Math.random() - 0.5) * 0.5; }
    // stay with the nearest mat of weed, or paddle slowly to and fro when there is none
    let want;
    if (mats.length) {
      if (!f.mat || !mats.includes(f.mat)) f.mat = mats.reduce((a, m) => Math.abs(m.x - f.x) < Math.abs(a.x - f.x) ? m : a, mats[0]);
      const tx = f.mat.x + f.off * f.mat.w;
      want = Math.abs(tx - f.x) > W / 2 ? 0 : Math.max(-0.25, Math.min(0.25, (tx - f.x) / (80 * u))) * u + 0.06 * u;
    } else {
      if (f.x < 30 * u) f.dir = 1;
      if (f.x > W - 30 * u) f.dir = -1;
      want = f.dir * F.speed * u;
    }
    f.vx = (f.vx || 0) + (want - (f.vx || 0)) * Math.min(1, 0.03 * k);
    f.x += f.vx * k;
    if (f.mat && f.x > W + 40 * u) f.x = -30 * u;
    if (Math.abs(f.vx) > 0.12 * u) f.dir = Math.sign(f.vx);
    // ducks under the weed when the diver comes close
    if (near(f.x, f.cy, 120 * u) > 0) f.duck = 3;
    f.duck -= dt;
    f.dip = f.duck > 0 ? Math.min(1, f.dip + 0.05 * k) : Math.max(0, f.dip - 0.012 * k);
    f.cy = waveY(f.x) + smooth01(f.dip) * 34 * u;
  }

  // ---- a blind cave fish -------------------------------------------------------------------
  // A pale pink, eel-like brotula with long soft fins along its back and belly, a rounded tail and two thread-like
  // fins under its chin. It has no real eyes, so it does not notice the lamp; it feels the diver move instead. It
  // turns towards the movement, hangs still for a moment, and then glides away.
  const CAVE_BODY = "M 50 2 C 49 -3 44 -8 32 -9.5 C 14 -11 -10 -8 -34 -4 C -40 -3 -44 -1 -44 1 C -44 3 -40 5 -34 6 C -10 9 14 10.5 32 9 C 44 8 49 6 50 2 Z";
  const CAVE_DORSAL = "M 18 -10 C 0 -16 -26 -13 -46 -3 L -44 0 C -26 -8 0 -11 18 -10 Z";
  const CAVE_ANAL = "M 6 9.5 C -10 14 -30 11 -46 3 L -44 1 C -28 8 -10 10 6 9.5 Z";
  const CAVE_TAIL = "M 0 -3 C -8 -8 -15 -6 -15 0 C -15 6 -8 8 0 4 Z";
  const CAVE_BACK = "M -60 -20 L 60 -20 L 60 -4 C 30 -3 -10 -2 -60 1 Z";
  const CAVE_GILL = "M 31 -6 C 29 -2 29 4 31 7 L 30 7.4 C 28 4 28 -2 30 -6.4 Z";
  function drawCavefish(f) {
    const s = f.s;
    sandShadow(f, s * 0.3);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const body = sh("#e8c8c4"), back = sh("#c8a0a0"), fin = sh("#d8b0ac"), red = sh("#b07878");
    // soft fins that ripple along their length
    ctx.globalAlpha = 0.75;
    ctx.save(); ctx.translate(0, Math.sin(f.ph * 2) * 1.2); fillWith(P(CAVE_DORSAL), fin); ctx.restore();
    ctx.save(); ctx.translate(0, -Math.sin(f.ph * 2 + 1) * 1.2); fillWith(P(CAVE_ANAL), fin); ctx.restore();
    ctx.save(); ctx.translate(-43, 0); ctx.rotate(Math.sin(f.ph * 2.2) * 0.25); fillWith(P(CAVE_TAIL), fin); ctx.restore();
    ctx.globalAlpha = 1;
    fillWith(P(CAVE_BODY), body);
    paintInside(P(CAVE_BODY), back, P(CAVE_BACK));
    fillWith(P(CAVE_GILL), back);
    // where the eye would be only a dull pink speck, and rows of tiny sense organs on the head
    ctx.fillStyle = red; ctx.beginPath();
    for (const [x, y, r] of [[40, -3.5, 1.3], [44, -1, 0.7], [36, -6, 0.7], [42, -6.5, 0.6], [38, 1, 0.6], [45, 3, 0.6]]) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); }
    ctx.fill();
    ctx.strokeStyle = red; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(50, 2.5); ctx.lineTo(42, 3.5); ctx.stroke();
    // two thread-like fins under the chin
    ctx.strokeStyle = back; ctx.lineWidth = 1.1; ctx.lineCap = "round"; ctx.beginPath();
    for (const o of [0, 1.2]) { ctx.moveTo(33, 8.5); ctx.quadraticCurveTo(37, 13, 40 + o + Math.sin(f.ph * 1.6 + o) * 1.5, 17 - o); }
    ctx.stroke();
    ctx.restore();
  }
  function feelDiver(f, F, k) {
    const dt = k / 60;
    if (f.look === undefined) f.look = 0;
    if (f.look > 0) {
      // turned towards the diver, hanging still
      f.look -= dt; f.tx = f.x; f.vx = (f.vx || 0) * 0.85; f.dir = Math.sign(diver.x - f.x) || f.dir;
      if (f.look <= 0) { f.tx = Math.max(30 * u, Math.min(W - 30 * u, f.x + (Math.sign(f.x - diver.x) || 1) * 220 * u)); f.look = -4; }
    } else if (f.look < 0) f.look = Math.min(0, f.look + dt);
    else if (near(f.x, f.cy, 170 * u) > 0) f.look = 1.4;
  }

  // ---- a tripod fish -------------------------------------------------------------------------
  // A grey deep-sea fish that stands on the floor on three long fin rays (two under its belly and one under its
  // tail), facing the current, with the rays of its chest fins held up like feelers. When the diver comes close it
  // lifts off, swims a little way with its rays trailing, and lands stiffly on its three legs again.
  const TRI_BODY = "M 46 2 C 46 -6 38 -10 26 -10 C 10 -10 -14 -7 -36 -3 L -38 2 C -16 6 10 8 26 8 C 38 8 46 6 46 2 Z";
  const TRI_DORSAL = "M 12 -9 C 8 -19 0 -19 -4 -8 Z";
  const TRI_TAIL = "M -34 -2 L -48 -11 L -45 1 Z";
  const TRI_BACK = "M -60 -20 L 60 -20 L 60 -3 C 20 -2 -20 -1 -60 1 Z";
  const lerp = (a, b, t) => a + (b - a) * t;
  function drawTripod(f) {
    const s = f.s, fly = f.fly || 0, h = 62 + fly * 2500 * u / s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const body = sh("#6a6e78"), back = sh("#4e525c"), belly = sh("#9a9ea6"), ray = sh("#8a8e96");
    // a soft shadow under its feet
    ctx.fillStyle = `rgba(0,0,0,${(0.13 * (1 - fly)).toFixed(3)})`; ctx.beginPath(); ctx.ellipse(-12, 0, 34, 3, 0, 0, TAU); ctx.fill();
    ctx.translate(0, -h);
    // the three legs: stiff and straight when it stands, trailing behind when it swims
    ctx.strokeStyle = ray; ctx.lineWidth = 1.8; ctx.lineCap = "round"; ctx.beginPath();
    for (const [x0, y0, sx, sy, wx, wy] of [[12, 6, 18, h, -24, 22], [7, 6, 9, h, -28, 18], [-38, 1, -46, h, -96, 8]]) {
      const ex = lerp(sx, wx, fly), ey = lerp(sy, wy, fly);
      ctx.moveTo(x0, y0); ctx.quadraticCurveTo(lerp(x0, ex, 0.5) + fly * 6 * Math.sin(f.ph * 3 + x0), lerp(y0, ey, 0.5), ex, ey);
    }
    // the chest-fin rays held up in front like feelers
    for (const [ex, ey, o] of [[64, -44, 0], [54, -52, 1.3]]) {
      const tx = lerp(ex, -8, fly), ty = lerp(ey, -26, fly);
      ctx.moveTo(26, -3); ctx.quadraticCurveTo(lerp(44, 10, fly), lerp(-12, -18, fly), tx + Math.sin(f.ph * 1.4 + o) * 2, ty);
    }
    ctx.stroke();
    fillWith(P(TRI_TAIL), back);
    fillWith(P(TRI_DORSAL), back);
    fillWith(P(TRI_BODY), body);
    paintInside(P(TRI_BODY), back, P(TRI_BACK));
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(8, 5.5, 30, 2.2, 0, 0, TAU); ctx.fill();
    // a wide mouth and a small eye
    ctx.strokeStyle = back; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(46, 2); ctx.lineTo(34, 3.5); ctx.stroke();
    eye(38, -4, 1.6, "#101418");
    ctx.restore();
  }
  function moveTripod(f, F, k) {
    f.ph += 0.05 * k;
    const dt = k / 60;
    if (f.fly === undefined) { f.fly = 0; f.go = 0; f.landed = true; }
    if (f.go > 0) {
      f.go -= dt; f.landed = false;
      f.fly = Math.min(1, f.fly + 0.06 * k);
      f.x += f.dir * 0.9 * u * k * f.fly;
      if (f.x < scene.floorL + 40 * u) f.dir = 1;
      if (f.x > scene.floorR - 40 * u) f.dir = -1;
    } else {
      f.fly = Math.max(0, f.fly - 0.025 * k);
      if (!f.landed && f.fly === 0) { f.landed = true; puff(f.x - f.dir * 6 * u, sandY(f.x) + 4 * u, 3); }
      if (f.fly === 0 && near(f.x, sandY(f.x) - f.s * 0.6, 120 * u) > 0) { f.go = rnd6(1.4, 2.2); f.dir = Math.sign(f.x - diver.x) || 1; }
    }
    f.cy = sandY(f.x) + 4 * u;
  }

  // ---- polar cod -----------------------------------------------------------------------------
  // A small cod of the Arctic: brownish with dark speckles, a silver belly, three dorsal fins, a forked tail and a
  // tiny chin barbel. A few swim together just under the ice; when the diver comes close they dart up and hide
  // under the nearest floe until it is safe again.
  const PCOD_BODY = "M 50 1 C 47 -6 38 -10 24 -10 C 6 -11 -18 -8 -36 -4 C -40 -3 -42 -1 -42 0 C -42 2 -40 3 -36 4 C -18 8 6 10 24 9 C 38 8 47 6 50 1 Z";
  const PCOD_FINS = ["M 22 -10 L 18 -19 C 15 -20 11 -18 8 -10.5 Z", "M 4 -10.5 L -1 -18 C -5 -19 -9 -16 -13 -9.5 Z", "M -16 -8.6 L -21 -15 C -25 -15 -29 -11 -31 -5.8 Z", "M 2 9.6 L -3 16 C -7 16 -11 13 -14 8.8 Z", "M -17 7.6 L -22 13 C -26 13 -30 10 -32 5.4 Z"];
  const PCOD_TAIL = "M 2 -4 L -14 -12 L -9 0 L -14 12 L 2 4 Z";
  const PCOD_BACK = "M -60 -20 L 60 -20 L 60 -2 C 20 -3 -20 -2 -60 0 Z";
  function drawPolarCod(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const body = sh("#9a9280"), back = sh("#6a6458"), dark = sh("#4a4438"), belly = sh("#d8dcd8");
    ctx.save(); ctx.translate(-40, 0); ctx.rotate(Math.sin(f.ph * 2.6) * 0.22); fillWith(P(PCOD_TAIL), back); ctx.restore();
    for (const p of PCOD_FINS) fillWith(P(p), back);
    fillWith(P(PCOD_BODY), body);
    paintInside(P(PCOD_BODY), back, P(PCOD_BACK));
    ctx.save(); ctx.clip(P(PCOD_BODY));
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(4, 9, 44, 5.5, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath();
    for (const [x, y] of [[30, -6], [20, -8], [10, -5], [0, -8], [-10, -5], [-20, -6], [-28, -3], [15, -2], [-4, -2]]) { ctx.moveTo(x + 1.3, y); ctx.arc(x, y, 1.3, 0, TAU); }
    ctx.fill();
    ctx.restore();
    ctx.save(); ctx.translate(28, 2); ctx.rotate(0.4 + Math.sin(f.ph * 4) * 0.3); ctx.globalAlpha = 0.7; ctx.fillStyle = back; ctx.beginPath(); ctx.ellipse(-5, 0, 7, 2.6, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.strokeStyle = dark; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(44, 6); ctx.lineTo(43 + Math.sin(f.ph * 2) * 0.6, 10); ctx.stroke();
    eye(41, -3, 2.3, "#101010");
    ctx.restore();
  }
  function hideInIce(f, F, k) {
    const floes = scene.floes || [];
    if (!floes.length) { shyFish(f); return; }
    const dt = k / 60;
    if (f.band0 === undefined) { f.band0 = f.band; f.slot = Math.random() * 2 - 1; f.hide = 0; }
    if (near(f.x, f.cy, 130 * u) > 0) {
      if (!f.floe || !floes.includes(f.floe)) f.floe = floes.reduce((a, o) => Math.abs(o.x - f.x) < Math.abs(a.x - f.x) ? o : a, floes[0]);
      f.hide = 4;
    }
    let band = f.band0;
    if (f.hide > 0 && f.floe) {
      f.hide -= dt;
      const o = f.floe;
      f.tx = Math.max(30 * u, Math.min(W - 30 * u, o.x + f.slot * o.w * 0.3));
      band = (waveY(o.x) + o.d * 0.8 + f.s * 0.2) / H;
      // a dart: much faster than its usual pace
      const dx = f.tx - f.x;
      if (Math.abs(dx) > 20 * u) f.x += Math.sign(dx) * 1.6 * u * k;
    } else f.floe = null;
    f.band += (band - f.band) * Math.min(1, (f.hide > 0 ? 0.08 : 0.01) * k);
  }

  // ---- the table of the eighth round ---------------------------------------------------------
  const W8_FAUNA = {
    sandeel: { kind: "glide", size: [54, 64], lift: [10, 18], speed: 0.35, draw: drawSandEels, react: hideSandEels, thumb: 92, stream: true },
    compass: { kind: "swim", size: [30, 38], band: [0.2, 0.5], speed: 0.12, draw: drawCompass, react: shyCompass, thumb: 60, stream: true },
    loggerhead: { kind: "surface", size: [22, 26], speed: 0.05, draw: drawLoggerhead, move: moveLoggerhead, thumb: 80, stream: true },
    cavefish: { kind: "glide", size: [26, 32], lift: [12, 26], speed: 0.18, draw: drawCavefish, react: feelDiver, thumb: 92, stream: true },
    tripodfish: { kind: "floor", size: [34, 40], draw: drawTripod, move: moveTripod, thumb: 80, stream: true },
    polarcod: { kind: "swim", size: [20, 24], count: [3, 5], band: [0.14, 0.4], speed: 0.4, draw: drawPolarCod, react: hideInIce, thumb: 88, stream: true },
  };
  Object.assign(FAUNA, W8_FAUNA);
  hookFauna(W8_FAUNA, {});
  // the jellyfish fits its picture better with shorter tentacles
  THUMBS.compass = () => drawCompass({ x: 60, cy: 24, s: 64, ph: 1.2, tl: 70 });

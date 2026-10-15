  // ---- the sixth wave -----------------------------------------------------------
  // Thirty more animals for every water, a polar bear that climbs onto the ice, six moments and two legends.
  const rnd6 = (a, b) => a + Math.random() * (b - a);

  // ---- sounds of the sixth wave -------------------------------------------------------
  const sfxSplash = amt => { noiseBurst({ freq: 900, dur: 0.6, gain: 0.2 * amt, attack: 0.01 }); noiseBurst({ type: "highpass", freq: 2200, dur: 0.35, gain: 0.06 * amt, attack: 0.005 }); };
  const sfxWind = () => { noiseBurst({ type: "bandpass", freq: 500, dur: 14, gain: 0.12, attack: 3 }); noiseBurst({ freq: 160, dur: 12, gain: 0.1, attack: 2.5 }); };
  const sfxSwirl = () => { noiseBurst({ freq: 200, dur: 18, gain: 0.12, attack: 4 }); tone({ type: "sine", freqs: [[70, 0], [90, 6], [65, 14]], dur: 16, gain: 0.05, attack: 4, release: 6, vib: [0.4, 6], verb: 0.8 }); };
  const sfxDeep = () => { sfxRumble(1); tone({ type: "sawtooth", freqs: [[58, 0], [52, 3], [46, 6]], dur: 6.5, gain: 0.07, attack: 1.5, release: 3, lp: 260, vib: [0.7, 2], verb: 0.9 }); };
  const sfxFoghorn = () => { tone({ type: "sawtooth", freqs: [[98, 0], [96, 2.4]], dur: 2.6, gain: 0.06, attack: 0.25, release: 1, lp: 520, verb: 0.75 }); tone({ type: "sine", freqs: [[147, 0], [144, 2.4]], dur: 2.6, gain: 0.03, attack: 0.3, release: 1, verb: 0.75 }); };
  const sfxWhoosh = () => noiseBurst({ type: "highpass", freq: 1800, dur: 0.9, gain: 0.035, attack: 0.3 });
  const sfxEclipse = () => [220, 277, 330].forEach((f, i) => tone({ type: "sine", freqs: [[f, 0], [f * 0.98, 4]], dur: 4.5, gain: 0.025, delay: i * 0.4, attack: 1.2, release: 2, verb: 0.9 }));
  let lastPlip = 0;
  const sfxPlip = () => { if (t - lastPlip < 0.25) return; lastPlip = t; tone({ freqs: [[900, 0], [500, 0.06]], dur: 0.08, gain: 0.04, attack: 0.004, release: 0.05, verb: 0.4 }); };

  // ---- the reef and the lagoon -----------------------------------------------------
  // Christmas tree worms: two little spiral crowns on a coral head, in bright colours. When the diver comes close
  // they vanish into their tubes in a flash, and after a while they slowly unfold again.
  const XMAS_COLS = ["#e8402a", "#f2c030", "#3a7ae0", "#f2f0e8", "#e860a8", "#f08a30"];
  const XMAS_ROCK = "M -46 0 C -44 -14 -30 -24 -10 -26 C 10 -28 32 -22 42 -10 C 46 -5 48 -2 48 0 Z";
  function drawXmasTree(f) {
    const s = f.s;
    if (f.open === undefined) { f.open = 1; f.shut = 0; f.col = XMAS_COLS[Math.floor(f.ph * 10) % XMAS_COLS.length]; }
    if (near(f.x, f.cy - s * 0.3, 110 * u) > 0) { if (f.open > 0.5) sfxPlip(); f.open = Math.max(0, f.open - 0.35 * frameK); f.shut = 2.5; }
    else if ((f.shut -= frameK / 60) <= 0) f.open = Math.min(1, f.open + 0.012 * frameK);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(s / 100, s / 100);
    fillWith(P(XMAS_ROCK), sh("#a89880"));
    paintInside(P(XMAS_ROCK), sh("#8a7a62"), P("M -60 -8 L 60 -8 L 60 10 L -60 10 Z"));
    ctx.fillStyle = sh("#c8b8a0");
    ctx.beginPath(); for (const [x, y] of [[-30, -12], [-14, -20], [24, -16], [36, -8], [-38, -5]]) { ctx.moveTo(x + 2.4, y); ctx.arc(x, y, 2.4, 0, TAU); } ctx.fill();
    const col = sh(f.col), edge = sh("#fff8f0");
    for (const [cx, lean] of [[-11, -0.14], [11, 0.14]]) {
      ctx.save(); ctx.translate(cx, -24); ctx.rotate(lean + Math.sin(f.ph * 0.8 + cx) * 0.06);
      ctx.fillStyle = sh("#6a5a48"); ctx.beginPath(); ctx.ellipse(0, 0, 5, 2, 0, 0, TAU); ctx.fill();
      if (f.open > 0.03) {
        ctx.scale(f.open, f.open);
        ctx.fillStyle = col; ctx.fillRect(-1, -48, 2, 46);
        // a spiral tree of five whorls, narrowing to the top
        ctx.fillStyle = col; ctx.beginPath();
        for (let i = 0; i < 5; i++) { const y = -6 - i * 9, w = 13 - i * 2.2; ctx.moveTo(-w, y + 3); ctx.quadraticCurveTo(0, y - 9, w, y + 3); ctx.quadraticCurveTo(0, y - 1, -w, y + 3); }
        ctx.fill();
        ctx.strokeStyle = edge; ctx.globalAlpha *= 0.55; ctx.lineWidth = 0.9; ctx.beginPath();
        for (let i = 0; i < 5; i++) { const y = -6 - i * 9, w = 13 - i * 2.2; for (let j = -2; j <= 2; j++) { ctx.moveTo(j * w * 0.36, y + 1); ctx.lineTo(j * w * 0.44, y - 4); } }
        ctx.stroke(); ctx.globalAlpha /= 0.55;
      } else {
        // the little lid that shuts the tube
        ctx.fillStyle = sh("#c8a868"); ctx.beginPath(); ctx.ellipse(0, -1.5, 4, 2.2, 0, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  // A soft arm along a curve from (x0, y0) to (x1, y1), tapering from w0 to a thin tip, with a row of pale suckers.
  function softArm(x0, y0, cx, cy, x1, y1, w0, col, sucker) {
    const pts = [];
    for (let i = 0; i <= 14; i++) { const f = i / 14, a = (1 - f) * (1 - f), b = 2 * (1 - f) * f, c = f * f; pts.push([a * x0 + b * cx + c * x1, a * y0 + b * cy + c * y1, w0 * (1 - f * 0.85)]); }
    ctx.fillStyle = col;
    for (const [px, py, w] of pts) { ctx.beginPath(); ctx.arc(px, py, w / 2, 0, TAU); ctx.fill(); }
    if (sucker) { ctx.fillStyle = sucker; for (let i = 2; i < pts.length - 1; i += 2) { const [px, py, w] = pts[i]; ctx.beginPath(); ctx.arc(px + w * 0.25, py + w * 0.2, w * 0.2, 0, TAU); ctx.fill(); } }
  }

  // A coconut octopus walks on two arms with half a coconut shell held under it like a bowl. When the diver
  // comes close, it pulls two halves together around itself and peeks out through the crack.
  const COCO_MANTLE = "M -2 -36 C -16 -38 -26 -50 -20 -60 C -14 -68 2 -68 8 -60 C 14 -52 12 -40 -2 -36 Z";
  function drawCoconut(f) {
    const s = f.s;
    if (f.hide === undefined) f.hide = 0;
    const scared = near(f.x, f.cy - s * 0.3, 120 * u) > 0;
    f.hide = Math.max(0, Math.min(1, f.hide + (scared ? 0.08 : -0.005) * frameK));
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const shell = sh("#7a4a26"), inner = sh("#e8d8b8"), fibre = sh("#4a2a12"), skin = sh("#b8763a"), dark = sh("#6a3a18"), suck = sh("#e8c8a0");
    if (f.hide > 0.5) {
      // shut tight: a coconut on the sand, with an eye in the crack and the tip of an arm curling out
      ctx.save(); ctx.translate(0, -24); ctx.scale(1, 1 + Math.sin(f.ph * 2) * 0.02);
      ctx.fillStyle = shell; ctx.beginPath(); ctx.ellipse(0, 0, 30, 24, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = fibre; ctx.lineWidth = 1.1; ctx.globalAlpha *= 0.6;
      ctx.beginPath(); for (let i = 0; i < 6; i++) { ctx.moveTo(-26 + i * 9, -14 + (i % 2) * 3); ctx.lineTo(-22 + i * 9, -8 + (i % 2) * 3); ctx.moveTo(-24 + i * 9, 10); ctx.lineTo(-20 + i * 9, 15); } ctx.stroke();
      ctx.globalAlpha /= 0.6;
      ctx.fillStyle = "#1a0e06"; ctx.beginPath(); ctx.ellipse(0, 0, 30, 2.2, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = sh("#f2d070"); ctx.beginPath(); ctx.ellipse(12, 0, 4, 1.8, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#101010"; ctx.fillRect(11, -1, 3, 2);
      softArm(-26, 1, -40, 4, -36 + Math.sin(f.ph * 3) * 2, 18, 5, skin, suck);
      ctx.restore();
    } else {
      const walk = f.ph * 4;
      // two arms walk on the sand like legs: curving down and rolling out at the tips, suckers underneath
      for (let i = 0; i < 2; i++) {
        const a = Math.sin(walk + i * Math.PI), fx = -6 + a * 14 + i * 8;
        softArm(-4 + i * 7, -30, -14 + a * 8 + i * 6, -14, fx, -1, 8, i ? skin : dark, suck);
        softArm(fx, -1, fx + 6, 1, fx + 9, -4, 3, i ? skin : dark, null);
      }
      // the shell half, carried like a bowl under the body
      ctx.save(); ctx.translate(-2, -36); ctx.rotate(Math.sin(walk) * 0.05);
      ctx.fillStyle = shell; ctx.beginPath(); ctx.ellipse(0, 0, 24, 15, 0, 0, Math.PI); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = fibre; ctx.lineWidth = 1; ctx.globalAlpha *= 0.6;
      ctx.beginPath(); for (let i = 0; i < 5; i++) { ctx.moveTo(-16 + i * 8, 4); ctx.lineTo(-14 + i * 8, 10); } ctx.stroke(); ctx.globalAlpha /= 0.6;
      ctx.fillStyle = inner; ctx.beginPath(); ctx.ellipse(0, 0, 24, 3, 0, 0, TAU); ctx.fill();
      ctx.restore();
      // the body sits in the bowl, mottled brown, with the other arms curling over the rim
      fillWith(P(COCO_MANTLE), skin);
      ctx.save(); ctx.clip(P(COCO_MANTLE)); ctx.fillStyle = dark;
      for (const [x, y, r] of [[-12, -54, 3], [-4, -60, 2.4], [2, -48, 2.6], [-16, -44, 2], [6, -56, 2]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
      ctx.restore();
      for (const [x0, x1, y1] of [[-8, -27, -26], [4, 25, -28], [0, 16, -24]]) softArm(x0, -38, (x0 + x1) / 2, -45, x1 + Math.sin(f.ph * 2 + x0) * 1.5, y1, 5, skin, null);
      ctx.fillStyle = sh("#f2d070"); ctx.beginPath(); ctx.arc(8, -44, 3.4, 0, TAU); ctx.fill();
      ctx.fillStyle = "#101010"; ctx.fillRect(6.4, -45, 3.4, 2);
    }
    ctx.restore();
  }

  // A Moorish idol: a tall disc with broad black and yellow bands, a long snout with an orange saddle,
  // and a white streamer trailing from its dorsal fin.
  const MOOR_BODY = "M 38 2 C 32 -8 20 -26 2 -28 C -14 -29 -26 -16 -28 -4 L -28 4 C -26 16 -14 27 2 26 C 18 24 30 10 38 2 Z";
  const MOOR_SNOUT = "M 34 -2 C 40 -2 46 -1 50 0 C 50 2 46 3 40 4 L 34 5 Z";
  const MOOR_STREAMER = "M 8 -27 C 6 -48 -6 -64 -40 -74 C -16 -60 -6 -44 -10 -26 Z";
  const MOOR_ANAL = "M 6 25 C 0 38 -12 44 -26 44 C -18 36 -14 30 -14 23 Z";
  const MOOR_TAIL = "M 0 -2 L -14 -10 C -11 -4 -11 4 -14 10 L 0 2 Z";
  function drawMoorish(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const white = sh("#f4f0e2"), black = sh("#18181c"), yellow = sh("#f2d030");
    ctx.save(); ctx.translate(-28, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.25); fillWith(P(MOOR_TAIL), black); ctx.restore();
    ctx.save(); ctx.translate(8, -27); ctx.rotate(Math.sin(f.ph * 1.2) * 0.06); ctx.translate(-8, 27); fillWith(P(MOOR_STREAMER), white); ctx.restore();
    fillWith(P(MOOR_ANAL), black);
    fillWith(P(MOOR_SNOUT), yellow);
    fillWith(P(MOOR_BODY), white);
    paintInside(P(MOOR_BODY), yellow, P("M -12 -40 L -40 -40 L -40 40 L -18 40 Z"));
    paintInside(P(MOOR_BODY), black, P("M 26 -40 L 14 -40 L 18 40 L 30 40 Z M 4 -40 L -12 -40 L -18 40 L 0 40 Z"));
    ctx.fillStyle = sh("#f08a30"); ctx.beginPath(); ctx.ellipse(37, -3, 4.4, 2.6, -0.3, 0, TAU); ctx.fill();
    ctx.fillStyle = black; ctx.beginPath(); ctx.arc(49.5, 1, 1.5, 0, TAU); ctx.fill();
    ctx.fillStyle = "#f4f0e2"; ctx.beginPath(); ctx.arc(22, -7, 3.6, 0, TAU); ctx.fill();
    eye(22.6, -7, 2.3, "#101010");
    ctx.restore();
  }

  // An emperor angelfish: deep blue with yellow stripes, a pale face, a black mask over the eye and a yellow tail.
  const EMP_BODY = "M 44 2 C 42 -10 30 -22 10 -24 C -12 -26 -30 -16 -36 -4 L -36 4 C -30 16 -12 26 10 24 C 30 22 42 12 44 2 Z";
  const EMP_DORSAL = "M 22 -21 C 0 -32 -30 -28 -42 -6 L -34 -6 C -24 -20 0 -24 22 -21 Z";
  const EMP_ANAL = "M 18 21 C 0 30 -28 26 -42 6 L -34 6 C -24 18 0 22 18 21 Z";
  const EMP_TAIL = "M 2 0 C -6 -10 -14 -14 -18 -12 C -16 -4 -16 4 -18 12 C -14 14 -6 10 2 0 Z";
  function drawEmperor(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const blue = sh("#2a48b8"), yellow = sh("#f2d040"), dark = sh("#141828"), light = sh("#58b0f0");
    ctx.save(); ctx.translate(-36, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.25); fillWith(P(EMP_TAIL), yellow); ctx.restore();
    fillWith(P(EMP_DORSAL), blue); fillWith(P(EMP_ANAL), blue);
    ctx.strokeStyle = light; ctx.lineWidth = 1; ctx.stroke(P(EMP_DORSAL)); ctx.stroke(P(EMP_ANAL));
    fillWith(P(EMP_BODY), blue);
    ctx.save(); ctx.clip(P(EMP_BODY));
    ctx.strokeStyle = yellow; ctx.lineWidth = 2.2;
    ctx.beginPath(); for (let i = 0; i < 9; i++) { const y = -24 + i * 6; ctx.moveTo(-40, y + 4); ctx.quadraticCurveTo(-10, y - 2, 14, y - 4); } ctx.stroke();
    // the pale face, the dark band behind it and the black mask over the eye
    ctx.fillStyle = sh("#dfe8ee"); ctx.fillRect(16, -30, 40, 60);
    ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(8, -30); ctx.lineTo(16, -30); ctx.lineTo(18, 30); ctx.lineTo(8, 30); ctx.fill();
    ctx.beginPath(); ctx.moveTo(24, -30); ctx.lineTo(33, -30); ctx.lineTo(31, 10); ctx.lineTo(22, 10); ctx.fill();
    ctx.strokeStyle = light; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(23, -30); ctx.lineTo(21, 10); ctx.moveTo(34, -30); ctx.lineTo(32, 10); ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.translate(12, 4); ctx.rotate(0.5 + Math.sin(f.ph * 4) * 0.3); ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(-5, 0, 7, 3, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = light; ctx.beginPath(); ctx.arc(28, -7, 3.6, 0, TAU); ctx.fill();
    eye(28, -7, 2.5, "#101010");
    ctx.restore();
  }

  // A crown-of-thorns starfish: a low purple dome with many short arms, all covered in long red spines.
  function drawCrownThorns(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy - s * 0.02); ctx.scale(s / 100, s / 100);
    const body = sh("#8a3a6a"), spine = sh("#e05a4a"), tip = sh("#f2c060");
    // the arms show as lumps along the bottom edge, curling up at the tips
    ctx.fillStyle = body;
    ctx.beginPath(); for (let i = 0; i < 9; i++) { const x = -44 + i * 11; ctx.moveTo(x + 7, -3); ctx.ellipse(x, -3, 7, 5 + Math.sin(f.ph * 1.2 + i) * 0.8, 0, 0, TAU); } ctx.fill();
    ctx.beginPath(); ctx.moveTo(-42, 0); ctx.bezierCurveTo(-38, -20, -16, -28, 0, -28); ctx.bezierCurveTo(16, -28, 38, -20, 42, 0); ctx.fill();
    ctx.strokeStyle = spine; ctx.lineWidth = 1.6; ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i <= 18; i++) {
      const a = Math.PI + i * Math.PI / 18, ex = Math.cos(a) * 42, ey = Math.sin(a) * 27, len = 10 + (i % 3) * 3;
      ctx.moveTo(ex * 0.9, ey * 0.9); ctx.lineTo(ex + Math.cos(a) * len, ey + Math.sin(a) * len - 2);
    }
    for (let i = 0; i < 9; i++) { const x = -44 + i * 11; ctx.moveTo(x, -6); ctx.lineTo(x + (i - 4) * 1.2, -14); }
    ctx.stroke();
    ctx.fillStyle = tip;
    ctx.beginPath(); for (let i = 0; i <= 18; i += 2) { const a = Math.PI + i * Math.PI / 18, len = 10 + (i % 3) * 3, x = Math.cos(a) * (42 + len), y = Math.sin(a) * (27 + len) - 2; ctx.moveTo(x + 1.2, y); ctx.arc(x, y, 1.2, 0, TAU); } ctx.fill();
    ctx.restore();
  }

  // A hawksbill turtle: an amber and brown tortoiseshell, a narrow head with a hooked beak like a hawk's, and long flippers.
  const HAWK_SHELL = "M 34 -2 C 30 -16 10 -24 -12 -22 C -30 -20 -42 -10 -46 2 L -40 3 L -42 6 L -34 6 C -24 9 -12 9 0 9 C 14 9 28 6 34 -2 Z";
  const HAWK_PLASTRON = "M 30 2 C 14 10 -16 12 -38 5 C -18 13 14 12 30 2 Z";
  const HAWK_HEAD = "M 30 -6 C 36 -12 46 -12 52 -8 C 56 -6 58 -3 56 0 L 50 2 C 44 4 36 4 30 2 Z";
  const HAWK_BEAK = "M 53 -7 C 59 -6 60 -1 57 1.5 L 53 0 Z";
  const HAWK_FRONT = "M 0 0 C 8 6 6 22 -10 34 C -14 36 -16 32 -12 26 C -6 18 -4 8 -6 2 Z";
  const HAWK_HIND = "M 0 0 C -2 6 -8 10 -14 10 C -10 6 -6 2 -4 -1 Z";
  function drawHawksbill(f) {
    const s = f.s, stroke = Math.sin(f.ph * 1.6);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(Math.sin(f.ph * 0.8) * 0.04);
    const skin = sh("#6a4a2a"), yellow = sh("#e8b048"), shell = sh("#b8783a"), dark = sh("#4a2a14");
    ctx.save(); ctx.translate(14, 2); ctx.rotate(-0.3 + stroke * 0.5); fillWith(P(HAWK_FRONT), dark); ctx.restore();
    ctx.save(); ctx.translate(-36, 3); ctx.rotate(0.2 - stroke * 0.25); fillWith(P(HAWK_HIND), dark); ctx.restore();
    fillWith(P(HAWK_HEAD), skin);
    ctx.save(); ctx.clip(P(HAWK_HEAD));
    ctx.fillStyle = sh("#7a5634"); ctx.fill(P("M 38 -11 L 46 -12 L 50 -7 L 44 -4 L 38 -6 Z"));
    ctx.strokeStyle = yellow; ctx.lineWidth = 0.8; ctx.lineJoin = "round";
    ctx.stroke(P("M 32 -8 L 38 -6 L 38 -11 M 38 -6 L 44 -4 L 50 -7 L 46 -12 L 38 -11 M 44 -4 L 43 2 M 50 -7 L 54 -4 M 36 -1 L 38 -6 M 36 -1 L 43 2 L 50 1"));
    ctx.restore();
    fillWith(P(HAWK_BEAK), sh("#3a2a1a"));
    eye(47, -8.5, 1.6, "#101010");
    fillWith(P(HAWK_PLASTRON), sh("#e8d8a0"));
    fillWith(P(HAWK_SHELL), shell);
    ctx.save(); ctx.clip(P(HAWK_SHELL));
    // tortoiseshell: dark flames and golden flecks on amber
    ctx.fillStyle = dark;
    for (const [x, y, w, h, a] of [[18, -12, 7, 3, 0.6], [4, -16, 8, 3, 0.4], [-12, -14, 7, 3, 0.7], [-26, -8, 6, 2.6, 0.5], [10, -4, 6, 2.4, 0.3], [-6, -4, 7, 2.6, 0.6], [-34, -2, 5, 2, 0.4]]) { ctx.beginPath(); ctx.ellipse(x, y, w, h, a, 0, TAU); ctx.fill(); }
    ctx.fillStyle = yellow;
    for (const [x, y] of [[24, -6], [12, -18], [-2, -10], [-18, -18], [-20, -2], [2, 2]]) { ctx.beginPath(); ctx.arc(x, y, 1.8, 0, TAU); ctx.fill(); }
    // the overlapping plates
    ctx.strokeStyle = sh("#3a2410"); ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (const x of [24, 8, -8, -24]) { ctx.moveTo(x, -24); ctx.quadraticCurveTo(x - 7, -12, x - 3, 2); }
    ctx.moveTo(32, -9); ctx.quadraticCurveTo(-6, -15, -44, -2);
    ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.translate(20, 4); ctx.rotate(-0.1 + stroke * 0.6); fillWith(P(HAWK_FRONT), skin); ctx.strokeStyle = yellow; ctx.lineWidth = 0.9; ctx.stroke(P(HAWK_FRONT)); ctx.restore();
    ctx.restore();
  }

  // A horseshoe crab: a living fossil with a domed shell, a spiny hind part and a long tail spike. It ploughs over the sand.
  const HSC_PRO = "M 50 0 C 50 -12 36 -22 16 -22 C 4 -22 -4 -18 -6 -12 L -6 0 Z";
  const HSC_OPI = "M -4 -12 C -12 -14 -24 -12 -34 -6 L -36 0 L -4 0 Z";
  const HSC_TELSON = "M 0 -2 L -56 -6 L -56 -4 L 0 2 Z";
  function drawHorseshoe(f) {
    const s = f.s;
    if (Math.random() < 0.01 * frameK && f.cy !== undefined && f.dir) puff(f.x - f.dir * s * 0.2, f.cy, 1);
    ctx.save(); ctx.translate(f.x, f.cy - s * 0.04); ctx.scale(faceOf(f) * s / 100, s / 100);
    const shell = sh("#7a6a3a"), dark = sh("#4a3e22"), hi = sh("#a8946a");
    ctx.strokeStyle = dark; ctx.lineWidth = 2; ctx.lineCap = "round";
    ctx.beginPath(); for (let i = 0; i < 5; i++) { const a = Math.sin(f.ph * 4 + i * 1.3); ctx.moveTo(30 - i * 8, -2); ctx.lineTo(28 - i * 8 + a * 3, 3); } ctx.stroke();
    ctx.save(); ctx.translate(-34, -3); ctx.rotate(-0.06 + Math.sin(f.ph * 0.7) * 0.05); fillWith(P(HSC_TELSON), dark); ctx.restore();
    fillWith(P(HSC_OPI), shell);
    ctx.fillStyle = dark;
    for (let i = 0; i < 5; i++) { const x = -8 - i * 5.5, y = -11.6 + i * 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 1.5, y - 4); ctx.lineTo(x - 3, y + 0.4); ctx.fill(); }
    fillWith(P(HSC_PRO), shell);
    paintInside(P(HSC_PRO), hi, P("M -10 -30 L 60 -30 L 60 -17 C 40 -15 10 -14 -10 -12 Z"));
    ctx.strokeStyle = dark; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(46, -5); ctx.quadraticCurveTo(30, -12, -4, -11); ctx.stroke();
    ctx.fillStyle = "#181410"; ctx.beginPath(); ctx.ellipse(24, -17, 3, 1.8, -0.2, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // A dugong: a sea cow with a whale's tail, grazing on seagrass with its broad, downturned snout.
  const DUG_BODY = "M 46 4 C 46 -4 40 -12 26 -14 C 8 -16 -16 -13 -34 -6 C -40 -4 -44 -2 -46 0 C -44 2 -40 4 -34 6 C -16 12 8 14 26 13 C 36 12 44 10 46 4 Z";
  const DUG_SNOUT = "M 40 -4 C 46 -4 52 0 52 6 C 52 10 48 12 44 11 C 42 8 40 6 38 4 Z";
  const DUG_FLUKE = "M 2 -2 C -6 -3 -14 -5 -22 -9 L -25 -7 C -19 -2 -19 2 -25 7 L -22 9 C -14 5 -6 3 2 2 Z";
  const DUG_FLIP = "M 0 0 C -2 6 -6 10 -10 11 C -8 6 -5 2 -3 -1 Z";
  function drawDugong(f) {
    const s = f.s, sw = Math.sin(f.ph * 1.5);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(0.06 + Math.sin(f.ph * 0.6) * 0.03);
    const skin = sh("#8a7a6e"), pale = sh("#b8aca0"), dark = sh("#6a5c52");
    ctx.save(); ctx.translate(-46, 0); ctx.rotate(sw * 0.2); fillWith(P(DUG_FLUKE), dark); ctx.restore();
    fillWith(P(DUG_BODY), skin);
    paintInside(P(DUG_BODY), pale, P("M -60 4 C -20 10 20 12 60 6 L 60 20 L -60 20 Z"));
    fillWith(P(DUG_SNOUT), pale);
    ctx.fillStyle = dark; for (const [x, y] of [[46, 4], [48, 7], [44, 8], [50, 4]]) { ctx.beginPath(); ctx.arc(x, y, 0.8, 0, TAU); ctx.fill(); }
    ctx.save(); ctx.translate(24, 8); ctx.rotate(0.3 + sw * 0.3); fillWith(P(DUG_FLIP), dark); ctx.restore();
    eye(36, -5, 1.3, "#141210");
    ctx.restore();
  }

  // ---- the mangrove ----------------------------------------------------------------
  // A mudskipper: a goby that hops over the mud on its fins. Now and then it raises a flag of a dorsal fin.
  const MUD_FLAG = "M 18 -12 C 16 -36 -2 -40 -6 -12 Z";
  function drawMudskipper(f) {
    const s = f.s, flag = !f.hop && Math.sin(f.ph * 0.5) > 0.55;
    ctx.save(); ctx.translate(f.x, f.cy - s * 0.12); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(f.hop ? -0.25 : -0.1);
    if (flag) {
      fillWith(P(MUD_FLAG), sh("#5a7a9a"));
      ctx.strokeStyle = sh("#e05a3a"); ctx.lineWidth = 1.6; ctx.stroke(P(MUD_FLAG));
      ctx.fillStyle = sh("#7ad8f8"); for (const [x, y] of [[8, -20], [2, -26], [10, -30], [4, -16]]) { ctx.beginPath(); ctx.arc(x, y, 1.4, 0, TAU); ctx.fill(); }
    }
    drawGobyShape(sh("#8a7a5a"), sh("#5a4a32"), sh("#5ac0e8"), f.ph * (f.hop ? 3 : 1));
    ctx.restore();
  }
  function moveMudskipper(f, F, k) {
    f.ph += 0.05 * k;
    const dt = k / 60, edge = 40 * u;
    if (f.hop === undefined) { f.hop = 0; f.wait = rnd6(0.5, 3); }
    if (f.hop > 0) {
      f.hop += dt / 0.55;
      f.x += f.dir * 1.6 * u * k;
      if (f.hop >= 1) { f.hop = 0; f.wait = rnd6(0.8, 3.5); puff(f.x, sandY(f.x) + 4 * u, 2); }
    } else {
      const scared = near(f.x, sandY(f.x), 110 * u) > 0;
      if ((f.wait -= dt) <= 0 || scared) {
        f.hop = 0.001;
        if (scared) f.dir = Math.sign(f.x - diver.x) || 1;
        else if (Math.random() < 0.12) f.dir *= -1;
        if (f.x < scene.floorL + edge) f.dir = 1;
        if (f.x > scene.floorR - edge) f.dir = -1;
      }
    }
    f.cy = sandY(f.x) + 4 * u - (f.hop > 0 ? Math.sin(f.hop * Math.PI) * 18 * u : 0);
  }

  // ---- the North Sea ---------------------------------------------------------------
  // A puffin: black and white, with a big striped bill. It floats, then "flies" under water after small fish
  // and comes back up with a row of them hanging from its bill.
  const PUF_BODY = "M -36 -2 C -34 -14 -16 -22 4 -22 C 14 -22 20 -26 24 -32 C 28 -38 38 -40 44 -36 C 48 -33 48 -26 44 -22 C 40 -18 36 -14 34 -8 C 30 2 10 6 -14 5 C -28 4 -38 3 -36 -2 Z";
  const PUF_FACE = "M 30 -30 C 32 -38 42 -40 46 -35 C 47 -30 45 -26 40 -24 C 35 -24 31 -26 30 -30 Z";
  const PUF_BILL = "M 0 -5 C 8 -3 12 3 10 8 C 6 8 2 7 -1 6 Z";
  function puffinBill(x, y, rot, fish, ph) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    fillWith(P(PUF_BILL), sh("#f0602a"));
    paintInside(P(PUF_BILL), sh("#56647a"), P("M -4 -8 L 3.5 -8 L 3.5 10 L -4 10 Z"));
    ctx.strokeStyle = sh("#f2c040"); ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(3.8, -4); ctx.lineTo(3.8, 7); ctx.stroke();
    if (fish) {
      // a row of little silver fish, hanging crosswise from the bill
      ctx.strokeStyle = "#d8e2ea"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
      ctx.beginPath(); for (let i = 0; i < 3; i++) { const fx = 2 + i * 3; ctx.moveTo(fx, 3); ctx.lineTo(fx + Math.sin(ph * 3 + i) * 2, 13); } ctx.stroke();
    }
    ctx.restore();
  }
  function drawPuffin(f) {
    const s = f.s, under = f.under || 0;
    if (under > 0.6 && f.diveDir < 0 && !(f.fishUntil > f.ph)) f.fishUntil = f.ph + 25;
    const fish = f.fishUntil > f.ph;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const black = sh("#1a1c20"), white = sh("#f2f0ea"), orange = sh("#f0602a");
    if (under < 0.12) {
      ctx.save(); ctx.translate(-4, 3); ctx.rotate(Math.sin(f.ph * 2) * 0.5); fillUnder(P("M -3 0 L 3 0 L 6 10 L -6 10 Z"), orange); ctx.restore();
      fillWith(P(PUF_BODY), black);
      paintInside(P(PUF_BODY), white, P("M 20 -22 C 30 -20 40 -10 40 0 L 40 10 L 4 10 C 12 0 16 -10 20 -22 Z"));
      fillWith(P(PUF_FACE), white);
      puffinBill(45, -31, 0, fish, f.ph);
      eye(39.5, -32, 1.8, "#101010");
      ctx.strokeStyle = sh("#e05040"); ctx.lineWidth = 0.9; ctx.beginPath(); ctx.arc(39.5, -32, 2.6, 0, TAU); ctx.stroke();
      underVeil(P(PUF_BODY));
      ripple(-34, 30, f.ph);
    } else {
      // under water it "flies" with its short wings
      ctx.rotate((f.diveDir || 0) * 0.45 + Math.sin(f.ph) * 0.08);
      ctx.fillStyle = orange; ctx.beginPath(); ctx.moveTo(-38, 0); ctx.lineTo(-50, -4 + Math.sin(f.ph * 6) * 3); ctx.lineTo(-50, 5 + Math.sin(f.ph * 6) * 3); ctx.fill();
      ctx.fillStyle = black; ctx.beginPath(); ctx.ellipse(0, 0, 40, 13, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = white; ctx.beginPath(); ctx.ellipse(4, 5, 32, 7, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = black; ctx.beginPath(); ctx.arc(36, -3, 11, 0, TAU); ctx.fill();
      ctx.fillStyle = white; ctx.beginPath(); ctx.ellipse(38, -3, 7, 6, 0, 0, TAU); ctx.fill();
      puffinBill(46, -3, 0, fish, f.ph);
      eye(39, -4, 1.6, "#101010");
      ctx.save(); ctx.translate(8, -5); ctx.rotate(-0.3 + Math.sin(f.ph * 9) * 0.7); ctx.fillStyle = black; ctx.beginPath(); ctx.ellipse(-12, 0, 16, 4.5, 0, 0, TAU); ctx.fill(); ctx.restore();
      if (Math.random() < 0.06) bubbles.push({ x: f.x, y: f.cy - s * 0.1, r: (1 + Math.random()) * u, ph: Math.random() * TAU });
    }
    ctx.restore();
  }

  // A northern gannet: from high above it dives into the sea like an arrow, wings folded back, with a splash
  // and a trail of bubbles. Then it bobs on the water for a while and flies off again.
  const GAN_ARROW = "M 46 0 C 38 -4 20 -6 0 -6 C -20 -6 -38 -3 -50 0 C -38 3 -20 6 0 6 C 20 6 38 4 46 0 Z";
  const GAN_BODY = "M -46 -8 C -40 -18 -12 -22 12 -20 C 22 -20 26 -26 28 -32 C 31 -40 40 -42 46 -38 C 50 -35 50 -29 46 -26 C 42 -22 38 -16 36 -8 C 30 2 0 6 -30 4 C -42 3 -50 -2 -46 -8 Z";
  const GAN_FOLD = "M 30 -16 C 10 -24 -20 -20 -46 -10 C -54 -7 -62 -8 -68 -10 C -56 -3 -40 -1 -20 -5 C 0 -9 18 -11 30 -16 Z";
  const GAN_WING = "M 0 0 C 20 -7 50 -11 86 -7 C 50 -2 20 2 0 5 Z";
  const GAN_TIPS = "M 56 -20 L 100 -20 L 100 10 L 56 10 Z";
  function gannetHead(x, y, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.fillStyle = sh("#f2f2ec"); ctx.beginPath(); ctx.ellipse(0, 0, 9, 7, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#f0d890"); ctx.beginPath(); ctx.ellipse(-1, -2, 8, 5, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#a8b4c4"); ctx.beginPath(); ctx.moveTo(6, -2); ctx.lineTo(24, 1); ctx.lineTo(6, 3); ctx.fill();
    ctx.strokeStyle = "#1a1a1a"; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(2, -1); ctx.lineTo(8, 0.5); ctx.stroke();
    ctx.fillStyle = sh("#c8e0f0"); ctx.beginPath(); ctx.arc(2, -1.5, 1.8, 0, TAU); ctx.fill();
    eye(2.2, -1.5, 1, "#101010");
    ctx.restore();
  }
  function drawGannet(f) {
    const st = f.st || "float";
    if (st === "wait" || f.cy === undefined) return;
    const s = f.s, white = sh("#f2f2ec"), black = sh("#1e1e22");
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    if (st === "plunge" || st === "swim") {
      // wings folded back: a white arrow with black tips
      ctx.rotate(Math.atan2(f.vy || 0, Math.abs(f.vx || 1)));
      ctx.fillStyle = black; ctx.beginPath(); ctx.moveTo(-40, -3); ctx.lineTo(-62, -1); ctx.lineTo(-40, 4); ctx.fill();
      fillWith(P(GAN_ARROW), white);
      ctx.fillStyle = sh("#2a2a2e"); ctx.beginPath(); ctx.moveTo(-50, 0); ctx.lineTo(-58, -4); ctx.lineTo(-58, 4); ctx.fill();
      gannetHead(44, 0, 0);
    } else if (st === "fly") {
      const flap = Math.sin(f.ph * 7);
      ctx.rotate(-0.3);
      ctx.save(); ctx.translate(4, -4); ctx.rotate(Math.PI + 0.4 + flap * 0.6); ctx.scale(1, -1); fillWith(P(GAN_WING), white); paintInside(P(GAN_WING), black, P(GAN_TIPS)); ctx.restore();
      fillWith(P(GAN_ARROW), white);
      ctx.fillStyle = white; ctx.beginPath(); ctx.moveTo(-48, 0); ctx.lineTo(-62, -5); ctx.lineTo(-60, 5); ctx.fill();
      gannetHead(44, 0, 0);
      ctx.save(); ctx.translate(4, -4); ctx.rotate(Math.PI - 0.4 - flap * 0.6); ctx.scale(1, -1); fillWith(P(GAN_WING), white); paintInside(P(GAN_WING), black, P(GAN_TIPS)); ctx.restore();
    } else {
      fillWith(P(GAN_BODY), white);
      fillWith(P(GAN_FOLD), white);
      paintInside(P(GAN_FOLD), black, P("M -80 -30 L -42 -30 L -42 10 L -80 10 Z"));
      gannetHead(40, -34, 0);
      underVeil(P(GAN_BODY));
      ripple(-44, 34, f.ph);
    }
    ctx.restore();
  }
  function moveGannet(f, F, k) {
    f.ph += 0.05 * k;
    const dt = k / 60;
    if (!f.st) { f.st = "float"; f.tm = rnd6(4, 14); }
    if (f.st === "wait") {
      f.cy = undefined;
      if ((f.tm -= dt) <= 0) {
        f.st = "plunge"; f.x = W * rnd6(0.15, 0.85); f.y = -40 * u; f.vx = f.dir * 1.4 * u; f.vy = 7 * u; f.wet = false;
      }
    } else if (f.st === "plunge" || f.st === "swim") {
      f.x += f.vx * k; f.y += f.vy * k;
      const top = waveY(f.x);
      if (!f.wet && f.y > top) {
        f.wet = true; splash(f.x); splash(f.x + f.dir * 6 * u); sfxSplash(0.6);
        for (let i = 0; i < 14; i++) bubbles.push({ x: f.x + (Math.random() - 0.5) * 14 * u, y: top + Math.random() * 30 * u, r: (1 + Math.random() * 2.5) * u, ph: Math.random() * TAU });
      }
      if (f.wet) {
        if (Math.random() < 0.3 * k) bubbles.push({ x: f.x - f.vx * 4, y: f.y - f.vy * 4, r: (0.8 + Math.random() * 1.5) * u, ph: Math.random() * TAU });
        if (f.st === "plunge") { f.vy *= Math.pow(0.93, k); f.vx *= Math.pow(0.96, k); if (f.vy < 0.4 * u) f.st = "swim"; }
        else {
          f.vy = Math.max(-1.3 * u, f.vy - 0.05 * u * k); f.vx *= Math.pow(0.99, k);
          if (f.y <= top) { f.st = "float"; f.tm = rnd6(8, 16); }
        }
      }
      f.cy = f.y;
    } else if (f.st === "float") {
      f.x += f.dir * 0.12 * u * k;
      if (f.x < 30 * u) f.dir = 1;
      if (f.x > W - 30 * u) f.dir = -1;
      f.cy = f.y = waveY(f.x);
      if ((f.tm -= dt) <= 0) { f.st = "fly"; f.vx = f.dir * 0.6 * u; f.vy = 0; }
    } else if (f.st === "fly") {
      f.vx += (f.dir * 2.6 * u - f.vx) * 0.03 * k;
      f.vy = Math.max(-1.4 * u, f.vy - 0.025 * u * k);
      f.x += f.vx * k; f.y += f.vy * k;
      if (Math.random() < 0.2 * k && f.y > waveY(f.x) - 6 * u) ripples.push({ x: f.x, r: 1, a: 0.5 });
      f.cy = f.y;
      if (f.y < -50 * u) { f.st = "wait"; f.tm = rnd6(10, 26); }
    }
  }

  // A harbour porpoise: the small, shy whale of the North Sea. A round head without a beak, a low triangular fin,
  // and it swims off quickly when the diver comes near.
  const POR_BODY = "M 50 2 C 50 -5 44 -10 34 -12 C 18 -15 -10 -13 -30 -6 C -38 -3 -44 -1 -46 0 C -44 2 -38 4 -30 6 C -10 12 18 14 34 12 C 44 10 50 7 50 2 Z";
  const POR_DORSAL = "M 4 -14 C 0 -18 -4 -22 -8 -25 C -9 -20 -10 -16 -13 -12.5 Z";
  const POR_FLUKE = "M 2 0 C -4 -4 -10 -8 -16 -11 C -13 -5 -13 5 -16 11 C -10 8 -4 4 2 0 Z";
  const POR_FLIP = "M 0 0 C -3 5 -8 9 -12 10 C -9 5 -5 2 0 -1 Z";
  function drawPorpoise(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(Math.sin(f.ph) * 0.04);
    const back = sh("#3e464e"), belly = sh("#d8dcde");
    ctx.save(); ctx.translate(-44, 0); ctx.rotate(Math.sin(f.ph * 2.5) * 0.18); fillWith(P(POR_FLUKE), back); ctx.restore();
    fillWith(P(POR_DORSAL), back);
    fillWith(P(POR_BODY), back);
    paintInside(P(POR_BODY), belly, P("M 60 2 C 30 0 0 2 -40 3 L -40 20 L 60 20 Z"));
    ctx.save(); ctx.translate(28, 6); ctx.rotate(0.3 + Math.sin(f.ph * 2) * 0.15); fillWith(P(POR_FLIP), back); ctx.restore();
    ctx.strokeStyle = "rgba(0,0,0,0.35)"; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(50, 3); ctx.quadraticCurveTo(46, 5, 42, 4); ctx.stroke();
    eye(40, -1, 1.5, "#0c0e10");
    ctx.restore();
  }
  function shyPorpoise(f, F, k) {
    if (near(f.x, f.cy || 0, 170 * u) > 0) { f.tx = Math.max(30 * u, Math.min(W - 30 * u, f.x + Math.sign(f.x - diver.x || 1) * 300 * u)); f.vx = (f.vx || 0) * 1.03; }
  }

  // Plaice lie buried in the sand with only their eyes showing. Now and then, or when the diver comes close,
  // one shakes off the sand, glides a little way and settles again in a puff of sand.
  const FLAT_BODY = "M 46 0 C 44 -18 26 -30 0 -30 C -22 -30 -36 -18 -40 0 C -36 18 -22 30 0 30 C 26 30 44 18 46 0 Z";
  const FLAT_EDGE = "M 52 0 C 50 -22 28 -36 0 -36 C -26 -36 -46 -22 -58 0 C -46 22 -26 36 0 36 C 28 36 50 22 52 0 Z";
  const FLAT_TAIL = "M 0 -5 L -16 -13 C -12 -4 -12 4 -16 13 L 0 5 Z";
  function drawFlatfish(f) {
    const s = f.s, b = f.bury || 0, swim = f.go > 0;
    sandShadow(f, s * 0.45);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100 * 0.42);
    const body = sh("#8a7050"), fin = sh("#a08868"), spot = sh("#e8783a");
    ctx.save(); ctx.translate(-40, 0); ctx.rotate(Math.sin(f.ph * 3) * (swim ? 0.3 : 0.05)); fillWith(P(FLAT_TAIL), fin); ctx.restore();
    ctx.save(); ctx.scale(1.1, 1.12 + Math.sin(f.ph * 3) * (swim ? 0.06 : 0.01)); ctx.globalAlpha *= 0.85; fillWith(P(FLAT_BODY), fin); ctx.restore();
    fillWith(P(FLAT_BODY), body);
    ctx.save(); ctx.clip(P(FLAT_BODY)); ctx.fillStyle = spot;
    ctx.beginPath(); for (const [x, y, r] of [[24, -14, 4], [6, -20, 4.5], [-14, -12, 4], [14, 8, 4.5], [-6, 16, 4], [-26, 2, 3.5], [30, 10, 3], [-2, -2, 3.5]]) { ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.9, 0, 0, TAU); } ctx.fill();
    ctx.restore();
    if (b > 0.02) {
      // a layer of sand over the body
      ctx.save(); ctx.clip(P(FLAT_EDGE)); ctx.globalAlpha *= b * 0.9; ctx.fillStyle = water.sand[0]; ctx.fillRect(-70, -40, 130, 80);
      ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.beginPath(); for (let i = 0; i < 14; i++) { const x = -44 + (i * 37) % 90, y = -26 + (i * 23) % 52; ctx.moveTo(x + 2.5, y); ctx.arc(x, y, 2.5, 0, TAU); } ctx.fill();
      ctx.restore();
    }
    // the two eyes sit together on the upper side and always peek out
    for (const [x, y] of [[32, -10], [36, 3]]) {
      ctx.fillStyle = sh("#c8b890"); ctx.beginPath(); ctx.ellipse(x, y - 3, 4, 7, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.ellipse(x + 1, y - 4, 2, 4, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function moveFlatfish(f, F, k) {
    f.ph += 0.05 * k;
    const dt = k / 60;
    if (f.bury === undefined) { f.bury = 1; f.lift = 0; f.go = 0; f.rest = rnd6(8, 20); }
    if (f.go > 0) {
      f.go -= dt; f.x += f.dir * 1.1 * u * k * Math.min(1, f.go + 0.3);
      f.lift += (14 * u - f.lift) * 0.06 * k; f.bury = Math.max(0, f.bury - 0.08 * k);
      if (f.x < scene.floorL + 40 * u) f.dir = 1;
      if (f.x > scene.floorR - 40 * u) f.dir = -1;
      if (f.go <= 0) { f.go = 0; f.settle = true; }
    } else {
      f.lift = Math.max(0, f.lift - 0.4 * u * k);
      if (f.settle && f.lift === 0) { f.settle = false; puff(f.x, sandY(f.x) + 4 * u, 6); }
      if (f.lift === 0) f.bury = Math.min(1, f.bury + 0.008 * k);
      f.rest -= dt;
      const scared = near(f.x, sandY(f.x), 90 * u) > 0;
      if ((scared && f.bury > 0.3) || f.rest <= 0) {
        f.go = rnd6(1.8, 3.2); f.rest = rnd6(12, 28);
        if (scared) f.dir = Math.sign(f.x - diver.x) || 1;
        puff(f.x, sandY(f.x) + 4 * u, 5);
      }
    }
    f.cy = sandY(f.x) + 3 * u - f.lift;
  }

  // An Atlantic cod: olive and mottled, with three dorsal fins, two anal fins, a pale line along its side and a chin barbel.
  const COD_BODY = "M 50 2 C 48 -6 40 -11 26 -12 C 8 -13 -18 -10 -36 -5 C -40 -4 -42 -2 -42 0 C -42 2 -40 4 -36 5 C -18 9 8 12 26 11 C 40 10 48 8 50 2 Z";
  const COD_FINS = ["M 23 -11.5 L 19 -22 C 16 -23 12 -21 8 -12 Z", "M 4 -12 L -1 -21 C -5 -22 -10 -19 -14 -10.5 Z", "M -17 -9.8 L -22 -17 C -26 -17 -30 -13 -33 -6.5 Z", "M 2 11.6 L -3 19 C -7 19 -11 16 -14 10.5 Z", "M -17 9.6 L -22 16 C -26 16 -30 12 -33 6.5 Z"];
  const COD_TAIL = "M 2 -5 L -14 -13 C -11 -5 -11 5 -14 13 L 2 5 Z";
  function drawCod(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const body = sh("#8a8458"), fin = sh("#6e6a44"), mottle = sh("#5e5a38"), belly = sh("#e8e2cc");
    ctx.save(); ctx.translate(-42, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.22); fillWith(P(COD_TAIL), fin); ctx.restore();
    for (const p of COD_FINS) fillWith(P(p), fin);
    fillWith(P(COD_BODY), body);
    ctx.save(); ctx.clip(P(COD_BODY));
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(4, 11, 46, 7, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = mottle;
    ctx.fill(P("M 32 -7 A 2 2 0 1 0 28 -7 A 2 2 0 1 0 32 -7 M 22.4 -9 A 2.4 2.4 0 1 0 17.6 -9 A 2.4 2.4 0 1 0 22.4 -9 M 12 -6 A 2 2 0 1 0 8 -6 A 2 2 0 1 0 12 -6 M 2.4 -9 A 2.4 2.4 0 1 0 -2.4 -9 A 2.4 2.4 0 1 0 2.4 -9 M -8 -6 A 2 2 0 1 0 -12 -6 A 2 2 0 1 0 -8 -6 M -18 -7 A 2 2 0 1 0 -22 -7 A 2 2 0 1 0 -18 -7 M -28.4 -3 A 1.6 1.6 0 1 0 -31.6 -3 A 1.6 1.6 0 1 0 -28.4 -3 M 17.6 -2 A 1.6 1.6 0 1 0 14.4 -2 A 1.6 1.6 0 1 0 17.6 -2 M -2.4 -2 A 1.6 1.6 0 1 0 -5.6 -2 A 1.6 1.6 0 1 0 -2.4 -2 M 27.4 1 A 1.4 1.4 0 1 0 24.6 1 A 1.4 1.4 0 1 0 27.4 1 Z"));
    ctx.strokeStyle = sh("#f0ead0"); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(30, -6); ctx.quadraticCurveTo(0, -9, -40, -1); ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.translate(26, 2); ctx.rotate(0.4 + Math.sin(f.ph * 4) * 0.3); ctx.fillStyle = fin; ctx.beginPath(); ctx.ellipse(-5, 0, 7, 3, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(32, -9); ctx.quadraticCurveTo(28, 0, 32, 9); ctx.stroke();
    ctx.strokeStyle = fin; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(44, 7); ctx.quadraticCurveTo(45, 11, 43 + Math.sin(f.ph * 2), 14); ctx.stroke();
    ctx.fillStyle = sh("#d8c890"); ctx.beginPath(); ctx.arc(40, -4, 3.2, 0, TAU); ctx.fill();
    eye(40.6, -4, 1.9, "#101010");
    ctx.restore();
  }

  // An Atlantic wolffish: a long grey-blue body with dark bands, a huge blunt head, and big crushing teeth
  // that stick out of its mouth. It rests on the bottom with its head up.
  const WOLF_BODY = "M 50 -6 C 50 -16 42 -22 28 -22 C 14 -22 2 -17 -12 -13 C -28 -9 -42 -7 -52 -5 L -52 0 L 44 0 C 48 -1 50 -3 50 -6 Z";
  const WOLF_DORSAL = "M 22 -21 C 4 -27 -22 -19 -52 -9 L -52 -5 C -24 -13 2 -19 22 -18 Z";
  const WOLF_TAIL = "M 0 -6 C -6 -10 -12 -8 -12 -3 C -12 0 -6 1 0 0 Z";
  function drawWolffish(f) {
    const s = f.s, gape = Math.max(0, Math.sin(f.ph * 0.4)) * 3;
    ctx.save(); ctx.translate(f.x, f.cy - s * 0.02); ctx.scale(faceOf(f) * s / 100, s / 100);
    const skin = sh("#6a7480"), band = sh("#3a424c"), fin = sh("#5a646e");
    ctx.save(); ctx.translate(-52, -2); ctx.rotate(Math.sin(f.ph * 1.5) * 0.15); fillWith(P(WOLF_TAIL), fin); ctx.restore();
    fillWith(P(WOLF_DORSAL), fin);
    fillWith(P(WOLF_BODY), skin);
    ctx.save(); ctx.clip(P(WOLF_BODY)); ctx.fillStyle = band;
    for (let i = 0; i < 8; i++) { const x = 18 - i * 9; ctx.beginPath(); ctx.moveTo(x, -26); ctx.lineTo(x - 4, -26); ctx.lineTo(x - 7, 2); ctx.lineTo(x - 3, 2); ctx.fill(); }
    ctx.fillStyle = sh("#9aa2aa"); ctx.beginPath(); ctx.ellipse(30, -1, 20, 4, 0, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.fillStyle = sh("#4a525c"); ctx.beginPath(); ctx.moveTo(50, -7); ctx.quadraticCurveTo(46, -3 + gape, 38, -3 + gape * 0.5); ctx.lineTo(38, -5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh("#f2ead8");
    for (const [x, y, d] of [[49, -7, 1], [46, -6.5, 1], [48, -4 + gape, -1], [45, -3.8 + gape, -1]]) { ctx.beginPath(); ctx.moveTo(x - 1.2, y); ctx.lineTo(x + 0.6, y + d * 3.4); ctx.lineTo(x + 1.6, y); ctx.fill(); }
    ctx.save(); ctx.translate(26, -4); ctx.rotate(0.6 + Math.sin(f.ph) * 0.1); ctx.fillStyle = fin; ctx.beginPath(); ctx.ellipse(-6, 0, 9, 4, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = sh("#c8c0a0"); ctx.beginPath(); ctx.arc(39, -14, 3.4, 0, TAU); ctx.fill();
    eye(39.6, -14, 2, "#101010");
    ctx.restore();
  }

  // A school of herring: dozens of silver fish with blue-green backs, flashing as they turn.
  const HERRING = Array.from({ length: 18 }, (_, i) => [((i * 37) % 19) / 9.5 - 1, ((i * 53) % 17) / 8.5 - 1, i * 1.7]);
  function drawHerring(x, y, dir, L, ph) {
    for (const [ox, oy, p] of HERRING) {
      const fx = x + dir * ox * L * 2.2 + Math.sin(ph * 1.3 + p) * L * 0.08, fy = y + oy * L * 0.8 + Math.cos(ph + p) * L * 0.06, l = L * (0.8 + (p % 1) * 0.4);
      ctx.save(); ctx.translate(fx, fy); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph * 0.9 + p * 2) * 0.18);
      ctx.fillStyle = sh("#2e5a6a");
      // a deeply forked tail
      ctx.save(); ctx.translate(-l * 0.4, 0); ctx.rotate(Math.sin(ph * 5 + p) * 0.25);
      ctx.beginPath(); ctx.moveTo(l * 0.03, 0); ctx.lineTo(-l * 0.16, -l * 0.15); ctx.lineTo(-l * 0.08, 0); ctx.lineTo(-l * 0.16, l * 0.15); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.fillStyle = sh("#c8d6de"); ctx.beginPath(); ctx.moveTo(l * 0.46, 0); ctx.bezierCurveTo(l * 0.35, -l * 0.15, -l * 0.2, -l * 0.13, -l * 0.42, 0); ctx.bezierCurveTo(-l * 0.2, l * 0.12, l * 0.35, l * 0.13, l * 0.46, 0); ctx.fill();
      ctx.fillStyle = sh("#2e5a6a"); ctx.beginPath(); ctx.moveTo(l * 0.44, -l * 0.02); ctx.bezierCurveTo(l * 0.3, -l * 0.13, -l * 0.2, -l * 0.12, -l * 0.4, -l * 0.01); ctx.bezierCurveTo(-l * 0.1, -l * 0.06, l * 0.3, -l * 0.06, l * 0.44, -l * 0.02); ctx.fill();
      ctx.beginPath(); ctx.moveTo(l * 0.02, -l * 0.1); ctx.lineTo(-l * 0.06, -l * 0.2); ctx.lineTo(-l * 0.1, -l * 0.09); ctx.fill();
      const flash = Math.sin(ph * 2 + p * 3);
      if (flash > 0.75) { ctx.fillStyle = `rgba(255,255,255,${((flash - 0.75) * 2.6).toFixed(2)})`; ctx.beginPath(); ctx.ellipse(0, l * 0.02, l * 0.3, l * 0.05, 0, 0, TAU); ctx.fill(); }
      eye(l * 0.34, -l * 0.01, l * 0.028, "#101010");
      ctx.restore();
    }
  }

  // ---- the kelp forest ------------------------------------------------------------
  // A garibaldi: a bright orange damselfish, the colour of a goldfish, with rounded fins.
  const GAR_BODY = "M 44 2 C 42 -10 30 -20 10 -22 C -10 -23 -26 -14 -32 -4 L -32 4 C -26 14 -10 22 10 20 C 30 18 42 10 44 2 Z";
  const GAR_DORSAL = "M 26 -18 C 10 -30 -24 -28 -38 -6 L -30 -5 C -22 -16 0 -22 26 -18 Z";
  const GAR_ANAL = "M 16 18 C 0 26 -24 24 -38 6 L -30 5 C -20 14 0 18 16 18 Z";
  const GAR_TAIL = "M 2 -4 C -6 -12 -18 -16 -22 -10 C -19 -4 -19 4 -22 10 C -18 16 -6 12 2 4 Z";
  function drawGaribaldi(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const orange = sh("#f2701e"), fin = sh("#e05a14"), light = sh("#f8a050");
    ctx.save(); ctx.translate(-32, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.25); fillWith(P(GAR_TAIL), fin); ctx.restore();
    fillWith(P(GAR_DORSAL), fin); fillWith(P(GAR_ANAL), fin);
    fillWith(P(GAR_BODY), orange);
    // the light falls from above: a deeper orange back, a paler belly
    paintInside(P(GAR_BODY), fin, P("M -40 -30 L 50 -30 L 50 -12 C 30 -9 0 -9 -40 -8 Z"));
    paintInside(P(GAR_BODY), light, P("M -40 8 C 0 6 30 6 50 5 L 50 30 L -40 30 Z"));
    ctx.save(); ctx.translate(16, 4); ctx.rotate(0.4 + Math.sin(f.ph * 4) * 0.35); ctx.fillStyle = fin; ctx.beginPath(); ctx.ellipse(-5, 0, 7, 3.2, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.strokeStyle = fin; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(44, 3); ctx.quadraticCurveTo(40, 6, 36, 5); ctx.stroke();
    // the standard eye: a dark dot with a small light catch
    ctx.fillStyle = "#101418"; ctx.beginPath(); ctx.arc(32.4, -6, 3, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.85)"; ctx.beginPath(); ctx.arc(31.4, -7, 1, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // A leopard shark: slim and bronze-grey, with dark saddles across its back and spots on its sides.
  function drawLeopardShark(f) {
    const s = f.s;
    sandShadow(f, s * 0.35);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f), 0.9); ctx.rotate(Math.sin(f.ph) * 0.02);
    sharkForm(s, sh("#8a8676"), sh("#e8e4d8"), { upper: 0.2 });
    ctx.fillStyle = sh("#2e2a26");
    for (const [x, y] of [[0.32, -0.06], [0.22, -0.066], [0.12, -0.068], [0.02, -0.064], [-0.08, -0.055], [-0.18, -0.043], [-0.28, -0.028]]) { ctx.beginPath(); ctx.ellipse(s * x, s * y, s * 0.02, s * 0.022, 0, 0, TAU); ctx.fill(); }
    for (const [x, y] of [[0.2, -0.015], [0.06, -0.01], [-0.1, -0.005], [-0.22, 0.0]]) { ctx.beginPath(); ctx.arc(s * x, s * y, s * 0.011, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  // ---- the Sargasso Sea -----------------------------------------------------------
  // A Portuguese man o' war: a purple-blue sail of gas that floats on the waves, with long stinging tentacles below.
  const MOW_FLOAT = "M -40 2 C -42 -6 -30 -14 -10 -16 C 10 -18 30 -14 40 -6 C 44 -2 42 2 36 3 Z";
  const MOW_CREST = "M -26 -14 C -20 -30 -6 -34 4 -30 C 14 -36 26 -26 30 -12 Z";
  function drawManowar(f) {
    const s = f.s, tl = f.tl || 320;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(Math.sin(f.ph * 1.3) * 0.06);
    // tentacles first, hanging deep below
    ctx.lineCap = "round";
    for (let i = 0; i < 7; i++) {
      const x0 = -26 + i * 8, len = tl * (0.55 + ((i * 37) % 10) / 22);
      ctx.strokeStyle = sh(i % 2 ? "#5a6ae0" : "#8a5ad8"); ctx.lineWidth = i % 3 ? 1.1 : 1.8; ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.moveTo(x0, 4);
      for (let j = 1; j <= 10; j++) { const fr = j / 10; ctx.lineTo(x0 + Math.sin(f.ph * 1.2 - fr * 5 + i) * 8 * fr, 4 + len * fr); }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // the cluster of polyps under the float
    ctx.fillStyle = sh("#6a5ad8");
    for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse(-24 + i * 6, 6 + (i % 3) * 2, 3.4, 4.6, 0, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 0.85; fillWith(P(MOW_FLOAT), sh("#8a9ae8")); ctx.globalAlpha = 1;
    fillWith(P(MOW_CREST), sh("#b8a8f0"));
    ctx.strokeStyle = sh("#e87ab0"); ctx.lineWidth = 1.6; ctx.stroke(P(MOW_CREST));
    ctx.strokeStyle = sh("#d8c8f8"); ctx.lineWidth = 0.8; ctx.beginPath(); for (let i = 0; i < 5; i++) { ctx.moveTo(-18 + i * 9, -20 + Math.abs(i - 2) * 2); ctx.lineTo(-16 + i * 9, -10); } ctx.stroke();
    underVeil(P(MOW_FLOAT));
    ripple(-40, 40, f.ph);
    ctx.restore();
  }
  // A blue dragon (Glaucus): a tiny blue sea slug that floats upside down at the surface, with fans of fingers.
  function drawGlaucus(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy + s * 0.12); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(Math.sin(f.ph) * 0.05);
    const deep = sh("#1a3ad8"), pale = sh("#8ab8f0"), tip = sh("#2a5ae8");
    ctx.lineCap = "round";
    const tips = [];
    ctx.strokeStyle = pale; ctx.lineWidth = 3; ctx.beginPath();
    for (const [cx, n, len] of [[24, 6, 22], [2, 7, 26], [-20, 6, 20]]) {
      for (let i = 0; i < n; i++) {
        const a = -Math.PI * 0.85 + (i / (n - 1)) * Math.PI * 0.7, w = Math.sin(f.ph * 2 + i + cx) * 0.06;
        for (const side of [1, -1]) {
          const ex = cx + Math.cos(a + w) * len * 0.6, ey = side * Math.sin(a + w) * -len;
          ctx.moveTo(cx, 0); ctx.lineTo(ex, ey); tips.push(ex, ey);
        }
      }
    }
    ctx.stroke();
    ctx.fillStyle = tip; ctx.beginPath(); for (let i = 0; i < tips.length; i += 2) { ctx.moveTo(tips[i] + 1.8, tips[i + 1]); ctx.arc(tips[i], tips[i + 1], 1.8, 0, TAU); } ctx.fill();
    ctx.fillStyle = pale; ctx.beginPath(); ctx.moveTo(50, 0); ctx.bezierCurveTo(46, -6, 30, -6, 0, -5); ctx.bezierCurveTo(-20, -4, -40, -2, -54, 0); ctx.bezierCurveTo(-40, 2, -20, 4, 0, 5); ctx.bezierCurveTo(30, 6, 46, 6, 50, 0); ctx.fill();
    ctx.strokeStyle = deep; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(46, 0); ctx.lineTo(-48, 0); ctx.stroke();
    ctx.restore();
  }

  // ---- the Arctic Sea -----------------------------------------------------------------
  // An icefish: almost see-through and pale, with a long flat snout like a duck's bill and big fanning fins.
  // Its blood has no red colour at all.
  const ICE_BODY = "M 50 -1 C 46 -4 36 -6 26 -7 C 10 -9 -16 -7 -36 -3 L -36 3 C -16 6 10 8 26 6 C 36 5 46 3 50 -1 Z";
  const ICE_D1 = "M 14 -8 C 10 -22 2 -22 0 -8 Z";
  const ICE_D2 = "M -4 -8 C -14 -15 -28 -12 -34 -4 Z";
  const ICE_TAIL = "M 0 -4 C -8 -10 -14 -9 -16 0 C -14 9 -8 10 0 4 Z";
  const ICE_PEC = "M 0 0 C 4 -8 -12 -14 -20 -6 C -16 2 -6 6 0 0 Z";
  function drawIcefish(f) {
    const s = f.s;
    sandShadow(f, s * 0.3);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const body = sh("#dfe8ea"), band = sh("#a8b8bc"), dark = sh("#3a4a50");
    ctx.globalAlpha = 0.85;
    ctx.save(); ctx.translate(-36, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.2); fillWith(P(ICE_TAIL), band); ctx.restore();
    fillWith(P(ICE_D1), dark); fillWith(P(ICE_D2), band);
    fillWith(P(ICE_BODY), body);
    ctx.save(); ctx.clip(P(ICE_BODY)); ctx.fillStyle = band;
    for (let i = 0; i < 5; i++) { const x = 12 - i * 10; ctx.beginPath(); ctx.ellipse(x, -2, 2.4, 7, 0.2, 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.save(); ctx.translate(22, 2); ctx.rotate(0.3 + Math.sin(f.ph * 2.5) * 0.25); ctx.globalAlpha = 0.55; fillWith(P(ICE_PEC), body); ctx.restore();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = band; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(50, 0); ctx.lineTo(30, 1); ctx.stroke();
    eye(32, -3.4, 2.8, "#1a2024");
    ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.beginPath(); ctx.arc(32.8, -4.2, 0.8, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // A leopard seal: long and slender with a huge reptile-like head, a wide grin of a gape, and dark spots.
  const LEO_BODY = "M 50 -2 C 48 -8 42 -12 32 -12 C 24 -12 18 -10 12 -9 C -6 -8 -26 -6 -40 -3 C -46 -2 -50 -1 -52 0 C -50 2 -46 3 -40 4 C -26 7 -6 9 12 9 C 22 9 32 7 40 5 C 46 4 50 2 50 -2 Z";
  const LEO_FLIP = "M 0 0 C 4 6 2 16 -6 22 C -9 23 -10 20 -8 16 C -4 10 -4 4 -4 0 Z";
  const LEO_HIND = "M 0 -1 C -6 -6 -12 -8 -16 -6 C -12 -2 -12 2 -16 6 C -12 8 -6 6 0 1 Z";
  function drawLeopardSeal(f) {
    const s = f.s, sw = Math.sin(f.ph * 2);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(Math.sin(f.ph) * 0.03);
    const back = sh("#5a626a"), belly = sh("#c8ccd0"), spot = sh("#2e343a");
    ctx.save(); ctx.translate(-50, 0); ctx.rotate(sw * 0.3); fillWith(P(LEO_HIND), back); ctx.restore();
    ctx.save(); ctx.translate(16, 5); ctx.rotate(0.4 + sw * 0.25); fillWith(P(LEO_FLIP), sh("#4a5258")); ctx.restore();
    fillWith(P(LEO_BODY), back);
    ctx.save(); ctx.clip(P(LEO_BODY));
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(10, 9, 50, 7, 0.02, 0, TAU); ctx.fill();
    ctx.fillStyle = spot;
    for (const [x, y, r] of [[20, -4, 1.6], [8, -6, 2], [-4, -3, 1.6], [-16, -4, 1.8], [-28, -2, 1.4], [14, 4, 1.4], [0, 5, 1.6], [-12, 4, 1.4], [28, 3, 1.2], [-36, 1, 1.2]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = spot; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(50, 0); ctx.quadraticCurveTo(44, 4, 34, 0); ctx.stroke();
    eye(39, -6.5, 1.8, "#101214");
    ctx.beginPath(); ctx.arc(49, -3, 0.8, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(20, 6); ctx.rotate(0.2 - sw * 0.25); fillWith(P(LEO_FLIP), back); ctx.restore();
    ctx.restore();
  }
  // A swarm of krill: dozens of tiny pink shrimp, the food of whales, penguins and seals.
  const KRILL = Array.from({ length: 34 }, (_, i) => [Math.cos(i * 2.4) * ((i * 37) % 100) / 100, Math.sin(i * 2.4) * ((i * 53) % 100) / 100 * 0.6, (i * 0.7) % TAU]);
  function drawKrill(f) {
    const s = f.s, d = faceOf(f), l = Math.max(3, s * 0.07);
    ctx.save(); ctx.translate(f.x, f.cy);
    ctx.strokeStyle = sh("#e86a5a"); ctx.lineWidth = Math.max(1, l * 0.32); ctx.lineCap = "round";
    const pts = KRILL.map(([ox, oy, p]) => [ox * s * 0.5 + Math.sin(f.ph * 0.7 + p) * s * 0.05, oy * s * 0.5 + Math.cos(f.ph * 0.9 + p) * s * 0.04]);
    ctx.beginPath();
    for (const [x, y] of pts) { ctx.moveTo(x + d * l * 0.5, y); ctx.quadraticCurveTo(x, y - l * 0.25, x - d * l * 0.5, y + l * 0.15); }
    ctx.stroke();
    ctx.fillStyle = "#101010"; ctx.beginPath();
    for (const [x, y] of pts) { ctx.moveTo(x + d * l * 0.42, y - l * 0.05); ctx.arc(x + d * l * 0.38, y - l * 0.05, l * 0.09, 0, TAU); }
    ctx.fill();
    ctx.restore();
  }
  // A Greenland shark: slow, grey-brown and ancient, with small fins. It can live for four hundred years.
  function drawGreenland(x, y, dir, L, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph) * 0.015);
    ctx.save(); ctx.scale(1, 1.2);
    sharkForm(L, sh("#4e4a44"), sh("#7a766c"), { upper: 0.12, fin: 0.45 });
    ctx.fillStyle = sh("#36322e");
    for (const [sx, sy] of [[0.25, -0.04], [0.12, -0.05], [0.0, -0.03], [-0.12, -0.04], [-0.22, -0.02], [0.18, -0.01], [0.05, 0.0], [-0.06, -0.01]]) { ctx.beginPath(); ctx.arc(L * sx, L * sy, L * 0.008, 0, TAU); ctx.fill(); }
    ctx.restore();
    // a pale copepod hangs from its eye, as on many real Greenland sharks
    ctx.strokeStyle = sh("#e8e0b0"); ctx.lineWidth = Math.max(1, L * 0.006); ctx.lineCap = "round";
    const ex = L * 0.4, ey = -L * 0.03;
    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.quadraticCurveTo(ex - L * 0.02, ey + Math.sin(ph * 2) * L * 0.01, ex - L * 0.045, ey + L * 0.006); ctx.stroke();
    ctx.restore();
  }

  // ---- the deep sea ----------------------------------------------------------------
  // A vampire squid: dark red, with big blue eyes and a cape of webbed arms. Now and then it turns its cape
  // inside out over its body, so only soft spines show.
  const VAMP_MANTLE = "M 44 0 C 44 -12 32 -18 16 -18 C 4 -18 -4 -14 -8 -8 L -8 8 C -4 14 4 18 16 18 C 32 18 44 12 44 0 Z";
  const VAMP_FIN = "M 30 -15 C 34 -26 26 -30 20 -24 C 18 -21 20 -17 24 -16 Z";
  function drawVampire(f) {
    const s = f.s, cloak = Math.max(0, Math.min(1, (Math.sin(f.ph * 0.12) - 0.55) / 0.35));
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(-1.15 + Math.sin(f.ph * 0.6) * 0.06);
    const body = sh("#5a1424"), web = sh("#2a0810"), spine = sh("#e8c8d0");
    const flap = Math.sin(f.ph * 2) * 0.25;
    for (const sd of [1, -1]) { ctx.save(); ctx.scale(1, sd); ctx.translate(26, -18); ctx.rotate(flap * sd); ctx.translate(-26, 18); fillWith(P(VAMP_FIN), body); ctx.restore(); }
    fillWith(P(VAMP_MANTLE), body);
    ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.beginPath(); ctx.ellipse(20, -8, 18, 5, 0, 0, TAU); ctx.fill();
    // eight arms spread like the ribs of an umbrella, with the dark web stretched between them.
    // Normally the umbrella trails behind; when it is startled it folds forward over the body like a cape.
    const open = 1 + Math.sin(f.ph * 1.5) * 0.12 * (1 - cloak);
    const tips = [];
    for (let i = 0; i < 8; i++) { const a = Math.PI + (i - 3.5) * 0.17 * open, len = 40 - Math.abs(i - 3.5) * 2.2; tips.push([-6 + Math.cos(a) * len, Math.sin(a) * len * 1.25]); }
    ctx.save(); ctx.translate(-6, 0); ctx.scale(1 - 2 * cloak, 1); ctx.translate(6, 0);
    ctx.fillStyle = web; ctx.globalAlpha *= 0.9;
    ctx.beginPath(); ctx.moveTo(-6, -9);
    tips.forEach(([tx, ty], i) => { if (i === 0) ctx.lineTo(tx, ty); else { const [px, py] = tips[i - 1]; ctx.quadraticCurveTo((px + tx) / 2 + 6, (py + ty) / 2, tx, ty); } });
    ctx.lineTo(-6, 9); ctx.closePath(); ctx.fill();
    ctx.globalAlpha /= 0.9;
    ctx.strokeStyle = body; ctx.lineWidth = 2.6; ctx.lineCap = "round";
    ctx.beginPath(); for (const [tx, ty] of tips) { ctx.moveTo(-6, ty * 0.12); ctx.quadraticCurveTo(-6 + (tx + 6) * 0.5, ty * 0.6, tx, ty); } ctx.stroke();
    // soft spines (cirri) along the arms, on the side that shows when it is cloaked
    ctx.strokeStyle = spine; ctx.lineWidth = 0.9; ctx.globalAlpha *= 0.4 + cloak * 0.6;
    ctx.beginPath(); for (const [tx, ty] of tips) for (let j = 1; j < 4; j++) { const fx = -6 + (tx + 6) * j / 4, fy = ty * j / 4; ctx.moveTo(fx, fy); ctx.lineTo(fx - 1.5, fy + (ty > 0 ? 3 : -3)); } ctx.stroke();
    ctx.globalAlpha = 1;
    if (cloak < 0.4) { ctx.fillStyle = sca("#7ae8ff", 0.85); for (const [tx, ty] of tips) { ctx.beginPath(); ctx.arc(tx, ty, 1.6, 0, TAU); ctx.fill(); } }
    ctx.restore();
    if (cloak < 0.7) {
      ctx.fillStyle = sca("#58d8ff", 0.25); ctx.beginPath(); ctx.arc(2, -5, 9, 0, TAU); ctx.fill();
      ctx.fillStyle = sc("#58d8ff"); ctx.beginPath(); ctx.arc(2, -5, 5, 0, TAU); ctx.fill();
      eye(2.6, -5, 2.6, "#06121a");
    }
    ctx.restore();
  }
  // A dumbo octopus: soft and pale pink, it flaps the two ear-like fins on its head, like Dumbo the elephant.
  const DUMBO_HEAD = "M 0 -46 C 18 -46 26 -30 24 -14 C 22 -4 14 2 0 2 C -14 2 -22 -4 -24 -14 C -26 -30 -18 -46 0 -46 Z";
  const DUMBO_EAR = "M 0 0 C 8 -10 22 -12 26 -4 C 28 2 18 6 0 4 Z";
  const DUMBO_SKIRT = "M -24 -6 C -32 10 -34 24 -28 34 C -20 28 -12 34 -6 30 C 0 36 6 30 12 34 C 18 30 26 34 30 30 C 34 22 30 8 24 -6 Z";
  function drawDumbo(f) {
    const s = f.s, flap = Math.sin(f.ph * 3);
    ctx.save(); ctx.translate(f.x, f.cy + Math.sin(f.ph * 0.6) * 5 * u); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(0.25 + Math.sin(f.ph * 0.5) * 0.05);
    const skin = sh("#f0a888"), dark = sh("#d8806a");
    ctx.save(); ctx.translate(0, 2); ctx.scale(1 - flap * 0.06, 1 + flap * 0.08); fillWith(P(DUMBO_SKIRT), dark); ctx.restore();
    ctx.save(); ctx.translate(-18, -30); ctx.scale(-1, 1); ctx.rotate(-flap * 0.4); fillWith(P(DUMBO_EAR), dark); ctx.restore();
    fillWith(P(DUMBO_HEAD), skin);
    ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.ellipse(6, -34, 9, 6, -0.4, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(18, -30); ctx.rotate(flap * 0.4); fillWith(P(DUMBO_EAR), skin); ctx.restore();
    eye(10, -16, 4, "#1a0e0a");
    ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.arc(11.4, -17.4, 1.1, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // A viperfish: a slim black hunter with needle fangs too big for its mouth, a lure on a long fin ray,
  // and a row of lights along its belly.
  const VIP_BODY = "M 40 -2 C 38 -10 30 -12 20 -11 C 0 -9 -24 -5 -44 -2 L -44 2 C -24 4 0 7 20 8 C 30 8 38 6 40 -2 Z";
  const VIP_TAIL = "M 0 -2 L -12 -9 L -9 0 L -12 9 L 0 2 Z";
  function drawViper(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(Math.sin(f.ph * 0.7) * 0.04);
    const body = sh("#1a2428"), sheen = sh("#3a4c58");
    ctx.save(); ctx.translate(-44, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.2); fillWith(P(VIP_TAIL), body); ctx.restore();
    fillWith(P(VIP_BODY), body);
    ctx.save(); ctx.clip(P(VIP_BODY)); ctx.fillStyle = sheen; ctx.beginPath(); ctx.ellipse(4, -4, 40, 3, 0, 0, TAU); ctx.fill(); ctx.restore();
    // the long fin ray arches forward with a light at its tip
    ctx.strokeStyle = body; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(22, -11); ctx.quadraticCurveTo(34, -30 + Math.sin(f.ph) * 2, 52, -22); ctx.stroke();
    ctx.fillStyle = sca("#7ad8ff", 0.35); ctx.beginPath(); ctx.arc(52, -22, 4, 0, TAU); ctx.fill();
    ctx.fillStyle = sc("#bdf2ff"); ctx.beginPath(); ctx.arc(52, -22, 1.6, 0, TAU); ctx.fill();
    // fangs that do not fit in its mouth
    ctx.strokeStyle = sh("#e8eef0"); ctx.lineWidth = 1.1; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(36, -2); ctx.quadraticCurveTo(39, 4, 37, 10); ctx.moveTo(32, -1); ctx.quadraticCurveTo(34, 4, 32, 8); ctx.moveTo(39, 5); ctx.quadraticCurveTo(42, -2, 40, -9); ctx.moveTo(34, 6); ctx.quadraticCurveTo(36, 0, 35, -6); ctx.stroke();
    ctx.fillStyle = sca("#6ad8ff", 0.9);
    for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.arc(26 - i * 7, 6 - i * 0.45, 1.1, 0, TAU); ctx.fill(); }
    ctx.fillStyle = sh("#9aa8b0"); ctx.beginPath(); ctx.arc(30, -5, 3.6, 0, TAU); ctx.fill();
    eye(30.6, -5, 2.4, "#050607");
    ctx.restore();
  }
  // A pelican eel (gulper): a huge loose mouth that opens like a bag, a tiny eye, and a whip of a tail
  // with a pink light at its tip.
  function drawGulper(f) {
    const s = f.s, open = Math.max(0, Math.sin(f.ph * 0.35)) ** 2, swim = f.ph * 2.5;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const body = sh("#16141a"), pouch = sh("#2a1a24"), rim = sh("#5a4a5a");
    // the whip tail, as a tapering wave behind the head
    const pts = [];
    for (let i = 0; i <= 18; i++) { const fr = i / 18; pts.push([8 - fr * 62, Math.sin(swim - fr * 5) * 6 * fr, 5 * (1 - fr) + 0.4]); }
    ctx.fillStyle = body; ctx.beginPath();
    pts.forEach(([x, y, w], i) => i ? ctx.lineTo(x, y - w) : ctx.moveTo(x, y - w));
    for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i][0], pts[i][1] + pts[i][2]);
    ctx.closePath(); ctx.fill();
    const [tx, ty] = pts[pts.length - 1];
    ctx.fillStyle = sca("#ff5a8a", 0.35); ctx.beginPath(); ctx.arc(tx, ty, 4.5, 0, TAU); ctx.fill();
    ctx.fillStyle = sc("#ff8ab0"); ctx.beginPath(); ctx.arc(tx, ty, 1.8, 0, TAU); ctx.fill();
    // the head, then the long jaws from a hinge just behind the eye
    ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(10, -1, 9, 6, 0, 0, TAU); ctx.fill();
    const hx = 12, hy = -2, up = -0.04 - open * 0.22, jaw = 36;
    const ux = hx + Math.cos(up) * jaw, uy = hy + Math.sin(up) * jaw, lx = hx + jaw * 0.98, ly = hy + 4 + open * 6;
    // the pouch hangs between the jaws like a pelican's, and swells as it gulps
    ctx.fillStyle = pouch; ctx.beginPath(); ctx.moveTo(hx, hy);
    ctx.lineTo(ux, uy); ctx.lineTo(lx, ly);
    ctx.quadraticCurveTo(hx + jaw * 0.55, ly + 6 + open * 8, hx - 2, hy + 5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh("#4a2a3a"); ctx.beginPath(); ctx.moveTo(hx + 3, hy + 0.5); ctx.lineTo(ux - 3, uy + 1.2); ctx.lineTo(lx - 3, ly - 1.2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rim; ctx.lineWidth = 1.2; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.quadraticCurveTo(hx + jaw * 0.55, ly + 6 + open * 8, hx - 2, hy + 5); ctx.stroke();
    ctx.fillStyle = sh("#d8d0c8");
    for (let i = 1; i < 8; i++) { const f2 = i / 8, tx2 = hx + (ux - hx) * f2, ty2 = hy + (uy - hy) * f2; ctx.beginPath(); ctx.moveTo(tx2 - 0.8, ty2 + 1); ctx.lineTo(tx2, ty2 + 2.6); ctx.lineTo(tx2 + 0.8, ty2 + 1); ctx.fill(); }
    ctx.strokeStyle = body; ctx.lineWidth = 2.6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(ux, uy); ctx.moveTo(hx, hy + 1); ctx.lineTo(lx, ly); ctx.stroke();
    ctx.strokeStyle = rim; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(hx + 2, hy - 1.4); ctx.lineTo(ux, uy - 1.2); ctx.stroke();
    ctx.fillStyle = sh("#8a96a0"); ctx.beginPath(); ctx.arc(14, -4, 1.3, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // Hatchetfish: small, flat and silver, shaped like the blade of a hatchet, with tube eyes that look up
  // and a row of lights along the belly.
  const HATCH_BODY = "M 32 -6 C 30 -12 20 -14 6 -14 C -8 -14 -18 -12 -24 -8 L -30 -6 L -30 -1 C -24 0 -16 6 -8 14 C -2 20 6 24 12 22 C 22 18 30 8 32 -6 Z";
  const HATCH_TAIL = "M 0 -3 L -10 -9 L -8 -3 L -10 4 L 0 1 Z";
  function drawHatchet(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(Math.sin(f.ph * 0.9) * 0.05);
    const silver = sh("#c8d4dc"), back = sh("#3a4a58");
    ctx.save(); ctx.translate(-30, -3); ctx.rotate(Math.sin(f.ph * 3) * 0.25); fillWith(P(HATCH_TAIL), sh("#9aa8b4")); ctx.restore();
    fillWith(P(HATCH_BODY), silver);
    paintInside(P(HATCH_BODY), back, P("M -40 -20 L 40 -20 L 40 -9 C 20 -10 0 -10 -40 -6 Z"));
    ctx.save(); ctx.clip(P(HATCH_BODY)); ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.ellipse(6, 2, 14, 6, 0.5, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = sca("#6ad0ff", 0.95);
    for (let i = 0; i < 7; i++) { const t2 = i / 6, x = 26 - t2 * 34, y = 6 + Math.sin(t2 * Math.PI) * 15; ctx.beginPath(); ctx.arc(x, y, 1.3, 0, TAU); ctx.fill(); }
    ctx.fillStyle = sh("#e8eef2"); ctx.beginPath(); ctx.ellipse(18, -10, 4.4, 5.4, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#06080a"; ctx.beginPath(); ctx.ellipse(18, -12, 3, 3.4, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // A leatherback turtle: the biggest turtle, with no hard shell but dark leathery skin with ridges and white spots,
  // and enormously long front flippers.
  const LEATH_BODY = "M 30 -2 C 26 -14 8 -20 -14 -19 C -34 -18 -46 -8 -54 2 C -46 6 -34 8 -14 8 C 8 8 24 6 30 -2 Z";
  const LEATH_HEAD = "M 26 -6 C 32 -12 42 -11 46 -7 C 49 -4 48 0 44 2 C 38 4 32 3 26 2 Z";
  const LEATH_FRONT = "M 0 0 C 10 8 6 30 -14 46 C -18 48 -20 44 -16 38 C -8 26 -4 12 -6 2 Z";
  const LEATH_HIND = "M 0 0 C -2 6 -8 10 -14 9 C -10 5 -6 2 -4 -1 Z";
  function drawLeatherback(x, y, dir, L, ph) {
    const stroke = Math.sin(ph * 1.4);
    ctx.save(); ctx.translate(x, y); ctx.scale(dir * L / 100, L / 100); ctx.rotate(Math.sin(ph * 0.7) * 0.04);
    const skin = sh("#1e2630"), ridge = sh("#5a6a78"), spot = sh("#d8dee2");
    ctx.save(); ctx.translate(12, 2); ctx.rotate(-0.4 + stroke * 0.5); fillWith(P(LEATH_FRONT), sh("#161c24")); ctx.restore();
    ctx.save(); ctx.translate(-44, 4); ctx.rotate(0.2 - stroke * 0.2); fillWith(P(LEATH_HIND), sh("#161c24")); ctx.restore();
    fillWith(P(LEATH_HEAD), skin);
    ctx.fillStyle = sh("#e8a0a0"); ctx.beginPath(); ctx.ellipse(36, -9.5, 2.4, 1.2, 0, 0, TAU); ctx.fill();
    eye(40, -6, 1.5, "#06080a");
    fillWith(P(LEATH_BODY), skin);
    ctx.save(); ctx.clip(P(LEATH_BODY));
    ctx.strokeStyle = ridge; ctx.lineWidth = 1.3;
    ctx.beginPath(); for (const o of [-14, -8, -2]) { ctx.moveTo(28, o * 0.4 - 4); ctx.quadraticCurveTo(-10, o - 6, -54, 1 + o * 0.1); } ctx.stroke();
    ctx.fillStyle = spot; for (let i = 0; i < 22; i++) { ctx.beginPath(); ctx.arc(24 - (i * 29) % 74, -16 + (i * 13) % 22, 0.9, 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.save(); ctx.translate(18, 3); ctx.rotate(-0.2 + stroke * 0.6); fillWith(P(LEATH_FRONT), skin); ctx.fillStyle = spot; ctx.beginPath(); ctx.arc(-4, 18, 0.9, 0, TAU); ctx.arc(-8, 28, 0.9, 0, TAU); ctx.fill(); ctx.restore();
    ctx.restore();
  }

  // ---- the polar bear climbs onto the ice -----------------------------------------
  // It swims to a floe, hauls itself up and out of sight (from below you only see its shadow walking on the ice),
  // and after a while it jumps back in with a big splash, dives down and paddles up again.
  function drawBearUnder(f, ang) {
    const s = f.s, sw = Math.sin(f.ph * 3);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(ang);
    const fur = sh("#f4f0e2"), shade = sh("#d6cfba");
    ctx.save(); ctx.translate(20, 18); ctx.rotate(-1.0 - sw * 0.4); fillUnder(P(BEAR_LEG), shade); ctx.restore();
    ctx.save(); ctx.translate(-44, 20); ctx.rotate(1.2 - sw * 0.3); fillUnder(P(BEAR_LEG), shade); ctx.restore();
    fillUnder(P(BEAR_BODY), fur);
    ctx.save(); ctx.translate(26, 18); ctx.rotate(-0.8 + sw * 0.4); fillUnder(P(BEAR_LEG), fur); ctx.restore();
    ctx.save(); ctx.translate(-38, 20); ctx.rotate(1.3 + sw * 0.3); fillUnder(P(BEAR_LEG), fur); ctx.restore();
    eye(52, -14.5, 1.9, "#141414");
    ctx.beginPath(); ctx.ellipse(71.5, -8, 3, 2.4, 0.3, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function drawBearAll(f) {
    const st = f.st || "swim";
    if (st === "swim") { drawPolarBear(f); return; }
    if (st === "ice") return;
    if (st === "climb") return;
    drawBearUnder(f, Math.atan2(f.vy || 0, Math.abs(f.vx || 0.01)) * 0.8);
  }
  function moveBear(f, F, k) {
    f.ph += 0.05 * k;
    const dt = k / 60, edge = 30 * u;
    if (!f.st) { f.st = "swim"; f.cool = rnd6(5, 14); }
    if (f.st === "swim") {
      f.vx = (f.vx || 0) + (f.dir * F.speed * u - (f.vx || 0)) * Math.min(1, 0.03 * k);
      f.x += f.vx * k;
      if (f.x < edge) f.dir = 1;
      if (f.x > W - edge) f.dir = -1;
      f.cy = waveY(f.x);
      f.cool -= dt;
      if (f.cool <= 0) {
        const fl = scene.floes.find(o => Math.abs(o.x - f.x) > o.w * 0.3 && Math.abs(o.x - f.x) < o.w * 0.48 && o.x > 60 * u && o.x < W - 60 * u);
        if (fl) { f.st = "climb"; f.floe = fl; f.off = f.x - fl.x; f.dir = -Math.sign(f.off); f.tm = 0; }
        else f.cool = 1;
      }
    } else if (f.st === "climb") {
      f.tm += dt;
      const p = Math.min(1, f.tm / 2.6);
      f.x = f.floe.x + f.off; f.cy = waveY(f.x) + f.s * 0.5 - p * f.s * 1.4;
      f.floe.dip = 3 * u * Math.sin(p * Math.PI);
      if (Math.random() < 0.15 * k) bubbles.push({ x: f.x + (Math.random() - 0.5) * f.s * 0.4, y: waveY(f.x) + 6 * u, r: (1 + Math.random() * 1.5) * u, ph: Math.random() * TAU });
      if (p >= 1) { f.st = "ice"; f.tm = rnd6(6, 14); f.cy = undefined; }
    } else if (f.st === "ice") {
      f.tm -= dt;
      f.off += f.dir * 0.22 * u * k;
      if (Math.abs(f.off) > f.floe.w * 0.38) { f.off = Math.sign(f.off) * f.floe.w * 0.38; f.dir *= -1; }
      f.x = f.floe.x + f.off; f.cy = undefined;
      if (f.x < 50 * u || f.x > W - 50 * u) f.tm = 0;
      if (f.tm <= 0) {
        f.off = Math.sign(f.off || f.dir) * f.floe.w * 0.45; f.dir = Math.sign(f.off); f.x = f.floe.x + f.off;
        f.st = "jump"; f.vx = f.dir * 1.6 * u; f.vy = -1.4 * u; f.y = waveY(f.x) - f.s * 0.8; f.wet = false; f.floe.dip = 4 * u;
        if (f.x < 80 * u) { f.dir = 1; f.vx = 1.6 * u; }
        if (f.x > W - 80 * u) { f.dir = -1; f.vx = -1.6 * u; }
      }
    } else if (f.st === "jump") {
      f.x += f.vx * k; if (!f.wet) f.vy += 0.12 * u * k; f.y += f.vy * k;
      if (!f.wet && f.y > waveY(f.x)) {
        f.wet = true; splash(f.x); splash(f.x - 10 * u); splash(f.x + 10 * u); sfxSplash(1);
        for (let i = 0; i < 26; i++) bubbles.push({ x: f.x + (Math.random() - 0.5) * f.s * 0.8, y: waveY(f.x) + Math.random() * f.s * 0.6, r: (1 + Math.random() * 3) * u, ph: Math.random() * TAU });
      }
      // under water it brakes hard: a short dive, not all the way to the bottom
      if (f.wet) { f.vy *= Math.pow(0.95, k); f.vx *= Math.pow(0.97, k); if (f.vy < 0.3 * u) f.st = "rise"; }
      f.cy = f.y;
    } else if (f.st === "rise") {
      f.vy = Math.max(-1 * u, f.vy - 0.04 * u * k); f.x += f.vx * k; f.vx *= Math.pow(0.99, k); f.y += f.vy * k;
      f.x = Math.max(edge, Math.min(W - edge, f.x));
      if (f.y <= waveY(f.x)) { f.st = "swim"; f.cool = rnd6(15, 30); f.vx = f.dir * F.speed * u; }
      f.cy = f.y;
    }
  }
  function drawBearClimb(f) {
    const s = f.s, p = Math.min(1, f.tm / 2.6), kick = Math.sin(f.ph * 6);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(-0.45 - p * 0.6 + Math.sin(f.ph * 2) * 0.05);
    const fur = sh("#f4f0e2"), shade = sh("#d6cfba");
    ctx.save(); ctx.translate(-44, 20); ctx.rotate(0.9 + kick * 0.5); ctx.fillStyle = shade; ctx.fill(P(BEAR_LEG)); ctx.restore();
    ctx.save(); ctx.translate(20, 14); ctx.rotate(-1.6 + p * 0.3); ctx.fillStyle = shade; ctx.fill(P(BEAR_LEG)); ctx.restore();
    ctx.fillStyle = fur; ctx.fill(P(BEAR_BODY));
    ctx.save(); ctx.translate(-38, 20); ctx.rotate(1.1 - kick * 0.5); ctx.fillStyle = fur; ctx.fill(P(BEAR_LEG)); ctx.restore();
    ctx.save(); ctx.translate(26, 14); ctx.rotate(-1.9 + p * 0.3); ctx.fillStyle = fur; ctx.fill(P(BEAR_LEG)); ctx.restore();
    ctx.fillStyle = shade; ctx.beginPath(); ctx.arc(39.5, -22.5, 2, 0, TAU); ctx.fill();
    eye(52, -14.5, 1.9, "#141414");
    ctx.beginPath(); ctx.ellipse(71.5, -8, 3, 2.4, 0.3, 0, TAU); ctx.fill();
    ctx.restore();
    // water streams off its fur
    if (Math.random() < 0.3) ripples.push({ x: f.x + (Math.random() - 0.5) * s * 0.3, r: 1, a: 0.5 });
  }
  // seen from under the water: the bear climbing out over the edge of the floe
  function drawIceWalkers() {
    if (!water.ice) return;
    for (const f of scene.fauna || []) if (f.key === "polarbear" && f.st === "climb" && f.cy !== undefined) shinyDraw(f, () => drawBearClimb(f));
  }
  FAUNA.polarbear.move = moveBear;
  FAUNA.polarbear.draw = drawBearAll;

  // ---- reacting to the diver -----------------------------------------------------------
  // most fish swim out of the way of the diver
  function shyFish(f) {
    if (near(f.x, f.cy || 0, 110 * u) > 0) f.tx = Math.max(30 * u, Math.min(W - 30 * u, f.x + (Math.sign(f.x - diver.x) || 1) * 170 * u));
  }
  // a garibaldi defends its patch of kelp: it swims right up to the diver and hangs there, facing it
  function boldFish(f) {
    if (near(f.x, f.cy || 0, 170 * u) > 0) { const side = Math.sign(f.x - diver.x) || 1; f.tx = diver.x + side * 50 * u; if (Math.abs(f.tx - f.x) < 14 * u) f.dir = -side; }
  }
  // a brittle star wriggles away over the sand
  function crawlAway(f, F, k) {
    if (near(f.x, f.cy || 0, 100 * u) > 0) { f.dir = Math.sign(f.x - diver.x) || f.dir; f.x = Math.max(scene.floorL + 30 * u, Math.min(scene.floorR - 30 * u, f.x + f.dir * 0.35 * u * k)); }
  }

  // ---- the table of new animals -------------------------------------------------------
  const W6_FAUNA = {
    xmastree: { kind: "floor", size: [18, 24], count: [2, 4], draw: drawXmasTree, thumb: 70 },
    coconut: { kind: "floor", size: [20, 26], crawl: 0.1, draw: drawCoconut, thumb: 62 },
    moorish: { kind: "swim", size: [22, 28], band: [0.3, 0.6], speed: 0.45, draw: drawMoorish, thumb: 44 },
    angelfish: { kind: "swim", size: [24, 30], band: [0.35, 0.7], speed: 0.35, draw: drawEmperor, thumb: 72 },
    crownthorns: { kind: "floor", size: [20, 26], crawl: 0.02, draw: drawCrownThorns, thumb: 62 },
    hawksbill: { kind: "swim", size: [44, 54], band: [0.35, 0.65], speed: 0.4, draw: drawHawksbill, thumb: 80 },
    horseshoe: { kind: "floor", size: [24, 30], crawl: 0.07, draw: drawHorseshoe, thumb: 70 },
    dugong: { kind: "glide", size: [72, 88], lift: [14, 26], speed: 0.25, draw: drawDugong, thumb: 96 },
    mudskipper: { kind: "floor", size: [13, 16], count: [1, 3], draw: drawMudskipper, move: moveMudskipper, thumb: 70 },
    puffin: { kind: "dive", size: [20, 24], speed: 0.35, draw: drawPuffin, thumb: 62 },
    gannet: { kind: "dive", size: [30, 36], speed: 0.3, draw: drawGannet, move: moveGannet, thumb: 60 },
    porpoise: { kind: "swim", size: [48, 58], band: [0.25, 0.5], speed: 0.9, draw: drawPorpoise, react: shyPorpoise, thumb: 96 },
    flatfish: { kind: "floor", size: [22, 28], count: [1, 2], draw: drawFlatfish, move: moveFlatfish, thumb: 80 },
    cod: { kind: "swim", size: [34, 42], band: [0.45, 0.75], speed: 0.4, draw: drawCod, thumb: 90 },
    wolffish: { kind: "floor", size: [36, 44], crawl: 0.03, draw: drawWolffish, thumb: 96 },
    garibaldi: { kind: "swim", size: [22, 28], band: [0.4, 0.75], speed: 0.45, draw: drawGaribaldi, thumb: 72 },
    leopardshark: { kind: "glide", size: [62, 78], lift: [20, 34], speed: 0.45, draw: drawLeopardShark, thumb: 100 },
    manowar: { kind: "surface", size: [26, 32], speed: 0.06, draw: drawManowar, thumb: 46 },
    glaucus: { kind: "surface", size: [16, 20], speed: 0.04, draw: drawGlaucus, thumb: 80 },
    icefish: { kind: "glide", size: [28, 34], lift: [16, 30], speed: 0.25, draw: drawIcefish, thumb: 92 },
    leopardseal: { kind: "swim", size: [80, 96], band: [0.3, 0.6], speed: 0.7, draw: drawLeopardSeal, thumb: 104 },
    krill: { kind: "swim", size: [70, 90], band: [0.3, 0.6], speed: 0.15, draw: drawKrill, thumb: 96 },
    vampire: { kind: "swim", size: [22, 28], band: [0.4, 0.75], speed: 0.3, draw: drawVampire, thumb: 84 },
    dumbo: { kind: "swim", size: [20, 26], band: [0.45, 0.8], speed: 0.22, draw: drawDumbo, thumb: 64 },
    viperfish: { kind: "swim", size: [26, 32], band: [0.4, 0.8], speed: 0.35, draw: drawViper, thumb: 92 },
    gulper: { kind: "swim", size: [40, 52], band: [0.4, 0.8], speed: 0.3, draw: drawGulper, thumb: 92 },
    hatchet: { kind: "swim", size: [10, 13], count: [3, 5], band: [0.45, 0.75], speed: 0.35, draw: drawHatchet, thumb: 90 },
  };
  const W6_VISITORS = {
    herring: { size: () => (30 + Math.random() * 6) * u, speed: 1.6, draw: drawHerring, thumb: 24 },
    greenland: { size: () => (230 + Math.random() * 60) * u, speed: 0.35, draw: drawGreenland, thumb: 104 },
    leatherback: { size: () => (140 + Math.random() * 40) * u, speed: 0.55, draw: drawLeatherback, thumb: 96 },
  };
  Object.assign(FAUNA, W6_FAUNA);
  for (const key of ["triggerfish", "wrasse", "surgeonfish", "mandarinfish", "needlefish", "guitarfish", "moorish", "angelfish", "cod", "hatchet", "icefish", "leopardshark"]) FAUNA[key].react = shyFish;
  FAUNA.garibaldi.react = boldFish;
  FAUNA.brittlestar.react = crawlAway;
  Object.assign(FAUNA_VIS, W6_VISITORS);
  hookFauna(W6_FAUNA, W6_VISITORS);
  // a few pictures that need a little help to fit
  THUMBS.sealion = () => drawSealion({ x: 60, y: 44, dir: 1, size: 100, ph: 1.31, yOff: 0 });
  FLOOR_THUMBS.add("ray");
  THUMBS.manowar = () => {
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, 22); for (let x = 0; x <= TW; x += 6) ctx.lineTo(x, 22 + Math.sin(x * 0.15) * 1.5); ctx.stroke();
    drawManowar({ x: 60, cy: 22, dir: 1, s: 46, ph: 1.2, tl: 120 });
  };
  THUMBS.gannet = () => {
    drawGannet({ x: 60, cy: 44, dir: 1, s: 70, ph: 1.2, st: "plunge", vx: 2, vy: 1.6 });
    ctx.fillStyle = "rgba(235,248,255,0.7)"; for (const [x, y, r] of [[22, 16, 2.4], [28, 10, 1.6], [16, 8, 1.4], [32, 20, 1.2]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  };
  THUMBS.krill = () => drawKrill({ x: 60, cy: 42, dir: 1, s: 100, ph: 1.2 });
  THUMBS.hatchet = () => { for (const [x, y, sz] of [[36, 38, 42], [82, 50, 46], [70, 20, 34]]) drawHatchet({ x, cy: y, dir: 1, s: sz, ph: x }); };
  THUMBS.gulper = () => drawGulper({ x: 54, cy: 40, dir: 1, s: 96, ph: 2 });

  // ---- moments ---------------------------------------------------------------------
  function buildWave6(s) {
    const name = water.name;
    s.net = { enabled: name !== "diepzee" && name !== "grot", timer: range(60, 150), active: false };
    s.spout = { active: false, tried: false };
    s.whirl = { enabled: ["noordzee", "kelpwoud", "ijszee"].includes(name), timer: range(70, 160), active: false, age: 0 };
    s.sardines = { enabled: ["kelpwoud", "sargasso"].includes(name), timer: range(50, 130), active: false };
    s.meteor = { enabled: !!water.surface, timer: range(15, 50), list: [] };
    s.eclipse = { enabled: !!water.surface && s.moon && s.moon.phase >= 0.97, timer: range(15, 45), active: false, age: 0, fade: 0 };
    s.leviathan = { enabled: s.rares.includes("leviathan"), active: false, timer: range(6, 14) };
    s.lighthouse = s.rares.includes("lighthouse") ? { x: W * range(0.2, 0.8), ph: range(0, TAU), logged: false } : null;
  }
  function registerWave6Shinies(s, add) {
    if (s.rares.includes("leviathan")) add("leviathan", s.leviathan, 140 * u, () => s.leviathan.eye || [-999, -999], () => s.leviathan.active);
    if (s.lighthouse) add("lighthouse", s.lighthouse, 50 * u, () => [s.lighthouse.x, waveY(s.lighthouse.x) + 40 * u]);
  }

  const NET_ANIMALS = ["hawksbill", "cod", "garibaldi", "angelfish", "porpoise", "moorish"];
  function startNet(N) {
    N.active = true; N.state = "drift"; N.dir = Math.random() < 0.5 ? 1 : -1;
    N.x = N.dir > 0 ? -90 * u : W + 90 * u; N.y = H * (0.3 + Math.random() * 0.3); N.ph = 0; N.tear = 0; N.fade = 1;
    N.key = NET_ANIMALS[Math.floor(Math.random() * NET_ANIMALS.length)];
    const F = FAUNA[N.key];
    N.animal = { key: N.key, x: N.x, cy: N.y, dir: N.dir, s: (F.size[0] + F.size[1]) / 2 * u, ph: 0 };
    N.w = Math.max(120 * u, N.animal.s * 1.8); N.h = Math.max(76 * u, N.animal.s);
  }
  function startSardines(R) {
    R.active = true; R.dir = Math.random() < 0.5 ? 1 : -1; R.cy = H * (0.35 + Math.random() * 0.2);
    R.len = Math.max(W * 0.9, 700 * u); R.x = R.dir > 0 ? -R.len * 0.6 : W + R.len * 0.6; R.ph = 0; R.plungeT = 1; R.plunges = [];
    R.fish = Array.from({ length: 150 }, (_, i) => [(((i * 61) % 150) / 150 - 0.5) * R.len, (((i * 37) % 97) / 97 - 0.5) * 2, i * 0.9]);
  }

  function updateWave6(k, dtSec) {
    const S = scene;
    if (!S.net) return;
    const N = S.net;
    if (N.enabled && !N.active) {
      N.timer -= dtSec;
      if (N.timer <= 0) { N.timer = 160 + Math.random() * 160; if (claim(45)) startNet(N); }
    }
    // a waterspout can form during a storm
    const SP = S.spout;
    if (!S.storm.active) SP.tried = false;
    else if (!SP.tried && S.storm.age > 3) {
      SP.tried = true;
      if (Math.random() < 0.6) { sfxWind(); SP.active = true; SP.age = 0; SP.x = W * (0.2 + Math.random() * 0.6); SP.vx = (Math.random() - 0.5) * 0.6; watch("waterspout", () => SP.active && SP.fade > 0.4 ? [[SP.x, waveY(SP.x) + SP.depth * 0.3], [SP.x, waveY(SP.x) + SP.depth * 0.7]] : null, 34 * u); }
    }
    if (SP.active) {
      SP.age += dtSec; SP.x += SP.vx * u * k;
      SP.fade = Math.min(1, SP.age / 3, Math.max(0, (16 - SP.age) / 3));
      SP.depth = H * 0.32 * SP.fade;
      if (SP.age > 16) SP.active = false;
    }
    const Wh = S.whirl;
    if (Wh.enabled && !Wh.active) {
      Wh.timer -= dtSec;
      if (Wh.timer <= 0) {
        Wh.timer = 170 + Math.random() * 150;
        if (claim(30)) { sfxSwirl(); Wh.active = true; Wh.age = 0; Wh.x = W * (0.3 + Math.random() * 0.4); Wh.y = H * (0.35 + Math.random() * 0.2); watch("whirlpool", () => Wh.active && Wh.fade > 0.5 ? [Wh.x, Wh.y] : null, 50 * u); }
      }
    }
    if (Wh.active) {
      Wh.age += dtSec;
      Wh.fade = Math.min(1, Wh.age / 4, Math.max(0, (28 - Wh.age) / 4));
      Wh.R = 120 * u * Wh.fade;
      // the swirl pulls the schools round with it
      for (const sp of S.species) for (const f of sp.fish) {
        const dx = f.x - Wh.x, dy = f.y - Wh.y, d = Math.hypot(dx, dy);
        if (d < Wh.R * 1.4 && d > 1) { f.vx += (-dy / d) * 0.06 * u * k * Wh.fade; f.vy += (dx / d) * 0.03 * u * k * Wh.fade; }
      }
      if (Wh.age > 28) Wh.active = false;
    }
    const R = S.sardines;
    if (R.enabled && !R.active) {
      R.timer -= dtSec;
      if (R.timer <= 0) { R.timer = 180 + Math.random() * 160; if (claim(40)) { startSardines(R); watch("sardinerun", () => R.active ? [[R.x, R.cy], [R.x - R.dir * R.len * 0.25, R.cy], [R.x + R.dir * R.len * 0.25, R.cy]] : null, 40 * u); } }
    }
    // shooting stars on a clear night
    const M = S.meteor;
    if (M.enabled && night > 0.7 && !S.storm.active) {
      M.timer -= dtSec;
      if (M.timer <= 0) {
        M.timer = 45 + Math.random() * 60;
        if (claim(4)) {
          const n = Math.random() < 0.4 ? 3 : 1;
          for (let i = 0; i < n; i++) M.list.push({ x: W * (0.1 + Math.random() * 0.8), dir: Math.random() < 0.5 ? 1 : -1, age: -i * (0.6 + Math.random() * 0.8) });
          sfxWhoosh();
          watch("meteor", () => M.list.some(m => m.age > 0) && diverMode ? [diver.x, diver.y] : null);
        }
      }
    }
    for (const m of M.list) m.age += dtSec;
    M.list = M.list.filter(m => m.age < 1.4);
    const E = S.eclipse;
    if (E.enabled) {
      if (!E.active) {
        E.timer -= dtSec;
        if (E.timer <= 0) { E.timer = 120 + Math.random() * 90; if (night > 0.7 && claim(45)) { sfxEclipse(); E.active = true; E.age = 0; watch("eclipse", () => E.active && E.fade > 0.6 && diverMode ? [diver.x, diver.y] : null); } }
      } else {
        E.age += dtSec;
        E.fade = Math.min(1, E.age / 8, Math.max(0, (45 - E.age) / 8));
        if (E.age > 45) { E.active = false; E.fade = 0; }
      }
    }
    const Lv = S.leviathan;
    if (Lv.enabled && !Lv.active) {
      Lv.timer -= dtSec;
      if (Lv.timer <= 0) {
        Lv.timer = 70 + Math.random() * 60;
        if (claim(40)) { sfxDeep(); Lv.active = true; Lv.dir = -rareSide(); Lv.size = Math.max(W * 1.5, 1300 * u); Lv.x = Lv.dir > 0 ? -Lv.size * 0.55 : W + Lv.size * 0.55; Lv.y = H * (0.45 + Math.random() * 0.15); Lv.ph = 0; Lv.logged = false; }
      }
    }
  }

  // The ghost net drifts by with an animal caught in it. Swim the diver up to it to cut the animal free.
  function drawNet(N, k) {
    const a = N.animal;
    N.ph += 0.03 * k;
    if (N.state === "drift") {
      N.x += N.dir * 0.28 * u * k;
      if (!N.told && N.x > 40 * u && N.x < W - 40 * u) {
        N.told = true;
        toast(diverMode ? L("Er zit een dier vast in een spooknet! Zwem erheen met je duiker om het te bevrijden.", "An animal is caught in a ghost net! Swim your diver over to set it free.")
          : L("Er zit een dier vast in een spooknet! Roep je duiker (D) en zwem erheen om het te bevrijden.", "An animal is caught in a ghost net! Call your diver (D) and swim over to set it free."));
      }
      if (diverMode && Math.hypot(diver.x - N.x, diver.y - N.y) < Math.max(70 * u, N.w * 0.6)) { sfxClick(); N.state = "tear"; toast(L("Je duiker snijdt het net los...", "Your diver cuts the net loose...")); }
      if (N.dir > 0 ? N.x > W + 100 * u : N.x < -100 * u) { N.active = false; return; }
    } else if (N.state === "tear") {
      N.x += N.dir * 0.1 * u * k;
      N.tear = Math.min(1, N.tear + k / 60 / 1.4);
      if (N.tear >= 1) {
        N.state = "free"; a.vx = N.dir * 2.4 * u;
        seen("ghostnet", [N.x, N.y]); sight(a.key, [a.x, a.cy]);
        if (!rebuilding) { const before = reached(); store.set("oceaan-gered", rescued() + 1); checkMilestones(before); questEvent("rescue"); }
        if (rewards.has("rd") && diverMode) { a.lap = 0; a.lapA = Math.atan2(a.cy - diver.y, a.x - diver.x); }
        toast(L("Bevrijd! Het dier zwemt weg.", "Set free! The animal swims away.")); sfxChest();
      }
    } else {
      N.fade = Math.max(0, N.fade - k / 60 / 3); N.y += 0.3 * u * k;
      a.x += a.vx * k; a.vx *= 1.01;
      if (N.fade <= 0 && (a.x < -150 * u || a.x > W + 150 * u)) { N.active = false; return; }
    }
    // the animal wriggles in the net, or swims off when it is free (with the Rescuer reward: after a lap round the diver)
    if (N.state !== "free") { a.x = N.x; a.cy = N.y + Math.sin(N.ph * 3) * 2 * u; a.ph += 0.15 * k; }
    else if (a.lap !== undefined && a.lap < 1 && diverMode) {
      a.lap += k / 60 / 2.4; a.lapA += TAU * k / 60 / 2.4;
      const r = 70 * u + a.s * 0.4, nx = diver.x + Math.cos(a.lapA) * r, ny = diver.y + Math.sin(a.lapA) * r * 0.6;
      a.dir = Math.sign(nx - a.x) || a.dir; a.x = nx; a.cy = ny; a.ph += 0.15 * k;
      if (a.lap >= 1) a.vx = N.dir * 2.4 * u;
    } else { a.cy += Math.sin(a.ph) * 0.2 * u * k; a.ph += 0.08 * k; }
    FAUNA[a.key].draw(a);
    if (N.fade <= 0) return;
    // the net: a sagging mesh with floats along the top and loose ends trailing
    const w = N.w, h = N.h, gap = N.tear * 26 * u, x0 = N.x - w / 2, y0 = N.y - h / 2;
    ctx.save(); ctx.globalAlpha = N.fade * (1 - N.tear * 0.3);
    ctx.strokeStyle = "rgba(150,175,150,0.75)"; ctx.lineWidth = 1.1 * u;
    const cols = 9, rows = 6;
    const pt = (i, j) => {
      const fx = i / cols, fy = j / rows, side = fx < 0.5 ? -1 : 1;
      return [x0 + fx * w + Math.sin(N.ph * 2 + j + i * 0.5) * 3 * u + side * gap * (0.3 + fy), y0 + fy * h + Math.sin(fx * Math.PI) * h * 0.18 + Math.sin(N.ph + i) * 2 * u + gap * fy * 0.6];
    };
    ctx.beginPath();
    for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++) { const [x, y] = pt(i, j); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); if (N.tear > 0.2 && i === Math.floor(cols / 2)) { const [x2, y2] = pt(i + 1, j); ctx.moveTo(x2, y2); i++; } }
    for (let i = 0; i <= cols; i++) { if (N.tear > 0.2 && i === Math.floor(cols / 2) + 1) continue; for (let j = 0; j <= rows; j++) { const [x, y] = pt(i, j); j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } }
    ctx.stroke();
    ctx.strokeStyle = "rgba(170,190,160,0.6)"; ctx.lineWidth = 1.6 * u; ctx.beginPath();
    for (const i of [1, 4, 8]) { const [x, y] = pt(i, rows); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.sin(N.ph * 2 + i) * 8 * u, y + 16 * u, x - 4 * u + Math.sin(N.ph + i) * 6 * u, y + 30 * u); }
    ctx.stroke();
    ctx.fillStyle = "#e0702a";
    for (let i = 0; i <= cols; i += 3) { const [x, y] = pt(i, 0); ctx.beginPath(); ctx.arc(x, y - 3 * u, 3.4 * u, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  function drawWave6Front(k) {
    const S = scene;
    if (!S.net) return;
    if (S.net.active) drawNet(S.net, k);
    // the whirlpool: spiralling streaks of white water around a dark eye
    const Wh = S.whirl;
    if (Wh.active && Wh.R > 2) {
      ctx.save(); ctx.translate(Wh.x, Wh.y); ctx.scale(1, 0.5);
      ctx.fillStyle = `rgba(0,10,20,${(0.25 * Wh.fade).toFixed(3)})`; ctx.beginPath(); ctx.arc(0, 0, Wh.R * 0.25, 0, TAU); ctx.fill();
      ctx.lineCap = "round";
      for (let arm = 0; arm < 5; arm++) {
        ctx.strokeStyle = `rgba(230,245,255,${(0.28 * Wh.fade).toFixed(3)})`; ctx.lineWidth = 2.2 * u;
        ctx.beginPath();
        for (let j = 0; j <= 28; j++) { const fr = j / 28, ang = t * 1.8 + arm * TAU / 5 + fr * 4.2, r = Wh.R * (1 - fr * 0.85); j ? ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r) : ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r); }
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(240,250,255,${(0.6 * Wh.fade).toFixed(3)})`;
      for (let i = 0; i < 24; i++) { const ang = t * (2.6 - (i % 4) * 0.3) + i * 1.7, r = Wh.R * (0.2 + ((i * 37) % 80) / 100); ctx.beginPath(); ctx.arc(Math.cos(ang) * r, Math.sin(ang) * r, 1.6 * u, 0, TAU); ctx.fill(); }
      ctx.restore();
      if (Math.random() < 0.3 * k) bubbles.push({ x: Wh.x + (Math.random() - 0.5) * 20 * u, y: Wh.y, r: (1 + Math.random()) * u, ph: Math.random() * TAU });
    }
    // the waterspout: a spinning funnel of bubbles that reaches down from the stormy surface
    const SP = S.spout;
    if (SP.active && SP.depth > 2) {
      const top = waveY(SP.x);
      ctx.save();
      const g = ctx.createLinearGradient(0, top, 0, top + SP.depth);
      g.addColorStop(0, `rgba(230,240,248,${(0.35 * SP.fade).toFixed(3)})`); g.addColorStop(1, "rgba(230,240,248,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(SP.x - 34 * u, top);
      for (let j = 0; j <= 12; j++) { const fr = j / 12; ctx.lineTo(SP.x - (34 - fr * 28) * u + Math.sin(t * 3 + fr * 6) * 4 * u * fr, top + fr * SP.depth); }
      for (let j = 12; j >= 0; j--) { const fr = j / 12; ctx.lineTo(SP.x + (34 - fr * 28) * u + Math.sin(t * 3 + fr * 6) * 4 * u * fr, top + fr * SP.depth); }
      ctx.closePath(); ctx.fill();
      for (let i = 0; i < 46; i++) {
        const hf = (t * 0.45 + i / 46) % 1, ang = t * 5 + i * 0.9 + hf * 8, r = (1 - hf) * 30 * u + 5 * u;
        const front = Math.sin(ang) > 0;
        ctx.fillStyle = `rgba(245,250,255,${((front ? 0.75 : 0.3) * SP.fade * (1 - hf * 0.6)).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(SP.x + Math.cos(ang) * r, top + hf * SP.depth, (front ? 2 : 1.3) * u, 0, TAU); ctx.fill();
      }
      ctx.fillStyle = `rgba(250,252,255,${(0.6 * SP.fade).toFixed(3)})`; ctx.beginPath(); ctx.ellipse(SP.x, top + 2 * u, 46 * u, 6 * u, 0, 0, TAU); ctx.fill();
      ctx.restore();
      if (Math.random() < 0.4 * k) ripples.push({ x: SP.x + (Math.random() - 0.5) * 60 * u, r: 1, a: 0.6 });
    }
    // the sardine run: a river of silver fish, with dolphins and diving gannets in among them
    const R = S.sardines;
    if (R.active) {
      R.x += R.dir * 1.3 * u * k; R.ph += 0.06 * k;
      ctx.save();
      ctx.fillStyle = sh("#c8d8e4");
      ctx.beginPath();
      for (const [ox, oy, p] of R.fish) {
        const x = R.x + ox + Math.sin(R.ph + p) * 10 * u, wob = Math.sin(ox * 0.004 + R.ph * 0.7) * 30 * u, y = R.cy + oy * 46 * u * (1 - Math.abs(ox) / R.len) + wob + Math.cos(R.ph * 1.3 + p) * 4 * u;
        if (x < -20 * u || x > W + 20 * u) continue;
        ctx.moveTo(x + R.dir * 6 * u, y); ctx.lineTo(x - R.dir * 4 * u, y - 1.8 * u); ctx.lineTo(x - R.dir * 7 * u, y - 3 * u); ctx.lineTo(x - R.dir * 6 * u, y); ctx.lineTo(x - R.dir * 7 * u, y + 3 * u); ctx.lineTo(x - R.dir * 4 * u, y + 1.8 * u); ctx.closePath();
      }
      ctx.fill();
      ctx.restore();
      for (let i = 0; i < 3; i++) {
        const dx = R.x + R.dir * (R.len * 0.15 - i * R.len * 0.22), dy = R.cy + Math.sin(R.ph * 0.8 + i * 2) * 60 * u;
        if (dx > -120 * u && dx < W + 120 * u) drawDolphin(dx, dy, R.dir, Math.cos(R.ph * 0.8 + i * 2) * 0.35, 90 * u, R.ph * 2 + i);
      }
      if (water.surface) {
        R.plungeT -= k / 60;
        if (R.plungeT <= 0) { R.plungeT = 0.7 + Math.random() * 1.2; const px = R.x + (Math.random() - 0.5) * R.len * 0.6; if (px > 0 && px < W) { R.plunges.push({ x: px, y: waveY(px), vy: 5 * u, life: 1 }); splash(px); sfxSplash(0.25); } }
        R.plunges = R.plunges.filter(p => {
          p.y += p.vy * k; p.vy *= Math.pow(0.95, k); p.life -= k / 60 / 1.4;
          if (Math.random() < 0.5) bubbles.push({ x: p.x + (Math.random() - 0.5) * 4 * u, y: p.y - 6 * u, r: (0.8 + Math.random()) * u, ph: Math.random() * TAU });
          drawGannet({ x: p.x, cy: p.y, dir: R.dir, s: 30 * u, ph: 0, st: "plunge", vx: R.dir * 0.4 * u, vy: p.vy, turn: R.dir });
          return p.life > 0 && p.vy > 0.5 * u;
        });
      }
      const tail = R.dir > 0 ? R.x - R.len * 0.6 : R.x + R.len * 0.6;
      if (R.dir > 0 ? tail > W + 40 * u : tail < -40 * u) R.active = false;
    }
  }

  // The Leviathan: an enormous shape far away in the dark, bigger than any whale, with one glowing eye.
  function drawLeviathan(k) {
    const Lv = scene.leviathan;
    if (!Lv || !Lv.active) return;
    Lv.x += Lv.dir * 0.4 * u * k; Lv.ph += 0.01 * k;
    const L = Lv.size, n = 36, top = [], bot = [];
    for (let i = 0; i <= n; i++) {
      const fr = i / n, x = Lv.x + Lv.dir * L * (0.5 - fr), y = Lv.y + Math.sin(Lv.ph * 2 - fr * 4) * L * 0.025 * fr;
      const w = L * (fr < 0.12 ? 0.035 + fr * 0.45 : 0.09 * (1 - (fr - 0.12) * 1.02) + 0.004);
      top.push([x, y - w]); bot.push([x, y + w * 0.8]);
    }
    ctx.save(); ctx.globalAlpha = 0.6;
    ctx.fillStyle = sh("#0a141c");
    ctx.beginPath(); top.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); for (let i = bot.length - 1; i >= 0; i--) ctx.lineTo(bot[i][0], bot[i][1]); ctx.closePath(); ctx.fill();
    // a ridge of spikes along the back, two great flippers and a split tail
    ctx.beginPath();
    for (let i = 3; i < n - 2; i += 2) { const [x, y] = top[i], h = L * 0.03 * (1 - i / n); ctx.moveTo(x - Lv.dir * L * 0.01, y + 2 * u); ctx.lineTo(x + Lv.dir * L * 0.008, y - h); ctx.lineTo(x + Lv.dir * L * 0.02, y + 2 * u); }
    for (const [i, len] of [[8, 0.16], [16, 0.12]]) { const [x, y] = bot[i], sw = Math.sin(Lv.ph * 3 + i) * 0.2; ctx.moveTo(x, y - 4 * u); ctx.lineTo(x - Lv.dir * L * len * Math.cos(0.9 + sw), y + L * len * Math.sin(0.9 + sw)); ctx.lineTo(x - Lv.dir * L * 0.05, y - 2 * u); }
    const [ex, ey] = top[n];
    ctx.moveTo(ex, ey); ctx.lineTo(ex - Lv.dir * L * 0.06, ey - L * 0.06); ctx.lineTo(ex - Lv.dir * L * 0.02, ey + L * 0.002); ctx.lineTo(ex - Lv.dir * L * 0.06, ey + L * 0.06); ctx.closePath();
    ctx.fill();
    ctx.restore();
    // the eye glows
    const hx = top[2][0], hy = (top[2][1] + bot[2][1]) / 2 - L * 0.01;
    Lv.eye = [hx, hy];
    const blink = Math.sin(Lv.ph * 1.3) > 0.97 ? 0.2 : 1;
    ctx.fillStyle = sca("#ffd27a", 0.22 * blink); ctx.beginPath(); ctx.arc(hx, hy, L * 0.016, 0, TAU); ctx.fill();
    ctx.fillStyle = sca("#ffd27a", 0.95 * blink); ctx.beginPath(); ctx.ellipse(hx, hy, L * 0.006, L * 0.004, 0, 0, TAU); ctx.fill();
    if (!Lv.logged && spot("leviathan", hx, hy, 80 * u)) { Lv.logged = true; seen("leviathan", [hx, hy]); }
    if (Lv.dir > 0 ? Lv.x > W + L * 0.6 : Lv.x < -L * 0.6) { if (Lv.shiny) Lv.dir *= -1; else Lv.active = false; }
  }

  // The sky moments and the ghost lighthouse are drawn on top, after the night has darkened the water.
  function drawWave6Sky(k) {
    const S = scene;
    if (!S.net) return;
    // shooting stars streak across the surface and their light flickers down into the water
    for (const m of S.meteor.list) {
      if (m.age < 0) continue;
      const p = m.age / 1.4, x = m.x + m.dir * p * 260 * u, y = 2 * u + p * 6 * u, a = Math.sin(p * Math.PI);
      const g = ctx.createLinearGradient(x, y, x - m.dir * 110 * u, y - 4 * u);
      g.addColorStop(0, `rgba(255,252,230,${a.toFixed(3)})`); g.addColorStop(1, "rgba(255,252,230,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 2.2 * u; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - m.dir * 110 * u, y - 4 * u); ctx.stroke();
      ctx.fillStyle = `rgba(255,250,220,${(0.08 * a).toFixed(3)})`;
      ctx.beginPath(); ctx.moveTo(x - 20 * u, waveY(x)); ctx.lineTo(x + 20 * u, waveY(x)); ctx.lineTo(x + 60 * u, H * 0.5); ctx.lineTo(x - 60 * u, H * 0.5); ctx.fill();
      ctx.strokeStyle = `rgba(255,250,220,${(0.6 * a).toFixed(3)})`; ctx.lineWidth = 1.5 * u;
      ctx.beginPath(); ctx.moveTo(x - 30 * u, waveY(x - 30 * u) + 2 * u); ctx.lineTo(x + 30 * u, waveY(x + 30 * u) + 2 * u); ctx.stroke();
    }
    // a lunar eclipse: the full moon's reflection turns a deep copper red
    const E = S.eclipse;
    if (E.active && E.fade > 0 && S.moon) {
      const m = S.moon, r = 16 * u, x = m.x + Math.sin(t * 0.8) * 2 * u, y = waveY(m.x) + 34 * u;
      ctx.fillStyle = `rgba(60,12,6,${(0.12 * E.fade).toFixed(3)})`; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.globalAlpha = E.fade * Math.max(0.3, night);
      const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
      g.addColorStop(0, "#d86a3a"); g.addColorStop(1, "#7a1e12");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 1.02, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(200,70,40,0.15)"; ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, TAU); ctx.fill();
      ctx.restore();
    }
    // the ghost lighthouse: a lighthouse that is not there, whose beam sweeps through the water
    const Lh = S.lighthouse;
    if (Lh) {
      Lh.ph += 0.01 * k;
      Lh.horn = (Lh.horn === undefined ? 3 : Lh.horn) - k / 60;
      if (Lh.horn <= 0) { Lh.horn = 14 + Math.random() * 8; sfxFoghorn(); }
      const lx = Lh.x, ly = -60 * u, ang = Math.PI / 2 + Math.sin(t * 0.5 + Lh.ph) * 1.05, half = 0.09, len = H * 1.3;
      const strength = 0.08 + 0.2 * night;
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      const g = ctx.createLinearGradient(lx, ly, lx + Math.cos(ang) * len, ly + Math.sin(ang) * len);
      g.addColorStop(0, sca("#dcffe6", strength * 1.6)); g.addColorStop(1, sca("#dcffe6", 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + Math.cos(ang - half) * len, ly + Math.sin(ang - half) * len); ctx.lineTo(lx + Math.cos(ang + half) * len, ly + Math.sin(ang + half) * len); ctx.closePath(); ctx.fill();
      ctx.restore();
      // its reflection wavers just under the surface
      const top = waveY(lx);
      ctx.save(); ctx.globalAlpha = 0.25 + 0.35 * night;
      for (let i = 0; i < 12; i++) {
        const y = top + 6 * u + i * 6 * u, w = (7 + i * 0.7) * u, off = Math.sin(t * 2 + i * 0.9) * 2.5 * u;
        ctx.fillStyle = sca(i % 4 < 2 ? "#e8f8f0" : "#c85a5a", 0.5 * (1 - i / 14));
        ctx.fillRect(lx - w / 2 + off, y, w, 5 * u);
      }
      const blink = 0.5 + 0.5 * Math.sin(t * 3);
      ctx.fillStyle = sca("#dcffe6", 0.6 * blink); ctx.beginPath(); ctx.arc(lx, top + 82 * u, 5 * u, 0, TAU); ctx.fill();
      ctx.restore();
      if (!Lh.logged && diverMode) {
        const da = Math.atan2(diver.y - ly, diver.x - lx);
        if ((Math.abs(da - ang) < half * 0.8 || lit(lx, top + 40 * u, 30 * u)) && hold("lighthouse", [lx, top + 40 * u])) { Lh.logged = true; seen("lighthouse", [diver.x, diver.y]); }
      }
    }
  }

  // ---- logbook pictures of the moments and legends ------------------------------------
  Object.assign(THUMBS, {
    ghostnet: () => {
      drawGaribaldi({ x: 60, cy: 44, dir: 1, s: 46, ph: 1 });
      ctx.strokeStyle = "rgba(170,195,170,0.85)"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let j = 0; j <= 5; j++) for (let i = 0; i <= 8; i++) { const x = 22 + i * 9.5, y = 18 + j * 10 + Math.sin(i / 8 * Math.PI) * 6; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      for (let i = 0; i <= 8; i++) for (let j = 0; j <= 5; j++) { const x = 22 + i * 9.5, y = 18 + j * 10 + Math.sin(i / 8 * Math.PI) * 6; j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke();
      ctx.fillStyle = "#e0702a"; for (let i = 0; i <= 8; i += 2) { ctx.beginPath(); ctx.arc(22 + i * 9.5, 15, 2.6, 0, TAU); ctx.fill(); }
    },
    waterspout: () => {
      ctx.fillStyle = "rgba(30,40,55,0.5)"; ctx.fillRect(0, 0, TW, 12);
      ctx.fillStyle = "rgba(220,230,240,0.35)"; ctx.beginPath(); ctx.moveTo(40, 12); ctx.lineTo(80, 12); ctx.lineTo(64, 78); ctx.lineTo(56, 78); ctx.fill();
      for (let i = 0; i < 30; i++) { const hf = i / 30, ang = i * 1.3, r = (1 - hf) * 20 + 3; ctx.fillStyle = `rgba(250,252,255,${Math.sin(ang) > 0 ? 0.85 : 0.35})`; ctx.beginPath(); ctx.arc(60 + Math.cos(ang) * r, 14 + hf * 62, 1.6, 0, TAU); ctx.fill(); }
      ctx.fillStyle = "rgba(250,252,255,0.7)"; ctx.beginPath(); ctx.ellipse(60, 13, 30, 4, 0, 0, TAU); ctx.fill();
    },
    whirlpool: () => {
      ctx.save(); ctx.translate(60, 44); ctx.scale(1, 0.55); ctx.lineCap = "round";
      for (let arm = 0; arm < 5; arm++) { ctx.strokeStyle = "rgba(235,248,255,0.6)"; ctx.lineWidth = 2.4; ctx.beginPath(); for (let j = 0; j <= 28; j++) { const fr = j / 28, a = arm * TAU / 5 + fr * 4.2, r = 54 * (1 - fr * 0.85); j ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.stroke(); }
      ctx.fillStyle = "rgba(0,10,20,0.35)"; ctx.beginPath(); ctx.arc(0, 0, 12, 0, TAU); ctx.fill();
      ctx.restore();
    },
    sardinerun: () => {
      ctx.fillStyle = "#c8d8e4"; ctx.beginPath();
      for (let i = 0; i < 90; i++) { const x = 4 + (i * 53) % 112, y = 30 + ((i * 29) % 30) - Math.abs(x - 60) * 0.1, d = 1; ctx.moveTo(x + d * 4, y); ctx.lineTo(x - 3, y - 1.4); ctx.lineTo(x - 5, y - 2.4); ctx.lineTo(x - 4, y); ctx.lineTo(x - 5, y + 2.4); ctx.lineTo(x - 3, y + 1.4); ctx.closePath(); }
      ctx.fill();
      drawDolphin(34, 66, 1, -0.15, 44, 0.5);
      drawGannet({ x: 92, cy: 18, dir: 1, s: 26, ph: 0, st: "plunge", vx: 0.3, vy: 3 });
    },
    meteor: () => {
      ctx.fillStyle = "#06101c"; ctx.fillRect(0, 0, TW, TH);
      ctx.fillStyle = "rgba(255,255,255,0.8)"; for (let i = 0; i < 16; i++) { ctx.beginPath(); ctx.arc((Math.sin(i * 12.9) * 0.5 + 0.5) * TW, (Math.sin(i * 78.2) * 0.5 + 0.5) * 44, 0.7, 0, TAU); ctx.fill(); }
      const g = ctx.createLinearGradient(96, 18, 24, 4); g.addColorStop(0, "rgba(255,252,230,1)"); g.addColorStop(1, "rgba(255,252,230,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 2.4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(96, 18); ctx.lineTo(24, 4); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, 54); for (let x = 0; x <= TW; x += 6) ctx.lineTo(x, 54 + Math.sin(x * 0.15) * 1.5); ctx.stroke();
      ctx.strokeStyle = "rgba(255,250,220,0.55)"; ctx.beginPath(); ctx.moveTo(70, 58); ctx.lineTo(104, 58); ctx.stroke();
    },
    eclipse: () => {
      ctx.fillStyle = "#0a0e1a"; ctx.fillRect(0, 0, TW, TH);
      const g = ctx.createRadialGradient(54, 36, 3, 60, 42, 22); g.addColorStop(0, "#d86a3a"); g.addColorStop(1, "#7a1e12");
      ctx.fillStyle = "rgba(200,70,40,0.18)"; ctx.beginPath(); ctx.arc(60, 42, 34, 0, TAU); ctx.fill();
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(60, 42, 22, 0, TAU); ctx.fill();
    },
    leviathan: () => {
      ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = sh("#0a141c");
      ctx.beginPath(); ctx.moveTo(116, 40); ctx.quadraticCurveTo(110, 26, 92, 24); ctx.quadraticCurveTo(50, 22, 14, 38); ctx.lineTo(2, 30); ctx.lineTo(8, 42); ctx.lineTo(2, 54); ctx.lineTo(14, 46); ctx.quadraticCurveTo(50, 60, 92, 56); ctx.quadraticCurveTo(110, 54, 116, 40); ctx.fill();
      for (let i = 0; i < 8; i++) { const x = 92 - i * 10; ctx.beginPath(); ctx.moveTo(x - 3, 25 + i * 1.4); ctx.lineTo(x, 17 + i * 1.6); ctx.lineTo(x + 3, 25 + i * 1.4); ctx.fill(); }
      ctx.beginPath(); ctx.moveTo(84, 54); ctx.lineTo(70, 74); ctx.lineTo(74, 54); ctx.fill();
      ctx.restore();
      ctx.fillStyle = sca("#ffd27a", 0.3); ctx.beginPath(); ctx.arc(104, 36, 7, 0, TAU); ctx.fill();
      ctx.fillStyle = sca("#ffd27a", 1); ctx.beginPath(); ctx.ellipse(104, 36, 2.6, 1.8, 0, 0, TAU); ctx.fill();
    },
    lighthouse: () => {
      ctx.fillStyle = "#081420"; ctx.fillRect(0, 0, TW, TH);
      const g = ctx.createLinearGradient(70, -10, 40, 84); g.addColorStop(0, sca("#dcffe6", 0.55)); g.addColorStop(1, sca("#dcffe6", 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(74, -10); ctx.lineTo(18, 84); ctx.lineTo(56, 84); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, 10); for (let x = 0; x <= TW; x += 6) ctx.lineTo(x, 10 + Math.sin(x * 0.15) * 1.5); ctx.stroke();
      for (let i = 0; i < 10; i++) { const w = 8 + i * 0.8; ctx.fillStyle = sca(i % 4 < 2 ? "#e8f8f0" : "#c85a5a", 0.7 * (1 - i / 12)); ctx.fillRect(74 - w / 2 + Math.sin(i * 0.9) * 2, 14 + i * 5, w, 4); }
      ctx.fillStyle = sca("#dcffe6", 0.8); ctx.beginPath(); ctx.arc(74, 68, 4, 0, TAU); ctx.fill();
    },
  });

  // sonar for the two new legends
  Object.assign(SONAR_HINTS, {
    leviathan: ["Je sonar komt terug van iets dat groter is dan een berg...", "Your sonar bounces off something bigger than a mountain..."],
    lighthouse: ["Een misthoorn antwoordt, ver weg... maar er is geen kust.", "A foghorn answers, far away... but there is no coast."],
  });

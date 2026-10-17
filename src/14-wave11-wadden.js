  // ---- the eleventh round: more of the Wadden Sea ---------------------------------------------------
  // Five animals of the tidal flats and the North Sea coast, so the smallest water gets a fuller logbook: a shore crab,
  // a flounder, a whelk, an eelpout and a grey seal. Like the rounds before they roll from their own random stream
  // (stream: true in the table at the end), so the oceans that already existed stay exactly the same.

  // ---- shore crab ---------------------------------------------------------------------------------------------
  // The common crab of the Wadden Sea: an olive-green shell with five teeth on each side of the eyes, and an orange
  // underside. It walks sideways over the sand and lifts its claws when the diver comes close.
  const SCR_SHELL = "M -30 -14 C -33 -26 -26 -38 -14 -40 L 14 -40 C 26 -38 33 -26 30 -14 C 22 -8 -22 -8 -30 -14 Z";
  const SCR_CLAW = "M 0 0 C 4 -6 12 -7 16 -3 C 18 0 16 4 12 5 C 8 6 2 5 0 0 Z";
  function drawShoreCrab(f) {
    const s = f.s, walk = Math.sin(f.ph * 6);
    if (f.raise === undefined) f.raise = 0;
    f.raise += ((near(f.x, f.cy - s * 0.2, 110 * u) > 0 ? 1 : 0) - f.raise) * 0.08 * frameK;
    sandShadow(f, s * 0.42);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const shell = sh("#5e6a38"), dark = sh("#3e4824"), rim = sh("#7a8446"), leg = sh("#4c5630"), tip = sh("#2a2e1c"), belly = sh("#c8803a");
    // four walking legs on each side, stepping in turn
    ctx.strokeStyle = leg; ctx.lineWidth = 2.6; ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const side of [-1, 1]) for (let i = 0; i < 4; i++) {
      const step = Math.sin(f.ph * 6 + i * 1.6 + (side > 0 ? 0 : Math.PI)) * 2.5;
      ctx.beginPath(); ctx.moveTo(side * (14 + i * 2), -16 + i * 1.5);
      ctx.lineTo(side * (32 + i * 3), -24 + i * 3 + step * 0.5); ctx.lineTo(side * (38 + i * 4) + step, -1); ctx.stroke();
    }
    // the orange underside shows below the shell
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(0, -12, 24, 4, 0, 0, TAU); ctx.fill();
    // the shell, with five teeth on each side and a darker back
    fillWith(P(SCR_SHELL), shell);
    ctx.fillStyle = shell; ctx.beginPath();
    for (const side of [-1, 1]) for (let t = 0.12; t < 0.95; t += 0.19) {
      const x = side * (14 + 16 * t), y = -40 + 22 * t;
      ctx.moveTo(x, y); ctx.lineTo(x + side * 5, y - 2.5); ctx.lineTo(x + side * 1.5, y + 3.2); ctx.closePath();
    }
    ctx.fill();
    paintInside(P(SCR_SHELL), dark, P("M -40 -46 L 40 -46 L 40 -30 C 20 -26 -20 -26 -40 -30 Z"));
    ctx.fillStyle = rim; ctx.beginPath(); ctx.ellipse(0, -33, 16, 2.6, 0, 0, TAU); ctx.fill();
    // the claws, lifted when the diver is near
    for (const side of [-1, 1]) {
      ctx.save(); ctx.translate(side * 20, -18); ctx.scale(side, 1); ctx.rotate(-0.45 - f.raise * 0.7 + walk * 0.04);
      ctx.strokeStyle = leg; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(10, 2); ctx.stroke();
      ctx.translate(9, 2); ctx.scale(1.35, 1.35); fillWith(P(SCR_CLAW), rim);
      ctx.fillStyle = tip; ctx.beginPath(); ctx.moveTo(14, -3); ctx.lineTo(19, -1); ctx.lineTo(15, 1); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    // eyes on short stalks between the front teeth
    ctx.strokeStyle = dark; ctx.lineWidth = 1.6;
    for (const x of [-5, 5]) { ctx.beginPath(); ctx.moveTo(x, -39); ctx.lineTo(x * 1.2, -43); ctx.stroke(); eye(x * 1.2, -44, 2); }
    ctx.restore();
  }

  // ---- flounder -------------------------------------------------------------------------------------------
  // A flatfish like the plaice, but plain brown-olive with dark and pale flecks and a row of rough bumps along its
  // fins, and no orange spots. It lies in the sand and glides off when disturbed (moveFlatfish, as the plaice does).
  function drawFlounder(f) {
    const s = f.s, b = f.bury || 0, swim = f.go > 0;
    sandShadow(f, s * 0.45);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100 * 0.42);
    const body = sh("#6f6448"), fin = sh("#857a5a"), blot = sh("#4e4632"), fleck = sh("#a39874"), bump = sh("#5a5038");
    ctx.save(); ctx.translate(-40, 0); ctx.rotate(Math.sin(f.ph * 3) * (swim ? 0.3 : 0.05)); fillWith(P(FLAT_TAIL), fin); ctx.restore();
    ctx.save(); ctx.scale(1.1, 1.12 + Math.sin(f.ph * 3) * (swim ? 0.06 : 0.01)); fillWith(P(FLAT_BODY), fin); ctx.restore();
    fillWith(P(FLAT_BODY), body);
    ctx.save(); ctx.clip(P(FLAT_BODY));
    ctx.fillStyle = blot; ctx.beginPath();
    for (const [x, y, r] of [[22, -12, 5], [4, -18, 6], [-16, -10, 5], [12, 10, 6], [-8, 16, 5], [-28, 2, 4]]) { ctx.moveTo(x + r, y); ctx.ellipse(x, y, r, r * 0.8, 0.3, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = fleck; ctx.beginPath();
    for (const [x, y] of [[30, -2], [14, -4], [-4, 4], [-20, -18], [0, 24], [-30, 12], [20, 20], [6, -26]]) { ctx.moveTo(x + 2, y); ctx.arc(x, y, 2, 0, TAU); }
    ctx.fill();
    ctx.restore();
    // the row of rough bumps along the base of the fins
    ctx.fillStyle = bump; ctx.beginPath();
    for (let i = 0; i < 9; i++) { const a = -2.6 + i * 0.58, x = Math.cos(a) * 40, y = Math.sin(a) * 26; ctx.moveTo(x + 1.6, y); ctx.arc(x, y, 1.6, 0, TAU); }
    ctx.fill();
    if (b > 0.02) {
      ctx.save(); ctx.clip(P(FLAT_EDGE)); ctx.globalAlpha *= b * 0.9; ctx.fillStyle = water.sand[0]; ctx.fillRect(-70, -40, 130, 80); ctx.restore();
    }
    // the two eyes on the upper side, always peeking out of the sand
    for (const [x, y] of [[32, -10], [36, 3]]) {
      ctx.fillStyle = sh("#9a8e6a"); ctx.beginPath(); ctx.ellipse(x, y - 3, 4, 7, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.ellipse(x + 1, y - 4, 2, 4, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  // ---- whelk -----------------------------------------------------------------------------------------------
  // A big sea snail with a pointed, ribbed shell. It creeps over the bottom on its broad foot and smells its way
  // with a long siphon held up like a snorkel. When the diver comes close it pulls the siphon in.
  const WHK_SHELL = "M 30 -16 C 28 -36 8 -44 -12 -40 L -56 -44 C -44 -34 -38 -26 -32 -18 C -22 -8 10 -4 30 -16 Z";
  function drawWhelk(f) {
    const s = f.s;
    if (f.tube === undefined) f.tube = 1;
    f.tube += ((near(f.x, f.cy - s * 0.3, 100 * u) > 0 ? 0 : 1) - f.tube) * 0.06 * frameK;
    sandShadow(f, s * 0.45);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const foot = sh("#d6c7a2"), mottle = sh("#a8946a"), tube = sh("#8a7656"), shell = sh("#c9b48a"), dark = sh("#9c8560"), mouth = sh("#e8d8b0");
    // the broad foot, a little mottled, rippling as it creeps
    ctx.fillStyle = foot; ctx.beginPath(); ctx.ellipse(6, -4, 38, 6 + Math.sin(f.ph * 2) * 0.6, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = mottle; ctx.beginPath();
    for (const x of [-22, -6, 10, 26]) { ctx.moveTo(x + 3, -4); ctx.ellipse(x, -4, 3, 1.4, 0, 0, TAU); }
    ctx.fill();
    // two feelers with tiny eyes, and the siphon held up like a snorkel
    ctx.strokeStyle = tube; ctx.lineCap = "round"; ctx.lineWidth = 1.3;
    for (const dy of [0, 3]) { ctx.beginPath(); ctx.moveTo(36, -8 + dy); ctx.lineTo(50, -12 + dy + Math.sin(f.ph * 2 + dy) * 1.5); ctx.stroke(); }
    if (f.tube > 0.05) {
      const t = f.tube, sway = Math.sin(f.ph * 1.6) * 3;
      ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(26, -18); ctx.quadraticCurveTo(38 + sway, -22 - 6 * t, 40 + sway * 1.4, -20 - 16 * t); ctx.stroke();
      ctx.fillStyle = mouth; ctx.beginPath(); ctx.ellipse(40 + sway * 1.4, -20 - 16 * t, 2.6, 1.4, 0, 0, TAU); ctx.fill();
    }
    // the shell: a light body whorl, darker towards the pointed top, with the lines of the whorls and a few ribs
    fillWith(P(WHK_SHELL), shell);
    paintInside(P(WHK_SHELL), dark, P("M -70 -60 L -14 -60 L -18 -30 L -70 -30 Z"));
    ctx.save(); ctx.clip(P(WHK_SHELL));
    ctx.strokeStyle = dark; ctx.lineWidth = 1.2;
    for (const x of [-16, -27, -37, -46]) { ctx.beginPath(); ctx.moveTo(x - 2, -26 - (x + 16) * -0.2); ctx.quadraticCurveTo(x + 3, -34, x + 2, -44 - (x + 16) * -0.05); ctx.stroke(); }
    for (const x of [-12, 0, 12]) { ctx.beginPath(); ctx.moveTo(x - 6, -38); ctx.quadraticCurveTo(x - 2, -24, x + 2, -10); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle = mouth; ctx.beginPath(); ctx.ellipse(22, -18, 7, 4, -0.5, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ---- eelpout ---------------------------------------------------------------------------------------------
  // A long, brown fish with a dark-blotched back and one fin that runs from its back round the tail to its belly.
  // It stays close to the bottom among stones and weed. The females give birth to live young.
  const ELP_BODY = "M 50 0 C 50 -6 44 -10 34 -10 C 10 -10 -20 -7 -46 -2 L -50 0 L -46 2 C -20 7 10 10 34 10 C 44 10 50 6 50 0 Z";
  const ELP_PEC = "M 0 0 C -2 -6 -10 -9 -15 -5 C -16 0 -12 6 -5 6 C -2 5 0 3 0 0 Z";
  function drawEelpout(f) {
    const s = f.s, w = f.ph * 2.4;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(Math.sin(f.ph * 1.2) * 0.04);
    const body = sh("#8a7048"), back = sh("#5c4a30"), belly = sh("#d8c49a"), fin = sh("#6e5a3a"), blot = sh("#4a3a24"), pec = sh("#9a8058");
    // the long fin along the back and the belly, waving as it swims
    ctx.fillStyle = fin; ctx.beginPath(); ctx.moveTo(30, -9);
    for (let x = 30; x >= -50; x -= 4) ctx.lineTo(x, -9 + (30 - x) * 0.1 - 4 - Math.sin(w + x * 0.12) * 1.2);
    ctx.lineTo(-52, 0);
    for (let x = -50; x <= 6; x += 4) ctx.lineTo(x, 4 + (6 - x) * 0.02 + 4 + Math.sin(w + x * 0.12) * 1.2);
    ctx.lineTo(6, 9); ctx.closePath(); ctx.fill();
    fillWith(P(ELP_BODY), body);
    paintInside(P(ELP_BODY), back, P("M 60 -20 L -60 -20 L -60 -1 C -20 -3 20 -5 60 -3 Z"));
    paintInside(P(ELP_BODY), belly, P("M 50 3 C 30 5 0 5 -40 3 L -40 14 L 50 14 Z"));
    // the dark blotches along its back
    ctx.save(); ctx.clip(P(ELP_BODY)); ctx.fillStyle = blot; ctx.beginPath();
    for (const x of [20, 6, -8, -22, -34]) { ctx.moveTo(x + 4, -6); ctx.ellipse(x, -6, 4, 3, 0, 0, TAU); }
    ctx.fill(); ctx.restore();
    // thick lips, a big fan of a pectoral fin and the eye
    ctx.fillStyle = back; ctx.beginPath(); ctx.ellipse(48, 2, 3.4, 2.2, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(30, 4); ctx.rotate(Math.sin(f.ph * 3) * 0.2); fillWith(P(ELP_PEC), pec); ctx.restore();
    eye(41, -4, 2.4);
    ctx.restore();
  }

  // ---- grey seal -------------------------------------------------------------------------------------------
  // The biggest predator of the Netherlands. Its long, straight "Roman nose" sets it apart from the rounder harbour
  // seal; its grey coat has dark blotches.
  const GSL_BODY = "M 52 1 L 34 -10 C 28 -12 22 -13 14 -14 C -6 -16 -28 -12 -42 -5 C -48 -2 -50 0 -52 1 C -48 4 -40 7 -28 10 C -10 14 10 13 24 9 C 34 7 44 6 50 4 C 52 3 52 2 52 1 Z";
  const GSL_FLIP = "M 0 0 C 4 6 2 15 -5 20 C -8 21 -9 18 -7 14 C -4 9 -4 4 -4 0 Z";
  const GSL_HIND = "M 0 -1 C -6 -6 -12 -8 -16 -6 C -12 -2 -12 2 -16 6 C -12 8 -6 6 0 1 Z";
  function drawGreySeal(f) {
    const s = f.s, sw = Math.sin(f.ph * 1.8);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(Math.sin(f.ph * 0.9) * 0.03);
    const body = sh("#6a6c70"), dark = sh("#3a3c40"), belly = sh("#b8b6ae"), blot = sh("#2a2c30");
    ctx.save(); ctx.translate(-51, 1); ctx.rotate(sw * 0.3); fillWith(P(GSL_HIND), dark); ctx.restore();
    ctx.save(); ctx.translate(14, 6); ctx.rotate(0.4 + sw * 0.2); fillWith(P(GSL_FLIP), dark); ctx.restore();
    fillWith(P(GSL_BODY), body);
    ctx.save(); ctx.clip(P(GSL_BODY));
    ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(-6, -12, 46, 6, -0.04, 0, TAU); ctx.fill();
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(-2, 11, 44, 5.4, 0.04, 0, TAU); ctx.fill();
    // the dark blotches of its coat
    ctx.fillStyle = blot; ctx.beginPath();
    for (const [x, y, rx, ry] of [[18, 1, 3.6, 2.2], [6, -4, 4.4, 2.4], [-8, 2, 4, 2.2], [-20, -4, 4.6, 2.2], [-32, 1, 3.6, 1.8], [-2, 6, 3, 1.6], [26, -4, 2.6, 1.6]]) { ctx.moveTo(x + rx, y); ctx.ellipse(x, y, rx, ry, 0.2, 0, TAU); }
    ctx.fill();
    ctx.restore();
    // the long straight nose with its whiskers, and a dark eye high on the head
    ctx.strokeStyle = belly; ctx.lineWidth = 0.6; ctx.beginPath();
    for (const a of [-0.3, 0, 0.3]) { ctx.moveTo(48, 2); ctx.lineTo(57, 2 + a * 8); }
    ctx.stroke();
    ctx.fillStyle = "#101214"; ctx.beginPath(); ctx.arc(51, 0.5, 1.2, 0, TAU); ctx.fill();
    eye(33, -6, 2, "#101214");
    ctx.save(); ctx.translate(18, 7); ctx.rotate(0.2 - sw * 0.25); fillWith(P(GSL_FLIP), body); ctx.restore();
    ctx.restore();
  }

  // ---- the table of the eleventh round -------------------------------------------------------------------
  const W11_FAUNA = {
    shorecrab: { kind: "floor", size: [16, 20], count: [1, 3], crawl: 0.15, draw: drawShoreCrab, thumb: 80, stream: true },
    flounder: { kind: "floor", size: [24, 30], count: [1, 2], draw: drawFlounder, move: moveFlatfish, thumb: 80, stream: true },
    whelk: { kind: "floor", size: [14, 18], count: [1, 2], crawl: 0.03, draw: drawWhelk, thumb: 80, stream: true },
    eelpout: { kind: "glide", size: [30, 38], lift: [6, 16], speed: 0.2, draw: drawEelpout, thumb: 96, stream: true },
    greyseal: { kind: "swim", size: [82, 96], band: [0.25, 0.6], speed: 0.55, draw: drawGreySeal, thumb: 104, stream: true },
  };
  Object.assign(FAUNA, W11_FAUNA);
  hookFauna(W11_FAUNA, {});

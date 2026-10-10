  // ---- the fourth wave of animals -------------------------------------------
  // Thirty-six more animals, all run by one small system: swimmers in open water, gliders just above the floor,
  // animals that sit or crawl on the floor, animals at the surface, a diving cormorant, and visitors that pass by.

  // ---- shared shapes ------------------------------------------------------------
  // A shark seen from the side, facing right, in local coordinates where L is its length.
  function sharkForm(L, top, belly, o = {}) {
    const upper = o.upper || 0.2, tip = o.tip;
    ctx.fillStyle = top;
    // tail
    ctx.beginPath(); ctx.moveTo(-L * 0.36, -L * 0.01);
    ctx.quadraticCurveTo(-L * (0.36 + upper * 0.5), -L * (upper * 0.55), -L * (0.36 + upper), -L * (upper * 0.75));
    ctx.quadraticCurveTo(-L * 0.42, -L * 0.02, -L * 0.44, 0);
    ctx.lineTo(-L * 0.5, L * 0.1); ctx.quadraticCurveTo(-L * 0.42, L * 0.04, -L * 0.36, L * 0.02); ctx.closePath(); ctx.fill();
    // body
    ctx.beginPath(); ctx.moveTo(L * 0.5, 0);
    ctx.bezierCurveTo(L * 0.42, -L * 0.1, L * 0.05, -L * 0.11, -L * 0.37, -L * 0.02);
    ctx.lineTo(-L * 0.37, L * 0.02);
    ctx.bezierCurveTo(L * 0.05, L * 0.09, L * 0.42, L * 0.08, L * 0.5, 0); ctx.fill();
    // fins
    ctx.beginPath(); ctx.moveTo(L * 0.1, -L * 0.08); ctx.quadraticCurveTo(L * 0.02, -L * 0.22, -L * 0.06, -L * 0.24); ctx.lineTo(-L * 0.06, -L * 0.07); ctx.fill();
    ctx.beginPath(); ctx.moveTo(L * 0.18, L * 0.05); ctx.quadraticCurveTo(L * 0.06, L * 0.18, -L * 0.02, L * 0.19); ctx.lineTo(L * 0.06, L * 0.05); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-L * 0.2, -L * 0.04); ctx.lineTo(-L * 0.25, -L * 0.1); ctx.lineTo(-L * 0.27, -L * 0.035); ctx.fill();
    if (tip) {
      ctx.fillStyle = tip;
      ctx.beginPath(); ctx.moveTo(-L * 0.01, -L * 0.2); ctx.lineTo(-L * 0.06, -L * 0.24); ctx.lineTo(-L * 0.06, -L * 0.18); ctx.fill();
      ctx.beginPath(); ctx.moveTo(L * 0.02, L * 0.17); ctx.lineTo(-L * 0.02, L * 0.19); ctx.lineTo(L * 0.0, L * 0.15); ctx.fill();
      ctx.beginPath(); ctx.arc(-L * (0.36 + upper), -L * (upper * 0.75), L * 0.018, 0, TAU); ctx.fill();
    }
    // belly
    ctx.fillStyle = belly;
    ctx.beginPath(); ctx.moveTo(L * 0.46, L * 0.02);
    if (o.jagged) { for (let i = 0; i <= 8; i++) ctx.lineTo(L * (0.46 - i * 0.09), L * (0.02 + (i % 2) * 0.012)); }
    else ctx.quadraticCurveTo(L * 0.1, L * 0.02, -L * 0.3, L * 0.025);
    ctx.quadraticCurveTo(L * 0.05, L * 0.08, L * 0.46, L * 0.02); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = Math.max(0.7, L * 0.005);
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(L * (0.3 - i * 0.025), -L * 0.035); ctx.lineTo(L * (0.29 - i * 0.025), L * 0.02); ctx.stroke(); }
    ctx.fillStyle = "#0b0f12"; ctx.beginPath(); ctx.arc(L * 0.4, -L * 0.025, L * 0.013, 0, TAU); ctx.fill();
  }

  // A wavy body for snakes, from the head at +0.5 to the tail at -0.5.
  function snakePoints(s, ph) {
    const pts = [];
    for (let i = 0; i <= 16; i++) { const f = i / 16; pts.push([s * (0.5 - f), Math.sin(ph * 3 - f * 7) * s * 0.07 * (0.3 + f)]); }
    return pts;
  }

  // ---- fish ------------------------------------------------------------------
  // A Picasso triggerfish: a tilted diamond, the eye set far back, blue and black bands, a yellow lip line.
  const TRIG_BODY = "M 50 3 C 44 -10 30 -24 10 -30 C -6 -34 -24 -22 -36 -7 L -36 7 C -24 22 -6 32 8 30 C 28 26 44 14 50 3 Z";
  const TRIG_DORSAL = "M -2 -32 C -14 -42 -32 -26 -39 -8 L -34 -10 C -26 -22 -14 -30 -2 -32 Z";
  const TRIG_ANAL = "M -2 31 C -14 40 -32 26 -39 8 L -34 10 C -26 22 -14 29 -2 31 Z";
  const TRIG_TAIL = "M 0 0 L -14 -11 C -11 -4 -11 4 -14 11 Z";
  const TRIG_TOP = "M -60 -50 L 60 -50 L 60 -4 C 30 -8 0 -4 -60 0 Z";
  const TRIG_WEDGE = "M 6 -8 C 2 6 -8 20 -14 32 L 2 32 C 6 20 12 8 16 -4 Z";
  function drawTrigger(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir * s / 100, s / 100);
    const dark = sh("#1e1e22");
    ctx.save(); ctx.translate(-36, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.25); fillWith(P(TRIG_TAIL), dark); ctx.restore();
    const wave = Math.sin(f.ph * 3) * 0.06;
    ctx.save(); ctx.scale(1, 1 + wave); fillWith(P(TRIG_DORSAL), sh("#6a6450")); fillWith(P(TRIG_ANAL), sh("#6a6450")); ctx.restore();
    fillWith(P(TRIG_BODY), sh("#f2ead6"));
    paintInside(P(TRIG_BODY), sh("#bfae7a"), P(TRIG_TOP));
    paintInside(P(TRIG_BODY), dark, P(TRIG_WEDGE));
    ctx.save(); ctx.clip(P(TRIG_BODY)); ctx.lineCap = "round";
    // the rear stripes and the bands across the face
    ctx.strokeStyle = dark; ctx.lineWidth = 2.4;
    for (const x of [-20, -26, -32]) { ctx.beginPath(); ctx.moveTo(x, -2); ctx.lineTo(x - 5, 16); ctx.stroke(); }
    ctx.strokeStyle = sh("#3a7fe0"); ctx.lineWidth = 2.6;
    for (const x of [26, 18]) { ctx.beginPath(); ctx.moveTo(x, -30); ctx.lineTo(x - 12, 10); ctx.stroke(); }
    ctx.strokeStyle = dark; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(22, -30); ctx.lineTo(10, 10); ctx.stroke();
    ctx.strokeStyle = sh("#f2b820"); ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(48, 6); ctx.quadraticCurveTo(30, 12, 12, 8); ctx.stroke();
    ctx.restore();
    // trigger spine, pectoral fin, lips and the eye high up on the head
    ctx.strokeStyle = dark; ctx.lineWidth = 2.2; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(8, -30); ctx.lineTo(2, -40); ctx.stroke();
    ctx.fillStyle = "rgba(240,220,160,0.7)"; ctx.beginPath(); ctx.ellipse(8, 8, 6, 3, 0.5 + Math.sin(f.ph * 4) * 0.3, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#f2b820"); ctx.beginPath(); ctx.ellipse(48, 4, 3.4, 2.6, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#f2e8c8"; ctx.beginPath(); ctx.arc(22, -13, 4.6, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(22.6, -13, 3, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // A moon wrasse: a slender green torpedo with pink markings and a yellow crescent tail.
  const WRASSE_BODY = "M 50 1 C 46 -8 32 -14 12 -15 C -10 -15 -28 -10 -40 -4 L -40 4 C -28 10 -10 15 12 14 C 32 13 46 8 50 1 Z";
  const WRASSE_FIN = "M 30 -12 C 10 -20 -20 -17 -40 -5 L -36 -6 C -16 -14 10 -16 30 -12 Z";
  const WRASSE_TAIL = "M 2 0 C -4 -6 -10 -12 -18 -16 C -14 -6 -14 6 -18 16 C -10 12 -4 6 2 0 Z";
  function drawWrasse(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir * s / 100, s / 100);
    ctx.save(); ctx.translate(-40, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.3); fillWith(P(WRASSE_TAIL), sh("#f2c840")); ctx.restore();
    fillWith(P(WRASSE_FIN), sh("#e8609a"));
    ctx.save(); ctx.scale(1, -1); fillWith(P(WRASSE_FIN), sh("#e8609a")); ctx.restore();
    fillWith(P(WRASSE_BODY), sh("#3fbf8a"));
    ctx.save(); ctx.clip(P(WRASSE_BODY));
    ctx.strokeStyle = sh("#f070b0"); ctx.lineWidth = 2; ctx.lineJoin = "round";
    ctx.beginPath(); for (let i = 0; i <= 12; i++) ctx.lineTo(-38 + i * 6, -3 + (i % 2) * 4); ctx.stroke();
    ctx.beginPath(); for (let i = 0; i <= 10; i++) ctx.lineTo(-30 + i * 6, 6 + (i % 2) * 3); ctx.stroke();
    // pink lines radiating over the blue-green head
    ctx.fillStyle = sh("#2fa0b0"); ctx.beginPath(); ctx.ellipse(40, 0, 14, 16, 0, 0, TAU); ctx.fill();
    for (const a of [-0.5, 0.1, 0.6]) { ctx.beginPath(); ctx.moveTo(38, 0); ctx.lineTo(38 + Math.cos(a + Math.PI) * 14, Math.sin(a + Math.PI) * 14); ctx.stroke(); }
    ctx.restore();
    ctx.fillStyle = "rgba(240,180,210,0.75)"; ctx.beginPath(); ctx.ellipse(22, 5, 6, 2.6, 0.5 + Math.sin(f.ph * 5) * 0.3, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(38, -3, 2.6, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // A blue tang: a tall royal-blue oval with a black "palette" mark and a yellow tail.
  const TANG_BODY = "M 48 2 C 46 -12 34 -26 10 -28 C -14 -30 -32 -18 -38 -4 L -38 4 C -32 18 -14 28 10 26 C 32 24 46 14 48 2 Z";
  const TANG_DORSAL = "M 30 -23 C 10 -38 -24 -32 -41 -6 L -36 -5 C -24 -24 4 -30 30 -23 Z";
  const TANG_ANAL = "M 22 23 C 4 34 -24 30 -41 6 L -36 5 C -22 22 2 28 22 23 Z";
  const TANG_MARK = "M 32 -14 C 16 -26 -18 -24 -36 -6 C -24 -10 -12 -10 -6 -4 C -12 4 -8 13 4 11 C 0 3 6 -5 16 -7 C 22 -9 28 -9 32 -14 Z";
  const TANG_TAIL = "M 2 0 L -14 -14 C -10 -6 -9 6 -14 14 Z";
  function drawSurgeon(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir * s / 100, s / 100);
    const blue = sh("#2f5fe0"), black = sh("#0e1430");
    ctx.save(); ctx.translate(-38, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.3); fillWith(P(TANG_TAIL), sh("#f2d030")); ctx.restore();
    for (const fin of [TANG_DORSAL, TANG_ANAL]) { fillWith(P(fin), blue); ctx.strokeStyle = black; ctx.lineWidth = 1.6; ctx.stroke(P(fin)); }
    fillWith(P(TANG_BODY), blue);
    paintInside(P(TANG_BODY), black, P(TANG_MARK));
    ctx.fillStyle = sh("#f2d030"); ctx.beginPath(); ctx.moveTo(18, 4); ctx.lineTo(6, 0 + Math.sin(f.ph * 5) * 2); ctx.lineTo(6, 10 + Math.sin(f.ph * 5) * 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(36, -6, 3.6, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.beginPath(); ctx.arc(37, -7, 1, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // A mandarinfish: a chunky little blue fish with orange squiggles, a big head and fanning fins.
  const MAND_BODY = "M 40 2 C 40 -14 30 -22 14 -22 C -6 -22 -24 -14 -40 -4 L -40 4 C -24 12 -6 20 12 20 C 30 20 40 14 40 2 Z";
  const MAND_SAIL = "M 14 -21 C 12 -40 -2 -44 -8 -21 Z";
  const MAND_DORSAL = "M -8 -20 C -20 -28 -34 -18 -44 -6 L -38 -5 C -28 -12 -18 -16 -8 -20 Z";
  const MAND_ANAL = "M -6 18 C -20 24 -34 16 -44 6 L -38 5 C -28 11 -18 15 -6 18 Z";
  const MAND_TAIL = "M 2 0 C -6 -14 -18 -12 -18 0 C -18 12 -6 14 2 0 Z";
  const MAND_FAN = "M 0 0 C 6 -6 16 -4 16 4 C 16 12 6 14 0 6 Z";
  function drawMandarin(f) {
    const s = f.s, fan = Math.sin(f.ph * 4);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir * s / 100, s / 100);
    const blue = sh("#2f6fe0"), orange = sh("#f08a30");
    ctx.save(); ctx.translate(-40, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.25); fillWith(P(MAND_TAIL), orange); ctx.strokeStyle = blue; ctx.lineWidth = 2; ctx.stroke(P(MAND_TAIL)); ctx.restore();
    ctx.save(); ctx.translate(4, -21); ctx.scale(1, 0.8 + 0.2 * Math.sin(f.ph * 1.5)); ctx.translate(-4, 21); fillWith(P(MAND_SAIL), orange); ctx.strokeStyle = blue; ctx.lineWidth = 2; ctx.stroke(P(MAND_SAIL)); ctx.restore();
    for (const fin of [MAND_DORSAL, MAND_ANAL]) { fillWith(P(fin), blue); ctx.strokeStyle = orange; ctx.lineWidth = 1.4; ctx.stroke(P(fin)); }
    fillWith(P(MAND_BODY), blue);
    ctx.save(); ctx.clip(P(MAND_BODY));
    ctx.strokeStyle = orange; ctx.lineWidth = 3; ctx.lineCap = "round";
    // wavy orange lines all over, like a marbled pattern
    for (let r = 0; r < 4; r++) { ctx.beginPath(); for (let i = 0; i <= 14; i++) { const x = -40 + i * 6, y = -14 + r * 9 + Math.sin(i * 1.3 + r * 2) * 3; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
    ctx.fillStyle = sh("#3fc0a0"); ctx.beginPath(); ctx.ellipse(32, 6, 9, 8, 0, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.save(); ctx.translate(10, 4); ctx.rotate(0.3 + fan * 0.35); ctx.fillStyle = "rgba(240,150,60,0.8)"; ctx.fill(P(MAND_FAN)); ctx.restore();
    ctx.fillStyle = sh("#f2c030"); ctx.beginPath(); ctx.arc(28, -8, 6.5, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(29, -8, 3.6, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function drawNeedle(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1); ctx.rotate(Math.sin(f.ph) * 0.03);
    ctx.fillStyle = sh("#c8d8e0");
    ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 0.06); ctx.lineTo(-s * 0.62, -s * 0.12); ctx.lineTo(-s * 0.6, 0); ctx.lineTo(-s * 0.62, s * 0.12); ctx.lineTo(-s * 0.5, s * 0.06); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.52, s * 0.055, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s * 0.48, -s * 0.015); ctx.lineTo(s * 0.88, 0); ctx.lineTo(s * 0.48, s * 0.02); ctx.fill();
    ctx.fillStyle = sh("#3a8a7a"); ctx.fillRect(-s * 0.45, -s * 0.05, s * 0.9, s * 0.025);
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.44, -s * 0.01, s * 0.02, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // A yellow-bellied sea snake: black on top, yellow underneath, with a flat paddle tail.
  function drawSeaSnake(f) {
    const s = f.s, pts = snakePoints(s, f.ph);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const [col, off, w] of [[sh("#f2c830"), s * 0.02, 0.08], [sh("#1a1a1a"), -s * 0.012, 0.06]]) {
      ctx.strokeStyle = col; ctx.lineWidth = s * w;
      ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y + off) : ctx.moveTo(x, y + off)); ctx.stroke();
    }
    const [tx, ty] = pts[pts.length - 1];
    ctx.fillStyle = sh("#f2c830"); ctx.beginPath(); ctx.ellipse(tx - s * 0.03, ty, s * 0.06, s * 0.05, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#1a1a1a"; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(tx - s * 0.03 + (i - 1.5) * s * 0.02, ty + (i % 2 ? 1 : -1) * s * 0.02, s * 0.008, 0, TAU); ctx.fill(); }
    ctx.fillStyle = sh("#1a1a1a"); ctx.beginPath(); ctx.ellipse(s * 0.52, pts[0][1], s * 0.05, s * 0.035, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#f2e8a0"; ctx.beginPath(); ctx.arc(s * 0.54, pts[0][1] - s * 0.01, s * 0.01, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // A sea krait: blue with black rings and a yellow snout.
  function drawKrait(f) {
    const s = f.s, pts = snakePoints(s, f.ph + 1);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = sh("#6a9ad8"); ctx.lineWidth = s * 0.075;
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    ctx.strokeStyle = sh("#141820"); ctx.lineWidth = s * 0.08; ctx.lineCap = "butt";
    for (let i = 1; i < pts.length - 1; i += 2) { const [x, y] = pts[i], [x2, y2] = pts[i + 1]; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (x2 - x) * 0.45, y + (y2 - y) * 0.45); ctx.stroke(); }
    ctx.fillStyle = sh("#6a9ad8"); ctx.beginPath(); ctx.ellipse(s * 0.52, pts[0][1], s * 0.05, s * 0.035, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#f2c830"); ctx.beginPath(); ctx.ellipse(s * 0.56, pts[0][1] + s * 0.005, s * 0.025, s * 0.02, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.53, pts[0][1] - s * 0.012, s * 0.009, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ---- rays and gliders ----------------------------------------------------------
  // A marbled electric ray, seen from above at a slant: a round disc and a short, thick tail.
  const TORP_DISC = "M 40 0 C 40 -26 24 -38 2 -38 C -22 -38 -34 -22 -34 0 C -34 22 -22 38 2 38 C 24 38 40 26 40 0 Z";
  const TORP_TAIL = "M -28 -8 L -58 -6 L -58 6 L -28 8 Z";
  const TORP_PELVIC = "M -26 -16 C -38 -30 -48 -20 -42 -6 L -30 -4 Z";
  const TORP_CAUDAL = "M -58 -4 C -68 -14 -76 -10 -74 0 C -76 10 -68 14 -58 4 Z";
  function drawElectricRay(f) {
    const s = f.s;
    sandShadow(f, s * 0.4);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir * s / 100, s / 100 * 0.55);
    const body = sh("#8a5a3a"), dark = sh("#5e3a24");
    ctx.save(); ctx.rotate(Math.sin(f.ph * 2) * 0.04);
    fillWith(P(TORP_TAIL), body); fillWith(P(TORP_CAUDAL), body); fillWith(P(TORP_PELVIC), body);
    ctx.save(); ctx.scale(1, -1); fillWith(P(TORP_PELVIC), body); ctx.restore();
    ctx.fillStyle = dark; for (const x of [-38, -50]) { ctx.beginPath(); ctx.ellipse(x, 0, 5, 3, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
    // the disc ripples gently at its edge
    ctx.save(); ctx.scale(1, 1 + Math.sin(f.ph * 1.5) * 0.04);
    fillWith(P(TORP_DISC), body);
    ctx.save(); ctx.clip(P(TORP_DISC));
    ctx.fillStyle = dark;
    const blots = [[18, -18, 7], [-4, -24, 6], [-20, -8, 8], [4, 2, 5], [-14, 18, 7], [12, 20, 6], [26, 4, 4], [-26, 26, 5], [-2, -6, 3]];
    for (const [x, y, r] of blots) { ctx.beginPath(); ctx.ellipse(x, y, r * 1.2, r, x * 0.1, 0, TAU); ctx.fill(); }
    // the two kidney-shaped electric organs show faintly
    ctx.fillStyle = "rgba(240,200,160,0.18)";
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(10, sd * 18, 12, 8, sd * 0.3, 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.restore();
    ctx.fillStyle = "#101010"; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(20, sd * 7, 2.4, 3.4, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
    // a faint crackle now and then
    if (Math.sin(f.ph * 0.7) > 0.97) { ctx.save(); ctx.translate(f.x, f.cy); ctx.strokeStyle = "rgba(200,230,255,0.8)"; ctx.lineWidth = 1 * u; ctx.beginPath(); ctx.moveTo(-s * 0.2, -s * 0.14); ctx.lineTo(-s * 0.1, -s * 0.24); ctx.lineTo(0, -s * 0.16); ctx.lineTo(s * 0.1, -s * 0.26); ctx.stroke(); ctx.restore(); }
  }
  // A guitarfish, seen from above at a slant: a shovel-shaped front like a ray, and the back half of a shark.
  const GUIT_BODY = "M 50 0 C 48 -5 40 -12 26 -18 C 14 -22 4 -21 -2 -15 C -6 -10 -10 -7 -16 -6 L -60 -3 L -60 3 L -16 6 C -10 7 -6 10 -2 15 C 4 21 14 22 26 18 C 40 12 48 5 50 0 Z";
  const GUIT_PELVIC = "M -10 -6 C -16 -16 -24 -14 -24 -5 Z";
  const GUIT_TAIL = "M 0 0 L -16 -11 C -12 -3 -12 3 -14 8 Z";
  function drawGuitar(f) {
    const s = f.s;
    sandShadow(f, s * 0.5);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir * s / 110, s / 110 * 0.55);
    const sand = sh("#c8a878"), dark = sh("#8a6a48");
    ctx.save(); ctx.translate(-30, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.1); ctx.translate(30, 0);
    ctx.save(); ctx.translate(-60, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.2); fillWith(P(GUIT_TAIL), sand); ctx.restore();
    fillWith(P(GUIT_PELVIC), sand); ctx.save(); ctx.scale(1, -1); fillWith(P(GUIT_PELVIC), sand); ctx.restore();
    ctx.restore();
    fillWith(P(GUIT_BODY), sand);
    ctx.save(); ctx.clip(P(GUIT_BODY));
    ctx.fillStyle = sh("#e8d4a8");
    for (let i = 0; i < 14; i++) { const x = 40 - i * 7, y = ((i * 7) % 5 - 2) * 4; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, TAU); ctx.fill(); }
    ctx.fillStyle = dark; ctx.fillRect(-60, -1.5, 66, 3);
    ctx.restore();
    // two shark-like dorsal fins on the back, seen from above as slivers
    ctx.fillStyle = dark; for (const x of [-28, -46]) { ctx.beginPath(); ctx.ellipse(x, 0, 6, 2.4, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#101010"; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(24, sd * 5, 2, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  // A marine iguana: a dark, blunt-headed lizard with a spiky crest, bent legs with claws,
  // and a long flat tail that it swims with.
  const IGU_BODY = "M 20 -4 C 18 -9 8 -10.5 -4 -9.5 C -14 -8.5 -20 -6.5 -24 -3.5 L -24 3 C -18 6 -8 7 4 6.5 C 12 6 18 3 20 -1 Z";
  const IGU_HEAD = "M 17 -5.5 C 21 -10.5 30 -11.5 35 -8.5 C 38.5 -6.5 38.5 -2 36 0 C 32 2.5 24 3 17 2 Z";
  const IGU_LEG = "M 0 0 C 3 3 3 7 0 9 L -4 10 L -1 11 L 3 10.5 L 4 8.5 C 6 6 5 2 3 -1 Z";
  function drawIguana(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir * s / 100, s / 100);
    const skin = sh("#3a4040"), dark = sh("#262c2c"), crest = sh("#6a7068");
    const swim = f.ph * 3;
    ctx.fillStyle = dark;
    ctx.save(); ctx.translate(10, 3); ctx.rotate(0.6 + Math.sin(swim) * 0.3); ctx.fill(P(IGU_LEG)); ctx.restore();
    ctx.save(); ctx.translate(-16, 3); ctx.rotate(0.9 + Math.sin(swim + 1) * 0.3); ctx.fill(P(IGU_LEG)); ctx.restore();
    // the flat tail waves like an eel
    const tail = [];
    for (let i = 0; i <= 14; i++) { const fr = i / 14; tail.push([-22 - fr * 50, Math.sin(swim - fr * 4) * 6 * fr, 3.6 * (1 - fr * 0.85)]); }
    ctx.fillStyle = skin; ctx.beginPath();
    tail.forEach(([x, y, w], i) => i ? ctx.lineTo(x, y - w) : ctx.moveTo(x, y - w));
    for (let i = tail.length - 1; i >= 0; i--) ctx.lineTo(tail[i][0], tail[i][1] + tail[i][2]);
    ctx.closePath(); ctx.fill();
    ctx.fill(P(IGU_BODY)); ctx.fill(P(IGU_HEAD));
    // crest spikes from the head down the back and onto the tail
    ctx.fillStyle = crest;
    for (let i = 0; i < 10; i++) { const x = 22 - i * 4.6, h = i < 2 ? 3 : 4.4; ctx.beginPath(); ctx.moveTo(x - 1.6, -8.8 + (i > 7 ? (i - 7) * 1.6 : 0)); ctx.lineTo(x, -8.8 - h + (i > 7 ? (i - 7) * 1.6 : 0)); ctx.lineTo(x + 1.6, -8.8 + (i > 7 ? (i - 7) * 1.6 : 0)); ctx.fill(); }
    for (let i = 1; i < 9; i++) { const [x, y, w] = tail[i]; ctx.beginPath(); ctx.moveTo(x - 1.2, y - w); ctx.lineTo(x, y - w - 2.6 * (1 - i / 10)); ctx.lineTo(x + 1.2, y - w); ctx.fill(); }
    // pale salt crust on the head, and a red eye
    ctx.fillStyle = "rgba(220,220,210,0.35)"; ctx.beginPath(); ctx.ellipse(31, -8, 4.5, 2, -0.2, 0, TAU); ctx.fill();
    ctx.fillStyle = skin;
    ctx.save(); ctx.translate(14, 4); ctx.rotate(0.4 - Math.sin(swim) * 0.3); ctx.fill(P(IGU_LEG)); ctx.restore();
    ctx.save(); ctx.translate(-12, 4); ctx.rotate(0.7 - Math.sin(swim + 1) * 0.3); ctx.fill(P(IGU_LEG)); ctx.restore();
    ctx.fillStyle = "#c84a3a"; ctx.beginPath(); ctx.arc(29, -5.5, 1.4, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ---- animals on the floor ------------------------------------------------------
  function drawScorpion(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    const body = sh("#b84a3a"), mottle = sh("#7a2a20"), pale = sh("#e8b8a0");
    // fan-shaped pectoral fin
    ctx.fillStyle = "rgba(200,110,90,0.75)";
    ctx.beginPath(); ctx.moveTo(s * 0.05, -s * 0.12); for (let i = 0; i <= 6; i++) { const a = 2.0 + i * 0.22; ctx.lineTo(s * 0.05 + Math.cos(a) * s * 0.35, -s * 0.12 + Math.sin(a) * s * 0.2); } ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.moveTo(s * 0.45, -s * 0.12); ctx.quadraticCurveTo(s * 0.3, -s * 0.38, -s * 0.1, -s * 0.3); ctx.quadraticCurveTo(-s * 0.4, -s * 0.2, -s * 0.5, -s * 0.12);
    ctx.lineTo(-s * 0.62, -s * 0.24); ctx.lineTo(-s * 0.62, 0); ctx.lineTo(-s * 0.5, -s * 0.04); ctx.quadraticCurveTo(0, s * 0.02, s * 0.45, -s * 0.12); ctx.fill();
    // spiny dorsal fin
    ctx.strokeStyle = body; ctx.lineWidth = Math.max(0.7, s * 0.025);
    for (let i = 0; i < 8; i++) { const x = s * (0.2 - i * 0.07); ctx.beginPath(); ctx.moveTo(x, -s * 0.3); ctx.lineTo(x - s * 0.03, -s * (0.46 + (i % 2) * 0.05)); ctx.stroke(); }
    ctx.fillStyle = mottle; for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.arc(s * (0.3 - i * 0.08), -s * (0.12 + (i % 3) * 0.06), s * 0.035, 0, TAU); ctx.fill(); }
    ctx.fillStyle = pale; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(s * (0.25 - i * 0.12), -s * 0.06, s * 0.02, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#f2d070"; ctx.beginPath(); ctx.arc(s * 0.3, -s * 0.24, s * 0.04, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.31, -s * 0.24, s * 0.02, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // A stonefish looks exactly like an overgrown rock, until it opens its eyes.
  function drawStonefish(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    ctx.fillStyle = sh("#7a7060");
    ctx.beginPath(); ctx.moveTo(-s * 0.5, 0);
    for (let i = 0; i <= 10; i++) { const a = Math.PI + i * Math.PI / 10; ctx.lineTo(Math.cos(a) * s * 0.5, Math.sin(a) * s * (0.36 + ((i * 7) % 3) * 0.04)); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh("#5a5246"); for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(s * (-0.35 + i * 0.12), -s * (0.1 + (i % 3) * 0.08), s * 0.05, 0, TAU); ctx.fill(); }
    ctx.fillStyle = sh("#6a8a5a"); for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(s * (-0.3 + i * 0.15), -s * (0.3 + (i % 2) * 0.04), s * 0.03, 0, TAU); ctx.fill(); }
    // a grumpy, downturned mouth and eyes on top
    ctx.strokeStyle = sh("#3a3228"); ctx.lineWidth = Math.max(0.8, s * 0.03);
    ctx.beginPath(); ctx.moveTo(s * 0.2, -s * 0.08); ctx.quadraticCurveTo(s * 0.35, -s * 0.15, s * 0.48, -s * 0.06); ctx.stroke();
    const open = Math.sin(f.ph * 0.3) > 0.6 ? 1 : 0.25;
    for (const ex of [0.12, 0.28]) {
      ctx.fillStyle = "#e8d8a0"; ctx.beginPath(); ctx.ellipse(s * ex, -s * 0.33, s * 0.045, s * 0.045 * open, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.ellipse(s * ex, -s * 0.33, s * 0.02, s * 0.02 * open, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  // A goby: a long round body with a blunt head, big eyes high on top, two separate dorsal fins,
  // a rounded tail, and fan-shaped flippers it props itself up on. Drawn where 100 units is its length.
  const GOBY_BODY = "M 48 2 C 48 -8 40 -13 28 -13 C 12 -13 -14 -10 -36 -6 C -40 -5 -42 -3 -42 0 C -42 3 -40 5 -36 6 C -14 9 12 11 28 10 C 40 9 48 8 48 2 Z";
  const GOBY_FIRST = "M 18 -12.5 C 16 -27 3 -29 -1 -12 Z";
  const GOBY_SECOND = "M -4 -11.4 C -10 -20 -30 -16 -37 -6 L -30 -7 C -20 -10 -10 -11 -4 -11.4 Z";
  const GOBY_ANAL = "M -6 9 C -12 15 -28 12 -36 6 L -30 6.5 C -20 8 -12 8.6 -6 9 Z";
  const GOBY_TAIL = "M 2 -5.5 C -10 -12 -19 -9.5 -19 0 C -19 9.5 -10 12 2 5.5 Z";
  const GOBY_PEC = "M 0 0 C 5 4 5 11 -2 13 C -7 11 -6 4 0 0 Z";
  function drawGobyShape(main, dark, spot, ph) {
    ctx.fillStyle = dark;
    ctx.save(); ctx.translate(-40, 0); ctx.rotate(Math.sin(ph * 2) * 0.2); ctx.fill(P(GOBY_TAIL)); ctx.restore();
    ctx.globalAlpha *= 0.85; ctx.fill(P(GOBY_FIRST)); ctx.fill(P(GOBY_SECOND)); ctx.fill(P(GOBY_ANAL)); ctx.globalAlpha /= 0.85;
    ctx.fillStyle = main; ctx.fill(P(GOBY_BODY));
    ctx.save(); ctx.clip(P(GOBY_BODY));
    ctx.fillStyle = "rgba(255,255,255,0.22)"; ctx.beginPath(); ctx.ellipse(6, 9, 44, 5, 0.03, 0, TAU); ctx.fill();
    ctx.fillStyle = spot;
    for (const [x, y, r] of [[36, -4, 1.8], [30, 2, 1.5], [22, -6, 1.7], [14, 2, 1.6], [4, -5, 1.8], [-6, 2, 1.5], [-16, -4, 1.6], [-26, 1, 1.4], [42, 3, 1.3], [26, -9, 1.3]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.save(); ctx.translate(22, 4); ctx.rotate(-0.2 + Math.sin(ph * 3) * 0.25); ctx.fillStyle = dark; ctx.globalAlpha *= 0.8; ctx.fill(P(GOBY_PEC)); ctx.restore();
    ctx.strokeStyle = dark; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(48, 3.5); ctx.quadraticCurveTo(44, 5.5, 39, 4.5); ctx.stroke();
    // the eyes bulge up out of the top of the head
    ctx.fillStyle = main; ctx.beginPath(); ctx.arc(33, -12, 5, 0, TAU); ctx.fill();
    ctx.fillStyle = "#f6f0d8"; ctx.beginPath(); ctx.arc(33.5, -12.5, 3.8, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(34.3, -12.5, 2.3, 0, TAU); ctx.fill();
  }
  function drawGoby(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy - s * 0.12); ctx.scale(f.dir * s / 100, s / 100);
    drawGobyShape(sh("#d8c8a0"), sh("#9a7a4a"), sh("#8a6a3a"), f.ph);
    ctx.restore();
  }

  function drawSandDollar(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy);
    ctx.fillStyle = sh("#c8b8c8");
    ctx.beginPath(); ctx.ellipse(0, -s * 0.12, s, s * 0.3, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#a898a8");
    ctx.beginPath(); ctx.ellipse(0, -s * 0.16, s * 0.85, s * 0.22, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#f0e8f0"); ctx.lineWidth = Math.max(0.6, s * 0.06);
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5; ctx.beginPath(); ctx.ellipse(Math.cos(a) * s * 0.3, -s * 0.16 + Math.sin(a) * s * 0.08, s * 0.16, s * 0.04, a, 0, TAU); ctx.stroke(); }
    ctx.restore();
  }

  function drawBrittle(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy - s * 0.05);
    ctx.strokeStyle = sh("#b86a9a"); ctx.lineCap = "round"; ctx.lineWidth = Math.max(0.8, s * 0.07);
    for (let i = 0; i < 5; i++) {
      const a = i * TAU / 5 + 0.3;
      ctx.beginPath(); ctx.moveTo(0, 0);
      for (let j = 1; j <= 6; j++) { const r = s * j * 0.22, w = Math.sin(f.ph * 1.5 + i + j * 0.8) * 0.35; ctx.lineTo(Math.cos(a + w * j * 0.15) * r, Math.sin(a + w * j * 0.15) * r * 0.35); }
      ctx.stroke();
    }
    ctx.fillStyle = sh("#d88ab8"); ctx.beginPath(); ctx.ellipse(0, 0, s * 0.22, s * 0.1, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawCucumber(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    ctx.fillStyle = sh("#6a4030");
    ctx.beginPath(); ctx.ellipse(0, -s * 0.15, s * 0.5, s * 0.16, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#8a5a40"); for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(s * (-0.38 + i * 0.095), -s * (0.25 + (i % 2) * 0.03), s * 0.03, 0, TAU); ctx.fill(); }
    // a crown of feeding tentacles that sweeps the sand
    ctx.strokeStyle = sh("#e8c8a0"); ctx.lineWidth = Math.max(0.6, s * 0.03); ctx.lineCap = "round";
    for (let i = 0; i < 6; i++) { const a = -0.8 + i * 0.32 + Math.sin(f.ph * 2 + i) * 0.15; ctx.beginPath(); ctx.moveTo(s * 0.48, -s * 0.12); ctx.lineTo(s * 0.48 + Math.cos(a) * s * 0.16, -s * 0.12 + Math.sin(a) * s * 0.12); ctx.stroke(); }
    ctx.restore();
  }

  // A feather star: ten feathery arms that wave in the current.
  function drawFeather(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy);
    ctx.fillStyle = sh("#6a6458"); ctx.beginPath(); ctx.ellipse(0, 0, s * 0.45, s * 0.25, 0, Math.PI, TAU); ctx.fill();
    ctx.lineCap = "round";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i - 4.5) * 0.28 + Math.sin(f.ph * 0.8 + i) * 0.12, len = s * (1.0 + (i % 3) * 0.15);
      const col = sh(i % 2 ? "#f2c030" : "#e8603a");
      const cx = Math.cos(a) * len * 0.5 + Math.sin(f.ph + i) * s * 0.08, cy = -s * 0.2 + Math.sin(a) * len * 0.5, ex = Math.cos(a) * len, ey = -s * 0.2 + Math.sin(a) * len + s * 0.15;
      ctx.strokeStyle = col; ctx.lineWidth = Math.max(0.8, s * 0.05);
      ctx.beginPath(); ctx.moveTo(0, -s * 0.2); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();
      ctx.lineWidth = Math.max(0.5, s * 0.02);
      for (let j = 1; j < 6; j++) { const fr = j / 6, px = (1 - fr) * (1 - fr) * 0 + 2 * (1 - fr) * fr * cx + fr * fr * ex, py = (1 - fr) * (1 - fr) * (-s * 0.2) + 2 * (1 - fr) * fr * cy + fr * fr * ey; ctx.beginPath(); ctx.moveTo(px - s * 0.06, py - s * 0.03); ctx.lineTo(px + s * 0.06, py + s * 0.03); ctx.stroke(); }
    }
    ctx.restore();
  }

  // ---- at the surface ------------------------------------------------------------
  // An albatross resting on the water: white with dark folded wings, a big pink hooked bill.
  const ALB_BODY = "M -46 -10 C -40 -20 -10 -24 14 -22 C 26 -22 30 -28 32 -36 C 34 -44 42 -48 50 -46 C 56 -44 58 -38 56 -34 C 52 -30 44 -28 40 -22 C 38 -16 38 -8 30 2 C 10 7 -24 7 -40 3 C -46 1 -50 -4 -46 -10 Z";
  const ALB_WING = "M 28 -20 C 10 -27 -20 -23 -42 -13 C -52 -9 -60 -9 -68 -11 C -56 -4 -40 -2 -20 -7 C 0 -11 18 -13 28 -20 Z";
  const ALB_BILL = "M 55 -41 C 64 -41 73 -39 77 -37 C 80 -36 80 -32 77 -33 C 70 -34 62 -35 55 -35 Z";
  const ALB_LONGWING = "M 0 0 C 20 -7 50 -11 86 -7 C 50 -2 20 2 0 5 Z";
  function drawAlbatross(f) {
    const s = f.s, spread = Math.max(0, Math.sin(f.ph * 0.12) - 0.85) / 0.15;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir * s / 100, s / 100);
    const white = sh("#f6f6f2"), wing = sh("#3a3a42");
    if (spread > 0) { ctx.save(); ctx.translate(10, -18); ctx.rotate(Math.PI + 0.3 + spread * 0.5); ctx.scale(1, -1); fillWith(P(ALB_LONGWING), sh("#2a2a30")); ctx.restore(); }
    fillWith(P(ALB_BODY), white);
    // a pale grey back, then the folded wing or a raised one
    paintInside(P(ALB_BODY), sh("#d8dadc"), P("M -60 -40 L 20 -40 L 20 -16 C 0 -16 -30 -14 -60 -6 Z"));
    if (spread > 0) { ctx.save(); ctx.translate(10, -18); ctx.rotate(Math.PI - 0.3 - spread * 0.6); ctx.scale(1, -1); fillWith(P(ALB_LONGWING), wing); ctx.restore(); }
    else fillWith(P(ALB_WING), wing);
    fillWith(P(ALB_BILL), sh("#f0b0a0"));
    ctx.fillStyle = sh("#d88a78"); ctx.beginPath(); ctx.arc(77, -34.5, 2.2, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(90,90,100,0.45)"; ctx.beginPath(); ctx.ellipse(48, -41, 5, 2.4, -0.2, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(49, -40.5, 1.8, 0, TAU); ctx.fill();
    // a pink foot paddles under the water
    ctx.save(); ctx.translate(-6, 4); ctx.rotate(Math.sin(f.ph * 2) * 0.5); fillUnder(P("M -3 0 L 3 0 L 6 12 L -6 12 Z"), sh("#f0b8a0")); ctx.restore();
    underVeil(P(ALB_BODY));
    ripple(-44, 34, f.ph);
    ctx.restore();
  }
  // A white pelican on the water: S-shaped neck, a long orange bill with a pouch. Now and then it scoops.
  const PEL_BODY = "M -46 -6 C -42 -22 -10 -28 12 -26 C 24 -25 31 -20 33 -12 C 35 -4 29 2 19 4 C -6 7 -30 7 -43 3 C -48 1 -48 -2 -46 -6 Z";
  const PEL_NECK = "M 18 -22 C 12 -34 14 -46 24 -54 C 32 -60 42 -58 44 -52 C 46 -46 40 -44 36 -46 C 30 -48 26 -42 28 -34 C 30 -28 32 -24 30 -18 Z";
  const PEL_BILL = "M 0 -3 C 18 0 36 8 46 14 C 44 16 40 16 38 15 C 24 10 12 6 0 4 Z";
  const PEL_POUCH = "M 2 4 C 16 10 30 14 38 15 C 28 22 14 20 2 10 Z";
  const PEL_WING = "M 22 -20 C 0 -27 -30 -21 -52 -10 C -38 -7 -10 -9 22 -14 Z";
  function drawPelican(f) {
    const s = f.s, dip = Math.max(0, Math.sin(f.ph * 0.2) - 0.9) / 0.1;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir * s / 100, s / 100);
    const white = sh("#f4f0e4");
    fillWith(P(PEL_BODY), white);
    fillWith(P(PEL_WING), sh("#c8c4b8"));
    paintInside(P(PEL_WING), sh("#2a2a2a"), P("M -60 -30 L -30 -30 L -30 0 L -60 0 Z"));
    // the head and bill swing down into the water when it scoops
    ctx.save(); ctx.translate(26, -24); ctx.rotate(dip * 1.1); ctx.translate(-26, 24);
    fillWith(P(PEL_NECK), white);
    ctx.save(); ctx.translate(42, -52); ctx.rotate(0.1 + dip * 0.5);
    fillWith(P(PEL_POUCH), sh("#f2c878")); fillWith(P(PEL_BILL), sh("#e89838"));
    ctx.restore();
    ctx.fillStyle = sh("#f2d8a8"); ctx.beginPath(); ctx.arc(37, -53, 3, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(37.5, -53, 1.5, 0, TAU); ctx.fill();
    ctx.restore();
    underVeil(P(PEL_BODY));
    ripple(-44, 34, f.ph);
    ctx.restore();
  }
  const WALRUS_BODY = "M -70 6 C -50 -2 -10 -6 14 -8 C 26 -10 32 -20 42 -23 C 52 -26 61 -20 63 -11 C 69 -9 72 0 67 5 C 61 9 52 8 46 8 C 42 18 32 28 16 32 C -10 38 -40 37 -58 29 C -66 25 -72 15 -70 6 Z";
  const WALRUS_FOLDS = "M 30 -12 C 34 -4 34 6 30 14 M 22 -8 C 26 0 26 10 22 20 M 14 -6 C 17 2 17 12 13 24";
  const WALRUS_FLIP = "M 0 0 C 4 8 8 18 6 24 C 4 28 -6 28 -8 22 C -8 14 -6 6 -4 0 Z";
  const WALRUS_TAIL = "M 0 0 C -10 -10 -20 -12 -24 -8 C -20 -2 -20 4 -24 10 C -18 14 -8 10 0 4 Z";
  function drawWalrus(f) {
    const s = f.s, swing = Math.sin(f.ph * 2);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir * s / 100, s / 100);
    const skin = sh("#b4806a"), dark = sh("#8a5a48"), pad = sh("#d4a48c");
    ctx.save(); ctx.translate(20, 22); ctx.rotate(-0.3 - swing * 0.35); fillUnder(P(WALRUS_FLIP), dark); ctx.restore();
    ctx.save(); ctx.translate(-66, 14); ctx.rotate(swing * 0.25); fillUnder(P(WALRUS_TAIL), dark); ctx.restore();
    ctx.fillStyle = skin; ctx.fill(P(WALRUS_BODY));
    ctx.strokeStyle = dark; ctx.lineWidth = 1.6; ctx.stroke(P(WALRUS_FOLDS));
    // the tusks hang down from the moustache
    ctx.fillStyle = sh("#f4ecd8");
    for (const tx of [56, 63]) { ctx.beginPath(); ctx.moveTo(tx - 2.2, 5); ctx.quadraticCurveTo(tx - 1, 20, tx - 4, 30); ctx.quadraticCurveTo(tx + 1.5, 20, tx + 2.2, 5); ctx.fill(); }
    // the fat whiskered muzzle
    ctx.fillStyle = pad;
    ctx.beginPath(); ctx.ellipse(58, -1, 7.5, 7, 0, 0, TAU); ctx.ellipse(66, -1, 6, 6.5, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = dark;
    for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(54 + (i % 3) * 5 + (i > 2 && i < 6 ? 2 : 0), -4 + Math.floor(i / 3) * 3.5, 0.9, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = sh("#efe2c8"); ctx.lineWidth = 0.9;
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(68, -3 + i * 2); ctx.lineTo(75, -6 + i * 3.2); ctx.stroke(); }
    // small eye high on the head
    ctx.fillStyle = "#1a1210"; ctx.beginPath(); ctx.arc(49, -14, 1.8, 0, TAU); ctx.fill();
    underVeil(P(WALRUS_BODY));
    ripple(30, 70, f.ph);
    ctx.restore();
  }

  const BEAR_BODY = "M -60 4 C -40 1 -10 1 12 -1 C 20 -3 27 -13 35 -18 L 36 -23 C 38 -27 42 -27 43 -22 C 52 -22 61 -17 68 -12 C 72 -10 75 -7 72 -4 C 66 -2 58 -1 52 1 C 46 4 41 10 36 16 C 30 24 18 30 0 32 C -20 34 -38 32 -50 28 C -60 24 -64 12 -60 4 Z";
  const BEAR_LEG = "M -7 -4 C -8 8 -7 18 -6 25 C -5 31 7 31 8 25 C 8 17 7 7 6 -4 Z";
  function drawPolarBear(f) {
    const s = f.s, sw = Math.sin(f.ph * 2);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir * s / 100, s / 100);
    const fur = sh("#f4f0e2"), shade = sh("#d6cfba");
    // the far legs paddle behind, the near legs in front of the body
    ctx.save(); ctx.translate(20, 18); ctx.rotate(-0.6 - sw * 0.5); fillUnder(P(BEAR_LEG), shade); ctx.restore();
    ctx.save(); ctx.translate(-44, 20); ctx.rotate(0.6 - sw * 0.35); fillUnder(P(BEAR_LEG), shade); ctx.restore();
    ctx.fillStyle = fur; ctx.fill(P(BEAR_BODY));
    underVeil(P(BEAR_BODY));
    ctx.save(); ctx.translate(26, 18); ctx.rotate(-0.4 + sw * 0.5); fillUnder(P(BEAR_LEG), fur); ctx.restore();
    ctx.save(); ctx.translate(-38, 20); ctx.rotate(0.8 + sw * 0.35); fillUnder(P(BEAR_LEG), fur); ctx.restore();
    // ear, eye, black nose and mouth line
    ctx.fillStyle = shade; ctx.beginPath(); ctx.arc(39.5, -22.5, 2, 0, TAU); ctx.fill();
    ctx.fillStyle = "#141414";
    ctx.beginPath(); ctx.arc(52, -14.5, 1.9, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(71.5, -8, 3, 2.4, 0.3, 0, TAU); ctx.fill();
    ctx.strokeStyle = "#8a8478"; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(70, -4.5); ctx.quadraticCurveTo(64, -3, 59, -3.5); ctx.stroke();
    ripple(18, 58, f.ph);
    ctx.restore();
  }

  // A cormorant floats, then dives after fish and comes back up.
  function drawCormorant(f) {
    const s = f.s, under = f.under || 0;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    const black = sh("#1e2226"), sheen = sh("#2e4a3a");
    if (under < 0.15) {
      ctx.fillStyle = black;
      ctx.beginPath(); ctx.ellipse(0, 0, s * 0.42, s * 0.14, 0, 0, TAU); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, s * 0.42, s * 0.14, 0, 0, TAU); ctx.clip();
      ctx.fillStyle = "rgba(30,80,120,0.42)"; ctx.fillRect(-s, 0, s * 2, s); ctx.restore();
      ctx.save(); ctx.scale(s / 100, s / 100); ripple(-36, 30, f.ph); ctx.restore();
      ctx.fillStyle = black;
      ctx.strokeStyle = black; ctx.lineWidth = s * 0.1; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(s * 0.3, -s * 0.06); ctx.quadraticCurveTo(s * 0.42, -s * 0.45, s * 0.36, -s * 0.55); ctx.stroke();
      ctx.fillStyle = black; ctx.beginPath(); ctx.arc(s * 0.38, -s * 0.57, s * 0.08, 0, TAU); ctx.fill();
      ctx.fillStyle = sh("#e8b040"); ctx.beginPath(); ctx.moveTo(s * 0.44, -s * 0.6); ctx.lineTo(s * 0.66, -s * 0.55); ctx.quadraticCurveTo(s * 0.7, -s * 0.5, s * 0.64, -s * 0.5); ctx.lineTo(s * 0.44, -s * 0.53); ctx.fill();
      ctx.fillStyle = "#3fbf8a"; ctx.beginPath(); ctx.arc(s * 0.41, -s * 0.59, s * 0.02, 0, TAU); ctx.fill();
    } else {
      // streamlined under water, wings tucked, feet kicking
      ctx.rotate(Math.sin(f.ph) * 0.15 + (f.diveDir || 0) * 0.5);
      ctx.fillStyle = black;
      ctx.beginPath(); ctx.ellipse(0, 0, s * 0.45, s * 0.1, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = sheen; ctx.beginPath(); ctx.ellipse(-s * 0.05, -s * 0.03, s * 0.3, s * 0.05, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = black; ctx.beginPath(); ctx.ellipse(s * 0.5, -s * 0.02, s * 0.1, s * 0.06, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = sh("#e8b040"); ctx.beginPath(); ctx.moveTo(s * 0.58, -s * 0.03); ctx.lineTo(s * 0.78, -s * 0.01); ctx.lineTo(s * 0.58, s * 0.01); ctx.fill();
      ctx.fillStyle = black; ctx.beginPath(); ctx.moveTo(-s * 0.42, 0); ctx.lineTo(-s * 0.6, -s * 0.05 + Math.sin(f.ph * 6) * s * 0.06); ctx.lineTo(-s * 0.6, s * 0.06 + Math.sin(f.ph * 6) * s * 0.06); ctx.fill();
      if (Math.random() < 0.1) bubbles.push({ x: f.x + f.dir * s * 0.5, y: f.cy - s * 0.1, r: (1 + Math.random()) * u, ph: Math.random() * TAU });
    }
    ctx.restore();
  }

  // ---- visitors ----------------------------------------------------------------
  // The thresher's upper tail lobe is as long as its body: a curved scythe that whips from side to side.
  const THRESH_LOBE = "M 0 -1 C -8 -6 -20 -14 -34 -27 C -40 -32 -46 -34 -50 -33.5 C -40 -25 -26 -13 -6 1.5 Z";
  function drawThresher(x, y, dir, L, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph) * 0.02);
    ctx.save(); ctx.translate(-L * 0.36, 0); ctx.rotate(Math.sin(ph * 2) * 0.12);
    ctx.scale(L / 100, L / 100); ctx.fillStyle = sh("#5a6a8a"); ctx.fill(P(THRESH_LOBE));
    ctx.restore();
    sharkForm(L, sh("#5a6a8a"), sh("#dfe4ea"), { upper: 0.14 });
    ctx.restore();
  }
  // A whitetip reef shark: slim and grey with a blunt snout, ordinary fins, and bright white tips on the first dorsal fin and the tail.
  function drawWhitetip(x, y, dir, L, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph) * 0.02);
    ctx.save(); ctx.scale(1, 0.85); sharkForm(L, sh("#7a8288"), sh("#d8dcdf"), { upper: 0.22, tip: "#f4f4f4" }); ctx.restore();
    ctx.restore();
  }
  function drawGreatWhite(x, y, dir, L, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph) * 0.015);
    ctx.save(); ctx.scale(1, 1.25); sharkForm(L, sh("#5e6870"), sh("#f2f2ee"), { upper: 0.2, jagged: true }); ctx.restore();
    // a row of teeth in the slightly open mouth
    ctx.fillStyle = "#3a1a1a"; ctx.beginPath(); ctx.moveTo(L * 0.44, L * 0.025); ctx.quadraticCurveTo(L * 0.38, L * 0.06, L * 0.3, L * 0.04); ctx.lineTo(L * 0.42, L * 0.02); ctx.fill();
    ctx.fillStyle = "#f8f8f0"; for (let i = 0; i < 5; i++) { const tx = L * (0.42 - i * 0.022); ctx.beginPath(); ctx.moveTo(tx, L * 0.026); ctx.lineTo(tx - L * 0.006, L * 0.04); ctx.lineTo(tx - L * 0.012, L * 0.027); ctx.fill(); }
    ctx.restore();
  }
  // A blue marlin: a strong body with a tall front dorsal fin that runs low towards the tail,
  // a long round spear, sickle flippers, a crescent tail and pale blue bars on the flanks.
  const MARLIN_BODY = "M 34 0 C 30 -6 20 -9.5 6 -10 C -12 -10 -28 -5.5 -40 -1.5 L -40 1.5 C -28 5 -12 8.5 6 8.5 C 20 8 30 5 34 0 Z";
  const MARLIN_DORSAL = "M 22 -8.4 C 21 -16 18 -21 13 -21 C 6 -18 -10 -12 -28 -5 L 17 -9.5 Z";
  const MARLIN_TAIL = "M 2 0 C -4 -6 -10 -14 -15 -20 C -12 -8 -12 8 -15 20 C -10 14 -4 6 2 0 Z";
  const MARLIN_PEC = "M 0 0 C -4 4 -9 8 -15 10 C -11 5 -6 2 0 -1.5 Z";
  function drawMarlin(x, y, dir, L, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir * L / 100, L / 100); ctx.rotate(Math.sin(ph) * 0.02);
    const back = sh("#1e3a6a"), belly = sh("#c8d8e8");
    ctx.fillStyle = back;
    ctx.save(); ctx.translate(-40, 0); ctx.rotate(Math.sin(ph * 2) * 0.12); ctx.fill(P(MARLIN_TAIL)); ctx.restore();
    ctx.fill(P(MARLIN_DORSAL));
    ctx.beginPath(); ctx.moveTo(32, -1.6); ctx.lineTo(62, 0); ctx.lineTo(32, 1.4); ctx.fill();
    ctx.fill(P(MARLIN_BODY));
    ctx.save(); ctx.clip(P(MARLIN_BODY));
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(0, 8, 40, 6, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#6ab0e8"); ctx.lineWidth = 1;
    for (let i = 0; i < 9; i++) { const sx = 20 - i * 5.5; ctx.beginPath(); ctx.moveTo(sx, -9); ctx.lineTo(sx - 1, 5); ctx.stroke(); }
    ctx.restore();
    ctx.save(); ctx.translate(18, 4); ctx.rotate(Math.sin(ph * 1.5) * 0.12); ctx.fillStyle = back; ctx.fill(P(MARLIN_PEC)); ctx.restore();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(28, -2, 1.3, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // A small school of tuna, swimming as one.
  function drawTuna(x, y, dir, L, ph) {
    const spots = [[0, 0], [-0.9, -0.35], [-0.8, 0.4], [-1.7, 0.05], [0.7, 0.3]];
    for (let i = 0; i < spots.length; i++) {
      const [ox, oy] = spots[i];
      ctx.save(); ctx.translate(x + dir * ox * L * 0.6, y + oy * L * 0.4 + Math.sin(ph * 2 + i) * L * 0.03); ctx.scale(dir, 1);
      const l = L * (0.9 + (i % 2) * 0.12);
      ctx.fillStyle = sh("#1e3050");
      ctx.save(); ctx.translate(-l * 0.42, 0); ctx.rotate(Math.sin(ph * 4 + i) * 0.2);
      ctx.beginPath(); ctx.moveTo(l * 0.02, 0); ctx.lineTo(-l * 0.14, -l * 0.18); ctx.quadraticCurveTo(-l * 0.07, 0, -l * 0.14, l * 0.18); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.beginPath(); ctx.ellipse(0, 0, l * 0.45, l * 0.13, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = sh("#c8d4dc"); ctx.beginPath(); ctx.ellipse(l * 0.02, l * 0.05, l * 0.38, l * 0.06, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = sh("#f2d030"); for (let j = 0; j < 5; j++) { ctx.beginPath(); ctx.arc(-l * (0.15 + j * 0.05), -l * 0.1, l * 0.012, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(-l * (0.15 + j * 0.05), l * 0.1, l * 0.012, 0, TAU); ctx.fill(); }
      ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(l * 0.32, -l * 0.02, l * 0.02, 0, TAU); ctx.fill();
      ctx.restore();
    }
  }
  function drawBarracuda(x, y, dir, L, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
    const body = sh("#b8c4cc"), dark = sh("#4a5862");
    ctx.fillStyle = dark;
    ctx.save(); ctx.translate(-L * 0.44, 0); ctx.rotate(Math.sin(ph * 2) * 0.15);
    ctx.beginPath(); ctx.moveTo(L * 0.02, 0); ctx.lineTo(-L * 0.1, -L * 0.08); ctx.lineTo(-L * 0.06, 0); ctx.lineTo(-L * 0.1, L * 0.08); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = body; ctx.beginPath(); ctx.ellipse(0, 0, L * 0.46, L * 0.055, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(L * 0.4, -L * 0.03); ctx.lineTo(L * 0.54, L * 0.0); ctx.lineTo(L * 0.4, L * 0.02); ctx.fill();
    ctx.fillStyle = sh("#d8e0e4"); ctx.beginPath(); ctx.moveTo(L * 0.4, L * 0.012); ctx.lineTo(L * 0.56, L * 0.016); ctx.lineTo(L * 0.4, L * 0.03); ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.moveTo(L * 0.05, -L * 0.05); ctx.lineTo(0, -L * 0.1); ctx.lineTo(-L * 0.04, -L * 0.05); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-L * 0.22, -L * 0.045); ctx.lineTo(-L * 0.26, -L * 0.09); ctx.lineTo(-L * 0.3, -L * 0.04); ctx.fill();
    for (let i = 0; i < 9; i++) { const bx = L * (0.25 - i * 0.065); ctx.beginPath(); ctx.moveTo(bx, -L * 0.05); ctx.lineTo(bx - L * 0.02, -L * 0.01); ctx.lineTo(bx - L * 0.01, -L * 0.05); ctx.fill(); }
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(L * 0.38, -L * 0.01, L * 0.012, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // The coelacanth: a living fossil, steel-blue with white blotches, with fleshy lobed fins that move like legs.
  const COEL_BODY = "M 46 2 C 44 -10 30 -16 10 -17 C -14 -17 -30 -12 -38 -5 L -38 5 C -30 12 -14 16 10 15 C 30 14 44 10 46 2 Z";
  const COEL_TAIL = "M 0 -4 C -6 -10 -12 -18 -16 -21 C -14 -10 -14 -4 -16 0 C -14 4 -14 10 -16 21 C -12 18 -6 10 0 4 Z";
  const COEL_FIRST = "M 8 -16 C 6 -28 -4 -28 -6 -16 Z";
  const COEL_LOBE = "M -3 0 C -4 6 -5 11 -4 15 C -2 23 7 20 5 12 C 4 7 3 3 3 0 Z";
  function drawCoelacanth(x, y, dir, L, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir * L / 100, L / 100); ctx.rotate(Math.sin(ph) * 0.03);
    const body = sh("#2a3a5a"), fin = sh("#3a4c70"), spot = sh("#e8eef2");
    // the lobed fins on the far side, paddling in turn
    const lobes = [[18, 8, 0.6], [-2, 12, 0.9], [-22, 12, 1.0], [-22, -12, Math.PI - 1.0]];
    const lobe = ([fx, fy, a], i, col) => { ctx.save(); ctx.translate(fx, fy); ctx.rotate(a + Math.sin(ph * 2 + i * 1.7) * 0.4); fillWith(P(COEL_LOBE), col); ctx.restore(); };
    lobes.forEach((l, i) => lobe([l[0] - 4, l[1], l[2]], i + 2, sh("#1e2c46")));
    ctx.save(); ctx.translate(-38, 0); ctx.rotate(Math.sin(ph * 2) * 0.1); fillWith(P(COEL_TAIL), fin);
    ctx.beginPath(); ctx.ellipse(-19, 0, 5, 3, 0, 0, TAU); ctx.fill(); ctx.restore();
    fillWith(P(COEL_FIRST), fin);
    fillWith(P(COEL_BODY), body);
    ctx.save(); ctx.clip(P(COEL_BODY)); ctx.fillStyle = spot;
    const blots = [[30, -8, 2.4], [20, 4, 3], [8, -10, 3.4], [2, 6, 2.6], [-8, -4, 3.2], [-16, 8, 2.4], [-22, -6, 2.8], [-30, 2, 2], [14, 10, 2], [-2, -12, 2]];
    for (const [bx, by, r] of blots) { ctx.beginPath(); ctx.ellipse(bx, by, r * 1.3, r, 0.4, 0, TAU); ctx.fill(); }
    ctx.restore();
    lobes.forEach((l, i) => lobe(l, i, fin));
    // big pale eye and a heavy jaw line
    ctx.fillStyle = sh("#c8d8a0"); ctx.beginPath(); ctx.arc(34, -4, 3.6, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(34.6, -4, 2.2, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.45)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(46, 4); ctx.quadraticCurveTo(38, 8, 28, 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(26, -10); ctx.quadraticCurveTo(22, 0, 26, 10); ctx.stroke();
    ctx.restore();
  }
  function drawSawfish(x, y, dir, L, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph) * 0.02);
    ctx.save(); ctx.translate(-L * 0.12, 0); ctx.scale(0.75, 0.75); sharkForm(L, sh("#9a8a6a"), sh("#e8e0cc"), { upper: 0.16 }); ctx.restore();
    // the long saw, toothed on both sides
    ctx.fillStyle = sh("#8a7a5a");
    ctx.beginPath(); ctx.moveTo(L * 0.22, -L * 0.012); ctx.lineTo(L * 0.6, -L * 0.008); ctx.lineTo(L * 0.6, L * 0.008); ctx.lineTo(L * 0.22, L * 0.012); ctx.fill();
    ctx.fillStyle = sh("#f2ead8");
    for (let i = 0; i < 12; i++) { const tx = L * (0.26 + i * 0.03); for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(tx, sd * L * 0.009); ctx.lineTo(tx + L * 0.008, sd * L * 0.025); ctx.lineTo(tx + L * 0.014, sd * L * 0.009); ctx.fill(); } }
    ctx.restore();
  }
  function drawBigWhale(x, y, dir, L, ph, top, belly, dorsalAt, dorsalH) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph) * 0.015);
    ctx.fillStyle = top;
    ctx.save(); ctx.translate(-L * 0.48, 0); ctx.rotate(Math.sin(ph * 2) * 0.15);
    ctx.beginPath(); ctx.moveTo(L * 0.03, 0); ctx.quadraticCurveTo(-L * 0.04, -L * 0.03, -L * 0.09, -L * 0.07); ctx.quadraticCurveTo(-L * 0.06, 0, -L * 0.09, L * 0.07); ctx.quadraticCurveTo(-L * 0.04, L * 0.03, L * 0.03, 0); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.moveTo(L * 0.5, L * 0.01);
    ctx.bezierCurveTo(L * 0.46, -L * 0.06, L * 0.1, -L * 0.075, -L * 0.48, -L * 0.012);
    ctx.lineTo(-L * 0.48, L * 0.012);
    ctx.bezierCurveTo(L * 0.1, L * 0.07, L * 0.46, L * 0.06, L * 0.5, L * 0.01); ctx.fill();
    ctx.beginPath(); ctx.moveTo(L * dorsalAt, -L * 0.035); ctx.quadraticCurveTo(L * (dorsalAt - 0.02), -L * (0.035 + dorsalH), L * (dorsalAt - 0.06), -L * (0.035 + dorsalH)); ctx.lineTo(L * (dorsalAt - 0.06), -L * 0.03); ctx.fill();
    ctx.fillStyle = belly; ctx.beginPath(); ctx.moveTo(L * 0.48, L * 0.025); ctx.quadraticCurveTo(L * 0.1, L * 0.07, -L * 0.2, L * 0.03); ctx.quadraticCurveTo(L * 0.1, L * 0.04, L * 0.48, L * 0.025); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.18)"; ctx.lineWidth = Math.max(0.6, L * 0.002);
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(L * 0.45, L * (0.025 + i * 0.005)); ctx.lineTo(L * 0.2, L * (0.04 + i * 0.006)); ctx.stroke(); }
    ctx.fillStyle = top; ctx.save(); ctx.translate(L * 0.3, L * 0.04); ctx.rotate(0.6 + Math.sin(ph * 1.5) * 0.1); ctx.beginPath(); ctx.ellipse(0, L * 0.03, L * 0.012, L * 0.045, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = "#0e1418"; ctx.beginPath(); ctx.arc(L * 0.4, L * 0.01, L * 0.006, 0, TAU); ctx.fill();
    ctx.restore();
  }
  const drawBlueWhale = (x, y, dir, L, ph) => {
    drawBigWhale(x, y, dir, L, ph, sh("#5a7a98"), sh("#8aa4b8"), -0.28, 0.02);
    // pale mottling along the back
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.fillStyle = "rgba(200,220,235,0.25)";
    for (let i = 0; i < 16; i++) { ctx.beginPath(); ctx.ellipse(L * (0.35 - i * 0.05), -L * (0.02 + (i % 3) * 0.008), L * 0.01, L * 0.005, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
  };
  const drawFinWhale = (x, y, dir, L, ph) => drawBigWhale(x, y, dir, L, ph, sh("#3e4650"), sh("#e8eaea"), -0.2, 0.035);
  // pilot whales and false killer whales come in small groups
  function drawDolphinLike(x, y, dir, L, ph, col, round) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph) * 0.04);
    ctx.fillStyle = col;
    ctx.save(); ctx.translate(-L * 0.45, 0); ctx.rotate(Math.sin(ph * 2) * 0.2);
    ctx.beginPath(); ctx.moveTo(L * 0.04, 0); ctx.quadraticCurveTo(-L * 0.05, -L * 0.04, -L * 0.12, -L * 0.1); ctx.quadraticCurveTo(-L * 0.07, 0, -L * 0.12, L * 0.1); ctx.quadraticCurveTo(-L * 0.05, L * 0.04, L * 0.04, 0); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.moveTo(L * 0.5, L * 0.02);
    if (round) ctx.bezierCurveTo(L * 0.56, -L * 0.12, L * 0.36, -L * 0.14, L * 0.2, -L * 0.1);
    else ctx.bezierCurveTo(L * 0.5, -L * 0.06, L * 0.36, -L * 0.1, L * 0.2, -L * 0.09);
    ctx.bezierCurveTo(L * 0.0, -L * 0.1, -L * 0.3, -L * 0.05, -L * 0.46, 0);
    ctx.quadraticCurveTo(-L * 0.2, L * 0.08, L * 0.1, L * 0.09); ctx.quadraticCurveTo(L * 0.42, L * 0.09, L * 0.5, L * 0.02); ctx.fill();
    ctx.beginPath(); ctx.moveTo(L * 0.05, -L * 0.09); ctx.quadraticCurveTo(L * 0.0, -L * 0.22, -L * 0.1, -L * 0.25); ctx.quadraticCurveTo(-L * 0.06, -L * 0.15, -L * 0.1, -L * 0.07); ctx.fill();
    ctx.save(); ctx.translate(L * 0.22, L * 0.06); ctx.rotate(0.7 + Math.sin(ph * 1.5) * 0.2); ctx.beginPath(); ctx.ellipse(0, L * 0.05, L * 0.025, L * 0.07, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.beginPath(); ctx.ellipse(L * 0.1, L * 0.06, L * 0.2, L * 0.02, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#050505"; ctx.beginPath(); ctx.arc(L * 0.36, -L * 0.03, L * 0.012, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function drawPilotGroup(x, y, dir, L, ph) {
    for (const [ox, oy, sc] of [[0, 0, 1], [-1.0, -0.25, 0.9], [-0.7, 0.35, 0.85]]) drawDolphinLike(x + dir * ox * L, y + oy * L * 0.5 + Math.sin(ph * 1.5 + ox) * L * 0.05, dir, L * sc, ph + ox, sh("#22262a"), true);
  }
  function drawFalseKiller(x, y, dir, L, ph) {
    for (const [ox, oy, sc] of [[0, 0, 1], [-0.95, 0.2, 0.92]]) drawDolphinLike(x + dir * ox * L, y + oy * L * 0.5 + Math.sin(ph * 1.5 + ox) * L * 0.05, dir, L * sc, ph + ox, sh("#16181a"), false);
  }

  // ---- the system that runs them ---------------------------------------------------
  // kind: swim (open water), glide (just above the floor), floor (sits or crawls), surface (floats), dive (floats and dives)
  const FAUNA = {
    triggerfish: { kind: "swim", size: [22, 28], band: [0.35, 0.65], speed: 0.4, draw: drawTrigger, thumb: 72 },
    wrasse: { kind: "swim", size: [22, 28], band: [0.35, 0.7], speed: 0.6, draw: drawWrasse, thumb: 76 },
    surgeonfish: { kind: "swim", size: [20, 26], band: [0.3, 0.65], speed: 0.5, draw: drawSurgeon, thumb: 72 },
    mandarinfish: { kind: "swim", size: [13, 16], band: [0.7, 0.8], speed: 0.25, draw: drawMandarin, thumb: 84 },
    needlefish: { kind: "swim", size: [32, 42], band: [0.06, 0.16], speed: 0.9, draw: drawNeedle, thumb: 64 },
    seasnake: { kind: "swim", size: [44, 56], band: [0.4, 0.7], speed: 0.5, draw: drawSeaSnake, thumb: 96 },
    seakrait: { kind: "swim", size: [42, 52], band: [0.45, 0.75], speed: 0.5, draw: drawKrait, thumb: 96 },
    electricray: { kind: "glide", size: [28, 36], lift: [14, 26], speed: 0.3, draw: drawElectricRay, thumb: 70 },
    guitarfish: { kind: "glide", size: [44, 56], lift: [10, 20], speed: 0.35, draw: drawGuitar, thumb: 96 },
    iguana: { kind: "glide", size: [38, 46], lift: [20, 40], speed: 0.35, draw: drawIguana, thumb: 90 },
    scorpionfish: { kind: "floor", size: [26, 32], draw: drawScorpion, thumb: 76 },
    stonefish: { kind: "floor", size: [22, 28], draw: drawStonefish, thumb: 70 },
    goby: { kind: "floor", size: [13, 17], count: [1, 3], crawl: 0.12, draw: drawGoby, thumb: 64 },
    sanddollar: { kind: "floor", size: [9, 13], count: [2, 4], draw: drawSandDollar, thumb: 38 },
    brittlestar: { kind: "floor", size: [11, 15], count: [2, 4], crawl: 0.06, draw: drawBrittle, thumb: 40 },
    seacucumber: { kind: "floor", size: [18, 24], count: [1, 3], crawl: 0.04, draw: drawCucumber, thumb: 70 },
    featherstar: { kind: "floor", size: [16, 22], count: [1, 2], draw: drawFeather, thumb: 34 },
    albatross: { kind: "surface", size: [30, 36], speed: 0.15, draw: drawAlbatross, thumb: 64 },
    pelican: { kind: "surface", size: [32, 38], speed: 0.12, draw: drawPelican, thumb: 60 },
    walrus: { kind: "surface", size: [54, 66], speed: 0.25, draw: drawWalrus, thumb: 68 },
    polarbear: { kind: "surface", size: [52, 62], speed: 0.3, draw: drawPolarBear, thumb: 68 },
    cormorant: { kind: "dive", size: [24, 28], speed: 0.4, draw: drawCormorant, thumb: 62 },
  };
  const FAUNA_VIS = {
    thresher: { size: () => (180 + Math.random() * 60) * u, speed: 1.1, draw: drawThresher, thumb: 84 },
    whitetip: { size: () => (130 + Math.random() * 40) * u, speed: 1.0, draw: drawWhitetip, thumb: 104 },
    greatwhite: { size: () => (230 + Math.random() * 70) * u, speed: 0.9, draw: drawGreatWhite, thumb: 104 },
    marlin: { size: () => (170 + Math.random() * 50) * u, speed: 2.2, draw: drawMarlin, thumb: 92 },
    tuna: { size: () => (70 + Math.random() * 20) * u, speed: 1.8, draw: drawTuna, thumb: 40 },
    barracuda: { size: () => (110 + Math.random() * 30) * u, speed: 1.3, draw: drawBarracuda, thumb: 106 },
    coelacanth: { size: () => (110 + Math.random() * 30) * u, speed: 0.4, draw: drawCoelacanth, thumb: 86 },
    sawfish: { size: () => (190 + Math.random() * 50) * u, speed: 0.6, draw: drawSawfish, thumb: 96 },
    bluewhale: { size: () => Math.min(W * 1.15, 1150 * u), speed: 0.35, draw: drawBlueWhale, thumb: 116 },
    finwhale: { size: () => Math.min(W * 0.95, 900 * u), speed: 0.5, draw: drawFinWhale, thumb: 116 },
    pilotwhale: { size: () => (110 + Math.random() * 30) * u, speed: 1.1, draw: drawPilotGroup, thumb: 48 },
    falsekiller: { size: () => (120 + Math.random() * 30) * u, speed: 1.4, draw: drawFalseKiller, thumb: 52 },
  };
  for (const key in FAUNA) FAUNA[key].layer = FAUNA[key].kind === "floor" || FAUNA[key].kind === "glide" ? "floor" : FAUNA[key].kind === "swim" ? "mid" : "top";
  for (const key in FAUNA_VIS) {
    const F = FAUNA_VIS[key];
    VISITOR_DRAW[key] = v => F.draw(v.x, v.y + v.yOff, v.dir, v.size, v.ph);
    VISITOR_SPEED[key] = F.speed;
    VISITOR_PHASE[key] = 0.03;
    MORE_SIZE[key] = F.size;
  }

  function buildFauna(s, Lf, remap) {
    s.fauna = [];
    for (const key in FAUNA) {
      const F = FAUNA[key];
      if (!chance(Lf[key] || 0)) continue;
      if ((F.kind === "surface" || F.kind === "dive") && !water.surface) continue;
      const n = F.count ? F.count[0] + Math.floor(rng() * (F.count[1] - F.count[0] + 1)) : 1;
      for (let i = 0; i < n; i++) {
        const o = { key, x: rng() * W, dir: chance(0.5) ? 1 : -1, s: range(F.size[0], F.size[1]) * u, ph: range(0, TAU), tx: rng() * W };
        o.band = F.band ? range(F.band[0], F.band[1]) : 0.5;
        o.lift = F.lift ? range(F.lift[0], F.lift[1]) * u : 0;
        if (F.kind === "floor" || F.kind === "glide") o.x = remap(o.x);
        s.fauna.push(o);
      }
    }
  }
  function faunaPresent(S) {
    const o = {};
    for (const f of S.fauna || []) o[f.key] = (o[f.key] || 0) + 1;
    return o;
  }
  function faunaPoints(S) {
    const o = {};
    for (const key in FAUNA) o[key] = () => (S.fauna || []).filter(f => f.key === key && f.cy !== undefined).map(f => [f.x, f.cy - (FAUNA[key].kind === "floor" ? f.s * 0.3 : 0)]);
    return o;
  }
  function registerFaunaShinies(s, add) {
    for (const f of s.fauna) add(f.key, f, f.s * 0.6, () => [f.x, f.cy !== undefined ? f.cy : -999]);
  }

  function moveFauna(f, F, k) {
    f.ph += 0.05 * k;
    const edge = 30 * u;
    if (F.kind === "floor") {
      if (F.crawl) {
        f.x += f.dir * F.crawl * u * k;
        if (f.x < scene.floorL + edge) f.dir = 1;
        if (f.x > scene.floorR - edge) f.dir = -1;
      }
      f.cy = sandY(f.x) + 4 * u;
      return;
    }
    if (F.kind === "surface" || F.kind === "dive") {
      f.x += f.dir * F.speed * u * k;
      if (f.x < edge) f.dir = 1;
      if (f.x > W - edge) f.dir = -1;
      if (F.kind === "dive") {
        // a slow cycle of floating, diving down and coming back up
        const cyc = Math.sin(f.ph * 0.08);
        f.under = Math.max(0, cyc);
        f.diveDir = Math.cos(f.ph * 0.08) > 0 ? 1 : -1;
        f.cy = waveY(f.x) + f.under * H * 0.3;
      } else f.cy = waveY(f.x);
      return;
    }
    // swimmers and gliders wander between spots
    if (Math.abs(f.tx - f.x) < 12 * u) f.tx = Math.max(edge, Math.min(W - edge, f.x + (Math.random() - 0.5) * 380 * u));
    const dx = f.tx - f.x;
    f.x += Math.sign(dx) * F.speed * u * k;
    if (Math.abs(dx) > 6 * u) f.dir = Math.sign(dx);
    if (F.kind === "glide") f.cy = sandY(f.x) - f.lift + Math.sin(f.ph * 0.4) * 4 * u;
    else {
      let y = H * f.band + Math.sin(f.ph * 0.35) * 10 * u;
      if (water.surface) y = Math.max(y, waveY(f.x) + f.s * 0.4);
      f.cy = y;
    }
  }

  function drawFauna(k, layer) {
    for (const f of scene.fauna || []) {
      const F = FAUNA[f.key];
      if (F.layer !== layer) continue;
      moveFauna(f, F, k);
      shinyDraw(f, () => F.draw(f));
    }
  }

  // ---- logbook pictures -------------------------------------------------------
  for (const key in FAUNA) {
    const F = FAUNA[key];
    THUMBS[key] = () => {
      const o = { key, x: 60, dir: 1, s: F.thumb, ph: 1.2, under: 0 };
      if (F.kind === "floor") o.cy = sandY(60) + 4;
      else if (F.kind === "glide") o.cy = 54;
      else if (F.kind === "surface" || F.kind === "dive") {
        o.cy = 40;
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(0, 40); for (let x = 0; x <= TW; x += 6) ctx.lineTo(x, 40 + Math.sin(x * 0.15) * 1.5); ctx.stroke();
      } else o.cy = 42;
      F.draw(o);
    };
  }
  for (const key in FAUNA_VIS) {
    const F = FAUNA_VIS[key];
    THUMBS[key] = () => F.draw(key === "tuna" || key === "pilotwhale" || key === "falsekiller" ? 78 : 60, 44, 1, F.thumb, 0.5);
  }
  for (const key of ["scorpionfish", "stonefish", "goby", "sanddollar", "brittlestar", "seacucumber", "featherstar", "electricray", "guitarfish", "iguana"]) FLOOR_THUMBS.add(key);
  Object.assign(BASE_HUE, {
    triggerfish: 40, wrasse: 150, surgeonfish: 225, mandarinfish: 25, needlefish: 195, seasnake: 50, seakrait: 215, electricray: 25, guitarfish: 35, iguana: 190,
    scorpionfish: 8, stonefish: 40, goby: 40, sanddollar: 300, brittlestar: 320, seacucumber: 20, featherstar: 25,
    albatross: 200, pelican: 40, walrus: 25, polarbear: 50, cormorant: 200,
    thresher: 215, whitetip: 205, greatwhite: 205, marlin: 220, tuna: 220, barracuda: 200, coelacanth: 220, sawfish: 40,
    bluewhale: 210, finwhale: 210, pilotwhale: 200, falsekiller: 200,
  });

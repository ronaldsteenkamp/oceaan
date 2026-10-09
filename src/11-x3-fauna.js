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
  function drawTrigger(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    ctx.fillStyle = sh("#3a3a3a");
    ctx.save(); ctx.translate(-s * 0.4, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.25);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s * 0.2, -s * 0.15); ctx.lineTo(-s * 0.2, s * 0.15); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = sh("#e8dcc0");
    ctx.beginPath(); ctx.moveTo(s * 0.48, s * 0.02); ctx.quadraticCurveTo(s * 0.3, -s * 0.4, -s * 0.05, -s * 0.36); ctx.quadraticCurveTo(-s * 0.35, -s * 0.2, -s * 0.42, 0);
    ctx.quadraticCurveTo(-s * 0.35, s * 0.22, -s * 0.05, s * 0.34); ctx.quadraticCurveTo(s * 0.3, s * 0.32, s * 0.48, s * 0.02); ctx.fill();
    ctx.save(); ctx.clip();
    ctx.fillStyle = sh("#1c1c1c"); ctx.fillRect(s * 0.12, -s * 0.5, s * 0.1, s); ctx.fillRect(-s * 0.3, -s * 0.5, s * 0.08, s);
    ctx.strokeStyle = sh("#3a7fd0"); ctx.lineWidth = s * 0.05;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-s * 0.15 + i * s * 0.08, -s * 0.4); ctx.lineTo(-s * 0.05 + i * s * 0.08, s * 0.4); ctx.stroke(); }
    ctx.fillStyle = sh("#f2c030"); ctx.fillRect(-s * 0.5, s * 0.12, s, s * 0.06);
    ctx.restore();
    ctx.strokeStyle = sh("#3a3a3a"); ctx.lineWidth = s * 0.04; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(s * 0.0, -s * 0.36); ctx.lineTo(-s * 0.06, -s * 0.52); ctx.stroke();
    ctx.fillStyle = sh("#f2c030"); ctx.beginPath(); ctx.ellipse(s * 0.47, s * 0.04, s * 0.05, s * 0.035, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.22, -s * 0.12, s * 0.04, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawWrasse(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    ctx.fillStyle = sh("#f2c840");
    ctx.save(); ctx.translate(-s * 0.46, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.3);
    ctx.beginPath(); ctx.moveTo(s * 0.02, 0); ctx.lineTo(-s * 0.18, -s * 0.14); ctx.quadraticCurveTo(-s * 0.1, 0, -s * 0.18, s * 0.14); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = sh("#3fbf8a");
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.5, s * 0.16, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#f070b0"); ctx.lineWidth = Math.max(0.7, s * 0.03);
    ctx.beginPath(); for (let i = 0; i <= 10; i++) ctx.lineTo(-s * 0.4 + i * s * 0.08, -s * 0.04 + (i % 2) * s * 0.05); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.25, -s * 0.1); ctx.lineTo(s * 0.42, -s * 0.02); ctx.stroke();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.34, -s * 0.04, s * 0.035, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawSurgeon(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    ctx.fillStyle = sh("#f2d030");
    ctx.save(); ctx.translate(-s * 0.4, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.3);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s * 0.2, -s * 0.18); ctx.quadraticCurveTo(-s * 0.12, 0, -s * 0.2, s * 0.18); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = sh("#2f5fe0");
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.42, s * 0.28, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#101830");
    ctx.beginPath(); ctx.moveTo(s * 0.2, -s * 0.12); ctx.quadraticCurveTo(-s * 0.1, -s * 0.3, -s * 0.38, -s * 0.05); ctx.quadraticCurveTo(-s * 0.1, -s * 0.1, -s * 0.15, s * 0.1);
    ctx.quadraticCurveTo(0, -s * 0.02, s * 0.2, -s * 0.12); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.25, -s * 0.06, s * 0.045, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawMandarin(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    const fan = 0.7 + 0.3 * Math.sin(f.ph * 3);
    ctx.fillStyle = sh("#3a8ad8");
    ctx.beginPath(); ctx.moveTo(-s * 0.1, -s * 0.15); ctx.quadraticCurveTo(-s * 0.3, -s * 0.5 * fan, s * 0.1, -s * 0.2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.4, 0); ctx.lineTo(-s * 0.65, -s * 0.2); ctx.lineTo(-s * 0.65, s * 0.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = sh("#f08a30");
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.45, s * 0.22, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#2f6fe0"); ctx.lineWidth = Math.max(0.7, s * 0.06);
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-s * 0.35 + i * s * 0.2, -s * 0.18); ctx.quadraticCurveTo(-s * 0.25 + i * s * 0.2, 0, -s * 0.35 + i * s * 0.2, s * 0.18); ctx.stroke(); }
    ctx.fillStyle = sh("#3fc0a0"); ctx.beginPath(); ctx.ellipse(s * 0.1, s * 0.12, s * 0.12, s * 0.06, 0.5 + Math.sin(f.ph * 4) * 0.2, 0, TAU); ctx.fill();
    ctx.fillStyle = "#f2e070"; ctx.beginPath(); ctx.arc(s * 0.3, -s * 0.06, s * 0.07, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.31, -s * 0.06, s * 0.035, 0, TAU); ctx.fill();
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
  function drawElectricRay(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    ctx.fillStyle = sh("#8a5a3a");
    ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.03); ctx.lineTo(-s * 0.72, -s * 0.02); ctx.lineTo(-s * 0.8, -s * 0.08); ctx.lineTo(-s * 0.8, s * 0.06); ctx.lineTo(-s * 0.72, s * 0.03); ctx.lineTo(-s * 0.3, s * 0.03); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 0.03); ctx.lineTo(-s * 0.55, -s * 0.09); ctx.lineTo(-s * 0.6, -s * 0.03); ctx.fill();
    const flap = Math.sin(f.ph * 1.5) * 0.04;
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.4, s * (0.13 + flap), 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#a87a5a"); ctx.beginPath(); ctx.ellipse(0, -s * 0.03, s * 0.36, s * 0.07, 0, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = sh("#2f4f8a");
    for (const ex of [-0.12, 0.12]) { ctx.beginPath(); ctx.arc(ex * s, -s * 0.06, s * 0.035, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.25, -s * 0.07, s * 0.02, 0, TAU); ctx.fill();
    // a faint crackle now and then
    if (Math.sin(f.ph * 0.7) > 0.97) { ctx.strokeStyle = "rgba(200,230,255,0.8)"; ctx.lineWidth = 1 * u; ctx.beginPath(); ctx.moveTo(-s * 0.2, -s * 0.2); ctx.lineTo(-s * 0.1, -s * 0.28); ctx.lineTo(0, -s * 0.2); ctx.lineTo(s * 0.1, -s * 0.3); ctx.stroke(); }
    ctx.restore();
  }

  function drawGuitar(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    const sand = sh("#c8a878"), dark = sh("#8a6a48");
    ctx.save(); ctx.translate(-s * 0.3, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.08);
    ctx.fillStyle = sand;
    ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.05); ctx.lineTo(-s * 0.3, -s * 0.02); ctx.lineTo(-s * 0.42, -s * 0.12); ctx.lineTo(-s * 0.44, s * 0.06); ctx.lineTo(-s * 0.3, s * 0.03); ctx.lineTo(s * 0.1, s * 0.05); ctx.fill();
    ctx.fillStyle = dark;
    for (const dx of [-0.05, -0.2]) { ctx.beginPath(); ctx.moveTo(s * dx, -s * 0.04); ctx.lineTo(s * (dx - 0.05), -s * 0.13); ctx.lineTo(s * (dx - 0.08), -s * 0.03); ctx.fill(); }
    ctx.restore();
    // the flat, wedge-shaped front half
    ctx.fillStyle = sand;
    ctx.beginPath(); ctx.moveTo(s * 0.5, 0); ctx.quadraticCurveTo(s * 0.3, -s * 0.08, -s * 0.2, -s * 0.06); ctx.lineTo(-s * 0.2, s * 0.06); ctx.quadraticCurveTo(s * 0.3, s * 0.08, s * 0.5, 0); ctx.fill();
    ctx.fillStyle = dark; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(s * (0.3 - i * 0.07), ((i * 3) % 3 - 1) * s * 0.02, s * 0.01, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.3, -s * 0.04, s * 0.015, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawIguana(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    const skin = sh("#3a4040"), crest = sh("#6a7068");
    ctx.strokeStyle = skin; ctx.lineCap = "round";
    ctx.lineWidth = s * 0.07;
    ctx.beginPath(); ctx.moveTo(-s * 0.15, 0);
    for (let i = 1; i <= 8; i++) { const fr = i / 8; ctx.lineTo(-s * (0.15 + fr * 0.55), Math.sin(f.ph * 3 - fr * 4) * s * 0.06 * fr); }
    ctx.stroke();
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.22, s * 0.08, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.26, -s * 0.02, s * 0.09, s * 0.06, 0.1, 0, TAU); ctx.fill();
    ctx.fillStyle = crest;
    for (let i = 0; i < 8; i++) { const x = s * (0.24 - i * 0.06); ctx.beginPath(); ctx.moveTo(x - s * 0.02, -s * 0.06); ctx.lineTo(x, -s * 0.11); ctx.lineTo(x + s * 0.02, -s * 0.06); ctx.fill(); }
    ctx.strokeStyle = skin; ctx.lineWidth = s * 0.03;
    for (const lx of [0.12, -0.12]) { ctx.beginPath(); ctx.moveTo(s * lx, s * 0.05); ctx.lineTo(s * (lx - 0.06), s * 0.12); ctx.stroke(); }
    ctx.fillStyle = "#c84a3a"; ctx.beginPath(); ctx.arc(s * 0.3, -s * 0.04, s * 0.012, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ---- animals on the floor ------------------------------------------------------
  function drawFrogfish(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    const body = sh("#f0a030"), dark = sh("#c87018");
    ctx.fillStyle = body;
    // the arm-like fins it walks on
    for (const lx of [0.1, -0.15]) { ctx.beginPath(); ctx.ellipse(s * lx, -s * 0.05, s * 0.07, s * 0.12, 0.6, 0, TAU); ctx.fill(); }
    ctx.beginPath(); ctx.arc(0, -s * 0.35, s * 0.35, 0, TAU); ctx.fill();
    ctx.fillStyle = dark;
    for (let i = 0; i < 9; i++) { const a = i * 2.4; ctx.beginPath(); ctx.arc(Math.cos(a) * s * 0.22, -s * 0.35 + Math.sin(a) * s * 0.22, s * 0.04, 0, TAU); ctx.fill(); }
    // a big upturned mouth and the fishing lure on its head
    ctx.fillStyle = "#3a1a10"; ctx.beginPath(); ctx.ellipse(s * 0.28, -s * 0.3, s * 0.07, s * (0.03 + Math.max(0, Math.sin(f.ph)) * 0.04), -0.4, 0, TAU); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(0.7, s * 0.03);
    const lx = s * 0.35 + Math.sin(f.ph * 2) * s * 0.05;
    ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.66); ctx.quadraticCurveTo(s * 0.25, -s * 0.85, lx, -s * 0.7); ctx.stroke();
    ctx.fillStyle = sh("#f2e8c0"); ctx.beginPath(); ctx.arc(lx, -s * 0.7, s * 0.04, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.15, -s * 0.5, s * 0.04, 0, TAU); ctx.fill();
    ctx.restore();
  }

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

  function drawBlenny(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    // a little rock with a hole, and the blenny peeking out
    ctx.fillStyle = sh("#8a8478");
    ctx.beginPath(); ctx.ellipse(0, 0, s * 1.0, s * 0.6, 0, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = "#14100c"; ctx.beginPath(); ctx.ellipse(s * 0.1, -s * 0.3, s * 0.25, s * 0.2, 0, 0, TAU); ctx.fill();
    const peek = 0.6 + 0.4 * Math.sin(f.ph * 0.8);
    ctx.save(); ctx.translate(s * 0.1 + peek * s * 0.15, -s * 0.3);
    ctx.fillStyle = sh("#e8c050");
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.22, s * 0.17, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#fff"; for (const ey of [-0.06]) { ctx.beginPath(); ctx.arc(s * 0.08, s * ey, s * 0.06, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.1, -s * 0.06, s * 0.03, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#c86a3a"); ctx.lineWidth = Math.max(0.6, s * 0.03);
    ctx.beginPath(); ctx.moveTo(s * 0.05, -s * 0.13); ctx.lineTo(s * 0.0, -s * 0.24); ctx.moveTo(s * 0.12, -s * 0.13); ctx.lineTo(s * 0.12, -s * 0.25); ctx.stroke();
    ctx.strokeStyle = "#5a3a20"; ctx.beginPath(); ctx.moveTo(s * 0.17, s * 0.06); ctx.lineTo(s * 0.21, s * 0.06); ctx.stroke();
    ctx.restore();
    ctx.restore();
  }

  function drawGoby(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy - s * 0.12); ctx.scale(f.dir, 1);
    ctx.fillStyle = sh("#d8c8a0");
    ctx.beginPath(); ctx.moveTo(-s * 0.42, 0); ctx.lineTo(-s * 0.58, -s * 0.1); ctx.lineTo(-s * 0.58, s * 0.08); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.45, s * 0.13, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(220,200,160,0.7)";
    ctx.beginPath(); ctx.moveTo(s * 0.0, -s * 0.1); ctx.quadraticCurveTo(-s * 0.1, -s * 0.32, -s * 0.22, -s * 0.12); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.2, -s * 0.1); ctx.quadraticCurveTo(-s * 0.3, -s * 0.28, -s * 0.38, -s * 0.1); ctx.fill();
    ctx.fillStyle = sh("#8a6a3a"); for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(s * (0.25 - i * 0.12), s * ((i % 2) * 0.04 - 0.02), s * 0.03, 0, TAU); ctx.fill(); }
    ctx.fillStyle = sh("#3a8ad8"); ctx.beginPath(); ctx.arc(s * 0.1, s * 0.03, s * 0.025, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.32, -s * 0.07, s * 0.035, 0, TAU); ctx.fill();
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
  function drawAlbatross(f) {
    const s = f.s, spread = Math.max(0, Math.sin(f.ph * 0.12) - 0.85) / 0.15;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    ctx.fillStyle = sh("#f4f4f0");
    ctx.beginPath(); ctx.ellipse(0, -s * 0.12, s * 0.5, s * 0.18, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.45, -s * 0.12); ctx.lineTo(-s * 0.62, -s * 0.2); ctx.lineTo(-s * 0.5, -s * 0.06); ctx.fill();
    ctx.fillStyle = sh("#3a3a40");
    if (spread > 0) {
      // now and then it stretches its huge wings
      for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-s * 0.05, -s * 0.2); ctx.quadraticCurveTo(sd * s * 0.6, -s * (0.5 + spread * 0.5), sd * s * (0.5 + spread * 1.0), -s * (0.25 + spread * 0.3)); ctx.lineTo(sd * s * 0.1, -s * 0.12); ctx.fill(); }
    } else { ctx.beginPath(); ctx.ellipse(-s * 0.08, -s * 0.2, s * 0.42, s * 0.08, -0.08, 0, TAU); ctx.fill(); }
    ctx.fillStyle = sh("#f4f4f0"); ctx.beginPath(); ctx.ellipse(s * 0.45, -s * 0.3, s * 0.12, s * 0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#f0b8a0"); ctx.beginPath(); ctx.moveTo(s * 0.54, -s * 0.31); ctx.lineTo(s * 0.8, -s * 0.27); ctx.lineTo(s * 0.54, -s * 0.24); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.48, -s * 0.33, s * 0.02, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#f0b8a0"); ctx.beginPath(); ctx.ellipse(-s * 0.05, s * 0.1, s * 0.06, s * 0.1, Math.sin(f.ph * 2) * 0.5, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawPelican(f) {
    const s = f.s, dip = Math.max(0, Math.sin(f.ph * 0.2) - 0.9) / 0.1;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    ctx.fillStyle = sh("#f0ece0");
    ctx.beginPath(); ctx.ellipse(0, -s * 0.12, s * 0.45, s * 0.2, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#8a7a68"); ctx.beginPath(); ctx.ellipse(-s * 0.08, -s * 0.2, s * 0.35, s * 0.1, -0.1, 0, TAU); ctx.fill();
    // the S-shaped neck and the long bill with its pouch; now and then it scoops in the water
    ctx.strokeStyle = sh("#f0ece0"); ctx.lineWidth = s * 0.1; ctx.lineCap = "round";
    const hx = s * 0.4, hy = -s * (0.55 - dip * 0.55);
    ctx.beginPath(); ctx.moveTo(s * 0.3, -s * 0.2); ctx.quadraticCurveTo(s * 0.5, -s * 0.35, hx, hy); ctx.stroke();
    ctx.fillStyle = sh("#f0ece0"); ctx.beginPath(); ctx.arc(hx, hy, s * 0.08, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(hx, hy); ctx.rotate(0.3 + dip * 0.9);
    ctx.fillStyle = sh("#e8a040"); ctx.beginPath(); ctx.moveTo(0, -s * 0.02); ctx.lineTo(s * 0.55, s * 0.0); ctx.lineTo(0, s * 0.03); ctx.fill();
    ctx.fillStyle = sh("#e8b878"); ctx.beginPath(); ctx.moveTo(s * 0.02, s * 0.03); ctx.quadraticCurveTo(s * 0.25, s * 0.18, s * 0.5, s * 0.01); ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(hx + s * 0.02, hy - s * 0.02, s * 0.018, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawWalrus(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    const skin = sh("#8a5a40"), dark = sh("#6a4030");
    // most of the body is under water; the head stays up
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.ellipse(-s * 0.1, s * 0.25, s * 0.5, s * 0.17, 0.05, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.25, s * 0.1, s * 0.16, s * 0.14, -0.6, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(-s * 0.58, s * 0.27); ctx.rotate(Math.sin(f.ph * 2) * 0.3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s * 0.15, -s * 0.08); ctx.lineTo(-s * 0.15, s * 0.08); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(s * 0.38, -s * 0.05, s * 0.16, s * 0.15, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(s * 0.48, s * 0.0, s * 0.1, s * 0.07, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#f2ead8"); ctx.lineWidth = s * 0.035; ctx.lineCap = "round";
    for (const dx of [0.44, 0.52]) { ctx.beginPath(); ctx.moveTo(s * dx, s * 0.04); ctx.lineTo(s * (dx - 0.02), s * 0.28); ctx.stroke(); }
    ctx.strokeStyle = sh("#d8c8a8"); ctx.lineWidth = Math.max(0.5, s * 0.008);
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(s * 0.5, s * (0.0 + i * 0.01)); ctx.lineTo(s * 0.6, s * (-0.02 + i * 0.025)); ctx.stroke(); }
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.38, -s * 0.1, s * 0.018, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawPolarBear(f) {
    const s = f.s;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    const fur = sh("#f2eee0"), shade = sh("#d8d2c0");
    // paws paddle under the surface
    ctx.fillStyle = shade;
    for (let i = 0; i < 2; i++) { const sw = Math.sin(f.ph * 2 + i * Math.PI) * s * 0.08; ctx.beginPath(); ctx.ellipse(s * (0.12 - i * 0.35) + sw, s * 0.36, s * 0.06, s * 0.1, 0.3, 0, TAU); ctx.fill(); }
    ctx.fillStyle = fur;
    ctx.beginPath(); ctx.ellipse(-s * 0.1, s * 0.22, s * 0.45, s * 0.16, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.25, s * 0.08, s * 0.14, s * 0.12, -0.6, 0, TAU); ctx.fill();
    // the head above water, long and slender
    ctx.beginPath(); ctx.ellipse(s * 0.38, -s * 0.06, s * 0.17, s * 0.11, -0.15, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.3, -s * 0.16, s * 0.035, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(s * 0.54, -s * 0.09, s * 0.025, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(s * 0.4, -s * 0.1, s * 0.015, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // A cormorant floats, then dives after fish and comes back up.
  function drawCormorant(f) {
    const s = f.s, under = f.under || 0;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(f.dir, 1);
    const black = sh("#1e2226"), sheen = sh("#2e4a3a");
    if (under < 0.15) {
      ctx.fillStyle = black;
      ctx.beginPath(); ctx.ellipse(0, -s * 0.08, s * 0.42, s * 0.14, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = black; ctx.lineWidth = s * 0.1; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(s * 0.3, -s * 0.12); ctx.quadraticCurveTo(s * 0.42, -s * 0.45, s * 0.36, -s * 0.55); ctx.stroke();
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
  function drawThresher(x, y, dir, L, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph) * 0.02);
    // the enormously long upper tail lobe whips from side to side
    ctx.save(); ctx.translate(-L * 0.36, 0); ctx.rotate(Math.sin(ph * 2) * 0.12); ctx.translate(L * 0.36, 0);
    sharkForm(L, sh("#5a6a8a"), sh("#dfe4ea"), { upper: 0.55 });
    ctx.restore();
    ctx.restore();
  }
  function drawWhitetip(x, y, dir, L, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph) * 0.02);
    sharkForm(L, sh("#7a8288"), sh("#d8dcdf"), { upper: 0.22, tip: "#f4f4f4" });
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
  function drawMarlin(x, y, dir, L, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph) * 0.02);
    const back = sh("#1e3a6a"), belly = sh("#c8d8e8");
    ctx.fillStyle = back;
    ctx.save(); ctx.translate(-L * 0.4, 0); ctx.rotate(Math.sin(ph * 2) * 0.12);
    ctx.beginPath(); ctx.moveTo(L * 0.02, 0); ctx.quadraticCurveTo(-L * 0.08, -L * 0.1, -L * 0.14, -L * 0.18); ctx.quadraticCurveTo(-L * 0.08, 0, -L * 0.14, L * 0.18); ctx.quadraticCurveTo(-L * 0.08, L * 0.1, L * 0.02, 0); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.moveTo(L * 0.35, 0); ctx.bezierCurveTo(L * 0.25, -L * 0.09, -L * 0.15, -L * 0.07, -L * 0.4, -L * 0.01); ctx.lineTo(-L * 0.4, L * 0.01); ctx.bezierCurveTo(-L * 0.15, L * 0.07, L * 0.25, L * 0.08, L * 0.35, 0); ctx.fill();
    ctx.beginPath(); ctx.moveTo(L * 0.2, -L * 0.06); ctx.quadraticCurveTo(L * 0.15, -L * 0.18, L * 0.05, -L * 0.12); ctx.lineTo(-L * 0.25, -L * 0.04); ctx.fill();
    ctx.beginPath(); ctx.moveTo(L * 0.34, -L * 0.01); ctx.lineTo(L * 0.62, 0); ctx.lineTo(L * 0.34, L * 0.012); ctx.fill();
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(L * 0.0, L * 0.035, L * 0.3, L * 0.025, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#6ab0e8"); ctx.lineWidth = Math.max(0.7, L * 0.006);
    for (let i = 0; i < 9; i++) { const sx = L * (0.2 - i * 0.055); ctx.beginPath(); ctx.moveTo(sx, -L * 0.05); ctx.lineTo(sx - L * 0.01, L * 0.04); ctx.stroke(); }
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(L * 0.3, -L * 0.015, L * 0.012, 0, TAU); ctx.fill();
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
  // The coelacanth: a living fossil with fleshy, leg-like fins.
  function drawCoelacanth(x, y, dir, L, ph) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1); ctx.rotate(Math.sin(ph) * 0.03);
    const body = sh("#2a3a5a"), spot = sh("#e8eef2");
    ctx.fillStyle = body;
    // three-lobed tail
    ctx.save(); ctx.translate(-L * 0.38, 0); ctx.rotate(Math.sin(ph * 2) * 0.1);
    ctx.beginPath(); ctx.moveTo(L * 0.02, 0); ctx.lineTo(-L * 0.12, -L * 0.14); ctx.lineTo(-L * 0.1, 0); ctx.lineTo(-L * 0.12, L * 0.14); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-L * 0.14, 0, L * 0.05, L * 0.025, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, 0, L * 0.42, L * 0.15, 0, 0, TAU); ctx.fill();
    // lobed fins on little stalks, moving like legs
    for (const [fx, fy, a] of [[0.12, 0.12, 0.9], [-0.08, 0.13, 1.1], [0.05, -0.13, -1.0], [-0.15, -0.12, -1.2]]) {
      const sw = Math.sin(ph * 2 + fx * 10) * 0.35;
      ctx.save(); ctx.translate(L * fx, L * fy); ctx.rotate(a + sw);
      ctx.beginPath(); ctx.ellipse(0, L * 0.06, L * 0.025, L * 0.07, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
    ctx.fillStyle = spot;
    for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.ellipse(L * (0.28 - i * 0.055), L * (((i * 7) % 5) - 2) * 0.03, L * 0.018, L * 0.012, 0.4, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#f2e8a0"; ctx.beginPath(); ctx.arc(L * 0.32, -L * 0.03, L * 0.025, 0, TAU); ctx.fill();
    ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(L * 0.325, -L * 0.03, L * 0.012, 0, TAU); ctx.fill();
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
    triggerfish: { kind: "swim", size: [22, 28], band: [0.35, 0.65], speed: 0.4, draw: drawTrigger, thumb: 52 },
    wrasse: { kind: "swim", size: [22, 28], band: [0.35, 0.7], speed: 0.6, draw: drawWrasse, thumb: 60 },
    surgeonfish: { kind: "swim", size: [20, 26], band: [0.3, 0.65], speed: 0.5, draw: drawSurgeon, thumb: 56 },
    mandarinfish: { kind: "swim", size: [13, 16], band: [0.7, 0.8], speed: 0.25, draw: drawMandarin, thumb: 54 },
    needlefish: { kind: "swim", size: [32, 42], band: [0.06, 0.16], speed: 0.9, draw: drawNeedle, thumb: 64 },
    seasnake: { kind: "swim", size: [44, 56], band: [0.4, 0.7], speed: 0.5, draw: drawSeaSnake, thumb: 96 },
    seakrait: { kind: "swim", size: [42, 52], band: [0.45, 0.75], speed: 0.5, draw: drawKrait, thumb: 96 },
    electricray: { kind: "glide", size: [28, 36], lift: [14, 26], speed: 0.3, draw: drawElectricRay, thumb: 70 },
    guitarfish: { kind: "glide", size: [44, 56], lift: [10, 20], speed: 0.35, draw: drawGuitar, thumb: 96 },
    iguana: { kind: "glide", size: [38, 46], lift: [20, 40], speed: 0.35, draw: drawIguana, thumb: 90 },
    frogfish: { kind: "floor", size: [20, 26], draw: drawFrogfish, thumb: 56 },
    scorpionfish: { kind: "floor", size: [26, 32], draw: drawScorpion, thumb: 76 },
    stonefish: { kind: "floor", size: [22, 28], draw: drawStonefish, thumb: 70 },
    blenny: { kind: "floor", size: [13, 17], count: [1, 2], draw: drawBlenny, thumb: 40 },
    goby: { kind: "floor", size: [13, 17], count: [1, 3], crawl: 0.12, draw: drawGoby, thumb: 64 },
    sanddollar: { kind: "floor", size: [9, 13], count: [2, 4], draw: drawSandDollar, thumb: 38 },
    brittlestar: { kind: "floor", size: [11, 15], count: [2, 4], crawl: 0.06, draw: drawBrittle, thumb: 40 },
    seacucumber: { kind: "floor", size: [18, 24], count: [1, 3], crawl: 0.04, draw: drawCucumber, thumb: 70 },
    featherstar: { kind: "floor", size: [16, 22], count: [1, 2], draw: drawFeather, thumb: 34 },
    albatross: { kind: "surface", size: [30, 36], speed: 0.15, draw: drawAlbatross, thumb: 64 },
    pelican: { kind: "surface", size: [32, 38], speed: 0.12, draw: drawPelican, thumb: 60 },
    walrus: { kind: "surface", size: [54, 66], speed: 0.25, draw: drawWalrus, thumb: 96 },
    polarbear: { kind: "surface", size: [52, 62], speed: 0.3, draw: drawPolarBear, thumb: 96 },
    cormorant: { kind: "dive", size: [24, 28], speed: 0.4, draw: drawCormorant, thumb: 62 },
  };
  const FAUNA_VIS = {
    thresher: { size: () => (180 + Math.random() * 60) * u, speed: 1.1, draw: drawThresher, thumb: 84 },
    whitetip: { size: () => (130 + Math.random() * 40) * u, speed: 1.0, draw: drawWhitetip, thumb: 104 },
    greatwhite: { size: () => (230 + Math.random() * 70) * u, speed: 0.9, draw: drawGreatWhite, thumb: 104 },
    marlin: { size: () => (170 + Math.random() * 50) * u, speed: 2.2, draw: drawMarlin, thumb: 92 },
    tuna: { size: () => (70 + Math.random() * 20) * u, speed: 1.8, draw: drawTuna, thumb: 40 },
    barracuda: { size: () => (110 + Math.random() * 30) * u, speed: 1.3, draw: drawBarracuda, thumb: 106 },
    coelacanth: { size: () => (110 + Math.random() * 30) * u, speed: 0.4, draw: drawCoelacanth, thumb: 104 },
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
  for (const key of ["frogfish", "scorpionfish", "stonefish", "blenny", "goby", "sanddollar", "brittlestar", "seacucumber", "featherstar", "electricray", "guitarfish", "iguana"]) FLOOR_THUMBS.add(key);
  Object.assign(BASE_HUE, {
    triggerfish: 40, wrasse: 150, surgeonfish: 225, mandarinfish: 25, needlefish: 195, seasnake: 50, seakrait: 215, electricray: 25, guitarfish: 35, iguana: 190,
    frogfish: 35, scorpionfish: 8, stonefish: 40, blenny: 45, goby: 40, sanddollar: 300, brittlestar: 320, seacucumber: 20, featherstar: 25,
    albatross: 200, pelican: 40, walrus: 25, polarbear: 50, cormorant: 200,
    thresher: 215, whitetip: 205, greatwhite: 205, marlin: 220, tuna: 220, barracuda: 200, coelacanth: 220, sawfish: 40,
    bluewhale: 210, finwhale: 210, pilotwhale: 200, falsekiller: 200,
  });

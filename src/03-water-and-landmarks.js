  // ---- water and floor ---------------------------------------------------
  function drawRays() {
    ctx.globalCompositeOperation = "lighter";
    for (const r of scene.rays) {
      const cv = scene.cave;
      const x = cv ? (cv.ox + Math.sin(t * 0.05 * r.sp + r.ph) * cv.ow * 0.25) * W : ((r.x + t * 0.004 * r.sp) % 1.2 - 0.1) * W;
      const w = r.w * W * (cv ? 0.5 : 1);
      const a = water.rayA * (0.55 + 0.45 * Math.sin(t * r.sp + r.ph)) * (0.15 + 0.85 * day) * (scene.season === "herfst" ? 0.6 : 1.15);
      const g = ctx.createLinearGradient(0, 0, 0, H * 0.9);
      g.addColorStop(0, `rgba(${water.ray},${a})`);
      g.addColorStop(1, `rgba(${water.ray},0)`);
      ctx.fillStyle = g;
      const dx = r.slant * H;
      ctx.beginPath();
      ctx.moveTo(x - w * 0.5, 0);
      ctx.lineTo(x + w * 0.5, 0);
      ctx.lineTo(x + dx + w * 1.4, H * 0.9);
      ctx.lineTo(x + dx - w * 1.4, H * 0.9);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  const SNOW_LEVELS = 6;
  function drawSnow(k) {
    ctx.fillStyle = `rgb(${water.snow})`;
    const paths = [];
    for (const p of scene.snow) {
      p.y += p.sp * u * k;
      p.x += Math.sin(t * 0.6 + p.ph) * 0.12 * k + current * 1.2 * k;
      if (p.y > H + 4) { p.y = -4; p.x = Math.random() * W; }
      if (p.x > W + 4) p.x = -4;
      if (p.x < -4) p.x = W + 4;
      // specks are grouped by brightness, so each group is filled in one go
      const lv = Math.min(SNOW_LEVELS - 1, Math.round(p.a * SNOW_LEVELS));
      const path = paths[lv] || (paths[lv] = new Path2D());
      path.moveTo(p.x + p.r, p.y);
      path.arc(p.x, p.y, p.r, 0, TAU);
    }
    paths.forEach((path, lv) => { if (path) { ctx.globalAlpha = Math.max(0.04, lv / SNOW_LEVELS); ctx.fill(path); } });
    ctx.globalAlpha = 1;
  }

  function drawKelp(list, alpha) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const kp of list) {
      const seg = kp.h / kp.segs;
      let x = kp.x, y = sandY(kp.x) + 6 * u, ang = -Math.PI / 2;
      const pts = [[x, y]];
      for (let i = 1; i <= kp.segs; i++) {
        ang += Math.sin(t * 0.7 + kp.ph + i * 0.28) * 0.045 + 0.004 + current * 0.02;
        const n = near(x, y, 90 * u);
        if (n) ang += Math.sign(x - diver.x || 1) * 0.12 * n;
        x += Math.cos(ang) * seg;
        y += Math.sin(ang) * seg;
        if (water.surface) {
          const lim = waveY(x) + 5 * u;
          if (y < lim) { y = lim; ang = Math.cos(ang) >= 0 ? -0.05 : Math.PI + 0.05; }
        }
        pts.push([x, y, ang]);
      }
      kp.pts = pts;
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = kp.color;
      ctx.fillStyle = kp.color;
      ctx.lineWidth = kp.w;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
        ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let i = 2; i < pts.length; i += 2) {
        const [px, py, a] = pts[i];
        const side = (i / 2) % 2 ? 1 : -1;
        const leaf = seg * 1.1 * (1 - i / pts.length * 0.4);
        const rot = a + side * 0.9 + Math.sin(t + i) * 0.1, cx = px + Math.cos(rot) * leaf * 0.5, cy = py + Math.sin(rot) * leaf * 0.5;
        ctx.moveTo(cx + Math.cos(rot) * leaf * 0.6, cy + Math.sin(rot) * leaf * 0.6);
        ctx.ellipse(cx, cy, leaf * 0.6, leaf * 0.22, rot, 0, TAU);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function sandPath(offset) {
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, sandY(x) + offset);
    ctx.lineTo(W, H);
    ctx.closePath();
  }

  function sandGradient() {
    const top = H * (1 - scene.sand.frac) - 12 * u;
    const g = ctx.createLinearGradient(0, top, 0, H);
    g.addColorStop(0, water.sand[0]);
    g.addColorStop(1, water.sand[1]);
    return g;
  }

  function drawSand() {
    ctx.fillStyle = sandGradient();
    sandPath(0);
    ctx.fill();
  }

  // A front lip of sand half-buries everything standing on the floor.
  function drawSandLip() {
    ctx.fillStyle = sandGradient();
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W + 8; x += 8) ctx.lineTo(x, sandY(x) + 7 * u + Math.sin(x * 0.03 + scene.sand.o2) * 2 * u);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    for (let x = 0; x < W; x += 23) {
      const y = sandY(x) + 14 * u + ((x * 7) % 13) * u;
      ctx.beginPath(); ctx.ellipse(x, y, 3 * u, 1.2 * u, 0, 0, TAU); ctx.fill();
    }
  }

  // ---- landmarks ---------------------------------------------------------
  function drawWreck(g) {
    const L = g.w;
    const y0 = g.y0 !== undefined ? g.y0 : sandY(g.x) + L * 0.05;
    const wood = sh("#5d4129"), dark = sh("#2c1e14"), light = sh("#7a5a3a"), sail = sh("#cfc2a2", 0.1);
    ctx.save();
    ctx.translate(g.x, y0);
    ctx.scale(faceOf(g), 1);
    ctx.rotate(g.tilt);
    ctx.lineCap = "round";

    // ropes and masts behind the hull
    const mastX = -0.02 * L, mastTop = g.mastBroken ? -0.42 * L : -0.62 * L;
    ctx.strokeStyle = sh("#3a2c20", 0.15);
    ctx.lineWidth = Math.max(1, L * 0.003);
    ctx.beginPath();
    ctx.moveTo(mastX, mastTop + 0.02 * L);
    ctx.quadraticCurveTo(0.25 * L, -0.25 * L, 0.52 * L, -0.2 * L);
    ctx.moveTo(mastX, mastTop + 0.02 * L);
    ctx.quadraticCurveTo(-0.3 * L, -0.28 * L, -0.46 * L, -0.24 * L);
    ctx.stroke();

    ctx.fillStyle = dark;
    // main mast with a jagged top when broken
    ctx.beginPath();
    ctx.moveTo(mastX - 0.014 * L, -0.12 * L);
    ctx.lineTo(mastX - 0.012 * L, mastTop);
    if (g.mastBroken) { ctx.lineTo(mastX - 0.004 * L, mastTop - 0.02 * L); ctx.lineTo(mastX + 0.002 * L, mastTop + 0.004 * L); ctx.lineTo(mastX + 0.008 * L, mastTop - 0.03 * L); }
    ctx.lineTo(mastX + 0.012 * L, mastTop);
    ctx.lineTo(mastX + 0.014 * L, -0.12 * L);
    ctx.fill();
    // second mast, snapped short
    ctx.beginPath();
    ctx.moveTo(0.24 * L, -0.12 * L);
    ctx.lineTo(0.245 * L, -0.27 * L);
    ctx.lineTo(0.252 * L, -0.25 * L);
    ctx.lineTo(0.258 * L, -0.29 * L);
    ctx.lineTo(0.266 * L, -0.12 * L);
    ctx.fill();
    // yard and torn sail
    const yardY = mastTop + 0.08 * L;
    ctx.lineWidth = L * 0.008;
    ctx.strokeStyle = dark;
    ctx.beginPath();
    ctx.moveTo(mastX - 0.11 * L, yardY + 0.01 * L);
    ctx.lineTo(mastX + 0.12 * L, yardY - 0.012 * L);
    ctx.stroke();
    ctx.fillStyle = sail;
    ctx.globalAlpha = 0.82;
    ctx.beginPath();
    ctx.moveTo(mastX - 0.1 * L, yardY + 0.01 * L);
    ctx.lineTo(mastX + 0.11 * L, yardY - 0.01 * L);
    const steps = 9;
    for (let i = 0; i <= steps; i++) {
      const fx = mastX + 0.11 * L - (i / steps) * 0.21 * L;
      const sway = Math.sin(t * 0.9 + i * 0.7) * 0.012 * L;
      const rag = (i % 2 ? 0.05 : 0) * L + (i === 3 || i === 6 ? -0.07 * L : 0);
      ctx.lineTo(fx + sway, yardY + 0.2 * L - rag);
    }
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    // pirate flag on the tallest point
    const fx = g.mastBroken ? 0.255 * L : mastX, fy = g.mastBroken ? -0.29 * L : mastTop;
    ctx.fillStyle = sh("#141414");
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    for (let i = 0; i <= 6; i++) ctx.lineTo(fx + (i / 6) * 0.09 * L, fy + Math.sin(t * 2 + i * 0.9) * 0.006 * L);
    for (let i = 6; i >= 0; i--) ctx.lineTo(fx + (i / 6) * 0.09 * L - (i === 4 ? 0.01 * L : 0), fy + 0.055 * L + Math.sin(t * 2 + i * 0.9) * 0.006 * L - (i === 4 ? 0.015 * L : 0));
    ctx.fill();
    ctx.fillStyle = sh("#e8e2d0");
    const sx = fx + 0.045 * L, sy = fy + 0.024 * L + Math.sin(t * 2 + 3) * 0.006 * L;
    ctx.beginPath(); ctx.arc(sx, sy, 0.011 * L, 0, TAU); ctx.fill();
    ctx.fillRect(sx - 0.006 * L, sy + 0.006 * L, 0.012 * L, 0.008 * L);
    ctx.strokeStyle = sh("#e8e2d0"); ctx.lineWidth = 0.004 * L;
    ctx.beginPath();
    ctx.moveTo(sx - 0.02 * L, sy + 0.01 * L); ctx.lineTo(sx + 0.02 * L, sy + 0.022 * L);
    ctx.moveTo(sx + 0.02 * L, sy + 0.01 * L); ctx.lineTo(sx - 0.02 * L, sy + 0.022 * L);
    ctx.stroke();
    ctx.fillStyle = sh("#141414");
    ctx.beginPath(); ctx.arc(sx - 0.004 * L, sy - 0.001 * L, 0.003 * L, 0, TAU); ctx.arc(sx + 0.004 * L, sy - 0.001 * L, 0.003 * L, 0, TAU); ctx.fill();

    // bowsprit
    ctx.strokeStyle = dark; ctx.lineWidth = L * 0.01;
    ctx.beginPath(); ctx.moveTo(0.5 * L, -0.17 * L); ctx.lineTo(0.66 * L, -0.27 * L); ctx.stroke();

    // hull
    const hull = new Path2D();
    hull.moveTo(-0.5 * L, -0.06 * L);
    hull.lineTo(-0.49 * L, -0.24 * L);
    hull.lineTo(-0.31 * L, -0.24 * L);
    hull.lineTo(-0.29 * L, -0.15 * L);
    hull.lineTo(0.34 * L, -0.13 * L);
    hull.quadraticCurveTo(0.48 * L, -0.14 * L, 0.55 * L, -0.21 * L);
    hull.quadraticCurveTo(0.54 * L, -0.02 * L, 0.38 * L, 0.1 * L);
    hull.lineTo(-0.42 * L, 0.1 * L);
    hull.closePath();
    ctx.fillStyle = wood;
    ctx.fill(hull);
    ctx.save();
    ctx.clip(hull);
    ctx.strokeStyle = dark;
    ctx.lineWidth = Math.max(1, L * 0.004);
    ctx.beginPath();
    for (let py = -0.2; py < 0.1; py += 0.035) { ctx.moveTo(-0.55 * L, py * L); ctx.lineTo(0.6 * L, py * L + 0.01 * L); }
    for (let px = -0.45; px < 0.55; px += 0.13) { const yy = ((px * 100) % 3) * 0.035 - 0.15; ctx.moveTo(px * L, yy * L); ctx.lineTo(px * L, (yy + 0.035) * L); }
    ctx.stroke();
    ctx.fillStyle = light;
    ctx.fillRect(-0.55 * L, -0.135 * L, 1.15 * L, 0.012 * L);
    // a gaping hole in the side
    ctx.fillStyle = sh("#0d0907");
    ctx.beginPath();
    ctx.moveTo(0.06 * L, -0.07 * L);
    ctx.lineTo(0.1 * L, -0.1 * L); ctx.lineTo(0.13 * L, -0.075 * L); ctx.lineTo(0.17 * L, -0.095 * L);
    ctx.lineTo(0.2 * L, -0.04 * L); ctx.lineTo(0.17 * L, 0.0); ctx.lineTo(0.12 * L, -0.015 * L); ctx.lineTo(0.08 * L, 0.01 * L);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    // portholes with cannon muzzles
    for (let i = 0; i < 6; i++) {
      const px = (-0.38 + i * 0.13) * L;
      if (px > 0.04 * L && px < 0.22 * L) continue;
      ctx.fillStyle = sh("#120c08");
      ctx.beginPath(); ctx.arc(px, -0.085 * L, 0.016 * L, 0, TAU); ctx.fill();
      if (i % 2 === 0) { ctx.fillStyle = sh("#1e1e22"); ctx.fillRect(px - 0.004 * L, -0.093 * L, 0.03 * L, 0.016 * L); }
    }
    // stern windows
    ctx.fillStyle = sh("#120c08");
    for (let i = 0; i < 3; i++) ctx.fillRect((-0.47 + i * 0.05) * L, -0.21 * L, 0.03 * L, 0.035 * L);
    // barnacles and hanging weed
    ctx.fillStyle = sh("#c9c2ae", 0.15);
    for (let i = 0; i < 26; i++) { const bx = (-0.42 + ((i * 37) % 90) / 100) * L, by = (0.0 + ((i * 13) % 9) / 100) * L; ctx.beginPath(); ctx.arc(bx, by, L * 0.004, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = sh("#3f6b3a", 0.1);
    ctx.lineWidth = Math.max(1, L * 0.005);
    for (let i = 0; i < 7; i++) {
      const bx = (-0.45 + i * 0.15) * L, by = -0.135 * L;
      ctx.beginPath(); ctx.moveTo(bx, by);
      ctx.quadraticCurveTo(bx + Math.sin(t + i) * 0.01 * L, by + 0.03 * L, bx + Math.sin(t * 0.8 + i) * 0.015 * L, by + (0.04 + (i % 3) * 0.015) * L);
      ctx.stroke();
    }

    // moray eel in the hole
    if (g.moray) {
      const m = g.moray;
      const hx = 0.13 * L, hy = -0.05 * L;
      const c = Math.cos(g.tilt), s = Math.sin(g.tilt);
      const wx = g.x + g.dir * (hx * c - hy * s), wy = y0 + (hx * s + hy * c);
      const target = near(wx, wy, 110 * u) ? 0 : 0.55 + 0.45 * Math.sin(t * 0.35 + m.ph);
      m.e += (target - m.e) * (target < m.e ? 0.15 : 0.02);
      const len = m.e * 0.13 * L;
      if (len > 2) {
        const body = sh("#6f7d3a"), spot = sh("#3d4520");
        ctx.save();
        ctx.translate(hx, hy);
        ctx.strokeStyle = body;
        ctx.lineWidth = 0.028 * L;
        const ex = -len * 0.2 + Math.sin(t * 1.2 + m.ph) * len * 0.15, ey = -len;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(len * 0.3, -len * 0.5, ex, ey);
        ctx.stroke();
        ctx.fillStyle = spot;
        for (let i = 1; i < 4; i++) { const tt = i / 4; ctx.beginPath(); ctx.arc((1 - tt) * (1 - tt) * 0 + 2 * (1 - tt) * tt * len * 0.3 + tt * tt * ex, 2 * (1 - tt) * tt * (-len * 0.5) + tt * tt * ey, 0.005 * L, 0, TAU); ctx.fill(); }
        ctx.translate(ex, ey);
        ctx.rotate(-0.6 + Math.sin(t * 1.2 + m.ph) * 0.2);
        ctx.fillStyle = body;
        ctx.beginPath(); ctx.ellipse(0.02 * L, 0, 0.03 * L, 0.016 * L, 0, 0, TAU); ctx.fill();
        const gape = (Math.sin(t * 2.5) * 0.5 + 0.5) * 0.008 * L;
        ctx.fillStyle = sh("#2a1a12");
        ctx.beginPath(); ctx.moveTo(0.05 * L, 0); ctx.lineTo(0.025 * L, gape); ctx.lineTo(0.025 * L, -gape * 0.3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#f2e9c8";
        ctx.beginPath(); ctx.arc(0.03 * L, -0.007 * L, 0.004 * L, 0, TAU); ctx.fill();
        ctx.fillStyle = "#111";
        ctx.beginPath(); ctx.arc(0.031 * L, -0.007 * L, 0.002 * L, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function drawChest(g) {
    const s = g.s, x = g.x, y = sandY(x) + s * 0.12;
    const wood = sh("#6b4527"), dark = sh("#2e1d10"), metal = sh("#a8873a"), gold = sh("#f2c34a", -0.1);
    // glow
    ctx.globalCompositeOperation = "lighter";
    const glow = 0.25 + 0.12 * Math.sin(t * 1.6);
    const gr = ctx.createRadialGradient(x, y - s * 0.6, 0, x, y - s * 0.6, s * 1.8);
    gr.addColorStop(0, `rgba(255,210,110,${glow})`);
    gr.addColorStop(1, "rgba(255,210,110,0)");
    ctx.fillStyle = gr;
    ctx.fillRect(x - s * 2, y - s * 2.6, s * 4, s * 3.2);
    ctx.globalCompositeOperation = "source-over";
    ctx.save();
    ctx.translate(x, y);
    // open lid behind
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.moveTo(-s * 0.55, -s * 0.5);
    ctx.lineTo(-s * 0.5, -s * 0.95);
    ctx.quadraticCurveTo(0, -s * 1.15, s * 0.5, -s * 0.95);
    ctx.lineTo(s * 0.55, -s * 0.5);
    ctx.fill();
    ctx.fillStyle = wood;
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, -s * 0.95); ctx.quadraticCurveTo(0, -s * 1.15, s * 0.5, -s * 0.95);
    ctx.lineTo(s * 0.47, -s * 0.88); ctx.quadraticCurveTo(0, -s * 1.05, -s * 0.47, -s * 0.88);
    ctx.fill();
    // gold heap
    ctx.fillStyle = gold;
    for (let i = 0; i < 14; i++) {
      const cx = -s * 0.42 + (i % 7) * s * 0.14, cy = -s * 0.52 - (i < 7 ? 0 : s * 0.1) - Math.sin((i % 7) / 6 * Math.PI) * s * 0.12;
      ctx.beginPath(); ctx.arc(cx, cy, s * 0.1, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = sh("#e05a7a");
    ctx.beginPath(); ctx.arc(-s * 0.1, -s * 0.7, s * 0.05, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#5ad0e0");
    ctx.beginPath(); ctx.arc(s * 0.2, -s * 0.68, s * 0.045, 0, TAU); ctx.fill();
    // box
    ctx.fillStyle = wood;
    ctx.fillRect(-s * 0.55, -s * 0.52, s * 1.1, s * 0.6);
    ctx.fillStyle = metal;
    ctx.fillRect(-s * 0.55, -s * 0.52, s * 1.1, s * 0.07);
    ctx.fillRect(-s * 0.4, -s * 0.52, s * 0.07, s * 0.6);
    ctx.fillRect(s * 0.33, -s * 0.52, s * 0.07, s * 0.6);
    ctx.fillRect(-s * 0.07, -s * 0.38, s * 0.14, s * 0.14);
    ctx.fillStyle = dark;
    ctx.fillRect(-s * 0.02, -s * 0.33, s * 0.04, s * 0.06);
    // a coin or two spilled on the sand
    ctx.fillStyle = gold;
    for (const [dx, dy] of [[0.75, 0.02], [0.9, 0.05], [-0.8, 0.04], [1.1, 0.06]]) {
      ctx.beginPath(); ctx.ellipse(s * dx, s * dy - s * 0.05, s * 0.08, s * 0.035, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
    // sparkles
    ctx.fillStyle = "rgba(255,245,200,0.9)";
    for (const [sx, sy, ph] of g.sparkles) {
      const a = Math.max(0, Math.sin(t * 2 + ph));
      if (a < 0.2) continue;
      const px = x + sx * s * 0.6, py = y + sy * s * 0.7, r = s * 0.12 * a;
      ctx.beginPath();
      ctx.moveTo(px, py - r); ctx.lineTo(px + r * 0.2, py - r * 0.2); ctx.lineTo(px + r, py); ctx.lineTo(px + r * 0.2, py + r * 0.2);
      ctx.lineTo(px, py + r); ctx.lineTo(px - r * 0.2, py + r * 0.2); ctx.lineTo(px - r, py); ctx.lineTo(px - r * 0.2, py - r * 0.2);
      ctx.fill();
    }
    // after a tap a moray sometimes pops out of the chest
    if (g.eel > 0) {
      g.eel = Math.max(0, g.eel - 0.004);
      const h = Math.sin(Math.PI * (1 - g.eel)) * s * 1.6;
      const body = sh("#6f7d3a");
      const ex = x + Math.sin(t * 2) * s * 0.15, ey = y - s * 0.55 - h;
      ctx.strokeStyle = body; ctx.lineWidth = s * 0.22; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x, y - s * 0.5); ctx.quadraticCurveTo(x - s * 0.2, y - s * 0.5 - h * 0.5, ex, ey); ctx.stroke();
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(ex + s * 0.1, ey, s * 0.22, s * 0.14, -0.3, 0, TAU); ctx.fill();
      ctx.fillStyle = sh("#2a1a12");
      ctx.beginPath(); ctx.moveTo(ex + s * 0.32, ey - s * 0.02); ctx.lineTo(ex + s * 0.12, ey + s * 0.08); ctx.lineTo(ex + s * 0.14, ey - s * 0.02); ctx.fill();
      ctx.fillStyle = "#f2e9c8";
      ctx.beginPath(); ctx.arc(ex + s * 0.12, ey - s * 0.06, s * 0.04, 0, TAU); ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath(); ctx.arc(ex + s * 0.13, ey - s * 0.06, s * 0.02, 0, TAU); ctx.fill();
    }
  }

  function drawAnchor(g) {
    const s = g.s, x = g.x, y = sandY(x) + s * 0.12;
    const rust = sh("#5e4a3c"), chainC = sh("#4a3f38");
    // chain trailing across the sand
    ctx.strokeStyle = chainC;
    ctx.lineWidth = Math.max(1.2, s * 0.03);
    const rx = x + Math.sin(g.tilt) * s * 1.08, ry = y - Math.cos(g.tilt) * s * 1.08;
    const ex = x + g.dir * s * 1.6, ey = sandY(x + g.dir * s * 1.6) + 2 * u;
    for (let i = 0; i < 16; i++) {
      const tt = i / 15;
      const cx = (1 - tt) * (1 - tt) * rx + 2 * (1 - tt) * tt * (rx + g.dir * s * 0.6) + tt * tt * ex;
      const cy = (1 - tt) * (1 - tt) * ry + 2 * (1 - tt) * tt * (ey + s * 0.1) + tt * tt * ey;
      ctx.beginPath();
      if (i % 2) ctx.ellipse(cx, cy, s * 0.06, s * 0.03, 0.3, 0, TAU);
      else ctx.ellipse(cx, cy, s * 0.025, s * 0.025, 0, 0, TAU);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(g.tilt);
    ctx.fillStyle = rust; ctx.strokeStyle = rust;
    ctx.fillRect(-s * 0.045, -s * 1.0, s * 0.09, s * 0.98);
    ctx.lineWidth = s * 0.04;
    ctx.beginPath(); ctx.arc(0, -s * 1.08, s * 0.08, 0, TAU); ctx.stroke();
    ctx.fillRect(-s * 0.32, -s * 0.9, s * 0.64, s * 0.065);
    ctx.beginPath(); ctx.arc(-s * 0.34, -s * 0.87, s * 0.05, 0, TAU); ctx.arc(s * 0.34, -s * 0.87, s * 0.05, 0, TAU); ctx.fill();
    ctx.lineWidth = s * 0.08;
    ctx.beginPath(); ctx.arc(0, -s * 0.4, s * 0.38, 0.12 * Math.PI, 0.88 * Math.PI); ctx.stroke();
    for (const sgn of [-1, 1]) {
      const a = sgn > 0 ? 0.12 * Math.PI : 0.88 * Math.PI;
      const px = Math.cos(a) * s * 0.38, py = -s * 0.4 + Math.sin(a) * s * 0.38;
      ctx.beginPath();
      ctx.moveTo(px - sgn * s * 0.02, py + s * 0.06);
      ctx.lineTo(px + sgn * s * 0.12, py - s * 0.16);
      ctx.lineTo(px - sgn * s * 0.1, py - s * 0.02);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = sh("#8a5a3a", 0.1);
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(((i * 17) % 7 - 3) * s * 0.012, -s * (0.2 + i * 0.09), s * 0.02, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  function drawCannon(g) {
    const s = g.s, x = g.x, y = sandY(x) + s * 0.02;
    const iron = sh("#2c2c31"), hi = sh("#4a4a52");
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(faceOf(g), 1);
    ctx.rotate(g.tilt);
    ctx.fillStyle = iron;
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, -s * 0.26); ctx.lineTo(s * 0.5, -s * 0.21); ctx.lineTo(s * 0.5, -s * 0.03); ctx.lineTo(-s * 0.5, s * 0.0);
    ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(-s * 0.56, -s * 0.13, s * 0.07, 0, TAU); ctx.fill();
    ctx.fillStyle = hi;
    for (const rx of [-0.32, 0.08, 0.44]) ctx.fillRect(s * rx, -s * (0.27 - rx * 0.05), s * 0.05, s * (0.29 - Math.abs(rx) * 0.03));
    ctx.fillStyle = sh("#0b0b0d");
    ctx.beginPath(); ctx.ellipse(s * 0.51, -s * 0.12, s * 0.025, s * 0.07, 0, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.fillStyle = iron;
    const bx = x - g.dir * s * 0.85, by = sandY(bx);
    for (const [dx, dy] of [[-0.09, 0], [0.09, 0], [0, -0.15]]) { ctx.beginPath(); ctx.arc(bx + dx * s, by + dy * s - s * 0.06, s * 0.085, 0, TAU); ctx.fill(); }
  }

  function drawRuins(g) {
    const s = g.s, x = g.x;
    const stone = sh("#a29e8e"), shade = sh("#6c6a5e"), moss = sh("#4f7a45", 0.05);
    const column = (cx, h, broken) => {
      const y = sandY(cx) + 4 * u, w = s * 0.32;
      ctx.fillStyle = stone;
      ctx.fillRect(cx - w * 0.75, y - s * 0.12, w * 1.5, s * 0.12);
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, y - s * 0.12);
      ctx.lineTo(cx - w / 2, y - h);
      if (broken) { ctx.lineTo(cx - w * 0.2, y - h - s * 0.12); ctx.lineTo(cx, y - h - s * 0.03); ctx.lineTo(cx + w * 0.25, y - h - s * 0.18); }
      ctx.lineTo(cx + w / 2, y - h + (broken ? s * 0.05 : 0));
      ctx.lineTo(cx + w / 2, y - s * 0.12);
      ctx.fill();
      if (!broken) {
        ctx.fillRect(cx - w * 0.8, y - h - s * 0.14, w * 1.6, s * 0.14);
        ctx.beginPath(); ctx.arc(cx - w * 0.8, y - h - s * 0.07, s * 0.07, 0, TAU); ctx.arc(cx + w * 0.8, y - h - s * 0.07, s * 0.07, 0, TAU); ctx.fill();
      }
      ctx.strokeStyle = shade; ctx.lineWidth = Math.max(1, s * 0.015);
      ctx.beginPath();
      for (let i = -1; i <= 1; i++) { ctx.moveTo(cx + i * w * 0.25, y - s * 0.14); ctx.lineTo(cx + i * w * 0.25, y - h + s * 0.04); }
      ctx.stroke();
      ctx.fillStyle = moss;
      for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(cx + ((i * 23) % 9 - 4) * w * 0.1, y - s * 0.15 - (i * 31 % 40) / 40 * (h * 0.6), s * 0.035, 0, TAU); ctx.fill(); }
    };
    column(x - s * 0.55, s * 1.9, false);
    column(x + s * 0.35, s * 1.9 * g.broken, true);
    // fallen drum
    const fx = x + s * 1.1, fy = sandY(fx);
    ctx.fillStyle = stone;
    ctx.save(); ctx.translate(fx, fy - s * 0.1); ctx.rotate(0.08);
    ctx.fillRect(-s * 0.35, -s * 0.15, s * 0.7, s * 0.3);
    ctx.fillStyle = shade;
    ctx.beginPath(); ctx.ellipse(s * 0.35, 0, s * 0.06, s * 0.15, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawVent(g, k) {
    const s = g.s, x = g.x, y = sandY(x) + 6 * u;
    // smoke
    if (Math.random() < 0.5 * k) smoke.push({ x: x + (Math.random() - 0.5) * s * 0.1, y: y - s * 1.3, r: s * 0.08, a: 0.5, vx: (Math.random() - 0.5) * 0.3 });
    ctx.fillStyle = sh("#2b2a30", -0.2);
    smoke = smoke.filter(p => {
      p.y -= 0.7 * u * k; p.x += (p.vx + Math.sin(t + p.y * 0.02) * 0.2) * k; p.r += 0.12 * u * k; p.a -= 0.0035 * k;
      ctx.globalAlpha = Math.max(0, p.a);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
      return p.a > 0;
    });
    ctx.globalAlpha = 1;
    // chimney
    ctx.fillStyle = sh("#2c2724");
    ctx.beginPath();
    ctx.moveTo(x - s * 0.5, y);
    ctx.lineTo(x - s * 0.32, y - s * 0.45); ctx.lineTo(x - s * 0.36, y - s * 0.6); ctx.lineTo(x - s * 0.16, y - s * 1.0);
    ctx.lineTo(x - s * 0.12, y - s * 1.3); ctx.lineTo(x + s * 0.1, y - s * 1.32); ctx.lineTo(x + s * 0.18, y - s * 0.9);
    ctx.lineTo(x + s * 0.3, y - s * 0.7); ctx.lineTo(x + s * 0.28, y - s * 0.4); ctx.lineTo(x + s * 0.55, y);
    ctx.fill();
    ctx.globalCompositeOperation = "lighter";
    const pulse = 0.35 + 0.15 * Math.sin(t * 2.3);
    const gr = ctx.createRadialGradient(x, y - s * 1.3, 0, x, y - s * 1.3, s * 0.35);
    gr.addColorStop(0, `rgba(255,140,60,${pulse})`);
    gr.addColorStop(1, "rgba(255,140,60,0)");
    ctx.fillStyle = gr;
    ctx.fillRect(x - s * 0.4, y - s * 1.7, s * 0.8, s * 0.8);
    ctx.globalCompositeOperation = "source-over";
    // tube worms pull in when you come close
    for (const w of g.worms) {
      const wx = x + w.dx, wy = sandY(wx) + 6 * u;
      const target = near(wx, wy - w.h, 100 * u) ? 0.15 : 1;
      w.e += (target - w.e) * (target < w.e ? 0.2 : 0.02);
      ctx.strokeStyle = sh("#e9e4d8", 0.05);
      ctx.lineWidth = 3 * u;
      ctx.beginPath(); ctx.moveTo(wx, wy); ctx.quadraticCurveTo(wx + 3 * u, wy - w.h * 0.5, wx + Math.sin(t + w.dx) * 2 * u, wy - w.h); ctx.stroke();
      ctx.fillStyle = "#d8344a";
      ctx.beginPath(); ctx.arc(wx + Math.sin(t + w.dx) * 2 * u, wy - w.h - 2 * u * w.e, 4.5 * u * w.e, 0, TAU); ctx.fill();
    }
  }

  function drawCoral(g) {
    for (const p of g.parts) {
      const bx = g.x + p.dx, by = sandY(bx) + 5 * u;
      const c = sh(p.color);
      if (p.type === "branch") {
        ctx.strokeStyle = c; ctx.lineCap = "round";
        for (const [x1, y1, x2, y2, w] of p.segs) {
          ctx.lineWidth = w;
          ctx.beginPath(); ctx.moveTo(bx + x1, by + y1); ctx.lineTo(bx + x2, by + y2); ctx.stroke();
        }
      } else if (p.type === "brain") {
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.ellipse(bx, by, p.r, p.r * 0.75, 0, Math.PI, TAU); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.22)"; ctx.lineWidth = Math.max(1, p.r * 0.07);
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          for (let a = Math.PI; a <= TAU + 0.01; a += 0.15) {
            const rr = p.r * (i / 4) + Math.sin(a * 9 + i) * p.r * 0.05;
            const px = bx + Math.cos(a) * rr, py = by + Math.sin(a) * rr * 0.75;
            a === Math.PI ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      } else if (p.type === "fan") {
        ctx.strokeStyle = c; ctx.lineWidth = Math.max(1, 1.4 * u);
        const sway = Math.sin(t * 0.8 + p.dx) * 0.04;
        ctx.beginPath();
        for (const [rx, ry] of p.rays) { ctx.moveTo(bx, by); ctx.lineTo(bx + rx + ry * sway, by + ry); }
        for (const f of [0.45, 0.7, 0.9]) {
          p.rays.forEach(([rx, ry], i) => { const px = bx + (rx + ry * sway) * f, py = by + ry * f; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); });
        }
        ctx.stroke();
      } else {
        for (const [dx, h, r] of p.tubes) {
          ctx.fillStyle = c;
          ctx.beginPath(); ctx.roundRect(bx + dx - r, by - h, r * 2, h, r); ctx.fill();
          ctx.fillStyle = "rgba(0,0,0,0.3)";
          ctx.beginPath(); ctx.ellipse(bx + dx, by - h + r * 0.6, r * 0.6, r * 0.35, 0, 0, TAU); ctx.fill();
        }
      }
    }
  }

  function drawRocks(g) {
    for (const [dx, rx, ry] of g.stones) {
      const x = g.x + dx, y = sandY(x) + 6 * u;
      ctx.fillStyle = water.rock;
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry * 1.4, 0, Math.PI, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath(); ctx.ellipse(x - rx * 0.25, y - ry * 0.9, rx * 0.45, ry * 0.3, -0.2, 0, TAU); ctx.fill();
    }
  }

  function drawBottle(g) {
    const s = g.s, x = g.x, y = sandY(x) + s * 0.05;
    ctx.save();
    ctx.translate(x, y - s * 0.22);
    ctx.rotate(g.tilt);
    ctx.fillStyle = "rgba(90,160,110,0.55)";
    ctx.beginPath(); ctx.roundRect(-s * 0.25, -s * 0.5, s * 0.5, s * 0.85, s * 0.12); ctx.fill();
    ctx.fillRect(-s * 0.09, -s * 0.8, s * 0.18, s * 0.32);
    ctx.fillStyle = sh("#7a5a3a");
    ctx.fillRect(-s * 0.08, -s * 0.9, s * 0.16, s * 0.12);
    ctx.fillStyle = sh("#e9dcb5");
    ctx.beginPath(); ctx.roundRect(-s * 0.12, -s * 0.38, s * 0.24, s * 0.6, s * 0.06); ctx.fill();
    ctx.strokeStyle = sh("#b33a2a"); ctx.lineWidth = Math.max(1, s * 0.04);
    ctx.beginPath(); ctx.moveTo(-s * 0.12, -s * 0.08); ctx.lineTo(s * 0.12, -s * 0.08); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(-s * 0.2, -s * 0.42, s * 0.05, s * 0.6);
    ctx.restore();
  }

  function drawSkull(g) {
    const s = g.s, x = g.x, y = sandY(x) + 4 * u;
    const bone = sh("#e6dfcc", 0.08);
    ctx.strokeStyle = bone; ctx.lineCap = "round"; ctx.lineWidth = s * 0.28;
    ctx.beginPath(); ctx.moveTo(x - s * 1.4, y - s * 0.2); ctx.lineTo(x + s * 1.4, y - s * 0.7); ctx.moveTo(x - s * 1.3, y - s * 0.8); ctx.lineTo(x + s * 1.5, y - s * 0.15); ctx.stroke();
    ctx.fillStyle = bone;
    ctx.beginPath(); ctx.arc(x, y - s * 1.0, s * 0.8, 0, TAU); ctx.fill();
    ctx.fillRect(x - s * 0.45, y - s * 0.6, s * 0.9, s * 0.5);
    ctx.fillStyle = sh("#1b1612");
    ctx.beginPath(); ctx.ellipse(x - s * 0.3, y - s * 0.95, s * 0.2, s * 0.24, 0, 0, TAU); ctx.ellipse(x + s * 0.3, y - s * 0.95, s * 0.2, s * 0.24, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x, y - s * 0.7); ctx.lineTo(x - s * 0.08, y - s * 0.55); ctx.lineTo(x + s * 0.08, y - s * 0.55); ctx.fill();
    ctx.fillRect(x - s * 0.3, y - s * 0.32, s * 0.6, s * 0.05);
  }

  function drawAnemone(g) {
    const s = g.s, x = g.x, y = sandY(x) + 5 * u;
    const c = sh(g.color);
    ctx.strokeStyle = c; ctx.lineCap = "round";
    ctx.lineWidth = Math.max(2, s * 0.12);
    for (let i = 0; i < 22; i++) {
      const a = -Math.PI + (i / 21) * Math.PI;
      const bx = x + Math.cos(a) * s * 0.5, by = y - s * 0.35;
      const len = s * (0.9 + (i % 3) * 0.15);
      const sw = Math.sin(t * 1.3 + i * 0.4) * 0.3 + near(x, y - s, 110 * u) * Math.sign(x - diver.x || 1) * 0.6;
      const ex = bx + Math.cos(a * 0.7 - Math.PI * 0.15 + sw) * len, ey = by + Math.sin(a * 0.7 - Math.PI * 0.15) * len * 0.9 - len * 0.3;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + sw * s * 0.4, by - len * 0.5, ex, ey); ctx.stroke();
    }
    ctx.fillStyle = sh("#7a3d5a");
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.15, s * 0.6, s * 0.35, 0, 0, TAU); ctx.fill();
    if (g.clown) {
      for (let i = 0; i < 2; i++) {
        const a = t * 0.9 + i * Math.PI;
        const fx = x + Math.cos(a) * s * 1.3, fy = y - s * 1.3 + Math.sin(a * 1.3) * s * 0.35;
        const vx = -Math.sin(a), vy = Math.cos(a * 1.3) * 0.3;
        shinyDraw(g.clownObjs && g.clownObjs[i], () => drawFishShape(fx, fy, Math.atan2(vy, vx), s * 0.38, "#f07c1e", "#1d1d1d", t * 8 + i, true));
      }
    }
  }

  function drawGardenEels(g) {
    const target = near(g.x, sandY(g.x) - 30 * u, 140 * u) ? 0 : 1;
    g.e += (target - g.e) * (target < g.e ? 0.18 : 0.012);
    for (const e of g.eels) {
      const bx = g.x + e.dx, by = sandY(bx) + 6 * u;
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath(); ctx.ellipse(bx, by - 2 * u, 3.5 * u, 1.5 * u, 0, 0, TAU); ctx.fill();
      const h = e.h * g.e;
      if (h < 2) continue;
      const sway = Math.sin(t * 0.9 + e.ph) * 6 * u;
      const tx = bx + sway, ty = by - h;
      const recolor = e.shiny && beginShiny();
      ctx.strokeStyle = sh("#e8e0c8", 0.05); ctx.lineWidth = 3 * u; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx - sway * 0.6, by - h * 0.6, tx, ty); ctx.stroke();
      ctx.fillStyle = sh("#2a2620");
      for (let i = 1; i < 4; i++) { const yy = by - h * i / 4; ctx.beginPath(); ctx.arc(bx + (sway * 0.1) * i, yy, 0.9 * u, 0, TAU); ctx.fill(); }
      ctx.fillStyle = sh("#e8e0c8", 0.05);
      const face = Math.sin(t * 0.3 + e.ph) > 0 ? 1 : -1;
      ctx.beginPath(); ctx.ellipse(tx + face * 2.5 * u, ty, 3.5 * u, 2 * u, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath(); ctx.arc(tx + face * 3.5 * u, ty - 0.6 * u, 0.8 * u, 0, TAU); ctx.fill();
      if (recolor) endShiny(e.shiny, e);
    }
  }

  const GROUND_DRAW = {
    wreck: drawWreck, chest: drawChest, anchor: drawAnchor, cannon: drawCannon, ruins: drawRuins,
    vent: drawVent, coral: drawCoral, rocks: drawRocks, bottle: drawBottle, skull: drawSkull,
    anemone: drawAnemone, eels: drawGardenEels,
  };


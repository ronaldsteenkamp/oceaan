  // ---- newest landmarks --------------------------------------------------
  function drawVolcano(g, k) {
    const s = g.s, x = g.x, y = sandY(x) + 8 * u, top = y - s * 1.1;
    g.timer -= k / 60;
    if (g.timer <= 0 && !claim(8)) g.timer = 6 + Math.random() * 8;
    if (g.timer <= 0) {
      g.timer = 15 + Math.random() * 20;
      g.erupt = 1;
      watch("eruption", () => g.erupt > 0.05 ? [g.x, sandY(g.x) - g.s] : null, g.s);
      sfxRumble(0.6);
      for (let i = 0; i < 18; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * 0.9, v = (2 + Math.random() * 3) * u;
        g.lava.push({ x, y: top, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: (2 + Math.random() * 3) * u, life: 1 });
      }
    }
    g.erupt = Math.max(0, g.erupt - 0.005 * k);
    if (Math.random() < (0.2 + g.erupt) * k) g.steam.push({ x: x + (Math.random() - 0.5) * s * 0.2, y: top, r: s * 0.06, a: 0.3 + g.erupt * 0.3, vx: (Math.random() - 0.5) * 0.4 });
    g.steam = g.steam.filter(p => {
      p.y -= 0.7 * u * k; p.x += (p.vx + Math.sin(t + p.y * 0.02) * 0.2 + current * 0.5) * k; p.r += 0.12 * u * k; p.a -= 0.0035 * k;
      ctx.fillStyle = `rgba(80,76,84,${Math.max(0, p.a)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
      return p.a > 0;
    });
    ctx.fillStyle = sh("#2a2422");
    ctx.beginPath(); ctx.moveTo(x - s * 1.3, y); ctx.lineTo(x - s * 0.3, top); ctx.lineTo(x + s * 0.3, top - s * 0.02); ctx.lineTo(x + s * 1.35, y); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath(); ctx.moveTo(x - s * 1.0, y); ctx.lineTo(x - s * 0.3, top); ctx.lineTo(x - s * 0.1, top); ctx.lineTo(x - s * 0.5, y); ctx.fill();
    ctx.strokeStyle = `rgba(255,120,40,${0.45 + 0.45 * g.erupt})`; ctx.lineWidth = Math.max(1.5, s * 0.04); ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - s * 0.1, top); ctx.quadraticCurveTo(x - s * 0.35, y - s * 0.6, x - s * 0.55, y - s * 0.25);
    ctx.moveTo(x + s * 0.12, top); ctx.quadraticCurveTo(x + s * 0.3, y - s * 0.7, x + s * 0.45, y - s * 0.45);
    ctx.stroke();
    ctx.fillStyle = `rgb(255,${140 + 60 * g.erupt},60)`;
    ctx.beginPath(); ctx.ellipse(x, top, s * 0.28, s * 0.06, 0, 0, TAU); ctx.fill();
    g.lava = g.lava.filter(p => {
      p.vy += 0.06 * u * k; p.x += p.vx * k; p.y += p.vy * k; p.life -= 0.006 * k;
      ctx.fillStyle = `rgba(255,${120 + 100 * p.life},50,${Math.max(0, p.life)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
      return p.life > 0 && p.y < sandY(p.x) + 10 * u;
    });
  }

  function drawBrine(g) {
    const s = g.s, x = g.x, y = sandY(x) + 9 * u;
    ctx.fillStyle = sh("#3b3a33", 0.1);
    ctx.beginPath(); ctx.ellipse(x, y, s * 1.3, s * 0.3, 0, 0, TAU); ctx.fill();
    const grd = ctx.createLinearGradient(0, y - s * 0.22, 0, y + s * 0.2);
    grd.addColorStop(0, sh("#4a7f9f", -0.1));
    grd.addColorStop(1, sh("#0e2233"));
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.ellipse(x, y, s * 1.15, s * 0.22, 0, 0, TAU); ctx.fill();
    // the brine is heavier than seawater, so it has its own shimmering surface
    ctx.strokeStyle = "rgba(200,235,255,0.5)"; ctx.lineWidth = Math.max(1, 1.2 * u);
    ctx.beginPath();
    for (let i = 0; i <= 30; i++) {
      const f = i / 30, px = x - s * 1.1 + f * s * 2.2;
      const py = y - s * 0.2 * Math.sqrt(Math.max(0, 1 - (2 * f - 1) ** 2)) + Math.sin(t * 2 + f * 12) * u;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
    ctx.fillStyle = sh("#1d1a24");
    for (let i = 0; i < 28; i++) { const a = (i / 28) * TAU; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * s * 1.2, y + Math.sin(a) * s * 0.26, s * 0.06, s * 0.035, a, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "rgba(220,245,255,0.5)";
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(x + Math.sin(t * 0.3 + i * 2) * s * 0.8, y + Math.cos(t * 0.4 + i) * s * 0.08, s * 0.08, s * 0.015, 0, 0, TAU); ctx.fill(); }
  }

  function drawCity(g) {
    const s = g.s, x0 = g.x - g.w / 2;
    const wall = sh("#8f8778"), wall2 = sh("#a39a86"), roof = sh("#6a3d30"), dark = sh("#12161a"), moss = sh("#4f7a45", 0.1);
    // a no-entry sign, crusted with barnacles
    const px = x0 + s * 0.5, py = sandY(px) + 8 * u;
    ctx.save(); ctx.translate(px, py); ctx.rotate(-0.18);
    ctx.fillStyle = sh("#6a6a6a"); ctx.fillRect(-s * 0.04, -s * 2.0, s * 0.08, s * 2.0);
    ctx.fillStyle = sh("#c43a2e"); ctx.beginPath(); ctx.arc(0, -s * 2.1, s * 0.36, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#ece6d6"); ctx.fillRect(-s * 0.24, -s * 2.16, s * 0.48, s * 0.12);
    ctx.fillStyle = sh("#cfc8b5", 0.1);
    for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(Math.cos(i * 1.9) * s * 0.28, -s * 2.1 + Math.sin(i * 1.9) * s * 0.28, s * 0.04, 0, TAU); ctx.fill(); }
    ctx.restore();
    g.houses.forEach((hs, i) => {
      const hx = x0 + hs.dx + hs.w / 2, hy = sandY(hx) + 8 * u;
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(hs.tilt);
      ctx.fillStyle = i % 2 ? wall : wall2; ctx.fillRect(-hs.w / 2, -hs.h, hs.w, hs.h);
      ctx.fillStyle = roof;
      ctx.beginPath(); ctx.moveTo(-hs.w / 2 - 3 * u, -hs.h); ctx.lineTo(0, -hs.h - hs.w * 0.5); ctx.lineTo(hs.w / 2 + 3 * u, -hs.h); ctx.fill();
      ctx.fillStyle = dark;
      for (let r = 0; r * s * 0.85 < hs.h - s * 0.8; r++) for (const c of [-0.25, 0.25]) ctx.fillRect(c * hs.w - s * 0.12, -hs.h + s * 0.35 + r * s * 0.85, s * 0.24, s * 0.32);
      ctx.fillStyle = moss;
      for (let m = 0; m < 5; m++) { ctx.beginPath(); ctx.arc((m / 4 - 0.5) * hs.w * 0.8, -hs.h - (1 - Math.abs(m / 4 - 0.5) * 2) * hs.w * 0.4, s * 0.07, 0, TAU); ctx.fill(); }
      ctx.restore();
    });
    // the church tower, its bell still swinging in the current
    const tx = x0 + g.w - s * 0.8, ty = sandY(tx) + 8 * u;
    ctx.fillStyle = wall2; ctx.fillRect(tx - s * 0.45, ty - s * 3.4, s * 0.9, s * 3.4);
    ctx.fillStyle = roof; ctx.beginPath(); ctx.moveTo(tx - s * 0.55, ty - s * 3.4); ctx.lineTo(tx, ty - s * 5.0); ctx.lineTo(tx + s * 0.55, ty - s * 3.4); ctx.fill();
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.moveTo(tx - s * 0.25, ty - s * 2.5); ctx.lineTo(tx - s * 0.25, ty - s * 2.95); ctx.arc(tx, ty - s * 2.95, s * 0.25, Math.PI, 0); ctx.lineTo(tx + s * 0.25, ty - s * 2.5); ctx.fill();
    ctx.save(); ctx.translate(tx, ty - s * 3.1); ctx.rotate(Math.sin(t * 1.1) * 0.35 + current * 0.2);
    ctx.fillStyle = sh("#c9a24a");
    ctx.beginPath(); ctx.moveTo(-s * 0.08, 0); ctx.quadraticCurveTo(-s * 0.1, s * 0.3, -s * 0.18, s * 0.38); ctx.lineTo(s * 0.18, s * 0.38); ctx.quadraticCurveTo(s * 0.1, s * 0.3, s * 0.08, 0); ctx.fill();
    ctx.restore();
    ctx.fillStyle = sh("#ece6d6", 0.1); ctx.beginPath(); ctx.arc(tx, ty - s * 1.9, s * 0.22, 0, TAU); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, s * 0.04);
    ctx.beginPath(); ctx.moveTo(tx, ty - s * 1.9); ctx.lineTo(tx, ty - s * 2.05); ctx.moveTo(tx, ty - s * 1.9); ctx.lineTo(tx + s * 0.1, ty - s * 1.88); ctx.stroke();
    // a street lamp that still glows at night
    const lx = x0 + g.w * 0.5, ly = sandY(lx) + 8 * u;
    ctx.strokeStyle = sh("#3a3a3a"); ctx.lineWidth = Math.max(1.5, s * 0.07);
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx, ly - s * 2.2); ctx.quadraticCurveTo(lx, ly - s * 2.5, lx + s * 0.3, ly - s * 2.45); ctx.stroke();
    ctx.fillStyle = sh("#e8d08a"); ctx.beginPath(); ctx.arc(lx + s * 0.32, ly - s * 2.35, s * 0.1, 0, TAU); ctx.fill();
    g.lampX = lx + s * 0.32; g.lampY = ly - s * 2.35;
  }

  function drawWhalefall(g) {
    const L = g.w, x = g.x, y = sandY(x) + 4 * u;
    const bone = sh("#ddd6c2", 0.1);
    ctx.save(); ctx.translate(x, y); ctx.scale(g.dir, 1);
    ctx.fillStyle = "rgba(240,240,230,0.3)";
    ctx.beginPath(); ctx.ellipse(0, 0, L * 0.55, L * 0.05, 0, 0, TAU); ctx.fill();
    // ribs arch over the spine like a cage
    ctx.strokeStyle = bone; ctx.lineCap = "round"; ctx.lineWidth = Math.max(1.5, L * 0.008);
    for (let i = 0; i < 9; i++) {
      const rx = -L * 0.1 + i * L * 0.04, ry = -L * 0.05;
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.quadraticCurveTo(rx + L * 0.03, ry - L * (0.1 + Math.sin(i / 8 * Math.PI) * 0.05), rx + L * 0.06, 0); ctx.stroke();
    }
    ctx.fillStyle = bone;
    for (let i = 0; i < 22; i++) {
      const f = i / 21, vx = -L * 0.45 + f * L * 0.75, vy = -L * 0.03 - Math.sin(f * Math.PI) * L * 0.03;
      ctx.beginPath(); ctx.ellipse(vx, vy, L * 0.014 * (1 - f * 0.4), L * 0.02, 0, 0, TAU); ctx.fill();
    }
    ctx.beginPath(); ctx.moveTo(L * 0.3, -L * 0.07); ctx.lineTo(L * 0.5, -L * 0.03); ctx.lineTo(L * 0.3, -L * 0.005); ctx.closePath(); ctx.fill();
    ctx.lineWidth = Math.max(1.5, L * 0.01);
    ctx.beginPath(); ctx.moveTo(L * 0.3, 0); ctx.lineTo(L * 0.56, L * 0.005); ctx.moveTo(L * 0.31, -L * 0.04); ctx.lineTo(L * 0.57, -L * 0.05); ctx.stroke();
    // bone-eating worms
    ctx.fillStyle = "rgba(220,60,70,0.85)";
    for (let i = 0; i < 26; i++) { const f = i / 25; ctx.beginPath(); ctx.arc(-L * 0.45 + f * L * 0.75 + Math.sin(t * 2 + i) * u, -L * 0.05 - Math.sin(f * Math.PI) * L * 0.03, L * 0.005, 0, TAU); ctx.fill(); }
    // hagfish weaving through the bones
    ctx.strokeStyle = sh("#c98a8a"); ctx.lineWidth = Math.max(2, L * 0.012);
    for (let i = 0; i < 3; i++) {
      const p = (t * 0.03 + i * 0.33) % 1, hx = -L * 0.45 + p * L * 0.9, hy = -L * 0.04 + Math.sin(t * 1.5 + i * 2) * L * 0.03;
      ctx.beginPath();
      for (let j = 0; j <= 8; j++) { const px = hx - j * L * 0.012, py = hy + Math.sin(t * 6 + j * 0.8 + i) * L * 0.008; j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.stroke();
    }
    ctx.restore();
  }

  Object.assign(GROUND_DRAW, { volcano: drawVolcano, city: drawCity, whalefall: drawWhalefall, brine: () => {} });

  // ---- newest creatures --------------------------------------------------
  function puff(x, y, n) {
    for (let i = 0; i < n; i++) dust.push({ x: x + (Math.random() - 0.5) * 10 * u, y: y - Math.random() * 6 * u, vx: (Math.random() - 0.5) * 0.8 * u, vy: -Math.random() * 0.5 * u, r: (2 + Math.random() * 4) * u, a: 0.45 });
    if (dust.length > 250) dust.splice(0, dust.length - 250);
  }

  function drawDust(k) {
    ctx.fillStyle = water.sand[0];
    dust = dust.filter(p => {
      p.x += (p.vx + current * 0.5) * k; p.y += p.vy * k; p.vx *= 0.97; p.vy *= 0.97; p.r += 0.08 * u * k; p.a -= 0.006 * k;
      if (p.a <= 0) return false;
      ctx.globalAlpha = p.a;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
      return true;
    });
    ctx.globalAlpha = 1;
  }

  function drawRings(k) {
    rings = rings.filter(r => {
      r.r += 1.5 * u * k; r.a -= 0.04 * k;
      if (r.a <= 0) return false;
      ctx.strokeStyle = `rgba(255,255,255,${r.a})`; ctx.lineWidth = 1.5 * u;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, TAU); ctx.stroke();
      return true;
    });
  }

  function poke() { return diverMode ? { x: diver.x, y: diver.y, on: true } : { x: 0, y: 0, on: false }; }

  function drawMantis(m, k) {
    const s = m.s, x = m.x, y = sandY(x) + 6 * u, p = poke();
    m.cool -= k / 60;
    if (p.on && m.cool <= 0 && Math.hypot(p.x - x, p.y - (y - s)) < 80 * u) {
      // the fastest punch in the sea: it even makes a little flash of collapsing bubbles
      m.cool = 1.5; m.strike = 1; m.tx = p.x; m.ty = p.y;
      sfxClick(); puff(x, y, 6);
      rings.push({ x: p.x, y: p.y, r: 2 * u, a: 0.9 });
    }
    m.strike = Math.max(0, m.strike - 0.08 * k);
    if (p.on) m.face = Math.sign(p.x - x) || 1;
    const face = m.face || 1;
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath(); ctx.ellipse(x, y - 1 * u, s * 0.95, s * 0.16, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(x, y); ctx.scale(face, 1);
    // tail fan with blue and orange blades
    for (const [a, c] of [[-0.5, "#3a7fd0"], [0, "#f08a3c"], [0.5, "#3a7fd0"]]) {
      ctx.fillStyle = sh(c);
      ctx.save(); ctx.translate(-s * 0.72, -s * 0.12); ctx.rotate(Math.PI + a * 0.8);
      ctx.beginPath(); ctx.ellipse(s * 0.16, 0, s * 0.17, s * 0.07, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
    // little walking legs
    ctx.strokeStyle = sh("#e8553a"); ctx.lineWidth = Math.max(0.8, s * 0.035); ctx.lineCap = "round";
    for (let i = 0; i < 4; i++) { const lx = s * (0.05 + i * 0.1), sw = Math.sin(t * 6 + i) * s * 0.02; ctx.beginPath(); ctx.moveTo(lx, -s * 0.12); ctx.lineTo(lx + sw + s * 0.03, -s * 0.01); ctx.stroke(); }
    // segmented body, curving up towards the head
    const segs = ["#2f8f5a", "#3fa86b", "#2f8f5a", "#3fa86b", "#2f8f5a", "#57c27c", "#3fa86b"];
    for (let i = 0; i < segs.length; i++) {
      const f = i / (segs.length - 1), sx = -s * 0.62 + f * s * 0.95, sy = -s * (0.15 + f * f * 0.22);
      ctx.fillStyle = sh(segs[i]);
      ctx.beginPath(); ctx.ellipse(sx, sy, s * 0.11, s * (0.13 + f * 0.03), -f * 0.6, 0, TAU); ctx.fill();
      ctx.strokeStyle = sh("#f08a3c"); ctx.lineWidth = Math.max(0.6, s * 0.025);
      ctx.beginPath(); ctx.ellipse(sx, sy, s * 0.11, s * (0.13 + f * 0.03), -f * 0.6, -1.2, 1.2); ctx.stroke();
    }
    // head with orange antennal scales
    ctx.fillStyle = sh("#57c27c");
    ctx.beginPath(); ctx.ellipse(s * 0.42, -s * 0.42, s * 0.12, s * 0.1, -0.5, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#f08a3c");
    ctx.beginPath(); ctx.ellipse(s * 0.56, -s * 0.5, s * 0.1, s * 0.035, -0.6, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#e8b03c"); ctx.lineWidth = Math.max(0.6, s * 0.02);
    ctx.beginPath(); ctx.moveTo(s * 0.5, -s * 0.48); ctx.quadraticCurveTo(s * 0.8, -s * 0.75, s * 1.0, -s * 0.6); ctx.stroke();
    // stalked eyes that look around
    const look = p.on ? Math.atan2(p.y - (y - s * 0.6), (p.x - x) * face) : Math.sin(t * 0.7) * 0.8;
    for (const off of [-0.04, 0.05]) {
      const bx = s * (0.44 + off), ex = bx + Math.cos(look) * s * 0.05, ey = -s * 0.66 + Math.sin(look) * s * 0.03;
      ctx.strokeStyle = sh("#57c27c"); ctx.lineWidth = Math.max(1, s * 0.05);
      ctx.beginPath(); ctx.moveTo(bx, -s * 0.48); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.fillStyle = sh("#6fd3e0");
      ctx.beginPath(); ctx.ellipse(ex, ey, s * 0.07, s * 0.05, look, 0, TAU); ctx.fill();
      ctx.fillStyle = "#111"; ctx.save(); ctx.translate(ex, ey); ctx.rotate(look); ctx.fillRect(-s * 0.05, -s * 0.008, s * 0.1, s * 0.016); ctx.restore();
    }
    // the folded clubs, ready to strike
    ctx.strokeStyle = sh("#e8553a"); ctx.lineWidth = Math.max(1.5, s * 0.08); ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(s * 0.4, -s * 0.32);
    if (m.strike > 0.05) {
      const lx = (m.tx - x) * face, ly = m.ty - y;
      ctx.lineTo(s * 0.4 + (lx - s * 0.4) * m.strike * 0.9, -s * 0.32 + (ly + s * 0.32) * m.strike * 0.9);
    } else { ctx.lineTo(s * 0.62, -s * 0.24); ctx.lineTo(s * 0.52, -s * 0.08); }
    ctx.stroke();
    ctx.restore();
  }

  // A cleaner wrasse: a slim blue fish with a black stripe from snout to tail.
  function drawCleaner(x, y, ang, L, ph) {
    drawFishShape(x, y, ang, L, sh("#58b4f2"), sh("#10202e"), ph, false);
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    if (Math.cos(ang) < 0) ctx.scale(1, -1);
    ctx.strokeStyle = "#0e1418"; ctx.lineWidth = Math.max(0.6, L * 0.14); ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(L * 0.85, 0); ctx.quadraticCurveTo(0, L * 0.02, -L * 0.9, L * 0.04); ctx.stroke();
    ctx.restore();
  }

  function drawArcher(a, k) {
    const sy = waveY(a.x) + 28 * u;
    if (diverMode && Math.hypot(diver.vx, diver.vy) < 0.25 * u) a.stillT = (a.stillT || 0) + k / 60; else a.stillT = 0;
    const still = diverMode && a.stillT > 1.1 && diver.y > sy + 30 * u;
    a.cool -= k / 60;
    if (still) {
      const dx = diver.x - a.x;
      a.face = Math.sign(dx) || a.face;
      if (Math.abs(dx) > 160 * u) a.x += Math.sign(dx) * 1.2 * u * k;
      else if (a.cool <= 0) {
        a.cool = 2.5;
        jets.push({ x0: a.x + a.face * a.s, y0: sy, x1: diver.x, y1: diver.y - 10 * u, p: 0, hit: false });
        sfxSquirt();
      }
    } else {
      a.x += a.vx * u * k;
      if (a.x < 30 * u) a.vx = Math.abs(a.vx);
      if (a.x > W - 30 * u) a.vx = -Math.abs(a.vx);
      a.face = Math.sign(a.vx);
    }
    const y = sy + Math.sin(t * 1.5) * 3 * u;
    const ang = still ? Math.atan2(diver.y - y, Math.abs(diver.x - a.x)) * 0.5 : 0;
    drawFishShape(a.x, y, a.face > 0 ? ang : Math.PI - ang, a.s, sh("#d9dfe0"), sh("#2a2e30"), t * 8, false);
    ctx.save(); ctx.translate(a.x, y); ctx.scale(a.face, 1); ctx.rotate(ang);
    ctx.fillStyle = "rgba(30,34,36,0.8)";
    for (const bx of [-0.45, -0.1, 0.25]) { ctx.beginPath(); ctx.ellipse(bx * a.s, -a.s * 0.12, a.s * 0.08, a.s * 0.2, 0, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  function drawJets(k) {
    jets = jets.filter(j => {
      j.p += 0.06 * k;
      for (let i = 0; i < 7; i++) {
        const f = j.p - i * 0.06;
        if (f < 0 || f > 1) continue;
        ctx.fillStyle = `rgba(220,245,255,${0.8 - i * 0.1})`;
        ctx.beginPath(); ctx.arc(j.x0 + (j.x1 - j.x0) * f, j.y0 + (j.y1 - j.y0) * f, (2.2 - i * 0.2) * u, 0, TAU); ctx.fill();
      }
      if (j.p >= 1 && !j.hit) {
        j.hit = true;
        rings.push({ x: j.x1, y: j.y1, r: 2 * u, a: 0.8 });
        for (let i = 0; i < 6; i++) bubbles.push({ x: j.x1, y: j.y1, r: (1 + Math.random() * 2) * u, ph: Math.random() * TAU });
      }
      return j.p < 1.4;
    });
  }

  function drawStation(st, k) {
    const sx = st.x, sy = sandY(st.x) - 55 * u, gp = st.grouper, L = gp.s;
    gp.timer -= k / 60; gp.ph += 0.06 * k;
    let tx = gp.wx, ty = gp.wy;
    if (gp.state === "wander") {
      if (Math.hypot(tx - gp.x, ty - gp.y) < 20 * u) { gp.wx = Math.random() * W; gp.wy = H * (0.35 + Math.random() * 0.25); }
      if (gp.timer <= 0) gp.state = "visit";
    } else {
      tx = sx + L * 0.4; ty = sy;
      if (gp.state === "visit" && Math.hypot(tx - gp.x, ty - gp.y) < 8 * u) { gp.state = "clean"; gp.timer = 7; }
      if (gp.state === "clean" && gp.timer <= 0) { gp.state = "wander"; gp.timer = 20 + Math.random() * 25; }
    }
    const dx = tx - gp.x, dy = ty - gp.y, sp = gp.state === "clean" ? 0.15 : 0.7;
    gp.x += Math.max(-sp, Math.min(sp, dx * 0.01)) * u * k;
    gp.y += Math.max(-sp, Math.min(sp, dy * 0.01)) * u * k;
    if (Math.abs(dx) > 3 * u && gp.state !== "clean") gp.face = Math.sign(dx);
    shinyDraw(gp, () => {
      drawFishShape(gp.x, gp.y, gp.face > 0 ? 0 : Math.PI, L, sh("#7a5a3a"), sh("#3e2c1c"), gp.ph * (gp.state === "clean" ? 0.3 : 1), false);
      ctx.fillStyle = sh("#5a3f26");
      for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(gp.x + gp.face * ((i % 4) * 0.3 - 0.45) * L, gp.y + (Math.floor(i / 4) * 0.2 - 0.12) * L, L * 0.05, 0, TAU); ctx.fill(); }
    });
    if (gp.state === "clean") {
      ctx.fillStyle = "#1a1210";
      ctx.beginPath(); ctx.ellipse(gp.x + gp.face * L * 0.95, gp.y + L * 0.05, L * 0.08, L * 0.12 * (0.6 + 0.4 * Math.sin(t * 2)), 0, 0, TAU); ctx.fill();
    }
    // cleaner wrasses pick parasites off the grouper while it holds still
    for (let i = 0; i < 3; i++) {
      const cx = gp.state === "clean" ? gp.x + Math.cos(t * 2.5 + i * 2.1) * L * 0.85 : sx + Math.cos(t * 1.3 + i * 2.1) * 22 * u;
      const cy = gp.state === "clean" ? gp.y + Math.sin(t * 3.2 + i * 2.1) * L * 0.35 : sy + Math.sin(t * 1.9 + i * 2.1) * 10 * u;
      const prev = st["c" + i] || [cx - 1, cy];
      st["c" + i] = [cx, cy];
      shinyDraw(st.cleanObjs && st.cleanObjs[i], () => drawCleaner(cx, cy, Math.atan2(cy - prev[1], cx - prev[0] || 0.01), 5 * u, t * 12 + i));
    }
  }

  // ---- big moments -------------------------------------------------------
  function startBait() {
    const B = scene.bait;
    B.active = true; B.age = 0;
    watch("baitball", () => B.active ? [B.cx, B.cy] : null, B.R);
    B.R = Math.min(W, H) * 0.14;
    B.cx = W * (0.35 + Math.random() * 0.3); B.cy = H * (0.3 + Math.random() * 0.15);
    B.rot = Math.random() < 0.5 ? 1 : -1;
    const n = Math.round(90 + 50 * Math.min(1, (W * H) / (1280 * 800)));
    B.fish = Array.from({ length: n }, () => ({ a: Math.random() * TAU, r: Math.sqrt(Math.random()) * 0.95 + 0.05, sp: 0.01 + Math.random() * 0.015, ox: 0, oy: 0, ph: Math.random() * TAU }));
    // the hunters start outside the screen and swim in towards the ball
    const mk = (type, L) => {
      const side = Math.random() < 0.5 ? -1 : 1;
      const x = side < 0 ? -L * 1.2 - Math.random() * L : W + L * 1.2 + Math.random() * L;
      const y = B.cy + (Math.random() - 0.5) * B.R * 1.5;
      const back = Math.atan2(B.cy - y, B.cx - x);
      const rel = Math.max(-0.6, Math.min(0.6, Math.atan2(Math.sin(back), Math.abs(Math.cos(back)))));
      return { type, L, x, y, ang: Math.cos(back) >= 0 ? rel : Math.PI - rel, sp: (type === "sail" ? 5 : 4) * u, ph: Math.random() * TAU };
    };
    B.att = Array.from({ length: 1 + Math.floor(Math.random() * 4) }, () => mk("dolphin", (70 + Math.random() * 20) * u));
    if (Math.random() < 0.6) B.att.push(mk("sail", 150 * u));
    for (const a of B.att) maybeShiny(a.type === "sail" ? "swordfish" : "dolphins", a, a.L * 0.3, () => [a.x, a.y], () => scene.bait.active && scene.bait.att.includes(a));
    for (const f of B.fish) {
      f.shinyBase = hexHue("#cfd8dc");
      maybeShiny("fish", f, 5 * u, () => [f.x || -999, f.y || -999], () => scene.bait.active && scene.bait.fish.includes(f));
    }
    sfxWhistle();
  }

  // A shiny dolphin or sailfish from the bait ball becomes a visitor that keeps swimming here.
  function shinyHunterStays(a) {
    const dir = Math.cos(a.ang) >= 0 ? 1 : -1, sail = a.type === "sail";
    const v = { type: sail ? "swordfish" : "dolphins", dir, size: a.L, ph: 0, yOff: 0, y: a.y, x: a.x, speed: VISITOR_SPEED[sail ? "swordfish" : "dolphins"] * u, logged: true };
    const alive = () => scene.visitor === v;
    if (sail) {
      v.shiny = "swordfish"; v.margin = a.L * 1.3;
      scene.shinies.push({ key: "swordfish", obj: v, temp: true, r: a.L * 0.3, alive, get: () => [v.x, v.y + v.yOff], told: true });
    } else {
      const d = { dx: 0, dy: 0, ph: 0, sc: 1, shiny: "dolphins" };
      v.pod = [d]; v.margin = a.L * 2.5;
      scene.shinies.push({ key: "dolphins", obj: d, temp: true, r: a.L * 0.3, alive, get: () => [v.x, v.y + Math.sin(v.ph * 1.5) * 35 * u], told: true });
    }
    scene.visitor = v;
  }

  function updateAndDrawBait(k, dtSec) {
    const B = scene.bait;
    if (!B.enabled) return;
    if (!B.active) {
      B.timer -= dtSec;
      if (B.timer <= 0) { if (claim(31)) startBait(); else B.timer = 8 + Math.random() * 10; }
      return;
    }
    B.age += dtSec;
    // the moment ends once the ball has broken up and every hunter has swum out of view
    const hunted = B.att.every(a => a.shiny || a.x < -a.L * 1.2 || a.x > W + a.L * 1.2);
    for (const a of B.att) if (a.shiny && (a.x < -a.L * 1.2 || a.x > W + a.L * 1.2)) { a.ang = Math.PI - a.ang; a.x = Math.max(-a.L * 1.1, Math.min(W + a.L * 1.1, a.x)); }
    if (B.age > 31 && hunted) {
      const sa = B.att.find(a => a.shiny);
      if (sa && scene.visitor) return; // wait until the sea is free for it
      if (sa) shinyHunterStays(sa);
      B.active = false; B.timer = 100 + Math.random() * 60; return;
    }
    const inF = smooth(Math.min(1, B.age / 4)), outF = B.age > 26 ? Math.min(1, (B.age - 26) / 5) : 0;
    const spread = 1 + (1 - inF) * 3 + outF * 3;
    B.cx += (Math.sin(t * 0.2) * 0.2 + current * 0.3) * u * k;
    for (const a of B.att) {
      a.x += Math.cos(a.ang) * a.sp * k; a.y += Math.sin(a.ang) * a.sp * k; a.ph += 0.2 * k;
      if (water.surface) a.y = Math.max(a.y, waveY(a.x) + a.L * 0.2);
      const dx = a.x - B.cx, dy = a.y - B.cy;
      if (B.age < 26 && Math.hypot(dx, dy) > B.R * 3.2 && dx * Math.cos(a.ang) + dy * Math.sin(a.ang) > 0) {
        // swing round for another pass through the ball, staying mostly level
        const back = Math.atan2(-dy, -dx) + (Math.random() - 0.5) * 0.6;
        const rel = Math.max(-0.6, Math.min(0.6, Math.atan2(Math.sin(back), Math.abs(Math.cos(back)))));
        a.ang = Math.cos(back) >= 0 ? rel : Math.PI - rel;
      }
    }
    ctx.globalAlpha = 1 - outF;
    const main = sh("#cfd8dc"), dark = sh("#5a6a74");
    for (let i = B.age > 31 ? -1 : B.fish.length - 1; i >= 0; i--) {
      const f = B.fish[i];
      f.a += f.sp * B.rot * k;
      const x = B.cx + Math.cos(f.a) * f.r * B.R * spread + f.ox, y = B.cy + Math.sin(f.a) * f.r * B.R * 0.75 * spread + f.oy;
      let eaten = false;
      for (const a of B.att) {
        const dx = x - a.x, dy = y - a.y, d = Math.hypot(dx, dy);
        if (d < 55 * u && d > 0.01) { f.ox += dx / d * 2.5 * u * k; f.oy += dy / d * 2.5 * u * k; }
        if (d < 7 * u && Math.random() < 0.3) eaten = true;
      }
      if (eaten) { B.fish.splice(i, 1); continue; }
      f.ox *= Math.pow(0.95, k); f.oy *= Math.pow(0.95, k);
      f.ph += 0.4 * k;
      f.x = x; f.y = y;
      if (!B.fishSeen && i % 4 === 0 && lit(x, y, 4 * u)) { B.fishSeen = true; sight("fish"); }
      shinyDraw(f, () => drawFishShape(x, y, f.a + B.rot * Math.PI / 2, 5 * u, main, dark, f.ph, false));
    }
    ctx.globalAlpha = 1;
    for (const a of B.att) {
      const dir = Math.cos(a.ang) >= 0 ? 1 : -1, rel = Math.atan2(Math.sin(a.ang), Math.abs(Math.cos(a.ang)));
      if (lit(a.x, a.y, a.L * 0.3)) sight(a.type === "sail" ? "swordfish" : "dolphins");
      if (a.type === "dolphin") shinyDraw(a, () => drawDolphin(a.x, a.y, dir, rel, a.L, a.ph));
      else shinyDraw(a, () => {
        ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(dir > 0 ? rel : -rel);
        drawSwordfish({ x: 0, y: 0, yOff: 0, dir, size: a.L, ph: a.ph });
        ctx.restore();
      });
    }
  }

  function updateSpawning(k, dtSec) {
    const S = scene;
    S.spawnTimer -= dtSec;
    if (S.spawnTimer <= 0) {
      S.spawnTimer = 45 + Math.random() * 40;
      const cands = S.species.filter(sp => !sp.predator && !sp.lantern && sp.fish.length && sp.fish.length < sp.count * 1.4)
        .sort((a, b) => a.fish.length / a.count - b.fish.length / b.count);
      const sp = cands[0];
      if (sp) {
        let cx = 0, cy = 0;
        for (const f of sp.fish) { cx += f.x; cy += f.y; }
        cx /= sp.fish.length; cy /= sp.fish.length;
        for (let i = 0; i < 24; i++) eggs.push({ x: cx + (Math.random() - 0.5) * 40 * u, y: cy + (Math.random() - 0.5) * 30 * u, life: 8 + Math.random() * 3, sp });
        watch("spawning", () => eggs.length ? eggs.map(e => [e.x, e.y]) : null, 10 * u);
      }
    }
    ctx.fillStyle = "rgba(255,240,200,0.75)";
    eggs = eggs.filter(e => {
      e.life -= dtSec;
      e.y += 0.05 * u * k; e.x += (current * 0.4 + Math.sin(t + e.life) * 0.1) * k;
      if (e.life <= 0) {
        if (e.sp.fish.length < e.sp.count * 1.4 && Math.random() < 0.6) {
          const a = Math.random() * TAU;
          const baby = { x: e.x, y: e.y, vx: Math.cos(a) * u, vy: Math.sin(a) * u * 0.3, ph: Math.random() * TAU, scale: 0.35, grow: 0.85 + Math.random() * 0.3, shinyBase: hexHue(e.sp.main) };
          e.sp.fish.push(baby);
          const sp = e.sp;
          maybeShiny("fish", baby, sp.size * u * 0.5, () => [baby.x, baby.y], () => sp.fish.includes(baby));
        }
        return false;
      }
      ctx.beginPath(); ctx.arc(e.x, e.y, 1.3 * u, 0, TAU); ctx.fill();
      return true;
    });
  }

  function drawCoralSpawn(k) {
    const corals = scene.ground.filter(g => g.kind === "coral");
    if (corals.length && scene.moon.phase >= 0.97 && night > 0.6 && water.surface) {
      // on a full-moon night the reef releases its eggs all at once
      if (Math.random() < 0.6 * k) {
        const g = corals[Math.floor(Math.random() * corals.length)], p = g.parts[Math.floor(Math.random() * g.parts.length)];
        coralSpawn.push({ x: g.x + p.dx + (Math.random() - 0.5) * 20 * u, y: sandY(g.x + p.dx) - 15 * u, vy: -(0.3 + Math.random() * 0.4) * u, r: (1.2 + Math.random() * 1.5) * u, ph: Math.random() * TAU });
      }
      if (!scene.coralLogged && coralSpawn.some(p => lit(p.x, p.y, 10 * u))) { scene.coralLogged = true; seen("coralspawn"); }
    }
    ctx.fillStyle = "rgba(255,170,200,0.85)";
    coralSpawn = coralSpawn.filter(p => {
      p.y += p.vy * k; p.x += (Math.sin(t + p.ph) * 0.2 + current * 0.5) * k;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
      return p.y > 0;
    });
    if (coralSpawn.length > 400) coralSpawn.splice(0, coralSpawn.length - 400);
  }

  function updateStorm(dtSec) {
    const st = scene.storm;
    if (!st.enabled) return;
    if (!st.active) {
      st.timer -= dtSec;
      if (st.timer <= 0) {
        if (claim(22)) { st.active = true; st.age = 0; st.nextFlash = 1.5; watch("storm", () => st.active && diverMode ? [diver.x, diver.y] : null); }
        else st.timer = 10 + Math.random() * 10;
      }
    } else {
      st.age += dtSec;
      st.nextFlash -= dtSec;
      if (st.nextFlash <= 0) {
        // no flashing light for people who asked their system for less motion
        if (!reduceMotion) st.flash = 1;
        st.nextFlash = 2 + Math.random() * 5;
        setTimeout(sfxThunder, 400 + Math.random() * 1500);
      }
      if (st.age > 22) { st.active = false; st.timer = 90 + Math.random() * 120; }
    }
    st.flash = Math.max(0, st.flash - dtSec * 3.5);
  }

  function stormLevel() {
    const st = scene.storm;
    return st.active ? Math.max(0, Math.min(1, st.age / 3, (22 - st.age) / 3)) : 0;
  }

  function drawRain(k) {
    const lv = stormLevel();
    if (!water.surface || (lv <= 0 && !ripples.length)) return;
    for (let i = 0; i < 3; i++) if (Math.random() < lv) ripples.push({ x: Math.random() * W, r: 1, a: 0.6 });
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = u;
    ripples = ripples.filter(p => {
      p.r += 0.4 * u * k; p.a -= 0.02 * k;
      if (p.a <= 0) return false;
      ctx.globalAlpha = p.a;
      ctx.beginPath(); ctx.ellipse(p.x, waveY(p.x) + 2 * u, p.r * 2, p.r * 0.5, 0, 0, TAU); ctx.stroke();
      return true;
    });
    ctx.globalAlpha = 1;
  }

  function drawMoon() {
    const m = scene.moon;
    if (!water.surface || night < 0.05) return;
    const r = 16 * u, x = m.x + Math.sin(t * 0.8) * 2 * u, y = waveY(m.x) + 34 * u;
    ctx.save();
    ctx.globalAlpha = night * 0.85;
    ctx.fillStyle = "#f4f0dc";
    ctx.translate(x, y);
    ctx.beginPath();
    if (m.phase >= 0.97) ctx.arc(0, 0, r, 0, TAU);
    else {
      ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
      ctx.ellipse(0, 0, Math.max(0.01, r * Math.abs(1 - 2 * m.phase)), r, 0, Math.PI / 2, -Math.PI / 2, m.phase < 0.5);
    }
    ctx.fill();
    ctx.restore();
  }

  function drawAbyss(k) {
    const c = scene.canyon;
    if (!c) return;
    const xa = c.side > 0 ? c.x0 : 0, xb = c.side > 0 ? W : c.x0;
    const g = ctx.createLinearGradient(0, H * 0.45, 0, H);
    g.addColorStop(0, "rgba(0,4,12,0)");
    g.addColorStop(1, "rgba(0,4,12,0.8)");
    ctx.fillStyle = g;
    ctx.fillRect(xa, H * 0.45, xb - xa, H * 0.55);
    if (Math.random() < 0.04 * k) abyssGlows.push({ x: xa + Math.random() * (xb - xa), y: H + 10, vy: -(0.2 + Math.random() * 0.3) * u, life: 0, col: Math.random() < 0.5 ? "120,240,255" : "200,140,255", r: (1.5 + Math.random() * 2) * u });
  }

  // What the seahorse task is about, shown when the task is tapped (and once, the first time).
  function explainTask() {
    toast(L("Drie zeepaardjes hebben de kleur van het zeewier aangenomen en houden zich vast aan de wuivende planten. Kijk goed en tik op een zeepaardje als je het ziet. Vind je ze alle drie, dan regent het munten en komt het in je logboek.",
      "Three seahorses have taken on the colour of the seaweed and cling to the swaying plants. Look closely and tap a seahorse when you spot it. Find all three and it rains coins, and it goes in your logbook."));
  }

  // ---- flying fish --------------------------------------------------------
  // A small group races along just under the surface, then leaps out and glides on its big fins before diving back in.
  function splash(x) {
    for (let n = 0; n < 2; n++) ripples.push({ x: x + (n - 0.5) * 6 * u, r: 1, a: 0.7 });
    for (let n = 0; n < 5; n++) bubbles.push({ x: x + (Math.random() - 0.5) * 8 * u, y: waveY(x) + (4 + Math.random() * 8) * u, r: (1 + Math.random() * 2) * u, ph: Math.random() * TAU });
  }

  function updateAndDrawFlyers(k, dtSec) {
    const F = scene.flyers;
    if (!F || !F.enabled || !water.surface) return;
    if (!F.fish.length) {
      F.timer -= dtSec;
      if (F.timer > 0) return;
      F.timer = 25 + Math.random() * 30;
      const dir = Math.random() < 0.5 ? 1 : -1, n = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) {
        const f = { dir, vx: (2.6 + Math.random()) * u, vy: 0, air: false, launched: false, ph: Math.random() * TAU, s: (12 + Math.random() * 4) * u, depth: (25 + Math.random() * 35) * u };
        f.x = dir > 0 ? -40 * u - i * 34 * u : W + 40 * u + i * 34 * u;
        f.y = waveY(f.x) + f.depth;
        f.launchX = W * (0.15 + Math.random() * 0.7);
        maybeShiny("flyingfish", f, f.s * 0.7, () => [f.x, f.y], () => F.fish.includes(f));
        F.fish.push(f);
      }
      watch("flyingfish", () => F.fish.map(f => [f.x, f.y]), 12 * u);
      return;
    }
    for (let i = F.fish.length - 1; i >= 0; i--) {
      const f = F.fish[i];
      f.ph += 0.45 * k;
      f.x += f.dir * f.vx * k;
      const surf = waveY(f.x);
      if (!f.launched && (f.dir > 0 ? f.x > f.launchX : f.x < f.launchX)) { f.launched = true; f.vy = -(2.4 + Math.random() * 0.8) * u; }
      if (f.air) {
        f.vy += 0.045 * u * k; // the wide fins turn the fall into a glide
        f.y += f.vy * k;
        if (f.y > surf) { f.air = false; splash(f.x); f.vy = 1.2 * u; }
      } else if (f.launched && f.vy < 0) {
        f.y += f.vy * k;
        if (f.y < surf) { f.air = true; splash(f.x); }
      } else {
        f.vy *= Math.pow(0.95, k);
        f.y += f.vy * k + (surf + f.depth - f.y) * 0.02 * k;
        if (!f.launched) f.y = Math.max(f.y, surf + f.s * 0.6);
      }
      shinyDraw(f, () => drawFlyingFish(f));
      if (f.x < -80 * u || f.x > W + 80 * u) {
        if (f.shiny && f.launched && !f.air) { f.dir = f.x < 0 ? 1 : -1; f.launched = false; f.vy = 0; f.launchX = W * (0.15 + Math.random() * 0.7); }
        else if (f.launched) F.fish.splice(i, 1);
      }
    }
  }

  function drawFlyingFish(f) {
    const L = f.s, body = sh("#4f86c6"), back = sh("#24466e"), belly = sh("#dfe8ef");
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.scale(f.dir, 1);
    ctx.rotate(Math.atan2(f.vy, f.vx));
    // the big pectoral fins: spread wide in the air, folded along the body in the water
    const spread = f.air ? 1 : 0.25;
    ctx.fillStyle = "rgba(190,220,245,0.55)";
    ctx.strokeStyle = "rgba(120,170,215,0.8)"; ctx.lineWidth = Math.max(0.6, L * 0.03);
    ctx.beginPath();
    ctx.moveTo(L * 0.25, -L * 0.05);
    ctx.quadraticCurveTo(-L * 0.2, -L * (0.25 + 0.75 * spread), -L * 0.75, -L * (0.1 + 0.55 * spread));
    ctx.quadraticCurveTo(-L * 0.3, -L * 0.1, L * 0.05, L * 0.02);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = back;
    ctx.save(); ctx.translate(-L * 0.8, 0); ctx.rotate(Math.sin(f.ph) * (f.air ? 0.1 : 0.35));
    ctx.beginPath(); ctx.moveTo(L * 0.05, 0); ctx.lineTo(-L * 0.45, -L * 0.25); ctx.lineTo(-L * 0.25, 0); ctx.lineTo(-L * 0.55, L * 0.35); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(0, 0, L, L * 0.2, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = belly;
    ctx.beginPath(); ctx.ellipse(L * 0.05, L * 0.08, L * 0.85, L * 0.08, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = back;
    ctx.beginPath(); ctx.ellipse(-L * 0.05, -L * 0.1, L * 0.8, L * 0.06, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#0e1a26";
    ctx.beginPath(); ctx.arc(L * 0.72, -L * 0.03, Math.max(0.8, L * 0.06), 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ---- the diver ---------------------------------------------------------
  function keepDiverInWater(d) {
    d.x = Math.max(10, Math.min(W - 10, d.x));
    const top = water.surface ? waveY(d.x) + 30 * u : scene.cave ? roofY(d.x) + 30 * u : 20 * u;
    d.y = Math.max(top, Math.min(Math.min(sandY(d.x), H) - 25 * u, d.y));
  }

  function updateAndDrawDiver(k) {
    if (!diverMode) return;
    const d = diver;
    const kx = keys.ArrowRight - keys.ArrowLeft, ky = keys.ArrowDown - keys.ArrowUp;
    const tx = kx || ky ? d.x + kx * 120 * u : pointer.active ? pointer.x : d.x;
    const ty = kx || ky ? d.y + ky * 120 * u : pointer.active ? pointer.y : d.y;
    const dx = tx - d.x, dy = ty - d.y, dist = Math.hypot(dx, dy);
    const want = Math.min(2.2 * u, dist * 0.03);
    if (dist > 4) { d.vx += (dx / dist * want - d.vx) * 0.06 * k; d.vy += (dy / dist * want - d.vy) * 0.06 * k; }
    else { d.vx *= 0.9; d.vy *= 0.9; }
    d.x += d.vx * k; d.y += d.vy * k + Math.sin(t * 0.8) * 0.05 * u;
    keepDiverInWater(d);
    const speed = Math.hypot(d.vx, d.vy);
    // the diver turns smoothly towards where it swims, all the way round; when it stops it levels out again
    const target = speed > 0.25 * u ? Math.atan2(d.vy, d.vx) : (Math.cos(d.heading) >= 0 ? 0 : Math.PI);
    const turn = Math.atan2(Math.sin(target - d.heading), Math.cos(target - d.heading));
    d.heading += turn * Math.min(1, (speed > 0.25 * u ? 0.09 : 0.03) * k);
    d.face = Math.cos(d.heading) >= 0 ? 1 : -1;
    // when it turns past straight up or down it rolls over, so its tank stays on top
    d.roll += (d.face - d.roll) * Math.min(1, 0.1 * k);
    d.kick += (0.08 + speed * 0.08 / u) * k;
    d.bub -= k / 60;
    if (d.bub <= 0) {
      d.bub = 2.5 + Math.random();
      for (let i = 0; i < 5; i++) bubbles.push({ x: d.x + Math.cos(d.heading) * 14 * u, y: d.y + Math.sin(d.heading) * 14 * u - 10 * u - i * 5 * u, r: (1.5 + Math.random() * 2.5) * u, ph: Math.random() * TAU });
      sfxBubble();
    }
    if (sandY(d.x) - d.y < 40 * u && speed > 0.5 * u && Math.random() < 0.2 * k) puff(d.x - d.face * 20 * u, sandY(d.x) + 4 * u, 1);

    const L = 46 * u, suit = "#1d2228";
    if (rewards.has("s30")) {
      // a trail of twinkling stars that stay behind and slowly fade
      d.trailT = (d.trailT || 0) - k;
      if (!d.trail) d.trail = [];
      if (d.trailT <= 0) { d.trailT = 4; d.trail.push({ x: d.x - Math.cos(d.heading) * 26 * u, y: d.y - Math.sin(d.heading) * 26 * u + (Math.random() - 0.5) * 10 * u, a: 1, ph: Math.random() * TAU }); }
      ctx.globalCompositeOperation = "lighter";
      d.trail = d.trail.filter(p => {
        p.a -= 0.012 * k; p.y -= 0.1 * u * k;
        if (p.a <= 0) return false;
        const tw = 0.6 + 0.4 * Math.sin(t * 6 + p.ph);
        star(p.x, p.y, (2.5 + 4.5 * p.a) * u * tw, `rgba(255,236,160,${p.a})`);
        return true;
      });
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.heading);
    ctx.scale(1, Math.abs(d.roll) < 0.08 ? 0.08 * Math.sign(d.roll || 1) : d.roll);
    for (const off of [0, 1]) {
      ctx.save();
      ctx.translate(-L * 0.25, off ? L * 0.04 : -L * 0.02);
      ctx.rotate(Math.sin(d.kick + off * Math.PI) * 0.35);
      ctx.fillStyle = suit; ctx.fillRect(-L * 0.35, -L * 0.035, L * 0.35, L * 0.07);
      ctx.fillStyle = rewards.has("s15") ? `hsl(${(t * 80 + off * 60) % 360} 80% 55%)` : rewards.has("s5") ? "#e8c040" : rewards.has("m25") ? sh("#2fb37a") : sh("#2f6fe0");
      ctx.beginPath(); ctx.moveTo(-L * 0.33, -L * 0.04); ctx.lineTo(-L * 0.6, -L * 0.09); ctx.lineTo(-L * 0.6, L * 0.06); ctx.lineTo(-L * 0.33, L * 0.04); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = rewards.has("sall") ? `hsl(${(t * 60) % 360} 80% 60%)` : rewards.has("mall") ? "#ffd479" : sh("#e8b52a", -0.1);
    ctx.beginPath(); ctx.roundRect(-L * 0.2, -L * 0.13, L * 0.36, L * 0.08, L * 0.04); ctx.fill();
    ctx.fillStyle = suit;
    ctx.beginPath(); ctx.ellipse(0, 0, L * 0.27, L * 0.07, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = suit; ctx.lineWidth = L * 0.05; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(L * 0.15, L * 0.02); ctx.lineTo(L * 0.32, L * 0.06); ctx.stroke();
    ctx.fillStyle = "#4a4a4a"; ctx.fillRect(L * 0.3, L * 0.035, L * 0.1, L * 0.045);
    ctx.fillStyle = suit;
    ctx.beginPath(); ctx.arc(L * 0.33, -L * 0.03, L * 0.07, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(170,220,240,0.85)";
    ctx.beginPath(); ctx.ellipse(L * 0.38, -L * 0.04, L * 0.035, L * 0.03, 0, 0, TAU); ctx.fill();
    // the lamp on the helmet; its beam is drawn with the other lights
    ctx.fillStyle = "#fff6d0"; ctx.beginPath(); ctx.arc(L * 0.37, -L * 0.1, L * 0.02, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ---- hidden seahorses, the treasure map and digging --------------------
  function drawHidden(k) {
    for (const h of scene.hidden) {
      const kp = scene.kelpBack[h.k];
      if (!kp || !kp.pts) continue;
      const p = kp.pts[Math.min(h.seg, kp.pts.length - 1)];
      h.x = p[0] + 4 * u * h.dir; h.y = p[1];
      ctx.globalAlpha = h.found ? 1 : 0.8;
      drawSeahorse({ px: h.x, py: h.y, s: 10 * u, dir: h.dir, ph: h.k, color: h.found ? "#f2b134" : kp.color });
      ctx.globalAlpha = 1;
      // after 40 seconds an unfound seahorse gives a small twinkle now and then, as a hint
      if (!h.found && t - (scene.taskT0 || 0) > 40) {
        const tw = Math.sin(t * 1.3 + h.k * 2.1);
        if (tw > 0.9) {
          const a = (tw - 0.9) * 10;
          ctx.fillStyle = `rgba(255,245,200,${0.9 * a})`;
          const sx = h.x + 7 * u, sy = h.y - 12 * u, r = (2 + 3 * a) * u;
          ctx.beginPath();
          ctx.moveTo(sx, sy - r); ctx.lineTo(sx + r * 0.25, sy - r * 0.25); ctx.lineTo(sx + r, sy); ctx.lineTo(sx + r * 0.25, sy + r * 0.25);
          ctx.lineTo(sx, sy + r); ctx.lineTo(sx - r * 0.25, sy + r * 0.25); ctx.lineTo(sx - r, sy); ctx.lineTo(sx - r * 0.25, sy - r * 0.25);
          ctx.fill();
        }
      }
      if (h.flash > 0) {
        h.flash -= 0.02 * k;
        ctx.strokeStyle = `rgba(255,230,150,${Math.max(0, h.flash)})`; ctx.lineWidth = 2 * u;
        ctx.beginPath(); ctx.arc(h.x, h.y - 5 * u, (1 - h.flash) * 40 * u + 8 * u, 0, TAU); ctx.stroke();
      }
    }
  }

  // The search task shows for a while, then steps aside; finding one brings it back briefly.
  let taskTimer;
  function updateTask() {
    taskEl.hidden = true; // the search bar is gone; finding a seahorse gives a short message instead
    return;
    const h = scene.hidden;
    taskEl.hidden = !h.length || restMode;
    if (taskEl.hidden) return;
    const n = h.filter(x => x.found).length, done = n === h.length;
    taskEl.textContent = done ? L("Alle zeepaardjes gevonden!", "All seahorses found!") : L(`Zoek ${h.length} verstopte zeepaardjes · ${n}/${h.length} · uitleg`, `Find ${h.length} hidden seahorses · ${n}/${h.length} · how`);
    taskEl.setAttribute("aria-label", done ? taskEl.textContent : L("Uitleg over de verstopte zeepaardjes", "How the hidden seahorses work"));
    taskEl.classList.remove("fade");
    // the first time a search task appears, explain what it is about (once the welcome screen is closed)
    if (!done && !n && !store.get("oceaan-taakuitleg", false) && welcomeEl.hidden && !/^#(zelftest|schermtest)/.test(location.hash)) {
      store.set("oceaan-taakuitleg", true);
      setTimeout(explainTask, 1200);
    }
    clearTimeout(taskTimer);
    taskTimer = setTimeout(() => taskEl.classList.add("fade"), done ? 4000 : n ? 5000 : 9000);
  }

  function computeLight() {
    const cyc = (t / 160 + scene.dayOffset + 1) % 1;
    day = Math.min(1, Math.max(0, (0.5 + 0.5 * Math.cos(cyc * TAU) - 0.25) / 0.5));
    night = 1 - day;
  }

  function updateClock() {
    computeLight();
    const part = day > 0.8 ? L("dag", "day") : night > 0.8 ? L("nacht", "night") : L("schemer", "dusk");
    clockEl.textContent = `${part} · ${scene.season === "herfst" ? L("herfst", "autumn") : L("zomer", "summer")}`;
  }

  function drawTreasureMound() {
    const T = scene.treasure;
    if (!T || T.dug) return;
    const y = sandY(T.x) + 7 * u;
    ctx.fillStyle = water.sand[0];
    ctx.beginPath(); ctx.ellipse(T.x, y, 16 * u, 5 * u, 0, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath(); ctx.ellipse(T.x - 4 * u, y - 3 * u, 6 * u, 1.5 * u, 0, 0, TAU); ctx.fill();
  }

  function dig() {
    const T = scene.treasure;
    T.dug = true;
    puff(T.x, sandY(T.x) + 4 * u, 30);
    sfxDig();
    buzz(70);
    const g = { kind: "chest", x: T.x, w: 90 * u, s: 40 * u, eel: 0, sparkles: Array.from({ length: 6 }, () => [Math.random() * 2 - 1, -0.6 - Math.random(), Math.random() * TAU]) };
    scene.ground.push(g);
    chestBurst(g);
    seen("chest");
    seen("treasure");
  }

  function drawMap(k) {
    if (mapT <= 0) return;
    mapT -= k / 60;
    const S = scene, a = Math.max(0, Math.min(1, mapT * 2, (8 - mapT) * 3));
    const mw = Math.min(W * 0.86, 440 * u), mh = mw * 0.62, mx = (W - mw) / 2, my = (H - mh) / 2 - H * 0.05;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(mx, my);
    ctx.rotate(-0.02);
    ctx.fillStyle = "#e6d6a8";
    ctx.beginPath(); ctx.roundRect(0, 0, mw, mh, 6 * u); ctx.fill();
    ctx.strokeStyle = "rgba(110,70,30,0.6)"; ctx.lineWidth = 3 * u; ctx.stroke();
    ctx.fillStyle = "rgba(120,80,30,0.12)";
    for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.arc(((i * 53) % 100) / 100 * mw, ((i * 31) % 100) / 100 * mh, (6 + (i % 4) * 5) * u, 0, TAU); ctx.fill(); }
    ctx.fillStyle = "#5a3a1a";
    ctx.font = `600 ${Math.round(24 * u)}px Caveat, "Segoe Print", cursive`;
    ctx.textBaseline = "top";
    ctx.fillText(L("Hier ligt de schat", "The treasure is here"), 16 * u, 10 * u);
    const fy = mh * 0.68, base = H * (1 - S.sand.frac), toMap = x => 16 * u + (x / W) * (mw - 32 * u);
    const floor = x => Math.min(mh - 8 * u, fy + (sandY(x) - base) * 0.4);
    ctx.strokeStyle = "#7a5a30"; ctx.lineWidth = 2 * u;
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) { const x = (i / 40) * W; i ? ctx.lineTo(toMap(x), floor(x)) : ctx.moveTo(toMap(x), floor(x)); }
    ctx.stroke();
    ctx.fillStyle = "#7a5a30";
    for (const g of S.ground) {
      const px = toMap(g.x), py = floor(g.x);
      if (g.kind === "wreck") {
        ctx.beginPath(); ctx.moveTo(px - 12 * u, py - 4 * u); ctx.lineTo(px + 12 * u, py - 4 * u); ctx.lineTo(px + 8 * u, py); ctx.lineTo(px - 8 * u, py); ctx.fill();
        ctx.fillRect(px - 0.75 * u, py - 16 * u, 1.5 * u, 12 * u);
      } else {
        ctx.beginPath(); ctx.moveTo(px - 5 * u, py); ctx.lineTo(px, py - 8 * u); ctx.lineTo(px + 5 * u, py); ctx.fill();
      }
    }
    if (S.treasure) {
      const px = toMap(S.treasure.x), py = floor(S.treasure.x) - 6 * u;
      ctx.setLineDash([3 * u, 4 * u]);
      ctx.strokeStyle = "rgba(122,90,48,0.8)"; ctx.lineWidth = 1.5 * u;
      ctx.beginPath(); ctx.moveTo(30 * u, 44 * u); ctx.quadraticCurveTo(mw * 0.5, mh * 0.2, px, py - 8 * u); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = "#b3261e"; ctx.lineWidth = 3 * u;
      ctx.beginPath(); ctx.moveTo(px - 6 * u, py - 6 * u); ctx.lineTo(px + 6 * u, py + 6 * u); ctx.moveTo(px + 6 * u, py - 6 * u); ctx.lineTo(px - 6 * u, py + 6 * u); ctx.stroke();
    }
    ctx.strokeStyle = "#7a5a30"; ctx.lineWidth = 1.5 * u;
    ctx.beginPath(); ctx.arc(mw - 30 * u, 30 * u, 14 * u, 0, TAU); ctx.moveTo(mw - 30 * u, 12 * u); ctx.lineTo(mw - 30 * u, 48 * u); ctx.moveTo(mw - 48 * u, 30 * u); ctx.lineTo(mw - 12 * u, 30 * u); ctx.stroke();
    ctx.font = `600 ${Math.round(14 * u)}px Caveat, cursive`;
    ctx.fillText("N", mw - 34 * u, 46 * u);
    ctx.font = `${Math.round(10 * u)}px "DM Mono", monospace`;
    ctx.fillStyle = "rgba(90,58,26,0.7)";
    ctx.fillText(L("tik op het kruisje in het zand om te graven", "tap the cross in the sand to dig"), 16 * u, mh - 18 * u);
    ctx.restore();
  }


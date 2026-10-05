  // ---- surface, food, coins and currents ---------------------------------
  function waveY(x) { return 14 * u + Math.sin(x * 0.018 + t * 1.4) * 3 * u + Math.sin(x * 0.006 - t * 0.8) * 5 * u; }

  function drawSurface(k, dtSec) {
    if (!water.surface) return;
    const S = scene;
    ctx.fillStyle = `rgba(${water.ray},${0.12 + 0.18 * day})`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 0; x <= W + 10; x += 10) ctx.lineTo(x, waveY(x));
    ctx.lineTo(W, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = `rgba(255,255,255,${0.15 + 0.35 * day})`; ctx.lineWidth = 1.5 * u;
    ctx.beginPath();
    for (let x = 0; x <= W + 10; x += 10) x ? ctx.lineTo(x, waveY(x)) : ctx.moveTo(x, waveY(x));
    ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${0.06 + 0.12 * day})`; ctx.lineWidth = u;
    ctx.beginPath();
    for (let i = 0; i < 30; i++) {
      const x = ((i * 97 + t * 12 * (i % 3 + 1)) % (W + 60)) - 30, y = waveY(x) + (6 + (i * 13) % 26) * u;
      ctx.moveTo(x, y); ctx.lineTo(x + (8 + (i % 5) * 3) * u, y + Math.sin(t * 2 + i) * 1.5 * u);
    }
    ctx.stroke();

    for (const f of S.floes) {
      f.x += (f.sp + current * 0.2) * u * k;
      if (f.x - f.w / 2 > W + 20) f.x = -f.w / 2 - 10;
      if (f.x + f.w / 2 < -20) f.x = W + f.w / 2;
      const top = waveY(f.x) - 4 * u;
      const g = ctx.createLinearGradient(0, top, 0, top + f.d);
      g.addColorStop(0, "rgba(240,250,255,0.97)");
      g.addColorStop(1, "rgba(150,200,225,0.9)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(f.x - f.w / 2, top);
      for (let i = 0; i <= 10; i++) ctx.lineTo(f.x - f.w / 2 + (i / 10) * f.w, top + f.d * (i === 0 || i === 10 ? 0.3 : 0.55 + 0.45 * Math.abs(Math.sin(i * 1.7 + f.seed))));
      ctx.lineTo(f.x + f.w / 2, top);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(250,253,255,0.95)";
      ctx.fillRect(f.x - f.w / 2, 0, f.w, Math.max(0, top));
    }

    // a boat drifts over now and then, with a fishing line
    S.boatTimer -= dtSec;
    if (!S.boat && S.boatTimer <= 0) {
      const dir = Math.random() < 0.5 ? 1 : -1;
      S.boat = { dir, L: (90 + Math.random() * 60) * u, x: dir > 0 ? -150 * u : W + 150 * u, line: H * (0.25 + Math.random() * 0.2) };
    }
    if (S.boat) {
      const b = S.boat;
      // the boat drifts slowly while it fishes, and speeds off once it has caught something
      b.x += b.dir * (b.done ? 1.1 : 0.35) * u * k;
      const y = waveY(b.x);
      ctx.strokeStyle = "rgba(230,240,240,0.35)"; ctx.lineWidth = 0.8;
      const hx = b.x + b.L * 0.3 + Math.sin(t * 0.7) * 6 * u * (b.caught ? 0.3 : 1), hy = y + b.line;
      b.hx = hx; b.hy = hy;
      ctx.beginPath(); ctx.moveTo(b.x + b.L * 0.3, y + 2 * u); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.strokeStyle = "rgba(200,205,210,0.8)"; ctx.lineWidth = 1.5 * u;
      ctx.beginPath(); ctx.arc(hx - 3 * u, hy, 3 * u, 0, Math.PI); ctx.stroke();
      if (!b.caught && !b.done) {
        ctx.fillStyle = sh("#c96a6a");
        ctx.beginPath(); ctx.ellipse(hx - 6 * u, hy - 2 * u, 2 * u, 3.5 * u, 0.4, 0, TAU); ctx.fill();
        // a fish that reaches the bait bites (shinies are lucky and never get caught)
        for (const sp of S.species) {
          if (sp.lantern || sp.predator || sp.size > 12) continue;
          const i = sp.fish.findIndex(f => !f.shiny && Math.hypot(f.x - (hx - 5 * u), f.y - hy) < 9 * u);
          if (i >= 0) {
            const f = sp.fish.splice(i, 1)[0];
            b.caught = { main: sp.main, dark: sp.dark, L: sp.size * u * f.scale, ph: 0 };
            for (let n = 0; n < 6; n++) bubbles.push({ x: hx, y: hy, r: (1 + Math.random() * 2) * u, ph: Math.random() * TAU });
            break;
          }
        }
      }
      if (b.caught) {
        // reel it in: the line gets shorter until the fish is out of the water
        b.line = Math.max(4 * u, b.line - 0.8 * u * k);
        b.caught.ph += 0.7 * k;
        drawFishShape(hx - 4 * u, hy + b.caught.L * 0.95, -Math.PI / 2 + Math.sin(b.caught.ph) * 0.5, b.caught.L, b.caught.main, b.caught.dark, b.caught.ph * 2, false);
        if (b.line <= 4 * u) {
          b.caught = null; b.done = true;
          for (let n = 0; n < 2; n++) ripples.push({ x: hx + (n - 0.5) * 8 * u, r: 1, a: 0.7 });
        }
      }
      ctx.save();
      ctx.translate(b.x, y);
      ctx.rotate(Math.sin(t * 1.2) * 0.03);
      ctx.fillStyle = "rgba(10,20,28,0.85)";
      ctx.beginPath();
      ctx.moveTo(-b.L * 0.5, -2 * u);
      ctx.quadraticCurveTo(-b.L * 0.45, b.L * 0.14, 0, b.L * 0.16);
      ctx.quadraticCurveTo(b.L * 0.45, b.L * 0.14, b.L * 0.55, -2 * u);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      if (Math.random() < 0.15 * k) bubbles.push({ x: b.x - b.dir * b.L * 0.5, y: y + 8 * u, r: (1 + Math.random() * 2) * u, ph: Math.random() * TAU });
      if ((b.dir > 0 && b.x > W + 160 * u) || (b.dir < 0 && b.x < -160 * u)) { S.boat = null; S.boatTimer = 25 + Math.random() * 35; }
    }

    // a gull's shadow flits across the surface
    S.gullTimer -= dtSec;
    if (!S.gull && S.gullTimer <= 0) { const dir = Math.random() < 0.5 ? 1 : -1; S.gull = { dir, x: dir > 0 ? -40 : W + 40 }; }
    if (S.gull) {
      const gl = S.gull;
      gl.x += gl.dir * 3.5 * u * k;
      const y = waveY(gl.x) - 5 * u, w = 14 * u, flap = Math.sin(t * 10) * 4 * u;
      ctx.strokeStyle = "rgba(10,20,30,0.25)"; ctx.lineWidth = 2.5 * u; ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(gl.x - w, y - flap); ctx.quadraticCurveTo(gl.x - w * 0.4, y - 3 * u, gl.x, y); ctx.quadraticCurveTo(gl.x + w * 0.4, y - 3 * u, gl.x + w, y - flap);
      ctx.stroke();
      if (gl.x < -60 || gl.x > W + 60) { S.gull = null; S.gullTimer = 12 + Math.random() * 25; }
    }

    // sea otters float on their backs
    for (const o of S.otters) {
      o.x += (o.vx + current * 0.3) * u * k;
      if (o.x < 30) o.vx = Math.abs(o.vx);
      if (o.x > W - 30) o.vx = -Math.abs(o.vx);
      const y = waveY(o.x) + 2 * u, s = o.s;
      const fur = sh("#5a3e2a"), face = sh("#c9b49a");
      const recolor = o.shiny && beginShiny();
      ctx.save();
      ctx.translate(o.x, y);
      ctx.rotate(Math.sin(t * 1.4 + o.ph) * 0.08);
      ctx.fillStyle = fur;
      ctx.beginPath(); ctx.ellipse(0, 0, s * 0.6, s * 0.18, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-s * 0.55, 0); ctx.quadraticCurveTo(-s * 0.85, s * 0.02, -s * 1.0, -s * 0.06); ctx.lineTo(-s * 0.55, -s * 0.06); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-s * 0.35, -s * 0.12, s * 0.12, s * 0.05, -0.5, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(s * 0.25, -s * 0.18, s * 0.06, s * 0.1, 0.3 + Math.sin(t * 3 + o.ph) * 0.3, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(s * 0.38, -s * 0.18, s * 0.06, s * 0.1, -0.3, 0, TAU); ctx.fill();
      if (o.shell) { ctx.fillStyle = sh("#e6c9a8"); ctx.beginPath(); ctx.arc(s * 0.32, -s * 0.28, s * 0.08, 0, TAU); ctx.fill(); }
      ctx.fillStyle = face;
      ctx.beginPath(); ctx.arc(s * 0.62, -s * 0.06, s * 0.17, 0, TAU); ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath(); ctx.arc(s * 0.72, -s * 0.1, s * 0.025, 0, TAU); ctx.arc(s * 0.78, -s * 0.03, s * 0.03, 0, TAU); ctx.fill();
      ctx.restore();
      if (recolor) endShiny(o.shiny, o);
    }
  }

  function updateAndDrawFood(k) {
    if (feeding && pointer.active && Math.random() < 0.5 * k && food.length < 90) {
      const fy = Math.max(pointer.y, (water.surface ? waveY(pointer.x) : 0) + 8 * u);
      food.push({ x: pointer.x + (Math.random() - 0.5) * 20 * u, y: fy + (Math.random() - 0.5) * 10 * u, ph: Math.random() * TAU, r: (1 + Math.random()) * u });
    }
    // food draws in new fish from the nearest side
    if (feeding && pointer.active) {
      scene.feedT = (scene.feedT || 0) + k / 60;
      if (scene.feedT > 6) { scene.feedT = 0; bringNewcomers(); }
    }
    ctx.fillStyle = sh("#e3c98f", -0.1);
    food = food.filter(p => {
      if (p.eaten) return false;
      p.y += 0.3 * u * k;
      p.x += (Math.sin(t * 2 + p.ph) * 0.2 + current * 0.6) * k;
      if (p.y > sandY(p.x) + 4 * u) return false;
      ctx.beginPath(); ctx.ellipse(p.x, p.y, p.r * 1.4, p.r * 0.8, p.ph, 0, TAU); ctx.fill();
      return true;
    });
  }

  function updateAndDrawCoins(k) {
    coins = coins.filter(c => {
      if (!c.landed) {
        c.vy += 0.05 * u * k;
        c.vx *= Math.pow(0.98, k); c.vy *= Math.pow(0.985, k);
        c.x += c.vx * k; c.y += c.vy * k; c.rot += c.spin * k;
        const g = sandY(c.x) + 5 * u;
        if (c.y >= g) { c.y = g; c.landed = true; }
      } else c.life -= k / 60;
      ctx.globalAlpha = Math.max(0, Math.min(1, c.life));
      ctx.fillStyle = sh("#f2c34a", -0.1);
      ctx.beginPath(); ctx.ellipse(c.x, c.y, c.r * Math.max(0.15, Math.abs(Math.cos(c.rot))), c.r, 0, 0, TAU); ctx.fill();
      ctx.globalAlpha = 1;
      return c.life > 0;
    });
  }

  function chestBurst(g) {
    const s = g.s, y = sandY(g.x) + s * 0.12 - s * 0.6;
    for (let i = 0; i < 26; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6, v = (2 + Math.random() * 3) * u;
      coins.push({ x: g.x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: s * 0.09, rot: Math.random() * TAU, spin: 0.1 + Math.random() * 0.2, life: 4 + Math.random() * 3 });
    }
    for (let i = 0; i < 30; i++) bubbles.push({ x: g.x + (Math.random() - 0.5) * s, y: y - Math.random() * s, r: (1 + Math.random() * 4) * u, ph: Math.random() * TAU });
    if (Math.random() < 0.35) g.eel = 1;
    sfxChest();
    buzz(25);
  }

  function drawStreaks(k) {
    const a = Math.min(1, Math.abs(current) / 1.5);
    if (a < 0.08) return;
    if (!streaks.length) streaks = Array.from({ length: 28 }, () => ({ x: Math.random() * W, y: Math.random() * H * 0.85, l: (30 + Math.random() * 60) * u, sp: 4 + Math.random() * 4 }));
    const dir = Math.sign(current);
    ctx.strokeStyle = `rgba(255,255,255,${0.1 * a})`; ctx.lineWidth = u;
    ctx.beginPath();
    for (const s of streaks) {
      s.x += dir * s.sp * u * k * a;
      if (s.x > W + s.l) { s.x = -s.l; s.y = Math.random() * H * 0.85; }
      if (s.x < -s.l) { s.x = W + s.l; s.y = Math.random() * H * 0.85; }
      ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - dir * s.l, s.y);
    }
    ctx.stroke();
  }

  // ---- everything that gives off light, drawn after the night falls -----
  function glow(x, y, r, rgb, a) {
    if (a <= 0.005) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  function drawLights(k) {
    const S = scene;
    ctx.globalCompositeOperation = "lighter";
    if (glowF > 0.05) {
      ctx.fillStyle = "rgb(120,240,255)";
      for (let i = 0; i < S.snow.length; i += 2) {
        const p = S.snow[i];
        ctx.globalAlpha = glowF * 0.6 * (0.5 + 0.5 * Math.sin(t * 3 + p.ph * 5));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 1.4, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    if (glowF > 0.1) for (const j of S.jellies) glow(j.x, j.y - j.r * 0.3, j.r * 2.4, j.col, 0.3 * glowF);
    drawCombs(k, true);
    for (const sp of S.species) {
      if (!sp.lantern) continue;
      ctx.fillStyle = `rgba(140,230,255,${0.45 + 0.5 * glowF})`;
      for (const f of sp.fish) {
        const L = sp.size * u * f.scale, a = Math.atan2(f.vy, f.vx), c = Math.cos(a), s = Math.sin(a);
        for (const o of [-0.5, 0, 0.5]) { ctx.beginPath(); ctx.arc(f.x + c * L * o, f.y + s * L * o + L * 0.22, Math.max(0.8, L * 0.09), 0, TAU); ctx.fill(); }
      }
    }
    if (S.angler && S.angler.lx !== undefined) glow(S.angler.lx, S.angler.ly, S.angler.s * 1.6, "150,255,235", 0.25 + 0.4 * glowF);
    for (const g of S.ground) {
      if (g.kind === "chest") glow(g.x, sandY(g.x) - g.s * 0.5, g.s * 3, "255,200,100", 0.3 * night);
      if (g.kind === "vent") glow(g.x, sandY(g.x) - g.s * 1.3, g.s * 1.2, "255,120,50", 0.25 + 0.2 * night);
      if (g.kind === "arch" && g.eyes && g.eyeX !== undefined) {
        const open = Math.sin(t * 0.6 + g.x) > -0.85 ? 1 : 0.1;
        for (const sx of [-1, 1]) glow(g.eyeX + sx * g.s * 0.07, g.eyeY, g.s * 0.12, "220,255,120", (0.5 + 0.5 * glowF) * open);
      }
    }
    const v = S.visitor;
    if (v && v.type === "sub") {
      const lx = v.x + v.dir * v.size * 0.46, ly = v.y + v.yOff + v.size * 0.03;
      const len = Math.min(H * 0.55, v.size * 3.5), a = 0.35, spread = 0.28;
      const ex1 = lx + v.dir * Math.cos(a - spread) * len, ey1 = ly + Math.sin(a - spread) * len;
      const ex2 = lx + v.dir * Math.cos(a + spread) * len, ey2 = ly + Math.sin(a + spread) * len;
      const g = ctx.createLinearGradient(lx, ly, (ex1 + ex2) / 2, (ey1 + ey2) / 2);
      const strength = 0.08 + 0.22 * Math.max(night, water.glow ? 0.8 : 0);
      g.addColorStop(0, `rgba(255,245,200,${strength})`);
      g.addColorStop(1, "rgba(255,245,200,0)");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(ex1, ey1); ctx.lineTo(ex2, ey2); ctx.closePath(); ctx.fill();
      glow(lx, ly, v.size * 0.12, "255,245,210", 0.6);
    }
    if (S.boat && night > 0.2) glow(S.boat.x, waveY(S.boat.x) - 2 * u, 40 * u, "255,210,140", 0.5 * night);
    if (S.ghost) shinyDraw(S.ghost, () => drawGhost(k));
    if (S.kraken.active && S.kraken.eye) glow(S.kraken.eye.x, S.kraken.eye.y, 90 * u, "255,200,60", 0.35 * S.kraken.reach);
    drawShinies();
    for (const g of S.ground) {
      if (g.kind === "volcano") {
        glow(g.x, sandY(g.x) + 8 * u - g.s * 1.1, g.s * (0.9 + g.erupt), "255,120,40", 0.3 + 0.4 * g.erupt);
        for (const p of g.lava) glow(p.x, p.y, p.r * 4, "255,140,60", 0.4 * p.life);
      }
      if (g.kind === "city" && g.lampX !== undefined) glow(g.lampX, g.lampY, g.s * 1.2, "255,220,140", 0.15 + 0.35 * glowF);
    }
    abyssGlows = abyssGlows.filter(p => {
      p.y += p.vy * k; p.life += 0.01 * k;
      if (p.y < H * 0.45) return false;
      glow(p.x, p.y, p.r * 4, p.col, 0.6 * Math.min(1, p.life) * Math.min(1, (p.y - H * 0.45) / (H * 0.15)));
      return true;
    });
    if (water.surface && night > 0.05) glow(S.moon.x, waveY(S.moon.x) + 34 * u, 70 * u, "240,240,220", 0.22 * night);
    if (diverMode) {
      // the diver's lamp turns with the diver; its beam is exactly the part of the ocean that goes into the logbook
      const d = diver, th = d.heading, c = lightCone(), big = rewards.has("m75");
      const lx = d.x + Math.cos(th) * 18 * u, ly = d.y + Math.sin(th) * 18 * u, len = c.len, spr = c.half;
      const strength = (big ? 0.12 : 0.08) + (big ? 0.32 : 0.26) * Math.max(night, water.glow ? 0.8 : 0);
      const g2 = ctx.createLinearGradient(lx, ly, lx + Math.cos(th) * len, ly + Math.sin(th) * len);
      g2.addColorStop(0, `rgba(255,248,215,${strength})`);
      g2.addColorStop(1, "rgba(255,248,215,0)");
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + Math.cos(th - spr) * len, ly + Math.sin(th - spr) * len); ctx.lineTo(lx + Math.cos(th + spr) * len, ly + Math.sin(th + spr) * len); ctx.closePath(); ctx.fill();
      glow(lx, ly, 10 * u, "255,248,220", 0.7);
    }
    ctx.globalCompositeOperation = "source-over";
  }


  // ---- fish --------------------------------------------------------------
  function drawFishShape(x, y, ang, L, main, dark, ph, stripes) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    if (Math.cos(ang) < 0) ctx.scale(1, -1);
    ctx.fillStyle = dark;
    ctx.save();
    ctx.translate(-L * 0.78, 0);
    ctx.rotate(Math.sin(ph) * 0.4);
    ctx.beginPath();
    ctx.moveTo(L * 0.1, 0);
    ctx.lineTo(-L * 0.55, -L * 0.4);
    ctx.quadraticCurveTo(-L * 0.4, 0, -L * 0.55, L * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(-L * 0.2, -L * 0.3);
    ctx.quadraticCurveTo(L * 0.05, -L * 0.62, L * 0.25, -L * 0.3);
    ctx.fill();
    ctx.fillStyle = main;
    ctx.beginPath();
    ctx.ellipse(0, 0, L, L * (stripes ? 0.45 : 0.36), 0, 0, TAU);
    ctx.fill();
    if (stripes) {
      ctx.save();
      ctx.clip();
      ctx.fillStyle = "#fbfbf6";
      ctx.fillRect(L * 0.25, -L, L * 0.2, L * 2);
      ctx.fillRect(-L * 0.3, -L, L * 0.2, L * 2);
      ctx.restore();
    }
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.arc(L * 0.58, -L * 0.07, Math.max(0.7, L * 0.07), 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function fearSources() {
    const list = [];
    if (diverMode) list.push([diver.x, diver.y, 90 * u]);
    const v = scene.visitor;
    if (v) {
      if (v.type === "shark") list.push([v.x, v.y, v.size * 1.1]);
      if (v.type === "swordfish") list.push([v.x, v.y, v.size * 1.5]);
      if (v.type === "dolphins") for (const d of v.pod) list.push([v.x + d.dx * v.dir, v.y + d.dy, v.size * 0.9]);
    }
    if (scene.seal && scene.seal.y !== undefined) list.push([scene.seal.x, scene.seal.y, scene.seal.s * 1.6]);
    for (const T of [scene.kraken, scene.giant]) {
      if (T.active && T.reach > 0.3) for (const tc of T.list) if (tc.tip) list.push([tc.tip[0], tc.tip[1], 150 * u]);
    }
    return list;
  }

  function updateFish(k) {
    const R = 55 * u, R2 = R * R;
    const fears = fearSources();
    for (const sp of scene.species) {
      const S = sp.size * u * 3.2;
      const list = sp.fish;
      const top = H * (sp.bandC - sp.bandH), bottom = H * (sp.bandC + sp.bandH);
      for (const f of list) {
        let ax = 0, ay = 0, cx = 0, cy = 0, avx = 0, avy = 0, n = 0;
        for (const g of list) {
          if (g === f) continue;
          const dx = g.x - f.x, dy = g.y - f.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > R2) continue;
          n++; cx += g.x; cy += g.y; avx += g.vx; avy += g.vy;
          const d = Math.sqrt(d2) || 0.01;
          if (d < S) { ax -= dx / d * (1 - d / S) * 0.12; ay -= dy / d * (1 - d / S) * 0.12; }
        }
        if (n) {
          ax += (cx / n - f.x) * 0.0006; ay += (cy / n - f.y) * 0.0006;
          ax += (avx / n - f.vx) * 0.045; ay += (avy / n - f.vy) * 0.045;
        }
        if (food.length) {
          let best = null, bd = 220 * u;
          for (const p of food) {
            const d = Math.hypot(p.x - f.x, p.y - f.y);
            if (d < bd) { bd = d; best = p; }
          }
          if (best) {
            const d = bd || 0.01;
            ax += (best.x - f.x) / d * 0.08 * u; ay += (best.y - f.y) / d * 0.08 * u;
            if (d < 6 * u) best.eaten = true;
          }
        }
        ax += current * 0.006 * u;
        ay += Math.sin(t * 1.1 + f.x * 0.012) * 0.004 * u; // a slow wave rolls through the school
        ax += Math.sin(t * 0.4 + f.ph) * 0.006 * u;
        ay += Math.cos(t * 0.33 + f.ph * 1.3) * 0.004 * u;
        if (f.y < top) ay += 0.015 * u;
        if (f.y > bottom) ay -= 0.015 * u;
        if (f.y > sandY(f.x) - 40 * u) ay -= 0.08 * u;
        if (sp.leaving) ax += sp.leaving * 0.06 * u;
        else {
          if (f.x < -50 * u) ax += 0.04 * u;
          if (f.x > W + 50 * u) ax -= 0.04 * u;
        }
        // a fish that sees the bait on the hook swims over to it
        const boat = scene.boat;
        if (boat && boat.hx !== undefined && !boat.caught && !boat.done && !sp.predator && !sp.lantern && sp.size <= 12) {
          const dx = boat.hx - 4 * u - f.x, dy = boat.hy - f.y, d = Math.hypot(dx, dy);
          if (d < 150 * u && d > 0.01) { ax += dx / d * 0.035 * u; ay += dy / d * 0.035 * u; }
        }

        let scare = 0;
        if (sp.predator) {
          f.hunger = (f.hunger || 0) - k / 60;
          if (f.hunger <= 0 && sp.prey.fish.length) {
            let best = -1, bd = 170 * u;
            sp.prey.fish.forEach((p, i) => { const d = Math.hypot(p.x - f.x, p.y - f.y); if (d < bd) { bd = d; best = i; } });
            if (best >= 0) {
              const p = sp.prey.fish[best], d = bd || 1;
              ax += (p.x - f.x) / d * 0.09 * u; ay += (p.y - f.y) / d * 0.09 * u;
              scare = 0.6;
              if (d < sp.size * u * 0.9) {
                sp.prey.fish.splice(best, 1);
                f.hunger = 15 + Math.random() * 25;
                for (let i = 0; i < 4; i++) bubbles.push({ x: f.x, y: f.y, r: (1 + Math.random() * 1.5) * u, ph: Math.random() * TAU });
              }
            }
          }
        } else if (sp.hunter) {
          // prey only bolts from hunters that are actually hungry
          for (const p of sp.hunter.fish) {
            if (!(p.hunger <= 0)) continue;
            const dx = f.x - p.x, dy = f.y - p.y, d = Math.hypot(dx, dy);
            if (d < 90 * u && d > 0.01) { const s = 1 - d / (90 * u); scare = Math.max(scare, s); ax += dx / d * s * 0.4 * u; ay += dy / d * s * 0.4 * u; }
          }
        }
        for (const [qx, qy, QR] of fears) {
          const dx = f.x - qx, dy = f.y - qy;
          const d = Math.hypot(dx, dy);
          if (d < QR && d > 0.01) {
            const s = 1 - d / QR;
            scare = Math.max(scare, s);
            ax += dx / d * s * 0.5 * u; ay += dy / d * s * 0.5 * u;
          }
        }

        f.vx += ax * k; f.vy += ay * k;
        const spd = Math.hypot(f.vx, f.vy) || 0.01;
        const max = sp.speed * u * (1 + scare * 1.8), min = sp.speed * u * 0.45;
        const clamp = Math.min(max, Math.max(min, spd)) / spd;
        f.vx *= clamp; f.vy *= clamp;
        f.vy *= 0.985;
        f.x += f.vx * k; f.y += f.vy * k;
        if (water.surface) {
          // fish stay under the water line
          const lim = waveY(f.x) + sp.size * u + 4 * u;
          if (f.y < lim) { f.y = lim; if (f.vy < 0) f.vy *= -0.5; }
        }
        f.ph += (0.18 + (spd / u) * 0.12) * k;
        if (f.grow && f.scale < f.grow) f.scale += 0.0005 * k;
        if (sp.plankton && frameNo % 6 === 0) {
          for (const p of scene.snow) if (Math.abs(p.x - f.x) < 7 * u && Math.abs(p.y - f.y) < 7 * u) { p.y = -4; p.x = Math.random() * W; }
        }
      }
      // a school that has swum off is replaced by a new one coming in
      if (sp.leaving && sp.fish.every(f => (sp.leaving < 0 ? f.x < -80 * u : f.x > W + 80 * u))) renewSchool(sp);
    }
  }

  function drawFish() {
    for (const sp of scene.species)
      for (const f of sp.fish)
        shinyDraw(f, () => drawFishShape(f.x, f.y, Math.atan2(f.vy, f.vx), sp.size * u * f.scale, sp.main, sp.dark, f.ph, false));
  }

  // ---- jellyfish ---------------------------------------------------------
  function updateAndDrawJellies(k) {
    if (water.glow) ctx.globalCompositeOperation = "lighter";
    for (const j of scene.jellies) {
      j.ph += 0.032 * j.sp * k;
      const thrust = Math.max(0, Math.cos(j.ph));
      j.y -= thrust * 0.75 * u * j.sp * k;
      j.y += 0.14 * u * k;
      j.x += (Math.sin(t * 0.18 + j.drift) * 0.18 + current * 0.5) * u * k;
      if (diverMode) {
        const dx = j.x - diver.x, dy = j.y - diver.y;
        const d = Math.hypot(dx, dy), R = 110 * u;
        if (d < R && d > 0.01) { j.x += dx / d * (1 - d / R) * 1.1 * u * k; j.y += dy / d * (1 - d / R) * 1.1 * u * k; }
      }
      if (j.hd === undefined) j.hd = (Math.random() < 0.5 ? -1 : 1) * (0.04 + Math.random() * 0.1);
      j.x += j.hd * u * k;
      if (water.surface) { const lim = waveY(j.x) + j.r * 1.3; if (j.y < lim) j.y = lim; }
      else if (j.bloom) j.y = Math.max(j.y, j.r * 2);
      else if (j.y < -j.r * 5) { j.y = H * 0.8; j.x = Math.random() * W; renewJelly(j); }
      if (j.y > H * 0.85) j.y -= 0.5 * u * k;
      // jellies in a swarm just drift on through; the others come back as new jellies
      if (j.shiny && (j.x < j.r * 1.5 || j.x > W - j.r * 1.5)) { j.hd = Math.abs(j.hd || 0.1) * (j.x < W / 2 ? 1 : -1); j.bloom = 0; }
      else if (!j.bloom && j.x < -j.r * 3) { j.x = W + j.r * 2; renewJelly(j); }
      else if (!j.bloom && j.x > W + j.r * 3) { j.x = -j.r * 2; renewJelly(j); }

      const pulse = Math.sin(j.ph);
      const bw = j.r * (1 + 0.12 * pulse), bh = j.r * (0.78 - 0.14 * pulse);
      const recolor = j.shiny && beginShiny();
      ctx.save();
      ctx.translate(j.x, j.y);
      ctx.rotate(Math.sin(t * 0.25 + j.drift) * 0.12);

      ctx.lineWidth = Math.max(0.7, 0.9 * u);
      ctx.strokeStyle = `rgba(${j.col},0.32)`;
      const n = 7, len = j.r * j.tl;
      for (let i = 0; i < n; i++) {
        const x0 = -bw * 0.8 + (i * 1.6 * bw) / (n - 1);
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        for (let s = 1; s <= 10; s++) {
          const yy = (s / 10) * len * (0.8 + (i % 3) * 0.15);
          const xx = x0 * (1 - s * 0.03) + Math.sin(t * 1.8 - s * 0.55 + i) * j.r * 0.18 * (s / 10);
          ctx.lineTo(xx, yy);
        }
        ctx.stroke();
      }
      ctx.lineWidth = Math.max(1.5, j.r * 0.12);
      ctx.strokeStyle = `rgba(${j.col},0.4)`;
      for (let i = -1; i <= 1; i += 2) {
        ctx.beginPath();
        ctx.moveTo(i * bw * 0.15, 0);
        for (let s = 1; s <= 8; s++) ctx.lineTo(i * bw * 0.15 + Math.sin(t * 1.4 - s * 0.7 + i) * j.r * 0.22, (s / 8) * len * 0.6);
        ctx.stroke();
      }
      if (water.glow) { ctx.shadowBlur = 18 * u; ctx.shadowColor = `rgba(${j.col},0.8)`; }
      const g = ctx.createRadialGradient(0, -bh * 0.5, 0, 0, -bh * 0.3, bw * 1.1);
      g.addColorStop(0, `rgba(${j.col},0.55)`);
      g.addColorStop(1, `rgba(${j.col},0.12)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-bw, 0);
      ctx.bezierCurveTo(-bw, -bh * 1.35, bw, -bh * 1.35, bw, 0);
      for (let s = 4; s >= 0; s--) {
        const xa = -bw + (s / 4) * 2 * bw;
        ctx.quadraticCurveTo(xa + bw / 4, bh * 0.18, xa, 0);
      }
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
      if (recolor) endShiny(j.shiny, j);
    }
    ctx.globalCompositeOperation = "source-over";
  }

  // ---- bottom dwellers ---------------------------------------------------
  function drawCrab(c, k) {
    const flee = near(c.x, sandY(c.x), 110 * u);
    if (flee && !c.leaving) { c.dir = Math.sign(c.x - diver.x) || 1; c.pause = 0; }
    if (c.pause > 0 && !c.leaving) c.pause -= k / 60;
    else {
      c.x += c.dir * c.speed * u * k * (1 + flee * 3);
      c.leg += 0.35 * k * (1 + flee * 2);
      if (!c.leaving && Math.random() < 0.004 * k) c.pause = 1 + Math.random() * 3;
      if (!c.leaving && Math.random() < 0.002 * k) c.dir *= -1;
    }
    if (c.leaving) { if (c.x < -40 || c.x > W + 40) renewCrab(c); }
    else {
      if (c.x < scene.floorL + 20) c.dir = 1;
      if (c.x > scene.floorR - 20) c.dir = -1;
    }
    if (flee > 0.3 && Math.random() < 0.3 * k) puff(c.x, sandY(c.x) + 5 * u, 1);
    const s = c.s, x = c.x, y = sandY(x) + 5 * u;
    const col = sh(c.color), dark = sh("#5a2418");
    ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.lineWidth = Math.max(1.2, s * 0.09);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const lift = c.pause > 0 ? 0 : Math.max(0, Math.sin(c.leg + i * 2 + (side > 0 ? 0 : Math.PI))) * s * 0.12;
        ctx.beginPath();
        ctx.moveTo(x + side * s * 0.35, y - s * 0.35 + i * s * 0.06);
        ctx.lineTo(x + side * s * (0.7 + i * 0.06), y - s * 0.55 + i * s * 0.08 - lift);
        ctx.lineTo(x + side * s * (0.85 + i * 0.1), y - lift * 0.3);
        ctx.stroke();
      }
      // claws
      const wave = Math.sin(t * 2 + side) * 0.05 * s;
      ctx.beginPath(); ctx.moveTo(x + side * s * 0.3, y - s * 0.5); ctx.lineTo(x + side * s * 0.55, y - s * 0.8 + wave); ctx.stroke();
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(x + side * s * 0.6, y - s * 0.92 + wave, s * 0.16, s * 0.11, side * 0.5, 0, TAU); ctx.fill();
      ctx.fillStyle = dark;
      ctx.beginPath(); ctx.moveTo(x + side * s * 0.65, y - s * 0.98 + wave); ctx.lineTo(x + side * s * 0.78, y - s * 1.0 + wave); ctx.lineTo(x + side * s * 0.68, y - s * 0.9 + wave); ctx.fill();
    }
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.42, s * 0.5, s * 0.3, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath(); ctx.ellipse(x - s * 0.1, y - s * 0.52, s * 0.25, s * 0.1, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, s * 0.06);
    ctx.beginPath(); ctx.moveTo(x - s * 0.12, y - s * 0.65); ctx.lineTo(x - s * 0.15, y - s * 0.85); ctx.moveTo(x + s * 0.12, y - s * 0.65); ctx.lineTo(x + s * 0.15, y - s * 0.85); ctx.stroke();
    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.arc(x - s * 0.15, y - s * 0.88, s * 0.06, 0, TAU); ctx.arc(x + s * 0.15, y - s * 0.88, s * 0.06, 0, TAU); ctx.fill();
  }

  function drawStarfish(f) {
    const x = f.x, y = sandY(x) + 3 * u, s = f.s;
    ctx.save();
    ctx.translate(x, y - s * 0.55);
    ctx.rotate(f.rot + Math.sin(t * 0.1 + f.rot) * 0.05);
    ctx.fillStyle = sh(f.color);
    ctx.strokeStyle = sh(f.color);
    ctx.lineJoin = "round"; ctx.lineWidth = s * 0.25;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? s * 0.38 : s;
      const a = -Math.PI / 2 + i * Math.PI / 5;
      i ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * TAU / 5;
      for (const r of [0.3, 0.6]) { ctx.beginPath(); ctx.arc(Math.cos(a) * s * r, Math.sin(a) * s * r, s * 0.06, 0, TAU); ctx.fill(); }
    }
    ctx.restore();
  }

  function drawUrchin(o) {
    const x = o.x, y = sandY(x) + 5 * u, s = o.s;
    ctx.strokeStyle = sh(o.color); ctx.lineWidth = Math.max(0.8, s * 0.08);
    ctx.beginPath();
    for (let i = 0; i < 26; i++) {
      const a = Math.PI + (i / 25) * Math.PI;
      const l = s * (1.6 + ((i * 7) % 5) * 0.12) + Math.sin(t * 1.5 + i) * s * 0.06;
      ctx.moveTo(x + Math.cos(a) * s * 0.6, y - s * 0.4 + Math.sin(a) * s * 0.6);
      ctx.lineTo(x + Math.cos(a) * l, y - s * 0.4 + Math.sin(a) * l);
    }
    ctx.stroke();
    ctx.fillStyle = sh(o.color);
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.35, s, s * 0.75, 0, 0, TAU); ctx.fill();
  }

  function drawOctopus(o, k) {
    const s = o.s;
    const y = sandY(o.x) + 5 * u;
    const threat = near(o.x, y - s, 120 * u);
    o.cool -= k / 60;
    if (threat && o.cool <= 0) {
      o.cool = 6;
      o.dash = 1;
      o.dir = Math.sign(o.x - diver.x) || 1;
      for (let i = 0; i < 45; i++) {
        const a = Math.random() * TAU, v = Math.random() * 1.6 * u;
        ink.push({ x: o.x, y: y - s * 0.9, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.4 * u, r: (3 + Math.random() * 7) * u, a: 0.7 });
      }
      sfxInk();
    }
    o.scare += ((threat ? 1 : 0) - o.scare) * 0.05;
    if (o.dash > 0) { o.x += o.dir * 4 * u * o.dash * k; o.dash = Math.max(0, o.dash - 0.03 * k); }
    else {
      // now and then the octopus wanders to the chest and pinches a coin
      const chest = scene.ground.find(g => g.kind === "chest");
      if (chest && !o.holding && o.goal == null && Math.random() < 0.0015 * k) o.goal = chest.x;
      if (o.goal != null) {
        o.dir = Math.sign(o.goal - o.x) || 1;
        o.x += o.dir * 0.3 * u * k;
        if (Math.abs(o.goal - o.x) < 12 * u) { o.goal = null; o.holding = true; o.holdT = 20; }
      } else {
        o.x += o.dir * 0.12 * u * k;
        if (Math.random() < 0.002 * k) o.dir *= -1;
      }
    }
    if (o.holding) {
      o.holdT -= k / 60;
      if (o.holdT <= 0) {
        o.holding = false;
        coins.push({ x: o.x + o.dir * o.s, y: sandY(o.x) - o.s * 0.5, vx: 0, vy: 0, r: o.s * 0.12, rot: 0, spin: 0.1, life: 6 });
      }
    }
    if (o.x < scene.floorL + s) o.dir = 1;
    if (o.x > scene.floorR - s) o.dir = -1;
    o.x = Math.max(scene.floorL + s * 0.5, Math.min(scene.floorR - s * 0.5, o.x));
    if (o.dash > 0.4 && Math.random() < 0.5 * k) puff(o.x, sandY(o.x) + 5 * u, 1);

    const light = 42 + o.scare * 30;
    const col = `hsl(${o.hue + Math.sin(t * 0.15) * 25} ${55 - o.scare * 25}% ${light * (1 - water.tintK * 0.6)}%)`;
    const x = o.x;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = "round";
    for (let i = 0; i < 8; i++) {
      const spread = (i - 3.5) / 3.5;
      let px = x + spread * s * 0.2, py = y - s * 0.55;
      let w = s * 0.16;
      for (let j = 1; j <= 10; j++) {
        const f = j / 10;
        const nx = x + spread * s * (0.2 + f * 1.1) + Math.sin(t * 1.3 + i * 1.7 + f * 4) * s * 0.12 * f;
        const ny = y - s * 0.55 + f * s * 0.55 - Math.max(0, f - 0.7) * s * (0.4 + 0.3 * Math.sin(t + i)) * (1 - o.scare * 0.5);
        ctx.lineWidth = w * (1 - f * 0.85);
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(nx, ny); ctx.stroke();
        px = nx; py = ny;
      }
      if (i === (o.dir > 0 ? 7 : 0)) { o.tipX = px; o.tipY = py; }
    }
    ctx.beginPath();
    ctx.ellipse(x - o.dir * s * 0.1, y - s * 0.95, s * 0.45, s * 0.55, -o.dir * 0.35, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath(); ctx.ellipse(x - o.dir * s * 0.2, y - s * 1.15, s * 0.15, s * 0.22, -o.dir * 0.35, 0, TAU); ctx.fill();
    for (const side of [-1, 1]) {
      ctx.fillStyle = "#f4ecd8";
      ctx.beginPath(); ctx.ellipse(x + side * s * 0.2, y - s * 0.6, s * 0.1, s * 0.08, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "#111";
      ctx.fillRect(x + side * s * 0.2 - s * 0.07, y - s * 0.62, s * 0.14, s * 0.035);
    }
    if (o.holding && o.tipX !== undefined) {
      ctx.fillStyle = sh("#f2c34a", -0.1);
      ctx.beginPath(); ctx.ellipse(o.tipX, o.tipY - s * 0.1, s * 0.12, s * 0.1 * Math.abs(Math.cos(t * 2)) + s * 0.02, 0, 0, TAU); ctx.fill();
    }
  }

  function drawInk(k) {
    ink = ink.filter(p => {
      p.x += p.vx * k; p.y += p.vy * k; p.vx *= 0.97; p.vy *= 0.97; p.r += 0.25 * u * k; p.a -= 0.006 * k;
      ctx.fillStyle = `rgba(12,10,16,${Math.max(0, p.a)})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill();
      return p.a > 0;
    });
  }

  function drawRay(r, k) {
    r.x += r.dir * r.speed * u * k;
    r.ph += 0.05 * k;
    if (r.dir > 0 && r.x > W + r.s * 2) r.x = -r.s * 2;
    if (r.dir < 0 && r.x < -r.s * 2) r.x = W + r.s * 2;
    const s = r.s, gy = Math.min(sandY(r.x), H * (1 - scene.sand.frac) + 12 * u) + 6 * u;
    if (r.lift < 22 * u && Math.random() < 0.15 * k) puff(r.x - r.dir * s * 0.6, gy, 1);
    const y = gy - r.lift - Math.sin(r.ph * 0.3) * 6 * u;
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath(); ctx.ellipse(r.x, gy, s * 0.8, s * 0.12, 0, 0, TAU); ctx.fill();
    ctx.save();
    ctx.translate(r.x, y);
    ctx.scale(r.dir, 1);
    const col = sh("#7c6a55"), spot = sh("#3e342a");
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(1, s * 0.03);
    ctx.beginPath(); ctx.moveTo(-s * 0.5, 0); ctx.quadraticCurveTo(-s * 1.0, Math.sin(r.ph) * s * 0.08, -s * 1.5, Math.sin(r.ph + 1) * s * 0.05); ctx.stroke();
    ctx.fillStyle = col;
    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * TAU;
      const wave = Math.sin(a * 2 + r.ph * 3) * s * 0.06 * Math.abs(Math.sin(a));
      const px = Math.cos(a) * s * 0.6 * (Math.cos(a) > 0 ? 1.05 : 0.9);
      const py = Math.sin(a) * s * 0.22 + wave;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = spot;
    for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc(((i * 37) % 80 - 40) / 100 * s, ((i * 23) % 20 - 12) / 100 * s, s * 0.025, 0, TAU); ctx.fill(); }
    ctx.fillStyle = sh("#5a4c3d");
    ctx.beginPath(); ctx.arc(s * 0.38, -s * 0.07, s * 0.04, 0, TAU); ctx.arc(s * 0.38, s * 0.03, s * 0.04, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawSeahorse(h) {
    const s = h.s;
    const x = h.px !== undefined ? h.px : h.x + Math.sin(t * 0.3 + h.ph) * 10 * u;
    const y = h.py !== undefined ? h.py : sandY(h.x) - h.lift + Math.sin(t * 0.8 + h.ph) * 10 * u;
    const col = sh(h.color);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(h.dir, 1);
    ctx.rotate(Math.sin(t * 0.8 + h.ph) * 0.06);
    const pts = [[0, -0.85], [0.18, -0.62], [0.27, -0.32], [0.2, 0], [0.02, 0.22], [-0.1, 0.42], [-0.02, 0.6], [0.14, 0.6], [0.16, 0.48], [0.07, 0.44]];
    const widths = [0.3, 0.34, 0.36, 0.32, 0.24, 0.16, 0.11, 0.08, 0.06, 0.05];
    ctx.strokeStyle = col; ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (let i = 0; i < pts.length - 1; i++) {
      ctx.lineWidth = widths[i] * s;
      ctx.beginPath(); ctx.moveTo(pts[i][0] * s, pts[i][1] * s); ctx.lineTo(pts[i + 1][0] * s, pts[i + 1][1] * s); ctx.stroke();
    }
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(0.02 * s, -0.92 * s, 0.17 * s, 0.14 * s, 0.2, 0, TAU); ctx.fill();
    ctx.lineWidth = 0.08 * s;
    ctx.beginPath(); ctx.moveTo(0.12 * s, -0.9 * s); ctx.lineTo(0.42 * s, -0.84 * s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-0.05 * s, -1.02 * s); ctx.lineTo(-0.02 * s, -1.14 * s); ctx.lineTo(0.06 * s, -1.03 * s); ctx.fill();
    // the little dorsal fin flutters on its back
    const fl = 0.7 + 0.3 * Math.sin(t * 14);
    ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(0.07 * s, -0.47 * s); ctx.quadraticCurveTo(-0.16 * fl * s, -0.32 * s, 0.08 * s, -0.12 * s); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "rgba(0,0,0,0.15)"; ctx.lineWidth = Math.max(0.5, 0.015 * s);
    ctx.beginPath(); for (let i = 0; i < 4; i++) { const yy = (-0.42 + i * 0.09) * s; ctx.moveTo(0.07 * s, yy); ctx.lineTo((0.07 - 0.12 * fl) * s, yy + 0.02 * s); } ctx.stroke();
    // a lighter belly and a little crown on the head
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 0.08 * s;
    ctx.beginPath(); ctx.moveTo(0.3 * s, -0.6 * s); ctx.quadraticCurveTo(0.42 * s, -0.3 * s, 0.25 * s, -0.02 * s); ctx.stroke();
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.moveTo(-0.1 * s, -1.0 * s); ctx.lineTo(-0.12 * s, -1.12 * s); ctx.lineTo(-0.02 * s, -1.06 * s); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.2)"; ctx.lineWidth = Math.max(0.6, 0.03 * s);
    ctx.beginPath();
    for (let i = 1; i < 6; i++) { const p = pts[i]; ctx.moveTo((p[0] + 0.1) * s, p[1] * s); ctx.lineTo((p[0] + 0.18) * s, p[1] * s); }
    ctx.stroke();
    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.arc(0.06 * s, -0.95 * s, 0.035 * s, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawPuffer(p, k) {
    const threat = near(p.x, p.y, 140 * u);
    p.inflate += ((threat ? 1 : 0) - p.inflate) * (threat ? 0.12 : 0.015);
    p.x += p.vx * u * k * (1 - p.inflate * 0.8);
    p.y += Math.sin(t * 0.5 + p.ph) * 0.15 * u * k;
    p.ph += 0.01 * k;
    if (p.x < 40 * u) p.vx = Math.abs(p.vx);
    if (p.x > W - 40 * u) p.vx = -Math.abs(p.vx);
    const dir = p.vx >= 0 ? 1 : -1;
    const r = p.s * (1 + p.inflate * 0.8);
    const body = sh("#e8c66a"), dark = sh("#6b5a2a");
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(dir, 1);
    ctx.fillStyle = dark;
    ctx.save(); ctx.translate(-r * 0.95, 0); ctx.rotate(Math.sin(t * 6) * 0.3);
    ctx.beginPath(); ctx.moveTo(r * 0.1, 0); ctx.lineTo(-r * 0.45, -r * 0.35); ctx.lineTo(-r * 0.45, r * 0.35); ctx.fill();
    ctx.restore();
    if (p.inflate > 0.1) {
      ctx.strokeStyle = dark; ctx.lineWidth = Math.max(0.8, r * 0.05);
      ctx.beginPath();
      for (let i = 0; i < 22; i++) { const a = (i / 22) * TAU; ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r * 0.92); ctx.lineTo(Math.cos(a) * r * (1 + 0.22 * p.inflate), Math.sin(a) * r * 0.92 * (1 + 0.22 * p.inflate)); }
      ctx.stroke();
    }
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * (0.75 + p.inflate * 0.17), 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#f6efd8");
    ctx.beginPath(); ctx.ellipse(0, r * 0.3, r * 0.8, r * 0.4, 0, 0, Math.PI); ctx.fill();
    ctx.fillStyle = dark;
    for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(((i * 41) % 100 - 55) / 100 * r, ((i * 29) % 60 - 45) / 100 * r, r * 0.07, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.ellipse(r * 0.1, r * 0.1, r * 0.2 * (0.6 + 0.4 * Math.sin(t * 12)), r * 0.12, 0.5, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fbfbf6";
    ctx.beginPath(); ctx.arc(r * 0.5, -r * 0.2, r * 0.2, 0, TAU); ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.arc(r * 0.55, -r * 0.2, r * 0.1, 0, TAU); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, r * 0.06);
    ctx.beginPath(); ctx.arc(r * 0.88, r * 0.08, r * 0.08, 0, TAU); ctx.stroke();
    ctx.restore();
  }

  function drawAngler(a, k) {
    a.ph += 0.01 * k;
    a.x += a.dir * 0.18 * u * k;
    if (a.x < 60 * u) a.dir = 1;
    if (a.x > W - 60 * u) a.dir = -1;
    const s = a.s, y = a.y + Math.sin(a.ph) * 8 * u;
    ctx.save();
    ctx.translate(a.x, y);
    ctx.scale(a.dir, 1);
    const body = "#1b1e26";
    ctx.fillStyle = body;
    ctx.save(); ctx.translate(-s * 0.85, 0); ctx.rotate(Math.sin(t * 3) * 0.25);
    ctx.beginPath(); ctx.moveTo(s * 0.1, 0); ctx.lineTo(-s * 0.45, -s * 0.35); ctx.lineTo(-s * 0.4, s * 0.3); ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(s * 0.6, -s * 0.05);
    ctx.bezierCurveTo(s * 0.5, -s * 0.7, -s * 0.6, -s * 0.6, -s * 0.85, 0);
    ctx.bezierCurveTo(-s * 0.6, s * 0.5, s * 0.3, s * 0.6, s * 0.75, s * 0.35);
    ctx.lineTo(s * 0.6, -s * 0.05);
    ctx.fill();
    ctx.fillStyle = "#070709";
    ctx.beginPath(); ctx.moveTo(s * 0.62, -s * 0.03); ctx.lineTo(s * 0.74, s * 0.33); ctx.lineTo(s * 0.2, s * 0.15); ctx.fill();
    ctx.fillStyle = "#e9e4d2";
    for (let i = 0; i < 5; i++) {
      const tx = s * (0.25 + i * 0.1);
      ctx.beginPath(); ctx.moveTo(tx, s * (0.02 + i * 0.04)); ctx.lineTo(tx + s * 0.03, s * (0.14 + i * 0.03)); ctx.lineTo(tx + s * 0.06, s * (0.03 + i * 0.05)); ctx.fill();
      ctx.beginPath(); ctx.moveTo(tx, s * (0.2 + i * 0.03)); ctx.lineTo(tx + s * 0.03, s * (0.08 + i * 0.04)); ctx.lineTo(tx + s * 0.06, s * (0.22 + i * 0.03)); ctx.fill();
    }
    ctx.fillStyle = "#b8d8e8";
    ctx.beginPath(); ctx.arc(s * 0.25, -s * 0.22, s * 0.06, 0, TAU); ctx.fill();
    // lure
    const lx = s * 0.85 + Math.sin(t * 1.2) * s * 0.06, ly = -s * 0.75 + Math.cos(t * 1.5) * s * 0.05;
    a.lx = a.x + a.dir * lx; a.ly = y + ly;
    ctx.strokeStyle = body; ctx.lineWidth = Math.max(1, s * 0.04);
    ctx.beginPath(); ctx.moveTo(s * 0.1, -s * 0.5); ctx.quadraticCurveTo(s * 0.5, -s * 1.05, lx, ly); ctx.stroke();
    ctx.globalCompositeOperation = "lighter";
    const glow = 0.6 + 0.3 * Math.sin(t * 3);
    const gr = ctx.createRadialGradient(lx, ly, 0, lx, ly, s * 0.7);
    gr.addColorStop(0, `rgba(170,255,240,${glow})`);
    gr.addColorStop(0.15, `rgba(120,240,230,${glow * 0.5})`);
    gr.addColorStop(1, "rgba(120,240,230,0)");
    ctx.fillStyle = gr;
    ctx.fillRect(lx - s * 0.7, ly - s * 0.7, s * 1.4, s * 1.4);
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }

  // ---- big visitors ------------------------------------------------------
  const VISITOR_SPEED = { whale: 0.35, humpback: 0.6, manta: 0.7, shark: 1.1, turtle: 0.55, dolphins: 1.7, swordfish: 2.4, sub: 0.6, narwhal: 0.8, mermaid: 0.7 };
  const VISITOR_PHASE = { whale: 0.012, humpback: 0.01, manta: 0.025, shark: 0.05, swordfish: 0.06, dolphins: 0.03, sub: 0.02, narwhal: 0.03, mermaid: 0.03, turtle: 0.035 };

  function spawnVisitor() {
    const pool = scene.visitorPool;
    if (!pool.length && !scene.forceVisitor) { scene.visitorTimer = 30; return; }
    const type = scene.forceVisitor || pool[Math.floor(Math.random() * pool.length)];
    scene.forceVisitor = null;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const rnd = (a, b) => a + Math.random() * (b - a);
    const SIZE = {
      whale: () => Math.min(W * 0.45, 620 * u), humpback: () => Math.min(W * 0.95, 950 * u),
      manta: () => rnd(110, 170) * u, shark: () => rnd(150, 230) * u, turtle: () => rnd(70, 100) * u,
      dolphins: () => rnd(70, 95) * u, swordfish: () => rnd(130, 180) * u, sub: () => rnd(120, 170) * u,
      narwhal: () => rnd(110, 150) * u, mermaid: () => rnd(110, 140) * u,
    };
    const size = (SIZE[type] || MORE_SIZE[type])();
    const v = {
      type, dir, size, ph: 0, yOff: 0,
      y: H * (type === "whale" ? rnd(0.15, 0.35) : type === "humpback" ? rnd(0.3, 0.45) : rnd(0.22, 0.5)),
      speed: VISITOR_SPEED[type] * u,
    };
    if (type === "dolphins") {
      v.pod = Array.from({ length: 1 + Math.floor(Math.random() * 6) }, (_, i) => ({
        dx: -i * size * 0.8 - Math.random() * size * 0.4, dy: (Math.random() - 0.5) * 80 * u, ph: Math.random() * TAU, sc: 0.8 + Math.random() * 0.3,
      }));
    }
    v.margin = type === "dolphins" ? size * (v.pod.length + 1.5) : type === "narwhal" ? size * 1.8 : size * 1.3;
    v.x = dir > 0 ? -size * 1.3 : W + size * 1.3;
    scene.visitor = v;
    const alive = () => scene.visitor === v;
    if (type === "dolphins") {
      for (const d of v.pod) {
        if (Math.random() < shinyChance("dolphins")) {
          d.shiny = "dolphins";
          scene.shinies.push({ key: "dolphins", temp: true, r: size * d.sc * 0.3, alive, get: () => [v.x + d.dx * v.dir, v.y + d.dy + Math.sin(v.ph * 1.5 + d.ph) * 35 * u] });
        }
      }
    } else if (type !== "sub" && Math.random() < shinyChance(type)) {
      v.shiny = type;
      scene.shinies.push({ key: type, temp: true, r: size * 0.3, alive, get: () => [v.x, v.y + v.yOff] });
    }
  }

  function updateVisitor(k, dtSec) {
    const v = scene.visitor;
    if (!v) {
      scene.visitorTimer -= dtSec;
      // visitors stay away while a big moment is playing
      if (scene.visitorTimer <= 0 && (t >= busyUntil - 12 || scene.forceVisitor)) spawnVisitor();
      return;
    }
    let sp = v.speed;
    if (v.type === "swordfish") sp *= 1 + 0.8 * Math.max(0, Math.sin(v.ph * 0.8));
    v.x += v.dir * sp * k;
    v.ph += (VISITOR_PHASE[v.type] || 0.03) * k;
    v.yOff = Math.sin(v.ph * 0.7) * v.size * (v.type === "humpback" ? 0.02 : 0.04);
    if (water.surface) { const lim = waveY(v.x) + v.size * 0.18; if (v.y + v.yOff < lim) v.y = lim - v.yOff; }
    // hunters steer towards the biggest school
    if (v.type === "shark" || v.type === "swordfish" || v.type === "hammerhead" || v.type === "orca") {
      let best = null;
      for (const s of scene.species) if (!best || s.fish.length > best.fish.length) best = s;
      if (best && best.fish.length) {
        let cy = 0;
        for (const f of best.fish) cy += f.y;
        cy /= best.fish.length;
        v.y += (Math.max(H * 0.15, Math.min(H * 0.7, cy)) - v.y) * 0.006 * k;
      }
    }
    // the shark snaps up a fish now and then
    if (v.type === "shark" && frameNo % 10 === 0) {
      const mx = v.x + v.dir * v.size * 0.45, my = v.y + v.yOff;
      for (const s of scene.species) {
        if (s.lantern) continue;
        const i = s.fish.findIndex(f => Math.hypot(f.x - mx, f.y - my) < v.size * 0.12);
        if (i >= 0) { s.fish.splice(i, 1); break; }
      }
    }
    if (!v.logged && lit(v.x, v.y + v.yOff, v.size * 0.35)) { v.logged = true; seen(v.type, [v.x, v.y + v.yOff]); }
    // a shiny visitor turns round as soon as its head reaches the edge, so it stays in view
    // (a pod of dolphins turns just out of view, so the pod does not jump)
    if (v.shiny && !v.pod && ((v.dir > 0 && v.x > W - v.size * 0.35) || (v.dir < 0 && v.x < v.size * 0.35))) v.dir *= -1;
    else if ((v.dir > 0 && v.x > W + v.margin) || (v.dir < 0 && v.x < -v.margin)) {
      if (v.pod && v.pod.some(d => d.shiny)) { v.dir *= -1; v.ringsLeft = undefined; }
      else { scene.visitor = null; scene.visitorTimer = 8 + Math.random() * 14; }
    }
  }

  function drawWhale(v) {
    const L = v.size;
    ctx.save();
    ctx.translate(v.x, v.y + v.yOff);
    ctx.scale(v.dir, 1);
    ctx.rotate(Math.sin(v.ph) * 0.02);
    ctx.fillStyle = `rgba(${water.whale},0.5)`;
    ctx.beginPath();
    ctx.moveTo(L * 0.5, 0);
    ctx.bezierCurveTo(L * 0.47, -L * 0.11, L * 0.1, -L * 0.15, -L * 0.3, -L * 0.06);
    ctx.quadraticCurveTo(-L * 0.45, -L * 0.02, -L * 0.55, 0);
    ctx.quadraticCurveTo(-L * 0.42, L * 0.035, -L * 0.15, L * 0.075);
    ctx.bezierCurveTo(L * 0.15, L * 0.12, L * 0.46, L * 0.09, L * 0.5, 0);
    ctx.fill();
    ctx.save();
    ctx.translate(-L * 0.53, 0);
    ctx.rotate(Math.sin(v.ph * 2) * 0.18);
    ctx.beginPath();
    ctx.moveTo(L * 0.02, 0);
    ctx.quadraticCurveTo(-L * 0.06, -L * 0.04, -L * 0.13, -L * 0.1);
    ctx.quadraticCurveTo(-L * 0.09, -L * 0.01, -L * 0.1, 0);
    ctx.quadraticCurveTo(-L * 0.09, L * 0.01, -L * 0.13, L * 0.1);
    ctx.quadraticCurveTo(-L * 0.06, L * 0.04, L * 0.02, 0);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(L * 0.18, L * 0.07);
    ctx.rotate(0.5 + Math.sin(v.ph * 1.5) * 0.12);
    ctx.beginPath();
    ctx.ellipse(-L * 0.1, 0, L * 0.14, L * 0.025, 0, 0, TAU);
    ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  function drawTurtle(v) {
    const L = v.size;
    ctx.save();
    ctx.translate(v.x, v.y + v.yOff);
    ctx.scale(v.dir, 1);
    ctx.rotate(Math.sin(v.ph * 0.5) * 0.05 - 0.04);
    const skin = sh("#7d8a6a"), shell = sh("#5f4e32"), line = sh("#3b301f");
    ctx.fillStyle = skin;
    ctx.save();
    ctx.translate(-L * 0.3, L * 0.08);
    ctx.rotate(0.5 + Math.sin(v.ph + 1) * 0.3);
    ctx.beginPath(); ctx.ellipse(-L * 0.1, 0, L * 0.16, L * 0.06, 0, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(L * 0.18, L * 0.08);
    ctx.rotate(0.7 + Math.sin(v.ph) * 0.6);
    ctx.beginPath(); ctx.ellipse(-L * 0.25, 0, L * 0.3, L * 0.07, 0, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.ellipse(L * 0.55, -L * 0.02, L * 0.14, L * 0.09, -0.1, 0, TAU); ctx.fill();
    ctx.fillStyle = "#1c1a14";
    ctx.beginPath(); ctx.arc(L * 0.6, -L * 0.05, L * 0.018, 0, TAU); ctx.fill();
    ctx.fillStyle = shell;
    ctx.beginPath();
    ctx.moveTo(-L * 0.45, L * 0.06);
    ctx.bezierCurveTo(-L * 0.4, -L * 0.3, L * 0.38, -L * 0.3, L * 0.45, L * 0.04);
    ctx.quadraticCurveTo(0, L * 0.14, -L * 0.45, L * 0.06);
    ctx.fill();
    ctx.strokeStyle = line;
    ctx.lineWidth = Math.max(1, L * 0.015);
    ctx.beginPath();
    for (let i = -2; i <= 2; i++) {
      ctx.moveTo(i * L * 0.15, -L * 0.2 + Math.abs(i) * L * 0.04);
      ctx.lineTo(i * L * 0.17, L * 0.08);
    }
    ctx.moveTo(-L * 0.38, -L * 0.06);
    ctx.quadraticCurveTo(0, -L * 0.14, L * 0.38, -L * 0.06);
    ctx.stroke();
    ctx.restore();
  }

  function drawManta(v) {
    const L = v.size;
    const flap = 0.82 + 0.18 * Math.sin(v.ph * 2);
    ctx.save();
    ctx.translate(v.x, v.y + v.yOff);
    ctx.scale(v.dir, 1);
    ctx.fillStyle = "rgba(18,26,34,0.88)";
    ctx.beginPath();
    ctx.moveTo(L * 0.3, -L * 0.07);
    ctx.quadraticCurveTo(L * 0.12, -L * 0.42 * flap, -L * 0.06, -L * 0.62 * flap);
    ctx.quadraticCurveTo(-L * 0.12, -L * 0.24, -L * 0.3, -L * 0.06);
    ctx.lineTo(-L * 0.3, L * 0.06);
    ctx.quadraticCurveTo(-L * 0.12, L * 0.24, -L * 0.06, L * 0.62 * flap);
    ctx.quadraticCurveTo(L * 0.12, L * 0.42 * flap, L * 0.3, L * 0.07);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(L * 0.33, -L * 0.06, L * 0.07, L * 0.025, 0.3, 0, TAU);
    ctx.ellipse(L * 0.33, L * 0.06, L * 0.07, L * 0.025, -0.3, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(18,26,34,0.88)";
    ctx.lineWidth = Math.max(1, L * 0.012);
    ctx.beginPath();
    ctx.moveTo(-L * 0.3, 0);
    ctx.quadraticCurveTo(-L * 0.55, Math.sin(v.ph * 2) * L * 0.05, -L * 0.85, 0);
    ctx.stroke();
    ctx.fillStyle = "rgba(220,230,235,0.25)";
    ctx.beginPath();
    ctx.ellipse(L * 0.05, -L * 0.12, L * 0.06, L * 0.035, 0.4, 0, TAU);
    ctx.ellipse(L * 0.05, L * 0.12, L * 0.06, L * 0.035, -0.4, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawShark(v) {
    const L = v.size;
    const body = sh("#56646f"), belly = sh("#b9c3c7");
    ctx.save();
    ctx.translate(v.x, v.y + v.yOff);
    ctx.scale(v.dir, 1);
    ctx.rotate(Math.sin(v.ph) * 0.03);
    ctx.fillStyle = body;
    ctx.save();
    ctx.translate(-L * 0.47, 0);
    ctx.rotate(Math.sin(v.ph * 2) * 0.22);
    ctx.beginPath();
    ctx.moveTo(L * 0.03, 0);
    ctx.quadraticCurveTo(-L * 0.08, -L * 0.14, -L * 0.17, -L * 0.25);
    ctx.quadraticCurveTo(-L * 0.11, -L * 0.08, -L * 0.1, 0);
    ctx.quadraticCurveTo(-L * 0.1, L * 0.06, -L * 0.13, L * 0.13);
    ctx.quadraticCurveTo(-L * 0.05, L * 0.05, L * 0.03, 0);
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(L * 0.02, -L * 0.1);
    ctx.quadraticCurveTo(L * 0.01, -L * 0.24, -L * 0.12, -L * 0.27);
    ctx.quadraticCurveTo(-L * 0.07, -L * 0.15, -L * 0.13, -L * 0.08);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-L * 0.3, -L * 0.05); ctx.lineTo(-L * 0.36, -L * 0.1); ctx.lineTo(-L * 0.36, -L * 0.04); ctx.fill();
    const hull = new Path2D();
    hull.moveTo(L * 0.5, L * 0.02);
    hull.bezierCurveTo(L * 0.42, -L * 0.1, L * 0.1, -L * 0.12, -L * 0.3, -L * 0.05);
    hull.quadraticCurveTo(-L * 0.42, -L * 0.02, -L * 0.5, 0);
    hull.quadraticCurveTo(-L * 0.4, L * 0.05, -L * 0.1, L * 0.09);
    hull.bezierCurveTo(L * 0.2, L * 0.1, L * 0.45, L * 0.08, L * 0.5, L * 0.02);
    ctx.fill(hull);
    ctx.save();
    ctx.clip(hull);
    ctx.fillStyle = belly;
    ctx.beginPath(); ctx.ellipse(L * 0.05, L * 0.1, L * 0.5, L * 0.07, 0.02, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(L * 0.18, L * 0.06);
    ctx.quadraticCurveTo(L * 0.08, L * 0.18, -L * 0.03, L * 0.23);
    ctx.quadraticCurveTo(L * 0.06, L * 0.1, L * 0.05, L * 0.06);
    ctx.fill();
    ctx.strokeStyle = sh("#36414a"); ctx.lineWidth = Math.max(1, L * 0.006);
    ctx.beginPath();
    for (let i = 0; i < 4; i++) { ctx.moveTo(L * (0.27 - i * 0.025), -L * 0.04); ctx.quadraticCurveTo(L * (0.25 - i * 0.025), 0, L * (0.27 - i * 0.025), L * 0.04); }
    ctx.stroke();
    ctx.fillStyle = "#0c0f12";
    ctx.beginPath(); ctx.arc(L * 0.38, -L * 0.02, L * 0.012, 0, TAU); ctx.fill();
    ctx.restore();
  }


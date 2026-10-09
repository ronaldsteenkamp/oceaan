  // ---- bubbles -----------------------------------------------------------
  function updateAndDrawBubbles(k) {
    if (Math.random() < 0.03 * k && bubbles.length < 50) {
      const sources = scene.ground.filter(g => g.kind === "chest" || g.kind === "wreck" || g.kind === "vent");
      let x;
      if (sources.length && Math.random() < 0.5) {
        const g = sources[Math.floor(Math.random() * sources.length)];
        x = g.x + (g.kind === "wreck" ? g.dir * 0.13 * g.w : 0);
      } else {
        const kp = scene.kelpBack[Math.floor(Math.random() * scene.kelpBack.length)];
        x = kp ? kp.x : Math.random() * W;
      }
      const n = 1 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) bubbles.push({ x: x + (Math.random() - 0.5) * 10 * u, y: sandY(x) - 10 * u - i * 8 * u, r: (1 + Math.random() * 3) * u, ph: Math.random() * TAU });
    }
    ctx.strokeStyle = "rgba(235,250,255,0.55)";
    ctx.lineWidth = Math.max(0.6, 0.8 * u);
    bubbles = bubbles.filter(b => {
      b.y -= (0.5 + b.r * 0.25) * k;
      b.x += Math.sin(t * 3 + b.ph) * 0.3 * k + current * 0.8 * k;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, TAU);
      ctx.stroke();
      return b.y > (water.surface ? waveY(b.x) + 2 * u : -10); // bubbles pop at the surface
    });
  }

  function aqWater(aq) {
    const w = Object.assign({}, WATERS[aq.water], { props: {}, life: {} });
    for (const k of PROP_KEYS) w.props[k] = aq.set.has(k) ? 1 : 0;
    for (const k of LIFE_KEYS) w.life[k] = aq.set.has(k) ? 1 : 0;
    w.visitors = VIS_KEYS.filter(k => aq.set.has(k));
    return w;
  }
  function makeCity(m = 1) {
    const s = range(26, 34) * u * m, w = Math.min(W * 0.65, 340 * u * m), houses = [];
    let x = s * 1.6;
    while (x < w - s * 2.4) {
      const hw = range(1.4, 2.2) * s;
      houses.push({ dx: x, w: hw, h: range(1.4, 2.6) * s, tilt: range(-0.08, 0.08) });
      x += hw + range(0.3, 0.8) * s;
    }
    return { kind: "city", w, s, houses };
  }
  function presentLife(S) {
    return Object.assign({
      crab: S.crabs.length, starfish: S.starfish.length, urchin: S.urchins.length, octopus: !!S.octopus, ray: !!S.ray,
      eels: S.ground.some(g => g.kind === "eels"), seahorse: S.seahorses.length, puffer: !!S.puffer, angler: !!S.angler,
      moray: !!(S.wreck && S.wreck.moray), squid: S.squids.length, hermit: S.hermits.length, slugs: S.slugs.length,
      comb: S.combs.length, lantern: S.species.some(x => x.lantern), otters: S.otters.length, seal: !!S.seal, penguins: S.penguins.length,
      mantis: !!S.mantis, archer: !!S.archer, cleaners: !!S.station,
      cassiopea: S.cassio.length, lionfish: !!S.lionfish, cuttlefish: !!S.cuttle, lobster: S.lobsters.length, nautilus: !!S.nautilus,
      isopod: S.isopods.length, seadragon: !!S.dragon,
      parrotfish: !!S.parrot, boxfish: !!S.boxfish, pistol: !!S.pistol, sargassumfish: !!S.frogfish, spidercrab: !!S.spider,
    }, faunaPresent(S));
  }

  // Where each kind of animal can be seen, so the diver's lamp can find it.
  function lifePoints(S) {
    const fy = x => sandY(x) + 2 * u, one = o => o ? [o] : null;
    return Object.assign({
      crab: () => S.crabs.map(c => [c.x, fy(c.x) - c.s * 0.4]), starfish: () => S.starfish.map(f => [f.x, fy(f.x)]),
      urchin: () => S.urchins.map(o => [o.x, fy(o.x)]), octopus: () => S.octopus && [S.octopus.x, fy(S.octopus.x) - 20 * u],
      ray: () => S.ray && [S.ray.x, fy(S.ray.x) - S.ray.lift], eels: () => S.ground.filter(g => g.kind === "eels").map(g => [g.x, fy(g.x) - 30 * u]),
      seahorse: () => S.seahorses.map(h => [h.x, fy(h.x) - h.lift]), puffer: () => S.puffer && [S.puffer.x, S.puffer.y],
      angler: () => S.angler && [S.angler.x, S.angler.y], moray: () => S.wreck && [S.wreck.x, fy(S.wreck.x) - 40 * u],
      squid: () => S.squids.map(q => [q.x, q.y]), hermit: () => S.hermits.map(h => [h.x, fy(h.x)]), slugs: () => S.slugs.map(o => [o.x, fy(o.x)]),
      comb: () => S.combs.map(c => [c.x, c.y]), lantern: () => S.species.filter(sp => sp.lantern).flatMap(sp => sp.fish.map(f => [f.x, f.y])),
      otters: () => S.otters.map(o => [o.x, waveY(o.x)]), seal: () => S.seal && [S.seal.x, S.seal.y !== undefined ? S.seal.y : S.seal.y0],
      penguins: () => S.penguins.map(p => [p.x, waveY(p.x) + p.depth * 0.5]), mantis: () => S.mantis && [S.mantis.x, fy(S.mantis.x) - 10 * u],
      archer: () => S.archer && [S.archer.x, waveY(S.archer.x) + 28 * u], cleaners: () => S.station && [S.station.x, fy(S.station.x) - 55 * u],
      cassiopea: () => S.cassio.map(c => [c.x, fy(c.x)]), lionfish: () => S.lionfish && [S.lionfish.x, S.lionfish.cy || S.lionfish.y],
      cuttlefish: () => S.cuttle && [S.cuttle.x, S.cuttle.cy || S.cuttle.y], lobster: () => S.lobsters.map(l => [l.x, fy(l.x)]),
      nautilus: () => S.nautilus && [S.nautilus.x, S.nautilus.cy || S.nautilus.y], isopod: () => S.isopods.map(o => [o.x, fy(o.x)]),
      seadragon: () => S.dragon && [S.dragon.x, S.dragon.cy || S.dragon.y], parrotfish: () => S.parrot && [S.parrot.x, S.parrot.cy || fy(S.parrot.x) - 40 * u],
      boxfish: () => S.boxfish && [S.boxfish.x, S.boxfish.cy || S.boxfish.y], pistol: () => S.pistol && [S.pistol.x, fy(S.pistol.x)],
      sargassumfish: () => S.frogfish && S.frogfish.cx !== undefined && [S.frogfish.cx, S.frogfish.cy], spidercrab: () => S.spider && [S.spider.x, fy(S.spider.x) - 20 * u],
    }, faunaPoints(S));
  }

  // ---- more landmarks ----------------------------------------------------
  function drawPlane(g) {
    const L = g.w, y0 = sandY(g.x) + L * 0.05;
    const metal = sh("#6e7867"), dark = sh("#30362f"), light = sh("#8d977f");
    ctx.save();
    ctx.translate(g.x, y0);
    ctx.scale(g.dir, 1);
    ctx.rotate(g.tilt);
    // far wing, sinking into the sand
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.moveTo(0.16 * L, -0.07 * L); ctx.lineTo(0.02 * L, -0.07 * L); ctx.lineTo(-0.1 * L, 0.06 * L); ctx.lineTo(0.12 * L, 0.06 * L);
    ctx.fill();
    // tail fin and stabiliser
    ctx.fillStyle = metal;
    ctx.beginPath();
    ctx.moveTo(-0.36 * L, -0.14 * L); ctx.lineTo(-0.43 * L, -0.29 * L); ctx.lineTo(-0.49 * L, -0.28 * L); ctx.lineTo(-0.48 * L, -0.12 * L);
    ctx.fill();
    ctx.beginPath(); ctx.ellipse(-0.42 * L, -0.11 * L, 0.08 * L, 0.014 * L, 0.1, 0, TAU); ctx.fill();
    // fuselage with panel lines and rivets
    const body = new Path2D();
    body.moveTo(0.4 * L, -0.175 * L);
    body.lineTo(-0.28 * L, -0.15 * L);
    body.quadraticCurveTo(-0.44 * L, -0.15 * L, -0.49 * L, -0.125 * L);
    body.lineTo(-0.46 * L, -0.09 * L);
    body.lineTo(-0.28 * L, -0.055 * L);
    body.lineTo(0.4 * L, -0.025 * L);
    body.closePath();
    ctx.fillStyle = metal;
    ctx.fill(body);
    ctx.save();
    ctx.clip(body);
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(-0.6 * L, -0.08 * L, 1.2 * L, 0.08 * L);
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, L * 0.003);
    ctx.beginPath();
    for (const px of [-0.3, -0.15, 0.0, 0.2, 0.32]) { ctx.moveTo(px * L, -0.2 * L); ctx.lineTo(px * L + 0.005 * L, 0); }
    ctx.stroke();
    ctx.fillStyle = light;
    for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.arc((-0.42 + (i % 15) * 0.055) * L, (i < 15 ? -0.135 : -0.06) * L, L * 0.0025, 0, TAU); ctx.fill(); }
    ctx.restore();
    // faded marking
    ctx.fillStyle = "rgba(225,222,205,0.45)";
    ctx.beginPath(); ctx.arc(-0.17 * L, -0.105 * L, 0.03 * L, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#5a6a8a", 0.1);
    ctx.beginPath(); ctx.arc(-0.17 * L, -0.105 * L, 0.018 * L, 0, TAU); ctx.fill();
    // cockpit
    ctx.fillStyle = "rgba(170,210,225,0.3)";
    ctx.beginPath(); ctx.ellipse(0.1 * L, -0.165 * L, 0.09 * L, 0.05 * L, 0, Math.PI, TAU); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, L * 0.004);
    ctx.beginPath();
    ctx.ellipse(0.1 * L, -0.165 * L, 0.09 * L, 0.05 * L, 0, Math.PI, TAU);
    ctx.moveTo(0.07 * L, -0.213 * L); ctx.lineTo(0.06 * L, -0.165 * L);
    ctx.moveTo(0.13 * L, -0.211 * L); ctx.lineTo(0.14 * L, -0.165 * L);
    ctx.stroke();
    // engine and bent propeller
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.roundRect(0.38 * L, -0.19 * L, 0.07 * L, 0.18 * L, 0.02 * L); ctx.fill();
    ctx.strokeStyle = sh("#4a4a44"); ctx.lineCap = "round"; ctx.lineWidth = 0.018 * L;
    const hx = 0.47 * L, hy = -0.1 * L;
    ctx.beginPath();
    ctx.moveTo(hx, hy); ctx.quadraticCurveTo(hx + 0.01 * L, hy - 0.08 * L, hx + 0.05 * L, hy - 0.13 * L);
    ctx.moveTo(hx, hy); ctx.quadraticCurveTo(hx + 0.03 * L, hy + 0.05 * L, hx + 0.09 * L, hy + 0.06 * L);
    ctx.moveTo(hx, hy); ctx.lineTo(hx - 0.01 * L, hy + 0.12 * L);
    ctx.stroke();
    ctx.fillStyle = sh("#3a3a35");
    ctx.beginPath(); ctx.arc(hx, hy, 0.022 * L, 0, TAU); ctx.fill();
    // near wing, torn off at the end
    ctx.fillStyle = metal;
    ctx.beginPath();
    ctx.moveTo(0.2 * L, -0.06 * L); ctx.lineTo(-0.02 * L, -0.055 * L); ctx.lineTo(-0.06 * L, -0.01 * L);
    ctx.lineTo(0.02 * L, 0.0); ctx.lineTo(0.05 * L, -0.02 * L); ctx.lineTo(0.09 * L, 0.005 * L); ctx.lineTo(0.22 * L, -0.02 * L);
    ctx.fill();
    // growth on the fuselage
    ctx.fillStyle = sh(water.name === "rif" ? "#f2a2c0" : "#5f8a55", 0.1);
    for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.arc((-0.3 + i * 0.08) * L, (-0.155 + (i % 3) * 0.004) * L, L * (0.006 + (i % 3) * 0.003), 0, TAU); ctx.fill(); }
    ctx.restore();
    // the broken wing tip lies a little way off
    const wx = g.x - g.dir * L * 0.55, wy = sandY(wx) + 4 * u;
    ctx.save();
    ctx.translate(wx, wy);
    ctx.rotate(-0.25 * g.dir);
    ctx.fillStyle = metal;
    ctx.beginPath(); ctx.moveTo(-0.08 * L, 0); ctx.lineTo(0.06 * L, -0.03 * L); ctx.lineTo(0.09 * L, 0.0); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawHelmet(g) {
    const s = g.s, x = g.x, y = sandY(x) + 6 * u;
    const copper = sh("#b8733a"), dark = sh("#6b3f1e"), brass = sh("#c9a24a"), patina = sh("#5a9a85");
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.moveTo(x - s * 1.25, y); ctx.quadraticCurveTo(x - s * 1.1, y - s * 0.55, x - s * 0.6, y - s * 0.6);
    ctx.lineTo(x + s * 0.6, y - s * 0.6); ctx.quadraticCurveTo(x + s * 1.1, y - s * 0.55, x + s * 1.25, y);
    ctx.fill();
    ctx.fillStyle = brass;
    for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(x + (i - 3) * s * 0.3, y - s * 0.32 - Math.cos((i - 3) / 3) * s * 0.08, s * 0.05, 0, TAU); ctx.fill(); }
    ctx.fillStyle = copper;
    ctx.beginPath(); ctx.arc(x, y - s * 1.25, s, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,230,190,0.18)";
    ctx.beginPath(); ctx.ellipse(x - s * 0.35, y - s * 1.65, s * 0.35, s * 0.2, -0.5, 0, TAU); ctx.fill();
    ctx.fillStyle = patina;
    for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(x + Math.cos(i * 2.1) * s * 0.75, y - s * 1.25 + Math.sin(i * 2.1) * s * 0.7, s * (0.08 + (i % 3) * 0.04), 0, TAU); ctx.fill(); }
    ctx.fillStyle = brass;
    ctx.fillRect(x - s * 0.1, y - s * 2.4, s * 0.2, s * 0.2);
    for (const side of [-1, 1]) {
      ctx.fillStyle = brass;
      ctx.beginPath(); ctx.arc(x + side * s * 0.78, y - s * 1.2, s * 0.24, 0, TAU); ctx.fill();
      ctx.fillStyle = "#0e1418";
      ctx.beginPath(); ctx.arc(x + side * s * 0.78, y - s * 1.2, s * 0.16, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = brass;
    ctx.beginPath(); ctx.arc(x, y - s * 1.2, s * 0.52, 0, TAU); ctx.fill();
    ctx.fillStyle = "#0b1114";
    ctx.beginPath(); ctx.arc(x, y - s * 1.2, s * 0.42, 0, TAU); ctx.fill();
    // a crab lives inside and ducks when you come close
    if (g.crab) {
      const target = near(x, y - s, 110 * u) ? 0 : 1;
      g.e += (target - g.e) * (target < g.e ? 0.2 : 0.02);
      if (g.e > 0.05) {
        const cy = y - s * 0.95 - g.e * s * 0.25;
        ctx.strokeStyle = sh("#d9543b"); ctx.lineWidth = Math.max(1, s * 0.06);
        ctx.beginPath(); ctx.moveTo(x - s * 0.1, y - s * 0.85); ctx.lineTo(x - s * 0.12, cy); ctx.moveTo(x + s * 0.1, y - s * 0.85); ctx.lineTo(x + s * 0.12, cy); ctx.stroke();
        ctx.fillStyle = "#111";
        ctx.beginPath(); ctx.arc(x - s * 0.12, cy, s * 0.06, 0, TAU); ctx.arc(x + s * 0.12, cy, s * 0.06, 0, TAU); ctx.fill();
        ctx.fillStyle = sh("#d9543b");
        ctx.beginPath(); ctx.ellipse(x + s * 0.25, y - s * 0.92 - g.e * s * 0.1, s * 0.12 * g.e, s * 0.08 * g.e, 0.5, 0, TAU); ctx.fill();
      }
    }
    ctx.strokeStyle = brass; ctx.lineWidth = Math.max(1, s * 0.04);
    ctx.beginPath();
    for (let i = -1; i <= 1; i++) { ctx.moveTo(x + i * s * 0.18, y - s * 1.58); ctx.lineTo(x + i * s * 0.18, y - s * 0.82); }
    ctx.stroke();
  }

  function drawMine(g) {
    const s = g.s, bx = g.x, by = sandY(bx) + 6 * u;
    const mx = bx + Math.sin(t * 0.5 + g.ph) * 6 * u + current * 8 * u, my = by - g.h + Math.sin(t * 0.8 + g.ph) * 4 * u;
    ctx.fillStyle = sh("#2e2a28");
    ctx.fillRect(bx - s * 0.6, by - s * 0.5, s * 1.2, s * 0.5);
    ctx.strokeStyle = sh("#4a403a"); ctx.lineWidth = Math.max(1, s * 0.08);
    const links = Math.max(4, Math.round(g.h / (s * 0.35)));
    for (let i = 0; i < links; i++) {
      const f = i / links;
      ctx.beginPath();
      ctx.ellipse(bx + (mx - bx) * f, by - s * 0.5 + (my + s - by + s * 0.5) * f, s * 0.08, s * 0.16, 0, 0, TAU);
      ctx.stroke();
    }
    const rust = sh("#5a3e30"), hi = sh("#7a5a44");
    ctx.strokeStyle = rust; ctx.lineWidth = s * 0.12; ctx.lineCap = "round";
    ctx.fillStyle = rust;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + 0.2;
      ctx.beginPath(); ctx.moveTo(mx + Math.cos(a) * s * 0.9, my + Math.sin(a) * s * 0.9); ctx.lineTo(mx + Math.cos(a) * s * 1.35, my + Math.sin(a) * s * 1.35); ctx.stroke();
      ctx.beginPath(); ctx.arc(mx + Math.cos(a) * s * 1.38, my + Math.sin(a) * s * 1.38, s * 0.12, 0, TAU); ctx.fill();
    }
    ctx.beginPath(); ctx.arc(mx, my, s, 0, TAU); ctx.fill();
    ctx.fillStyle = hi;
    ctx.fillRect(mx - s, my - s * 0.06, s * 2, s * 0.12);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath(); ctx.arc(mx - s * 0.35, my - s * 0.35, s * 0.35, 0, TAU); ctx.fill();
  }

  function drawStatue(g) {
    const s = g.s, x = g.x, y = sandY(x) + 6 * u;
    const stone = sh("#a8a493"), shade = sh("#6f6c5f"), moss = sh("#4f7a45", 0.05), gold = sh("#c9a24a", 0.1);
    // a temple gate on three steps
    const gx = x + g.dir * s * 0.7;
    ctx.fillStyle = shade;
    for (let i = 0; i < 3; i++) ctx.fillRect(gx - s * (1.0 - i * 0.12), y - s * 0.12 * (i + 1), s * (2.0 - i * 0.24), s * 0.12);
    for (const side of [-1, 1]) {
      ctx.fillStyle = stone;
      ctx.fillRect(gx + side * s * 0.6 - s * 0.13, y - s * 1.95, s * 0.26, s * 1.6);
      ctx.strokeStyle = shade; ctx.lineWidth = Math.max(1, s * 0.015);
      ctx.beginPath(); ctx.moveTo(gx + side * s * 0.6, y - s * 1.9); ctx.lineTo(gx + side * s * 0.6, y - s * 0.4); ctx.stroke();
    }
    ctx.fillStyle = stone;
    ctx.fillRect(gx - s * 0.85, y - s * 2.1, s * 1.7, s * 0.18);
    ctx.beginPath();
    ctx.moveTo(gx - s * 0.85, y - s * 2.1); ctx.lineTo(gx - s * 0.1, y - s * 2.55); ctx.lineTo(gx, y - s * 2.42);
    ctx.lineTo(gx + s * 0.12, y - s * 2.5); ctx.lineTo(gx + s * 0.85, y - s * 2.1);
    ctx.fill();
    ctx.fillStyle = gold;
    ctx.beginPath(); ctx.arc(gx, y - s * 2.24, s * 0.08, 0, TAU); ctx.fill();
    const tiles = ["#2f6fb0", "#d9a441", "#b45a3c", "#e8e2d0"];
    for (let i = 0; i < 12; i++) { ctx.fillStyle = sh(tiles[i % 4], 0.1); ctx.fillRect(gx - s * 0.72 + i * s * 0.12, y - s * 0.36, s * 0.1, s * 0.1); }
    // a fallen stone head, half sunk in the sand
    ctx.save();
    ctx.translate(x - g.dir * s * 0.55, y + s * 0.1);
    ctx.scale(g.dir, 1);
    ctx.rotate(-0.2);
    ctx.fillStyle = stone;
    ctx.beginPath();
    ctx.moveTo(-s * 0.6, 0);
    ctx.bezierCurveTo(-s * 0.7, -s * 1.1, s * 0.1, -s * 1.5, s * 0.45, -s * 1.0);
    ctx.lineTo(s * 0.5, -s * 0.78); ctx.lineTo(s * 0.68, -s * 0.55); ctx.lineTo(s * 0.5, -s * 0.48);
    ctx.lineTo(s * 0.55, -s * 0.36); ctx.lineTo(s * 0.48, -s * 0.3); ctx.lineTo(s * 0.52, -s * 0.2);
    ctx.quadraticCurveTo(s * 0.4, 0, s * 0.2, s * 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = shade;
    for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(-s * 0.45 + i * s * 0.13, -s * 1.12 - Math.sin(i / 6 * Math.PI) * s * 0.18, s * 0.11, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = shade; ctx.lineWidth = Math.max(1, s * 0.03); ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(s * 0.18, -s * 0.72); ctx.quadraticCurveTo(s * 0.3, -s * 0.66, s * 0.4, -s * 0.72);
    ctx.moveTo(s * 0.25, -s * 0.85); ctx.quadraticCurveTo(s * 0.33, -s * 0.9, s * 0.43, -s * 0.86);
    ctx.moveTo(-s * 0.1, -s * 0.6); ctx.quadraticCurveTo(-s * 0.2, -s * 0.4, -s * 0.05, -s * 0.3);
    ctx.moveTo(-s * 0.3, -s * 0.9); ctx.lineTo(-s * 0.15, -s * 0.55); ctx.lineTo(-s * 0.22, -s * 0.3);
    ctx.stroke();
    ctx.fillStyle = moss;
    for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.arc(-s * 0.5 + ((i * 37) % 90) / 100 * s, -s * 0.2 - ((i * 23) % 60) / 100 * s, s * 0.05, 0, TAU); ctx.fill(); }
    ctx.restore();
  }

  function drawArch(g) {
    const s = g.s, x = g.x, y = sandY(x) + 8 * u;
    const rock = sh(water.name === "rif" ? "#7a7262" : "#5c625a", 0.05);
    const p = new Path2D();
    p.moveTo(x - s * 1.4, y);
    p.bezierCurveTo(x - s * 1.5, y - s * 1.2, x - s * 1.0, y - s * 1.9, x - s * 0.2, y - s * 1.85);
    p.bezierCurveTo(x + s * 0.6, y - s * 2.0, x + s * 1.3, y - s * 1.4, x + s * 1.35, y);
    p.closePath();
    p.moveTo(x - s * 0.75, y + 2);
    p.bezierCurveTo(x - s * 0.8, y - s * 1.2, x + s * 0.5, y - s * 1.25, x + s * 0.55, y + 2);
    p.closePath();
    ctx.fillStyle = rock;
    ctx.fill(p, "evenodd");
    ctx.save();
    ctx.clip(p, "evenodd");
    ctx.strokeStyle = "rgba(0,0,0,0.18)"; ctx.lineWidth = Math.max(1, s * 0.03);
    ctx.beginPath();
    for (let i = 1; i < 6; i++) { ctx.moveTo(x - s * 1.6, y - s * 0.32 * i); ctx.quadraticCurveTo(x, y - s * 0.32 * i - s * 0.12, x + s * 1.6, y - s * 0.32 * i + s * 0.05); }
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.beginPath(); ctx.ellipse(x - s * 0.5, y - s * 1.65, s * 0.6, s * 0.15, -0.1, 0, TAU); ctx.fill();
    ctx.restore();
    // a dark cave on the side; something may be watching from it
    const cx = x + s * 0.95, cy = y - s * 0.45;
    ctx.fillStyle = "#06090c";
    ctx.beginPath(); ctx.ellipse(cx, cy, s * 0.2, s * 0.28, 0.1, 0, TAU); ctx.fill();
    g.eyeX = cx; g.eyeY = cy - s * 0.04;
    const tufts = water.name === "rif" ? ["#ff7f6b", "#c77dff", "#ffb347"] : water.kelp;
    ctx.lineCap = "round";
    for (let i = 0; i < 5; i++) {
      const tx = x - s * 0.6 + i * s * 0.3, ty = y - s * 1.82;
      ctx.strokeStyle = sh(tufts[i % tufts.length]); ctx.lineWidth = Math.max(1.5, s * 0.05);
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.sin(t + i) * s * 0.08, ty - s * 0.15, tx + Math.sin(t * 0.8 + i) * s * 0.12, ty - s * 0.28); ctx.stroke();
    }
  }

  Object.assign(GROUND_DRAW, { plane: drawPlane, helmet: drawHelmet, mine: drawMine, statue: drawStatue, arch: drawArch });

  // ---- more creatures ----------------------------------------------------
  function drawSlug(o, k) {
    o.ph += 0.03 * k;
    const step = Math.max(0, Math.sin(o.ph));
    o.x += o.dir * step * 0.06 * u * k;
    if (o.x < scene.floorL + 10) o.dir = 1;
    if (o.x > scene.floorR - 10) o.dir = -1;
    const s = o.s, x = o.x, y = sandY(x) + 5 * u;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(o.dir, 1);
    if (o.type === "cucumber") {
      const len = s * (1.6 + step * 0.3);
      ctx.fillStyle = sh(o.color);
      ctx.beginPath(); ctx.ellipse(0, -s * 0.3, len * 0.5, s * 0.32 * (1 - step * 0.1), 0, 0, TAU); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.arc(-len * 0.4 + i * len * 0.13, -s * 0.5, s * 0.06, 0, TAU); ctx.fill(); }
      ctx.strokeStyle = sh("#e8d8b0"); ctx.lineWidth = Math.max(1, s * 0.05);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) { const a = -0.6 + i * 0.3; ctx.moveTo(len * 0.48, -s * 0.3); ctx.lineTo(len * 0.48 + Math.cos(a) * s * 0.25, -s * 0.3 + Math.sin(a) * s * 0.25); }
      ctx.stroke();
    } else {
      ctx.fillStyle = sh(o.body);
      ctx.beginPath(); ctx.ellipse(0, -s * 0.2, s * 0.8, s * 0.2, 0, 0, TAU); ctx.fill();
      ctx.lineCap = "round";
      for (let i = 0; i < 9; i++) {
        const cx = -s * 0.6 + i * s * 0.15, sway = Math.sin(t * 2 + i) * s * 0.05;
        ctx.strokeStyle = sh(o.body); ctx.lineWidth = Math.max(1.5, s * 0.1);
        ctx.beginPath(); ctx.moveTo(cx, -s * 0.3); ctx.lineTo(cx + sway, -s * 0.62); ctx.stroke();
        ctx.fillStyle = sh(o.tip);
        ctx.beginPath(); ctx.arc(cx + sway, -s * 0.64, s * 0.07, 0, TAU); ctx.fill();
      }
      ctx.strokeStyle = sh(o.tip); ctx.lineWidth = Math.max(1, s * 0.06);
      ctx.beginPath(); ctx.moveTo(s * 0.65, -s * 0.3); ctx.lineTo(s * 0.75, -s * 0.6); ctx.moveTo(s * 0.55, -s * 0.3); ctx.lineTo(s * 0.6, -s * 0.6); ctx.stroke();
    }
    ctx.restore();
  }

  function drawHermit(h, k) {
    const s = h.s;
    const threat = near(h.x, sandY(h.x) - s, 90 * u);
    h.hide += ((threat ? 1 : 0) - h.hide) * (threat ? 0.25 : 0.02);
    if (h.hide < 0.3) { h.x += h.dir * 0.15 * u * k; h.leg += 0.2 * k; }
    if (h.x < scene.floorL + 15) h.dir = 1;
    if (h.x > scene.floorR - 15) h.dir = -1;
    if (Math.random() < 0.002 * k) h.dir *= -1;
    const x = h.x, y = sandY(x) + 5 * u, out = 1 - h.hide;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(h.dir, 1);
    if (out > 0.05) {
      ctx.strokeStyle = sh("#c9603c"); ctx.lineCap = "round"; ctx.lineWidth = Math.max(1, s * 0.08);
      for (let i = 0; i < 3; i++) {
        const lift = Math.max(0, Math.sin(h.leg + i * 2)) * s * 0.1;
        ctx.beginPath();
        ctx.moveTo(s * 0.3, -s * 0.35);
        ctx.lineTo(s * (0.45 + i * 0.12) * out + s * 0.3 * (1 - out), -s * 0.5 - lift);
        ctx.lineTo(s * (0.55 + i * 0.15) * out + s * 0.3 * (1 - out), -lift * 0.2);
        ctx.stroke();
      }
      ctx.fillStyle = sh("#d9543b");
      ctx.beginPath(); ctx.ellipse(s * (0.3 + 0.45 * out), -s * 0.55, s * 0.2 * out, s * 0.13 * out, -0.3, 0, TAU); ctx.fill();
      const e1x = s * (0.35 + 0.15 * out), e1y = -s * (0.6 + 0.35 * out), e2x = s * (0.3 + 0.08 * out), e2y = -s * (0.6 + 0.4 * out);
      ctx.beginPath(); ctx.moveTo(s * 0.35, -s * 0.6); ctx.lineTo(e1x, e1y); ctx.moveTo(s * 0.3, -s * 0.6); ctx.lineTo(e2x, e2y); ctx.stroke();
      ctx.fillStyle = "#111";
      ctx.beginPath(); ctx.arc(e1x, e1y, s * 0.05, 0, TAU); ctx.arc(e2x, e2y, s * 0.05, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = sh(h.shell);
    ctx.beginPath(); ctx.arc(-s * 0.1, -s * 0.55, s * 0.55, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.85); ctx.lineTo(-s * 1.0, -s * 1.15); ctx.lineTo(-s * 0.4, -s * 1.0); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = Math.max(1, s * 0.06);
    ctx.beginPath();
    for (let a = 0; a < TAU * 2; a += 0.2) {
      const r = s * 0.5 * (1 - a / (TAU * 2.2));
      const px = -s * 0.1 + Math.cos(a) * r, py = -s * 0.55 + Math.sin(a) * r;
      a ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  function updateAndDrawSquids(k) {
    const sq = scene.squids;
    if (!sq.length) return;
    let cx = 0, cy = 0;
    for (const q of sq) { cx += q.x; cy += q.y; }
    cx /= sq.length; cy /= sq.length;
    for (const q of sq) {
      q.pulse -= k / 60;
      const threat = near(q.x, q.y, 130 * u);
      if (q.pulse <= 0 || (threat && q.pulse < 0.8)) {
        // squid move in jets: a quick push, then a glide
        q.pulse = 1.2 + Math.random() * 1.2;
        const a = threat ? Math.atan2(q.y - diver.y, q.x - diver.x)
          : Math.atan2(cy - q.y + (Math.random() - 0.5) * 80 * u, cx - q.x + (Math.random() - 0.5) * 120 * u + q.dir * 60 * u);
        const f = (threat ? 4 : 2) * u;
        q.vx += Math.cos(a) * f; q.vy += Math.sin(a) * f * 0.6;
        if (Math.random() < 0.15) q.dir *= -1;
      }
      const drag = Math.pow(0.95, k);
      q.vx *= drag; q.vy *= drag;
      q.x += (q.vx + current * 0.4) * k; q.y += q.vy * k;
      if (q.x < -30 * u) q.vx += 0.5 * u;
      if (q.x > W + 30 * u) q.vx -= 0.5 * u;
      if (q.y < H * 0.12) q.vy += 0.1 * u;
      if (water.surface && q.y < waveY(q.x) + q.s) { q.y = waveY(q.x) + q.s; q.vy = Math.abs(q.vy) * 0.5; }
      if (q.y > H * 0.7) q.vy -= 0.1 * u;
      if (Math.abs(q.vx) > 0.2 * u) q.face = Math.sign(q.vx);
      const face = q.face || 1, s = q.s;
      const recolor = q.shiny && beginShiny();
      ctx.save();
      ctx.translate(q.x, q.y);
      ctx.scale(face, 1);
      ctx.rotate(Math.atan2(q.vy, Math.abs(q.vx) + 0.5) * 0.6);
      const col = `hsla(${q.hue % 360} 55% ${68 - water.tintK * 30}% / 0.95)`;
      ctx.strokeStyle = col; ctx.lineWidth = Math.max(0.8, s * 0.06); ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const oy = (i - 2.5) * s * 0.05;
        ctx.moveTo(-s * 0.3, oy);
        ctx.quadraticCurveTo(-s * 0.7, oy + Math.sin(t * 4 + i) * s * 0.08, -s * (1.0 + (i % 2) * 0.25), oy * 1.6 + Math.sin(t * 3 + i) * s * 0.1);
      }
      ctx.stroke();
      // two long hunting tentacles with clubs at the end
      ctx.lineWidth = Math.max(0.7, s * 0.035);
      ctx.beginPath();
      for (const sd of [-1, 1]) {
        const ex = -s * 1.45, ey = sd * s * 0.12 + Math.sin(t * 2.5 + sd) * s * 0.06;
        ctx.moveTo(-s * 0.3, sd * s * 0.03); ctx.quadraticCurveTo(-s * 0.9, sd * s * 0.1, ex, ey);
      }
      ctx.stroke();
      ctx.fillStyle = col;
      for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(-s * 1.45, sd * s * 0.12 + Math.sin(t * 2.5 + sd) * s * 0.06, s * 0.09, s * 0.04, 0, 0, TAU); ctx.fill(); }
      ctx.beginPath(); ctx.ellipse(s * 0.25, 0, s * 0.6, s * 0.16, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-s * 0.28, 0, s * 0.12, s * 0.1, 0, 0, TAU); ctx.fill();
      const flap = Math.sin(t * 6) * s * 0.04;
      ctx.beginPath(); ctx.moveTo(s * 0.85, 0); ctx.lineTo(s * 0.6, -s * 0.22 - flap); ctx.lineTo(s * 0.55, 0); ctx.lineTo(s * 0.6, s * 0.22 + flap); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(120,30,40,0.35)";
      for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(s * i * 0.12, ((i * 7) % 3 - 1) * s * 0.05, s * 0.03, 0, TAU); ctx.fill(); }
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.beginPath(); ctx.arc(-s * 0.25, -s * 0.03, s * 0.075, 0, TAU); ctx.fill();
      ctx.fillStyle = "#111";
      ctx.beginPath(); ctx.arc(-s * 0.26, -s * 0.03, s * 0.05, 0, TAU); ctx.fill();
      ctx.restore();
      if (recolor) endShiny(q.shiny, q);
    }
  }

  function drawCombs(k, lightsPass) {
    for (const c of scene.combs) {
      if (!lightsPass) {
        c.ph += 0.01 * k;
        c.y += Math.sin(c.ph) * 0.2 * u * k;
        if (water.surface) c.y = Math.max(c.y, waveY(c.x) + c.r * 1.2);
        c.x += (Math.sin(t * 0.1 + c.drift) * 0.15 + current * 0.5) * u * k;
        if (c.x < -30) c.x = W + 20;
        if (c.x > W + 30) c.x = -20;
        ctx.fillStyle = "rgba(220,240,255,0.12)";
        ctx.strokeStyle = "rgba(220,240,255,0.35)";
        ctx.lineWidth = 1;
        shinyDraw(c, () => { ctx.beginPath(); ctx.ellipse(c.x, c.y, c.r * 0.65, c.r, 0, 0, TAU); ctx.fill(); ctx.stroke(); });
      } else {
        // rows of beating cilia scatter light into rainbows
        const a = 0.55 + 0.35 * Math.sin(t * 2 + c.ph);
        for (let r = 0; r < 8; r++) {
          const rx = (r / 7 - 0.5) * 1.1;
          for (let j = 0; j < 10; j++) {
            const yy = -0.85 + j * 0.19, xr = rx * Math.sqrt(Math.max(0, 1 - yy * yy)) * c.r * 0.65;
            ctx.fillStyle = `hsla(${(t * 240 + j * 36 + r * 15) % 360} 90% 65% / ${a})`;
            ctx.beginPath(); ctx.arc(c.x + xr, c.y + yy * c.r, Math.max(0.7, 1.1 * u), 0, TAU); ctx.fill();
          }
        }
      }
    }
  }

  function drawSeal(se, k) {
    se.ph += 0.018 * k;
    se.x += se.dir * 1.1 * u * k;
    const turnAt = se.shiny ? -se.s * 0.4 : se.s; // a shiny seal turns before it leaves the screen
    if ((se.dir > 0 && se.x > W + turnAt) || (se.dir < 0 && se.x < -turnAt)) {
      // a seal that has swum off comes back as a different seal
      se.dir *= -1; se.y0 = H * (0.25 + Math.random() * 0.3);
      if (!se.shiny) maybeShiny("seal", se, se.s * 0.4, () => [se.x, se.y !== undefined ? se.y : se.y0]);
    }
    let y = se.y0 + Math.sin(se.ph) * 70 * u;
    if (water.surface) y = Math.max(y, waveY(se.x) + se.s * 0.25);
    se.y = y;
    const ang = Math.atan2(Math.cos(se.ph) * 70 * u * 0.018, 1.1 * u);
    const s = se.s, body = sh("#6f7478"), spot = sh("#3e4246"), belly = sh("#a9aca8");
    ctx.save();
    ctx.translate(se.x, y);
    ctx.scale(se.dir, 1);
    ctx.rotate(ang);
    ctx.fillStyle = body;
    ctx.save(); ctx.translate(-s * 0.5, 0); ctx.rotate(Math.sin(t * 5) * 0.3);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-s * 0.25, -s * 0.12); ctx.lineTo(-s * 0.22, 0); ctx.lineTo(-s * 0.25, s * 0.12); ctx.fill();
    ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.55, s * 0.16, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(s * 0.5, -s * 0.02, s * 0.15, s * 0.12, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = belly;
    ctx.beginPath(); ctx.ellipse(s * 0.05, s * 0.08, s * 0.45, s * 0.06, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = spot;
    for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.arc(-s * 0.35 + i * s * 0.1, -s * 0.06 + ((i * 7) % 3) * s * 0.03, s * 0.018, 0, TAU); ctx.fill(); }
    ctx.fillStyle = body;
    ctx.save(); ctx.translate(s * 0.25, s * 0.1); ctx.rotate(0.6 + Math.sin(t * 3) * 0.3);
    ctx.beginPath(); ctx.ellipse(-s * 0.08, 0, s * 0.12, s * 0.04, 0, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.arc(s * 0.55, -s * 0.06, s * 0.025, 0, TAU); ctx.arc(s * 0.64, 0, s * 0.015, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(230,230,220,0.6)"; ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let i = -1; i <= 1; i++) { ctx.moveTo(s * 0.62, s * 0.02); ctx.lineTo(s * 0.75, s * 0.02 + i * s * 0.04); }
    ctx.stroke();
    ctx.restore();
  }

  const PENG_BODY = "M 100 -6 C 96 -22 72 -32 34 -32 C -16 -32 -66 -22 -98 -6 C -103 -2 -103 4 -98 6 C -66 22 -16 30 34 28 C 72 26 96 12 100 -6 Z";
  const PENG_FRONT = "M 110 -4 C 90 2 60 4 30 2 C -10 0 -60 2 -110 6 L -110 40 L 110 40 Z";
  const PENG_NECK = "M 84 -2 C 76 2 66 4 56 3 C 60 10 70 12 80 8 Z";
  const PENG_FLIPPER = "M 0 0 C -14 -4 -40 -2 -60 4 C -40 8 -14 8 0 6 Z";
  const PENG_BEAK = "M 98 -10 C 108 -9 118 -6 124 -4 C 118 -2 108 -1 98 -2 Z";
  const PENG_FOOT = "M 0 -4 L -22 -10 C -20 -2 -20 4 -22 10 L 0 4 Z";
  function drawPenguins(k) {
    for (const p of scene.penguins) {
      p.ph += 0.012 * p.sp * k;
      const cyc = p.ph % TAU;
      const depthF = Math.max(0, Math.sin(cyc * 0.5)); // 0 at the surface, 1 at the deepest point of the dive
      const vx = (1.2 + depthF * 0.8) * u;
      p.x += p.dir * vx * k;
      const pgGet = () => [p.x, waveY(p.x) + 6 * u + Math.max(0, Math.sin((p.ph % TAU) * 0.5)) * p.depth];
      if (p.shiny) { if ((p.dir < 0 && p.x < 30 * u) || (p.dir > 0 && p.x > W - 30 * u)) p.dir *= -1; }
      else if (p.x < -40) { p.x = W + 30; maybeShiny("penguins", p, p.s * 0.7, pgGet); }
      else if (p.x > W + 40) { p.x = -30; maybeShiny("penguins", p, p.s * 0.7, pgGet); }
      const y = waveY(p.x) + 6 * u + depthF * p.depth;
      const vy = Math.cos(cyc * 0.5) * 0.5 * p.depth * 0.012 * p.sp;
      const s = p.s;
      const recolor = p.shiny && beginShiny();
      ctx.save();
      ctx.translate(p.x, y);
      ctx.scale(p.dir, 1);
      ctx.rotate(Math.atan2(vy, vx));
      ctx.scale(s / 100, s / 100);
      ctx.fillStyle = "#f29a2e";
      ctx.save(); ctx.translate(-92, 4); ctx.rotate(Math.sin(t * 9 + p.ph) * 0.3); ctx.fill(P(PENG_FOOT)); ctx.restore();
      ctx.fillStyle = "#15181c"; ctx.fill(P(PENG_BODY));
      ctx.save(); ctx.clip(P(PENG_BODY)); ctx.fillStyle = "#f2f2ec"; ctx.fill(P(PENG_FRONT)); ctx.fillStyle = "rgba(242,190,60,0.85)"; ctx.fill(P(PENG_NECK)); ctx.restore();
      ctx.fillStyle = "#15181c";
      ctx.save(); ctx.translate(34, 4); ctx.rotate(-0.4 - Math.sin(t * 9 + p.ph) * 0.45); ctx.fill(P(PENG_FLIPPER)); ctx.restore();
      ctx.fillStyle = "#f29a2e"; ctx.fill(P(PENG_BEAK));
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(80, -12, 5.5, 0, TAU); ctx.fill();
      ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(81.5, -12, 3, 0, TAU); ctx.fill();
      ctx.restore();
      if (recolor) endShiny(p.shiny, p);
      if (depthF > 0.05 && Math.random() < 0.05 * k) bubbles.push({ x: p.x - p.dir * s, y, r: (1 + Math.random() * 1.5) * u, ph: Math.random() * TAU });
    }
  }

  // ---- more visitors -----------------------------------------------------
  function drawDolphin(x, y, dir, ang, L, ph) {
    const body = sh("#7d8f9c"), belly = sh("#d5dde0"), dark = sh("#4f5f6b");
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    ctx.rotate(ang);
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.moveTo(-L * 0.05, -L * 0.1); ctx.quadraticCurveTo(-L * 0.08, -L * 0.24, -L * 0.2, -L * 0.25); ctx.quadraticCurveTo(-L * 0.15, -L * 0.15, -L * 0.2, -L * 0.08); ctx.fill();
    ctx.save(); ctx.translate(-L * 0.48, 0); ctx.rotate(Math.sin(ph) * 0.25);
    ctx.beginPath(); ctx.moveTo(L * 0.04, 0); ctx.quadraticCurveTo(-L * 0.06, -L * 0.04, -L * 0.12, -L * 0.13); ctx.quadraticCurveTo(-L * 0.06, 0, -L * 0.12, L * 0.13); ctx.quadraticCurveTo(-L * 0.06, L * 0.04, L * 0.04, 0); ctx.fill();
    ctx.restore();
    const hull = new Path2D();
    hull.moveTo(L * 0.5, L * 0.02);
    hull.quadraticCurveTo(L * 0.42, -L * 0.03, L * 0.36, -L * 0.04);
    hull.bezierCurveTo(L * 0.28, -L * 0.15, -L * 0.1, -L * 0.13, -L * 0.48, 0);
    hull.bezierCurveTo(-L * 0.1, L * 0.1, L * 0.3, L * 0.09, L * 0.5, L * 0.02);
    ctx.fillStyle = body;
    ctx.fill(hull);
    ctx.save(); ctx.clip(hull);
    ctx.fillStyle = belly;
    ctx.beginPath(); ctx.ellipse(L * 0.1, L * 0.08, L * 0.45, L * 0.05, 0, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.ellipse(L * 0.12, L * 0.06, L * 0.08, L * 0.02, 0.5, 0, TAU); ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.arc(L * 0.3, -L * 0.02, L * 0.012, 0, TAU); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, L * 0.006);
    ctx.beginPath(); ctx.moveTo(L * 0.36, L * 0.015); ctx.quadraticCurveTo(L * 0.42, L * 0.03, L * 0.49, L * 0.02); ctx.stroke();
    ctx.restore();
  }

  function drawDolphins(v) {
    for (const d of v.pod) {
      const w = v.ph * 1.5 + d.ph;
      const ang = Math.atan2(Math.cos(w) * 35 * u * 0.045, v.speed);
      const x = v.x + d.dx * v.dir;
      let y = v.y + d.dy + Math.sin(w) * 35 * u;
      if (water.surface) y = Math.max(y, waveY(x) + v.size * d.sc * 0.15);
      shinyDraw(d, () => drawDolphin(x, y, v.dir, ang, v.size * d.sc, v.ph * 3 + d.ph));
    }
  }

  // A swordfish: a dark bronze back and silver belly, a tall sickle-shaped dorsal fin (no sail),
  // long sickle flippers, a big crescent tail and the long, flat sword.
  const SWORD_BODY = "M 30 0 C 26 -6 16 -9 4 -9.5 C -14 -9.5 -30 -5 -40 -1.5 L -40 1.5 C -30 4.5 -14 8.5 4 8.5 C 16 8 26 5 30 0 Z";
  const SWORD_DORSAL = "M 15 -8.6 C 13 -18 9 -24 2 -28 C 4 -20 2 -13 -3 -8.8 Z";
  const SWORD_PEC = "M 0 0 C -4 5 -10 9 -17 11.5 C -12 6 -6 2 0 -1.5 Z";
  const SWORD_TAIL = "M 2 0 C -4 -6 -10 -14 -15 -21 C -12 -8 -12 8 -15 21 C -10 14 -4 6 2 0 Z";
  const SWORD_BLADE = "M 28 -2.6 L 64 -1.1 C 65 -0.6 65 0 64 0.4 L 28 2.2 Z";
  function drawSwordfish(v) {
    const L = v.size, body = sh("#3e3a56"), belly = sh("#c9d0d8"), fin = sh("#2c2940");
    ctx.save();
    ctx.translate(v.x, v.y + v.yOff);
    ctx.scale(v.dir * L / 100, L / 100);
    ctx.rotate(Math.sin(v.ph * 2) * 0.03);
    ctx.fillStyle = fin;
    ctx.save(); ctx.translate(-40, 0); ctx.rotate(Math.sin(v.ph * 4) * 0.2); ctx.fill(P(SWORD_TAIL)); ctx.restore();
    ctx.fill(P(SWORD_DORSAL));
    ctx.beginPath(); ctx.moveTo(-33, -3); ctx.lineTo(-36.5, -6.5); ctx.lineTo(-37.5, -2.4); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-33, 3); ctx.lineTo(-36.5, 6.5); ctx.lineTo(-37.5, 2.4); ctx.fill();
    ctx.fillStyle = sh("#5a5670"); ctx.fill(P(SWORD_BLADE));
    ctx.fillStyle = body; ctx.fill(P(SWORD_BODY));
    ctx.save(); ctx.clip(P(SWORD_BODY)); ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(0, 8, 40, 6, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = fin;
    ctx.save(); ctx.translate(18, 5); ctx.rotate(Math.sin(v.ph * 1.5) * 0.12); ctx.fill(P(SWORD_PEC)); ctx.restore();
    ctx.fillStyle = sh("#d8dce4"); ctx.beginPath(); ctx.arc(22, -2.6, 2.2, 0, TAU); ctx.fill();
    ctx.fillStyle = "#0c1220"; ctx.beginPath(); ctx.arc(22.4, -2.6, 1.4, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawSub(v) {
    const L = v.size, hull = sh("#e8b52a", -0.05), dark = sh("#5a4a1a");
    ctx.save();
    ctx.translate(v.x, v.y + v.yOff);
    ctx.scale(v.dir, 1);
    ctx.fillStyle = hull;
    ctx.beginPath(); ctx.roundRect(-L * 0.45, -L * 0.13, L * 0.9, L * 0.26, L * 0.13); ctx.fill();
    ctx.beginPath(); ctx.roundRect(-L * 0.12, -L * 0.26, L * 0.26, L * 0.15, L * 0.04); ctx.fill();
    ctx.strokeStyle = hull; ctx.lineWidth = L * 0.02;
    ctx.beginPath(); ctx.moveTo(L * 0.02, -L * 0.26); ctx.lineTo(L * 0.02, -L * 0.36); ctx.lineTo(L * 0.08, -L * 0.36); ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(-L * 0.4, L * 0.04, L * 0.8, L * 0.06);
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.moveTo(-L * 0.42, -L * 0.04); ctx.lineTo(-L * 0.55, -L * 0.16); ctx.lineTo(-L * 0.55, L * 0.16); ctx.lineTo(-L * 0.42, L * 0.04); ctx.fill();
    ctx.fillStyle = sh("#3a3a3a");
    ctx.beginPath(); ctx.ellipse(-L * 0.57, 0, L * 0.015, Math.abs(Math.sin(t * 12)) * L * 0.1 + L * 0.02, 0, 0, TAU); ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = dark;
      ctx.beginPath(); ctx.arc(-L * 0.2 + i * L * 0.17, -L * 0.01, L * 0.05, 0, TAU); ctx.fill();
      ctx.fillStyle = `rgba(255,236,170,${0.5 + 0.5 * night})`;
      ctx.beginPath(); ctx.arc(-L * 0.2 + i * L * 0.17, -L * 0.01, L * 0.035, 0, TAU); ctx.fill();
    }
    ctx.fillStyle = sh("#dcdcdc");
    ctx.beginPath(); ctx.arc(L * 0.44, L * 0.03, L * 0.03, 0, TAU); ctx.fill();
    ctx.restore();
    if (Math.random() < 0.3) bubbles.push({ x: v.x - v.dir * L * 0.58, y: v.y + v.yOff + (Math.random() - 0.5) * L * 0.1, r: (1 + Math.random() * 2) * u, ph: Math.random() * TAU });
  }

  // A humpback: a long dark body with throat grooves, a knobbly head, a small hump for a dorsal fin,
  // and enormous pale flippers along its sides with a bumpy front edge.
  const HUMP_BODY = "M 50 1 C 48 -5 40 -8 26 -9.5 C 6 -11 -20 -8 -38 -3.5 C -45 -1.5 -50 -0.5 -52 0 C -44 2.5 -34 5 -16 8.5 C 6 12 34 11 46 6 C 49 4.5 50 2.5 50 1 Z";
  const HUMP_THROAT = "M 52 2.5 C 40 7 20 10 -2 9.5 L -2 20 L 60 20 Z";
  const HUMP_HUMP = "M -17 -7.6 C -19 -10 -23 -11.2 -27 -10.8 L -28 -6 Z";
  const HUMP_FLIPPER = "M 0 -2 C -8 0 -20 6 -32 12.5 C -36.5 14.5 -36 18 -31.5 17.5 C -20 13.5 -8 7.5 2 3 Z";
  const HUMP_FLUKE = "M 2 0 C -4 -3 -9 -7 -14 -10.5 C -12 -4 -11 -1 -11 0 C -11 1 -12 4 -14 10.5 C -9 7 -4 3 2 0 Z";
  function drawHumpback(v) {
    const L = v.size, back = sh("#26313b"), belly = sh("#c9cfd2"), fin = sh("#dfe3e2");
    ctx.save();
    ctx.translate(v.x, v.y + v.yOff);
    ctx.scale(v.dir * L / 100, L / 100);
    ctx.rotate(Math.sin(v.ph) * 0.03);
    const sweep = Math.sin(v.ph * 1.3);
    // the far flipper, in shadow behind the body
    ctx.fillStyle = sh("#8a949a");
    ctx.save(); ctx.translate(16, 5); ctx.rotate(-0.05 - sweep * 0.15); ctx.fill(P(HUMP_FLIPPER)); ctx.restore();
    ctx.fillStyle = back;
    ctx.save(); ctx.translate(-50, 0); ctx.rotate(Math.sin(v.ph * 2) * 0.2); ctx.fill(P(HUMP_FLUKE)); ctx.restore();
    ctx.fill(P(HUMP_BODY)); ctx.fill(P(HUMP_HUMP));
    ctx.save(); ctx.clip(P(HUMP_BODY));
    ctx.fillStyle = belly; ctx.fill(P(HUMP_THROAT));
    ctx.strokeStyle = sh("#7d878c"); ctx.lineWidth = 0.5;
    ctx.beginPath(); for (let i = 0; i < 7; i++) { const yy = 4.5 + i * 1.1; ctx.moveTo(48, yy - 2); ctx.quadraticCurveTo(26, yy + 1.5, 2, yy + 0.5); } ctx.stroke();
    // knobs on the head
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.arc(47 - (i % 4) * 3.2, -4 + Math.floor(i / 4) * 2.2, 0.7, 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.fillStyle = "#0b0e12"; ctx.beginPath(); ctx.arc(33, 2.5, 0.8, 0, TAU); ctx.fill();
    // the near flipper: very long and pale, its front edge bumpy
    ctx.save(); ctx.translate(20, 6); ctx.rotate(0.05 + sweep * 0.18);
    ctx.fillStyle = fin; ctx.fill(P(HUMP_FLIPPER));
    for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.arc(-i * 5.6, -1.2 + i * 2.4, 1, 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.restore();
  }

  // A narwhal: a round head without a beak, a mottled grey back fading to a pale belly,
  // short upturned flippers, and the long spiral tusk.
  const NAR_BODY = "M 42 1 C 42 -9 34 -13 20 -13 C 0 -13 -24 -9 -40 -3 C -44 -1.5 -46 -0.5 -48 0 C -42 3 -26 8 -6 10 C 14 12 34 10 40 6 C 42 4 42 2.5 42 1 Z";
  const NAR_FLUKE = "M 2 0 C -4 -3 -9 -7 -13 -11 C -11 -4 -10 -1 -10 0 C -10 1 -11 4 -13 11 C -9 7 -4 3 2 0 Z";
  const NAR_FLIPPER = "M 0 0 C -3 3 -8 6 -13 6.5 C -11 3.5 -6 1 0 -1.5 Z";
  function drawNarwhal(v) {
    const L = v.size, body = sh("#8e969a"), spot = sh("#4a5256");
    ctx.save();
    ctx.translate(v.x, v.y + v.yOff);
    ctx.scale(v.dir * L / 100, L / 100);
    ctx.rotate(Math.sin(v.ph) * 0.04);
    ctx.fillStyle = body;
    ctx.save(); ctx.translate(-46, 0); ctx.rotate(Math.sin(v.ph * 2) * 0.25); ctx.fill(P(NAR_FLUKE)); ctx.restore();
    ctx.fill(P(NAR_BODY));
    ctx.save(); ctx.clip(P(NAR_BODY));
    ctx.fillStyle = sh("#c8ccce"); ctx.beginPath(); ctx.ellipse(6, 11, 44, 7, 0.03, 0, TAU); ctx.fill();
    ctx.fillStyle = spot;
    for (let i = 0; i < 30; i++) { const sx = 34 - ((i * 23) % 76), sy = -11 + ((i * 7) % 6) * 2.6; ctx.beginPath(); ctx.ellipse(sx, sy, 1.6, 1.1, 0.4, 0, TAU); ctx.fill(); }
    ctx.restore();
    ctx.fillStyle = sh("#6e767a");
    ctx.save(); ctx.translate(24, 6); ctx.rotate(0.3 + Math.sin(v.ph * 1.5) * 0.2); ctx.fill(P(NAR_FLIPPER)); ctx.restore();
    ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(33, -2, 1.2, 0, TAU); ctx.fill();
    ctx.strokeStyle = sh("#ece4cc"); ctx.lineWidth = 2; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(40, -3); ctx.lineTo(100, -10); ctx.stroke();
    ctx.strokeStyle = sh("#a89e84"); ctx.lineWidth = 0.6;
    ctx.beginPath();
    for (let i = 0; i < 14; i++) { const f = i / 14, px = 42 + f * 56, py = -3.2 - f * 6.6; ctx.moveTo(px, py - 0.8); ctx.lineTo(px + 1.2, py + 0.8); }
    ctx.stroke();
    ctx.restore();
  }

  function drawMermaid(v) {
    const L = v.size, tail = sh("#2fa58f", -0.05), tail2 = sh("#7fd8c9"), skin = sh("#d9a07a"), hair = sh("#b5452f");
    ctx.save();
    ctx.translate(v.x, v.y + v.yOff);
    ctx.scale(v.dir, 1);
    ctx.rotate(Math.sin(v.ph) * 0.05);
    ctx.strokeStyle = hair; ctx.lineCap = "round";
    for (let i = 0; i < 7; i++) {
      ctx.lineWidth = L * (0.03 - i * 0.002);
      ctx.beginPath();
      ctx.moveTo(L * 0.36, -L * 0.07 + i * L * 0.008);
      ctx.bezierCurveTo(L * 0.2, -L * 0.1 + Math.sin(t * 2 + i) * L * 0.03, L * 0.05, -L * 0.04 + Math.sin(t * 2.4 + i) * L * 0.04, -L * 0.08, -L * 0.06 + i * L * 0.012 + Math.sin(t * 2.8 + i) * L * 0.05);
      ctx.stroke();
    }
    const pts = [];
    for (let i = 0; i <= 12; i++) { const f = i / 12; pts.push([-f * L * 0.62, Math.sin(v.ph * 3 - f * 3) * L * 0.05 * f]); }
    ctx.strokeStyle = tail;
    for (let i = 0; i < 12; i++) { ctx.lineWidth = L * (0.12 - i * 0.008); ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke(); }
    ctx.fillStyle = tail2;
    for (let i = 1; i < 10; i++) { ctx.beginPath(); ctx.arc(pts[i][0], pts[i][1] - L * 0.015, L * 0.008, 0, TAU); ctx.fill(); }
    const [ex, ey] = pts[12];
    ctx.save(); ctx.translate(ex, ey); ctx.rotate(Math.sin(v.ph * 3 - 3) * 0.4);
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.moveTo(L * 0.02, 0); ctx.quadraticCurveTo(-L * 0.08, -L * 0.04, -L * 0.15, -L * 0.12); ctx.quadraticCurveTo(-L * 0.1, 0, -L * 0.15, L * 0.12); ctx.quadraticCurveTo(-L * 0.08, L * 0.04, L * 0.02, 0); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.strokeStyle = skin; ctx.lineWidth = L * 0.1;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L * 0.28, -L * 0.04); ctx.stroke();
    ctx.lineWidth = L * 0.035;
    ctx.beginPath(); ctx.moveTo(L * 0.25, -L * 0.02); ctx.quadraticCurveTo(L * 0.36, L * 0.04 + Math.sin(v.ph * 2) * L * 0.03, L * 0.48, L * 0.02 + Math.sin(v.ph * 2) * L * 0.04); ctx.stroke();
    ctx.fillStyle = sh("#8a5ad0");
    ctx.beginPath(); ctx.ellipse(L * 0.2, L * 0.025, L * 0.035, L * 0.025, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.arc(L * 0.36, -L * 0.065, L * 0.06, 0, TAU); ctx.fill();
    ctx.fillStyle = hair;
    ctx.beginPath(); ctx.arc(L * 0.34, -L * 0.085, L * 0.058, Math.PI * 0.9, Math.PI * 2.1); ctx.fill();
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath(); ctx.arc(L * 0.39, -L * 0.07, L * 0.007, 0, TAU); ctx.fill();
    ctx.restore();
  }

  const VISITOR_DRAW = { turtle: drawTurtle, manta: drawManta, shark: drawShark, dolphins: drawDolphins, swordfish: drawSwordfish, sub: drawSub, narwhal: drawNarwhal, mermaid: drawMermaid };

  // ---- tentacles from the deep -------------------------------------------
  const smooth = x => x * x * (3 - 2 * x);
  const KRAKEN = {
    rise: 5, hold: 9, gap: () => 25 + Math.random() * 25, col: "#6a1f2e", sucker: "#e0a0a0", alpha: 1,
    make: T => {
      const side = Math.random() < 0.5 ? -1 : 1;
      T.side = side;
      return Array.from({ length: 5 }, (_, i) => {
        const curl = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random());
        return {
          bx: W * (side < 0 ? 0.05 + i * 0.12 : 0.95 - i * 0.12), by: H + 30 * u,
          ang: -Math.PI / 2 - side * (0.15 + Math.random() * 0.35),
          len: H * (0.5 + Math.random() * 0.35), w: (34 + Math.random() * 22) * u,
          ph: Math.random() * TAU, curl, side: Math.sign(curl),
        };
      });
    },
  };
  const GIANT = {
    rise: 4, hold: 6, gap: () => 30 + Math.random() * 35, col: "#7a2a2a", sucker: "#d08a7a", alpha: 0.7,
    make: T => {
      const side = Math.random() < 0.5 ? -1 : 1;
      T.side = side;
      const by0 = H * (0.3 + Math.random() * 0.35);
      return Array.from({ length: 4 }, (_, i) => ({
        bx: side < 0 ? -20 * u : W + 20 * u, by: by0 + (i - 1.5) * 18 * u,
        ang: (side < 0 ? 0 : Math.PI) + (Math.random() - 0.5) * 0.6,
        len: Math.min(W * 0.45, 420 * u) * (0.7 + Math.random() * 0.4), w: (14 + Math.random() * 10) * u,
        ph: Math.random() * TAU, curl: (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random()), side: 1,
      }));
    },
  };

  function updateTentacles(T, dtSec, O) {
    if (!T.enabled) return;
    if (!T.active) {
      T.timer -= dtSec;
      if (T.timer <= 0) {
        if (!claim(O.rise * 2 + O.hold)) { T.timer = 8 + Math.random() * 10; return; }
        T.active = true; T.age = 0; T.list = O.make(T);
        sfxRumble(O === KRAKEN ? 1 : 0.5);
        watch(O === KRAKEN ? "kraken" : "giant", () => T.active ? T.list.map(tt => [tt.bx + Math.cos(tt.ang) * tt.len * 0.4 * T.reach, tt.by + Math.sin(tt.ang) * tt.len * 0.4 * T.reach]) : null, 30 * u);
      }
      return;
    }
    T.age += dtSec;
    const a = T.age;
    T.reach = a < O.rise ? smooth(a / O.rise) : a < O.rise + O.hold ? 1 : 1 - smooth(Math.min(1, (a - O.rise - O.hold) / O.rise));
    if (a > O.rise * 2 + O.hold) { T.active = false; T.timer = O.gap(); }
  }

  function drawTentacle(tc, reach, col, sucker, alpha) {
    ctx.globalAlpha = alpha;
    let x = tc.bx, y = tc.by, a = tc.ang;
    const n = 24, seg = (tc.len * reach) / n;
    const pts = [[x, y, a]];
    for (let i = 1; i <= n; i++) {
      const f = i / n;
      a += Math.sin(t * 0.9 + tc.ph + f * 3) * 0.05 + (f > 0.65 ? tc.curl * (f - 0.65) * 0.5 : 0);
      x += Math.cos(a) * seg; y += Math.sin(a) * seg;
      pts.push([x, y, a]);
    }
    ctx.strokeStyle = col; ctx.lineCap = "round";
    for (let i = 0; i < n; i++) {
      ctx.lineWidth = tc.w * (1 - (i / n) * 0.9);
      ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[i + 1][0], pts[i + 1][1]); ctx.stroke();
    }
    ctx.fillStyle = sucker;
    for (let i = 2; i < n; i += 2) {
      const [px, py, pa] = pts[i], w = tc.w * (1 - (i / n) * 0.9);
      const off = pa + (Math.PI / 2) * tc.side;
      ctx.beginPath(); ctx.arc(px + Math.cos(off) * w * 0.38, py + Math.sin(off) * w * 0.38, Math.max(0.8, w * 0.22), 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
    tc.tip = pts[n];
  }

  function drawKrakenEye(T) {
    const r = T.reach, R = 60 * u;
    const ex = T.side < 0 ? W * 0.1 : W * 0.9, ey = H + R * 0.4 - R * 1.2 * r;
    T.eye = { x: ex, y: ey };
    ctx.globalAlpha = r;
    ctx.fillStyle = sh("#4a1420");
    ctx.beginPath(); ctx.ellipse(ex, ey + R * 0.6, R * 2.4, R * 1.4, 0, 0, TAU); ctx.fill();
    const blink = Math.sin(t * 0.5) > 0.95 ? 0.15 : 1;
    ctx.fillStyle = "#e8c23a";
    ctx.beginPath(); ctx.ellipse(ex, ey, R * 0.75, R * 0.5 * blink, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "#120808";
    ctx.beginPath(); ctx.ellipse(ex, ey, R * 0.5, R * 0.1 * blink, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawTentacleSet(T, O) {
    if (O === KRAKEN) drawKrakenEye(T);
    for (const tc of T.list) drawTentacle(tc, T.reach, sh(O.col), sh(O.sucker), O.alpha);
  }


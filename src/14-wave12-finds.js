  // ---- the twelfth round: thirteen finds, six of them floating at the surface ----------------------------------
  // Floating: a glass fishing float, rubber ducks, a pumice raft, sea beans, an expedition crate, and the buoy of a
  // lobster pot (its cage stands on the floor). On the floor: a mammoth tooth, VOC porcelain, a megalodon tooth,
  // an ammonite, sea balls, a dropstone and a kelp holdfast.
  // They are added after everything else has its spot, from a stream of their own, so the oceans that were already
  // there keep every landmark where it was.
  const W12_KEYS = ["glassfloat", "ducks", "pumice", "seabeans", "crate", "lobsterpot", "mammoth", "porcelain", "megtooth", "ammonite", "seaballs", "dropstone", "holdfast"];
  const W12_FLOAT = new Set(["driftwood", "glassfloat", "ducks", "pumice", "seabeans", "crate"]);
  // a few points around a circle, each a little in or out, for stones and shards
  const w12Blob = (n, lo, hi) => Array.from({ length: n }, () => range(lo, hi));

  function addWave12Ground(s, P) {
    // every chance rolls, in a fixed order, so one find never moves the dice of another
    const here = W12_KEYS.filter(k => chance(P[k] || 0));
    const make = {
      glassfloat: () => ({ w: 50 * u, s: range(13, 18) * u, ph: range(0, TAU), glint: 0, col: pick([["#5ab08a", "#1e5a40"], ["#6aa8c8", "#204a68"], ["#8ab85a", "#3a5a20"]]) }),
      ducks: () => { const n = 3 + Math.floor(rng() * 3); return { w: 150 * u, s: range(11, 13) * u, ducks: Array.from({ length: n }, (_, i) => ({
        dx: (i - (n - 1) / 2) * range(26, 34) * u, ph: range(0, TAU), o: range(0, TAU), sc: range(0.85, 1.15), faded: chance(0.35) })) }; },
      pumice: () => ({ w: 150 * u, spread: 0, stones: Array.from({ length: 9 + Math.floor(rng() * 6) }, () => ({
        dx: range(-62, 62) * u, dy: range(-2, 6) * u, r: range(5, 13) * u, ph: range(0, TAU), pts: w12Blob(9, 0.75, 1.15),
        holes: Array.from({ length: 4 }, () => [range(-0.6, 0.6), range(-0.5, 0.5), range(0.08, 0.16)]), barn: chance(0.3) })) }),
      seabeans: () => ({ w: 90 * u, beans: Array.from({ length: 3 + Math.floor(rng() * 3) }, () => ({
        dx: range(-36, 36) * u, ph: range(0, TAU), rot: range(0, TAU), s: range(8, 11) * u, c: pick(["#7a4420", "#8a4a22", "#6a3a1a"]) })) }),
      crate: () => ({ w: 70 * u, s: range(30, 38) * u, ph: range(0, TAU), tilt: range(-0.1, 0.1), rock: 0 }),
      lobsterpot: () => ({ w: 90 * u, s: range(32, 40) * u, ph: range(0, TAU), bdx: range(-50, 50) * u, rattle: 0, dir: chance(0.5) ? 1 : -1 }),
      mammoth: () => ({ w: 80 * u, s: range(40, 48) * u, tilt: range(-0.25, 0.15), dir: chance(0.5) ? 1 : -1 }),
      porcelain: () => ({ w: 90 * u, s: range(20, 26) * u, tilt: range(0.35, 0.6) * (chance(0.5) ? 1 : -1),
        shards: Array.from({ length: 4 + Math.floor(rng() * 3) }, () => ({ dx: range(-38, 38) * u, a: range(0, TAU), r: range(4, 7) * u, pts: w12Blob(5, 0.6, 1.2), stripe: chance(0.6) })) }),
      megtooth: () => ({ w: 50 * u, s: range(26, 32) * u, tilt: range(-0.45, 0.45) }),
      ammonite: () => ({ w: 90 * u, s: range(34, 42) * u, glow: 0, pts: w12Blob(10, 0.82, 1.12), dir: chance(0.5) ? 1 : -1 }),
      seaballs: () => ({ w: 120 * u, balls: Array.from({ length: 3 + Math.floor(rng() * 4) }, () => ({ dx: range(-45, 45) * u, r: range(5, 9) * u, ph: range(0, TAU), roll: 0 })) }),
      dropstone: () => ({ w: 120 * u, s: range(48, 60) * u, pts: w12Blob(12, 0.88, 1.08), dir: chance(0.5) ? 1 : -1,
        dots: Array.from({ length: 40 }, () => [range(-1, 1), range(-1, 0.2), range(0.012, 0.028), chance(0.4)]), anemones: Math.floor(rng() * 3) }),
      holdfast: () => ({ w: 100 * u, s: range(48, 58) * u, hide: 0, ph: range(0, TAU), dir: chance(0.5) ? 1 : -1,
        roots: Array.from({ length: 14 }, (_, i) => ({ a: (i / 13 - 0.5) * 2.6 + range(-0.12, 0.12), len: range(0.55, 0.9), bend: range(-0.4, 0.4) })) }),
    };
    // first everything that is rolled, then the places: how many tries a place takes depends on the screen
    const items = here.map(k => Object.assign({ kind: k }, make[k]()));
    // what comes may not depend on the screen, so the floor keeps it calm by counting: at most two new finds on the
    // sand (an aquarium keeps everything). Each gets the freest spot there is.
    let onFloor = 0;
    for (const it of items) {
      const floating = W12_FLOAT.has(it.kind);
      // nothing floats on a water without a surface (the cave)
      if (floating ? !water.surface : !aquarium && onFloor >= W12_FLOOR_MAX) continue;
      if (!floating) onFloor++;
      it.x = w12Spot(s, it, floating);
      s.ground.push(it);
    }
  }
  const W12_FLOOR_MAX = 2;
  function w12Spot(s, it, floating) {
    const others = s.ground.filter(g => W12_FLOAT.has(g.kind) === floating);
    let lo = floating ? W * 0.08 : s.floorL + it.w * 0.5, hi = floating ? W * 0.92 : s.floorR - it.w * 0.5;
    if (hi < lo) lo = hi = (lo + hi) / 2;
    let best = lo, bestRoom = -Infinity;
    for (let tries = 0; tries < 30; tries++) {
      const x = range(lo, hi);
      let room = others.reduce((m, g) => Math.min(m, Math.abs(g.x - x) - (g.w + it.w) * 0.5 - 10 * u), Infinity);
      if (!floating && s.treasure) room = Math.min(room, Math.abs(s.treasure.x - x) - it.w * 0.5 - 30 * u);
      if (room > bestRoom) { bestRoom = room; best = x; }
      if (room > 0) break;
    }
    return best;
  }
  // where the water line is above x (or just above the top of the screen in a water without one)
  const w12Top = x => water.surface ? waveY(x) : -10 * u;
  const w12Ease = (v, to, k, sp) => v + (to - v) * Math.min(1, sp * k);
  function blobPath(pts, rx, ry) {
    ctx.beginPath();
    pts.forEach((f, i) => { const a = i / pts.length * TAU, x = Math.cos(a) * rx * f, y = Math.sin(a) * ry * f; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.closePath();
  }

  // A glass fishing float: a green or blue glass ball in a net of old rope, bobbing half under water.
  // The lamp catches a glint in the glass.
  function drawGlassfloat(g, k) {
    if (k) g.ph += 0.025 * k;
    const r = g.s, x = g.x, y = w12Top(x) + r * 0.2 + Math.sin(g.ph * 2) * 1.2 * u;
    if (k) g.glint = w12Ease(g.glint, near(x, y, 150 * u) > 0 ? 1 : 0, k, 0.06);
    const rope = sh("#a88a5a");
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(g.ph) * 0.1);
    const grd = ctx.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
    grd.addColorStop(0, sh(g.col[0])); grd.addColorStop(1, sh(g.col[1]));
    ctx.globalAlpha = 0.88; ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;
    // the net: two meridians, the equator and a knot on top with a loose end
    ctx.strokeStyle = rope; ctx.lineWidth = Math.max(0.8, r * 0.08); ctx.lineCap = "round";
    ctx.beginPath(); ctx.ellipse(0, 0, r * 0.45, r, 0, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, r * 0.98, r * 0.3, 0, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, r); ctx.quadraticCurveTo(r * 0.3, r * 1.5, r * 0.1 + Math.sin(g.ph * 1.5) * r * 0.2, r * 1.9); ctx.stroke();
    ctx.fillStyle = rope; ctx.beginPath(); ctx.arc(0, -r, r * 0.14, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.beginPath(); ctx.ellipse(-r * 0.42, -r * 0.45, r * 0.22, r * 0.1, -0.7, 0, TAU); ctx.fill();
    if (g.glint > 0.05) {
      const gl = g.glint * (0.75 + 0.25 * Math.sin(t * 6)), L2 = r * 0.7 * gl;
      ctx.fillStyle = `rgba(255,252,230,${0.85 * gl})`; ctx.beginPath();
      ctx.moveTo(-r * 0.42, -r * 0.45 - L2); ctx.lineTo(-r * 0.36, -r * 0.51); ctx.lineTo(-r * 0.42 + L2, -r * 0.45); ctx.lineTo(-r * 0.36, -r * 0.39);
      ctx.lineTo(-r * 0.42, -r * 0.45 + L2); ctx.lineTo(-r * 0.48, -r * 0.39); ctx.lineTo(-r * 0.42 - L2, -r * 0.45); ctx.lineTo(-r * 0.48, -r * 0.51); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  // Rubber ducks from a lost container. Some have been at sea so long that the sun bleached them almost white.
  // They turn slowly in the waves, and spin when the diver blows bubbles under them.
  function drawDucks(g, k) {
    const nr = k ? near(g.x, w12Top(g.x) + 20 * u, 160 * u) : 0;
    for (const d of g.ducks) {
      if (k) d.ph += (0.02 + nr * 0.12) * k;
      const s = g.s * d.sc, x = g.x + d.dx + Math.sin(d.ph * 0.4 + d.o) * 4 * u, y = w12Top(x) + s * 0.2;
      const turn = Math.sin(d.ph * 0.3 + d.o), sx = Math.sign(turn || 1) * Math.max(0.25, Math.abs(turn) ** 0.4);
      const body = sh(d.faded ? "#eee4b8" : "#f4c832"), wing = sh(d.faded ? "#d8cc98" : "#d8a420"), beak = sh(d.faded ? "#e8b080" : "#ec7a28");
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(d.ph * 1.3) * 0.12); ctx.scale(sx, 1);
      ctx.fillStyle = body; ctx.beginPath();
      ctx.moveTo(-0.85 * s, -0.75 * s); ctx.quadraticCurveTo(-0.9 * s, -0.1 * s, -0.55 * s, 0.2 * s);
      ctx.quadraticCurveTo(0, 0.45 * s, 0.6 * s, 0.15 * s); ctx.quadraticCurveTo(0.8 * s, -0.2 * s, 0.4 * s, -0.4 * s);
      ctx.quadraticCurveTo(-0.3 * s, -0.5 * s, -0.85 * s, -0.75 * s); ctx.fill();
      ctx.beginPath(); ctx.arc(0.38 * s, -0.72 * s, 0.33 * s, 0, TAU); ctx.fill();
      ctx.fillStyle = wing; ctx.beginPath(); ctx.ellipse(-0.15 * s, -0.12 * s, 0.38 * s, 0.18 * s, -0.25, 0, TAU); ctx.fill();
      ctx.fillStyle = beak; ctx.beginPath(); ctx.ellipse(0.74 * s, -0.64 * s, 0.22 * s, 0.09 * s, 0.1, 0, TAU); ctx.fill();
      ctx.fillStyle = sh("#202020"); ctx.beginPath(); ctx.arc(0.47 * s, -0.82 * s, 0.065 * s, 0, TAU); ctx.fill();
      ctx.restore();
    }
  }

  // A pumice raft: light grey stones full of little holes that float after an undersea eruption.
  // Barnacles hitch a ride under some of them. The stones drift apart a little when the diver swims through.
  function drawPumice(g, k) {
    if (k) g.spread = w12Ease(g.spread, near(g.x, w12Top(g.x) + 20 * u, 160 * u) > 0 ? 1 : 0, k, 0.03);
    const light = sh("#c8c4b4"), dark = sh("#8a8676"), hole = sh("#5a5648"), barn = sh("#e8e4d8");
    for (const st of g.stones) {
      if (k) st.ph += 0.02 * k;
      const x = g.x + st.dx * (1 + g.spread * 0.3), y = w12Top(x) + st.dy + st.r * 0.15 + Math.sin(st.ph) * 1 * u;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(st.ph * 0.7) * 0.1);
      if (st.barn) { ctx.fillStyle = barn; for (const bx of [-0.3, 0.25]) { ctx.beginPath(); ctx.moveTo(st.r * (bx - 0.12), st.r * 0.6); ctx.lineTo(st.r * bx, st.r * 1.05); ctx.lineTo(st.r * (bx + 0.12), st.r * 0.6); ctx.fill(); } }
      ctx.fillStyle = dark; blobPath(st.pts, st.r, st.r * 0.75); ctx.fill();
      ctx.save(); blobPath(st.pts, st.r, st.r * 0.75); ctx.clip();
      ctx.fillStyle = light; ctx.beginPath(); ctx.ellipse(-st.r * 0.15, -st.r * 0.3, st.r * 0.95, st.r * 0.6, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = hole; for (const [hx, hy, hr] of st.holes) { ctx.beginPath(); ctx.arc(hx * st.r, hy * st.r, hr * st.r, 0, TAU); ctx.fill(); }
      ctx.restore();
      ctx.restore();
    }
  }

  // Sea beans: big glossy seeds of tropical climbing plants that float across whole oceans.
  function drawSeabeans(g, k) {
    for (const b of g.beans) {
      if (k) { b.ph += 0.02 * k; b.rot += 0.004 * k; }
      const x = g.x + b.dx + Math.sin(b.ph * 0.5) * 2 * u, y = w12Top(x) + b.s * 0.35 + Math.sin(b.ph) * 0.8 * u, s = b.s;
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(b.rot) * 0.6);
      ctx.fillStyle = sh(b.c); ctx.beginPath();
      ctx.moveTo(0, -s * 0.75); ctx.bezierCurveTo(s * 1.2, -s * 1.1, s * 1.2, s * 0.9, 0, s * 0.9); ctx.bezierCurveTo(-s * 1.2, s * 0.9, -s * 1.2, -s * 1.1, 0, -s * 0.75); ctx.fill();
      ctx.strokeStyle = sh("#2a160a"); ctx.lineWidth = Math.max(0.8, s * 0.1); ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.55); ctx.quadraticCurveTo(0, -s * 0.9, s * 0.55, -s * 0.55); ctx.stroke();
      ctx.fillStyle = "rgba(255,240,220,0.35)"; ctx.beginPath(); ctx.ellipse(-s * 0.35, -s * 0.1, s * 0.2, s * 0.35, 0.3, 0, TAU); ctx.fill();
      ctx.restore();
    }
  }

  // An expedition crate from a long-ago polar voyage: wooden planks, iron bands, a rope handle and a crust of ice
  // on top. It rocks harder when the diver bumps into it.
  function drawCrate(g, k) {
    if (k) { g.ph += 0.02 * k; g.rock = w12Ease(g.rock, near(g.x, w12Top(g.x) + g.s * 0.3, 130 * u) > 0 ? 1 : 0, k, 0.05); }
    const s = g.s, x = g.x, y = w12Top(x) + s * 0.08;
    const wood = sh("#7a5a38"), plank = sh("#5a4028"), iron = sh("#3a3a3a"), rope = sh("#b89a68"), ice = sh("#e8f4fa"), paint = sh("#c8b890");
    ctx.save(); ctx.translate(x, y + Math.sin(g.ph * 2) * 1.5 * u); ctx.rotate(g.tilt + Math.sin(g.ph) * (0.04 + g.rock * 0.12));
    ctx.fillStyle = wood; ctx.fillRect(-s * 0.55, -s * 0.3, s * 1.1, s * 0.62);
    ctx.strokeStyle = plank; ctx.lineWidth = Math.max(0.8, s * 0.025); ctx.beginPath();
    for (const py of [-0.1, 0.1]) { ctx.moveTo(-s * 0.55, py * s); ctx.lineTo(s * 0.55, py * s); }
    ctx.stroke();
    ctx.fillStyle = iron; for (const bx of [-0.4, 0.34]) ctx.fillRect(bx * s, -s * 0.3, s * 0.06, s * 0.62);
    // a painted compass star on the side
    ctx.strokeStyle = paint; ctx.lineWidth = Math.max(1, s * 0.03); ctx.beginPath();
    ctx.moveTo(-s * 0.03, -s * 0.18); ctx.lineTo(-s * 0.03, s * 0.2); ctx.moveTo(-s * 0.22, s * 0.01); ctx.lineTo(s * 0.16, s * 0.01); ctx.stroke();
    ctx.beginPath(); ctx.arc(-s * 0.03, s * 0.01, s * 0.11, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rope; ctx.lineWidth = Math.max(1, s * 0.035); ctx.beginPath(); ctx.arc(s * 0.55, 0, s * 0.1, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.fillStyle = ice; ctx.beginPath(); ctx.moveTo(-s * 0.58, -s * 0.3);
    for (let i = 0; i <= 8; i++) ctx.lineTo(-s * 0.58 + i * s * 0.145, -s * (0.34 + ((i * 7) % 3) * 0.03));
    ctx.lineTo(s * 0.58, -s * 0.24); ctx.lineTo(-s * 0.58, -s * 0.24); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  // A lobster pot: a cage of netting on the floor with a lobster inside, and a rope up to a bright buoy at the surface.
  // The lobster rattles the cage when the diver comes close.
  function drawLobsterpot(g, k) {
    if (k) { g.ph += 0.02 * k; g.rattle = w12Ease(g.rattle, near(g.x, sandY(g.x) - g.s * 0.4, 120 * u) > 0 ? 1 : 0, k, 0.08); }
    const s = g.s, base = sandY(g.x) + s * 0.05, bx = g.x + g.bdx, by = w12Top(bx) + 4 * u;
    const rope = sh("#c8b080"), net = sh("#3a5a4a"), frame = sh("#2a3a30"), wood = sh("#6a5038"), buoy = sh("#e85a2a"), band = sh("#f4f0e8");
    // once the diver has opened the hatch (see 14-wave13-play.js) the lobster walks out and away
    if (g.free && k) { g.free += k / 60; g.lx = (g.lx || 0) + Math.min(1, g.free) * 0.9 * u * k; }
    const shake = g.free ? 0 : g.rattle * Math.sin(t * 30) * 1.2 * u;
    // the rope, swaying, then the buoy
    ctx.strokeStyle = rope; ctx.lineWidth = Math.max(1, 1.4 * u); ctx.beginPath(); ctx.moveTo(g.x, base - s * 0.72);
    ctx.quadraticCurveTo((g.x + bx) / 2 + Math.sin(g.ph) * 20 * u, (base + by) / 2, bx, by); ctx.stroke();
    if (water.surface) {
      ctx.save(); ctx.translate(bx, by + Math.sin(g.ph * 2) * 1.5 * u);
      ctx.fillStyle = buoy; ctx.beginPath(); ctx.ellipse(0, 0, 9 * u, 11 * u, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = band; ctx.fillRect(-9 * u, -2 * u, 18 * u, 4 * u);
      ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.ellipse(-3.5 * u, -5 * u, 2.5 * u, 4 * u, -0.3, 0, TAU); ctx.fill();
      ctx.restore();
    }
    ctx.save(); ctx.translate(g.x + shake, base); ctx.scale(g.dir, 1);
    // the lobster, behind the netting
    const lob = sh("#24344e"), lobLight = sh("#3a5070"), wave = g.free ? Math.sin(t * 5) * 0.5 : Math.sin(t * 8) * g.rattle;
    ctx.save(); ctx.translate(g.lx || 0, g.free ? Math.abs(Math.sin(t * 9)) * -1.2 * u : 0);
    ctx.fillStyle = lob; ctx.beginPath(); ctx.ellipse(-s * 0.05, -s * 0.2, s * 0.32, s * 0.09, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = lobLight; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(-s * (0.3 + i * 0.06), -s * 0.2, s * 0.04, s * 0.08, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = lob; for (const sgn of [-1, 1]) {
      ctx.save(); ctx.translate(s * 0.25, -s * 0.2 + sgn * s * 0.04); ctx.rotate(sgn * (0.35 + wave * 0.4) - 0.2);
      ctx.fillRect(0, -s * 0.02, s * 0.14, s * 0.04); ctx.beginPath(); ctx.ellipse(s * 0.2, 0, s * 0.09, s * 0.05, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    ctx.strokeStyle = lobLight; ctx.lineWidth = Math.max(0.6, s * 0.012); ctx.beginPath();
    ctx.moveTo(s * 0.25, -s * 0.22); ctx.quadraticCurveTo(s * 0.4, -s * 0.5, s * 0.55, -s * 0.45 + wave * s * 0.05); ctx.stroke();
    if (g.free) { ctx.beginPath(); for (let i = 0; i < 4; i++) { const lx = -s * (0.15 - i * 0.08), sw = Math.sin(t * 12 + i) * s * 0.03; ctx.moveTo(lx, -s * 0.14); ctx.lineTo(lx + sw, -s * 0.02); } ctx.stroke(); }
    ctx.restore();
    // the cage: a wooden base, a half-round frame of hoops and a net between them
    ctx.fillStyle = wood; ctx.fillRect(-s * 0.6, -s * 0.06, s * 1.2, s * 0.08);
    ctx.strokeStyle = frame; ctx.lineWidth = Math.max(1, s * 0.035);
    for (const hx of [-0.55, 0, 0.55]) { ctx.beginPath(); ctx.moveTo(hx * s, -s * 0.05); ctx.lineTo(hx * s * 0.9, -s * 0.62); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-s * 0.55, -s * 0.05); ctx.quadraticCurveTo(-s * 0.6, -s * 0.72, 0, -s * 0.72); ctx.quadraticCurveTo(s * 0.6, -s * 0.72, s * 0.55, -s * 0.05); ctx.stroke();
    ctx.strokeStyle = net; ctx.lineWidth = Math.max(0.5, s * 0.012); ctx.globalAlpha = 0.8; ctx.beginPath();
    for (let i = -5; i <= 5; i++) { ctx.moveTo(i * s * 0.1 - s * 0.08, -s * 0.05); ctx.lineTo(i * s * 0.1 + s * 0.08, -s * 0.66); ctx.moveTo(i * s * 0.1 + s * 0.08, -s * 0.05); ctx.lineTo(i * s * 0.1 - s * 0.08, -s * 0.66); }
    ctx.stroke(); ctx.globalAlpha = 1;
    // the entrance funnel on the side
    ctx.strokeStyle = frame; ctx.lineWidth = Math.max(1, s * 0.03); ctx.beginPath(); if (g.free) ctx.ellipse(s * 0.58, -s * 0.3, s * 0.02, s * 0.13, 0, 0, TAU); else ctx.ellipse(s * 0.5, -s * 0.3, s * 0.06, s * 0.13, 0, 0, TAU); ctx.stroke();
    ctx.restore();
  }

  // A mammoth tooth: a big molar with rows of enamel ridges, half in the sand. North Sea fishermen still bring them
  // up from the drowned land of Doggerland.
  function drawMammoth(g) {
    const s = g.s, base = sandY(g.x) + s * 0.12;
    const root = sh("#4a3626"), body = sh("#6a5038"), ridge = sh("#c8b48e"), dark = sh("#2e2218");
    ctx.save(); ctx.translate(g.x, base); ctx.scale(g.dir, 1); ctx.rotate(g.tilt);
    ctx.fillStyle = root; ctx.beginPath(); ctx.roundRect(-s * 0.55, -s * 0.3, s * 1.1, s * 0.34, s * 0.08); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); ctx.roundRect(-s * 0.6, -s * 0.55, s * 1.2, s * 0.32, s * 0.1); ctx.fill();
    // the chewing surface: wavy enamel plates side by side
    ctx.strokeStyle = ridge; ctx.lineWidth = Math.max(1, s * 0.035); ctx.beginPath();
    for (let i = 0; i < 10; i++) { const x = -s * 0.5 + i * s * 0.11; ctx.moveTo(x, -s * 0.5); ctx.bezierCurveTo(x + s * 0.03, -s * 0.44, x - s * 0.03, -s * 0.36, x, -s * 0.28); }
    ctx.stroke();
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(0.7, s * 0.02); ctx.beginPath();
    for (let i = 0; i < 9; i++) { const x = -s * 0.445 + i * s * 0.11; ctx.moveTo(x, -s * 0.48); ctx.lineTo(x, -s * 0.3); }
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "rgba(0,0,0,0.13)"; ctx.beginPath(); ctx.ellipse(g.x, sandY(g.x) + s * 0.1, s * 0.7, s * 0.06, 0, 0, TAU); ctx.fill();
  }

  // VOC porcelain: blue-and-white shards and a half-buried bowl, from a Dutch East India ship that sank off the islands.
  function drawPorcelain(g) {
    const s = g.s, base = sandY(g.x) + s * 0.2;
    const white = sh("#eeeadc"), shade = sh("#c8c4b8"), blue = sh("#2a4a9a");
    for (const sd of g.shards) {
      ctx.save(); ctx.translate(g.x + sd.dx, sandY(g.x + sd.dx) + sd.r * 0.2); ctx.rotate(sd.a);
      ctx.fillStyle = white; blobPath(sd.pts, sd.r, sd.r * 0.6); ctx.fill();
      if (sd.stripe) { ctx.strokeStyle = blue; ctx.lineWidth = Math.max(0.8, sd.r * 0.18); ctx.beginPath(); ctx.moveTo(-sd.r * 0.6, 0); ctx.quadraticCurveTo(0, -sd.r * 0.4, sd.r * 0.5, sd.r * 0.1); ctx.stroke(); }
      ctx.restore();
    }
    ctx.save(); ctx.translate(g.x, base); ctx.rotate(g.tilt);
    ctx.fillStyle = shade; ctx.beginPath(); ctx.ellipse(0, -s * 0.5, s * 0.9, s * 0.22, 0, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = white; ctx.beginPath(); ctx.moveTo(-s * 0.9, -s * 0.5); ctx.bezierCurveTo(-s * 0.85, s * 0.1, s * 0.85, s * 0.1, s * 0.9, -s * 0.5);
    ctx.ellipse(0, -s * 0.5, s * 0.9, s * 0.22, 0, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = blue; ctx.lineWidth = Math.max(1, s * 0.06);
    ctx.beginPath(); ctx.ellipse(0, -s * 0.5, s * 0.9, s * 0.22, 0, 0, Math.PI); ctx.stroke();
    ctx.lineWidth = Math.max(0.8, s * 0.04); ctx.beginPath();
    // a little flower and two leaves painted on the side
    ctx.arc(0, -s * 0.12, s * 0.12, 0, TAU);
    ctx.moveTo(-s * 0.15, -s * 0.12); ctx.quadraticCurveTo(-s * 0.4, -s * 0.3, -s * 0.55, -s * 0.15);
    ctx.moveTo(s * 0.15, -s * 0.12); ctx.quadraticCurveTo(s * 0.4, -s * 0.3, s * 0.55, -s * 0.15); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "rgba(0,0,0,0.13)"; ctx.beginPath(); ctx.ellipse(g.x, sandY(g.x) + s * 0.2, s * 1.0, s * 0.08, 0, 0, TAU); ctx.fill();
  }

  // A fossil megalodon tooth: a dark triangle with sawtooth edges, as big as a hand.
  function drawMegtooth(g) {
    const s = g.s, base = sandY(g.x) + s * 0.15;
    const enamel = sh("#4a4e5a"), edge = sh("#727888"), rootc = sh("#6a5442");
    ctx.save(); ctx.translate(g.x, base - s * 0.3); ctx.rotate(g.tilt);
    ctx.fillStyle = rootc; ctx.beginPath(); ctx.moveTo(-s * 0.55, s * 0.45); ctx.quadraticCurveTo(0, s * 0.7, s * 0.55, s * 0.45); ctx.lineTo(s * 0.5, s * 0.3); ctx.lineTo(-s * 0.5, s * 0.3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = enamel; ctx.beginPath(); ctx.moveTo(-s * 0.5, s * 0.32);
    // serrated edges up to the point and down again
    const n = 9;
    for (let i = 1; i <= n; i++) { const f = i / n, x = -s * 0.5 + f * s * 0.5, y = s * 0.32 - f * s * 1.0 + Math.sin(f * Math.PI) * s * 0.05; ctx.lineTo(x - s * 0.02, y + s * 0.025); ctx.lineTo(x, y); }
    for (let i = 1; i <= n; i++) { const f = i / n, x = f * s * 0.5, y = -s * 0.68 + f * s * 1.0 + Math.sin(f * Math.PI) * s * 0.05; ctx.lineTo(x + s * 0.02, y - s * 0.025); ctx.lineTo(x, y); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = edge; ctx.beginPath(); ctx.moveTo(-s * 0.1, s * 0.25); ctx.lineTo(0, -s * 0.55); ctx.lineTo(s * 0.12, s * 0.25); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = "rgba(0,0,0,0.13)"; ctx.beginPath(); ctx.ellipse(g.x, sandY(g.x) + s * 0.1, s * 0.6, s * 0.06, 0, 0, TAU); ctx.fill();
  }

  // An ammonite: the spiral of an animal from the time of the dinosaurs, in a slab of cave rock. It lights up gold
  // in the diver's lamp.
  function drawAmmonite(g, k) {
    if (k) g.glow = w12Ease(g.glow, near(g.x, sandY(g.x) - g.s * 0.4, 120 * u) > 0 ? 1 : 0, k, 0.04);
    const s = g.s, base = sandY(g.x) + s * 0.08;
    const rock = sh(water.rock || "#6b6656"), rockHi = sh("#8a8676"), fossil = sh("#c8b490"), rib = sh("#7a6a50");
    ctx.save(); ctx.translate(g.x, base - s * 0.42); ctx.scale(g.dir, 1);
    ctx.fillStyle = rock; blobPath(g.pts, s * 0.9, s * 0.55); ctx.fill();
    ctx.fillStyle = rockHi; ctx.beginPath(); ctx.ellipse(-s * 0.15, -s * 0.2, s * 0.6, s * 0.25, -0.1, 0, TAU); ctx.fill();
    // the shell: a spiral that widens, with ribs across each whorl
    const spiral = th => s * 0.035 * Math.exp(0.21 * th);
    ctx.fillStyle = fossil; ctx.beginPath(); ctx.arc(0, 0, spiral(4.2 * Math.PI) * 1.02, 0, TAU); ctx.fill();
    ctx.strokeStyle = rib; ctx.lineWidth = Math.max(0.8, s * 0.025); ctx.beginPath();
    for (let th = 0; th <= 4.2 * Math.PI; th += 0.1) { const r = spiral(th); th ? ctx.lineTo(Math.cos(th) * r, Math.sin(th) * r) : ctx.moveTo(r, 0); }
    ctx.stroke();
    ctx.lineWidth = Math.max(0.6, s * 0.014); ctx.beginPath();
    for (let th = 1.5; th <= 4.2 * Math.PI; th += 0.32) { const r0 = spiral(th - 2 * Math.PI) || 0, r1 = spiral(th); ctx.moveTo(Math.cos(th) * Math.max(r0, r1 * 0.3), Math.sin(th) * Math.max(r0, r1 * 0.3)); ctx.lineTo(Math.cos(th) * r1, Math.sin(th) * r1); }
    ctx.stroke();
    if (g.glow > 0.02) {
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 0.55);
      grd.addColorStop(0, `rgba(255,214,130,${0.45 * g.glow})`); grd.addColorStop(1, "rgba(255,214,130,0)");
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(0, 0, s * 0.55, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  // Sea balls: brown felt balls of seagrass fibre, made by the waves. They roll to and fro with the water.
  function drawSeaballs(g, k) {
    const fib = sh("#8a6a40"), dark = sh("#5a4428"), light = sh("#b8986a");
    for (const b of g.balls) {
      const off = Math.sin(t * 0.5 + b.ph) * 10 * u + current * 20 * u, x = g.x + b.dx + off, y = sandY(x) - b.r * 0.9;
      const roll = off / b.r;
      ctx.save(); ctx.translate(x, y); ctx.rotate(roll);
      ctx.fillStyle = fib; ctx.beginPath(); ctx.arc(0, 0, b.r, 0, TAU); ctx.fill();
      ctx.lineWidth = Math.max(0.6, b.r * 0.08); ctx.lineCap = "round";
      for (let i = 0; i < 22; i++) {
        const a = i * 2.39, r0 = b.r * (0.3 + (i % 4) * 0.15), a2 = a + 0.5;
        ctx.strokeStyle = i % 3 ? dark : light; ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); ctx.lineTo(Math.cos(a2) * b.r * 1.12, Math.sin(a2) * b.r * 1.12); ctx.stroke();
      }
      ctx.restore();
    }
  }

  // A dropstone: a speckled boulder of a different rock than the rest, carried here inside an iceberg and dropped
  // when the ice melted. A few anemones have settled on it.
  function drawDropstone(g) {
    const s = g.s, base = sandY(g.x) + s * 0.1;
    const stone = sh("#a08478"), top = sh("#b89c90"), dot = sh("#3a2e2a"), fleck = sh("#ece4dc"), anem = sh("#e8a0b8");
    ctx.fillStyle = "rgba(0,0,0,0.13)"; ctx.beginPath(); ctx.ellipse(g.x, sandY(g.x) + s * 0.08, s * 1.0, s * 0.08, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(g.x, base - s * 0.4); ctx.scale(g.dir, 1);
    ctx.fillStyle = stone; blobPath(g.pts, s * 0.9, s * 0.55); ctx.fill();
    ctx.save(); blobPath(g.pts, s * 0.9, s * 0.55); ctx.clip();
    ctx.fillStyle = top; ctx.beginPath(); ctx.ellipse(-s * 0.1, -s * 0.3, s * 0.8, s * 0.35, 0, 0, TAU); ctx.fill();
    for (const [dx, dy, r, white] of g.dots) { ctx.fillStyle = white ? fleck : dot; ctx.beginPath(); ctx.arc(dx * s * 0.85, dy * s * 0.5, r * s, 0, TAU); ctx.fill(); }
    ctx.restore();
    for (let i = 0; i < g.anemones; i++) {
      const ax = (i ? 0.3 : -0.25) * s, ay = -s * 0.5;
      ctx.fillStyle = anem; ctx.fillRect(ax - s * 0.03, ay - s * 0.08, s * 0.06, s * 0.1);
      ctx.strokeStyle = anem; ctx.lineWidth = Math.max(0.8, s * 0.015); ctx.beginPath();
      for (let j = -3; j <= 3; j++) { ctx.moveTo(ax, ay - s * 0.08); ctx.quadraticCurveTo(ax + j * s * 0.025, ay - s * 0.15, ax + j * s * 0.035, ay - s * 0.17); }
      ctx.stroke();
    }
    ctx.restore();
  }

  // A kelp holdfast: the tangle of roots that held a kelp plant to the rock, torn loose by a storm, with a short
  // broken stem. A little crab lives inside and ducks away from the diver; a brittle star waves an arm out of it.
  function drawHoldfast(g, k) {
    if (k) { g.ph += 0.03 * k; g.hide = w12Ease(g.hide, near(g.x, sandY(g.x) - g.s * 0.3, 110 * u) > 0 ? 1 : 0, k, 0.12); }
    const s = g.s, base = sandY(g.x) + s * 0.05;
    const root = sh("#8a6228"), rootLight = sh("#b08440"), stem = sh("#9a7430"), crab = sh("#c86a3a"), star = sh("#b88a98");
    ctx.save(); ctx.translate(g.x, base); ctx.scale(g.dir, 1);
    // a brittle star arm curling out of the tangle
    ctx.strokeStyle = star; ctx.lineWidth = Math.max(1, s * 0.03); ctx.lineCap = "round"; ctx.beginPath();
    for (const [sx, sgn] of [[-0.3, -1], [0.35, 1]]) {
      ctx.moveTo(sx * s, -s * 0.1);
      ctx.bezierCurveTo((sx + sgn * 0.15) * s, -s * 0.15, (sx + sgn * 0.3) * s, -s * (0.05 + Math.sin(g.ph + sx * 5) * 0.08), (sx + sgn * 0.42) * s, -s * (0.12 + Math.sin(g.ph * 1.3 + sx) * 0.1));
    }
    ctx.stroke();
    // the crab peeks out under the roots
    const cy = -s * 0.12 + g.hide * s * 0.16;
    ctx.fillStyle = crab; ctx.beginPath(); ctx.ellipse(s * 0.05, cy, s * 0.14, s * 0.08, 0, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = sh("#202020"); for (const ex of [-0.0, 0.1]) { ctx.beginPath(); ctx.arc(ex * s, cy - s * 0.1, s * 0.022, 0, TAU); ctx.fill(); }
    ctx.strokeStyle = crab; ctx.lineWidth = Math.max(0.8, s * 0.018); ctx.beginPath(); for (const ex of [0, 0.1]) { ctx.moveTo(ex * s, cy - s * 0.06); ctx.lineTo(ex * s, cy - s * 0.09); } ctx.stroke();
    // the roots: branching strands that meet at the stem
    const top = [s * 0.02, -s * 0.5];
    for (const r of g.roots) {
      const ex = Math.sin(r.a) * s * 0.7 * r.len, ey = -s * 0.02;
      ctx.strokeStyle = r.a > 0 ? root : rootLight; ctx.lineWidth = Math.max(1.2, s * 0.045);
      ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.quadraticCurveTo(ex * 0.5 + r.bend * s * 0.3, -s * 0.35, ex, ey); ctx.stroke();
      ctx.lineWidth = Math.max(0.8, s * 0.025); ctx.beginPath(); ctx.moveTo(ex * 0.8, -s * 0.12); ctx.lineTo(ex * 0.8 + Math.sign(ex || 1) * s * 0.08, ey); ctx.stroke();
    }
    // the short broken stem, bending with the water
    ctx.strokeStyle = stem; ctx.lineWidth = Math.max(2, s * 0.08); ctx.beginPath(); ctx.moveTo(top[0], top[1]);
    ctx.quadraticCurveTo(s * 0.05 + Math.sin(g.ph * 0.6) * s * 0.05, -s * 0.75, s * 0.18 + Math.sin(g.ph * 0.6) * s * 0.1, -s * 0.88); ctx.stroke();
    ctx.restore();
  }

  Object.assign(GROUND_DRAW, {
    glassfloat: drawGlassfloat, ducks: drawDucks, pumice: drawPumice, seabeans: drawSeabeans, crate: drawCrate, lobsterpot: drawLobsterpot,
    mammoth: drawMammoth, porcelain: drawPorcelain, megtooth: drawMegtooth, ammonite: drawAmmonite, seaballs: drawSeaballs, dropstone: drawDropstone, holdfast: drawHoldfast,
  });

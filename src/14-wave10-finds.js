  // ---- the tenth round: a find of their own for the Wadden Sea and the Sargasso Sea --------------------------
  // A mussel bed on the Wadden sand, and a piece of driftwood with goose barnacles floating in the Sargasso Sea.
  // They roll from their own random stream (see addWave10Ground in 02-scene.js), so nothing else in an ocean moves.
  function addWave10Ground(s, P, big, small) {
    if (chance(P.mussels || 0)) small.push({ kind: "mussels", w: 110 * u, s: range(30, 38) * u, shut: 0,
      shells: Array.from({ length: 8 + Math.floor(rng() * 4) }, () => ({ dx: range(-1, 1), lift: rng(), a: range(-0.9, 0.5), sc: range(0.8, 1.15), barn: chance(0.35) })) });
    if (chance(P.driftwood || 0)) small.push({ kind: "driftwood", w: 90 * u, s: range(60, 80) * u, ph: range(0, TAU), tilt: range(-0.06, 0.06), shut: 0 });
  }

  // A mussel bed: a clump of blue-black mussels on the sand, some lying down and some upright, a few with a
  // barnacle on top. They hold their shells a little open to filter the water and shut them when the diver comes close.
  const MUSSEL = "M 0 0 C 3 -4 10 -9 18 -10 C 22 -10 23 -7 21 -4 C 16 1 7 3 0 0 Z";
  function drawMussels(g, k) {
    const s = g.s, base = sandY(g.x) + 6 * u;
    const dark = sh("#2a3040"), edge = sh("#4a5a78"), sheen = sh("#8aa0c0"), flesh = sh("#d8904a"), barn = sh("#d8d4c8");
    if (k) g.shut = near(g.x, base - s * 0.3, 110 * u) > 0 ? Math.min(1, g.shut + 0.2 * k) : Math.max(0, g.shut - 0.01 * k);
    const open = 1 - (g.shut || 0);
    ctx.save(); ctx.translate(g.x, base);
    ctx.fillStyle = "rgba(0,0,0,0.13)"; ctx.beginPath(); ctx.ellipse(0, 0, s * 1.4, s * 0.12, 0, 0, TAU); ctx.fill();
    const order = g.shells.slice().sort((a, b) => b.lift - a.lift);
    for (const m of order) {
      const sc = s / 22 * m.sc;
      ctx.save(); ctx.translate(m.dx * s * 1.1, -m.lift * s * 0.35); ctx.rotate(m.a); ctx.scale(sc, sc); ctx.translate(-10, 3);
      // the soft orange edge of the animal shows where the shell gapes
      if (open > 0.05) { ctx.fillStyle = flesh; ctx.beginPath(); ctx.ellipse(10, -1.5, 9, 1.6 * open, -0.35, 0, TAU); ctx.fill(); }
      fillWith(P(MUSSEL), dark);
      ctx.save(); ctx.clip(P(MUSSEL));
      ctx.fillStyle = edge; ctx.fillRect(-2, -14, 30, 4.5);
      ctx.strokeStyle = sheen; ctx.lineWidth = 0.7; ctx.beginPath();
      for (const r of [6, 11, 16]) { ctx.moveTo(r, 2); ctx.quadraticCurveTo(r - 1, -6, r + 2, -9); }
      ctx.stroke();
      ctx.restore();
      if (m.barn) { ctx.fillStyle = barn; ctx.beginPath(); ctx.moveTo(8, -6); ctx.lineTo(10, -10); ctx.lineTo(13, -10); ctx.lineTo(15, -6); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    }
    ctx.restore();
  }

  // Driftwood with goose barnacles: a weathered log bobbing at the surface, with a bunch of goose barnacles hanging
  // from it on dark stalks, white-shelled with orange edges. They comb the water with feathery legs and pull them in
  // when the diver comes close.
  function drawDriftwood(g, k) {
    if (k) g.ph += 0.02 * k;
    const s = g.s, y0 = (typeof waveY === "function" && !g.thumb ? waveY(g.x) : g.y0 || 30) + 3 * u;
    const wood = sh("#6a5238"), grain = sh("#4a3826"), top = sh("#8a7050"), stalk = sh("#3a2a20"), shell = sh("#ece8de"), rim = sh("#d87040"), cirri = sh("#c8a878");
    if (k) g.shut = near(g.x, y0 + s * 0.3, 120 * u) > 0 ? Math.min(1, g.shut + 0.15 * k) : Math.max(0, g.shut - 0.012 * k);
    const out = 1 - (g.shut || 0);
    ctx.save(); ctx.translate(g.x, y0 + Math.sin(g.ph * 2) * 1.5 * u); ctx.rotate(g.tilt + Math.sin(g.ph) * 0.03);
    // the goose barnacles first, hanging under the log
    ctx.lineCap = "round";
    for (let i = 0; i < 7; i++) {
      const x = (-0.38 + i * 0.12) * s, len = s * (0.14 + ((i * 37) % 5) * 0.025), sw = Math.sin(g.ph * 1.5 + i) * 0.12;
      const bx = x + Math.sin(sw) * len, by = s * 0.08 + Math.cos(sw) * len;
      ctx.strokeStyle = stalk; ctx.lineWidth = s * 0.035; ctx.beginPath(); ctx.moveTo(x, s * 0.06); ctx.lineTo(bx, by); ctx.stroke();
      ctx.save(); ctx.translate(bx, by + s * 0.05); ctx.rotate(sw);
      // feathery legs that comb the water
      if (out > 0.05) {
        ctx.strokeStyle = cirri; ctx.lineWidth = Math.max(0.6, s * 0.008); ctx.beginPath();
        for (let j = -2; j <= 2; j++) { const a = Math.PI / 2 + j * 0.25 + Math.sin(g.ph * 4 + i) * 0.2; ctx.moveTo(0, s * 0.05); ctx.quadraticCurveTo(Math.cos(a) * s * 0.06 * out, s * 0.05 + Math.sin(a) * s * 0.08 * out, Math.cos(a + 0.4) * s * 0.1 * out, s * 0.05 + Math.sin(a) * s * 0.13 * out); }
        ctx.stroke();
      }
      ctx.fillStyle = shell; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.035, s * 0.06, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = rim; ctx.beginPath(); ctx.ellipse(0, s * 0.045, s * 0.025, s * 0.012, 0, 0, TAU); ctx.fill();
      ctx.restore();
    }
    // the log: rounded, with a lighter top and lines of grain
    ctx.fillStyle = wood; ctx.beginPath(); ctx.ellipse(0, s * 0.02, s * 0.5, s * 0.09, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = top; ctx.beginPath(); ctx.ellipse(-s * 0.04, -s * 0.03, s * 0.42, s * 0.035, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = grain; ctx.lineWidth = Math.max(0.8, s * 0.012); ctx.beginPath();
    for (const [x0, x1, y] of [[-0.42, -0.05, 0.02], [0.02, 0.36, 0.035], [-0.3, 0.1, 0.06]]) { ctx.moveTo(x0 * s, y * s); ctx.quadraticCurveTo((x0 + x1) / 2 * s, (y - 0.015) * s, x1 * s, y * s); }
    ctx.stroke();
    ctx.fillStyle = grain; ctx.beginPath(); ctx.ellipse(s * 0.49, s * 0.02, s * 0.025, s * 0.07, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  Object.assign(GROUND_DRAW, { mussels: drawMussels, driftwood: drawDriftwood });
  Object.assign(THUMBS, {
    mussels: () => drawMussels({ x: 60, s: 30, shut: 0, shells: [[-0.8, 0, -0.2, 1, 0], [-0.3, 0.3, -0.7, 1.1, 1], [0.2, 0, 0.3, 1, 0], [0.6, 0.5, -0.4, 0.9, 0], [0.9, 0, 0.1, 1, 1], [-0.05, 0.9, -0.9, 1, 0]].map(([dx, lift, a, sc, barn]) => ({ dx, lift, a, sc, barn })) }, 0),
    driftwood: () => {
      ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(0, 28); for (let x = 0; x <= TW; x += 6) ctx.lineTo(x, 28 + Math.sin(x * 0.15) * 1.5); ctx.stroke();
      drawDriftwood({ x: 60, s: 92, ph: 1, tilt: 0.03, shut: 0, thumb: true, y0: 26 }, 0);
    },
  });
  FLOOR_THUMBS.delete("driftwood");

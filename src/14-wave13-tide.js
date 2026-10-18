  // ---- the tide in the Wadden Sea ------------------------------------------------------------
  // Every few minutes it turns to ebb: the water slowly drops by more than a quarter of the screen, sandbanks come up
  // in the distance with seals on them, and after a while the flood brings the water back. Only the water line moves
  // (waveY in 07-surface-and-light.js adds tideDrop), and everything that swims, floats or bubbles already keeps below
  // that line. It runs on time, not on dice, so no ocean changes; where in the cycle an ocean starts is fixed per seed.
  const TIDE_PERIOD = 180; // seconds: about a minute and a half of high water, then ebb, low water and flood
  // the cycle as parts of a period: high water until EBB, falling until LOW, low water until FLOOD, rising until HIGH
  const TIDE_EBB = 0.45, TIDE_LOW = 0.6, TIDE_FLOOD = 0.8, TIDE_HIGH = 0.95;
  const smoothstep = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  function tidePhase() {
    if (!water || !water.mudflat || !scene) return -1;
    if (scene.tideT0 === undefined) {
      scene.tideT0 = t;
      // each ocean starts somewhere in its high water, so the first ebb comes within the first minute or so
      scene.tideOff = 0.05 + ((((seed || 0) * 0.6180339887) % 1 + 1) % 1) * 0.33;
    }
    return ((t - scene.tideT0) / TIDE_PERIOD + scene.tideOff) % 1;
  }
  // 0 at high water, 1 at low water
  function tideLevel() {
    const p = tidePhase();
    if (p < 0) return 0;
    if (p < TIDE_EBB) return 0;
    if (p < TIDE_LOW) return smoothstep((p - TIDE_EBB) / (TIDE_LOW - TIDE_EBB));
    if (p < TIDE_FLOOD) return 1;
    if (p < TIDE_HIGH) return 1 - smoothstep((p - TIDE_FLOOD) / (TIDE_HIGH - TIDE_FLOOD));
    return 0;
  }
  function tideDrop() { return water && water.mudflat ? tideLevel() * H * 0.28 : 0; }
  // for the status line: "eb", "laagwater", "vloed" or "hoogwater"
  function tideLabel() {
    const p = tidePhase();
    if (p < 0) return "";
    const [nl, en] = p < TIDE_EBB || p >= TIDE_HIGH ? ["hoogwater", "high tide"] : p < TIDE_LOW ? ["eb", "ebb"] : p < TIDE_FLOOD ? ["laagwater", "low tide"] : ["vloed", "flood"];
    // a short message once per ocean when the water starts to drop
    if (p >= TIDE_EBB && p < TIDE_LOW && !scene.tideTold && !restMode) { scene.tideTold = true; toast(L("Het wordt eb: het water zakt.", "The tide is going out: the water is dropping.")); }
    return " · " + L(nl, en);
  }

  // The sky above the water at low tide, and far-off sandbanks that come up out of the water with seals resting on them.
  function drawTideSky() {
    const lv = tideLevel();
    if (lv < 0.01) return;
    const drop = tideDrop(), top = 14 * u + drop;
    // the sky, fading in as the water goes down
    ctx.save();
    ctx.globalAlpha = Math.min(1, drop / (24 * u));
    const g = ctx.createLinearGradient(0, 0, 0, top);
    g.addColorStop(0, "#a9c4d2"); g.addColorStop(1, "#e2e8dc");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(0, 0);
    for (let x = 0; x <= W + 10; x += 10) ctx.lineTo(x, waveY(x) + 1);
    ctx.lineTo(W, 0); ctx.closePath(); ctx.fill();
    ctx.restore();
    // sandbanks on the horizon, rising with the falling water
    const rise = smoothstep((lv - 0.3) / 0.7) * 11 * u;
    if (rise < 0.3) return;
    const off = scene.tideOff || 0;
    const banks = [[0.08 + off * 0.3, 0.26], [0.52 + off * 0.2, 0.34], [0.9, 0.18]];
    for (const [cx, w] of banks) {
      const x0 = (cx - w / 2) * W, x1 = (cx + w / 2) * W, base = waveY((x0 + x1) / 2) + 2 * u;
      ctx.fillStyle = "#b4a684";
      ctx.beginPath(); ctx.moveTo(x0, base);
      ctx.bezierCurveTo(x0 + (x1 - x0) * 0.2, base - rise, x0 + (x1 - x0) * 0.8, base - rise, x1, base);
      ctx.closePath(); ctx.fill();
      // a wet shine along the top
      ctx.strokeStyle = "rgba(240,236,220,0.6)"; ctx.lineWidth = Math.max(1, 1.2 * u);
      ctx.beginPath(); ctx.moveTo(x0 + (x1 - x0) * 0.25, base - rise * 0.72); ctx.quadraticCurveTo((x0 + x1) / 2, base - rise * 0.8, x0 + (x1 - x0) * 0.75, base - rise * 0.72); ctx.stroke();
    }
    // seals hauled out on the middle bank at low water
    if (lv > 0.85) {
      const [cx, w] = banks[1], a = Math.min(1, (lv - 0.85) / 0.15);
      ctx.save(); ctx.globalAlpha = a;
      for (const [fx, sc, dir] of [[-0.18, 1, 1], [0.05, 0.85, -1], [0.22, 0.95, 1]]) {
        const x = (cx + fx * w) * W, y = waveY(x) + 2 * u - rise * 0.9, s = 9 * u * sc;
        ctx.fillStyle = "#6c6a66";
        ctx.beginPath(); ctx.ellipse(x, y - s * 0.35, s * 1.3, s * 0.42, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x + dir * s * 1.15, y - s * 0.62, s * 0.42, s * 0.34, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#8e8c86";
        ctx.beginPath(); ctx.ellipse(x - dir * s * 0.2, y - s * 0.22, s * 0.9, s * 0.18, 0, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
  }

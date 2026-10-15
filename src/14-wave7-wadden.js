  // ---- the seventh round: the Wadden Sea ---------------------------------------------------
  // Four animals of the tidal flats. They roll from their own random stream (stream: true in the table at the end),
  // so the oceans that already existed stay exactly the same.

  // A lugworm: you hardly ever see the worm itself. You see its coiled cast of sand on one side and the little
  // funnel where it sucks sand in on the other. Now and then its tail pokes out of the cast to drop a new coil;
  // when the diver comes close it stays down.
  function drawLugworm(f) {
    const s = f.s;
    if (f.show === undefined) { f.show = 0; f.wait = 2 + (f.ph % 6); }
    if (near(f.x, f.cy - s * 0.2, 120 * u) > 0) { f.show = Math.max(0, f.show - 0.08 * frameK); f.wait = 4; }
    else if ((f.wait -= frameK / 60) <= 0) {
      f.show = Math.min(1, f.show + 0.02 * frameK);
      if (f.wait < -3) { f.wait = 6 + Math.random() * 8; }
    } else f.show = Math.max(0, f.show - 0.03 * frameK);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    // the funnel: a shallow dip in the sand
    ctx.fillStyle = sh("#6a5e48"); ctx.beginPath(); ctx.ellipse(-32, 1, 13, 3.4, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = sh("#8a7c60"); ctx.beginPath(); ctx.ellipse(-32, 0, 7, 1.8, 0, 0, TAU); ctx.fill();
    // the cast: a little cone of sand that coils round and round as it piles up, like a heap of spaghetti
    const coil = () => {
      ctx.beginPath();
      for (let i = 0; i <= 90; i++) {
        const t = i / 90, a = t * TAU * 4.2, r = 15 * (1 - t * 0.75);
        const x = 20 + Math.cos(a) * r, y = -2 - t * 13 + Math.sin(a) * r * 0.28;
        if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
    };
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = sh("#8a7c60"); ctx.lineWidth = 6.4; coil(); ctx.stroke();
    ctx.strokeStyle = sh("#b4a688"); ctx.lineWidth = 4; coil(); ctx.stroke();
    ctx.strokeStyle = sh("#d2c6a8"); ctx.lineWidth = 1.2; ctx.translate(0, -1.1); coil(); ctx.stroke(); ctx.translate(0, 1.1);
    // the tail end of the worm, ringed and reddish, wriggling out of the top of the cast
    if (f.show > 0.02) {
      const h = 14 * f.show, sway = Math.sin(f.ph * 3) * 3 * f.show;
      ctx.strokeStyle = sh("#a8505a"); ctx.lineWidth = 4.2;
      ctx.beginPath(); ctx.moveTo(20, -15); ctx.quadraticCurveTo(20 + sway, -15 - h * 0.6, 22 + sway * 1.4, -15 - h); ctx.stroke();
      ctx.strokeStyle = sh("#7a3040"); ctx.lineWidth = 0.9;
      for (let i = 1; i <= 3; i++) { const t = i / 4, y = -15 - h * t, x = 20 + sway * t * 1.2; ctx.beginPath(); ctx.moveTo(x - 2, y); ctx.lineTo(x + 2, y); ctx.stroke(); }
    }
    ctx.restore();
  }

  // A cockle: a ribbed, heart-shaped shell half dug into the sand, with two short siphons that breathe and filter
  // the water. When the diver comes close it pulls them in.
  const COCKLE_SHELL = "M -22 0 C -23 -14 -12 -25 0 -25 C 12 -25 23 -14 22 0 Z";
  function drawCockle(f) {
    const s = f.s;
    if (f.open === undefined) { f.open = 1; f.shut = 0; }
    if (near(f.x, f.cy - s * 0.2, 100 * u) > 0) { if (f.open > 0.5) sfxPlip(); f.open = Math.max(0, f.open - 0.3 * frameK); f.shut = 2; }
    else if ((f.shut -= frameK / 60) <= 0) f.open = Math.min(1, f.open + 0.015 * frameK);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    // the siphons first, so the shell is in front of them
    if (f.open > 0.03) {
      for (const [x, lean] of [[-5, -0.2], [5, 0.15]]) {
        const h = (9 + Math.sin(f.ph * 1.5 + x) * 1.2) * f.open;
        ctx.save(); ctx.translate(x, -20); ctx.rotate(lean);
        ctx.fillStyle = sh("#d8c8a8"); ctx.fillRect(-2.6, -h, 5.2, h + 2);
        ctx.fillStyle = sh("#a89070"); ctx.beginPath(); ctx.ellipse(0, -h, 2.8, 1.2, 0, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }
    fillWith(P(COCKLE_SHELL), sh("#e8dcc0"));
    // the ribs fan out from the top of the shell (the hinge), and growth rings run round it
    ctx.save(); ctx.clip(P(COCKLE_SHELL));
    ctx.strokeStyle = sh("#b8a07a"); ctx.lineWidth = 1.5;
    ctx.beginPath(); for (let i = -7; i <= 7; i++) { ctx.moveTo(0, -27); ctx.lineTo(i * 3.6, 2); } ctx.stroke();
    ctx.strokeStyle = sh("#c8b490"); ctx.lineWidth = 1.1;
    ctx.beginPath(); for (const r of [12, 20]) { ctx.moveTo(-r, -27); ctx.ellipse(0, -27, r, r * 0.95, 0, Math.PI, 0, true); } ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = sh("#a89070"); ctx.lineWidth = 0.8; ctx.stroke(P(COCKLE_SHELL));
    ctx.restore();
  }

  // A brown shrimp: sand-coloured and almost see-through, with speckles, long feelers and a tail fan. It glides
  // just over the sand; when the diver comes close it flicks its tail and darts off.
  const SHRIMP_BODY = "M 40 -1 C 36 -7 24 -10 10 -10 C -6 -10 -22 -8 -32 -4 L -34 2 C -24 5 -8 6 8 6 C 24 6 36 4 40 -1 Z";
  const SHRIMP_FAN = "M 0 0 L -11 -8 L -15 -2 L -15 2 L -11 8 Z";
  function drawShrimp(f) {
    const s = f.s;
    sandShadow(f, s * 0.28);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const body = sh("#c8bca0"), dark = sh("#7a6a50");
    ctx.globalAlpha = 0.88;
    ctx.save(); ctx.translate(-33, -1); ctx.rotate(Math.sin(f.ph * 2.4) * 0.25); fillWith(P(SHRIMP_FAN), dark); ctx.restore();
    fillWith(P(SHRIMP_BODY), body);
    // the segments of the tail and a scatter of dark speckles
    ctx.save(); ctx.clip(P(SHRIMP_BODY));
    ctx.strokeStyle = dark; ctx.lineWidth = 0.9;
    ctx.beginPath(); for (let i = 0; i < 5; i++) { const x = -26 + i * 7; ctx.moveTo(x, -12); ctx.quadraticCurveTo(x + 2, -2, x, 8); } ctx.stroke();
    ctx.fillStyle = dark;
    ctx.beginPath(); for (const [x, y] of [[-20, -4], [-8, -6], [4, -3], [14, -7], [24, -4], [-14, 1], [10, 2]]) { ctx.moveTo(x + 1.1, y); ctx.arc(x, y, 1.1, 0, TAU); } ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
    // walking legs underneath, paddling
    ctx.strokeStyle = dark; ctx.lineWidth = 1; ctx.lineCap = "round";
    ctx.beginPath(); for (let i = 0; i < 5; i++) { const x = 22 - i * 7, sw = Math.sin(f.ph * 6 + i) * 2; ctx.moveTo(x, 5); ctx.lineTo(x - 2 + sw, 11); } ctx.stroke();
    // two long feelers that sweep forward, and the eyes on top of the head
    ctx.strokeStyle = sh("#a8987a"); ctx.lineWidth = 0.8;
    ctx.beginPath(); for (const [a, b] of [[0, 0.6], [1, -0.4]]) { ctx.moveTo(36, -5); ctx.quadraticCurveTo(58, -14 + a * 6, 74 + Math.sin(f.ph * 1.5 + b) * 4, -6 + b * 10); } ctx.stroke();
    ctx.fillStyle = "#1a1a1a"; ctx.beginPath(); ctx.arc(32, -9, 2.4, 0, TAU); ctx.arc(28, -9.5, 2, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function dartShrimp(f) {
    if (near(f.x, f.cy || 0, 100 * u) > 0) f.tx = Math.max(30 * u, Math.min(W - 30 * u, f.x + (Math.sign(f.x - diver.x) || 1) * 140 * u));
  }

  // A common eider, a drake: a white back and breast, a black belly and cap, a pale green nape and a long sloping
  // bill. It floats on the swell and now and then dives down for cockles, which it swallows whole.
  const EID_BODY = "M -40 -4 C -38 -18 -16 -24 6 -22 C 16 -22 22 -24 25 -30 C 28 -38 37 -42 43 -38 C 47 -35 47 -29 44 -25 C 40 -20 35 -14 32 -6 C 26 3 2 6 -22 5 C -34 4 -42 2 -40 -4 Z";
  const EID_BILL = "M 42 -37 C 50 -35 56 -31 59 -27 C 54 -25.5 48 -26 43 -28 Z";
  function drawEider(f) {
    const s = f.s, under = f.under || 0;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const white = sh("#f2efe6"), black = sh("#1a1c20"), green = sh("#a8d0a0"), bill = sh("#9aa88a");
    if (under < 0.12) {
      ctx.save(); ctx.translate(-6, 3); ctx.rotate(Math.sin(f.ph * 2) * 0.5); fillUnder(P("M -3 0 L 3 0 L 6 10 L -6 10 Z"), sh("#8a8a6a")); ctx.restore();
      fillWith(P(EID_BODY), white);
      // black flanks and tail, a black cap, and the soft green nape
      paintInside(P(EID_BODY), black, P("M -60 -9 C -30 -6 0 -6 32 -10 L 40 20 L -60 20 Z"));
      paintInside(P(EID_BODY), black, P("M -60 -30 L -30 -30 L -30 10 L -60 10 Z"));
      paintInside(P(EID_BODY), black, P("M 26 -46 L 50 -46 L 50 -35 C 44 -34 34 -34 26 -36 Z"));
      paintInside(P(EID_BODY), green, P("M 24 -32 C 28 -26 32 -24 36 -26 C 36 -30 30 -34 24 -34 Z"));
      fillWith(P(EID_BILL), bill);
      ctx.fillStyle = "#101010"; ctx.beginPath(); ctx.arc(40, -33, 1.6, 0, TAU); ctx.fill();
      underVeil(P(EID_BODY));
      ripple(-38, 30, f.ph);
    } else {
      // under water: wings half open, feet paddling behind
      ctx.rotate((f.diveDir || 0) * 0.45 + Math.sin(f.ph) * 0.08);
      ctx.fillStyle = sh("#8a8a6a"); ctx.beginPath(); ctx.moveTo(-36, 0); ctx.lineTo(-48, -4 + Math.sin(f.ph * 6) * 3); ctx.lineTo(-48, 5 + Math.sin(f.ph * 6) * 3); ctx.fill();
      ctx.fillStyle = black; ctx.beginPath(); ctx.ellipse(0, 0, 38, 12, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = white; ctx.beginPath(); ctx.ellipse(4, -5, 28, 6, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = white; ctx.beginPath(); ctx.arc(35, -3, 10, 0, TAU); ctx.fill();
      ctx.fillStyle = black; ctx.beginPath(); ctx.ellipse(36, -9, 8, 3.5, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = bill; ctx.beginPath(); ctx.moveTo(43, -6); ctx.quadraticCurveTo(50, -4, 56, 0); ctx.lineTo(43, 1); ctx.fill();
      ctx.save(); ctx.translate(6, -6); ctx.rotate(-0.3 + Math.sin(f.ph * 8) * 0.6); ctx.fillStyle = black; ctx.beginPath(); ctx.ellipse(-12, 0, 16, 4.5, 0, 0, TAU); ctx.fill(); ctx.restore();
      if (Math.random() < 0.06) bubbles.push({ x: f.x, y: f.cy - s * 0.1, r: (1 + Math.random()) * u, ph: Math.random() * TAU });
    }
    ctx.restore();
  }

  // ---- the table of the seventh round -----------------------------------------------------
  const W7_FAUNA = {
    lugworm: { kind: "floor", size: [16, 20], count: [2, 4], draw: drawLugworm, thumb: 84, stream: true },
    cockle: { kind: "floor", size: [12, 15], count: [2, 4], draw: drawCockle, thumb: 76, stream: true },
    shrimp: { kind: "glide", size: [16, 20], count: [2, 3], lift: [3, 9], speed: 0.3, draw: drawShrimp, react: dartShrimp, thumb: 84, stream: true },
    eider: { kind: "dive", size: [26, 30], speed: 0.22, draw: drawEider, thumb: 66, stream: true },
  };
  Object.assign(FAUNA, W7_FAUNA);
  hookFauna(W7_FAUNA, {});
  THUMBS.lugworm = () => { const o = { x: 54, cy: sandY(60) + 4, dir: 1, s: 84, ph: 1.2, show: 1, wait: 99 }; drawLugworm(o); };

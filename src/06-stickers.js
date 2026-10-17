  // ---- the stickers ---------------------------------------------------------------------------------------------
  // Every milestone with a sticker has its own little picture, drawn only for the sticker (not a logbook photo).
  // They are drawn on a square of 100 by 100 with the picture inside a circle; the page makes it round and gives it
  // a paper edge. Same style as the animals: flat shapes without an outline, light from above, lines only for thin parts.
  const STICKER_ART = {
    // Rescuer: a life ring with a freed fish swimming through it
    rd: g => {
      stBack(g, "#9fd8ec", "#4f9fc6", 64);
      g.lineWidth = 15; g.strokeStyle = "#fbf7ee"; g.beginPath(); g.arc(50, 50, 24, 0, TAU); g.stroke();
      g.strokeStyle = "#e0483e";
      for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(50, 50, 24, i * TAU / 4 - 0.35, i * TAU / 4 + 0.35); g.stroke(); }
      g.lineWidth = 2; g.strokeStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.arc(50, 50, 29, Math.PI * 1.1, Math.PI * 1.45); g.stroke();
      stFish(g, 52, 52, 22, "#f29a2e", "#c9701a");
      stHeart(g, 79, 22, 7, "#e0483e");
    },
    // North Sea expert: a herring gull over the grey-green waves
    nz: g => {
      stBack(g, "#d6e7ef", "#5d8aa3", 70);
      stWaves(g, 70, "#7aa3b8", 6);
      // wings
      stPath(g, "M44 46 C36 34 26 26 10 26 C20 32 28 40 36 50 Z", "#a7b3bb");
      stPath(g, "M10 26 C14 27 17 29 20 31 L16 32 Z", "#2a2f33");
      stPath(g, "M56 45 C62 32 72 22 88 18 C80 28 72 38 64 50 Z", "#94a1aa");
      stPath(g, "M88 18 C84 21 82 23 79 26 L84 27 Z", "#2a2f33");
      // body, tail and head
      g.fillStyle = "#fbfbf8"; g.beginPath(); g.ellipse(50, 50, 17, 7.5, -0.08, 0, TAU); g.fill();
      stPath(g, "M34 51 L24 47 L26 55 Z", "#eef0f0");
      g.fillStyle = "#fbfbf8"; g.beginPath(); g.arc(65, 46, 6.5, 0, TAU); g.fill();
      stPath(g, "M70 45 L80 47 L70 49 Z", "#f2c230");
      g.fillStyle = "#e0483e"; g.beginPath(); g.arc(75.5, 47.8, 1.1, 0, TAU); g.fill();
      stEye(g, 66.5, 44.5, 1.3);
      g.fillStyle = "rgba(0,0,0,0.06)"; g.beginPath(); g.ellipse(50, 53.5, 14, 3, -0.08, 0, TAU); g.fill();
    },
    // Deep-sea diver: a diving bell with a lit porthole in the dark
    dz: g => {
      stBack(g, "#0e2236", "#060d18", 100);
      for (const [x, y, r] of [[18, 30, 1.4], [80, 24, 1.1], [24, 74, 1.2], [84, 70, 1.5], [70, 86, 1], [12, 52, 1]]) stGlow(g, x, y, r, "#8fe3ff");
      g.strokeStyle = "#3a4a58"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(50, 0); g.lineTo(50, 30); g.stroke();
      // the beam from the porthole
      const beam = g.createLinearGradient(56, 54, 96, 84);
      beam.addColorStop(0, "rgba(255,226,140,0.55)"); beam.addColorStop(1, "rgba(255,226,140,0)");
      g.fillStyle = beam; g.beginPath(); g.moveTo(54, 50); g.lineTo(100, 70); g.lineTo(100, 100); g.lineTo(58, 60); g.closePath(); g.fill();
      g.fillStyle = "#6c7d8c"; g.beginPath(); g.arc(50, 54, 23, 0, TAU); g.fill();
      g.save(); g.beginPath(); g.arc(50, 54, 23, 0, TAU); g.clip();
      g.fillStyle = "#4c5b69"; g.fillRect(20, 60, 60, 30); g.restore();
      g.fillStyle = "#8a9aa8"; g.beginPath(); g.ellipse(50, 31, 7, 3, 0, 0, TAU); g.fill();
      g.fillStyle = "#3b4752"; g.beginPath(); g.arc(54, 52, 11, 0, TAU); g.fill();
      stGlow(g, 54, 52, 8, "#ffe18c");
      for (let i = 0; i < 8; i++) { const a = i * TAU / 8; g.fillStyle = "#9aa9b6"; g.beginPath(); g.arc(54 + Math.cos(a) * 13.5, 52 + Math.sin(a) * 13.5, 1.3, 0, TAU); g.fill(); }
    },
    // Reef expert: a brain coral with a little yellow fish
    wr: g => {
      stBack(g, "#5cc9d6", "#2b93ad", 100);
      stRays(g, "rgba(255,255,255,0.13)");
      g.fillStyle = "#ead9a8"; g.fillRect(0, 76, 100, 24);
      g.fillStyle = "#e88a5e"; g.beginPath(); g.ellipse(46, 78, 34, 32, 0, Math.PI, TAU); g.fill();
      g.fillStyle = "#cf6a42"; g.beginPath(); g.ellipse(46, 78, 34, 9, 0, Math.PI, TAU); g.fill();
      g.strokeStyle = "#c25d38"; g.lineWidth = 1.5; g.lineCap = "round";
      for (const [y, a] of [[54, 16], [61, 25], [68, 30], [74, 32]]) {
        g.beginPath();
        for (let x = 46 - a; x <= 46 + a; x += 2) { const yy = y + Math.sin(x * 0.6) * 2; x === 46 - a ? g.moveTo(x, yy) : g.lineTo(x, yy); }
        g.stroke();
      }
      g.fillStyle = "#c86a9e"; g.beginPath(); g.ellipse(82, 80, 7, 5, 0, Math.PI, TAU); g.fill();
      stFish(g, 68, 26, 20, "#f6d23a", "#d8a81c");
      stBubbles(g, [[30, 30, 2.4], [26, 22, 1.8], [33, 15, 1.3]]);
    },
    // Kelp expert: a kelp frond with its round floats, and an urchin on the rock
    wk: g => {
      stBack(g, "#3d9183", "#1f5a55", 100);
      stRays(g, "rgba(230,255,220,0.12)");
      g.fillStyle = "#2d4a46"; g.beginPath(); g.ellipse(40, 98, 46, 16, 0, 0, TAU); g.fill();
      g.strokeStyle = "#8a6a26"; g.lineWidth = 3; g.lineCap = "round";
      g.beginPath(); g.moveTo(42, 90); g.bezierCurveTo(30, 66, 58, 46, 46, 8); g.stroke();
      const leaves = [[40, 72, -1], [46, 58, 1], [48, 44, -1], [50, 30, 1], [47, 17, -1]];
      for (const [x, y, s] of leaves) {
        g.fillStyle = "#c79a36"; g.beginPath(); g.ellipse(x + s * 12, y - 2, 13, 4.2, s * -0.5, 0, TAU); g.fill();
        g.fillStyle = "#a57c24"; g.beginPath(); g.ellipse(x + s * 12, y - 0.6, 11, 1.6, s * -0.5, 0, TAU); g.fill();
        g.fillStyle = "#d9b54e"; g.beginPath(); g.arc(x + s * 1.5, y, 3, 0, TAU); g.fill();
      }
      g.strokeStyle = "#5b2e6e"; g.lineWidth = 1.2;
      for (let i = 0; i < 12; i++) { const a = Math.PI + i * Math.PI / 11; g.beginPath(); g.moveTo(74, 86); g.lineTo(74 + Math.cos(a) * 13, 86 + Math.sin(a) * 13); g.stroke(); }
      g.fillStyle = "#7a3f8f"; g.beginPath(); g.arc(74, 86, 7, Math.PI, TAU); g.fill();
    },
    // Polar explorer: an iceberg, with most of it under water
    wi: g => {
      stBack(g, "#dceff7", "#2b6a96", 40);
      stWaves(g, 40, "#3577a3", 4);
      stPath(g, "M30 41 L14 58 L18 80 L38 94 L64 92 L84 74 L82 52 L70 41 Z", "#7fb8d8");
      stPath(g, "M38 46 L26 60 L30 76 L44 86 L60 84 L74 70 L72 54 L64 46 Z", "#94c7e2");
      stPath(g, "M28 41 L40 16 L50 24 L58 8 L72 41 Z", "#fbfdff");
      stPath(g, "M58 8 L72 41 L62 41 L55 22 Z", "#cfe3ee");
      g.fillStyle = "rgba(255,255,255,0.6)"; g.fillRect(0, 40, 100, 1.6);
      stStar(g, 18, 18, 3.5, "#ffffff"); stStar(g, 84, 22, 2.6, "#ffffff");
    },
    // Root crawler: a mangrove tree on its arching roots, with a crab on one of them
    wm: g => {
      stBack(g, "#f4e2ad", "#4f9b86", 58);
      g.fillStyle = "#3f7d4a"; for (const [x, y, r] of [[34, 30, 15], [52, 22, 17], [70, 31, 14], [50, 36, 15]]) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
      g.fillStyle = "#5a9a55"; for (const [x, y, r] of [[40, 22, 8], [58, 16, 8]]) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
      g.strokeStyle = "#6b4a2e"; g.lineCap = "round";
      g.lineWidth = 5; g.beginPath(); g.moveTo(50, 40); g.lineTo(50, 52); g.stroke();
      g.lineWidth = 2.6;
      for (const [x2, c] of [[22, -18], [34, -8], [64, 8], [78, 18]]) { g.beginPath(); g.moveTo(50, 50); g.quadraticCurveTo(50 + c, 44, x2, 82); g.stroke(); }
      g.globalAlpha = 0.25; g.fillStyle = "#ffffff"; g.fillRect(0, 57, 100, 1.5); g.globalAlpha = 1;
      // the crab on the right root
      g.fillStyle = "#d8502e"; g.beginPath(); g.ellipse(70, 52, 5, 3.5, 0.5, 0, TAU); g.fill();
      g.strokeStyle = "#b03c20"; g.lineWidth = 1;
      for (const s of [-1, 1]) { g.beginPath(); g.moveTo(70 + s * 3, 54); g.lineTo(70 + s * 6, 57); g.stroke(); }
      g.fillStyle = "#e8653e"; g.beginPath(); g.arc(66, 48, 1.8, 0, TAU); g.arc(74, 51, 1.8, 0, TAU); g.fill();
    },
    // Cave diver: a torch beam in the dark mouth of a cave
    wg: g => {
      stBack(g, "#0d1a20", "#081014", 100);
      g.fillStyle = "#24363c"; g.beginPath(); g.moveTo(0, 0); g.lineTo(100, 0); g.lineTo(100, 100); g.lineTo(84, 100);
      g.bezierCurveTo(88, 60, 80, 28, 52, 24); g.bezierCurveTo(26, 22, 14, 52, 18, 100); g.lineTo(0, 100); g.closePath(); g.fill();
      g.fillStyle = "#2f454c"; for (const [x, w, h] of [[38, 4, 9], [50, 3, 6], [62, 4, 10], [72, 3, 7]]) stPath(g, `M${x - w} ${26 + (x - 50) * (x - 50) / 140} L${x} ${26 + h + (x - 50) * (x - 50) / 140} L${x + w} ${26 + (x - 50) * (x - 50) / 140} Z`, "#2f454c");
      const beam = g.createLinearGradient(30, 80, 76, 40);
      beam.addColorStop(0, "rgba(255,236,170,0.75)"); beam.addColorStop(1, "rgba(255,236,170,0)");
      g.fillStyle = beam; g.beginPath(); g.moveTo(34, 76); g.lineTo(62, 30); g.lineTo(84, 50); g.lineTo(38, 82); g.closePath(); g.fill();
      g.save(); g.translate(32, 80); g.rotate(-0.85);
      g.fillStyle = "#e0c03c"; g.fillRect(-12, -4, 14, 8); g.fillStyle = "#3a3f44"; g.fillRect(2, -5, 4, 10); g.restore();
      stBubbles(g, [[26, 68, 1.8], [24, 60, 1.4], [27, 53, 1.1]]);
    },
    // Lagoon expert: a palm on a little island in turquoise water
    wl: g => {
      stBack(g, "#bfe9f2", "#4fcac0", 64);
      g.fillStyle = "#ffd35c"; g.beginPath(); g.arc(78, 22, 9, 0, TAU); g.fill();
      g.fillStyle = "#3aa9a6"; g.fillRect(0, 76, 100, 24);
      g.fillStyle = "#f2dc9e"; g.beginPath(); g.ellipse(46, 66, 26, 6, 0, 0, TAU); g.fill();
      g.strokeStyle = "#8a6a3e"; g.lineWidth = 3.6; g.lineCap = "round";
      g.beginPath(); g.moveTo(42, 64); g.quadraticCurveTo(38, 44, 50, 28); g.stroke();
      for (const [a, l] of [[-2.7, 20], [-2.1, 18], [-1.1, 18], [-0.4, 20], [0.3, 15]]) {
        g.save(); g.translate(50, 28); g.rotate(a);
        stPath(g, `M0 0 Q${l * 0.5} -6 ${l} 3 Q${l * 0.5} 0 0 2 Z`, "#3faa5a"); g.restore();
      }
      g.fillStyle = "#7a5a2c"; g.beginPath(); g.arc(48, 31, 2.2, 0, TAU); g.arc(52.5, 31.5, 2.2, 0, TAU); g.fill();
      g.globalAlpha = 0.5; g.fillStyle = "#ffffff"; g.fillRect(12, 71, 14, 1.4); g.fillRect(64, 74, 18, 1.4); g.globalAlpha = 1;
    },
    // Weed wanderer: a drifting sprig of sargassum with its little floats
    ws: g => {
      stBack(g, "#79bde0", "#1e5f94", 30);
      stRays(g, "rgba(255,255,255,0.12)");
      g.strokeStyle = "#a97a1e"; g.lineWidth = 2; g.lineCap = "round";
      const stems = [[50, 88, 50, 18], [50, 66, 26, 40], [50, 56, 76, 34], [50, 76, 74, 64], [50, 74, 28, 70]];
      for (const [x1, y1, x2, y2] of stems) { g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo((x1 + x2) / 2 + 4, (y1 + y2) / 2, x2, y2); g.stroke(); }
      const leaf = (x, y, a) => { g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = "#c9962e"; g.beginPath(); g.ellipse(5, 0, 6, 2, 0, 0, TAU); g.fill(); g.restore(); };
      for (const [x, y, a] of [[50, 30, -0.6], [50, 44, 3.6], [36, 50, -2.6], [64, 44, -0.4], [62, 70, 0.4], [38, 72, 3.4], [50, 58, 0.3], [30, 42, -2], [70, 36, -0.8]]) leaf(x, y, a);
      g.fillStyle = "#e3b64a";
      for (const [x, y] of [[52, 20], [47, 23], [26, 40], [29, 37], [76, 34], [73, 32], [74, 64], [71, 66], [28, 70], [31, 72]]) { g.beginPath(); g.arc(x, y, 2.4, 0, TAU); g.fill(); }
    },
    // Mudflat walker: the Wadden Sea at low tide, with a seal on the sandbank and a lugworm's cast in the wet sand
    wd: g => {
      stBack(g, "#d9e6ea", "#b9cfd6", 100);
      g.fillStyle = "#f2e6c4"; g.beginPath(); g.arc(78, 20, 7, 0, TAU); g.fill();
      // the flat: wet sand, a gully of water and the dry sandbank behind it
      g.fillStyle = "#c8b48a"; g.fillRect(0, 44, 100, 56);
      stPath(g, "M0 58 C20 54 34 62 52 58 C70 54 84 60 100 56 L100 66 C82 70 70 64 52 68 C34 72 18 64 0 68 Z", "#7fa3ae");
      g.fillStyle = "rgba(255,255,255,0.45)"; g.fillRect(18, 61, 12, 1.2); g.fillRect(60, 60, 16, 1.2);
      stPath(g, "M0 44 C24 40 40 46 62 42 C78 40 90 44 100 42 L100 50 C80 52 60 48 40 52 C24 54 10 50 0 52 Z", "#dccaa0");
      // a seal resting on the sandbank
      g.save(); g.translate(40, 45); g.scale(1.45, 1.45); g.translate(-40, -45);
      g.fillStyle = "#8d8a82"; g.beginPath(); g.ellipse(38, 44, 15, 5.5, -0.08, 0, TAU); g.fill();
      g.fillStyle = "#a8a59c"; g.beginPath(); g.ellipse(36, 46, 11, 2.6, -0.08, 0, TAU); g.fill();
      g.fillStyle = "#8d8a82"; g.beginPath(); g.arc(53, 40, 5, 0, TAU); g.fill();
      stPath(g, "M23 44 L17 40 L18 46 Z", "#7a776f");
      stEye(g, 55, 39, 1.1);
      g.fillStyle = "#3a3a36"; g.beginPath(); g.arc(57.6, 41, 0.8, 0, TAU); g.fill();
      g.restore();
      // ripples in the wet sand and a lugworm's cast with its little pit
      g.strokeStyle = "rgba(120,96,58,0.45)"; g.lineWidth = 1.2; g.lineCap = "round";
      for (const y of [76, 84, 92]) { g.beginPath(); for (let x = 4; x <= 96; x += 2) { const yy = y + Math.sin(x * 0.35) * 1.2; x === 4 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
      g.strokeStyle = "#a88f62"; g.lineWidth = 3;
      g.beginPath(); g.moveTo(58, 82); g.bezierCurveTo(52, 76, 66, 74, 62, 80); g.bezierCurveTo(58, 86, 72, 86, 70, 79); g.bezierCurveTo(68, 74, 78, 76, 76, 82); g.stroke();
      g.fillStyle = "#9c8558"; g.beginPath(); g.ellipse(36, 80, 3.4, 1.6, 0, 0, TAU); g.fill();
      // a cockle shell
      g.fillStyle = "#efe4cf"; g.beginPath(); g.arc(22, 90, 4, Math.PI, TAU); g.fill();
      g.strokeStyle = "rgba(150,120,80,0.6)"; g.lineWidth = 0.8; for (const dx of [-2, 0, 2]) { g.beginPath(); g.moveTo(22, 90); g.lineTo(22 + dx * 1.4, 86.4); g.stroke(); }
    },
    // Stargazer: a crescent moon and a shooting star over the night sea
    sk: g => {
      stBack(g, "#1b2752", "#0f1838", 74);
      for (const [x, y, r] of [[20, 26, 2], [32, 14, 1.4], [62, 16, 1.6], [84, 46, 1.8], [16, 54, 1.3], [44, 40, 1.1]]) stStar(g, x, y, r * 1.4, "#f6edc4");
      g.fillStyle = "#f6e7a6"; g.beginPath(); g.arc(68, 34, 14, 0, TAU); g.fill();
      g.fillStyle = "#1b2752"; g.beginPath(); g.arc(74, 29, 12, 0, TAU); g.fill();
      const tail = g.createLinearGradient(12, 70, 42, 56);
      tail.addColorStop(0, "rgba(246,237,196,0)"); tail.addColorStop(1, "rgba(246,237,196,0.9)");
      g.strokeStyle = tail; g.lineWidth = 2.4; g.lineCap = "round"; g.beginPath(); g.moveTo(12, 72); g.lineTo(42, 56); g.stroke();
      stStar(g, 43, 55.5, 3.6, "#fff6d6");
      stWaves(g, 76, "#22336a", 5);
      g.globalAlpha = 0.35; g.fillStyle = "#f6e7a6"; g.fillRect(60, 82, 14, 1.4); g.fillRect(63, 88, 8, 1.4); g.globalAlpha = 1;
    },
    // Keeper-upper: an anchor with a rope, for holding on seven days
    vh: g => {
      stBack(g, "#f4cf5e", "#e6b23c", 100);
      g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.arc(50, 50, 40, 0, TAU); g.fill();
      const ink = "#2c3e5c";
      g.strokeStyle = ink; g.lineCap = "round";
      g.lineWidth = 4; g.beginPath(); g.arc(50, 20, 6, 0, TAU); g.stroke();
      g.lineWidth = 6; g.beginPath(); g.moveTo(50, 26); g.lineTo(50, 80); g.stroke();
      g.lineWidth = 5; g.beginPath(); g.moveTo(36, 36); g.lineTo(64, 36); g.stroke();
      g.lineWidth = 5; g.beginPath(); g.arc(50, 56, 25, 0.35, Math.PI - 0.35); g.stroke();
      stPath(g, "M23 58 L28 46 L33 58 Z", ink); stPath(g, "M77 58 L72 46 L67 58 Z", ink);
      g.strokeStyle = "#d2553f"; g.lineWidth = 2.6;
      g.beginPath(); g.moveTo(56, 20); g.bezierCurveTo(70, 26, 34, 34, 50, 44); g.bezierCurveTo(64, 52, 36, 58, 46, 68); g.stroke();
      g.fillStyle = "#fbf7ee"; g.beginPath(); g.arc(76, 76, 10, 0, TAU); g.fill();
      g.fillStyle = ink; g.font = "600 15px Figtree, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("7", 76, 77);
    },
    // Photo hunter: an underwater camera in its orange housing
    fj: g => {
      stBack(g, "#6cc3df", "#2f8cb5", 100);
      stRays(g, "rgba(255,255,255,0.13)");
      g.strokeStyle = "#37424c"; g.lineWidth = 2.4; g.beginPath(); g.moveTo(24, 40); g.lineTo(18, 26); g.lineTo(28, 18); g.stroke();
      g.fillStyle = "#e9eef2"; g.beginPath(); g.ellipse(30, 17, 7, 5, -0.5, 0, TAU); g.fill();
      stRound(g, 20, 38, 60, 36, 9, "#f2a33a");
      stRound(g, 20, 38, 60, 9, 6, "#f7bc5e");
      stRound(g, 26, 31, 12, 8, 3, "#37424c");
      g.fillStyle = "#1f2a36"; g.beginPath(); g.arc(52, 57, 15, 0, TAU); g.fill();
      g.fillStyle = "#2f6f9a"; g.beginPath(); g.arc(52, 57, 10, 0, TAU); g.fill();
      g.fillStyle = "#62a8d1"; g.beginPath(); g.arc(49, 54, 4, 0, TAU); g.fill();
      g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.arc(47.5, 52.5, 1.6, 0, TAU); g.fill();
      g.fillStyle = "#e0483e"; g.beginPath(); g.arc(73, 45, 2, 0, TAU); g.fill();
      stBubbles(g, [[82, 30, 2.4], [86, 22, 1.7], [80, 15, 1.2]]);
    },
  };

  // background: a circle in two tones, the lower one from height `cut` (100 = no second tone)
  function stBack(g, top, bottom, cut) {
    g.fillStyle = top; g.fillRect(0, 0, 100, 100);
    if (cut < 100) { g.fillStyle = bottom; g.fillRect(0, cut, 100, 100 - cut); }
    else { const gr = g.createLinearGradient(0, 0, 0, 100); gr.addColorStop(0, top); gr.addColorStop(1, bottom); g.fillStyle = gr; g.fillRect(0, 0, 100, 100); }
  }
  function stPath(g, d, col) { g.fillStyle = col; g.fill(new Path2D(d)); }
  function stRound(g, x, y, w, h, r, col) { g.fillStyle = col; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); }
  function stEye(g, x, y, r) {
    g.fillStyle = "#101418"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.arc(x - r * 0.3, y - r * 0.36, r * 0.34, 0, TAU); g.fill();
  }
  function stGlow(g, x, y, r, col) {
    const gr = g.createRadialGradient(x, y, 0, x, y, r * 2.4);
    gr.addColorStop(0, col); gr.addColorStop(0.4, col); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * 2.4, 0, TAU); g.fill();
  }
  function stStar(g, x, y, r, col) {
    g.fillStyle = col; g.beginPath();
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, rr = i % 2 ? r * 0.38 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    g.closePath(); g.fill();
  }
  function stHeart(g, x, y, s, col) {
    g.fillStyle = col; g.beginPath(); g.moveTo(x, y + s * 0.9);
    g.bezierCurveTo(x - s * 1.4, y - s * 0.1, x - s * 0.6, y - s * 1.1, x, y - s * 0.35);
    g.bezierCurveTo(x + s * 0.6, y - s * 1.1, x + s * 1.4, y - s * 0.1, x, y + s * 0.9); g.fill();
  }
  function stWaves(g, y, col, amp) {
    g.fillStyle = col; g.beginPath(); g.moveTo(0, 100); g.lineTo(0, y);
    for (let x = 0; x <= 100; x += 2) g.lineTo(x, y + Math.sin(x * 0.18) * amp * 0.4 + amp * 0.4);
    g.lineTo(100, 100); g.closePath(); g.fill();
  }
  function stRays(g, col) {
    g.fillStyle = col;
    for (const [x, w] of [[18, 8], [44, 12], [72, 7]]) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + w, 0); g.lineTo(x + w - 14, 100); g.lineTo(x - 20, 100); g.closePath(); g.fill(); }
  }
  function stBubbles(g, list) { for (const [x, y, r] of list) { g.fillStyle = "rgba(235,250,255,0.55)"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, TAU); g.fill(); } }
  // a simple fish, seen from the side and swimming to the right
  function stFish(g, x, y, L, body, back) {
    g.save(); g.translate(x, y); g.scale(L / 100, L / 100);
    stPath(g, "M-40 0 L-62 -18 L-58 0 L-62 18 Z", back);
    g.fillStyle = body; g.beginPath(); g.ellipse(0, 0, 44, 24, 0, 0, TAU); g.fill();
    g.save(); g.beginPath(); g.ellipse(0, 0, 44, 24, 0, 0, TAU); g.clip(); g.fillStyle = back; g.fillRect(-50, -30, 100, 16); g.restore();
    stPath(g, "M-8 -22 L8 -34 L16 -20 Z", back);
    stEye(g, 24, -5, 6);
    g.restore();
  }

  // a sticker as a picture, made once
  const stickerCache = new Map();
  function stickerURL(id, scale = 2) {
    if (!stickerCache.has(id)) {
      const c = document.createElement("canvas"); c.width = c.height = 60 * scale;
      const g = c.getContext("2d"); g.scale(c.width / 100, c.height / 100);
      STICKER_ART[id](g);
      stickerCache.set(id, c.toDataURL());
    }
    return stickerCache.get(id);
  }

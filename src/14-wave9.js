  // ---- the ninth round: five more animals for the waters that had the least of their own -----------------
  // A California sheephead in the kelp forest, a remipede in the cave, a yeti crab at the deep-sea vent, a sargassum
  // nudibranch on the floating weed and a Weddell seal under the southern ice. Like the rounds before they roll from
  // their own random stream (stream: true in the table at the end).

  // ---- California sheephead ------------------------------------------------------------------------------
  // A big male: a black head with a white chin and a bump on the forehead, a red middle and a black tail. It is
  // curious: when the diver comes close it swims right up to look, and bares its buck teeth.
  const SHP_BODY = "M 50 3 C 50 -8 42 -18 26 -20 C 8 -22 -18 -18 -36 -8 L -40 0 L -36 8 C -18 16 8 18 26 15 C 42 13 50 10 50 3 Z";
  const SHP_DORSAL = "M 34 -18 C 14 -28 -20 -24 -40 -8 L -34 -9 C -16 -20 12 -24 34 -18 Z";
  const SHP_ANAL = "M 10 15 C -6 22 -26 18 -40 6 L -34 6 C -22 14 -6 16 10 15 Z";
  const SHP_TAIL = "M 2 0 C -6 -10 -14 -14 -18 -12 C -15 -4 -15 4 -18 12 C -14 14 -6 10 2 0 Z";
  const SHP_HEAD = "M 30 -40 L 70 -40 L 70 40 L 26 40 C 31 10 31 -10 30 -40 Z";
  const SHP_REAR = "M -24 -40 L -80 -40 L -80 40 L -20 40 C -25 10 -25 -10 -24 -40 Z";
  const SHP_BACK = "M -30 -40 L 34 -40 L 34 -9 C 10 -11 -10 -7 -30 -3 Z";
  const SHP_CHIN = "M 36 7 C 42 7 50 6 56 3 L 56 24 L 36 24 Z";
  const SHP_PEC = "M 0 0 C -4 -5 -14 -6 -18 -2 C -14 3 -5 4 0 0 Z";
  function drawSheephead(f) {
    const s = f.s, grin = f.grin || 0;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const black = sh("#1e1a1c"), red = sh("#d8503a"), dark = sh("#a83828"), white = sh("#f2f0ea"), fin = sh("#3a3034");
    ctx.save(); ctx.translate(-37, 0); ctx.rotate(Math.sin(f.ph * 2) * 0.2); fillWith(P(SHP_TAIL), black); ctx.restore();
    fillWith(P(SHP_DORSAL), fin); fillWith(P(SHP_ANAL), fin);
    fillWith(P(SHP_BODY), red);
    paintInside(P(SHP_BODY), dark, P(SHP_BACK));
    paintInside(P(SHP_BODY), black, P(SHP_HEAD));
    paintInside(P(SHP_BODY), black, P(SHP_REAR));
    paintInside(P(SHP_BODY), white, P(SHP_CHIN));
    // the bump on the forehead of an old male
    ctx.fillStyle = black; ctx.beginPath(); ctx.ellipse(38, -14, 9, 6, -0.4, 0, TAU); ctx.fill();
    // buck teeth that show when it opens its mouth at the diver
    if (grin > 0.05) {
      ctx.fillStyle = white; ctx.beginPath();
      ctx.moveTo(48, 2); ctx.lineTo(53, 2 + grin * 1.5); ctx.lineTo(49, 4 + grin * 2); ctx.closePath();
      ctx.moveTo(48, 5); ctx.lineTo(52, 5 + grin * 2.5); ctx.lineTo(47, 6 + grin * 2); ctx.closePath();
      ctx.fill();
    }
    ctx.save(); ctx.translate(28, 4); ctx.rotate(Math.sin(f.ph * 3) * 0.25); fillWith(P(SHP_PEC), fin); ctx.restore();
    eye(41, -6, 2.4, "#4a1212");
    ctx.restore();
  }
  function curiousSheephead(f, F, k) {
    if (f.grin === undefined) f.grin = 0;
    if (near(f.x, f.cy, 180 * u) > 0) {
      const side = Math.sign(f.x - diver.x) || 1;
      f.tx = diver.x + side * 70 * u;
      if (Math.abs(f.tx - f.x) < 16 * u) f.dir = -side;
      f.grin = Math.min(1, f.grin + 0.04 * k);
    } else f.grin = Math.max(0, f.grin - 0.02 * k);
  }

  // ---- remipede ------------------------------------------------------------------------------------------
  // A pale, eyeless cave crustacean that swims on its back: a long row of segments with a pair of paddling legs on
  // each, beating one after another in a wave. Long feelers in front. When the diver comes close its legs beat
  // twice as fast and it scoots away.
  function drawRemipede(f) {
    const s = f.s, beat = f.fast > 0 ? 2.2 : 1;
    sandShadow(f, s * 0.3);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(Math.sin(f.ph * 0.6) * 0.04);
    const pale = sh("#ece6dc"), seg = sh("#cfc6b8"), leg = sh("#b8ac9a");
    ctx.globalAlpha = 0.92;
    // the legs on top: it swims upside down, so its belly with the legs faces up
    ctx.strokeStyle = leg; ctx.lineWidth = 1.1; ctx.lineCap = "round"; ctx.fillStyle = leg;
    ctx.beginPath();
    for (let i = 0; i < 13; i++) {
      const x = 32 - i * 6, sw = Math.sin(f.ph * 6 * beat - i * 0.7);
      const tx = x + sw * 4, ty = -11 - Math.cos(f.ph * 6 * beat - i * 0.7) * 1.5;
      ctx.moveTo(x, -3); ctx.lineTo(tx, ty);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i < 13; i++) {
      const x = 32 - i * 6, sw = Math.sin(f.ph * 6 * beat - i * 0.7);
      const tx = x + sw * 4, ty = -11 - Math.cos(f.ph * 6 * beat - i * 0.7) * 1.5;
      ctx.moveTo(tx + 2.4, ty); ctx.ellipse(tx, ty, 2.4, 1.1, 0, 0, TAU);
    }
    ctx.fill();
    // the segments, narrowing towards the tail
    for (let i = 13; i >= 0; i--) {
      const x = 34 - i * 6, r = 4.8 - i * 0.18;
      ctx.fillStyle = i % 2 ? seg : pale; ctx.beginPath(); ctx.ellipse(x, 0, 3.8, r, 0, 0, TAU); ctx.fill();
    }
    // two little tail prongs
    ctx.strokeStyle = seg; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-46, 0); ctx.lineTo(-54, -3); ctx.moveTo(-46, 0); ctx.lineTo(-54, 3); ctx.stroke();
    // the head and its two pairs of feelers
    ctx.fillStyle = pale; ctx.beginPath(); ctx.ellipse(42, 0, 7, 4.6, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = seg; ctx.lineWidth = 0.9; ctx.beginPath();
    for (const [a, b] of [[-1, 0], [1, 1.3], [-0.4, 2.1]]) { ctx.moveTo(48, a); ctx.quadraticCurveTo(60, a * 6 - 4, 72 + Math.sin(f.ph * 1.5 + b) * 3, a * 10 - 2); }
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  function scootRemipede(f, F, k) {
    f.fast = (f.fast || 0) - k / 60;
    if (near(f.x, f.cy, 110 * u) > 0) {
      f.fast = 2;
      f.tx = Math.max(30 * u, Math.min(W - 30 * u, f.x + (Math.sign(f.x - diver.x) || 1) * 160 * u));
      f.x += (Math.sign(f.tx - f.x) || 0) * 0.6 * u * k;
    }
  }

  // ---- yeti crab -----------------------------------------------------------------------------------------
  // A pale, almost blind crab of the hot springs on the deep-sea floor, with long arms covered in fine hairs where
  // it grows bacteria to eat. It stays close to the vent, slowly waving its arms in the warm water; when the
  // diver comes close it crouches and folds its arms in.
  function drawYetiCrab(f) {
    const s = f.s, tuck = f.tuck || 0, wave = Math.sin(f.ph * 1.2) * (1 - tuck);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    const shell = sh("#d8c8a8"), top = sh("#ece2cc"), limb = sh("#b8a684"), hair = sh("#f2ecdc");
    ctx.fillStyle = "rgba(0,0,0,0.13)"; ctx.beginPath(); ctx.ellipse(0, 1, 30, 3, 0, 0, TAU); ctx.fill();
    const lift = 14 - tuck * 6;
    // walking legs: four on the side we see, bent at the knee
    ctx.strokeStyle = limb; ctx.lineWidth = 2.6; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const x0 = 8 - i * 6, step = Math.sin(f.ph * 3 + i * 1.6) * (f.walk ? 2 : 0);
      ctx.moveTo(x0, -lift + 2); ctx.lineTo(x0 - 6 - i * 2 + step, -lift - 6 + i); ctx.lineTo(x0 - 10 - i * 3 + step, 0);
    }
    ctx.stroke();
    // the body
    ctx.fillStyle = shell; ctx.beginPath(); ctx.ellipse(0, -lift, 18, 10, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = top; ctx.beginPath(); ctx.ellipse(-1, -lift - 3.5, 14, 5.5, 0, 0, TAU); ctx.fill();
    // the two hairy arms
    const arm = [];
    for (const side of [0, 1]) {
      const a = -0.35 - wave * 0.3 + side * 0.15 + tuck * 0.9;
      const ex = 14 + Math.cos(a) * 22, ey = -lift - 2 + Math.sin(a) * 22;
      const hx = ex + Math.cos(a + 0.7 + tuck * 0.6) * 18, hy = ey + Math.sin(a + 0.7 + tuck * 0.6) * 18;
      arm.push([[14, -lift - 2], [ex, ey], [hx, hy]]);
    }
    ctx.strokeStyle = limb; ctx.lineWidth = 3.6; ctx.beginPath();
    for (const [p0, p1, p2] of arm) { ctx.moveTo(p0[0], p0[1]); ctx.lineTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); }
    ctx.stroke();
    // the fine pale hairs along the arms, swaying a little
    ctx.strokeStyle = hair; ctx.lineWidth = 0.8; ctx.beginPath();
    for (const [p0, p1, p2] of arm) {
      for (const [a0, a1] of [[p0, p1], [p1, p2]]) {
        const dx = a1[0] - a0[0], dy = a1[1] - a0[1], len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
        for (let t = 0.1; t < 1; t += 0.12) {
          const x = a0[0] + dx * t, y = a0[1] + dy * t, sway = Math.sin(f.ph * 2 + t * 6) * 1.2;
          ctx.moveTo(x, y); ctx.lineTo(x + nx * 5 + sway, y + ny * 5);
          ctx.moveTo(x, y); ctx.lineTo(x - nx * 5 + sway, y - ny * 5);
        }
      }
    }
    ctx.stroke();
    // small pincers at the ends
    ctx.fillStyle = limb;
    for (const [, , p2] of arm) { ctx.beginPath(); ctx.ellipse(p2[0], p2[1], 3.6, 2, 0.4, 0, TAU); ctx.fill(); }
    // tiny pale eyes, nearly blind
    ctx.fillStyle = sh("#f2ecdc"); ctx.beginPath(); ctx.arc(16, -lift - 5, 1.1, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function moveYetiCrab(f, F, k) {
    f.ph += 0.05 * k;
    if (f.home === undefined) {
      const v = scene.vent;
      f.home = v ? Math.max(scene.floorL + 40 * u, Math.min(scene.floorR - 40 * u, v.x + (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 30) * u)) : f.x;
      f.x = f.home; f.tuck = 0;
    }
    const scared = near(f.x, sandY(f.x) - f.s * 0.3, 110 * u) > 0;
    f.tuck = scared ? Math.min(1, f.tuck + 0.06 * k) : Math.max(0, f.tuck - 0.015 * k);
    // potters about close to home
    f.walk = !scared && Math.sin(f.ph * 0.15) > 0.4;
    if (f.walk) {
      f.x += f.dir * 0.08 * u * k;
      if (Math.abs(f.x - f.home) > 40 * u) f.dir = Math.sign(f.home - f.x);
    }
    f.cy = sandY(f.x) + 4 * u;
  }

  // ---- sargassum nudibranch ------------------------------------------------------------------------------
  // A small golden-brown sea slug with leafy flaps on its back that clings to the floating sargassum and looks just
  // like it. When the diver comes close it lets go, swims a little way down by bending its body to and fro, and
  // then makes its way back up to the weed.
  const SLUG_BODY = "M 46 0 C 44 -6 30 -9 10 -9 C -12 -9 -34 -6 -48 1 C -34 5 -12 6 10 6 C 30 6 44 4 46 0 Z";
  const SLUG_FLAP = "M 0 0 C -8 -12 2 -26 12 -22 C 13 -14 9 -5 0 0 Z";
  function drawSargSlug(f) {
    const s = f.s, drop = f.drop || 0, bend = Math.sin(f.ph * 5) * 0.45 * drop;
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(bend * 0.4);
    const body = sh("#a8903c"), dark = sh("#7a6a24"), light = sh("#c8b05a"), speck = sh("#f2ecd0"), blue = sh("#4ab8f0");
    // two pairs of leafy flaps
    for (const [x, rot, col] of [[18, -0.3, dark], [-12, -0.15, dark], [10, 0.25, light], [-20, 0.35, light]]) {
      ctx.save(); ctx.translate(x, -6); ctx.rotate(rot + Math.sin(f.ph * 1.4 + x) * 0.08 + bend * 0.5); fillWith(P(SLUG_FLAP), col); ctx.restore();
    }
    ctx.save(); ctx.rotate(bend * 0.3); fillWith(P(SLUG_BODY), body); ctx.restore();
    // two rhinophores on the head
    ctx.fillStyle = dark;
    for (const x of [36, 40]) { ctx.beginPath(); ctx.ellipse(x, -9, 2.2, 5, 0.3, 0, TAU); ctx.fill(); }
    // white specks and a row of tiny blue dots along the side
    ctx.fillStyle = speck; ctx.beginPath();
    for (const [x, y] of [[28, -4], [14, -6], [0, -3], [-14, -5], [-28, -2], [6, 1], [-20, 2]]) { ctx.moveTo(x + 1.2, y); ctx.arc(x, y, 1.2, 0, TAU); }
    ctx.fill();
    ctx.fillStyle = blue; ctx.beginPath();
    for (let i = 0; i < 6; i++) { const x = 30 - i * 11; ctx.moveTo(x + 1, 2); ctx.arc(x, 2, 1, 0, TAU); }
    ctx.fill();
    ctx.restore();
  }
  function moveSargSlug(f, F, k) {
    f.ph += 0.05 * k;
    const mats = scene.sargassum || [];
    if (f.drop === undefined) { f.drop = 0; f.off = (Math.random() - 0.5) * 0.6; f.away = 0; }
    if (mats.length && (!f.mat || !mats.includes(f.mat))) f.mat = mats.reduce((a, m) => Math.abs(m.x - f.x) < Math.abs(a.x - f.x) ? m : a, mats[0]);
    const scared = near(f.x, f.cy, 110 * u) > 0;
    if (scared) f.away = 3.5;
    f.away -= k / 60;
    f.drop = f.away > 0 ? Math.min(1, f.drop + 0.03 * k) : Math.max(0, f.drop - 0.008 * k);
    if (f.mat) {
      const want = f.mat.x + f.off * f.mat.w;
      f.x += (want - f.x) * Math.min(1, 0.02 * k);
      if (Math.abs(want - f.x) > W / 2) f.x = want;
      f.dir = 1;
    } else {
      f.x += f.dir * F.speed * u * k;
      if (f.x < 30 * u) f.dir = 1;
      if (f.x > W - 30 * u) f.dir = -1;
    }
    f.cy = waveY(f.x) + 12 * u + smooth01(f.drop) * 70 * u;
  }

  // ---- Weddell seal --------------------------------------------------------------------------------------
  // A plump grey seal of the Antarctic with silvery blotches, a small round head and a short, friendly-looking
  // muzzle. When the diver comes close it turns to look, and then swims up to the ice to breathe.
  const WED_BODY = "M 46 -1 C 46 -7 40 -11 32 -11 C 26 -11 22 -12 14 -14 C -6 -16 -28 -12 -42 -5 C -48 -2 -50 0 -52 1 C -48 4 -40 7 -28 10 C -10 14 10 13 24 9 C 32 7 40 6 44 4 C 46 3 46 1 46 -1 Z";
  const WED_FLIP = "M 0 0 C 4 6 2 15 -5 20 C -8 21 -9 18 -7 14 C -4 9 -4 4 -4 0 Z";
  const WED_HIND = "M 0 -1 C -6 -6 -12 -8 -16 -6 C -12 -2 -12 2 -16 6 C -12 8 -6 6 0 1 Z";
  function drawWeddell(f) {
    const s = f.s, sw = Math.sin(f.ph * 1.8);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100); ctx.rotate(Math.sin(f.ph * 0.9) * 0.03);
    const body = sh("#4a525c"), dark = sh("#2e343c"), spot = sh("#a8b0b8"), belly = sh("#c8ccd0");
    ctx.save(); ctx.translate(-51, 1); ctx.rotate(sw * 0.3); fillWith(P(WED_HIND), dark); ctx.restore();
    ctx.save(); ctx.translate(14, 6); ctx.rotate(0.4 + sw * 0.2); fillWith(P(WED_FLIP), dark); ctx.restore();
    fillWith(P(WED_BODY), body);
    ctx.save(); ctx.clip(P(WED_BODY));
    ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(-4, -12, 46, 6, -0.04, 0, TAU); ctx.fill();
    ctx.fillStyle = belly; ctx.beginPath(); ctx.ellipse(0, 11, 44, 6, 0.04, 0, TAU); ctx.fill();
    // the silvery blotches on its flanks
    ctx.fillStyle = spot; ctx.beginPath();
    for (const [x, y, rx, ry] of [[20, 2, 4, 2.4], [8, -4, 5, 2.6], [-6, 3, 4.6, 2.4], [-18, -3, 5, 2.4], [-30, 2, 4, 2], [2, 7, 3.4, 1.8], [-38, -1, 3, 1.6], [28, -4, 3, 1.8]]) { ctx.moveTo(x + rx, y); ctx.ellipse(x, y, rx, ry, 0.2, 0, TAU); }
    ctx.fill();
    ctx.restore();
    // a short muzzle that seems to smile, whiskers, and a calm dark eye
    ctx.strokeStyle = dark; ctx.lineWidth = 1.1; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(45, 2); ctx.quadraticCurveTo(42, 4.5, 38, 3); ctx.stroke();
    ctx.strokeStyle = belly; ctx.lineWidth = 0.6; ctx.beginPath();
    for (const a of [-0.3, 0, 0.3]) { ctx.moveTo(44, 0); ctx.lineTo(52, a * 8); }
    ctx.stroke();
    eye(36, -5.5, 2.1, "#101214");
    ctx.fillStyle = "#101214"; ctx.beginPath(); ctx.arc(45.5, -2, 1.1, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(18, 7); ctx.rotate(0.2 - sw * 0.25); fillWith(P(WED_FLIP), body); ctx.restore();
    ctx.restore();
  }
  // first a long look at the diver, then up to the ice to breathe (as the polar cod hide under a floe)
  function weddellReact(f, F, k) {
    if (f.look === undefined) f.look = 0;
    if (f.look > 0) {
      f.look -= k / 60; f.tx = f.x; f.vx = (f.vx || 0) * 0.9; f.dir = Math.sign(diver.x - f.x) || f.dir;
      if (f.look <= 0) { f.look = -1; f.hide = 0; }
      return;
    }
    if (f.look === 0 && near(f.x, f.cy, 200 * u) > 0) { f.look = 1.6; return; }
    if (f.look < 0) {
      // swims up to breathe for a while, then the look can happen again
      hideInIce(f, F, k);
      if (f.hide <= 0 && !f.floe && near(f.x, f.cy, 200 * u) <= 0) f.look = 0;
      else if (f.floe === null && f.hide === 0) { const fl = scene.floes || []; if (fl.length) { f.floe = fl.reduce((a, o) => Math.abs(o.x - f.x) < Math.abs(a.x - f.x) ? o : a, fl[0]); f.hide = 5; } }
    }
  }

  // ---- the table of the ninth round ------------------------------------------------------------------------
  const W9_FAUNA = {
    sheephead: { kind: "swim", size: [44, 54], band: [0.5, 0.8], speed: 0.45, draw: drawSheephead, react: curiousSheephead, thumb: 90, stream: true },
    remipede: { kind: "glide", size: [16, 20], lift: [16, 34], speed: 0.25, draw: drawRemipede, react: scootRemipede, thumb: 88, stream: true },
    yeticrab: { kind: "floor", size: [30, 36], draw: drawYetiCrab, move: moveYetiCrab, thumb: 78, stream: true },
    sargslug: { kind: "surface", size: [18, 22], speed: 0.04, draw: drawSargSlug, move: moveSargSlug, thumb: 76, stream: true },
    weddell: { kind: "swim", size: [84, 98], band: [0.25, 0.55], speed: 0.5, draw: drawWeddell, react: weddellReact, thumb: 104, stream: true },
  };
  Object.assign(FAUNA, W9_FAUNA);
  hookFauna(W9_FAUNA, {});
  // the nudibranch hangs a little under the surface, among the weed
  THUMBS.sargslug = () => {
    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, 24); for (let x = 0; x <= TW; x += 6) ctx.lineTo(x, 24 + Math.sin(x * 0.15) * 1.5); ctx.stroke();
    drawSargSlug({ x: 60, cy: 50, dir: 1, s: 76, ph: 1.2 });
  };

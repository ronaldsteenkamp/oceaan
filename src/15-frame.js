  // ---- speed: cached floor, automatic quality, background pause --------
  // Landmarks that never move are drawn once into a layer instead of every frame.
  const STATIC = new Set(["rocks", "skull", "bottle", "anchor", "cannon", "ruins", "statue", "plane", "amphora", "car", "bell", "wheel", "phonebox", "sponges"]);
  function staticLayer(name) {
    const S = scene;
    if (!canvas.width || !canvas.height) return; // a hidden pane can report a zero size
    if (!S.layers) S.layers = {};
    let c = S.layers[name];
    if (!c || c.width !== canvas.width || c.height !== canvas.height) {
      c = document.createElement("canvas");
      c.width = canvas.width; c.height = canvas.height;
      const saved = ctx;
      ctx = c.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (name === "back") { drawSand(); for (const g of S.ground) if (STATIC.has(g.kind) && !g.shiny) GROUND_DRAW[g.kind](g, 0); }
      else drawSandLip();
      ctx = saved;
      // only the part with something on it is copied each frame: from the top of its content down (the rest is empty)
      c.top = layerTop(c);
      S.layers[name] = c;
    }
    if (c.top >= c.height) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(c, 0, c.top, c.width, c.height - c.top, 0, c.top, c.width, c.height - c.top);
    ctx.restore();
  }

  // The first row of a layer that has anything drawn on it (looked up once, when the layer is made).
  function layerTop(c) {
    try {
      const data = c.getContext("2d").getImageData(0, 0, c.width, c.height).data, rowLen = c.width * 4;
      for (let y = 0; y < c.height; y += 2) {
        for (let i = y * rowLen + 3; i < (y + 1) * rowLen; i += 16) if (data[i]) return Math.max(0, y - 4);
      }
      return c.height;
    } catch (e) { return 0; }
  }

  // When frames come in slowly, first render fewer pixels, then draw a little less detail (fewer specks of
  // drifting snow and glints); when there is room again, it steps back up. The ocean itself stays the same.
  const perf = { acc: 0, n: 0, wait: 4000, good: 0 };
  let lightDetail = false;
  function setDprCap(cap) {
    dprCap = cap;
    dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
  }
  function checkQuality(dtMs) {
    if (perf.wait > 0) { perf.wait -= dtMs; return; }
    perf.acc += dtMs; perf.n++;
    if (perf.acc < 3000) return;
    const avg = perf.acc / perf.n;
    perf.acc = 0; perf.n = 0;
    if (avg > 24) {
      perf.good = 0; perf.wait = 2000;
      if (!lightDetail) lightDetail = true;
      else if (dprCap > 1) setDprCap(dprCap > 1.5 ? 1.5 : 1);
    } else if (avg < 18) {
      // smooth for half a minute: step back up, sharpness first
      if (++perf.good < 10) return;
      perf.good = 0;
      if (dprCap < 2) setDprCap(dprCap < 1.5 ? 1.5 : 2);
      else lightDetail = false;
    } else perf.good = 0;
  }

  document.addEventListener("visibilitychange", () => {
    if (audio.ac) { if (document.hidden) audio.ac.suspend(); else if (audio.on) audio.ac.resume(); }
  });

  // what the water is multiplied with in the deepest night (see step)
  const NIGHT_BLUE = [52, 78, 140];
  // two see-through colours laid on top of each other, as one colour: [r, g, b, alpha] -> "rgba(...)"
  function mixVeils(a, b) {
    if (!a && !b) return null;
    if (!a || !b) { const [r, g, bl, al] = a || b; return al > 0.004 ? `rgba(${r},${g},${bl},${al.toFixed(3)})` : null; }
    const A = 1 - (1 - a[3]) * (1 - b[3]);
    if (A < 0.004) return null;
    const ch = i => Math.round((b[3] * b[i] + (1 - b[3]) * a[3] * a[i]) / A);
    return `rgba(${ch(0)},${ch(1)},${ch(2)},${A.toFixed(3)})`;
  }

  // ---- the measuring screen: open the page with ?meten (for example .../oceaan/?meten) ----
  // Shows the frames per second, how long one frame of drawing takes, how many frames were slow and the quality level.
  // Tap it to copy a short report.
  const meter = /[?&]meten\b/.test(location.search) ? { frames: 0, work: 0, slow: 0, maxWork: 0, since: performance.now(), all: { frames: 0, work: 0, slow: 0, ms: 0 }, el: null } : null;
  function meterTick(dtMs, workMs) {
    const m = meter;
    m.frames++; m.work += workMs; m.maxWork = Math.max(m.maxWork, workMs); if (dtMs > 20) m.slow++;
    m.all.frames++; m.all.work += workMs; m.all.ms += dtMs; if (dtMs > 20) m.all.slow++;
    const now = performance.now();
    if (now - m.since < 1000) return;
    if (!m.el) {
      m.el = document.createElement("pre");
      m.el.style.cssText = "position:fixed;left:8px;top:calc(8px + env(safe-area-inset-top,0px));z-index:60;margin:0;padding:6px 8px;font:11px/1.35 ui-monospace,monospace;color:#d8f4ff;background:rgba(2,10,20,.78);border-radius:8px;pointer-events:auto;white-space:pre";
      m.el.addEventListener("click", () => { navigator.clipboard && navigator.clipboard.writeText(meterReport()).then(() => toast("Meting gekopieerd"), () => {}); });
      document.body.append(m.el);
    }
    const fps = m.frames * 1000 / (now - m.since);
    m.el.textContent = `${fps.toFixed(0)} fps · tekenen ${(m.work / m.frames).toFixed(1)} ms (max ${m.maxWork.toFixed(1)})\n` +
      `traag (>20 ms): ${(100 * m.slow / m.frames).toFixed(0)}% · ${water.name}\n` +
      `${canvas.width}×${canvas.height} · dpr ${dpr} · ${lightDetail ? "minder detail" : "vol detail"}`;
    m.frames = 0; m.work = 0; m.slow = 0; m.maxWork = 0; m.since = now;
  }
  function meterReport() {
    const a = meter.all;
    return `Oceaan meting ${new Date().toISOString().slice(0, 16)} · ${navigator.userAgent}\n` +
      `scherm ${W}×${H} css, canvas ${canvas.width}×${canvas.height}, dpr ${dpr} (toestel ${window.devicePixelRatio})\n` +
      `${a.frames} frames: ${(a.frames * 1000 / a.ms).toFixed(1)} fps gemiddeld, tekenen ${(a.work / a.frames).toFixed(2)} ms per frame, ${(100 * a.slow / a.frames).toFixed(1)}% trager dan 20 ms\n` +
      `kwaliteit: ${lightDetail ? "minder detail" : "vol detail"}, water ${water.name}, seed ${seed}`;
  }

  let selfTesting = false, rawFrameMs = 16;
  const brushLeaks = new Set();

  // ---- frame -------------------------------------------------------------
  function frame(now, once) {
    // the next frame is booked first, so one unexpected error can never freeze the ocean
    if (!once) requestAnimationFrame(frame);
    const dtMs = Math.min(50, now - last);
    rawFrameMs = Math.min(250, Math.max(0, now - last));
    last = now;
    if (paused || discoverPause || document.hidden) return;
    // whatever goes wrong while drawing, the next frame starts with a clean brush (otherwise one error can wash out the screen)
    const w0 = meter ? performance.now() : 0;
    try { step(dtMs); } finally {
      if (meter) meterTick(dtMs, performance.now() - w0);
      // the self-test wants to know when a drawing forgot to put the brush back
      if (selfTesting && (ctx.globalCompositeOperation !== "source-over" || ctx.globalAlpha !== 1 || ctx.shadowBlur !== 0)) brushLeaks.add(`${water.name}: ${ctx.globalCompositeOperation}/${ctx.globalAlpha}/${ctx.shadowBlur}`);
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    }
  }

  function step(dtMs) {
    frameNo++;
    checkQuality(dtMs);
    if (frameNo % 30 === 0) updateClock();
    const speed = (reduceMotion ? 0.5 : 1) * (restMode ? 0.55 : 1);
    const k = (dtMs / 16.667) * speed;
    frameK = k;
    const dtSec = (dtMs / 1000) * speed;
    t += dtSec;
    const S = scene;

    // day and night take about two and a half minutes; now and then a current sweeps through
    computeLight();
    glowF = Math.max(night, water.glow ? 0.75 : 0);
    S.currentTimer -= dtSec;
    if (S.currentTimer <= 0) {
      if (S.currentTarget === 0) { S.currentTarget = (Math.random() < 0.5 ? -1 : 1) * (0.8 + Math.random() * 1.2); S.currentTimer = 6 + Math.random() * 5; }
      else { S.currentTarget = 0; S.currentTimer = 35 + Math.random() * 50; }
    }
    current += (S.currentTarget - current) * 0.01 * k;
    updateTentacles(S.kraken, dtSec, KRAKEN);
    updateStorm(dtSec);
    updateTurnover(dtSec);
    updateMore(k, dtSec);
    updateWave2(k, dtSec);
    updateWave6(k, dtSec);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
    drawRays();

    updateVisitor(k, dtSec);
    const v = S.visitor;
    shinyDraw(S.megalodon, () => drawMegalodon(k));
    shinyDraw(S.moby, () => drawMoby(k));
    shinyDraw(S.leviathan, () => drawLeviathan(k));

    drawSnow(k);
    drawKelp(S.kelpBack, 0.7);
    drawMangrove();
    drawHidden(k);
    drawAbyss(k);
    staticLayer("back");
    for (const g of S.ground) if ((!STATIC.has(g.kind) || g.shiny) && g.kind !== "eels" && g.kind !== "anemone" && g.kind !== "brine") shinyDraw(g, () => GROUND_DRAW[g.kind](g, k));
    staticLayer("lip");
    for (const g of S.ground) if (g.kind === "brine") drawBrine(g);
    drawTreasureMound();
    drawCaustics();
    for (const g of S.ground) if (g.kind === "eels") drawGardenEels(g);
    for (const o of S.urchins) shinyDraw(o, () => drawUrchin(o));
    for (const f of S.starfish) shinyDraw(f, () => drawStarfish(f));
    for (const o of S.slugs) shinyDraw(o, () => drawSlug(o, k));
    for (const h of S.hermits) shinyDraw(h, () => drawHermit(h, k));
    drawMoreFloor(k);
    drawWave2Floor(k);
    for (const g of S.ground) if (g.kind === "anemone") shinyDraw(g, () => drawAnemone(g));
    if (S.mantis) shinyDraw(S.mantis, () => drawMantis(S.mantis, k));
    if (S.ray) shinyDraw(S.ray, () => drawRay(S.ray, k));
    for (const c of S.crabs) shinyDraw(c, () => drawCrab(c, k));
    if (S.octopus) shinyDraw(S.octopus, () => drawOctopus(S.octopus, k));
    for (const h of S.seahorses) shinyDraw(h, () => drawSeahorse(h));
    if (S.angler) shinyDraw(S.angler, () => drawAngler(S.angler, k));
    drawMoreMid(k);
    drawWave2Mid(k);
    if (S.station) drawStation(S.station, k);
    if (S.giant.enabled) shinyDraw(S.giant, () => updateAndDrawGiant(k, dtSec));
    updateAndDrawSquids(k);
    updateFish(k);
    drawFish();
    updateSpawning(k, dtSec);
    updateAndDrawBait(k, dtSec);
    if (S.archer) shinyDraw(S.archer, () => drawArcher(S.archer, k));
    drawJets(k);
    if (S.puffer) shinyDraw(S.puffer, () => drawPuffer(S.puffer, k));
    if (S.seal) shinyDraw(S.seal, () => drawSeal(S.seal, k));
    drawPenguins(k);
    updateAndDrawJellies(k);
    drawCombs(k, false);
    drawHatchlings(k);
    shinyDraw(S.serpent, () => drawSerpent(k));
    drawSongRings(k);
    drawWave2Front(k);
    drawWave6Front(k);
    if (v && VISITOR_DRAW[v.type]) shinyDraw(v.type === "dolphins" ? null : v, () => VISITOR_DRAW[v.type](v));
    updateAndDrawDiver(k);
    checkWatch();
    drawHoldRings();
    updateAndDrawSonar(k, dtSec);
    if (S.kraken.active) shinyDraw(S.kraken, () => drawTentacleSet(S.kraken, KRAKEN));
    drawInk(k);
    updateAndDrawFood(k);
    updateAndDrawCoins(k);
    drawDust(k);
    drawRings(k);
    drawCoralSpawn(k);
    drawKelp(S.kelpFront, 1);
    updateAndDrawBubbles(k);
    drawStreaks(k);
    drawWave2Top(k);
    drawCaveRoof();
    drawSurface(k, dtSec);
    drawIceWalkers();
    updateAndDrawFlyers(k, dtSec);
    drawRain(k);

    // the seasons colour the water: green with plankton in spring, murky in autumn, cold and blue in a northern winter;
    // then the night darkens it. Both veils are mixed into one colour and laid over the screen in one go.
    let tint = null;
    if (S.season === "herfst") tint = [70, 90, 50, 0.12 * (1 - night * 0.6)];
    else if (S.season === "lente") tint = [60, 150, 80, 0.09 * (1 - night * 0.6)];
    else if (S.season === "winter" && S.cold) tint = [170, 200, 235, 0.09 * (1 - night * 0.5)];
    const veil = mixVeils(tint, null);
    if (veil) { ctx.fillStyle = veil; ctx.fillRect(0, 0, W, H); }
    // The night does not lay a grey veil over the water but multiplies it with deep night blue: the water gets darker,
    // while colours and contrast stay, so what gives light (the lamp, jellies, glowing specks) stands out clearly.
    // Murky or crowded water never goes as dark, so there is always something to see.
    const darkRaw = night * (water.glow ? 0.55 : 1) + stormLevel() * 0.3;
    const dark = Math.min(water.denseKelp || S.season === "herfst" ? 0.72 : 1, darkRaw);
    if (dark > 0.01) {
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = `rgb(${NIGHT_BLUE.map(c => Math.round(255 + (c - 255) * dark)).join(",")})`;
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
    drawMoon();
    drawLights(k);
    drawGlowtide(k);
    drawAurora();
    drawWave6Sky(k);
    if (S.storm.flash > 0) { ctx.fillStyle = `rgba(225,235,255,${S.storm.flash * 0.4})`; ctx.fillRect(0, 0, W, H); }
    drawMap(k);

    if (fade > 0) {
      ctx.globalAlpha = fade;
      ctx.fillStyle = water.bottom;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      // half a second of real time, also on a slow phone where the first frames take long
      fade = Math.max(0, fade - rawFrameMs / 500);
    }
    flushDiscoveries();
    flushMinis();
    audioTick();
  }


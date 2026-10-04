  // ---- speed: cached floor, automatic quality, background pause --------
  // Landmarks that never move are drawn once into a layer instead of every frame.
  const STATIC = new Set(["rocks", "skull", "bottle", "anchor", "cannon", "ruins", "statue", "plane", "amphora", "car", "bell"]);
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
      if (name === "back") { drawSand(); for (const g of S.ground) if (STATIC.has(g.kind)) GROUND_DRAW[g.kind](g, 0); }
      else drawSandLip();
      ctx = saved;
      S.layers[name] = c;
    }
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(c, 0, 0);
    ctx.restore();
  }

  // When frames come in slowly, render fewer pixels; the scene itself stays the same.
  const perf = { acc: 0, n: 0, wait: 4000 };
  function checkQuality(dtMs) {
    if (perf.wait > 0) { perf.wait -= dtMs; return; }
    perf.acc += dtMs; perf.n++;
    if (perf.acc < 3000) return;
    const avg = perf.acc / perf.n;
    perf.acc = 0; perf.n = 0;
    if (avg > 24 && dprCap > 1) {
      dprCap = dprCap > 1.5 ? 1.5 : 1;
      dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      perf.wait = 2000;
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (audio.ac) { if (document.hidden) audio.ac.suspend(); else if (audio.on) audio.ac.resume(); }
  });

  // ---- frame -------------------------------------------------------------
  function frame(now, once) {
    const dtMs = Math.min(50, now - last);
    last = now;
    if (paused || document.hidden) { if (!once) requestAnimationFrame(frame); return; }
    frameNo++;
    checkQuality(dtMs);
    if (frameNo % 30 === 0) updateClock();
    const speed = (reduceMotion ? 0.5 : 1) * (restMode ? 0.55 : 1);
    const k = (dtMs / 16.667) * speed;
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
    updateTentacles(S.giant, dtSec, GIANT);
    updateStorm(dtSec);
    updateTurnover(dtSec);
    updateMore(k, dtSec);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);
    drawRays();

    updateVisitor(k, dtSec);
    const v = S.visitor;
    if (v && v.type === "whale") shinyDraw(v, () => drawWhale(v));
    drawMegalodon(k);

    drawSnow(k);
    drawKelp(S.kelpBack, 0.7);
    drawMangrove();
    drawHidden(k);
    drawAbyss(k);
    staticLayer("back");
    for (const g of S.ground) if (!STATIC.has(g.kind) && g.kind !== "eels" && g.kind !== "anemone" && g.kind !== "brine") GROUND_DRAW[g.kind](g, k);
    staticLayer("lip");
    for (const g of S.ground) if (g.kind === "brine") drawBrine(g);
    drawTreasureMound();
    for (const g of S.ground) if (g.kind === "eels") drawGardenEels(g);
    for (const o of S.urchins) shinyDraw(o, () => drawUrchin(o));
    for (const f of S.starfish) shinyDraw(f, () => drawStarfish(f));
    for (const o of S.slugs) shinyDraw(o, () => drawSlug(o, k));
    for (const h of S.hermits) shinyDraw(h, () => drawHermit(h, k));
    drawMoreFloor(k);
    for (const g of S.ground) if (g.kind === "anemone") drawAnemone(g);
    if (S.mantis) shinyDraw(S.mantis, () => drawMantis(S.mantis, k));
    if (S.ray) shinyDraw(S.ray, () => drawRay(S.ray, k));
    for (const c of S.crabs) shinyDraw(c, () => drawCrab(c, k));
    if (S.octopus) shinyDraw(S.octopus, () => drawOctopus(S.octopus, k));
    for (const h of S.seahorses) shinyDraw(h, () => drawSeahorse(h));
    if (S.angler) shinyDraw(S.angler, () => drawAngler(S.angler, k));
    drawMoreMid(k);
    if (S.station) drawStation(S.station, k);
    if (S.giant.active) drawTentacleSet(S.giant, GIANT);
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
    drawSerpent(k);
    drawSongRings(k);
    if (v && VISITOR_DRAW[v.type]) shinyDraw(v.type === "dolphins" ? null : v, () => VISITOR_DRAW[v.type](v));
    if (v && v.type === "humpback") shinyDraw(v, () => drawHumpback(v));
    updateAndDrawDiver(k);
    if (S.kraken.active) drawTentacleSet(S.kraken, KRAKEN);
    drawInk(k);
    updateAndDrawFood(k);
    updateAndDrawCoins(k);
    drawDust(k);
    drawRings(k);
    drawCoralSpawn(k);
    drawKelp(S.kelpFront, 1);
    updateAndDrawBubbles(k);
    drawStreaks(k);
    drawCaveRoof();
    drawSurface(k, dtSec);
    updateAndDrawFlyers(k, dtSec);
    drawRain(k);

    if (S.season === "herfst") { ctx.fillStyle = `rgba(70,90,50,${0.12 * (1 - night * 0.6)})`; ctx.fillRect(0, 0, W, H); }
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, W, H);
    const dark = night * (water.glow ? 0.3 : 0.52) + stormLevel() * 0.15;
    if (dark > 0.01) {
      // murky or crowded water never goes fully black, so there is always something to see
      const floorCap = water.denseKelp || S.season === "herfst" ? 0.36 : 0.5;
      ctx.fillStyle = `rgba(2,6,22,${Math.min(floorCap, dark)})`;
      ctx.fillRect(0, 0, W, H);
    }
    drawMoon();
    drawLights(k);
    drawGlowtide(k);
    if (S.storm.flash > 0) { ctx.fillStyle = `rgba(225,235,255,${S.storm.flash * 0.4})`; ctx.fillRect(0, 0, W, H); }
    drawMap(k);

    if (fade > 0) {
      ctx.globalAlpha = fade;
      ctx.fillStyle = water.bottom;
      ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 1;
      fade = Math.max(0, fade - 0.025 * k);
    }
    audioTick();
    if (!once) requestAnimationFrame(frame);
  }


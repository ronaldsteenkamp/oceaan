  // ---- language ----------------------------------------------------------
  // Sets every fixed text on the page in the current language.
  function applyLang() {
    document.documentElement.lang = LANG;
    const tools = {
      sound: audio.on ? [L("Geluid uitzetten (G)", "Turn sound off (G)"), L("Geluid", "Sound")] : [L("Geluid aanzetten (G)", "Turn sound on (G)"), L("Geluid", "Sound")],
      next: [L("Nieuwe oceaan (R)", "New ocean (R)"), L("Nieuw", "New")],
      diver: [L("Duiker (D)", "Diver (D)"), L("Duiker", "Diver")],
      sonar: [L("Sonar (Q): zoek naar iets zeldzaams", "Sonar (Q): search for something rare"), L("Sonar", "Sonar")],
      photo: [L("Foto maken (F)", "Take a photo (F)"), L("Foto", "Photo")],
      book: [L("Logboek (L)", "Logbook (L)"), L("Logboek", "Logbook")],
      menu: [L("Maken en delen", "Create and share"), L("Menu", "Menu")],
    };
    for (const [id, [tip, short]] of Object.entries(tools)) {
      const b = document.getElementById(id);
      if (id === "sound" && b.disabled) continue;
      b.dataset.tip = tip; b.dataset.short = short; b.setAttribute("aria-label", tip);
    }
    toolbarEl.setAttribute("aria-label", L("Bediening", "Controls"));
    document.getElementById("seedLabel").textContent = L("Oceaan", "Ocean");
    document.getElementById("closePanel").setAttribute("aria-label", L("Sluiten", "Close"));
    document.getElementById("welcomeTitle").textContent = L("Welkom in de oceaan", "Welcome to the ocean");
    document.getElementById("welcomeLead").textContent = L("Elke oceaan is anders. Kijk rond, ontdek wat er leeft en vul je logboek.", "Every ocean is different. Look around, discover what lives there and fill your logbook.");
    const howto = [
      L("Roep de <b>duiker</b> (D) en zwem rond. Alles wat in het licht van zijn lamp komt, gaat in je <b>logboek</b> (L).", "Call the <b>diver</b> (D) and swim around. Everything that comes into the light of its lamp goes into your <b>logbook</b> (L)."),
      L("Zwem naar <b>schatkisten</b>, tik op <b>flessen</b> en zoek verstopte <b>zeepaardjes</b>. Met de sonar (Q) speur je naar iets zeldzaams; ingedrukt houden voert de vissen.", "Swim to <b>treasure chests</b>, tap <b>bottles</b> and look for hidden <b>seahorses</b>. The sonar (Q) searches for something rare; press and hold to feed the fish."),
      L("De <b>pijltjesknop</b> (R) geeft een nieuwe oceaan. De eerste paar zijn vrij; daarna wacht je even, en hoe voller je logboek, hoe korter.", "The <b>arrow button</b> (R) gives a new ocean. The first few are free; after that there is a short wait, and the fuller your logbook, the shorter it gets."),
    ];
    howto.forEach((h, i) => { document.getElementById("howto" + i).innerHTML = h; });
    document.getElementById("welcomeGo").textContent = L("Duik erin", "Dive in");
    document.getElementById("credit").textContent = L("Gemaakt door Ronald", "Made by Ronald");
    document.getElementById("savePolaroid").textContent = L("Opslaan met lijstje", "Save with frame");
    document.getElementById("savePlain").textContent = L("Zonder lijstje", "Without frame");
    document.getElementById("saveAlbum").textContent = L("In mijn album", "Add to my album");
    document.getElementById("closePhoto").textContent = L("Terug", "Back");
    polaroidImg.alt = L("Polaroid van de huidige oceaan", "Polaroid of the current ocean");
    photoView.setAttribute("aria-label", L("Foto", "Photo"));
    if (scene) {
      rareEl.textContent = scene.rare ? L("zeldzaam: ", "rare: ") + nm(scene.rare).toLowerCase() : "";
      biomeEl.textContent = nm("w:" + water.name) + (aquarium ? " · aquarium" : "");
      updateClock(); describeScene();
    }
  }

  function setLang(lang) {
    LANG = lang;
    store.set("oceaan-taal", lang);
    applyLang();
    if (!panelEl.hidden) renderPanel();
  }

  // ---- self-test and screen test -------------------------------------
  // #zelftest builds many oceans, forces every big moment and visitor, and draws every logbook picture.
  // The result is written into the page, so check.py can read it from a headless browser.
  function selfTest(count) {
    const errors = [], t0 = performance.now(), types = [...VIS_KEYS, "mermaid"];
    rebuilding = true; // a test run never touches the logbook
    selfTesting = true;
    checkRegistry(errors);
    checkSameOcean(errors);
    let prints = {};
    try { prints = seedPrints(); } catch (e) { errors.push("zaden: " + e.message); }
    // sound is on during the test (silent), so a broken sound shows up as an error
    try { if (!audio.ac) initAudio(); audio.on = !!audio.ac; if (audio.master) audio.master.gain.value = 0; } catch (e) { errors.push("geluid: " + e.message); }
    let oceans = 0;
    for (let sd = 1; sd <= count; sd++) {
      try {
        newVariant(sd, false);
        const S = scene;
        S.forceVisitor = types[sd % types.length]; S.visitor = null; S.visitorTimer = 0;
        S.bait.enabled = true; S.bait.timer = 0; S.storm.enabled = !!water.surface; S.storm.timer = 0;
        S.kraken.enabled = true; S.kraken.timer = 0; S.giant.enabled = true; S.giant.timer = 0; S.spawnTimer = 0;
        S.flyers.enabled = !!water.surface; S.flyers.timer = 0; S.boatTimer = 0; S.turnTimer = 0;
        if (S.species[0]) S.species[0].leaving = 1;
        if (S.crabs[0]) S.crabs[0].leaving = -1;
        pointer.active = true; pointer.x = W * 0.3; pointer.y = H * 0.4; feeding = true; S.feedT = 6;
        S.bloom.timer = 0; S.hatch.enabled = !!water.surface; S.hatch.timer = 0; S.serpent.enabled = true; S.serpent.timer = 0;
        S.megalodon.enabled = true; S.megalodon.timer = 0;
        S.eels.enabled = true; S.eels.timer = 0; S.quake.timer = 0; S.march.enabled = true; S.march.timer = 0; S.moby.enabled = true; S.moby.timer = 0;
        if (!S.ghostDiver) S.ghostDiver = { x: W / 2, y: H / 2, dir: 1, ph: 0, logged: false };
        if (!S.ghostSub) S.ghostSub = { x: W * 0.3, y: H * 0.4, dir: -1, ph: 0, logged: false };
        startNet(S.net); S.net.x = W * 0.5; S.net.y = H * 0.5;
        S.whirl.enabled = true; S.whirl.timer = 0; S.sardines.enabled = true; S.sardines.timer = 0;
        S.meteor.list.push({ x: W / 2, dir: 1, age: 0.2 });
        S.eclipse.active = true; S.eclipse.age = 10; S.eclipse.fade = 1;
        S.leviathan.enabled = true; S.leviathan.timer = 0;
        if (!S.lighthouse) S.lighthouse = { x: W * 0.4, ph: 0, logged: false };
        if (water.surface) Object.assign(S.spout, { active: true, age: 5, x: W * 0.6, vx: 0, fade: 1, depth: H * 0.3 });
        for (const f of S.fauna) {
          if (f.key === "polarbear" && S.floes[0]) { f.st = "ice"; f.floe = S.floes[0]; f.off = 0; f.tm = 0.3; f.x = S.floes[0].x; }
          if (f.key === "gannet") { f.st = "wait"; f.tm = 0; }
        }
        if (sd % 3 === 0) [S.kraken, S.serpent, S.megalodon, S.moby, S.ghostDiver][(sd / 3) % 5].shiny = "kraken";
        if (S.aurora.enabled) { S.aurora.active = true; S.aurora.age = 10; S.aurora.fade = 1; }
        if (S.glowtide.enabled) { S.glowtide.active = true; S.glowtide.age = 5; }
        for (const g of S.ground) if (g.kind === "clam") { g.open = 1; g.pearl = "gold"; tapClam(g.x, sandY(g.x) - g.s * 0.35); }
        if (S.treasure) dig();
        diverMode = true; sonarPing(); S.sonar.echoAt = 0.05;
        diver.x = W * 0.5; diver.y = H * 0.5; diver.vx = 1.5 * u; diver.vy = -0.5 * u; checkWatch();
        if (audio.next) audio.next.note = 0;
        try { audioStep(); } catch (e) { errors.push(`geluid in oceaan ${sd} (${water.name}): ${e.message}`); }
        for (let i = 0; i < 45; i++) { if (i % 9 === 0) busyUntil = 0; if (i === 20) { feeding = false; pointer.active = false; } frame(last + 33, true); }
        checkRarePaths(errors, sd);
        oceans++;
      } catch (e) { errors.push(`oceaan ${sd}: ${e.message}`); }
    }
    thumbErrors.length = 0;
    for (const key of LOG_GROUPS.flatMap(g => g[1])) {
      try { renderThumb(key, true, 1); renderThumb(key, false, 1); } catch (e) { errors.push(`plaatje ${key}: ${e.message}`); }
    }
    for (const e of new Set(thumbErrors)) errors.push(`plaatje ${e}`);
    for (const b of brushLeaks) errors.push(`penseel niet teruggezet na een frame (${b})`);
    try {
      panelTab = "log"; panelEl.hidden = false; renderPanel(); openDetail("shiny:crab"); openDetail("crab", true); closeDetail();
      panelTab = "set"; renderPanel();
      for (const f of ["missing", "found", "shiny", "album", "all"]) { panelTab = "log"; logFilter = f; renderPanel(); }
      logFilter = "all";
      // the hunt list: the page, the button and every kind of key (not saved: hunt is put back afterwards)
      const keepHunt = hunt;
      hunt = ["octopus", "shiny:crab", "aurora"];
      for (const k of [...LOGGABLE]) huntChance(k);
      panelTab = "log"; renderPanel(); openDetail("octopus"); closeDetail();
      hunt = keepHunt;
      setLang(LANG === "nl" ? "en" : "nl"); panelTab = "log"; renderPanel(); openDetail("octopus"); panelTab = "set"; renderPanel();
      setLang(LANG === "nl" ? "en" : "nl");
      panelEl.hidden = true;
    } catch (e) { errors.push(`menu: ${e.message}`); }
    rebuilding = false;
    selfTesting = false;
    diverMode = false;
    audio.on = false;
    canvas.style.transform = "";
    const out = document.createElement("pre");
    out.id = "selftest"; out.hidden = true;
    out.textContent = `${errors.length ? "FOUT" : "OK"}\n${oceans} oceanen in ${Math.round(performance.now() - t0)} ms\n${errors.join("\n")}`;
    document.body.appendChild(out);
    const pr = document.createElement("pre");
    pr.id = "seedprints"; pr.hidden = true;
    pr.textContent = JSON.stringify(prints);
    document.body.appendChild(pr);
  }

  // Is every animal fully registered? This replaces the old dier_check.py: a missing piece is an error here.
  function checkRegistry(errors) {
    const waterNames = WATERS.map(w => w.name), families = FAMILIES.map(f => f[0]);
    const pair = v => Array.isArray(v) && v.length === 2 && v.every(x => typeof x === "string" && x.length > 10);
    const lifeDrawn = new Set([...Object.keys(presentLife(scene)), ...Object.keys(FAUNA), "flyingfish"]); // flying fish have their own system (09)
    for (const [k, a] of Object.entries(ANIMALS)) {
      const miss = [];
      if (!a.nl || !a.en) miss.push("naam (nl/en)");
      if (!families.includes(a.family)) miss.push(`familie (${a.family})`);
      if (!a.sci) miss.push("sci");
      if (!pair(a.fact)) miss.push("fact [nl, en]");
      if (!pair(a.note)) miss.push("note [nl, en]");
      if (a.shiny !== undefined && a.pal === undefined && a.hue === undefined) miss.push("shiny-kleuren (pal of hue)");
      if (a.capital && !(Array.isArray(a.capital) && a.capital.every(l => l === "nl" || l === "en"))) miss.push('capital (["nl"], ["en"] of beide)');
      if (a.winterLeaves && !(FAUNA[k] && ["surface", "dive"].includes(FAUNA[k].kind))) miss.push("winterLeaves (alleen voor vogels aan het oppervlak, in FAUNA)");
      for (const w of Object.keys({ ...a.life, ...a.visits })) if (!waterNames.includes(w)) miss.push(`onbekend water ${w}`);
      for (const v of Object.values(a.life || {})) if (!(v > 0 && v <= 1)) miss.push(`kans ${v} (moet tussen 0 en 1)`);
      if (!THUMBS[k]) miss.push("logboekplaatje (THUMBS of FAUNA)");
      if (a.life && !lifeDrawn.has(k)) miss.push("tekening in de oceaan (FAUNA)");
      if (a.visits && !VISITOR_DRAW[k] && k !== "humpback") miss.push("tekening als bezoeker (FAUNA_VIS)");
      if (a.visits && !(MORE_SIZE[k] || ["humpback", "manta", "turtle", "dolphins", "swordfish", "narwhal"].includes(k))) miss.push("grootte als bezoeker");
      if (miss.length) errors.push(`dier ${k}: mist ${miss.join(", ")}`);
    }
    for (const k of LOGGABLE) {
      const base = k.replace("shiny:", "");
      if (!NAMES[k] || !NAMES_EN[k]) errors.push(`logboek ${k}: naam ontbreekt`);
      if (!k.startsWith("shiny:") && (!FACTS[k] || !FACTS_EN[k])) errors.push(`logboek ${k}: weetje ontbreekt`);
      if (!THUMBS[base]) errors.push(`logboek ${k}: plaatje ontbreekt`);
    }
    if (new Set(AQ_ALL).size !== AQ_ALL.length) errors.push("aquarium: dubbele sleutel in AQ_ALL");
    if (new Set(MILESTONES.map(m => m.id)).size !== MILESTONES.length) errors.push("mijlpalen: dubbele id");
    for (const [id, key] of STICKERS) if (!MILESTONES.some(m => m.id === id) || !THUMBS[key]) errors.push(`sticker ${id}: mijlpaal of plaatje (${key}) ontbreekt`);
    for (const m of MILESTONES) { const [a, b] = m.prog(); if (!(b > 0) || !isFinite(a)) errors.push(`mijlpaal ${m.id}: doel ${b} klopt niet`); }
  }

  // The same seed must be the same ocean on a computer, a phone and a phone on its side.
  function checkSameOcean(errors) {
    const keep = { W, H, u, rng, scene, water, seed };
    const look = (w, h, sd) => {
      W = w; H = h; u = Math.max(0.6, Math.min(W, H) / 700); seed = sd; rng = mulberry32(sd); buildScene();
      const life = presentLife(scene);
      return [water.name, scene.season, scene.rare, scene.ground.map(g => g.kind).sort().join(","),
        Object.keys(life).filter(k => life[k]).sort().join(","), scene.shinies.map(e => e.key).sort().join(",")].join(" | ");
    };
    try {
      for (let sd = 1; sd <= 30; sd++) {
        const a = look(1440, 900, sd), b = look(390, 844, sd), c = look(844, 390, sd);
        if (a !== b || b !== c) { errors.push(`seed ${sd} is niet overal dezelfde oceaan:
  ${a}
  ${b}
  ${c}`); break; }
      }
    } finally { ({ W, H, u, rng, scene, water, seed } = keep); }
  }

  // A fingerprint of the first 30 oceans, for check.py: it compares them with zaden.json, so you see when
  // a change (a new animal, another chance) makes old shared links show a different ocean.
  function seedPrints() {
    const keep = { W, H, u, rng, scene, water, seed }, out = {};
    const r2 = v => Math.round(v * 100) / 100;
    try {
      for (let sd = 1; sd <= 30; sd++) {
        W = 1440; H = 900; u = Math.max(0.6, Math.min(W, H) / 700); seed = sd; rng = mulberry32(sd); buildScene();
        const life = presentLife(scene), S = scene;
        out[sd] = {
          water: water.name, season: S.season, rare: S.rare || "",
          ground: S.ground.map(g => g.kind + "@" + r2(g.x / W)).sort().join(","),
          life: Object.keys(life).filter(k => life[k]).sort().map(k => k + "×" + Number(life[k])).join(","),
          fauna: S.fauna.map(f => f.key + "@" + r2(f.x / W)).join(","),
          shinies: S.shinies.map(e => e.key).sort().join(","),
          timers: [S.net, S.whirl, S.sardines, S.meteor].map(o => o && o.timer !== undefined ? Math.round(o.timer) : "-").join(","),
        };
      }
    } finally { ({ W, H, u, rng, scene, water, seed } = keep); }
    return out;
  }

  // Paths that only happen now and then: a crab, school or jelly that comes back shiny, and every shiny getter.
  function checkRarePaths(errors, sd) {
    const realRandom = Math.random;
    try {
      Math.random = () => 0; // every roll is a shiny
      if (scene.crabs[0]) renewCrab(scene.crabs[0]);
      if (scene.species[0]) renewSchool(scene.species[0]);
      if (scene.jellies[0]) renewJelly(scene.jellies[0]);
    } catch (e) { errors.push(`oceaan ${sd}: terugkerend dier: ${e.message}`); }
    finally { Math.random = realRandom; }
    for (const e of scene.shinies) {
      try { if (!e.alive || e.alive()) e.get(); } catch (err) { errors.push(`oceaan ${sd}: shiny ${e.key} geeft een fout: ${err.message}`); }
    }
  }

  // ---- start -------------------------------------------------------------
  // ask the browser to keep this page's storage, so the logbook is not cleared to make room (granted for installed apps)
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (e) {}
  applyLang();
  applyRewards();
  resize();
  // read the address before newVariant writes the seed into it
  const startHash = location.hash;
  const screenTest = /^#schermtest-(\d+)(?:-(logboek|menu|welkom|detail))?$/.exec(startHash);
  if (screenTest) {
    welcomeEl.hidden = screenTest[2] !== "welkom";
    newVariant(Number(screenTest[1]), false);
    if (screenTest[2] === "logboek") bookBtn.click();
    if (screenTest[2] === "detail") { bookBtn.click(); openDetail("octopus"); }
    if (screenTest[2] === "menu") menuBtn.click();
  } else {
    const initial = seedFromHash();
    personalOcean = initial === null;
    newVariant(initial !== null ? initial : randomSeed(), false);
  }
  // the self-test runs straight away, so a headless browser can read the result as soon as the page has loaded
  const selfTestRun = /^#zelftest(?:-(\d+))?$/.exec(startHash);
  if (selfTestRun) { welcomeEl.hidden = true; last = performance.now(); selfTest(Number(selfTestRun[1] || 60)); }
  requestAnimationFrame(now => { last = now; frame(now); });

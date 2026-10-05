  // ---- language ----------------------------------------------------------
  // Sets every fixed text on the page in the current language.
  function applyLang() {
    document.documentElement.lang = LANG;
    const tools = {
      sound: audio.on ? [L("Geluid uitzetten", "Turn sound off"), L("Geluid", "Sound")] : [L("Geluid aanzetten", "Turn sound on"), L("Geluid", "Sound")],
      next: [L("Nieuwe oceaan (R)", "New ocean (R)"), L("Nieuw", "New")],
      diver: [L("Duiker (D)", "Diver (D)"), L("Duiker", "Diver")],
      sonar: [L("Sonar (Q): zoek naar iets zeldzaams", "Sonar (Q): search for something rare"), L("Sonar", "Sonar")],
      photo: [L("Foto maken", "Take a photo"), L("Foto", "Photo")],
      book: [L("Logboek", "Logbook"), L("Logboek", "Logbook")],
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
      L("De <b>pijltjesknop</b> (of R) geeft een nieuwe oceaan. In het begin om de tien minuten; hoe voller je logboek, hoe vaker.", "The <b>arrow button</b> (or R) gives a new ocean. At first every ten minutes; the fuller your logbook, the more often."),
      L("<b>Houd ingedrukt</b> om de vissen te voeren. Met de <b>duiker</b> (D) zwem je tussen de dieren; zij reageren op hem.", "<b>Press and hold</b> to feed the fish. With the <b>diver</b> (D) you swim among the animals; they react to the diver."),
      L("<b>Tik op een schatkist, een fles of een verstopt zeepaardje.</b>", "<b>Tap a treasure chest, a bottle or a hidden seahorse.</b>"),
      L("Het <b>boekje</b> is je logboek, met alles wat je hebt gevonden.", "The <b>book</b> is your logbook, with everything you have found."),
      L("Onder <b>maken en delen</b> bouw je je eigen aquarium en deel je je oceaan.", "Under <b>create and share</b> you build your own aquarium and share your ocean."),
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
      updateTask(); updateClock(); describeScene();
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
        if (sd % 3 === 0) [S.kraken, S.serpent, S.megalodon, S.moby, S.ghostDiver][(sd / 3) % 5].shiny = "kraken";
        if (water.surface && !S.aurora) S.aurora = { logged: false };
        if (S.glowtide.enabled) { S.glowtide.active = true; S.glowtide.age = 5; }
        for (const g of S.ground) if (g.kind === "clam") { g.open = 1; g.pearl = "gold"; tapClam(g.x, sandY(g.x) - g.s * 0.35); }
        if (S.treasure) dig();
        diverMode = true; sonarPing(); S.sonar.echoAt = 0.05;
        for (let i = 0; i < 45; i++) { if (i % 9 === 0) busyUntil = 0; if (i === 20) { feeding = false; pointer.active = false; } frame(last + 33, true); }
        oceans++;
      } catch (e) { errors.push(`oceaan ${sd}: ${e.message}`); }
    }
    for (const key of LOG_GROUPS.flatMap(g => g[1])) {
      try { renderThumb(key, true, 1); renderThumb(key, false, 1); } catch (e) { errors.push(`plaatje ${key}: ${e.message}`); }
    }
    try {
      panelTab = "log"; panelEl.hidden = false; renderPanel(); openDetail("shiny:crab"); closeDetail();
      panelTab = "set"; renderPanel();
      for (const f of ["missing", "found", "shiny", "album"]) { panelTab = "log"; logFilter = f; renderPanel(); }
      logFilter = "all";
      setLang(LANG === "nl" ? "en" : "nl"); panelTab = "log"; renderPanel(); openDetail("octopus"); panelTab = "set"; renderPanel();
      setLang(LANG === "nl" ? "en" : "nl");
      panelEl.hidden = true;
    } catch (e) { errors.push(`menu: ${e.message}`); }
    rebuilding = false;
    diverMode = false;
    canvas.style.transform = "";
    const out = document.createElement("pre");
    out.id = "selftest"; out.hidden = true;
    out.textContent = `${errors.length ? "FOUT" : "OK"}\n${oceans} oceanen in ${Math.round(performance.now() - t0)} ms\n${errors.join("\n")}`;
    document.body.appendChild(out);
  }

  // ---- start -------------------------------------------------------------
  applyLang();
  applyRewards();
  resize();
  // read the address before newVariant writes the seed into it
  const startHash = location.hash;
  const screenTest = /^#schermtest-(\d+)(?:-(logboek|menu|welkom))?$/.exec(startHash);
  if (screenTest) {
    welcomeEl.hidden = screenTest[2] !== "welkom";
    newVariant(Number(screenTest[1]), false);
    if (screenTest[2] === "logboek") bookBtn.click();
    if (screenTest[2] === "menu") menuBtn.click();
  } else {
    const initial = seedFromHash();
    newVariant(initial !== null ? initial : randomSeed(), false);
  }
  // the self-test runs straight away, so a headless browser can read the result as soon as the page has loaded
  const selfTestRun = /^#zelftest(?:-(\d+))?$/.exec(startHash);
  if (selfTestRun) { welcomeEl.hidden = true; last = performance.now(); selfTest(Number(selfTestRun[1] || 60)); }
  requestAnimationFrame(now => { last = now; frame(now); });

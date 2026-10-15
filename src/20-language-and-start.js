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
    canvas.setAttribute("aria-label", L("Een levende onderwaterwereld", "A living underwater world")); // what is in it: #sceneDesc
    document.getElementById("seedLabel").textContent = L("Oceaan", "Ocean");
    document.getElementById("closePanel").setAttribute("aria-label", L("Sluiten", "Close"));
    document.getElementById("welcomeTitle").textContent = L("Welkom in de oceaan", "Welcome to the ocean");
    document.getElementById("welcomeLead").textContent = L("Elke oceaan is anders. Kijk rond, ontdek wat er leeft en vul je logboek.", "Every ocean is different. Look around, discover what lives there and fill your logbook.");
    const howto = [
      L("Roep de <b>duiker</b> (D) en zwem rond. Houd zijn lamp even op iets nieuws: als het ringetje vol is, staat het in je <b>logboek</b> (L).", "Call the <b>diver</b> (D) and swim around. Hold its lamp on something new for a moment: when the ring is full, it is in your <b>logbook</b> (L)."),
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
      biomeEl.textContent = nm("w:" + water.name) + oceanTag();
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
    aquarium = null; // a fresh browser starts in the first dives; the test oceans are ordinary ones
    checkRegistry(errors);
    checkSameOcean(errors);
    checkIntro(errors);
    let prints = {};
    try { prints = seedPrints(); } catch (e) { errors.push("zaden: " + e.message); }
    // sound is on during the test (silent), so a broken sound shows up as an error
    try { if (!audio.ac) initAudio(); audio.on = !!audio.ac; if (audio.master) audio.master.gain.value = 0; } catch (e) { errors.push("geluid: " + e.message); }
    let oceans = 0;
    for (let sd = 1; sd <= count; sd++) {
      try {
        forceEvent = [null, ...EVENTS][sd % (EVENTS.length + 1)];
        newVariant(sd % 5 === 0 ? WADDEN_SEED + sd : sd, false); // every fifth ocean is a Wadden Sea
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
    forceEvent = null;
    thumbErrors.length = 0;
    for (const key of LOG_GROUPS.flatMap(g => g[1])) {
      try { renderThumb(key, true, 1); renderThumb(key, false, 1); } catch (e) { errors.push(`plaatje ${key}: ${e.message}`); }
    }
    checkPictures(errors);
    checkNewLimit(errors);
    for (const e of new Set(thumbErrors)) errors.push(`plaatje ${e}`);
    for (const b of brushLeaks) errors.push(`penseel niet teruggezet na een frame (${b})`);
    try {
      panelTab = "log"; panelEl.hidden = false; renderPanel(); openDetail("shiny:crab"); openDetail("crab", true); closeDetail();
      panelTab = "set"; renderPanel();
      for (const f of ["missing", "found", "shiny", "album", "all"]) { panelTab = "log"; logFilter = f; renderPanel(); }
      logFilter = "all";
      // calmer discovering: the dive report, a small polaroid, a ring in the lamp, and how long a new find needs
      diveFinds = ["crab", "shiny:crab", "w:rif"]; showDiveReport(); closeDiveReport();
      miniQueue.push({ key: "crab", pos: [W / 2, H / 2] }); miniNext = 0; fade = 0; flushMinis();
      scene.watch.push({ key: "test", get: () => null, hold: 0.5, need: 1, at: [W / 2, H / 2] }); drawHoldRings(); scene.watch.pop();
      selfTesting = false;
      const needs = [holdNeed("w:rif"), holdNeed(LOGGABLE.has("crab") && !logbook.has("crab") ? "crab" : "x")];
      selfTesting = true;
      if (needs[0] !== 0 || (LOGGABLE.has("crab") && !logbook.has("crab") && !(needs[1] > 0))) errors.push(`bijlichten: wachttijd klopt niet (${needs})`);
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
      if (a.visits && !VISITOR_DRAW[k]) miss.push("tekening als bezoeker (FAUNA_VIS)");
      if (a.visits && !VISITOR_SIZE[k]) miss.push("grootte als bezoeker (FAUNA_VIS)");
      if (miss.length) errors.push(`dier ${k}: mist ${miss.join(", ")}`);
    }
    for (const k of LOGGABLE) {
      const base = k.replace("shiny:", "");
      if (!NAMES[k] || !NAMES_EN[k]) errors.push(`logboek ${k}: naam ontbreekt`);
      if (!k.startsWith("shiny:") && (!FACTS[k] || !FACTS_EN[k])) errors.push(`logboek ${k}: weetje ontbreekt`);
      if (!THUMBS[base]) errors.push(`logboek ${k}: plaatje ontbreekt`);
    }
    if (new Set(AQ_ALL).size !== AQ_ALL.length) errors.push("aquarium: dubbele sleutel in AQ_ALL");
    for (const k of Object.keys(ANIMALS)) if ((ANIMALS[k].life || ANIMALS[k].visits) && !AQ_BASE.includes(k)) errors.push(`aquarium: zet ${k} achteraan in AQ_BASE (01-basis.js)`);
    // animals after the sixth round roll from their own stream, so they never change the oceans that were already there
    for (const k of AQ_BASE.slice(AQ_BASE.indexOf("lighthouse") + 1)) if (FAUNA[k] && !FAUNA[k].stream) errors.push(`dier ${k}: zet stream: true in FAUNA`);
    // every water stays readable in depth: its bottom at least four times darker (relative luminance) than its top
    const lum = hex => hexRgb(hex).map(c => c / 255).map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4).reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
    for (const w of WATERS) if (lum(w.top) < 4 * lum(w.bottom)) errors.push(`water ${w.name}: de bodemkleur is niet vier keer donkerder dan de bovenkant`);
    if (!WATERS.some(w => w.name === "wadden") || waterOfSeed(WADDEN_SEED, 0) !== WATERS.findIndex(w => w.name === "wadden")) errors.push("wateren: de Waddenzee is niet te kiezen");
    for (let i = 0; i < FIRST_WATERS; i++) if (waterOfSeed(5, (i + 0.5) / FIRST_WATERS) !== i) errors.push("wateren: oude seeds kiezen een ander water");
    for (const ev of EVENTS) {
      if (!/^\d\d-\d\d$/.test(ev.from) || !/^\d\d-\d\d$/.test(ev.to) || !ev.nl || !ev.en || !Array.isArray(ev.say) || ev.say.length !== 2) errors.push(`event ${ev.id}: datum, naam of tekst klopt niet`);
      for (const k of (ev.rare ? ev.rare.keys : [])) if (!RARE_KEYS.includes(k)) errors.push(`event ${ev.id}: onbekend zeldzaam ding ${k}`);
    }
    if (new Set(MILESTONES.map(m => m.id)).size !== MILESTONES.length) errors.push("mijlpalen: dubbele id");
    for (const [id, key] of STICKERS) if (!MILESTONES.some(m => m.id === id) || !THUMBS[key]) errors.push(`sticker ${id}: mijlpaal of plaatje (${key}) ontbreekt`);
    for (const m of MILESTONES) { const [a, b] = m.prog(); if (!(b > 0) || !isFinite(a)) errors.push(`mijlpaal ${m.id}: doel ${b} klopt niet`); }
  }

  // The first dives: each has the water and the things it promises, and the third one has its rare thing for the sonar.
  function checkIntro(errors) {
    try {
      INTRO.forEach((d, i) => {
        const wi = WATERS.findIndex(w => w.name === d.water);
        if (wi < 0) { errors.push(`eerste duik ${i + 1}: onbekend water ${d.water}`); return; }
        for (const k of d.set) if (!AQ_ALL.includes(k) && !RARE_KEYS.includes(k)) errors.push(`eerste duik ${i + 1}: onbekend ding ${k}`);
        aquarium = { water: wi, set: new Set(d.set), shiny: false, intro: i + 1 };
        newVariant(d.seed, false);
        const life = presentLife(scene), here = new Set([...Object.keys(life).filter(k => life[k]), ...scene.ground.map(g => g.kind), ...scene.rares, ...water.visitors]);
        const missing = d.set.filter(k => !here.has(k));
        if (missing.length) errors.push(`eerste duik ${i + 1}: mist ${missing.join(", ")}`);
        if (claim(5)) errors.push(`eerste duik ${i + 1}: grote momenten zijn niet uit`);
      });
    } catch (e) { errors.push("eerste duiken: " + e.message); }
    aquarium = null;
  }

  // The same seed must be the same ocean on a computer, a phone and a phone on its side.
  function checkSameOcean(errors) {
    const keep = { W, H, u, rng, scene, water, seed };
    const look = (w, h, sd) => {
      W = w; H = h; u = uFor(W, H); seed = sd; rng = mulberry32(sd); buildScene();
      const life = presentLife(scene);
      return [water.name, scene.season, scene.rare, scene.ground.map(g => g.kind).sort().join(","),
        Object.keys(life).filter(k => life[k]).sort().join(","), scene.shinies.map(e => e.key).sort().join(",")].join(" | ");
    };
    try {
      for (const sd of [...Array.from({ length: 30 }, (_, i) => i + 1), WADDEN_SEED + 1, WADDEN_SEED + 2, WADDEN_SEED + 3]) {
        const a = look(1440, 900, sd), b = look(390, 844, sd), c = look(844, 390, sd);
        if (a !== b || b !== c) { errors.push(`seed ${sd} is niet overal dezelfde oceaan:
  ${a}
  ${b}
  ${c}`); break; }
      }
    } finally { ({ W, H, u, rng, scene, water, seed } = keep); }
  }

  // A fingerprint of 35 fixed oceans (seeds 1 to 30 and five Wadden Sea seeds), for check.py: it compares them with zaden.json, so you see when
  // a change (a new animal, another chance) makes old shared links show a different ocean.
  function seedPrints() {
    const keep = { W, H, u, rng, scene, water, seed }, out = {};
    const r2 = v => Math.round(v * 100) / 100;
    try {
      for (const sd of [...Array.from({ length: 30 }, (_, i) => i + 1), ...[1, 2, 3, 4, 5].map(i => WADDEN_SEED + i)]) {
        W = 1440; H = 900; u = uFor(W, H); seed = sd; rng = mulberry32(sd); buildScene();
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

  // ---- the style sheet: every logbook picture side by side (#stijlblad) ----
  // To check a new drawing against the animals around it: ordinary, shiny and not yet found, family by family.
  // check.py keeps a screenshot of it in checks/stijlblad.png.
  function showStyleSheet() {
    const el = document.createElement("div");
    el.id = "stijlblad";
    let html = `<h1>${L("Stijlblad", "Style sheet")}</h1><p>${L("Alle logboekplaatjes per familie: gewoon, shiny (als die er is) en nog niet gevonden.", "Every logbook picture per family: ordinary, shiny (if there is one) and not found yet.")}</p>`;
    for (const [title, , subs] of LOG_GROUPS) {
      if (title === "Shiny") continue; // the shinies already stand next to their animal
      html += `<h2>${groupName(title)}</h2>`;
      for (const [nl, en, keys] of subs) {
        html += `<h3>${L(nl, en)}</h3><div class="sb-grid">` + keys.map(k => {
          const pics = [thumbURL(k, true), SHINY_KEYS.includes(k) ? thumbURL("shiny:" + k, true) : "", FULL_THUMBS.has(k) ? "" : thumbURL(k, false)];
          return `<figure data-key="${k}"><div>${pics.filter(Boolean).map(src => `<img alt="" src="${src}">`).join("")}</div><figcaption>${nm(k)}</figcaption></figure>`;
        }).join("") + `</div>`;
      }
    }
    el.innerHTML = html;
    document.body.appendChild(el);
  }

  // An ocean for a player with an empty logbook holds at most four new animals, and building it twice gives the same ocean.
  function checkNewLimit(errors) {
    const keep = { W, H, u, rng, scene, water, seed, leaveOut }, wasTesting = selfTesting;
    try {
      selfTesting = false;
      for (let sd = 1; sd <= 12; sd++) {
        W = 1440; H = 900; u = uFor(W, H); seed = sd; rng = mulberry32(sd);
        buildLimited(true);
        const here = newHere(), first = here.join(",");
        if (here.length > NEW_LIMIT) errors.push(`nieuwe dieren: oceaan ${sd} heeft er ${here.length} (${first})`);
        rng = mulberry32(sd); buildLimited(true);
        if (newHere().join(",") !== first) errors.push(`nieuwe dieren: oceaan ${sd} is de tweede keer anders`);
      }
    } catch (e) { errors.push("nieuwe dieren: " + e.message); }
    finally { selfTesting = wasTesting; ({ W, H, u, rng, scene, water, seed, leaveOut } = keep); }
  }

  // Every animal's picture has something on it, also after it has been put in its frame.
  function checkPictures(errors) {
    for (const k of Object.keys(ANIMALS)) {
      try { if (!layerBox(thumbLayer(k, k, false, 1, thumbFit(k)), 1)) errors.push(`plaatje ${k}: leeg na het kadreren`); }
      catch (e) { errors.push(`plaatje ${k}: ${e.message}`); }
    }
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
  if (!store.get("oceaan-wadden-gezien", false)) { keepGlobetrotter(); store.set("oceaan-wadden-gezien", true); }
  applyLang();
  applyRewards();
  resize();
  // read the address before newVariant writes the seed into it
  const startHash = location.hash;
  const screenTest = /^#schermtest-(\d+)(?:-(logboek|menu|welkom|detail|ontdek|nacht))?$/.exec(startHash);
  if (startHash === "#stijlblad") {
    welcomeEl.hidden = true;
    newVariant(7, false);
    showStyleSheet();
  } else if (screenTest) {
    welcomeEl.hidden = screenTest[2] !== "welkom";
    newVariant(Number(screenTest[1]), false);
    if (screenTest[2] === "logboek") bookBtn.click();
    if (screenTest[2] === "detail") { bookBtn.click(); openDetail("octopus"); }
    // finding things: the diver, a ring filling up in the lamp, a small polaroid on its way and the dive report
    if (screenTest[2] === "ontdek") {
      setTimeout(() => {
        diverBtn.click();
        scene.watch.push({ key: "test", get: () => null, hold: 0.6, need: 1, at: [diver.x + 90 * u, diver.y - 30 * u] });
        miniQueue.push({ key: "starfish", pos: [W * 0.3, H * 0.6] }); miniNext = 0;
        diveFinds = ["crab", "starfish", "octopus", "shiny:crab", "jelly", "fish"]; showDiveReport();
      }, 1900); // late, so the screenshot catches the ring and the polaroid halfway
    }
    if (screenTest[2] === "menu") menuBtn.click();
    // the middle of the night (the day takes 160 seconds; night is deepest halfway)
    if (screenTest[2] === "nacht") scene.dayOffset = 0.5 - t / 160;
  } else {
    const initial = seedFromHash();
    initIntro();
    if (initial === null && introLeft()) startIntro(false);
    else { personalOcean = initial === null; newVariant(initial !== null ? initial : randomSeed(), false); }
  }
  // the self-test runs straight away, so a headless browser can read the result as soon as the page has loaded
  const selfTestRun = /^#zelftest(?:-(\d+))?$/.exec(startHash);
  if (selfTestRun) { welcomeEl.hidden = true; last = performance.now(); selfTest(Number(selfTestRun[1] || 60)); }
  requestAnimationFrame(now => { last = now; frame(now); });

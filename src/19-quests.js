  // ---- the quest of the day, the photo book and the water filter ------------------------
  // Every day has its own small quest, the same for everyone on that date. The photo book has photo tasks that are
  // checked against what is in view when you take a photo.
  const famKeys = fam => { const s = LOG_SUBS["Dieren"].find(x => x[0] === fam); return s ? s[2] : []; };
  const QUESTS = [
    { kind: "fam", fam: "Roggen", n: 3, nl: "Zie 3 roggen", en: "See 3 rays" },
    { kind: "fam", fam: "Haaien en grote vissen", n: 2, nl: "Zie 2 haaien of grote vissen", en: "See 2 sharks or big fish" },
    { kind: "fam", fam: "Walvissen en dolfijnen", n: 2, nl: "Zie 2 walvissen of dolfijnen", en: "See 2 whales or dolphins" },
    { kind: "fam", fam: "Inktvissen", n: 2, nl: "Zie 2 inktvissen of octopussen", en: "See 2 squid or octopuses" },
    { kind: "fam", fam: "Kwallen", n: 2, nl: "Zie 2 kwallen", en: "See 2 jellies" },
    { kind: "fam", fam: "Zoogdieren en vogels", n: 2, nl: "Zie 2 zeezoogdieren of zeevogels", en: "See 2 sea mammals or seabirds" },
    { kind: "fam", fam: "Reptielen", n: 1, nl: "Zie een zeeschildpad, zeeslang of krokodil", en: "See a sea turtle, sea snake or crocodile" },
    { kind: "rescue", n: 1, nl: "Bevrijd een dier uit een spooknet", en: "Free an animal from a ghost net" },
    { kind: "shiny", n: 1, nl: "Vind een shiny", en: "Find a shiny" },
    { kind: "moment", n: 2, nl: "Beleef 2 momenten", en: "Witness 2 moments" },
    { kind: "water", n: 3, nl: "Duik in 3 verschillende wateren", en: "Dive in 3 different waters" },
    { kind: "photo", n: 2, nl: "Bewaar 2 foto's in je album", en: "Keep 2 photos in your album" },
  ];
  const QUEST_KEY = "oceaan-dagopdracht";
  function todayStr() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
  function todayQuest() {
    const d = new Date(), day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
    return QUESTS[(day * 7 + 3) % QUESTS.length];
  }
  function questState() {
    let s = store.get(QUEST_KEY, null);
    if (!s || s.day !== todayStr()) s = { day: todayStr(), have: 0, waters: [], done: false };
    return s;
  }
  function questEvent(kind, key) {
    if (rebuilding) return;
    const q = todayQuest(), s = questState();
    if (s.done) return;
    let hit = false;
    if (kind === "seen") {
      if (q.kind === "fam") hit = famKeys(q.fam).includes(key);
      else if (q.kind === "shiny") hit = key.startsWith("shiny:");
      else if (q.kind === "moment") hit = MOMENT_KEYS.includes(key) || key === "aurora";
      else if (q.kind === "water" && key.startsWith("w:") && !s.waters.includes(key)) { s.waters.push(key); hit = true; }
    } else hit = kind === q.kind;
    if (!hit) return;
    s.have++;
    if (s.have >= q.n) {
      s.done = true; store.set(QUEST_KEY, s);
      const before = reached();
      store.set("oceaan-dagen", store.get("oceaan-dagen", 0) + 1);
      toast(L(`Opdracht van de dag gelukt: ${q.nl.toLowerCase()}!`, `Quest of the day done: ${q.en.toLowerCase()}!`));
      sfxShiny();
      checkMilestones(before);
    } else {
      store.set(QUEST_KEY, s);
      toast(L(`Opdracht van de dag: ${s.have} van ${q.n}`, `Quest of the day: ${s.have} of ${q.n}`));
    }
  }
  function questHTML() {
    const q = todayQuest(), s = questState();
    return `<p class="nb-quest"><b>${L("Opdracht van vandaag", "Today's quest")}</b> ${L(q.nl, q.en)} <span>${s.done ? L("✓ gelukt", "✓ done") : `${s.have}/${q.n}`}</span></p>`;
  }

  // ---- the photo book ---------------------------------------------------------------
  let lastPhotoHits = [];
  function photoHits() {
    const S = scene, hits = [], on = (x, y) => isFinite(x) && isFinite(y) && x > 0 && x < W && y > 0 && y < H;
    const v = S.visitor;
    if (diverMode && v && famKeys("Walvissen en dolfijnen").includes(v.type) && on(v.x, v.y + (v.yOff || 0))) hits.push("whale");
    if ((S.shinies || []).some(e => { try { const p = e.get(); return (!e.alive || e.alive()) && p && on(p[0], p[1]); } catch (err) { return false; } })) hits.push("shiny");
    if (S.leviathan && S.leviathan.active && S.leviathan.eye && on(S.leviathan.eye[0], S.leviathan.eye[1])) hits.push("leviathan");
    if (S.aurora && S.aurora.active && S.aurora.fade > 0.4) hits.push("aurora");
    if (S.net && S.net.active && S.net.state === "free") hits.push("freed");
    if (diverMode) {
      const kinds = new Set();
      for (const f of S.fauna || []) if (f.cy !== undefined && lit(f.x, f.cy, f.s * 0.3)) kinds.add(f.key);
      for (const sp of S.species) if (sp.fish.some(f => lit(f.x, f.y, 4 * u))) kinds.add(sp.lantern ? "lantern" : "fish:" + sp.main);
      for (const j of S.jellies) if (lit(j.x, j.y, j.r)) kinds.add("jelly");
      if (v && lit(v.x, v.y + (v.yOff || 0), v.size * 0.3)) kinds.add(v.type);
      if (kinds.size >= 3) hits.push("lamp3");
    }
    // the bear counts from the moment it comes into view at the top, mid-jump
    if ((S.fauna || []).some(f => f.key === "polarbear" && f.st === "jump" && f.cy !== undefined && f.x > 0 && f.x < W && f.cy > -f.s * 0.4 && f.cy < H)) hits.push("bear");
    if (S.sardines && S.sardines.active) hits.push("sardine");
    return hits;
  }
  const photoBookDone = () => store.get("oceaan-fotoboek", []);
  function photoBookAdd(hits) {
    const done = photoBookDone(), fresh = hits.filter(h => !done.includes(h));
    if (!fresh.length) return;
    const before = reached();
    store.set("oceaan-fotoboek", [...done, ...fresh]);
    for (const h of fresh) { const task = PHOTO_TASKS.find(x => x[0] === h); if (task) toast(L(`Foto-opdracht gelukt: ${task[1].toLowerCase()}!`, `Photo task done: ${task[2].toLowerCase()}!`)); }
    checkMilestones(before);
  }
  function photoBookHTML() {
    const done = photoBookDone();
    return `<h4 class="nb-fam">${L("Fotoboek", "Photo book")} <span>${PHOTO_TASKS.filter(x => done.includes(x[0])).length}/${PHOTO_TASKS.length}</span></h4>
      <p class="nb-note">${L("Maak een foto en bewaar hem in je album: wat er dan in beeld is, telt.", "Take a photo and keep it in your album: what is in view at that moment counts.")}</p>
      <ul class="nb-check">` + PHOTO_TASKS.map(([id, nl, en]) => `<li class="${done.includes(id) ? "on" : ""}"><span class="box" aria-hidden="true">${done.includes(id) ? "✓" : ""}</span><span class="what">${L(nl, en)}</span></li>`).join("") + `</ul>`;
  }

  // ---- the water filter of the logbook ---------------------------------------------------
  let logWater = "";
  function inLogWater(k) {
    if (!logWater) return true;
    const w = WATERS.find(x => x.name === logWater);
    if (!w) return true;
    if (k.startsWith("w:")) return k === "w:" + logWater;
    if (k === "fish" || k === "jelly") return true;
    if ((w.props[k] || 0) > 0 || (w.life[k] || 0) > 0 || w.visitors.includes(k) || (RARES_BY_WATER[logWater] || []).includes(k)) return true;
    const extra = WATER_OF[k];
    return !!extra && extra(w);
  }
  // where the moments and the animals that belong to something (an anemone, a wreck, a chest) can be found
  const waterHas = (w, prop) => (w.props[prop] || 0) > 0;
  const WATER_OF = {
    clown: w => waterHas(w, "anemone"), moray: w => waterHas(w, "wreck"), mimic: w => waterHas(w, "chest"), treasure: w => waterHas(w, "bottle"),
    grouper: w => (w.life.cleaners || 0) > 0, giant: w => !!w.giantSquid, task: w => (w.life.seahorse || 0) > 0,
    storm: w => !!w.surface, waterspout: w => !!w.surface, meteor: w => !!w.surface, eclipse: w => !!w.surface, glowtide: w => !!w.surface && !w.ice,
    quake: () => true, spawning: () => true, jellybloom: () => true, crabmarch: () => true,
    baitball: w => w.name !== "diepzee", ghostnet: w => w.name !== "diepzee" && w.name !== "grot",
    eruption: w => waterHas(w, "volcano"), coralspawn: w => waterHas(w, "coral"),
    aurora: w => ["ijszee", "noordzee", "kelpwoud"].includes(w.name), whirlpool: w => ["noordzee", "kelpwoud", "ijszee"].includes(w.name),
    sardinerun: w => ["kelpwoud", "sargasso"].includes(w.name), eelmigration: w => ["sargasso", "noordzee", "kelpwoud", "mangrove"].includes(w.name),
    bubblerings: w => w.visitors.includes("dolphins"), hatchlings: w => w.visitors.includes("turtle"), whalesong: w => w.visitors.includes("humpback"),
  };
  function waterFilterHTML() {
    return `<h4 class="nb-fam">${L("Water", "Water")}</h4><div class="filters" role="group" aria-label="${L("Water", "Water")}">` +
      [["", L("Alle wateren", "All waters")], ...WATERS.map(w => [w.name, nm("w:" + w.name)])].map(([id, label]) => `<button type="button" class="chip pick ${logWater === id ? "on" : ""}" data-logwater="${id}" aria-pressed="${logWater === id}">${label}</button>`).join("") + `</div>`;
  }

  // ---- comparing logbooks ----------------------------------------------------------------
  // A logbook code is one bit for every find, in alphabetical order of their keys, with the number of finds in front,
  // so two players on different versions of the ocean are told so instead of getting a wrong answer.
  const LOG_CODE_KEYS = [...LOGGABLE].sort();
  function logCode() {
    let m = 0n;
    LOG_CODE_KEYS.forEach((k, i) => { if (logbook.has(k)) m |= 1n << BigInt(i); });
    return `lb-${LOG_CODE_KEYS.length}-${m.toString(36)}`;
  }
  function readLogCode(str) {
    const mm = /lb-(\d+)-([0-9a-z]+)/.exec(str.trim().toLowerCase());
    if (!mm) return null;
    if (Number(mm[1]) !== LOG_CODE_KEYS.length) return { other: true };
    let m = 0n;
    for (const ch of mm[2]) m = m * 36n + BigInt(parseInt(ch, 36));
    return { set: new Set(LOG_CODE_KEYS.filter((k, i) => (m >> BigInt(i)) & 1n)) };
  }
  function compareHTML(str) {
    const r = readLogCode(str);
    if (!r) return `<p class="sum">${L("Die code herken ik niet. Een logboekcode begint met lb-", "That code is not recognised. A logbook code starts with lb-")}</p>`;
    if (r.other) return `<p class="sum">${L("Jullie spelen een andere versie van de oceaan. Vernieuw allebei de pagina en probeer het opnieuw.", "You are playing different versions of the ocean. Both refresh the page and try again.")}</p>`;
    const mine = LOG_CODE_KEYS.filter(k => logbook.has(k)), theirs = [...r.set];
    const theyHave = theirs.filter(k => !logbook.has(k)), iHave = mine.filter(k => !r.set.has(k)), both = new Set([...mine, ...theirs]).size;
    const list = keys => keys.length ? `<div class="chips">` + keys.slice(0, 40).map(k => `<span class="chip">${nm(k)}</span>`).join("") + (keys.length > 40 ? `<span class="chip">${L(`…en nog ${keys.length - 40}`, `…and ${keys.length - 40} more`)}</span>` : "") + `</div>` : `<p class="sum">${L("Niets.", "Nothing.")}</p>`;
    return `<p class="sum">${L(`Jij hebt <b>${mine.length}</b>, je vriend <b>${theirs.length}</b>, samen <b>${both}</b> van de ${LOG_CODE_KEYS.length}.`, `You have <b>${mine.length}</b>, your friend <b>${theirs.length}</b>, together <b>${both}</b> of ${LOG_CODE_KEYS.length}.`)}</p>
      <h4>${L(`Je vriend heeft, en jij nog niet (${theyHave.length})`, `Your friend has, and you do not yet (${theyHave.length})`)}</h4>${list(theyHave)}
      <h4>${L(`Jij hebt, en je vriend nog niet (${iHave.length})`, `You have, and your friend does not yet (${iHave.length})`)}</h4>${list(iHave)}`;
  }

  // ---- the hunt list -----------------------------------------------------------------------
  // Up to three things you have not found yet, pinned from their logbook page. A new ocean tells you when one of them
  // is here (or may turn up), and finding one crosses it off. The sonar keeps listening only for rare things.
  const HUNT_KEY = "oceaan-speurlijst", HUNT_MAX = 3;
  let hunt = store.get(HUNT_KEY, []).filter(k => typeof k === "string" && LOGGABLE.has(k) && !logbook.has(k)).slice(0, HUNT_MAX);
  const saveHunt = () => store.set(HUNT_KEY, hunt);
  function toggleHunt(key) {
    if (hunt.includes(key)) hunt = hunt.filter(k => k !== key);
    else if (hunt.length >= HUNT_MAX) { toast(L(`Je speurlijst is vol (${HUNT_MAX}). Haal er eerst een af.`, `Your hunt list is full (${HUNT_MAX}). Take one off first.`)); return; }
    else hunt.push(key);
    saveHunt();
  }
  function huntButtonHTML(key) {
    if (logbook.has(key)) return "";
    const on = hunt.includes(key);
    return `<button type="button" class="nb-back nb-hunt${on ? " on" : ""}" data-hunt="${key}" aria-pressed="${on}">${on ? L("✓ Op je speurlijst", "✓ On your hunt list") : L("+ Op mijn speurlijst", "+ Add to my hunt list")}</button>`;
  }
  // the hunt list on the first page of the logbook
  function huntHTML() {
    const list = hunt.filter(k => !logbook.has(k));
    if (!list.length) return `<p class="nb-note">${L("Tip: zet iets wat je nog zoekt op je speurlijst, via zijn pagina in het logboek.", "Tip: put something you are still looking for on your hunt list, from its page in the logbook.")}</p>`;
    return `<h4 class="nb-fam">${L("Speurlijst", "Hunt list")} <span>${list.length}/${HUNT_MAX}</span></h4><div class="cards">` +
      list.map(k => k.startsWith("shiny:") ? bookCard(k.slice(6), false, true) : bookCard(k, false)).join("") + `</div>`;
  }
  // called from seen(): a find on the hunt list is crossed off
  function huntFound(key) {
    if (!hunt.includes(key)) return;
    hunt = hunt.filter(k => k !== key); saveHunt();
    toast(L(`Van je speurlijst gevonden: ${nm(key)}!`, `Found from your hunt list: ${nm(key)}!`), "important");
  }
  // "here" when it is in this ocean right now, "can" when it may turn up (a visitor, a moment, a shiny), "" when not
  function huntChance(key) {
    if (key.startsWith("w:")) return "";
    const shiny = key.startsWith("shiny:"), base = shiny ? key.slice(6) : key, S = scene, life = presentLife(S);
    const here = !!life[base] || S.ground.some(g => g.kind === base) || S.rare === base;
    if (here) return shiny ? "can" : "here";
    if (RARE_KEYS.includes(base)) return "";
    if (water.visitors.includes(base)) return "can";
    // moments: read the Dutch hint, which names the waters ("in de IJszee"), "elk water" or "wateren met een oppervlak"
    const hint = (EVENT_HINTS[base] || "").toLowerCase();
    if (MOMENT_KEYS.includes(base) && !hint.includes("behalve de " + NAMES["w:" + water.name].toLowerCase())
      && (hint.includes(NAMES["w:" + water.name].toLowerCase()) || hint.includes("elk water") || (hint.includes("oppervlak") && water.surface))) return "can";
    return "";
  }
  function huntNotice() {
    if (aquarium || selfTesting || rebuilding || !hunt.length) return;
    const here = hunt.filter(k => huntChance(k) === "here"), can = hunt.filter(k => huntChance(k) === "can");
    const names = keys => keys.map(nm).join(L(" en ", " and "));
    if (here.length) toast(L(`Speurlijst: ${names(here)} ${here.length > 1 ? "zijn" : "is"} hier! Roep de duiker.`, `Hunt list: ${names(here)} ${here.length > 1 ? "are" : "is"} here! Call the diver.`), "important");
    if (can.length) toast(L(`Speurlijst: hier kan ${names(can)} langskomen.`, `Hunt list: ${names(can)} may turn up here.`));
  }

  // the glitter meter on the first page of the logbook (see shinyChance in 01-basis.js)
  function glintHTML() {
    const n = Math.min(store.get(GLINT_KEY, 0), GLINT_MAX);
    if (!n) return "";
    const x = glintBoost().toFixed(2).replace(/0$/, ""), xs = LANG === "en" ? x : x.replace(".", ",");
    const dots = Math.round(n / GLINT_MAX * 10);
    return `<p class="nb-note nb-glint"><b>${L("Glinstermeter", "Glitter meter")}</b> <span aria-hidden="true">${"✦".repeat(dots)}${"·".repeat(10 - dots)}</span> ` +
      L(`Shiny's zijn nu ${xs}× zo vaak. Een nieuwe shiny maakt de meter weer leeg.`, `Shinies are now ${xs}× as common. A new shiny empties the meter again.`) + `</p>`;
  }

  // a calendar event on the first page of the logbook (see EVENTS in 01-basis.js)
  function eventHTML() {
    const ev = activeEvent();
    return ev ? `<p class="nb-quest"><b>${L(ev.nl, ev.en)}</b> ${L(ev.say[0], ev.say[1])}</p>` : "";
  }

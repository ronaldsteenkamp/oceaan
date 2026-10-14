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
    if ((S.fauna || []).some(f => f.key === "polarbear" && f.st === "jump" && on(f.x, f.cy || 0))) hits.push("bear");
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
    return (w.props[k] || 0) > 0 || (w.life[k] || 0) > 0 || w.visitors.includes(k) || (RARES_BY_WATER[logWater] || []).includes(k);
  }
  function waterFilterHTML() {
    return `<h4 class="nb-fam">${L("Water", "Water")}</h4><div class="filters" role="group" aria-label="${L("Water", "Water")}">` +
      [["", L("Alle wateren", "All waters")], ...WATERS.map(w => [w.name, nm("w:" + w.name)])].map(([id, label]) => `<button type="button" class="chip pick ${logWater === id ? "on" : ""}" data-water="${id}" aria-pressed="${logWater === id}">${label}</button>`).join("") + `</div>`;
  }

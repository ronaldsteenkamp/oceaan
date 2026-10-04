  // ---- interaction -------------------------------------------------------
  // A tap starts a new ocean (or opens the chest), a long press feeds the fish, a drag stirs the water.
  let down = null, feedTimer = null;
  canvas.addEventListener("pointermove", e => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; pointer.moved = performance.now();
    if (down && !feeding && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) clearTimeout(feedTimer);
  });
  canvas.addEventListener("pointerleave", () => { pointer.active = false; feeding = false; clearTimeout(feedTimer); });
  canvas.addEventListener("pointerdown", e => {
    down = { x: e.clientX, y: e.clientY, time: performance.now() };
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
    clearTimeout(feedTimer);
    feedTimer = setTimeout(() => { if (down) feeding = true; }, 450);
  });
  canvas.addEventListener("pointerup", e => {
    clearTimeout(feedTimer);
    if (e.pointerType !== "mouse") pointer.active = false;
    const wasFeeding = feeding;
    feeding = false;
    if (!down || wasFeeding) { down = null; return; }
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    const quick = performance.now() - down.time < 350;
    down = null;
    if (moved < 10 && quick) handleTap(e.clientX, e.clientY);
  });

  function handleTap(x, y) {
    const S = scene;
    if (mapT > 0) { mapT = Math.min(mapT, 0.5); return; }
    const hid = S.hidden.find(h => !h.found && h.x !== undefined && Math.hypot(x - h.x, y - (h.y - 5 * u)) < 24 * u);
    if (hid) {
      hid.found = true; hid.flash = 1;
      sfxChest();
      updateTask();
      if (S.hidden.every(h => h.found)) {
        seen("task");
        buzz([40, 50, 40, 50, 80]);
        for (let i = 0; i < 20; i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 2, v = (1 + Math.random() * 3) * u; coins.push({ x: hid.x, y: hid.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 4 * u, rot: Math.random() * TAU, spin: 0.2, life: 4 }); }
      }
      return;
    }
    const bottle = S.ground.find(g => g.kind === "bottle" && Math.hypot(x - g.x, y - (sandY(g.x) - g.s * 0.3)) < g.s * 1.4);
    if (bottle && S.treasure && !S.treasure.dug) { mapT = 8; sfxChest(); return; }
    if (S.treasure && !S.treasure.dug && Math.abs(x - S.treasure.x) < 35 * u && Math.abs(y - sandY(S.treasure.x)) < 50 * u) { dig(); return; }
    const chest = S.ground.find(g => g.kind === "chest" && Math.hypot(x - g.x, y - (sandY(g.x) - g.s * 0.4)) < g.s * 1.2);
    if (chest) { chestBurst(chest); return; }
    if (diverMode) return;
    newVariant(randomSeed(), true);
  }
  canvas.addEventListener("pointercancel", () => { pointer.active = false; down = null; feeding = false; clearTimeout(feedTimer); });
  canvas.addEventListener("contextmenu", e => e.preventDefault());

  document.getElementById("welcomeGo").addEventListener("click", () => { welcomeEl.hidden = true; store.set("oceaan-welkom", true); });
  if (!store.get("oceaan-welkom", false)) welcomeEl.hidden = false;

  // Arrow keys steer the diver (and call it in); Enter opens whatever the diver touches.
  const keys = { ArrowLeft: 0, ArrowRight: 0, ArrowUp: 0, ArrowDown: 0 };
  addEventListener("keyup", e => { if (e.key in keys) keys[e.key] = 0; });
  function diverInteract() {
    const S = scene, spots = [];
    for (const g of S.ground) {
      if (g.kind === "chest") spots.push([g.x, sandY(g.x) - g.s * 0.4]);
      if (g.kind === "bottle") spots.push([g.x, sandY(g.x) - g.s * 0.3]);
    }
    if (S.treasure && !S.treasure.dug) spots.push([S.treasure.x, sandY(S.treasure.x)]);
    for (const h of S.hidden) if (!h.found && h.x !== undefined) spots.push([h.x, h.y - 5 * u]);
    let best = null, bd = 90 * u;
    for (const p of spots) { const d = Math.hypot(p[0] - diver.x, p[1] - diver.y); if (d < bd) { bd = d; best = p; } }
    if (best) handleTap(best[0], best[1]);
    else toast(L("Zwem dichter naar een kist, fles of zeepaardje", "Swim closer to a chest, bottle or seahorse"));
  }

  addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (!panelEl.hidden && detailOpen) { closeDetail(); return; }
      if (!panelEl.hidden) closePanel();
      welcomeEl.hidden = true;
      if (!photoView.hidden) closePhoto();
      return;
    }
    const focusTag = document.activeElement && document.activeElement.tagName;
    if (e.key in keys && focusTag !== "INPUT") {
      e.preventDefault();
      keys[e.key] = 1;
      if (!diverMode) diverBtn.click();
      return;
    }
    if ((e.key === "e" || e.key === "E") && diverMode && focusTag !== "INPUT") { e.preventDefault(); diverInteract(); return; }
    if (e.key === " " || e.key === "Enter") {
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === "BUTTON" || tag === "INPUT" || !photoView.hidden) return;
      e.preventDefault(); newVariant(randomSeed(), true);
    }
  });

  addEventListener("hashchange", () => {
    const s = seedFromHash();
    if (s !== null && s !== seed) newVariant(s, true);
  });

  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  // ---- save PNG ----------------------------------------------------------
  let downloads;
  if (window.claude && typeof window.claude.use === "function") {
    window.claude.use("downloads").then(d => { downloads = d; }).catch(() => {});
  }

  taskEl.addEventListener("click", explainTask);

  // ---- diver, menu and photo buttons -------------------------------------
  diverBtn.addEventListener("click", () => {
    diverMode = !diverMode;
    if (diverMode) {
      diver.x = W * 0.5; diver.y = H * 0.45; diver.vx = diver.vy = 0;
      toast(L("Stuur de duiker met je vinger, je muis of de pijltjes. Druk op E om te openen wat hij aanraakt. De spatiebalk geeft een nieuwe oceaan.", "Steer the diver with your finger, mouse or arrow keys. Press E to open what the diver touches. Space gives a new ocean."));
    }
    diverBtn.setAttribute("aria-pressed", String(diverMode));
  });

  let panelOpener = null;
  function openPanel(tab, opener) {
    panelTab = tab;
    panelOpener = opener || null;
    panelEl.hidden = false;
    renderPanel();
    panelTitle.focus();
  }
  function closePanel() {
    panelEl.hidden = true;
    if (panelOpener) panelOpener.focus();
  }
  menuBtn.addEventListener("click", () => {
    if (!panelEl.hidden && panelTab === "set") { closePanel(); return; }
    aqDraft = null;
    openPanel("set", menuBtn);
  });
  // The book opens the logbook straight away.
  bookBtn.addEventListener("click", () => {
    if (!panelEl.hidden && panelTab === "log") { closePanel(); return; }
    bookDot.hidden = true;
    openPanel("log", bookBtn);
  });
  document.getElementById("closePanel").addEventListener("click", closePanel);

  // Tab stays inside whichever dialog is open.
  addEventListener("keydown", e => {
    if (e.key !== "Tab") return;
    const dlg = [photoView, welcomeEl, panelEl].find(d => !d.hidden);
    if (!dlg) return;
    const items = [...dlg.querySelectorAll("button, input, [tabindex]")].filter(el => !el.disabled && el.offsetParent !== null && el.tabIndex >= 0);
    if (!items.length) return;
    const first = items[0], lastItem = items[items.length - 1];
    if (!dlg.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastItem.focus(); }
    else if (!e.shiftKey && document.activeElement === lastItem) { e.preventDefault(); first.focus(); }
  });

  // On touch screens the icons get a label for the first visits; holding a button shows its name.
  const visits = store.get("oceaan-bezoeken", 0) + 1;
  store.set("oceaan-bezoeken", visits);
  const touchOnly = matchMedia("(hover: none)").matches;
  if (touchOnly && visits <= 3) toolbarEl.classList.add("labels");
  let holdTimer = null, held = false;
  toolbarEl.addEventListener("pointerdown", e => {
    const b = e.target.closest(".tool");
    if (!b || e.pointerType === "mouse") return;
    held = false;
    holdTimer = setTimeout(() => { held = true; toast(b.dataset.tip); buzz(15); }, 500);
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(ev => toolbarEl.addEventListener(ev, () => clearTimeout(holdTimer)));
  toolbarEl.addEventListener("click", e => { if (held) { held = false; e.stopPropagation(); e.preventDefault(); } }, true);

  function renderPanel() {
    panelTitle.textContent = panelTab === "set" ? L("Maken en delen", "Create and share") : L("Logboek", "Logbook");
    detailOpen = false;
    if (panelTab === "set") { renderMake(); return; }
    bookDot.hidden = true;
    const all = LOG_GROUPS.flatMap(g => g[1]).filter(k => !k.startsWith("shiny:"));
    const got = all.filter(k => logbook.has(k)).length;
    const shinyGot = SHINY_KEYS.filter(k => logbook.has("shiny:" + k)).length;
    let html = `<p class="sum">${L(`<b>${got}</b> van ${all.length} gezien, en <b>${shinyGot}</b> van ${SHINY_KEYS.length} shiny. Tik op een plaatje voor meer over dat dier of die vondst.`, `<b>${got}</b> of ${all.length} seen, and <b>${shinyGot}</b> of ${SHINY_KEYS.length} shiny. Tap a picture to learn more.`)}</p>`;
    html += `<div class="progress" aria-hidden="true"><i style="width:${Math.round((got / all.length) * 100)}%"></i></div>`;
    html += `<div class="badges">` + MILESTONES.map(m => `<span class="badge ${m.need() ? "on" : ""}">${L(m.name[0], m.name[1])} · ${L(m.goal[0], m.goal[1])}</span>`).join("") + `</div>`;
    const FILTERS = [["all", L("Alles", "All")], ["missing", L("Nog niet gevonden", "Not found yet")], ["found", L("Gevonden", "Found")], ["shiny", "Shiny"], ["album", L("Mijn foto's", "My photos")]];
    html += `<div class="filters" role="group" aria-label="${L("Laat zien", "Show")}">` + FILTERS.map(([id, label]) => `<button type="button" class="chip pick ${logFilter === id ? "on" : ""}" data-filter="${id}" aria-pressed="${logFilter === id}">${label}</button>`).join("") + `</div>`;
    if (logFilter === "album") html += albumHTML();
    for (const [title, allKeys] of logFilter === "album" ? [] : LOG_GROUPS) {
      const keys = allKeys.filter(k => logFilter === "all" || (logFilter === "missing" && !logbook.has(k)) || (logFilter === "found" && logbook.has(k)) || (logFilter === "shiny" && k.startsWith("shiny:")));
      if (!keys.length) continue;
      html += `<h3>${groupName(title)}</h3><div class="cards">` + keys.map(k => {
        const e = logbook.get(k);
        return `<button type="button" class="card ${e ? "on" : "off"}${k.startsWith("shiny:") ? " shiny" : ""}" data-detail="${k}"><img alt="" data-thumb="${k}" data-seen="${e ? 1 : 0}"><span>${nm(k)}</span>${e && e.n > 1 && k.startsWith("shiny:") ? `<span class="count">${e.n > 99 ? "99+" : e.n}×</span>` : ""}</button>`;
      }).join("") + `</div>`;
    }
    html += `<h3>${L("Bewaren", "Keep")}</h3>
      <p class="sum">${L("Je logboek staat alleen in deze browser. Sla het op als bestand om het te bewaren, of om het op een ander apparaat in te laden.", "Your logbook lives only in this browser. Save it as a file to keep it, or to load it on another device.")}</p>
      <div class="row"><button type="button" id="logExport">${L("Opslaan als bestand", "Save as file")}</button><button type="button" id="logImport">${L("Bestand inladen", "Load file")}</button><input type="file" id="logFile" accept="application/json,.json" hidden></div>`;
    html += `<h3>${L("Opnieuw beginnen", "Start over")}</h3>
      <div class="row" id="resetRow"><button type="button" id="logReset">${L("Logboek wissen", "Clear logbook")}</button></div>
      <div class="row" id="resetConfirm" hidden>
        <span class="sum">${L("Alles wat je gezien hebt wordt gewist, ook je shiny's. Dit kun je niet terugdraaien.", "Everything you have seen will be cleared, shinies too. This cannot be undone.")}</span>
        <button type="button" id="logResetYes" class="primary">${L("Ja, wis mijn logboek", "Yes, clear my logbook")}</button>
        <button type="button" id="logResetNo">${L("Annuleren", "Cancel")}</button>
      </div>`;
    panelBody.innerHTML = html;
    fillThumbs();
  }

  let logFilter = "all";

  // Pictures are drawn a few at a time so the logbook opens straight away.
  let thumbJob = 0;
  function fillThumbs() {
    const job = ++thumbJob;
    const imgs = [...panelBody.querySelectorAll("img[data-thumb]")];
    const step = () => {
      if (job !== thumbJob) return;
      for (let i = 0; i < 6 && imgs.length; i++) {
        const img = imgs.shift();
        img.src = thumbURL(img.dataset.thumb, img.dataset.seen === "1");
      }
      if (imgs.length) setTimeout(step, 0);
    };
    step();
  }

  function resetLogbook() {
    logbook = new Map();
    try { localStorage.removeItem(LOG_KEY); } catch (e) {}
    // shinies that are on screen right now may announce themselves again
    for (const e of scene.shinies) e.told = false;
    applyRewards();
  }

  function exportLog() {
    const d = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify({ app: "oceaan", versie: 1, opgeslagen: d, logboek: Object.fromEntries(logbook) }, null, 1)], { type: "application/json" });
    saveBlob(blob, `oceaan-logboek-${d}.json`);
  }

  // Loading a file adds to what is already there: the highest count and the earliest date win.
  function importLog(text) {
    let data;
    try { data = JSON.parse(text); } catch (e) { return 0; }
    const incoming = loadLog(data && data.logboek ? data.logboek : data);
    for (const [k, v] of incoming) {
      const cur = logbook.get(k);
      if (!cur) logbook.set(k, v);
      else {
        cur.n = Math.max(cur.n, v.n);
        if (v.first && (!cur.first || v.first < cur.first)) cur.first = v.first;
      }
    }
    saveLog();
    applyRewards();
    return incoming.size;
  }


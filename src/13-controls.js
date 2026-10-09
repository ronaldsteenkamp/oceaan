  // ---- interaction -------------------------------------------------------
  // A tap starts a new ocean (or opens the chest), a long press feeds the fish, a drag stirs the water.
  let down = null, feedTimer = null;
  canvas.addEventListener("pointermove", e => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; pointer.moved = performance.now(); pointer.known = true;
    if (down && !feeding && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) clearTimeout(feedTimer);
  });
  canvas.addEventListener("pointerleave", () => { pointer.active = false; feeding = false; clearTimeout(feedTimer); });
  canvas.addEventListener("pointerdown", e => {
    down = { x: e.clientX, y: e.clientY, time: performance.now() };
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; pointer.known = true;
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
      const nf = S.hidden.filter(h => h.found).length;
      toast(nf < S.hidden.length ? L(`Verstopt zeepaardje gevonden! ${nf} van ${S.hidden.length}`, `Hidden seahorse found! ${nf} of ${S.hidden.length}`) : L("Alle verstopte zeepaardjes gevonden!", "All hidden seahorses found!"));
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
    if (tapClam(x, y)) return;
    const chest = S.ground.find(g => g.kind === "chest" && Math.hypot(x - g.x, y - (sandY(g.x) - g.s * 0.4)) < g.s * 1.2);
    if (chest) { chestBurst(chest); return; }
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
    for (const g of S.ground) if (g.kind === "clam") spots.push([g.x, sandY(g.x) - g.s * 0.35]);
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
    // D calls the diver, or sends it away again
    if ((e.key === "d" || e.key === "D") && focusTag !== "INPUT" && !e.ctrlKey && !e.metaKey) { e.preventDefault(); diverBtn.click(); return; }
    if (focusTag !== "INPUT" && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const k = e.key.toLowerCase();
      if (k === "l") { e.preventDefault(); bookBtn.click(); return; }
      if (k === "f" && photoView.hidden) { e.preventDefault(); photoBtn.click(); return; }
      if (k === "g") { e.preventDefault(); if (!soundBtn.disabled) soundBtn.click(); return; }
    }
    if ((e.key === "e" || e.key === "E") && focusTag !== "INPUT") { e.preventDefault(); if (diverMode) diverInteract(); else diverBtn.click(); return; }
    if ((e.key === "q" || e.key === "Q") && diverMode && focusTag !== "INPUT") { e.preventDefault(); sonarPing(); return; }
    if ((e.key === "r" || e.key === "R") && focusTag !== "INPUT" && !e.ctrlKey && !e.metaKey && photoView.hidden) { e.preventDefault(); tryNewOcean(); }
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

  // If the browser takes the drawing surface away (it can, when memory is short), clear the saved layers so everything is drawn fresh.
  canvas.addEventListener("contextlost", e => { e.preventDefault(); discoverPause = false; });
  canvas.addEventListener("contextrestored", () => { if (scene) scene.layers = {}; shinyBufs.clear(); thumbCache.clear(); });

  // ---- a snapshot when a new animal is found -------------------------------
  // The moment a new animal comes into the light, a picture is taken of the diver and the animal together.
  // It moves to the middle of the screen, turns into the logbook picture and flies into the book.
  const discoverEl = document.getElementById("discover"), dcFrame = discoverEl.querySelector(".dc-frame");
  const dcShot = discoverEl.querySelector(".dc-shot"), dcThumb = discoverEl.querySelector(".dc-thumb"), dcName = discoverEl.querySelector(".dc-name");
  const discoverQueue = [];
  let discoverBusy = false, discoverPause = false;
  function queueDiscovery(key, pos) {
    const base = key.startsWith("shiny:") ? key.slice(6) : key;
    // every find gets its photo: animals, legends, ghosts, wonders and moments; only the waters themselves do not
    if (base.startsWith("w:") || reduceMotion || restMode) return;
    if (!pos) pos = diverMode ? [diver.x, diver.y] : [W / 2, H / 2];
    if (discoverQueue.some(d => d.key === key) || discoverQueue.length > 14) return;
    discoverQueue.push({ key, pos });
  }
  // runs at the end of a frame, when the picture of the ocean is complete
  function flushDiscoveries() {
    // wait until a new ocean has fully faded in, so the picture is never dark
    if (discoverBusy || !discoverQueue.length || !canvas.width || fade > 0.02) return;
    const d = discoverQueue.shift(), [ax, ay] = d.pos;
    const withDiver = diverMode, span = withDiver ? Math.hypot(ax - diver.x, ay - diver.y) : 0;
    const cx = withDiver ? (ax + diver.x) / 2 : ax, cy = withDiver ? (ay + diver.y) / 2 : ay;
    let w = Math.min(W, Math.max(240, span * 1.4 + 180)), h = w * 0.7;
    if (h > H) { h = H; w = h / 0.7; }
    const x0 = Math.max(0, Math.min(W - w, cx - w / 2)), y0 = Math.max(0, Math.min(H - h, cy - h / 2));
    const shot = document.createElement("canvas");
    shot.width = 480; shot.height = 336;
    try {
      const sc = shot.getContext("2d");
      sc.fillStyle = water.bottom; sc.fillRect(0, 0, 480, 336);
      sc.drawImage(canvas, x0 * dpr, y0 * dpr, w * dpr, h * dpr, 0, 0, 480, 336);
      // how bright is the picture? dark water gets a camera flash, an empty picture is skipped
      const px = sc.getImageData(0, 0, 480, 336).data;
      let sum = 0, n = 0;
      for (let i = 0; i < px.length; i += 4 * 37) { sum += px[i] * 0.3 + px[i + 1] * 0.59 + px[i + 2] * 0.11; n++; }
      const mean = sum / n;
      if (mean < 70 && mean > 3) {
        const copy = document.createElement("canvas"); copy.width = 480; copy.height = 336; copy.getContext("2d").drawImage(shot, 0, 0);
        if ("filter" in sc) { sc.filter = `brightness(${Math.min(2.8, 85 / mean).toFixed(2)}) saturate(1.15)`; sc.drawImage(copy, 0, 0); sc.filter = "none"; }
        else { sc.globalCompositeOperation = "screen"; for (let k = 0; k < 2; k++) sc.drawImage(copy, 0, 0); sc.globalCompositeOperation = "source-over"; }
      }
      // the flash lights up the animal itself a little more
      const fxp = (ax - x0) / w * 480, fyp = (ay - y0) / h * 336;
      const fl = sc.createRadialGradient(fxp, fyp, 0, fxp, fyp, 170);
      fl.addColorStop(0, "rgba(255,255,245,0.28)"); fl.addColorStop(1, "rgba(255,255,245,0)");
      sc.globalCompositeOperation = "lighter"; sc.fillStyle = fl; sc.fillRect(0, 0, 480, 336); sc.globalCompositeOperation = "source-over";
      dcShot.src = mean > 3 ? shot.toDataURL("image/jpeg", 0.88) : thumbURL(d.key, true, 3);
    } catch (e) { return; }
    dcThumb.src = thumbURL(d.key, true, 3);
    dcName.textContent = nm(d.key);
    discoverBusy = true;
    playDiscovery(x0, y0, w, h).catch(() => {}).finally(() => {
      discoverEl.hidden = true; discoverPause = false; discoverBusy = false;
      for (const el of [discoverEl, dcFrame, dcShot, dcThumb, dcName]) for (const a of el.getAnimations()) a.cancel();
    });
  }

  // One smooth movement from the spot in the ocean to the middle, then into the book.
  async function playDiscovery(x0, y0, w, h) {
    // start every picture fresh: the end of the previous one (small and faded, in the book) must not stick
    for (const el of [discoverEl, dcFrame, dcShot, dcThumb, dcName, bookBtn]) for (const a of el.getAnimations()) a.cancel();
    const tw = Math.min(W * 0.8, 440), th = tw * 0.92 * 0.7 + tw * 0.16;
    const fx = (W - tw) / 2, fy = (H - th) / 2 - 20;
    Object.assign(dcFrame.style, { left: fx + "px", top: fy + "px", width: tw + "px", height: th + "px", transform: "", opacity: "1" });
    dcFrame.className = "dc-frame";
    dcShot.style.opacity = "1"; dcThumb.style.opacity = "0"; dcName.style.opacity = "0";
    discoverEl.style.background = "rgba(2,8,18,0)";
    discoverEl.hidden = false;
    // the ocean holds still while the picture is taken and filed
    discoverPause = true;
    sfxClick();
    const sw = w * 1.087, start = `translate(${x0 + w / 2 - (fx + tw / 2)}px, ${y0 + h / 2 - (fy + th / 2)}px) scale(${sw / tw})`;
    const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
    discoverEl.animate([{ background: "rgba(2,8,18,0)" }, { background: "rgba(2,8,18,0.28)" }], { duration: 500, fill: "forwards" });
    dcFrame.animate([{ opacity: 0.35, offset: 0 }, { opacity: 1, offset: 0.25 }, { opacity: 1 }], { duration: 300 }); // a little flash
    await dcFrame.animate([
      { transform: start, opacity: 1, backgroundColor: "rgba(244,239,226,0)", boxShadow: "0 0 0 rgba(0,0,0,0)" },
      { transform: "translate(0,0) scale(1) rotate(-2deg)", opacity: 1, backgroundColor: "rgba(244,239,226,1)", boxShadow: "0 18px 50px rgba(0,0,0,0.5)" },
    ], { duration: 850, easing: ease, fill: "forwards" }).finished;
    dcName.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 400, fill: "forwards" });
    // the photo slowly zooms in a touch, then melts into the logbook picture
    dcShot.animate([{ transform: "scale(1)" }, { transform: "scale(1.05)" }], { duration: 1700, easing: "ease-out", fill: "forwards" });
    await wait(700);
    dcShot.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 800, easing: "ease-in-out", fill: "forwards" });
    await dcThumb.animate([{ opacity: 0, transform: "scale(1.04)" }, { opacity: 1, transform: "scale(1)" }], { duration: 800, easing: "ease-in-out", fill: "forwards" }).finished;
    await wait(650);
    // off into the book; the ocean starts moving again
    discoverPause = false;
    const r = bookBtn.getBoundingClientRect();
    const bx = r.left + r.width / 2 - (fx + tw / 2), by = r.top + r.height / 2 - (fy + th / 2);
    discoverEl.animate([{ background: "rgba(2,8,18,0.28)" }, { background: "rgba(2,8,18,0)" }], { duration: 500, fill: "forwards" });
    dcName.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" });
    await dcFrame.animate([
      { transform: "translate(0,0) scale(1) rotate(-2deg)", opacity: 1 },
      { transform: `translate(${bx * 0.45}px, ${by * 0.3 - 40}px) scale(0.55) rotate(4deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${bx}px, ${by}px) scale(${44 / tw}) rotate(10deg)`, opacity: 0.2 },
    ], { duration: 700, easing: "cubic-bezier(0.55, 0, 0.75, 0.2)", fill: "forwards" }).finished;
    bookBtn.animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 380, easing: "ease-out" });
    buzz(15);
  }
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // ---- new ocean, diver, menu and photo buttons --------------------------
  document.getElementById("next").addEventListener("click", tryNewOcean);

  // A new ocean is on a time lock; every milestone of finds makes the wait shorter: from ten minutes down to ten seconds.
  const LOCK_KEY = "oceaan-gewisseld";
  const nextTimeEl = document.getElementById("nextTime"), nextBtn = document.getElementById("next");
  if (!store.get(LOCK_KEY, 0)) store.set(LOCK_KEY, Date.now());
  function lockLeft() { return Math.max(0, store.get(LOCK_KEY, 0) + lockSeconds() * 1000 - Date.now()); }
  function clockText(ms) { const s = Math.ceil(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }
  function tryNewOcean() {
    const left = lockLeft();
    if (left > 0) {
      toast(L(`Een nieuwe oceaan kan over ${clockText(left)}. Hoe meer je vindt, hoe korter je wacht: nu elke ${durationText(lockSeconds())}.`,
        `A new ocean is possible in ${clockText(left)}. The more you find, the shorter the wait: now every ${durationText(lockSeconds())}.`));
      buzz(15);
      return;
    }
    store.set(LOCK_KEY, Date.now());
    newVariant(randomSeed(), true);
    updateLockBadge();
  }
  function updateLockBadge() {
    const left = lockLeft();
    nextTimeEl.hidden = left <= 0;
    nextTimeEl.textContent = left > 0 ? clockText(left) : "";
    nextBtn.classList.toggle("locked", left > 0);
    const tip = left > 0 ? L(`Nieuwe oceaan over ${clockText(left)}`, `New ocean in ${clockText(left)}`) : L("Nieuwe oceaan (R)", "New ocean (R)");
    nextBtn.dataset.tip = tip; nextBtn.setAttribute("aria-label", tip);
  }
  setInterval(updateLockBadge, 1000);
  updateLockBadge();
  diverBtn.addEventListener("click", () => {
    diverMode = !diverMode;
    if (diverMode) {
      // the diver appears where the cursor is, or at the nearest spot in the water
      diver.x = pointer.known ? pointer.x : W * 0.5; diver.y = pointer.known ? pointer.y : H * 0.45;
      keepDiverInWater(diver);
      diver.vx = diver.vy = 0; diver.heading = 0; diver.roll = 1;
    }
    diverBtn.setAttribute("aria-pressed", String(diverMode));
    sonarBtn.hidden = !diverMode;
  });
  const sonarBtn = document.getElementById("sonar");
  sonarBtn.addEventListener("click", sonarPing);

  let panelOpener = null;
  function openPanel(tab, opener) {
    if (!panelEl.hidden && panelTab === "log" && tab !== "log") clearFresh();
    panelTab = tab;
    panelOpener = opener || null;
    panelEl.hidden = false;
    renderPanel();
    panelTitle.focus();
  }
  function clearFresh() { if (fresh.size) { fresh.clear(); saveFresh(); } }
  function closePanel() {
    if (panelTab === "log") clearFresh();
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
    logFilter = "all";
    openPanel("log", bookBtn);
    panelBody.scrollTop = 0; // new finds are at the top
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
    const card = (k, isNew) => {
      const e = logbook.get(k);
      return `<button type="button" class="card ${e ? "on" : "off"}${k.startsWith("shiny:") ? " shiny" : ""}${isNew ? " new" : ""}" data-detail="${k}"><img alt="" data-thumb="${k}" data-seen="${e ? 1 : 0}"><span>${nm(k)}</span>${isNew ? `<span class="newtag">${L("Nieuw", "New")}</span>` : ""}${e && e.n > 1 && k.startsWith("shiny:") ? `<span class="count">${e.n > 99 ? "99+" : e.n + "×"}</span>` : ""}</button>`;
    };
    const news = LOG_GROUPS.flatMap(g => g[1]).filter(k => fresh.has(k) && logbook.has(k));
    let html = "";
    if (news.length && logFilter !== "album") {
      html += `<h3 class="newhead">${L(`Nieuw sinds je vorige keer · ${news.length}`, `New since last time · ${news.length}`)}</h3><div class="cards">` + news.map(k => card(k, true)).join("") + `</div>`;
    }
    html += `<p class="sum">${L(`<b>${got}</b> van ${all.length} gezien, en <b>${shinyGot}</b> van ${SHINY_KEYS.length} shiny. Tik op een plaatje voor meer over dat dier of die vondst.`, `<b>${got}</b> of ${all.length} seen, and <b>${shinyGot}</b> of ${SHINY_KEYS.length} shiny. Tap a picture to learn more.`)}</p>`;
    html += `<div class="progress" aria-hidden="true"><i style="width:${Math.round((got / all.length) * 100)}%"></i></div>`;
    html += `<p class="sum small">${L(`Je kunt nu elke ${durationText(lockSeconds())} een nieuwe oceaan kiezen. Elke mijlpaal van vondsten maakt dat korter.`, `You can now pick a new ocean every ${durationText(lockSeconds())}. Every milestone of finds makes that shorter.`)}</p>`;
    html += `<h3>${L("Mijlpalen", "Milestones")} · ${MILESTONES.filter(m => m.need()).length}/${MILESTONES.length}</h3>`;
    html += `<div class="badges">` + MILESTONES.map(m => {
      const [have, need] = m.prog(), done = have >= need;
      const tip = m.reward ? L("Beloning: ", "Reward: ") + L(m.reward[0], m.reward[1]) : "";
      return `<span class="badge ${done ? "on" : ""}" title="${tip}">${L(m.name[0], m.name[1])} · ${done ? L(m.goal[0], m.goal[1]) : `${Math.min(have, need)}/${need}`}${m.reward ? ` <i class="gift" aria-label="${tip}">★</i>` : ""}</span>`;
    }).join("") + `</div>`;
    html += `<p class="sum small">${L("Een ★ betekent dat je er iets voor krijgt. Haal je alle mijlpalen, dan wordt je logboek goud.", "A ★ means you get something for it. Reach every milestone and your logbook turns gold.")}</p>`;
    const FILTERS = [["all", L("Alles", "All")], ["missing", L("Nog niet gevonden", "Not found yet")], ["found", L("Gevonden", "Found")], ["shiny", "Shiny"], ["album", L("Mijn foto's", "My photos")]];
    html += `<div class="filters" role="group" aria-label="${L("Laat zien", "Show")}">` + FILTERS.map(([id, label]) => `<button type="button" class="chip pick ${logFilter === id ? "on" : ""}" data-filter="${id}" aria-pressed="${logFilter === id}">${label}</button>`).join("") + `</div>`;
    if (logFilter === "album") html += albumHTML();
    const show = k => logFilter === "all" || (logFilter === "missing" && !logbook.has(k)) || (logFilter === "found" && logbook.has(k)) || (logFilter === "shiny" && k.startsWith("shiny:"));
    for (const [title, allKeys, subs] of logFilter === "album" ? [] : LOG_GROUPS) {
      if (!allKeys.some(show)) continue;
      html += `<h3>${groupName(title)}</h3>`;
      for (const [nl, en, keys] of subs) {
        const vis = keys.filter(show);
        if (!vis.length) continue;
        const label = title === "Shiny" ? groupName(nl) : L(nl, en);
        html += `<h4 class="sub">${label} <span>${vis.filter(k => logbook.has(k)).length}/${vis.length}</span></h4><div class="cards">` + vis.map(k => card(k, fresh.has(k) && logbook.has(k))).join("") + `</div>`;
      }
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
    fresh.clear(); saveFresh();
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


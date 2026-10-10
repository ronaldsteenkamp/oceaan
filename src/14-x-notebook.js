  // ---- the logbook as a researcher's field notebook ---------------------------------
  // Pages of taped-in photos and pencil notes. On a wide screen two pages lie side by side, on a phone one,
  // and you leaf through them with the arrows, the arrow keys or a swipe. Tabs jump to a part of the book.
  let bookPages = [], bookGroups = [], bookJumps = {}, bookAt = 0, bookTurning = false, bookFilter = "all";
  const bookSingle = () => panelEl.clientWidth < 760;
  const BOOK_TABS = [["intro", "Overzicht", "Overview", "#e9dcb5"], ["Dieren", null, null, "#a9cfa6"], ["Momenten", null, null, "#e8bd86"],
    ["Zeldzaam", null, null, "#cdb0dc"], ["Wateren", null, null, "#9cc6dc"], ["album", "Foto's", "Photos", "#e9aaa6"], ["keep", "Bewaren", "Keep", "#d4ccb6"]];
  const tabLabel = t => t[1] ? L(t[1], t[2]) : groupName(t[0]);

  // every photo sits a little crooked, always the same way for the same animal
  function tiltOf(k) { let h = 7; for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) | 0; return ((Math.abs(h) % 9) - 4) * 0.4; }

  // A taped-in photo. An animal whose Shiny tab you picked shows its shiny here; the name stays the animal's own.
  function bookCard(k, isNew, forceShiny) {
    const sk = "shiny:" + k, se = logbook.get(sk), shinyMode = forceShiny || (!!se && shinyPick.has(k)), e = logbook.get(shinyMode ? sk : k);
    const mark = se ? `<span class="shinymark" title="${L("Shiny gevonden", "Shiny found")}" aria-label="${L("Shiny gevonden", "Shiny found")}">✦</span>` : "";
    return `<button type="button" class="card ${e ? "on" : "off"}${shinyMode ? " shiny" : ""}${se ? " hasshiny" : ""}${isNew ? " new" : ""}" style="--tilt:${tiltOf(k)}deg" data-detail="${shinyMode ? sk : k}"><img alt="" data-thumb="${shinyMode ? sk : k}" data-seen="${e ? 1 : 0}"><span>${nm(k)}</span>${isNew ? `<span class="newtag">${L("Nieuw", "New")}</span>` : ""}${mark}</button>`;
  }

  // The content of the book as a list of blocks; the pages are filled from it by measuring what fits.
  function bookBlocks() {
    const blocks = [];
    const all = LOG_GROUPS.flatMap(g => g[1]).filter(k => !k.startsWith("shiny:"));
    const got = all.filter(k => logbook.has(k)).length;
    const shinyGot = SHINY_KEYS.filter(k => logbook.has("shiny:" + k)).length;
    const news = LOG_GROUPS.flatMap(g => g[1]).filter(k => fresh.has(k) && logbook.has(k));
    const FILTERS = [["all", L("Alles", "All")], ["missing", L("Nog niet gevonden", "Not found yet")], ["found", L("Gevonden", "Found")], ["shiny", "Shiny"]];
    let intro = `<h2 class="nb-title">${L("Veldnotities", "Field notes")}</h2>
      <p class="nb-sub">${L("Logboek van een onderzoeker onder water", "Logbook of an underwater researcher")}</p>
      <p class="nb-stat">${L(`<b>${got}</b> van ${all.length} gezien · <b>${shinyGot}</b> van ${SHINY_KEYS.length} shiny`, `<b>${got}</b> of ${all.length} seen · <b>${shinyGot}</b> of ${SHINY_KEYS.length} shiny`)}</p>
      <div class="nb-bar" aria-hidden="true"><i style="width:${Math.round((got / all.length) * 100)}%"></i></div>
      <p class="nb-note">${L(`Nieuwe oceaan: elke ${durationText(lockSeconds())}. Elke mijlpaal maakt dat korter.`, `New ocean: every ${durationText(lockSeconds())}. Every milestone makes that shorter.`)}</p>
      <h4 class="nb-fam">${L("Laat zien", "Show")}</h4>
      <div class="filters" role="group" aria-label="${L("Laat zien", "Show")}">` + FILTERS.map(([id, label]) => `<button type="button" class="chip pick ${logFilter === id ? "on" : ""}" data-filter="${id}" aria-pressed="${logFilter === id}">${label}</button>`).join("") + `</div>`;
    if (news.length) {
      const show = news.slice(0, 6);
      intro += `<h4 class="nb-fam">${L("Nieuw sinds je vorige keer", "New since last time")} <span>${news.length}</span></h4><div class="cards">` + show.map(k => k.startsWith("shiny:") ? bookCard(k.slice(6), true, true) : bookCard(k, true)).join("") + `</div>`;
      if (news.length > show.length) intro += `<p class="nb-note">${L(`…en nog ${news.length - show.length}, verderop in het boek.`, `…and ${news.length - show.length} more, further on in the book.`)}</p>`;
    }
    blocks.push({ html: intro, newPage: true, group: "intro", jump: "intro" });

    const msItems = MILESTONES.map(m => {
      const [have, need] = m.prog(), done = have >= need;
      const tip = m.reward ? L("Beloning: ", "Reward: ") + L(m.reward[0], m.reward[1]) : "";
      return `<li class="${done ? "on" : ""}"><span class="box" aria-hidden="true">${done ? "✓" : ""}</span><span class="what">${L(m.name[0], m.name[1])}</span><span class="how">${done ? L(m.goal[0], m.goal[1]) : `${Math.min(have, need)}/${need}`}</span>${m.reward ? `<i class="gift" title="${tip}" aria-label="${tip}">★</i>` : ""}</li>`;
    });
    blocks.push({ head: `<h4 class="nb-fam">${L("Mijlpalen", "Milestones")} <span>${MILESTONES.filter(m => m.need()).length}/${MILESTONES.length}</span></h4><p class="nb-note">${L("Een ★ betekent dat je er iets voor krijgt. Haal je alle mijlpalen, dan wordt je logboek goud.", "A ★ means you get something for it. Reach every milestone and your logbook turns gold.")}</p>`,
      headMore: `<h4 class="nb-fam">${L("Mijlpalen", "Milestones")} <span>${L("vervolg", "continued")}</span></h4>`, cards: msItems, open: `<ul class="nb-check">`, close: `</ul>`, newPage: true, group: "intro" });

    // the families, each group starting on a new page; the Shiny filter shows every animal with a shiny, in its shiny colours
    const shinyMode = logFilter === "shiny";
    const has = k => logbook.has(shinyMode ? "shiny:" + k : k);
    const show = k => shinyMode ? SHINY_KEYS.includes(k) : logFilter === "missing" ? !logbook.has(k) : logFilter === "found" ? logbook.has(k) : true;
    // in the same order as the tabs: animals, moments, rare things, and then the waters
    for (const title of ["Dieren", "Momenten", "Zeldzaam", "Wateren"]) {
      const grp = LOG_GROUPS.find(g => g[0] === title);
      if (!grp) continue;
      const subs = grp[2];
      let first = true;
      for (const [nl, en, keys] of subs) {
        const vis = keys.filter(show);
        if (!vis.length) continue;
        blocks.push({ head: `<h4 class="nb-fam">${L(nl, en)} <span>${vis.filter(has).length}/${vis.length}</span></h4>`, headMore: `<h4 class="nb-fam">${L(nl, en)} <span>${L("vervolg", "continued")}</span></h4>`,
          cards: vis.map(k => bookCard(k, fresh.has(shinyMode ? "shiny:" + k : k) && has(k), shinyMode)), newPage: first, group: title, jump: first ? title : null });
        first = false;
      }
    }
    // photos and the back of the book
    const photos = album.length
      ? `<div class="album">` + album.map(ph => `<button type="button" data-photo="${ph.id}" style="--tilt:${tiltOf(ph.id)}deg" aria-label="${L("Foto van ", "Photo from ")}${dateText(ph.d)}"><img alt="" src="${ph.img}"></button>`).join("") + `</div>`
      : `<p class="nb-note">${L(`Nog geen foto's. Maak een foto met de camera en kies "In mijn album".`, `No photos yet. Take a photo with the camera and choose "Add to my album".`)}</p>`;
    blocks.push({ html: `<h4 class="nb-fam">${L("Mijn foto's", "My photos")}</h4>` + photos, newPage: true, group: "album", jump: "album" });
    blocks.push({ html: `<h4 class="nb-fam">${L("Bewaren", "Keep")}</h4>
      <p class="nb-note">${L("Je logboek staat alleen in deze browser. Sla het op als bestand om het te bewaren, of om het op een ander apparaat in te laden.", "Your logbook lives only in this browser. Save it as a file to keep it, or to load it on another device.")}</p>
      <div class="row"><button type="button" id="logExport">${L("Opslaan als bestand", "Save as file")}</button><button type="button" id="logImport">${L("Bestand inladen", "Load file")}</button><input type="file" id="logFile" accept="application/json,.json" hidden></div>
      <h4 class="nb-fam">${L("Opnieuw beginnen", "Start over")}</h4>
      <div class="row" id="resetRow"><button type="button" id="logReset">${L("Logboek wissen", "Clear logbook")}</button></div>
      <div class="row" id="resetConfirm" hidden>
        <span class="nb-note">${L("Alles wat je gezien hebt wordt gewist, ook je shiny's. Dit kun je niet terugdraaien.", "Everything you have seen will be cleared, shinies too. This cannot be undone.")}</span>
        <button type="button" id="logResetYes" class="primary">${L("Ja, wis mijn logboek", "Yes, clear my logbook")}</button>
        <button type="button" id="logResetNo">${L("Annuleren", "Cancel")}</button>
      </div>`, newPage: true, group: "keep", jump: "keep" });
    return blocks;
  }

  // Fill the pages: a block goes on the current page if it fits, otherwise on a new one;
  // a family too long for one page carries on overleaf.
  function paginate(blocks, meter) {
    const pages = [], groups = [], jumps = {};
    let cur = "", curGroup = "intro";
    const run = g => g === "intro" || g === "album" || g === "keep" ? "" : `<div class="nb-run">${groupName(g)}</div>`;
    const fits = html => { meter.innerHTML = html; return meter.scrollHeight <= meter.clientHeight + 1; };
    const flush = () => { if (cur) { pages.push(cur); groups.push(curGroup); } cur = ""; };
    for (const b of blocks) {
      if (b.newPage) flush();
      if (b.jump && !(b.jump in jumps)) jumps[b.jump] = pages.length;
      curGroup = b.group;
      if (b.html !== undefined) {
        // fixed pages: the overview, milestones, photos and the back of the book
        cur = (cur || run(b.group)) + b.html;
        continue;
      }
      const open = b.open || `<div class="cards">`, close = b.close || `</div>`;
      const whole = b.head + open + b.cards.join("") + close;
      if (fits((cur || run(b.group)) + whole)) { cur = (cur || run(b.group)) + whole; continue; }
      if (cur) flush();
      // card by card onto as many pages as it needs
      let head = b.head, list = [];
      for (const c of b.cards) {
        if (list.length && !fits(run(b.group) + head + open + list.join("") + c + close)) {
          cur = run(b.group) + head + open + list.join("") + close; flush();
          head = b.headMore; list = [];
        }
        list.push(c);
      }
      cur = run(b.group) + head + open + list.join("") + close;
    }
    flush();
    meter.innerHTML = "";
    return { pages, groups, jumps };
  }

  function bookSkeleton(single, withNav) {
    return `<div class="nb">
      ${withNav ? `<nav class="nb-tabs" aria-label="${L("Delen van het logboek", "Parts of the logbook")}">` + BOOK_TABS.map(t => `<button type="button" class="nb-tab" data-jump="${t[0]}" style="--tab:${t[3]}">${tabLabel(t)}</button>`).join("") + `</nav>` : ""}
      <div class="nb-spread${single ? " single" : ""}">
        <section class="nb-page nb-left"></section>${single ? "" : `<section class="nb-page nb-right"></section>`}
        <div class="nb-spine" aria-hidden="true"></div>
        <section class="nb-page nb-meter" aria-hidden="true"></section>
      </div>
      ${withNav ? `<div class="nb-nav"><button type="button" class="nb-turn" data-turn="-1" aria-label="${L("Vorige bladzijde", "Previous page")}">‹ ${L("Vorige", "Previous")}</button><span class="nb-num" aria-live="polite"></span><button type="button" class="nb-turn" data-turn="1" aria-label="${L("Volgende bladzijde", "Next page")}">${L("Volgende", "Next")} ›</button></div>` : ""}
    </div>`;
  }

  function renderBook() {
    panelEl.classList.add("book");
    const single = bookSingle();
    panelBody.innerHTML = bookSkeleton(single, true);
    const meter = panelBody.querySelector(".nb-meter");
    const { pages, groups, jumps } = paginate(bookBlocks(), meter);
    bookPages = pages; bookGroups = groups; bookJumps = jumps;
    // choosing a filter leafs straight to the first page with animals
    if (logFilter === "album") { bookAt = jumps.album; logFilter = bookFilter; }
    else if (logFilter !== bookFilter) { bookFilter = logFilter; bookAt = jumps.Dieren !== undefined ? jumps.Dieren : 0; }
    bookAt = Math.max(0, Math.min(bookPages.length - 1, bookAt));
    if (!single) bookAt -= bookAt % 2;
    for (const t of panelBody.querySelectorAll(".nb-tab")) t.disabled = !(t.dataset.jump in jumps);
    showSpread();
  }

  const pageHTML = (i, side) => bookPages[i] !== undefined ? `${bookPages[i]}<div class="nb-pnum ${side}">${i + 1}</div>` : `<div class="nb-blank" aria-hidden="true"></div>`;
  function fillIn(root) { for (const img of root.querySelectorAll("img[data-thumb]")) img.src = thumbURL(img.dataset.thumb, img.dataset.seen === "1"); }

  function showSpread() {
    const left = panelBody.querySelector(".nb-left"), right = panelBody.querySelector(".nb-right");
    if (!left) return;
    left.innerHTML = pageHTML(bookAt, "l"); fillIn(left);
    if (right) { right.innerHTML = pageHTML(bookAt + 1, "r"); fillIn(right); }
    updateBookNav();
  }
  function updateBookNav() {
    const single = !panelBody.querySelector(".nb-right"), n = bookPages.length;
    const num = panelBody.querySelector(".nb-num");
    if (num) num.textContent = single || bookAt + 1 >= n ? `${bookAt + 1} / ${n}` : `${bookAt + 1}–${bookAt + 2} / ${n}`;
    const [prev, next] = panelBody.querySelectorAll(".nb-turn");
    if (prev) prev.disabled = bookAt <= 0;
    if (next) next.disabled = bookAt + (single ? 1 : 2) >= n;
    const g = bookGroups[bookAt], g2 = single ? g : bookGroups[bookAt + 1];
    for (const t of panelBody.querySelectorAll(".nb-tab")) t.classList.toggle("on", t.dataset.jump === g || t.dataset.jump === g2 && g2 !== undefined && t.dataset.jump !== "intro");
  }

  // Leafing: a page lifts at its edge and turns over, showing the next page on its back.
  function turnBook(delta) {
    const single = !panelBody.querySelector(".nb-right");
    bookGoTo(bookAt + delta * (single ? 1 : 2));
  }
  function bookGoTo(target) {
    const single = !panelBody.querySelector(".nb-right");
    target = Math.max(0, Math.min(bookPages.length - 1, target));
    if (!single) target -= target % 2;
    if (bookTurning || target === bookAt || detailOpen) return;
    const spread = panelBody.querySelector(".nb-spread");
    if (reduceMotion || !spread || !spread.animate) { bookAt = target; showSpread(); return; }
    const fwd = target > bookAt, left = spread.querySelector(".nb-left"), right = spread.querySelector(".nb-right");
    const leaf = document.createElement("div");
    let frames, done;
    if (single) {
      leaf.className = "nb-leaf one";
      if (fwd) {
        leaf.innerHTML = `<div class="nb-face nb-page nb-left">${pageHTML(bookAt, "l")}</div><div class="nb-face back nb-page nb-left"></div>`;
        left.innerHTML = pageHTML(target, "l"); fillIn(left);
        frames = [{ transform: "rotateY(0deg)", opacity: 1 }, { transform: "rotateY(-110deg)", opacity: 1, offset: 0.6 }, { transform: "rotateY(-180deg)", opacity: 0 }];
        done = () => {};
      } else {
        leaf.innerHTML = `<div class="nb-face nb-page nb-left">${pageHTML(target, "l")}</div><div class="nb-face back nb-page nb-left"></div>`;
        frames = [{ transform: "rotateY(-180deg)", opacity: 0 }, { transform: "rotateY(-110deg)", opacity: 1, offset: 0.4 }, { transform: "rotateY(0deg)", opacity: 1 }];
        done = () => { left.innerHTML = pageHTML(target, "l"); fillIn(left); };
      }
    } else if (fwd) {
      leaf.className = "nb-leaf fwd";
      leaf.innerHTML = `<div class="nb-face nb-page nb-right">${pageHTML(bookAt + 1, "r")}</div><div class="nb-face back nb-page nb-left">${pageHTML(target, "l")}</div>`;
      right.innerHTML = pageHTML(target + 1, "r"); fillIn(right);
      frames = [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-180deg)" }];
      done = () => { left.innerHTML = pageHTML(target, "l"); fillIn(left); };
    } else {
      leaf.className = "nb-leaf bwd";
      leaf.innerHTML = `<div class="nb-face nb-page nb-left">${pageHTML(bookAt, "l")}</div><div class="nb-face back nb-page nb-right">${pageHTML(target + 1, "r")}</div>`;
      left.innerHTML = pageHTML(target, "l"); fillIn(left);
      frames = [{ transform: "rotateY(0deg)" }, { transform: "rotateY(180deg)" }];
      done = () => { right.innerHTML = pageHTML(target + 1, "r"); fillIn(right); };
    }
    fillIn(leaf);
    // a shadow sweeps over the turning page
    const shade = document.createElement("div"); shade.className = "nb-shade";
    leaf.append(shade);
    spread.append(leaf);
    bookTurning = true;
    sfxPage();
    const ease = "cubic-bezier(0.45, 0.05, 0.3, 1)";
    shade.animate([{ opacity: 0 }, { opacity: 0.5, offset: 0.5 }, { opacity: 0 }], { duration: 620, easing: ease });
    // finish when the page has turned, or after a moment anyway (a hidden tab pauses animations)
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (leaf.isConnected) { done(); leaf.remove(); }
      bookAt = target; bookTurning = false; updateBookNav();
    };
    leaf.animate(frames, { duration: 620, easing: ease }).finished.catch(() => {}).finally(finish);
    setTimeout(finish, 1200);
    bookAt = target;
    updateBookNav();
  }
  // a soft paper rustle
  function sfxPage() {
    try { tone({ type: "triangle", freqs: [[900, 0], [500, 0.25]], dur: 0.25, gain: 0.012, attack: 0.01, release: 0.2, verb: 0.2 }); } catch (e) {}
  }

  // The page of one animal: its photo taped in on the left, the notes on the right (one below the other on a phone).
  function renderBookDetail(photoHTML, notesHTML) {
    panelEl.classList.add("book");
    const single = bookSingle();
    panelBody.innerHTML = bookSkeleton(single, false);
    const left = panelBody.querySelector(".nb-left"), right = panelBody.querySelector(".nb-right");
    if (single) left.innerHTML = `<div class="nb-detail">${notesHTML.back}${photoHTML}${notesHTML.body}</div>`;
    else { left.innerHTML = `<div class="nb-detail">${photoHTML}</div>`; right.innerHTML = `<div class="nb-detail">${notesHTML.back}${notesHTML.body}</div>`; }
  }

  // leafing with a swipe on a touch screen
  let swipe = null;
  panelBody.addEventListener("pointerdown", e => { if (panelTab === "log" && !detailOpen && e.target.closest(".nb-spread")) swipe = { x: e.clientX, y: e.clientY }; });
  panelBody.addEventListener("pointerup", e => {
    if (!swipe) return;
    const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 50 && Math.abs(dy) < 70) turnBook(dx < 0 ? 1 : -1);
  });
  panelBody.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.turn) turnBook(Number(b.dataset.turn));
    else if (b.dataset.jump && b.dataset.jump in bookJumps) bookGoTo(bookJumps[b.dataset.jump]);
  });
  // a different screen width can mean one page instead of two
  let bookResize = null;
  addEventListener("resize", () => {
    clearTimeout(bookResize);
    bookResize = setTimeout(() => { if (!panelEl.hidden && panelTab === "log" && !detailOpen) renderBook(); }, 200);
  });

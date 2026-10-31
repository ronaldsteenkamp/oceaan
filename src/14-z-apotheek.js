  // ---- the apothecary of the sea ------------------------------------------------------------
  // Many sea animals have a second story: the medicine, helper substance or lab tool people made from them. Every
  // animal on this list has a jar in a wooden cabinet in the logbook. Seeing the animal fills the jar and opens its card;
  // a question on the card gives a golden label, but the cabinet never depends on it. A danger card (the pufferfish)
  // is only earned by looking from a distance: look, do not touch. A full cabinet gives the title Sea apothecary and a
  // golden mortar for the aquarium. Two new animals come with it, the sea hare and the mangrove tunicate; like the
  // Wadden Sea round they roll from their own stream, so the oceans that already existed stay the same.

  // the four kinds of card, each with its own label colour (--ap-<kind> in styles.css)
  const PHARMA_TYPES = {
    medicijn: ["💊", "Medicijn", "Medicine"],
    hulpstof: ["🧴", "Hulpstof", "Helper"],
    labheld: ["🔬", "Labheld", "Lab hero"],
    gevaar: ["☠️", "Gevaar", "Danger"],
  };
  // One card per animal, in the order of the shelves. The kind, the right answer (`goed`, an index into `keuzes`) and
  // `gevaar` are the same in both languages and only stand here; PHARMA_EN holds the English of the same text.
  // `dier` is the animal's name on the card when it is not the name in the logbook (the sponge card is one kind of sponge).
  const PHARMA = {
    sponges: {
      type: "medicijn", goed: 1, dier: "Caribische spons",
      stof: "Cytarabine",
      gebruik: "Artsen gebruiken het bij leukemie, een soort kanker in het bloed. Onderzoekers maakten het na naar het voorbeeld van een stof uit deze spons.",
      sinds: "Een medicijn sinds 1969.",
      weetje: "Het was het allereerste medicijn dat uit de zee kwam. Naar hetzelfde voorbeeld maakten onderzoekers ook een middel tegen bepaalde virussen.",
      vraag: "Waarvoor gebruiken artsen dit?",
      keuzes: ["Tegen zonnebrand", "Bij leukemie, een soort kanker in het bloed", "Om beter te kunnen slapen"],
    },
    tunicate: {
      type: "medicijn", goed: 0,
      stof: "Trabectedine",
      gebruik: "Artsen gebruiken het bij een paar zeldzame soorten kanker, bijvoorbeeld kanker in spieren of vet.",
      sinds: "Al in 1969 zagen onderzoekers dat de zakpijp iets bijzonders maakte. Sinds 2007 is het een medicijn.",
      weetje: "Voor genoeg medicijn zou je heel veel zakpijpen nodig hebben. Daarom maken scheikundigen het nu zelf, met als begin een stof die bacteriën maken.",
      vraag: "Waarvoor gebruiken artsen dit?",
      keuzes: ["Bij een paar zeldzame soorten kanker", "Als zonnebrandcrème", "Tegen jeuk van muggenbulten"],
    },
    seahare: {
      type: "medicijn", goed: 2,
      stof: "Dolastatine",
      gebruik: "Onderzoekers maakten de stof na en veranderden hem een beetje. Die nagemaakte stof zit nu in een medicijn dat artsen gebruiken bij sommige soorten lymfeklierkanker. Lymfeklieren zijn boontjes in je lijf die helpen tegen ziektes.",
      sinds: "Ontdekt in 1987. In een medicijn sinds 2011.",
      weetje: "De zeehaas maakt de stof waarschijnlijk niet zelf: hij komt uit het blauwwier dat hij eet. Er zat zo weinig van in dat onderzoekers hem wel moesten namaken.",
      vraag: "Waarvoor gebruiken artsen dit?",
      keuzes: ["Tegen muggenbulten", "Om inkt voor pennen te maken", "Bij sommige soorten lymfeklierkanker"],
    },
    cod: {
      type: "medicijn", goed: 0,
      stof: "Levertraan",
      gebruik: "Levertraan zit vol vitamine A en D. Vroeger kregen veel kinderen het tegen de Engelse ziekte, waarbij de botten zacht en krom worden.",
      sinds: "Artsen raadden het in de jaren 1800 al aan.",
      weetje: "In 1922 ontdekten onderzoekers dat er een onbekende vitamine in levertraan zat. Het was de vierde vitamine die ze vonden, dus noemden ze hem vitamine D.",
      vraag: "Waarvoor gaven artsen dit vroeger aan kinderen?",
      keuzes: ["Voor sterke botten", "Tegen zeeziekte", "Om beter te kunnen zwemmen"],
    },
    shrimp: {
      type: "hulpstof", goed: 1,
      stof: "Chitosan",
      gebruik: "Chitosan wordt gemaakt van de lege schaaltjes van garnalen en krabben. Het zit in sommige verbanden die een wond sneller laten stoppen met bloeden.",
      sinds: "In wondverband sinds 2002.",
      weetje: "Chitosan komt van chitine, de stof waar het schaaltje van een garnaal van gemaakt is. Insecten hebben ook chitine: hun harde buitenkant is ervan gemaakt.",
      vraag: "Waarvoor gebruiken artsen dit?",
      keuzes: ["Om tanden wit te maken", "In verband dat een wond helpt stoppen met bloeden", "Tegen verkoudheid"],
    },
    horseshoe: {
      type: "labheld", goed: 2,
      stof: "LAL, uit het bloed",
      gebruik: "Met de LAL-test kijken onderzoekers of een vloeistof voor een prik of een infuus schoon is. Het bloed van de degenkrab klontert meteen als er gif van bacteriën in zit.",
      sinds: "Gebruikt sinds de jaren zeventig.",
      weetje: "Er bestaat nu ook een nagemaakte versie uit het lab. Daarvoor zijn helemaal geen degenkrabben nodig.",
      vraag: "Waarvoor gebruiken onderzoekers dit?",
      keuzes: ["Om zeewater zoet te maken", "Om nepbloed voor films te maken", "Om te testen of prikvloeistof schoon is"],
    },
    puffer: {
      type: "gevaar", goed: 0, gevaar: true,
      stof: "Tetrodotoxine",
      gebruik: "Dit is een heel sterk gif. Onderzoekers kijken of een heel klein beetje ervan kan helpen tegen zware pijn. Het is nog geen gewoon medicijn.",
      sinds: "Onderzocht tegen pijn sinds de jaren 2000.",
      weetje: "De kogelvis heeft zelf geen last van zijn gif. De poortjes in zijn zenuwen zijn net iets anders gebouwd, zodat het gif er niet in past.",
      les: "Kijken, niet aanraken: raak een kogelvis nooit aan, ook niet als hij op het strand ligt.",
      vraag: "Waarvoor onderzoeken ze dit?",
      keuzes: ["Tegen zware pijn", "Als lijm voor gebroken botten", "Tegen hoofdluis"],
    },
  };
  const PHARMA_EN = {
    sponges: {
      dier: "Caribbean sponge",
      stof: "Cytarabine",
      gebruik: "Doctors use it for leukaemia, a kind of cancer in the blood. Researchers made it by copying a substance from this sponge.",
      sinds: "A medicine since 1969.",
      weetje: "It was the very first medicine to come from the sea. Following the same example, researchers also made a medicine against certain viruses.",
      vraag: "What do doctors use this for?",
      keuzes: ["Against sunburn", "For leukaemia, a kind of cancer in the blood", "To help you sleep better"],
    },
    tunicate: {
      stof: "Trabectedin",
      gebruik: "Doctors use it for a few rare kinds of cancer, for example cancer in muscle or fat.",
      sinds: "As early as 1969 researchers saw that the tunicate made something special. Since 2007 it has been a medicine.",
      weetje: "To make enough medicine you would need a great many tunicates. So chemists now make it themselves, starting from a substance that bacteria make.",
      vraag: "What do doctors use this for?",
      keuzes: ["For a few rare kinds of cancer", "As sunscreen", "Against itchy mosquito bites"],
    },
    seahare: {
      stof: "Dolastatin",
      gebruik: "Researchers copied the substance and changed it a little. That copy is now part of a medicine doctors use for some kinds of lymph node cancer. Lymph nodes are little beans in your body that help fight illness.",
      sinds: "Discovered in 1987. In a medicine since 2011.",
      weetje: "The sea hare probably does not make the substance itself: it comes from the blue-green algae it eats. There was so little of it that researchers had to copy it.",
      vraag: "What do doctors use this for?",
      keuzes: ["Against mosquito bites", "To make ink for pens", "For some kinds of lymph node cancer"],
    },
    cod: {
      stof: "Cod liver oil",
      gebruik: "Cod liver oil is full of vitamins A and D. Long ago many children were given it against rickets, an illness that makes bones soft and bent.",
      sinds: "Doctors were already recommending it in the 1800s.",
      weetje: "In 1922 researchers discovered an unknown vitamin in cod liver oil. It was the fourth vitamin they had found, so they called it vitamin D.",
      vraag: "What did doctors give this to children for, long ago?",
      keuzes: ["For strong bones", "Against seasickness", "To swim better"],
    },
    shrimp: {
      stof: "Chitosan",
      gebruik: "Chitosan is made from the empty shells of shrimp and crabs. It is in some bandages that help a wound stop bleeding sooner.",
      sinds: "In bandages since 2002.",
      weetje: "Chitosan comes from chitin, the stuff a shrimp's shell is made of. Insects have chitin too: their hard outside is made of it.",
      vraag: "What do doctors use this for?",
      keuzes: ["To make teeth white", "In bandages that help a wound stop bleeding", "Against colds"],
    },
    horseshoe: {
      stof: "LAL, from the blood",
      gebruik: "With the LAL test researchers check whether a liquid for an injection or a drip is clean. The horseshoe crab's blood clots at once when there is poison from bacteria in it.",
      sinds: "Used since the 1970s.",
      weetje: "There is now also a copy made in the lab. It needs no horseshoe crabs at all.",
      vraag: "What do researchers use this for?",
      keuzes: ["To make seawater fresh", "To make fake blood for films", "To test whether injection liquid is clean"],
    },
    puffer: {
      stof: "Tetrodotoxin",
      gebruik: "This is a very strong poison. Researchers are looking at whether a tiny amount of it can help against severe pain. It is not an ordinary medicine yet.",
      sinds: "Studied against pain since the 2000s.",
      weetje: "The pufferfish itself is not harmed by its poison. The little gates in its nerves are built slightly differently, so the poison does not fit.",
      les: "Look, do not touch: never touch a pufferfish, not even when it lies on the beach.",
      vraag: "What are they studying this for?",
      keuzes: ["Against severe pain", "As glue for broken bones", "Against head lice"],
    },
  };
  const PHARMA_KEYS = Object.keys(PHARMA);
  const pharmaText = k => Object.assign({}, PHARMA[k], LANG === "en" ? PHARMA_EN[k] : {});

  // What the cabinet remembers: the golden labels, and the danger cards earned by keeping your distance.
  // An ordinary jar is full as soon as its animal is in the logbook.
  const PHARMA_GOLD_KEY = "oceaan-apotheek-goud", PHARMA_DANGER_KEY = "oceaan-apotheek-gevaar";
  const pharmaGold = () => new Set(store.get(PHARMA_GOLD_KEY, []));
  const pharmaDanger = () => new Set(store.get(PHARMA_DANGER_KEY, []));
  const pharmaFull = k => PHARMA[k].gevaar ? pharmaDanger().has(k) : logbook.has(k);
  function pharmaProgress() { return [PHARMA_KEYS.filter(pharmaFull).length, PHARMA_KEYS.length]; }
  const pharmaAdd = (key, k) => store.set(key, [...new Set([...store.get(key, []), k])]);

  // ---- the cabinet in the logbook -------------------------------------------------------------
  // A wooden cabinet with two shelves of jars. An empty jar shows the silhouette of its animal and a blank label;
  // a full one the animal and the name of its substance, in the colour of its kind, golden once the question is answered.
  function pharmaJar(k, gold) {
    const full = pharmaFull(k), seen = logbook.has(k), t = pharmaText(k), kind = PHARMA_TYPES[t.type];
    const name = t.dier || nm(k);
    const label = full ? `${kind[0]} ${t.stof}` : PHARMA[k].gevaar && seen ? "⚠" : "";
    const say = full ? `${name}: ${t.stof}` : seen ? L(`${name}: nog niet op afstand bekeken`, `${name}: not yet watched from a distance`) : L("Leeg potje", "Empty jar");
    return `<button type="button" class="ap-jar ${full ? "on" : "off"}${gold ? " gold" : ""}" style="--label:var(--ap-${t.type})" data-pharma="${k}" aria-label="${say}">
      <span class="ap-lid" aria-hidden="true"></span><span class="ap-glass"><img alt="" data-thumb="${k}" data-seen="${full || seen ? 1 : 0}"></span>
      <span class="ap-label">${label}${gold ? ` <i aria-hidden="true">⭐</i>` : ""}</span></button>`;
  }
  // two parts, so on a small page the explanation can carry on overleaf
  function pharmaBlocks() {
    const gold = pharmaGold(), [have, all] = pharmaProgress(), golden = PHARMA_KEYS.filter(k => gold.has(k)).length;
    const shelves = [PHARMA_KEYS.slice(0, 4), PHARMA_KEYS.slice(4)];
    const legend = Object.values(PHARMA_TYPES).map(([icon, nl, en]) => `<span>${icon} ${L(nl, en)}</span>`).join("");
    return [`<h2 class="nb-title">${L("Apotheek van de zee", "Apothecary of the sea")}</h2>
      <p class="nb-sub">${L("Veel zeedieren hebben een tweede verhaal: mensen maakten er een medicijn, een hulpstof of een labmiddel van.", "Many sea animals have a second story: people made a medicine, a helper substance or a lab tool from them.")}</p>
      <p class="nb-stat">${L(`<b>${have}</b> van ${all} potjes vol · <b>${golden}</b> gouden etiket${golden === 1 ? "" : "ten"}`, `<b>${have}</b> of ${all} jars full · <b>${golden}</b> golden label${golden === 1 ? "" : "s"}`)}</p>
      <div class="ap-cabinet">${shelves.map(row => `<div class="ap-shelf">${row.map(k => pharmaJar(k, gold.has(k))).join("")}</div>`).join("")}</div>`,
      `<p class="ap-legend">${legend}</p>
      <p class="nb-note">${L("Zie je een dier in de oceaan, dan vult zijn potje zich. Tik op een potje om zijn verhaal te lezen. Een ☠️ dier bekijk je alleen van een afstandje.", "When you see an animal in the ocean, its jar fills up. Tap a jar to read its story. A ☠️ animal you only watch from a distance.")}
        ${L("Medicijnen komen van de apotheek, nooit zelf uit zee.", "Medicines come from the pharmacy, never straight from the sea.")}</p>`];
  }

  // ---- the card of one jar --------------------------------------------------------------------
  // A page of the book, like an animal's page. The question shows its choices in a new order every time it opens,
  // so after a wrong answer you can simply try again later.
  function openPharma(k, answer) {
    if (!PHARMA[k]) return;
    detailOpen = true; detailKey = null;
    const t = pharmaText(k), kind = PHARMA_TYPES[t.type], full = pharmaFull(k), seen = logbook.has(k), gold = pharmaGold().has(k);
    const name = t.dier || nm(k);
    const photo = {
      top: `<div class="nb-run">${L("Apotheek", "Apothecary")}</div>`,
      figure: `<figure class="nb-photo" style="--tilt:${tiltOf(k) - 1}deg"><img class="big" alt="${name}" src="${thumbURL(k, full || seen, 4)}"><figcaption>${full || seen ? name : "?"}</figcaption></figure>`,
    };
    const back = `<button type="button" id="detailBack" class="nb-back">‹ ${L("Terug naar de kast", "Back to the cabinet")}</button>`;
    if (!full) {
      const where = hintFor(k);
      const how = PHARMA[k].gevaar && seen
        ? L(`Je hebt de ${name.toLowerCase()} al gezien. Bekijk hem nog eens met je lamp, maar blijf op afstand: komt je duiker te dichtbij, dan verschijnt er een ⚠.`, `You have already seen the ${name.toLowerCase()}. Look at it again with your lamp, but keep your distance: if your diver comes too close, a ⚠ appears.`)
        : L("Dit potje is nog leeg. Vind het dier in de oceaan om het te vullen.", "This jar is still empty. Find the animal in the ocean to fill it.");
      renderBookDetail(photo, {
        back, body: `<h2 class="nb-title small">${L("Leeg potje", "Empty jar")}</h2><p class="nb-fact">${how}</p>`,
        side: where ? `<dl class="nb-dl"><div><dt>${L("Waar", "Where")}</dt><dd>${where.charAt(0).toUpperCase() + where.slice(1)}</dd></div></dl>` : "", nav: "",
      });
      document.getElementById("detailBack").focus();
      return;
    }
    let quiz;
    if (gold || answer === true) {
      quiz = `<p class="ap-result ok">⭐ ${L("Gouden etiket! Het goede antwoord:", "Golden label! The right answer:")} ${t.keuzes[PHARMA[k].goed]}</p>`;
    } else if (answer === false) {
      quiz = `<p class="ap-result">${L("Bijna! Het goede antwoord is:", "Nearly! The right answer is:")} <b>${t.keuzes[PHARMA[k].goed]}</b>. ${L("Je kunt het later nog eens proberen.", "You can try again later.")}</p>`;
    } else {
      const order = shuffleCopy([0, 1, 2]);
      quiz = `<p class="ap-q">${t.vraag} <span>${L("(voor een gouden etiket)", "(for a golden label)")}</span></p><div class="ap-choices">` +
        order.map(i => `<button type="button" data-pquiz="${k}" data-pick="${i}">${t.keuzes[i]}</button>`).join("") + `</div>`;
    }
    renderBookDetail(photo, {
      back,
      body: `<h2 class="nb-title small">${t.stof}</h2>
        <p class="ap-kind" style="--label:var(--ap-${t.type})">${kind[0]} ${L(kind[1], kind[2])}</p>
        <p class="nb-fact"><b>${L("Waarvoor?", "What for?")}</b> ${t.gebruik}</p>
        <p class="nb-fact"><b>${L("Sinds wanneer?", "Since when?")}</b> ${t.sinds}</p>
        <p class="nb-note-field"><b>${L("Weetje", "Did you know")}</b> ${t.weetje}</p>
        ${t.les ? `<p class="ap-lesson">⚠ ${t.les}</p>` : ""}
        <div class="ap-quiz">${quiz}</div>`,
      side: `<dl class="nb-dl"><div><dt>${L("Dier", "Animal")}</dt><dd>${name}</dd></div></dl>`,
      nav: "",
    });
    const focus = panelBody.querySelector("[data-pquiz]") || document.getElementById("detailBack");
    if (answer === undefined) document.getElementById("detailBack").focus(); else focus.focus();
  }
  // a shuffle that does not touch the dice of the ocean
  function shuffleCopy(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  panelBody.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b || panelTab !== "log") return;
    if (b.dataset.pharma) { openPharma(b.dataset.pharma); return; }
    if (b.dataset.pquiz) {
      const k = b.dataset.pquiz, right = Number(b.dataset.pick) === PHARMA[k].goed;
      if (right) { pharmaAdd(PHARMA_GOLD_KEY, k); toast(L("Gouden etiket!", "Golden label!")); buzz([30, 40, 60]); }
      openPharma(k, right);
    }
  });

  // ---- danger: look, do not touch --------------------------------------------------------------
  // When the diver comes close to the pufferfish a warning sign appears above it. Keeping it in the lamp from a
  // distance fills an amber ring; when it is full the danger card is yours. Coming too close lets the ring run back.
  const DANGER_NEAR = 120, DANGER_HOLD = 1.5;
  function watchDanger() {
    const p = scene.puffer;
    if (!p || !diverMode) { if (p) p.warn = 0; return; }
    const close = Math.hypot(p.x - diver.x, p.y - diver.y) < DANGER_NEAR * u;
    p.warn = (p.warn || 0) + ((close ? 1 : 0) - (p.warn || 0)) * Math.min(1, 0.15 * frameK);
    if (p.warn > 0.03) drawWarning(p.x, p.y - p.s * 2.4 - 6 * u, p.warn);
    if (pharmaDanger().has("puffer") || rebuilding) return;
    const dt = Math.min(0.1, frameK / 60);
    if (close) p.keep = Math.max(0, (p.keep || 0) - dt * 2);
    else if (lit(p.x, p.y, p.s)) p.keep = (p.keep || 0) + dt;
    else p.keep = Math.max(0, (p.keep || 0) - dt * 0.4);
    if (p.keep > 0) {
      const f = Math.min(1, p.keep / DANGER_HOLD), r = p.s * 2 + 8 * u;
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(4,20,34,0.4)"; ctx.lineWidth = 4 * u;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, TAU); ctx.stroke();
      ctx.strokeStyle = "rgba(255,196,80,0.95)"; ctx.lineWidth = 2.5 * u;
      ctx.beginPath(); ctx.arc(p.x, p.y, r, -Math.PI / 2, -Math.PI / 2 + f * TAU); ctx.stroke();
    }
    if (p.keep >= DANGER_HOLD && !selfTesting) {
      const before = reached();
      pharmaAdd(PHARMA_DANGER_KEY, "puffer");
      p.keep = 0;
      toast(L("Goed zo, je hield afstand van de kogelvis: kijken, niet aanraken! Zijn potje in de apotheek staat nu vol.", "Well done, you kept your distance from the pufferfish: look, do not touch! Its jar in the apothecary is full now."), "important");
      buzz([40, 50, 80]);
      checkMilestones(before);
    }
  }
  // a yellow warning triangle with an exclamation mark, the same on every water
  function drawWarning(x, y, a) {
    const s = 11 * u;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y - (1 - a) * 6 * u);
    ctx.fillStyle = "rgba(4,20,34,0.45)";
    ctx.beginPath(); ctx.moveTo(0, -s * 1.15); ctx.lineTo(s * 1.15, s * 0.8); ctx.lineTo(-s * 1.15, s * 0.8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#f6c632"; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s, s * 0.7); ctx.lineTo(-s, s * 0.7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2a1c04";
    ctx.fillRect(-s * 0.1, -s * 0.45, s * 0.2, s * 0.7);
    ctx.beginPath(); ctx.arc(0, s * 0.45, s * 0.12, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // ---- the golden mortar --------------------------------------------------------------------
  // The reward of a full cabinet: it only stands in an aquarium, never in a random ocean, so it rolls no dice.
  const mortarProp = () => ({ kind: "mortar", w: 80 * u, s: 30 * u, ph: 0 });
  function drawMortar(g, k) {
    g.ph += 0.02 * k;
    const s = g.s, gold = sh("#e0b23a"), dark = sh("#9a7218"), light = sh("#f6dc82");
    ctx.save(); ctx.translate(g.x, sandY(g.x) + 6 * u);
    // the pestle leans in the bowl
    ctx.save(); ctx.translate(s * 0.2, -s * 0.85); ctx.rotate(0.5);
    ctx.fillStyle = dark; ctx.beginPath(); ctx.roundRect(-s * 0.09, -s * 0.75, s * 0.18, s * 0.9, s * 0.09); ctx.fill();
    ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(0, -s * 0.75, s * 0.14, 0, TAU); ctx.fill();
    ctx.restore();
    // a squat bowl on a little foot, its rim seen from just above
    ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(0, -s * 0.04, s * 0.42, s * 0.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = gold;
    ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.06); ctx.lineTo(-s * 0.22, -s * 0.24); ctx.lineTo(s * 0.22, -s * 0.24); ctx.lineTo(s * 0.3, -s * 0.06); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.62, -s * 0.86); ctx.quadraticCurveTo(-s * 0.6, -s * 0.2, 0, -s * 0.2); ctx.quadraticCurveTo(s * 0.6, -s * 0.2, s * 0.62, -s * 0.86); ctx.fill();
    ctx.fillStyle = light; ctx.beginPath(); ctx.ellipse(-s * 0.3, -s * 0.55, s * 0.08, s * 0.22, 0.3, 0, TAU); ctx.fill();
    ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(0, -s * 0.86, s * 0.62, s * 0.14, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = light; ctx.beginPath(); ctx.ellipse(0, -s * 0.88, s * 0.62, s * 0.05, 0, Math.PI, TAU); ctx.fill();
    // it glitters now and then
    const tw = Math.max(0, Math.sin(g.ph * 3)) ** 8;
    if (tw > 0.05) star(-s * 0.4, -s * 0.9, s * 0.25 * tw + 1, `rgba(255,250,210,${tw})`);
    ctx.restore();
  }
  GROUND_DRAW.mortar = drawMortar;
  THUMBS.mortar = () => drawMortar({ x: 60, s: 30, ph: Math.PI / 6 }, 0);

  // ---- the sea hare ---------------------------------------------------------------------------------
  // A big olive sea snail with two rolled flaps on its head like a hare's ears. It creeps slowly over the sand;
  // when the diver comes close it lets out a cloud of purple ink, and then waits a while before it can do so again.
  const HARE_BODY = "M 50 -2 C 50 -8 44 -12 36 -14 C 24 -18 10 -28 -10 -32 C -26 -35 -40 -30 -44 -20 C -47 -12 -46 -4 -44 0 L 48 0 C 50 0 50 -1 50 -2 Z";
  const HARE_EAR = "M 0 0 C -3 -6 -2 -12 2 -15 C 4 -10 4 -5 3 0 Z";
  function drawSeahare(f) {
    const s = f.s;
    if (f.ink === undefined) { f.ink = 0; f.inkCool = 0; }
    f.inkCool -= frameK / 60;
    if (f.inkCool <= 0 && near(f.x, f.cy - s * 0.15, 110 * u) > 0) { f.ink = 1; f.inkCool = 10; }
    f.ink = Math.max(0, f.ink - 0.006 * frameK);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100 * (1 + Math.sin(f.ph * 1.2) * 0.03));
    // the ink drifts up behind it and fades
    if (f.ink > 0) {
      const g = 1 - f.ink;
      ctx.fillStyle = sh("#7a3a9a");
      for (const [dx, dy, r] of [[-40, -20, 12], [-52, -30, 9], [-34, -38, 10], [-58, -16, 7]]) {
        ctx.globalAlpha = f.ink * 0.5; ctx.beginPath(); ctx.arc(dx - g * 14, dy - g * 18, r * (1 + g * 1.4), 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    const body = P(HARE_BODY);
    fillWith(body, sh("#6a6a3e"));
    // a darker back, a lighter rim of the foot, and pale speckles
    paintInside(body, sh("#454428"), P("M -60 -40 L 40 -40 L 40 -19 C 10 -22 -20 -24 -60 -18 Z"));
    paintInside(body, sh("#8e8a5a"), P("M -60 -6 C -20 -4 20 -4 60 -6 L 60 4 L -60 4 Z"));
    ctx.fillStyle = sh("#c8c4a0");
    ctx.beginPath(); for (const [x, y, r] of [[-30, -22, 1.8], [-16, -26, 1.4], [0, -20, 1.6], [12, -14, 1.3], [-22, -12, 1.2], [24, -9, 1.1]]) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TAU); } ctx.fill();
    // the two ears, rolled like a leaf, swaying a little
    for (const [x, lean] of [[34, -0.15], [40, 0.12]]) {
      ctx.save(); ctx.translate(x, -13); ctx.rotate(lean + Math.sin(f.ph * 1.6 + x) * 0.06);
      fillWith(P(HARE_EAR), sh(x > 36 ? "#6a6a3e" : "#454428"));
      ctx.restore();
    }
    eye(42, -9, 1.6);
    ctx.restore();
  }

  // ---- the mangrove tunicate ---------------------------------------------------------------------------
  // A little bunch of see-through bags with orange rims, joined at the foot. When the diver comes close they
  // pull themselves in and close their openings.
  const TUNICATE_ZOOIDS = [[-30, 34], [-18, 44], [-6, 38], [6, 48], [18, 36], [30, 42]];
  function drawTunicate(f) {
    const s = f.s;
    f.shut = (f.shut || 0) + ((near(f.x, f.cy - s * 0.2, 100 * u) > 0 ? 1 : 0) - (f.shut || 0)) * Math.min(1, 0.06 * frameK);
    ctx.save(); ctx.translate(f.x, f.cy); ctx.scale(faceOf(f) * s / 100, s / 100);
    // the root-like foot that joins them
    ctx.fillStyle = sh("#a86a3a"); ctx.beginPath(); ctx.roundRect(-38, -4, 76, 6, 3); ctx.fill();
    for (const [x, h0] of TUNICATE_ZOOIDS) {
      const h = h0 * (1 - f.shut * 0.3), sway = Math.sin(f.ph * 0.9 + x * 0.2) * 1.5, top = x + sway;
      ctx.globalAlpha = 0.6; ctx.fillStyle = sh("#e8d8c8");
      ctx.beginPath(); ctx.moveTo(x - 3, 0); ctx.quadraticCurveTo(x - 8, -h * 0.5, top - 5, -h); ctx.lineTo(top + 5, -h); ctx.quadraticCurveTo(x + 8, -h * 0.5, x + 3, 0); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
      // the orange rim round the opening, and the opening itself, which closes when it pulls in
      ctx.fillStyle = sh("#f07a2a"); ctx.beginPath(); ctx.ellipse(top, -h, 5.6, 2.4, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = sh("#b8501a"); ctx.beginPath(); ctx.ellipse(top, -h, 2.6 * (1 - f.shut * 0.8) + 0.3, 1.1, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = sh("#f07a2a"); ctx.beginPath(); ctx.ellipse(x, -h * 0.45, 2.2, 3.4, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }

  // ---- the table of the apothecary round -------------------------------------------------------------
  const PHARMA_FAUNA = {
    seahare: { kind: "floor", size: [24, 30], count: [1, 2], crawl: 0.03, draw: drawSeahare, thumb: 80, stream: true },
    tunicate: { kind: "floor", size: [14, 18], count: [1, 3], draw: drawTunicate, thumb: 72, stream: true },
  };
  Object.assign(FAUNA, PHARMA_FAUNA);
  hookFauna(PHARMA_FAUNA, {});

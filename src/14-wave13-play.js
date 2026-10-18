  // ---- the thirteenth round: things to play with ------------------------------------------------------------------
  // Finds that were only there to look at now do something: ring the ship's bell, answer the phone box, turn the
  // ship's wheel (the current turns round), let a crab out of the diving helmet, cut a sea mine loose, lift the golden
  // idol and let the lobster out of its pot. And nine new things to play with: a sunken dinghy with the captain's
  // letters, a turtle caught in a net, a sea lock with a tile puzzle, a bottle with a note that leads to another
  // ocean, an old diving camera, a hatch in the seabed, a coconut, three amphorae (one holds coins) and a lantern
  // on the pirate wreck.
  // The new things come after everything else has its spot, from a stream of their own, so the oceans that were
  // already there keep every landmark where it was. Taps arrive through tapWave13 (handleTap in 16-controls.js).
  const W13_KEYS = ["dinghy", "netturtle", "sealock", "notebottle", "camera", "hatch", "nut", "jars"];
  const W13_FLOAT = new Set(["notebottle"]);
  const W13_FLOOR_MAX = 1;
  // finds from before that are drawn once into the background, but now move when you play with them
  const W13_LIVE = new Set(["bell", "wheel", "phonebox"]);

  function addWave13Ground(s, P) {
    const here = W13_KEYS.filter(k => chance(P[k] || 0));
    const make = {
      dinghy: () => ({ w: 150 * u, s: range(46, 54) * u, tilt: range(-0.12, 0.08), dir: chance(0.5) ? 1 : -1, letter: Math.floor(rng() * CAPTAIN_LETTERS.length), read: 0 }),
      netturtle: () => ({ w: 110 * u, s: range(34, 40) * u, dir: chance(0.5) ? 1 : -1, ph: range(0, TAU), cut: 0, free: 0, fx: 0, fy: 0 }),
      sealock: () => {
        const order = [0, 1, 2]; for (let i = 2; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
        const tiles = [0, 1, 2]; for (let i = 2; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [tiles[i], tiles[j]] = [tiles[j], tiles[i]]; }
        return { w: 190 * u, s: range(46, 52) * u, order, tiles, step: 0, lit: [0, 0, 0], open: 0, done: false, flash: 0 };
      },
      notebottle: () => ({ w: 50 * u, s: range(20, 24) * u, ph: range(0, TAU), tilt: range(-0.3, 0.3), asked: 0 }),
      camera: () => ({ w: 50 * u, s: range(20, 24) * u, tilt: range(-0.25, 0.25), taken: false, flash: 0 }),
      hatch: () => ({ w: 90 * u, s: range(32, 38) * u, open: 0, opened: false, prize: rng(), t0: 0, fish: null }),
      nut: () => ({ w: 40 * u, s: range(12, 15) * u, tilt: range(-0.4, 0.4), cracked: 0, octo: rng() < 0.55, ox: 0, ph: range(0, TAU) }),
      jars: () => ({ w: 120 * u, s: range(24, 28) * u, win: Math.floor(rng() * 3), picked: -1, wob: [0, 0, 0] }),
    };
    const items = here.map(k => Object.assign({ kind: k }, make[k]()));
    // the lantern rolls before any place is chosen: how many tries a place takes depends on the screen
    const lantern = chance(P.shiplantern || 0), lanternPh = range(0, TAU);
    let onFloor = 0;
    for (const it of items) {
      const floating = W13_FLOAT.has(it.kind);
      if (floating ? !water.surface : !aquarium && onFloor >= W13_FLOOR_MAX) continue;
      if (!floating) onFloor++;
      it.x = w12Spot(s, it, floating);
      s.ground.push(it);
    }
    // a lantern hangs in the rigging of the pirate wreck
    const wreck = s.ground.find(g => g.kind === "wreck");
    if (wreck && lantern) s.ground.push({ kind: "shiplantern", wreck, w: 0, x: wreck.x, lit: 0, on: false, ph: lanternPh });
    for (const g of s.ground) if (W13_LIVE.has(g.kind)) g.live = true;
    // effects that do not belong to one find (sound rings, splashes, falling pebbles, the shaking cave)
    s.ground.push({ kind: "w13fx", w: 0, x: -9999, fx: [], shake: 0 });
  }

  // ---- texts ------------------------------------------------------------------------------------------------------
  const CAPTAIN_LETTERS = [
    ["Dag 2. Ik vroeg de stuurman of we verdwaald zijn. Hij zei: 'Nee kapitein, we zijn op avontuur.'", "Day 2. I asked the helmsman if we are lost. He said: 'No captain, we are on an adventure.'"],
    ["Dag 3. De papegaai spreekt nu drie talen, maar zegt in alle drie alleen 'koekje'.", "Day 3. The parrot now speaks three languages, but in all three it only says 'biscuit'."],
    ["Dag 9. Mijn schatkaart heeft een gat, precies op de plek van de schat. Typisch.", "Day 9. My treasure map has a hole, exactly where the treasure is. Typical."],
    ["Dag 12. Vandaag een zeemeermin gezien. Of een zeekoe. Het was erg mistig.", "Day 12. Saw a mermaid today. Or a manatee. It was very foggy."],
    ["Dag 14. De kok zegt dat de soep naar zeewier smaakt. Klopt: er zit zeewier in.", "Day 14. The cook says the soup tastes of seaweed. True: there is seaweed in it."],
    ["Dag 18. Een octopus heeft van de bootsman gewonnen met schaken. Twee keer.", "Day 18. An octopus beat the boatswain at chess. Twice."],
    ["Dag 27. Er zwemt al dagen een dolfijn met ons mee. Hij kent de weg beter dan onze navigator.", "Day 27. A dolphin has been swimming with us for days. It knows the way better than our navigator."],
    ["Dag 33. De kanonskogels zijn op. We gooien nu met kokosnoten. Het werkt verrassend goed.", "Day 33. We are out of cannonballs. We throw coconuts now. It works surprisingly well."],
    ["Dag 40. Land in zicht! Het bleek een walvis te zijn. Hij was er niet blij mee.", "Day 40. Land ahoy! It turned out to be a whale. It was not pleased."],
    ["Dag 51. De storm heeft onze hoeden meegenomen. De meeuwen dragen ze nu.", "Day 51. The storm took our hats. The gulls are wearing them now."],
    ["Dag 66. 's Nachts licht de zee op als een sterrenhemel. Niemand wil gaan slapen.", "Day 66. At night the sea lights up like a starry sky. Nobody wants to go to sleep."],
    ["Laatste bladzijde. We zinken, maar heel langzaam, en iedereen past in de sloep. Tot ziens, zee!", "Last page. We are sinking, but very slowly, and everyone fits in the dinghy. Goodbye, sea!"],
  ];
  const PHONE_CALLS = [
    ["Blub... blub... blub. Er wordt opgehangen.", "Blub... blub... blub. They hang up."],
    ["'Met de kapitein. Heeft iemand mijn pet gezien?'", "'Captain speaking. Has anyone seen my cap?'"],
    ["'U spreekt met de klantenservice van de zee. Al onze lijnen zijn bezet door walvissen.'", "'This is the sea's customer service. All our lines are busy with whales.'"],
    ["Een octopus vraagt of je toevallig acht handen vrij hebt.", "An octopus asks whether you happen to have eight hands free."],
    ["Gekraak... en dan zingt iemand heel zacht een walvisliedje.", "Crackling... and then someone very softly sings a whale song."],
    ["'Verkeerd verbonden,' zegt een zeehond, en hij hangt op.", "'Wrong number,' says a seal, and hangs up."],
  ];
  const PHONE_SPOOKY = [
    ["Een holle stem fluistert: 'Wie heeft mijn schip gezien...?'", "A hollow voice whispers: 'Who has seen my ship...?'"],
    ["Je hoort kettingen rammelen. Dan is het stil.", "You hear chains rattling. Then all is quiet."],
    ["'Ik ben nog steeds aan het duiken,' fluistert iemand. 'Al honderd jaar.'", "'I am still diving,' someone whispers. 'For a hundred years now.'"],
  ];
  const CAPTAIN_KEY = "oceaan-kapitein", TIPS_KEY = "oceaan-speeltips";
  // the first time the diver comes close to something to play with, a short tip says what to do
  const W13_TIPS = {
    bell: ["Tik op de scheepsbel om hem te luiden", "Tap the ship's bell to ring it"],
    phonebox: ["Tik op de telefooncel: misschien belt er iemand", "Tap the phone box: maybe someone is calling"],
    wheel: ["Draai met je duiker aan het scheepsroer (tik erop)", "Turn the ship's wheel with your diver (tap it)"],
    helmet: ["Tik op de duikerhelm: er woont iemand in", "Tap the diving helmet: someone lives inside"],
    mine: ["Knip met je duiker de ketting van de zeemijn door (tik erop)", "Cut the sea mine's chain with your diver (tap it)"],
    idol: ["Pak met je duiker het gouden beeldje op (tik erop)", "Pick up the golden idol with your diver (tap it)"],
    lobsterpot: ["Maak met je duiker het luikje van de kreeftenfuik open (tik erop)", "Open the lobster pot's hatch with your diver (tap it)"],
    dinghy: ["In de sloep ligt een logboek. Tik erop met je duiker erbij", "There is a logbook in the dinghy. Tap it with your diver close by"],
    netturtle: ["Er zit een schildpad vast in een net! Tik erop met je duiker erbij om het door te knippen", "A turtle is caught in a net! Tap it with your diver close by to cut it free"],
    sealock: ["Tik de drie tegels aan in de volgorde van de tekens op de muur", "Tap the three tiles in the order of the signs on the wall"],
    notebottle: ["Er drijft een fles met een briefje. Tik erop", "A bottle with a note is floating. Tap it"],
    camera: ["Een oude duikcamera! Pak hem op met je duiker (tik erop)", "An old diving camera! Pick it up with your diver (tap it)"],
    hatch: ["Een luik in de bodem. Trek het open met je duiker (tik erop)", "A hatch in the seabed. Pull it open with your diver (tap it)"],
    nut: ["Tik met je duiker op de kokosnoot om hem open te maken", "Tap the coconut with your diver close by to open it"],
    jars: ["In één van de drie amforen zitten munten. Kies er één met je duiker", "One of the three amphorae holds coins. Pick one with your diver"],
    shiplantern: ["Steek met je duiker de lantaarn op het wrak aan (tik erop)", "Light the lantern on the wreck with your diver (tap it)"],
  };

  // ---- sounds -----------------------------------------------------------------------------------------------------
  const w13SfxBell = () => [[1, 0.12], [2.0, 0.06], [2.76, 0.05], [5.4, 0.02]].forEach(([m, gn]) => tone({ freqs: [[196 * m, 0]], dur: 3.5, gain: gn, attack: 0.004, release: 3.2, verb: 0.85 }));
  const w13SfxRing = () => { for (let i = 0; i < 16; i++) tone({ type: "square", freqs: [[900 + (i % 2) * 180, 0]], dur: 0.05, gain: 0.025, delay: i * 0.055 + (i >= 8 ? 0.25 : 0), attack: 0.002, release: 0.02, lp: 2600, verb: 0.4 }); };
  const w13SfxCreak = () => tone({ type: "sawtooth", freqs: [[120, 0], [90, 0.5], [140, 0.9]], dur: 1, gain: 0.05, attack: 0.05, release: 0.3, lp: 700, verb: 0.6 });
  const w13SfxSplash = () => noiseBurst({ type: "highpass", freq: 900, dur: 0.9, gain: 0.18, attack: 0.01 });
  const w13SfxThud = () => tone({ freqs: [[90, 0], [55, 0.25]], dur: 0.35, gain: 0.2, attack: 0.005, release: 0.25, verb: 0.5 });
  const w13SfxClack = () => tone({ type: "triangle", freqs: [[660, 0]], dur: 0.15, gain: 0.06, attack: 0.003, release: 0.12, verb: 0.5 });

  // ---- tapping ----------------------------------------------------------------------------------------------------
  const w13Fx = () => scene.ground.find(g => g.kind === "w13fx");
  const diverNear = (x, y) => diverMode && Math.hypot(diver.x - x, diver.y - y) < 160 * u;
  // where each thing can be tapped: [x, y, radius]; the sea lock and the amphorae have one spot per tile or jar
  function w13Spots(g) {
    const sy = sandY(g.x), s = g.s;
    switch (g.kind) {
      case "bell": return [[g.x, sy - s * 0.5, s * 1.1]];
      case "lobsterpot": return g.free ? [] : [[g.x, sy - s * 0.35, s * 0.9]];
      case "phonebox": return [[g.x, sy - s * 1.3, s * 1.6]];
      case "wheel": return [[g.x, sy - s * 0.55, s * 0.95]];
      case "helmet": return g.crab === undefined ? [] : [[g.x, sy - s * 1.2, s * 1.3]];
      case "mine": return g.cut ? [] : [[g.x + Math.sin(t * 0.5 + g.ph) * 6 * u + current * 8 * u, sy + 6 * u - g.h, s * 1.7]];
      case "idol": return g.taken ? [] : [[g.x, sy - s * 0.8, s * 1.2]];
      case "dinghy": return [[g.x, sy - s * 0.35, s * 1.3]];
      case "netturtle": return g.free ? [] : [[g.x, sy - s * 0.45, s * 1.3]];
      case "sealock": return g.done ? [] : [0, 1, 2].map(i => [g.x + (i - 1) * s * 0.8, sy, s * 0.36]);
      case "notebottle": return [[g.x, w12Top(g.x) + s * 0.2, s * 1.6]];
      case "camera": return g.taken ? [] : [[g.x, sy - s * 0.5, s * 1.6]];
      case "hatch": return g.opened ? [] : [[g.x, sy - s * 0.2, s * 1.3]];
      case "nut": return g.cracked ? [] : [[g.x, sy - s * 0.6, s * 2.4]];
      case "jars": return g.picked >= 0 ? [] : [0, 1, 2].map(i => [g.x + (i - 1) * s * 1.15, sy - s * 0.8, s * 0.7]);
      case "shiplantern": { if (g.on) return []; const p = lanternPos(g); return [[p[0], p[1], 34 * u]]; }
    }
    return [];
  }
  // the diver's E key: every spot within reach
  function wave13DiverSpots() {
    const out = [];
    for (const g of scene.ground) for (const p of w13Spots(g)) out.push([p[0], p[1]]);
    return out;
  }
  function tapWave13(x, y) {
    for (const g of scene.ground) {
      const spots = w13Spots(g);
      const i = spots.findIndex(p => Math.hypot(x - p[0], y - p[1]) < p[2]);
      if (i < 0) continue;
      const p = spots[i];
      // tapping ringing, knocking and floating things works from anywhere; taking, opening and cutting needs the diver
      const free = ["bell", "phonebox", "helmet", "sealock", "notebottle"].includes(g.kind);
      if (!free && !diverNear(p[0], p[1])) {
        toast(diverMode ? L(`Zwem met je duiker dichter naar ${nmLow(g.kind)}`, `Swim your diver closer to the ${nmLow(g.kind)}`)
          : L(`Roep je duiker (D) en zwem naar ${nmLow(g.kind)}`, `Call your diver (D) and swim to the ${nmLow(g.kind)}`));
        return true;
      }
      ACT[g.kind](g, i, p);
      return true;
    }
    return false;
  }
  const nmLow = k => { const n = nm(k); return LANG === "en" ? n.toLowerCase() : "de " + n.toLowerCase(); };

  function rescuedOne(pos) {
    if (rebuilding) return;
    const before = reached(); store.set("oceaan-gered", rescued() + 1); checkMilestones(before); questEvent("rescue");
  }
  function burstCoins(x, y, n, r) {
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6, v = (2 + Math.random() * 3) * u;
      coins.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r, rot: Math.random() * TAU, spin: 0.1 + Math.random() * 0.2, life: 4 + Math.random() * 3 });
    }
    for (let i = 0; i < 16; i++) bubbles.push({ x: x + (Math.random() - 0.5) * 20 * u, y: y - Math.random() * 20 * u, r: (1 + Math.random() * 3) * u, ph: Math.random() * TAU });
  }
  function bubbleUp(x, y, n, spread) {
    for (let i = 0; i < n; i++) bubbles.push({ x: x + (Math.random() - 0.5) * spread, y: y - Math.random() * 10 * u, r: (1 + Math.random() * 4) * u, ph: Math.random() * TAU });
  }

  const ACT = {
    bell(g) {
      if (g.ring > 0.4) return;
      g.ring = 1; w13SfxBell(); buzz(30);
      const bx = g.x, by = sandY(g.x) - g.s * 0.5;
      w13Fx().fx.push({ type: "rings", x: bx, y: by, age: 0 });
      // the fish dart away from the sound
      for (const sp of scene.species) for (const f of sp.fish) { const dx = f.x - bx, dy = f.y - by, d = Math.hypot(dx, dy) || 1; if (d < 360 * u) { f.vx += dx / d * 4 * u; f.vy += dy / d * 2 * u; } }
      // in open water a whale sometimes answers
      const S = scene, whale = (water.visitors || []).find(v => ["humpback", "bluewhale", "finwhale"].includes(v) && VISITOR_DRAW[v]);
      if (whale && !S.visitor && !g.answered && Math.random() < 0.25) {
        g.answered = true; S.forceVisitor = whale; S.visitorTimer = 2.5;
        setTimeout(() => toast(L("In de verte antwoordt iets heel groots...", "Far away, something very big answers...")), 1200);
      }
    },
    phonebox(g) {
      if (g.ringing > 0) {
        g.ringing = 0; sfxClick();
        const spooky = (activeEvent() || {}).id === "spookweek" || Math.random() < 0.15;
        const list = spooky ? PHONE_SPOOKY : PHONE_CALLS, msg = list[Math.floor(Math.random() * list.length)];
        toast(L("Je neemt op. ", "You answer. ") + L(msg[0], msg[1]), "important");
        return;
      }
      if (g.cool > 0) { toast(L("Het is stil aan de lijn", "The line is quiet")); return; }
      g.ringing = 5; g.cool = 9; g.nextRing = 0;
      toast(L("De telefooncel gaat over! Tik nog een keer om op te nemen.", "The phone box is ringing! Tap it again to answer."));
    },
    wheel(g) {
      if (g.turn > 0) return;
      const S = scene, dir = -(Math.sign(current) || (Math.random() < 0.5 ? 1 : -1));
      g.turn = 1.6; g.turnDir = dir; w13SfxCreak(); buzz(40);
      S.currentTarget = dir * 1.7; S.currentTimer = 14;
      toast(L("Je draait aan het scheepsroer: de stroming keert om!", "You turn the ship's wheel: the current turns round!"));
    },
    helmet(g) {
      if (!g.crab || g.walk) { if (!g.walk) toast(L("Er is niemand thuis", "Nobody is home")); return; }
      g.crab = false; g.walk = { t: 0, dir: Math.random() < 0.5 ? -1 : 1 };
      toast(L("Een krabbetje stapt uit de helm voor een rondje over de bodem", "A little crab steps out of the helmet for a stroll on the floor"));
    },
    mine(g) {
      g.cut = { y: 0, vy: 0, mx: g.x + Math.sin(t * 0.5 + g.ph) * 6 * u + current * 8 * u, done: false };
      sfxClick(); buzz(20);
      toast(L("Je duiker knipt de roestige ketting door. De mijn drijft omhoog...", "Your diver cuts the rusty chain. The mine floats up..."));
    },
    idol(g) {
      g.taken = true; sfxShiny();
      const fx = w13Fx(); fx.shake = 3;
      if (claim(4)) sfxRumble(0.7);
      buzz([120, 60, 200]);
      toast(L("Je pakt het gouden beeldje op... en de grond begint te trillen!", "You pick up the golden idol... and the ground starts to shake!"));
      setTimeout(() => toast(L("Gelukkig: het was maar even. Het beeldje gaat mee in je duiktas.", "Phew: it was only for a moment. The idol goes into your dive bag.")), 3400);
    },
    lobsterpot(g) {
      g.free = 0.001; w13SfxClack();
      rescuedOne();
      toast(L("Je doet het luikje open en de kreeft wandelt de vrijheid tegemoet.", "You open the hatch and the lobster walks off to freedom."));
    },
    dinghy(g) {
      const got = new Set(store.get(CAPTAIN_KEY, []));
      const fresh = !got.has(g.letter);
      got.add(g.letter); store.set(CAPTAIN_KEY, [...got].sort((a, b) => a - b));
      g.read = 1; w13SfxClack();
      const msg = CAPTAIN_LETTERS[g.letter];
      toast(L(`Logboek van de kapitein (${got.size} van ${CAPTAIN_LETTERS.length}${fresh ? ", nieuw" : ""}): ${msg[0]}`, `Captain's log (${got.size} of ${CAPTAIN_LETTERS.length}${fresh ? ", new" : ""}): ${msg[1]}`), "important");
    },
    netturtle(g) {
      if (g.cut > 0) return;
      g.cut = 0.001; sfxClick();
      toast(L("Je duiker knipt het net door... blijf even in de buurt", "Your diver cuts the net... stay close for a moment"));
    },
    sealock(g, i) {
      const sym = g.tiles[i];
      if (g.lit[i]) return;
      if (sym === g.order[g.step]) {
        g.lit[i] = 1; g.step++; w13SfxClack();
        if (g.step === 3) {
          g.done = true; sfxShiny(); buzz([40, 50, 80]);
          setTimeout(() => { burstCoins(g.x, sandY(g.x) - g.s * 1.1, 24, g.s * 0.1); sfxChest(); }, 900);
          toast(L("Klik, klik, klik... het zeeslot gaat open!", "Click, click, click... the sea lock opens!"));
        }
      } else {
        g.lit = [0, 0, 0]; g.step = 0; g.flash = 1; w13SfxThud(); buzz(60);
        toast(L("Dat was de verkeerde volgorde. Kijk goed naar de tekens op de muur.", "That was the wrong order. Look closely at the signs on the wall."));
      }
    },
    notebottle(g) {
      const dest = Math.floor((seed * 7919 + 104729) % 1e9);
      if (g.asked > 0) {
        g.asked = 0;
        const left = lockLeft();
        if (left > 0) { toast(L(`Je kunt naar oceaan ${dest} zodra er een nieuwe oceaan mag (over ${clockText(left)}).`, `You can go to ocean ${dest} as soon as a new ocean is allowed (in ${clockText(left)}).`)); return; }
        if (introLeft() || (aquarium && aquarium.intro)) { toast(L("Maak eerst je oefenduiken af", "Finish your practice dives first")); return; }
        countSwitch(); aquarium = null; aqDraft = null; personalOcean = true;
        newVariant(dest, true);
        toast(L(`Welkom in oceaan ${dest}, waar het briefje vandaan kwam`, `Welcome to ocean ${dest}, where the note came from`));
        return;
      }
      g.asked = 8; w13SfxClack();
      toast(L(`In de fles zit een briefje van een andere duiker: 'Kom eens kijken in oceaan ${dest}!' Tik nog een keer om erheen te duiken.`,
        `The bottle holds a note from another diver: 'Come and see ocean ${dest}!' Tap again to dive there.`), "important");
    },
    async camera(g) {
      g.taken = true; g.flash = 1; sfxClick();
      toast(L("Je pakt de oude duikcamera op. Hij doet het nog! Klik...", "You pick up the old diving camera. It still works! Click..."));
      try {
        lastPhotoHits = photoHits();
        const keep = photoFilter;
        photoFilter = "sepia(0.9) contrast(1.15) brightness(0.95)";
        polaroidCanvas = await makePolaroid();
        photoFilter = keep;
        addToAlbum();
      } catch (e) { toast(L("De foto is mislukt", "The photo failed")); }
    },
    hatch(g) {
      g.opened = true; g.t0 = t; w13SfxCreak(); buzz(40);
      setTimeout(() => {
        if (scene !== sceneOf(g)) return;
        const x = g.x, y = sandY(g.x) - g.s * 0.2;
        bubbleUp(x, y, 40, g.s);
        if (g.prize < 0.35) { burstCoins(x, y, 20, g.s * 0.09); sfxChest(); toast(L("Onder het luik lag een verloren buidel munten!", "Under the hatch lay a lost bag of coins!")); }
        else if (g.prize < 0.7) { g.fish = { x, y, vx: (Math.random() < 0.5 ? -1 : 1) * 0.6 * u, ph: 0 }; toast(L("Er zwemt een lichtgevend visje uit het luik!", "A glowing little fish swims out of the hatch!")); }
        else toast(L("Alleen een stroom bellen. Wat zou er beneden zijn?", "Only a stream of bubbles. What could be down there?"));
      }, 700);
    },
    nut(g) {
      g.cracked = 0.001; w13SfxClack(); puff(g.x, sandY(g.x), 4);
      if (g.octo) {
        if (ANIMALS.coconut && !rebuilding) sight("coconut", [g.x, sandY(g.x) - g.s]);
        toast(L("Er woonde een kokosnootoctopus in! Hij neemt een helft mee als schuilplek.", "A coconut octopus lived inside! It takes one half along as a shelter."));
      } else {
        for (let i = 0; i < 18; i++) food.push({ x: g.x + (Math.random() - 0.5) * 20 * u, y: sandY(g.x) - g.s - Math.random() * 30 * u, ph: Math.random() * TAU, r: (1 + Math.random()) * u });
        toast(L("Alleen kokosvlees. De visjes komen snoepen.", "Only coconut flesh. The fish come for a snack."));
      }
    },
    jars(g, i) {
      g.picked = i; g.wob[i] = 1;
      const x = g.x + (i - 1) * g.s * 1.15, y = sandY(g.x) - g.s * 1.5;
      if (i === g.win) { burstCoins(x, y, 18, g.s * 0.09); sfxChest(); toast(L("Raak! Deze amfoor zat vol munten.", "Right! This amphora was full of coins.")); }
      else {
        for (let j = 0; j < 14; j++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 2, v = (0.6 + Math.random() * 1.6) * u; ink.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: (3 + Math.random() * 6) * u, a: 0.7 }); }
        sfxInk(); w13Fx().fx.push({ type: "octo", x, y, vx: (Math.random() < 0.5 ? -1 : 1) * 1.6 * u, vy: -1.2 * u, age: 0 });
        toast(L(`Mis! Er woonde een octopus in. De munten zaten in de ${["eerste", "middelste", "laatste"][g.win]}.`, `Missed! An octopus lived in it. The coins were in the ${["first", "middle", "last"][g.win]} one.`));
      }
    },
    shiplantern(g) {
      g.on = true; w13SfxClack();
      toast(L("De lantaarn brandt weer. In het wrak glinstert iets...", "The lantern burns again. Something glitters inside the wreck..."));
    },
  };
  // which ocean a find belongs to, so a timer from an ocean you already left does nothing
  const sceneOf = g => scene.ground.includes(g) ? scene : null;

  // ---- drawing ----------------------------------------------------------------------------------------------------
  // The finds from before keep their own drawing; these wrappers add what happens when you play with them.
  const baseDraw = Object.assign({}, GROUND_DRAW);
  function w13Tip(g, x, y) {
    if (!diverMode || g.tipped || !W13_TIPS[g.kind] || !w13Spots(g).length) return;
    if (Math.hypot(diver.x - x, diver.y - y) > 150 * u) return;
    g.tipped = true;
    const told = new Set(store.get(TIPS_KEY, []));
    if (told.has(g.kind)) return;
    told.add(g.kind); store.set(TIPS_KEY, [...told]);
    toast(L(W13_TIPS[g.kind][0], W13_TIPS[g.kind][1]));
  }

  Object.assign(GROUND_DRAW, {
    bell(g, k) {
      if (k) { g.ring = Math.max(0, (g.ring || 0) - k / 60 / 2.5); w13Tip(g, g.x, sandY(g.x) - g.s * 0.5); }
      const sw = (g.ring || 0) * Math.sin(t * 16) * 0.12;
      if (!sw) return baseDraw.bell(g, k);
      const px = g.x, py = sandY(g.x) + 6 * u;
      ctx.save(); ctx.translate(px, py); ctx.rotate(sw); ctx.translate(-px, -py); baseDraw.bell(g, k); ctx.restore();
    },
    phonebox(g, k) {
      if (k) {
        w13Tip(g, g.x, sandY(g.x) - g.s * 1.3);
        g.cool = Math.max(0, (g.cool || 0) - k / 60);
        if (g.ringing > 0) {
          g.ringing -= k / 60; g.nextRing = (g.nextRing || 0) - k / 60;
          if (g.nextRing <= 0) { w13SfxRing(); g.nextRing = 1.6; }
          if (g.ringing <= 0) toast(L("De telefoon is opgehouden met overgaan", "The phone has stopped ringing"));
        }
      }
      const shake = g.ringing > 0 && Math.sin(t * 9) > 0 ? Math.sin(t * 60) * 1.2 * u : 0;
      ctx.save(); ctx.translate(shake, 0); baseDraw.phonebox(g, k); ctx.restore();
      if (g.ringing > 0) {
        // little sound marks next to the box
        ctx.strokeStyle = `rgba(255,240,200,${0.5 + 0.4 * Math.sin(t * 9)})`; ctx.lineWidth = 1.5 * u; ctx.lineCap = "round";
        const cx = g.x, cy = sandY(g.x) - g.s * 2.2;
        for (const side of [-1, 1]) for (const r of [0.8, 1.1]) { ctx.beginPath(); ctx.arc(cx, cy, g.s * r, side < 0 ? Math.PI * 0.85 : -Math.PI * 0.15, side < 0 ? Math.PI * 1.15 : Math.PI * 0.15); ctx.stroke(); }
      }
    },
    wheel(g, k) {
      if (k) {
        w13Tip(g, g.x, sandY(g.x) - g.s * 0.55);
        if (g.turn > 0) { g.turn -= k / 60; g.spin += g.turnDir * 0.09 * k * Math.min(1, g.turn); }
      }
      baseDraw.wheel(g, k);
    },
    helmet(g, k) {
      if (k) w13Tip(g, g.x, sandY(g.x) - g.s * 1.2);
      baseDraw.helmet(g, k);
      const W2 = g.walk;
      if (!W2) return;
      if (k) W2.t += k / 60;
      // out of the helmet, a lap away and back again in about seven seconds
      const T = W2.t, d = T < 3.2 ? T / 3.2 : T < 4 ? 1 : Math.max(0, 1 - (T - 4) / 3.2), s = g.s * 0.45;
      const cx = g.x + W2.dir * (g.s * 0.6 + d * 90 * u), cy = sandY(cx) + 2 * u;
      drawLittleCrab(cx, cy, s, T);
      if (T > 7.2) { g.walk = null; g.crab = true; g.e = 0; }
    },
    mine(g, k) {
      if (!g.cut) { if (k) w13Tip(g, g.x, sandY(g.x) - g.h); return baseDraw.mine(g, k); }
      const C = g.cut, s = g.s, bx = g.x, by = sandY(bx) + 6 * u;
      // the anchor block with a short broken end of chain
      ctx.fillStyle = sh("#2e2a28"); ctx.fillRect(bx - s * 0.6, by - s * 0.5, s * 1.2, s * 0.5);
      ctx.strokeStyle = sh("#4a403a"); ctx.lineWidth = Math.max(1, s * 0.08);
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(bx + Math.sin(t + i) * 2 * u, by - s * 0.6 - i * s * 0.3, s * 0.08, s * 0.16, 0, 0, TAU); ctx.stroke(); }
      if (C.done) return;
      if (k) { C.vy = Math.min(1.4 * u, C.vy + 0.02 * u * k); C.y += C.vy * k; }
      const my = by - g.h - C.y, top = water.surface ? waveY(C.mx) + s * 0.6 : -s * 3;
      const mx = C.mx + Math.sin(t * 1.3) * 3 * u;
      if (my <= top) {
        C.done = true;
        if (water.surface) { w13Fx().fx.push({ type: "spout", x: mx, y: waveY(mx), age: 0 }); w13SfxSplash(); bubbleUp(mx, waveY(mx) + 20 * u, 20, 30 * u); toast(L("Plons! De mijn is onschadelijk aan het oppervlak opgeborgen.", "Splash! The mine is safely out of the way at the surface.")); }
        return;
      }
      drawMineBody(mx, my, s);
    },
    idol(g, k) {
      if (g.taken) return;
      if (k) w13Tip(g, g.x, sandY(g.x) - g.s * 0.8);
      baseDraw.idol(g, k);
    },
    lobsterpot(g, k) {
      if (k && !g.free) w13Tip(g, g.x, sandY(g.x) - g.s * 0.35);
      baseDraw.lobsterpot(g, k);
    },
    dinghy: drawDinghy, netturtle: drawNetTurtle, sealock: drawSealock, notebottle: drawNoteBottle, camera: drawCamera,
    hatch: drawHatch, nut: drawNut, jars: drawJars, shiplantern: drawShipLantern, w13fx: drawW13Fx,
  });

  function drawMineBody(mx, my, s) {
    const rust = sh("#5a3e30"), hi = sh("#7a5a44");
    ctx.strokeStyle = rust; ctx.lineWidth = s * 0.12; ctx.lineCap = "round"; ctx.fillStyle = rust;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + 0.2;
      ctx.beginPath(); ctx.moveTo(mx + Math.cos(a) * s * 0.9, my + Math.sin(a) * s * 0.9); ctx.lineTo(mx + Math.cos(a) * s * 1.35, my + Math.sin(a) * s * 1.35); ctx.stroke();
      ctx.beginPath(); ctx.arc(mx + Math.cos(a) * s * 1.38, my + Math.sin(a) * s * 1.38, s * 0.12, 0, TAU); ctx.fill();
    }
    ctx.beginPath(); ctx.arc(mx, my, s, 0, TAU); ctx.fill();
    ctx.fillStyle = hi; ctx.beginPath(); ctx.ellipse(mx - s * 0.35, my - s * 0.4, s * 0.35, s * 0.22, -0.5, 0, TAU); ctx.fill();
  }
  function drawLittleCrab(x, y, s, ph) {
    const red = sh("#d9543b"), dark = sh("#a83a28");
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, s * 0.1); ctx.lineCap = "round"; ctx.beginPath();
    for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
      const lx = x + side * s * (0.25 + i * 0.12), sw = Math.sin(ph * 14 + i * 2 + side) * s * 0.1;
      ctx.moveTo(lx, y - s * 0.3); ctx.lineTo(lx + side * s * 0.25 + sw, y);
    }
    ctx.stroke();
    ctx.fillStyle = red; ctx.beginPath(); ctx.ellipse(x, y - s * 0.35, s * 0.55, s * 0.32, 0, Math.PI, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x, y - s * 0.35, s * 0.55, s * 0.12, 0, 0, Math.PI); ctx.fill();
    for (const side of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + side * s * 0.7, y - s * 0.55 + Math.sin(ph * 6) * s * 0.05, s * 0.18, s * 0.12, side * 0.4, 0, TAU); ctx.fill(); }
    eye(x - s * 0.15, y - s * 0.75, s * 0.08, "#111"); eye(x + s * 0.15, y - s * 0.75, s * 0.08, "#111");
  }

  // A sunken dinghy: a rowboat lying askew in the sand, with an oar and the captain's logbook in it.
  function drawDinghy(g, k) {
    if (k) w13Tip(g, g.x, sandY(g.x) - g.s * 0.35);
    const s = g.s, base = sandY(g.x) + s * 0.12;
    const wood = sh("#7a5634"), plank = sh("#5a3c22"), inner = sh("#4a3020"), book = sh("#8a2a20"), page = sh("#e8dcc0");
    ctx.save(); ctx.translate(g.x, base); ctx.scale(g.dir, 1); ctx.rotate(g.tilt);
    // the oar, sticking out
    ctx.strokeStyle = sh("#a07a4a"); ctx.lineWidth = Math.max(1.2, s * 0.05); ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-s * 0.9, -s * 0.75); ctx.lineTo(s * 0.4, -s * 0.15); ctx.stroke();
    ctx.fillStyle = sh("#a07a4a"); ctx.beginPath(); ctx.ellipse(-s * 1.0, -s * 0.8, s * 0.2, s * 0.07, 0.45, 0, TAU); ctx.fill();
    // the inside of the boat, then the hull
    ctx.fillStyle = inner; ctx.beginPath(); ctx.ellipse(0, -s * 0.42, s * 1.3, s * 0.16, 0, 0, TAU); ctx.fill();
    // the logbook on the bench, glinting until it has been read
    ctx.fillStyle = book; ctx.fillRect(s * 0.15, -s * 0.56, s * 0.34, s * 0.12);
    ctx.fillStyle = page; ctx.fillRect(s * 0.17, -s * 0.6, s * 0.3, s * 0.05);
    if (!g.read) { const tw = Math.max(0, Math.sin(t * 2.4)) ** 6; if (tw > 0.05) star(s * 0.45, -s * 0.66, s * 0.14 * tw + 1, `rgba(255,250,210,${tw})`); }
    ctx.fillStyle = wood; ctx.beginPath();
    ctx.moveTo(-s * 1.35, -s * 0.45); ctx.quadraticCurveTo(-s * 1.1, s * 0.15, 0, s * 0.12); ctx.quadraticCurveTo(s * 1.05, s * 0.1, s * 1.3, -s * 0.5);
    ctx.lineTo(s * 1.2, -s * 0.42); ctx.quadraticCurveTo(0, -s * 0.2, -s * 1.25, -s * 0.38); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = plank; ctx.lineWidth = Math.max(0.8, s * 0.025); ctx.beginPath();
    for (const f of [0.35, 0.65]) { ctx.moveTo(-s * 1.3 + f * 0.1 * s, -s * 0.42 + f * s * 0.45); ctx.quadraticCurveTo(0, f * s * 0.5 - s * 0.25, s * 1.25 - f * 0.15 * s, -s * 0.45 + f * s * 0.42); }
    ctx.stroke();
    // a hole in the side
    ctx.fillStyle = sh("#1a120a"); ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.12); ctx.lineTo(-s * 0.1, -s * 0.2); ctx.lineTo(-s * 0.02, -s * 0.05); ctx.lineTo(-s * 0.18, s * 0.02); ctx.lineTo(-s * 0.28, -s * 0.04); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  // A sea turtle caught in a piece of net on the sand. The diver cuts it free and it swims up and away.
  function drawNetTurtle(g, k) {
    if (k) {
      g.ph += 0.05 * k;
      if (!g.cut) w13Tip(g, g.x, sandY(g.x) - g.s * 0.45);
      if (g.cut > 0 && g.cut < 1) {
        // cutting goes on while the diver stays close
        if (diverNear(g.x, sandY(g.x) - g.s * 0.45)) g.cut = Math.min(1, g.cut + k / 60 / 1.6);
        if (g.cut >= 1) {
          g.free = 0.001; sfxChest(); rescuedOne();
          if (ANIMALS.turtle && !rebuilding) sight("turtle", [g.x, sandY(g.x) - g.s * 0.5]);
          toast(L("Bevrijd! De schildpad zwemt weg.", "Set free! The turtle swims away."));
        }
      }
      if (g.free) { g.free += k / 60; g.fx += g.dir * 1.6 * u * k * Math.min(1, g.free); g.fy -= 0.7 * u * k * Math.min(1, g.free); }
    }
    const s = g.s, x = g.x + g.fx, y = sandY(g.x) - s * 0.35 + g.fy + (g.free ? 0 : Math.sin(g.ph * 3) * 1 * u);
    if (x < -200 * u || x > W + 200 * u || y < -100 * u) return;
    const shell = sh("#6a6a3a"), plate = sh("#8a8048"), skin = sh("#9aa070"), dark = sh("#4a4a2a");
    const fl = g.free ? Math.sin(g.ph * 2) * 0.5 : Math.sin(g.ph * 6) * 0.25;
    ctx.save(); ctx.translate(x, y); ctx.scale(g.dir, 1); ctx.rotate(g.free ? -0.25 : 0);
    ctx.fillStyle = skin;
    // flippers, head and tail
    ctx.save(); ctx.translate(s * 0.35, s * 0.05); ctx.rotate(0.5 + fl); ctx.beginPath(); ctx.ellipse(s * 0.3, 0, s * 0.38, s * 0.1, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(-s * 0.4, s * 0.1); ctx.rotate(0.6 - fl * 0.6); ctx.beginPath(); ctx.ellipse(-s * 0.12, 0, s * 0.2, s * 0.08, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.beginPath(); ctx.ellipse(s * 0.75, -s * 0.05, s * 0.2, s * 0.13, 0.15, 0, TAU); ctx.fill();
    ctx.fillStyle = shell; ctx.beginPath(); ctx.ellipse(0, -s * 0.05, s * 0.62, s * 0.3, 0, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = plate; ctx.beginPath(); ctx.ellipse(0, -s * 0.03, s * 0.62, s * 0.08, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(0.8, s * 0.025); ctx.beginPath();
    for (const px of [-0.35, -0.05, 0.25]) { ctx.moveTo(px * s, -s * 0.06); ctx.lineTo(px * s + s * 0.08, -s * 0.3); }
    ctx.stroke();
    eye(s * 0.84, -s * 0.09, s * 0.035);
    ctx.restore();
    // the net over it (it tears open while the diver cuts)
    if (g.free) return;
    const gap = g.cut * s * 0.5;
    ctx.strokeStyle = "rgba(160,185,160,0.8)"; ctx.lineWidth = 1.1 * u; ctx.beginPath();
    for (let i = -4; i <= 4; i++) {
      const off = i < 0 ? -gap : gap;
      ctx.moveTo(x + i * s * 0.2 + off, y - s * 0.5); ctx.quadraticCurveTo(x + i * s * 0.22 + off, y, x + i * s * 0.18 + off * 1.3, y + s * 0.45);
    }
    for (const fy of [-0.35, -0.05, 0.25]) { ctx.moveTo(x - s * 0.85 - gap, y + fy * s); ctx.quadraticCurveTo(x - gap, y + fy * s - s * 0.12, x - gap * 0.2, y + fy * s); ctx.moveTo(x + gap * 0.2, y + fy * s); ctx.quadraticCurveTo(x + gap, y + fy * s - s * 0.12, x + s * 0.85 + gap, y + fy * s); }
    ctx.stroke();
    ctx.fillStyle = "#e0702a"; for (const fx of [-0.7, 0, 0.7]) { ctx.beginPath(); ctx.arc(x + fx * s, y - s * 0.52, 3 * u, 0, TAU); ctx.fill(); }
    if (g.cut > 0 && g.cut < 1) {
      ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 3 * u;
      ctx.beginPath(); ctx.arc(x, y - s * 0.1, s * 1.05, -Math.PI / 2, -Math.PI / 2 + g.cut * TAU); ctx.stroke();
    }
  }

  // The sea lock: a stone wall with a door and three carved signs, and three tiles in the sand in front of it.
  // Step on the tiles (tap them) in the order of the signs and the door slides down.
  const LOCK_SIGNS = ["shell", "star", "fish"];
  function drawSign(kind, x, y, r, col) {
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = Math.max(1, r * 0.18); ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    if (kind === "shell") { ctx.moveTo(x - r, y + r * 0.6); ctx.quadraticCurveTo(x, y - r * 1.3, x + r, y + r * 0.6); ctx.closePath(); for (const f of [-0.5, 0, 0.5]) { ctx.moveTo(x, y + r * 0.6); ctx.lineTo(x + f * r * 1.4, y - r * 0.2); } ctx.stroke(); }
    else if (kind === "star") { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; ctx[i ? "lineTo" : "moveTo"](x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.stroke(); }
    else { ctx.ellipse(x - r * 0.15, y, r * 0.7, r * 0.4, 0, 0, TAU); ctx.moveTo(x + r * 0.5, y); ctx.lineTo(x + r, y - r * 0.4); ctx.lineTo(x + r, y + r * 0.4); ctx.closePath(); ctx.stroke(); }
  }
  function drawSealock(g, k) {
    if (k) {
      w13Tip(g, g.x, sandY(g.x) - g.s * 0.6);
      g.flash = Math.max(0, g.flash - k / 60 / 0.8);
      if (g.done) g.open = Math.min(1, g.open + k / 60 / 1.6);
    }
    const s = g.s, base = sandY(g.x) + 6 * u;
    const stone = sh("#7a7a6a"), dark = sh("#4a4a40"), carve = sh("#c8c0a0"), moss = sh("#5a7a4a"), glow = "rgba(255,220,140,";
    // the wall
    ctx.fillStyle = stone; ctx.beginPath();
    ctx.moveTo(g.x - s * 1.6, base - s * 0.3); ctx.lineTo(g.x - s * 1.5, base - s * 1.9); ctx.lineTo(g.x - s * 0.6, base - s * 2.1);
    ctx.lineTo(g.x + s * 0.6, base - s * 2.1); ctx.lineTo(g.x + s * 1.5, base - s * 1.9); ctx.lineTo(g.x + s * 1.6, base - s * 0.3); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, s * 0.03); ctx.beginPath();
    for (const fy of [0.75, 1.3]) { ctx.moveTo(g.x - s * 1.55, base - s * fy); ctx.lineTo(g.x + s * 1.55, base - s * fy); }
    ctx.stroke();
    // the doorway: dark, glowing once open; the slab slides down into the sand
    const dw = s * 0.5, dh = s * 1.1, dx = g.x, dy = base - s * 0.3;
    ctx.fillStyle = sh("#141410"); ctx.beginPath(); ctx.moveTo(dx - dw, dy); ctx.lineTo(dx - dw, dy - dh); ctx.quadraticCurveTo(dx, dy - dh - s * 0.35, dx + dw, dy - dh); ctx.lineTo(dx + dw, dy); ctx.fill();
    if (g.open > 0) { const gr = ctx.createRadialGradient(dx, dy - dh * 0.4, 0, dx, dy - dh * 0.4, dw * 1.4); gr.addColorStop(0, glow + 0.7 * g.open + ")"); gr.addColorStop(1, glow + "0)"); ctx.fillStyle = gr; ctx.fillRect(dx - dw, dy - dh - s * 0.3, dw * 2, dh + s * 0.3); }
    ctx.save(); ctx.beginPath(); ctx.rect(dx - dw, dy - dh - s * 0.4, dw * 2, dh + s * 0.4); ctx.clip();
    ctx.fillStyle = sh("#6a6a5a"); const drop = g.open * (dh + s * 0.3);
    ctx.fillRect(dx - dw, dy - dh - s * 0.3 + drop, dw * 2, dh + s * 0.3);
    ctx.strokeStyle = dark; ctx.beginPath(); ctx.moveTo(dx, dy - dh - s * 0.3 + drop); ctx.lineTo(dx, dy + drop); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1.5, s * 0.06); ctx.beginPath(); ctx.moveTo(dx - dw, dy); ctx.lineTo(dx - dw, dy - dh); ctx.quadraticCurveTo(dx, dy - dh - s * 0.35, dx + dw, dy - dh); ctx.lineTo(dx + dw, dy); ctx.stroke();
    // the signs above the door, in the order to follow
    g.order.forEach((sg, i) => drawSign(LOCK_SIGNS[sg], g.x + (i - 1) * s * 0.55, base - s * 1.75, s * 0.16, carve));
    ctx.fillStyle = moss; for (const [mx, my, mr] of [[-1.3, 1.7, 0.14], [1.2, 0.9, 0.12], [-0.9, 0.5, 0.1]]) { ctx.beginPath(); ctx.arc(g.x + mx * s, base - my * s, mr * s, 0, TAU); ctx.fill(); }
    // the tiles in the sand: they light up when stepped on in the right order, and flash red after a mistake
    g.tiles.forEach((sg, i) => {
      const tx = g.x + (i - 1) * s * 0.8, ty = sandY(tx) + 2 * u;
      ctx.fillStyle = g.lit[i] || g.done ? "rgba(255,214,120,0.9)" : g.flash > 0 ? `rgba(220,80,60,${0.4 + 0.5 * g.flash})` : sh("#9a9682");
      ctx.beginPath(); ctx.ellipse(tx, ty, s * 0.32, s * 0.1, 0, 0, TAU); ctx.fill();
      ctx.save(); ctx.translate(tx, ty); ctx.scale(1, 0.33); drawSign(LOCK_SIGNS[sg], 0, 0, s * 0.18, g.lit[i] || g.done ? "#7a5010" : sh("#4a4838")); ctx.restore();
    });
  }

  // A bottle with a rolled-up note, bobbing at the surface.
  function drawNoteBottle(g, k) {
    if (k) { g.ph += 0.025 * k; g.asked = Math.max(0, g.asked - k / 60); w13Tip(g, g.x, w12Top(g.x)); }
    const s = g.s, y = w12Top(g.x) + s * 0.15 + Math.sin(g.ph * 2) * 1.2 * u;
    ctx.save(); ctx.translate(g.x, y); ctx.rotate(Math.PI / 2 + g.tilt * 0.3 + Math.sin(g.ph) * 0.1);
    ctx.fillStyle = "rgba(120,170,140,0.6)"; ctx.beginPath(); ctx.roundRect(-s * 0.25, -s * 0.5, s * 0.5, s * 0.85, s * 0.12); ctx.fill();
    ctx.fillRect(-s * 0.09, -s * 0.8, s * 0.18, s * 0.32);
    ctx.fillStyle = sh("#7a5a3a"); ctx.fillRect(-s * 0.08, -s * 0.9, s * 0.16, s * 0.12);
    ctx.fillStyle = sh("#f0e6c8"); ctx.beginPath(); ctx.roundRect(-s * 0.12, -s * 0.38, s * 0.24, s * 0.6, s * 0.06); ctx.fill();
    ctx.strokeStyle = sh("#3a6aa8"); ctx.lineWidth = Math.max(0.8, s * 0.03); ctx.beginPath(); ctx.moveTo(-s * 0.13, -s * 0.05); ctx.lineTo(s * 0.13, -s * 0.05); ctx.stroke();
    ctx.restore();
    if (g.asked > 0) star(g.x, y - s * 0.6, s * 0.3 * (0.6 + 0.4 * Math.sin(t * 6)), "rgba(255,250,210,0.9)");
  }

  // An old diving camera: a boxy body with a big round lens, half in the sand.
  function drawCamera(g, k) {
    if (k) { g.flash = Math.max(0, g.flash - k / 60 / 0.5); if (!g.taken) w13Tip(g, g.x, sandY(g.x) - g.s * 0.5); }
    if (g.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${0.7 * g.flash})`; ctx.fillRect(0, 0, W, H); }
    if (g.taken) return;
    const s = g.s, base = sandY(g.x) + s * 0.2;
    const body = sh("#2a2e34"), trim = sh("#8a8a80"), lens = sh("#4a6a8a"), strap = sh("#5a3a22");
    ctx.save(); ctx.translate(g.x, base - s * 0.5); ctx.rotate(g.tilt);
    ctx.strokeStyle = strap; ctx.lineWidth = Math.max(1, s * 0.07); ctx.beginPath(); ctx.moveTo(-s * 0.7, -s * 0.3); ctx.quadraticCurveTo(-s * 1.3, s * 0.4, -s * 1.6, s * 0.45); ctx.stroke();
    ctx.fillStyle = body; ctx.beginPath(); ctx.roundRect(-s * 0.8, -s * 0.5, s * 1.6, s * 1.0, s * 0.15); ctx.fill();
    ctx.fillStyle = trim; ctx.fillRect(-s * 0.8, -s * 0.5, s * 1.6, s * 0.14); ctx.fillRect(-s * 0.55, -s * 0.72, s * 0.36, s * 0.22);
    ctx.fillStyle = trim; ctx.beginPath(); ctx.arc(s * 0.15, s * 0.05, s * 0.42, 0, TAU); ctx.fill();
    ctx.fillStyle = lens; ctx.beginPath(); ctx.arc(s * 0.15, s * 0.05, s * 0.32, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.beginPath(); ctx.ellipse(s * 0.05, -s * 0.07, s * 0.1, s * 0.06, -0.6, 0, TAU); ctx.fill();
    ctx.restore();
  }

  // A round metal hatch in the deep-sea floor, with a wheel on top. Pulled open, it lets out bubbles and,
  // sometimes, coins or a glowing little fish.
  function drawHatch(g, k) {
    if (k) {
      if (!g.opened) w13Tip(g, g.x, sandY(g.x) - g.s * 0.2);
      if (g.opened) { g.open = Math.min(1, g.open + k / 60 / 0.7); if (t - g.t0 < 5 && Math.random() < 0.4 * k) bubbleUp(g.x, sandY(g.x) - g.s * 0.2, 1, g.s * 0.8); }
    }
    const s = g.s, base = sandY(g.x) + 2 * u;
    const metal = sh("#5a6068"), rim = sh("#3a3e44"), rust = sh("#8a5a3a");
    ctx.fillStyle = sh("#0a0c10"); ctx.beginPath(); ctx.ellipse(g.x, base - s * 0.1, s * 0.8, s * 0.22, 0, 0, TAU); ctx.fill();
    if (g.open > 0) { const gr = ctx.createRadialGradient(g.x, base - s * 0.1, 0, g.x, base - s * 0.1, s * 0.8); gr.addColorStop(0, `rgba(120,220,255,${0.4 * g.open})`); gr.addColorStop(1, "rgba(120,220,255,0)"); ctx.fillStyle = gr; ctx.beginPath(); ctx.ellipse(g.x, base - s * 0.1, s * 0.8, s * 0.22, 0, 0, TAU); ctx.fill(); }
    // the lid swings up on its hinge at the back
    ctx.save(); ctx.translate(g.x - s * 0.8, base - s * 0.15); ctx.rotate(-g.open * 1.3);
    ctx.fillStyle = rim; ctx.beginPath(); ctx.ellipse(s * 0.8, 0, s * 0.85, s * 0.25, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = metal; ctx.beginPath(); ctx.ellipse(s * 0.8, -s * 0.04, s * 0.75, s * 0.2, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rim; ctx.lineWidth = Math.max(1, s * 0.05);
    ctx.beginPath(); ctx.ellipse(s * 0.8, -s * 0.1, s * 0.3, s * 0.08, 0, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s * 0.5, -s * 0.1); ctx.lineTo(s * 1.1, -s * 0.1); ctx.moveTo(s * 0.8, -s * 0.18); ctx.lineTo(s * 0.8, -s * 0.02); ctx.stroke();
    ctx.fillStyle = rust; for (const [rx, rr] of [[0.25, 0.06], [1.35, 0.05]]) { ctx.beginPath(); ctx.arc(rx * s, -s * 0.02, rr * s, 0, TAU); ctx.fill(); }
    ctx.restore();
    const F = g.fish;
    if (F) {
      if (k) { F.ph += 0.1 * k; F.x += F.vx * k; F.y -= 0.35 * u * k; F.vx *= 1.004; }
      if (F.x > -50 * u && F.x < W + 50 * u && F.y > -50 * u) {
        const gr = ctx.createRadialGradient(F.x, F.y, 0, F.x, F.y, 18 * u); gr.addColorStop(0, "rgba(140,240,255,0.6)"); gr.addColorStop(1, "rgba(140,240,255,0)");
        ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(F.x, F.y, 18 * u, 0, TAU); ctx.fill();
        ctx.save(); ctx.translate(F.x, F.y); ctx.scale(Math.sign(F.vx) || 1, 1);
        ctx.fillStyle = "#cfe8f0"; ctx.beginPath(); ctx.ellipse(0, 0, 7 * u, 3 * u, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-6 * u, 0); ctx.lineTo(-11 * u, -3 * u + Math.sin(F.ph) * u); ctx.lineTo(-11 * u, 3 * u + Math.sin(F.ph) * u); ctx.fill();
        ctx.fillStyle = "#8cf0ff"; for (const px of [-3, 0, 3]) { ctx.beginPath(); ctx.arc(px * u, 1.6 * u, 0.9 * u, 0, TAU); ctx.fill(); }
        ctx.restore();
      } else g.fish = null;
    }
  }

  // A coconut with a few barnacles. Opened, it is sometimes home to a coconut octopus, which walks off with half the shell.
  function drawNut(g, k) {
    if (k) { if (!g.cracked) w13Tip(g, g.x, sandY(g.x) - g.s * 0.6); if (g.cracked) { g.cracked += k / 60; if (g.octo && g.cracked > 0.6) g.ox += 0.5 * u * k * Math.min(1, g.cracked - 0.6); } g.ph += 0.1 * k; }
    const s = g.s, base = sandY(g.x) + s * 0.3;
    const husk = sh("#6a4a2a"), dark = sh("#3a2614"), flesh = sh("#f2ece0"), barn = sh("#d8d4c8");
    if (!g.cracked) {
      ctx.save(); ctx.translate(g.x, base - s); ctx.rotate(g.tilt);
      ctx.fillStyle = husk; ctx.beginPath(); ctx.ellipse(0, 0, s * 1.1, s, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = dark; ctx.lineWidth = Math.max(0.8, s * 0.06); ctx.beginPath();
      for (const a of [-0.6, 0, 0.6]) { ctx.moveTo(Math.cos(a - Math.PI / 2) * s * 0.3, -s * 0.9); ctx.quadraticCurveTo(a * s, 0, a * s * 0.6, s * 0.95); }
      ctx.stroke();
      ctx.fillStyle = dark; for (const ex of [-0.25, 0, 0.25]) { ctx.beginPath(); ctx.arc(ex * s, -s * 0.6, s * 0.09, 0, TAU); ctx.fill(); }
      ctx.fillStyle = barn; for (const [bx, by] of [[0.6, 0.3], [-0.7, 0.2]]) { ctx.beginPath(); ctx.moveTo(bx * s - s * 0.15, by * s); ctx.lineTo(bx * s, by * s - s * 0.25); ctx.lineTo(bx * s + s * 0.15, by * s); ctx.fill(); }
      ctx.restore();
      return;
    }
    // two halves: one stays, the other (with the octopus under it) walks away
    const half = (x, y, up) => {
      ctx.save(); ctx.translate(x, y); if (!up) ctx.scale(1, -1);
      ctx.fillStyle = husk; ctx.beginPath(); ctx.arc(0, 0, s, Math.PI, TAU); ctx.fill();
      ctx.fillStyle = flesh; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.85, s * 0.18, 0, 0, TAU); ctx.fill();
      ctx.restore();
    };
    half(g.x - s * 1.2, base - s * 0.1, false);
    if (!g.octo) { half(g.x + s * 1.2, base - s * 0.1, false); return; }
    const ox = g.x + s * 1.2 + g.ox;
    if (ox > W + 60 * u) return;
    // little arms walking under the shell
    ctx.strokeStyle = sh("#b86a4a"); ctx.lineWidth = Math.max(1, s * 0.18); ctx.lineCap = "round"; ctx.beginPath();
    for (let i = 0; i < 4; i++) { const lx = ox + (i - 1.5) * s * 0.45, sw = Math.sin(g.ph * 2 + i * 1.7) * s * 0.3; ctx.moveTo(lx, base - s * 0.5); ctx.quadraticCurveTo(lx + sw, base - s * 0.1, lx + sw * 1.5, base); }
    ctx.stroke();
    ctx.fillStyle = sh("#c87a58"); ctx.beginPath(); ctx.ellipse(ox, base - s * 0.55, s * 0.6, s * 0.4, 0, 0, TAU); ctx.fill();
    eye(ox + s * 0.25, base - s * 0.6, s * 0.12); eye(ox - s * 0.15, base - s * 0.6, s * 0.12);
    half(ox, base - s * 0.8, true);
  }

  // Three amphorae standing in the sand. One holds coins; the others are home to an octopus.
  function drawJars(g, k) {
    if (k) { if (g.picked < 0) w13Tip(g, g.x, sandY(g.x) - g.s * 0.8); for (let i = 0; i < 3; i++) g.wob[i] = Math.max(0, g.wob[i] - k / 60); }
    const s = g.s, cols = ["#b8653a", "#c47a48", "#a8583a"];
    for (let i = 0; i < 3; i++) {
      const x = g.x + (i - 1) * s * 1.15, base = sandY(x) + 6 * u, wob = g.wob[i] * Math.sin(t * 20) * 0.12;
      ctx.save(); ctx.translate(x, base); ctx.rotate(wob);
      ctx.fillStyle = sh(cols[i]); ctx.beginPath();
      ctx.moveTo(-s * 0.1, 0); ctx.quadraticCurveTo(-s * 0.55, -s * 0.5, -s * 0.38, -s * 1.15); ctx.quadraticCurveTo(-s * 0.2, -s * 1.35, -s * 0.13, -s * 1.45);
      ctx.lineTo(-s * 0.15, -s * 1.75); ctx.lineTo(s * 0.15, -s * 1.75); ctx.lineTo(s * 0.13, -s * 1.45);
      ctx.quadraticCurveTo(s * 0.2, -s * 1.35, s * 0.38, -s * 1.15); ctx.quadraticCurveTo(s * 0.55, -s * 0.5, s * 0.1, 0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = sh(cols[i]); ctx.lineWidth = Math.max(1, s * 0.07);
      for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(side * s * 0.15, -s * 1.65); ctx.quadraticCurveTo(side * s * 0.45, -s * 1.6, side * s * 0.33, -s * 1.25); ctx.stroke(); }
      // painted marks: one, two or three stripes
      ctx.strokeStyle = sh("#3a2014"); ctx.lineWidth = Math.max(1, s * 0.05); ctx.beginPath();
      for (let j = 0; j <= i; j++) { const yy = -s * (0.7 + j * 0.14); ctx.moveTo(-s * 0.3, yy); ctx.lineTo(s * 0.3, yy); }
      ctx.stroke();
      if (g.picked === i && i === g.win) { const tw = 0.6 + 0.4 * Math.sin(t * 5); star(0, -s * 1.85, s * 0.25 * tw, `rgba(255,240,180,${tw})`); }
      ctx.restore();
    }
  }

  // A ship's lantern in the rigging of the pirate wreck. Lit, it bathes the wreck in warm light and coins glint in the hull.
  function lanternPos(g) {
    const w = g.wreck, L = w.w, f = faceOf(w), y0 = w.y0 !== undefined ? w.y0 : sandY(w.x) + L * 0.05;
    const lx = 0.3 * L, ly = -0.2 * L + Math.sin(t * 0.8 + g.ph) * 2 * u, c = Math.cos(w.tilt), sn = Math.sin(w.tilt);
    return [w.x + f * (lx * c - ly * sn), y0 + lx * sn + ly * c];
  }
  function drawShipLantern(g, k) {
    if (!scene.ground.includes(g.wreck)) return;
    const [x, y] = lanternPos(g), L = g.wreck.w;
    if (k) { g.lit = w12Ease(g.lit, g.on ? 1 : 0, k, 0.04); if (!g.on) w13Tip(g, x, y); }
    if (g.lit > 0.01) {
      const fl = 0.85 + 0.15 * Math.sin(t * 11) * Math.sin(t * 7.3), R = L * 0.45 * (0.8 + 0.4 * night);
      ctx.save(); ctx.globalCompositeOperation = "lighter";
      const gr = ctx.createRadialGradient(x, y, 0, x, y, R); gr.addColorStop(0, `rgba(255,180,90,${0.35 * g.lit * fl})`); gr.addColorStop(1, "rgba(255,180,90,0)");
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
      ctx.restore();
      // coins glinting inside the hull
      for (let i = 0; i < 5; i++) {
        const cx = g.wreck.x + (i - 2) * L * 0.07, cy = sandY(cx) - L * 0.06 - (i % 2) * L * 0.025, tw = Math.max(0, Math.sin(t * 2 + i * 1.7)) ** 4;
        if (tw > 0.1) star(cx, cy, 5 * u * tw * g.lit + 1, `rgba(255,236,170,${tw * g.lit})`);
      }
    }
    ctx.strokeStyle = sh("#3a2c20"); ctx.lineWidth = Math.max(1, u); ctx.beginPath(); ctx.moveTo(x, y - 14 * u); ctx.lineTo(x, y - 8 * u); ctx.stroke();
    ctx.fillStyle = sh("#2a2420"); ctx.fillRect(x - 6 * u, y - 9 * u, 12 * u, 3 * u); ctx.fillRect(x - 5 * u, y + 6 * u, 10 * u, 3 * u);
    ctx.fillStyle = g.lit > 0.05 ? `rgba(255,${200 + 30 * Math.sin(t * 9)},120,${0.5 + 0.5 * g.lit})` : sh("#5a6a6a", 0.1);
    ctx.fillRect(x - 4.5 * u, y - 6 * u, 9 * u, 12 * u);
    ctx.strokeStyle = sh("#2a2420"); ctx.beginPath(); ctx.moveTo(x, y - 6 * u); ctx.lineTo(x, y + 6 * u); ctx.stroke();
  }

  // Effects that belong to no single find: rings of sound, a spout of water, a darting octopus, and the cave shaking.
  function drawW13Fx(g, k) {
    if (g.shake > 0 && k) {
      g.shake -= k / 60;
      const amp = Math.min(1, g.shake) * 5;
      canvas.style.transform = amp > 0.1 && !reduceMotion ? `translate(${(Math.random() - 0.5) * amp}px,${(Math.random() - 0.5) * amp}px)` : "";
      if (Math.random() < 0.6 * k) g.fx.push({ type: "pebble", x: Math.random() * W, y: water.cave ? H * 0.12 : -10 * u, vy: 0, r: (1.5 + Math.random() * 2.5) * u, age: 0 });
      if (Math.random() < 0.3 * k) { const x = Math.random() * W; puff(x, sandY(x) + 4 * u, 2); }
      if (g.shake <= 0) canvas.style.transform = "";
    }
    g.fx = g.fx.filter(f => {
      if (k) f.age += k / 60;
      if (f.type === "rings") {
        for (let i = 0; i < 3; i++) {
          const a = f.age - i * 0.35; if (a <= 0 || a > 2.2) continue;
          ctx.strokeStyle = `rgba(255,236,190,${0.5 * (1 - a / 2.2)})`; ctx.lineWidth = 2 * u;
          ctx.beginPath(); ctx.arc(f.x, f.y, a * 160 * u, 0, TAU); ctx.stroke();
        }
        return f.age < 3;
      }
      if (f.type === "spout") {
        const h = Math.sin(Math.min(1, f.age / 1.2) * Math.PI) * 60 * u;
        ctx.fillStyle = "rgba(235,248,255,0.75)";
        ctx.beginPath(); ctx.moveTo(f.x - 10 * u, f.y); ctx.quadraticCurveTo(f.x - 4 * u, f.y - h * 0.6, f.x, f.y - h); ctx.quadraticCurveTo(f.x + 4 * u, f.y - h * 0.6, f.x + 10 * u, f.y); ctx.fill();
        for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.35, d = f.age * 50 * u; ctx.beginPath(); ctx.arc(f.x + Math.cos(a) * d, f.y - h * 0.8 + Math.sin(a) * d + f.age * f.age * 40 * u, 2 * u, 0, TAU); ctx.fill(); }
        return f.age < 1.4;
      }
      if (f.type === "pebble") {
        if (k) { f.vy += 0.12 * u * k; f.y += f.vy * k; }
        ctx.fillStyle = sh("#6a645a"); ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, TAU); ctx.fill();
        if (f.y > sandY(f.x)) { puff(f.x, sandY(f.x) + 3 * u, 1); return false; }
        return true;
      }
      if (f.type === "octo") {
        if (k) { f.x += f.vx * k; f.y += f.vy * k; f.vy *= 0.99; }
        ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(Math.atan2(f.vy, f.vx) + Math.PI / 2);
        ctx.fillStyle = sh("#c86a4a"); ctx.beginPath(); ctx.ellipse(0, -4 * u, 5 * u, 7 * u, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = sh("#c86a4a"); ctx.lineWidth = 1.5 * u; ctx.beginPath();
        for (let i = -2; i <= 2; i++) { ctx.moveTo(i * 1.5 * u, 2 * u); ctx.lineTo(i * 2.2 * u + Math.sin(f.age * 12 + i) * u, 11 * u); }
        ctx.stroke(); ctx.restore();
        return f.age < 6 && f.x > -40 * u && f.x < W + 40 * u && f.y > -40 * u;
      }
      return false;
    });
  }

  // The self-test plays with everything once, in every water: each tap, then a second of frames.
  function checkPlay(errors) {
    const keys = ["bell", "wheel", "phonebox", "helmet", "mine", "idol", "lobsterpot", "wreck", ...W13_KEYS, "shiplantern"];
    WATERS.forEach((w, wi) => {
      try {
        aquarium = { water: wi, set: new Set(keys), shiny: false };
        newVariant(4242 + wi, false);
        diverMode = true;
        const S = scene;
        for (const k of keys) if (!S.ground.some(g => g.kind === k) && !(W13_FLOAT.has(k) && !water.surface) && k !== "shiplantern") errors.push(`spelen in ${w.name}: ${k} ontbreekt`);
        for (const g of S.ground.slice()) {
          if (g.kind === "camera") { g.taken = true; g.flash = 1; continue; }
          if (g.kind === "sealock") { for (const sg of g.order.slice()) ACT.sealock(g, g.tiles.indexOf(sg)); if (!g.done) errors.push(`spelen in ${w.name}: het zeeslot gaat niet open`); continue; }
          const spots = w13Spots(g);
          if (!spots.length) continue;
          diver.x = spots[0][0]; diver.y = spots[0][1];
          if (!tapWave13(spots[0][0], spots[0][1])) errors.push(`spelen in ${w.name}: tik op ${g.kind} doet niets`);
          if (g.kind === "phonebox") tapWave13(spots[0][0], spots[0][1]);
        }
        const turtle = S.ground.find(g => g.kind === "netturtle");
        for (let i = 0; i < 70; i++) { if (turtle) { diver.x = turtle.x; diver.y = sandY(turtle.x) - turtle.s * 0.45; } frame(last + 33, true); }
        if (turtle && !turtle.free) errors.push(`spelen in ${w.name}: de schildpad komt niet vrij`);
      } catch (e) { errors.push(`spelen in ${w.name}: ${e.message}`); }
    });
    canvas.style.transform = "";
    aquarium = null; diverMode = false;
  }

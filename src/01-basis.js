  const canvas = document.getElementById("c");
  let ctx = canvas.getContext("2d");
  const seedEl = document.querySelector("#seed b");
  const biomeEl = document.getElementById("biome");
  const rareEl = document.getElementById("rare");
  const soundBtn = document.getElementById("sound");
  const clockEl = document.getElementById("clock");
  const welcomeEl = document.getElementById("welcome");
  const diverBtn = document.getElementById("diver");
  const photoBtn = document.getElementById("photo");
  const menuBtn = document.getElementById("menu");
  const bookBtn = document.getElementById("book");
  const bookDot = document.getElementById("bookDot");
  const toastEl = document.getElementById("toast");
  const panelEl = document.getElementById("panel");
  const panelBody = document.getElementById("panelBody");
  const panelTitle = document.getElementById("panelTitle");
  const toolbarEl = document.querySelector(".toolbar");
  const hudBtn = document.getElementById("hud");
  const sceneDescEl = document.getElementById("sceneDesc");
  // inside a claude.ai artifact the page cannot use its own address for sharing
  const IN_ARTIFACT = !!(window.claude && typeof window.claude.use === "function");
  // a short buzz on phones that support it
  function buzz(pattern) { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} }
  const photoView = document.getElementById("photoView");
  const polaroidImg = document.getElementById("polaroid");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;

  // The waters. Each lists its colours and how likely every landmark is to appear; which animals live there
  // and which visitors pass by comes from the animals themselves (00-animals.js).
  const WATERS = [
    { name: "rif", top: "#3aaab6", mid: "#14678a", bottom: "#0a2a45", tintK: 0.12,
      ray: "230,255,248", rayA: 0.11, snow: "220,245,240",
      sand: ["#d3c193", "#7d6f50"], rock: "#6b6656",
      kelp: ["#2e6e4c", "#3f8a57", "#24573f"],
      fish: [["#f2b134", "#8a5810"], ["#ef6f5e", "#7d2b22"], ["#e7eef0", "#6f818a"], ["#7fd8c9", "#2d6f66"], ["#3e6fd1", "#16306b"], ["#f4d24a", "#3a3a3a"]],
      jelly: ["255,196,224", "255,232,200"], glow: false, whale: "8,38,62", surface: true,
      props: { amphora: 0.25, anchor: 0.5, anemone: 0.95, arch: 0.45, bell: 0.2, bottle: 0.5, cannon: 0.45, canyon: 0.3, car: 0.15, chest: 0.75, city: 0.15, clam: 0.7, coral: 1, helmet: 0.4, idol: 0.12, mine: 0.2, phonebox: 0.05, plane: 0.3, rocks: 0.6, ruins: 0.3, seagrass: 0.5, skull: 0.35, sponges: 0.6, statue: 0.3, wheel: 0.25, wreck: 0.8 },
      visitors: ["sub"] },
    { name: "diepzee", top: "#143e68", mid: "#081a33", bottom: "#02050c", tintK: 0.5,
      ray: "150,200,255", rayA: 0.05, snow: "170,210,255",
      sand: ["#2a3846", "#0a1118"], rock: "#1a242e",
      kelp: ["#123c3f", "#0f3134", "#18484a"],
      fish: [["#9cc3e6", "#3a5a7a"], ["#cfdbe6", "#5a6a7a"], ["#5e86b8", "#203a5c"], ["#e0a96d", "#6b4320"]],
      jelly: ["120,240,255", "255,120,220", "180,150,255"], glow: true, whale: "2,8,18", giantSquid: true,
      props: { amphora: 0.2, anchor: 0.4, arch: 0.6, bell: 0.25, bottle: 0.3, brine: 0.5, cannon: 0.4, canyon: 0.5, car: 0.05, chest: 0.65, city: 0.1, helmet: 0.4, idol: 0.15, mine: 0.4, plane: 0.3, rocks: 0.7, ruins: 0.4, skull: 0.7, sponges: 0.4, statue: 0.45, vent: 0.95, volcano: 0.45, wheel: 0.2, wreck: 0.85 },
      visitors: ["sub", "sub"] },
    { name: "noordzee", top: "#64a096", mid: "#2f6566", bottom: "#0e2a2d", tintK: 0.28,
      ray: "235,250,230", rayA: 0.09, snow: "225,235,220",
      sand: ["#959076", "#4a4738"], rock: "#4a4d42",
      kelp: ["#4a6a30", "#5b7a35", "#39552a"],
      fish: [["#c9d6d2", "#5f716d"], ["#a4b9b4", "#45584f"], ["#e2b47e", "#7a5530"], ["#8fa7b8", "#3c5260"]],
      jelly: ["240,220,200", "220,235,255"], glow: false, whale: "12,38,40", surface: true,
      props: { amphora: 0.15, anchor: 0.75, anemone: 0.3, arch: 0.5, bell: 0.4, bottle: 0.6, brine: 0.2, cannon: 0.65, canyon: 0.3, car: 0.3, chest: 0.5, city: 0.3, helmet: 0.5, mine: 0.6, phonebox: 0.2, plane: 0.4, rocks: 0.9, ruins: 0.4, seagrass: 0.4, skull: 0.45, sponges: 0.2, statue: 0.25, wheel: 0.35, wreck: 0.85 },
      visitors: ["sub"] },
    { name: "kelpwoud", top: "#5aa58a", mid: "#1f5a50", bottom: "#0a2624", tintK: 0.25,
      ray: "235,255,220", rayA: 0.12, snow: "225,240,215",
      sand: ["#8f8a6a", "#46432f"], rock: "#3f463a",
      kelp: ["#7a6f2a", "#8a7d33", "#5f5a22", "#6d7a2c"],
      fish: [["#c9a46a", "#5f4a2a"], ["#e88a3a", "#6b3a14"], ["#a9b8b0", "#4a5a52"], ["#3f5f7a", "#1a2c3a"]],
      jelly: ["255,215,170", "235,225,255"], glow: false, whale: "10,36,34",
      surface: true, denseKelp: true,
      props: { amphora: 0.15, anchor: 0.5, arch: 0.5, bell: 0.3, bottle: 0.4, cannon: 0.3, canyon: 0.25, car: 0.2, chest: 0.45, city: 0.2, helmet: 0.5, mine: 0.35, phonebox: 0.1, plane: 0.3, rocks: 0.9, seagrass: 0.3, skull: 0.3, sponges: 0.3, statue: 0.2, wheel: 0.25, wreck: 0.5 },
      visitors: ["sub"] },
    { name: "ijszee", poles: true, top: "#86bfd0", mid: "#2b5e7a", bottom: "#0a2236", tintK: 0.25,
      ray: "235,248,255", rayA: 0.12, snow: "235,245,255",
      sand: ["#7d8a90", "#3a4448"], rock: "#4a555c",
      kelp: ["#5d7a66", "#4f6b5a", "#6b8a70"],
      fish: [["#c7d2d8", "#5a6870"], ["#9fb0bc", "#3e4c56"], ["#d9c8a6", "#6a5a3c"]],
      jelly: ["220,240,255", "255,225,240"], glow: false, whale: "12,34,50",
      surface: true, ice: true, fewKelp: true,
      props: { amphora: 0.05, anchor: 0.5, arch: 0.5, bell: 0.35, bottle: 0.3, brine: 0.25, cannon: 0.3, canyon: 0.35, car: 0.1, chest: 0.3, helmet: 0.4, mine: 0.5, plane: 0.3, rocks: 1, skull: 0.3, sponges: 0.3, volcano: 0.1, wheel: 0.3, wreck: 0.55 },
      visitors: ["sub"] },
    { name: "mangrove", top: "#7fa66a", mid: "#3b5e3c", bottom: "#16271a", tintK: 0.3,
      ray: "245,255,220", rayA: 0.13, snow: "220,230,190",
      sand: ["#7a6a4a", "#3a3020"], rock: "#4a4434",
      kelp: ["#5c7a34", "#6d8a3a", "#4a6a2c"],
      fish: [["#e8d070", "#6a5a20"], ["#9ab8c8", "#3a5868"], ["#f08a4a", "#6a3414"], ["#c8c8b0", "#5a5a48"]],
      jelly: ["240,220,170", "220,240,200"], glow: false, whale: "20,40,24",
      surface: true, mangrove: true, fewKelp: true,
      props: { amphora: 0.2, anchor: 0.4, arch: 0.2, bell: 0.25, bottle: 0.6, cannon: 0.2, car: 0.35, chest: 0.5, helmet: 0.3, idol: 0.1, phonebox: 0.1, plane: 0.15, rocks: 0.6, seagrass: 0.9, skull: 0.4, sponges: 0.3, wheel: 0.2, wreck: 0.3 },
      visitors: [] },
    { name: "grot", top: "#1f4f63", mid: "#0c2433", bottom: "#03080e", tintK: 0.45,
      ray: "200,240,255", rayA: 0.2, snow: "190,220,235",
      sand: ["#4a4a46", "#161816"], rock: "#2a2e30",
      kelp: ["#1f3a3a", "#244444"],
      fish: [["#e8e4dc", "#8a847a"], ["#c8d4dc", "#5a6a74"], ["#9cc3e6", "#3a5a7a"]],
      jelly: ["170,230,255", "210,190,255"], glow: true, whale: "4,10,16",
      surface: false, cave: true, fewKelp: true,
      props: { amphora: 0.7, anchor: 0.3, arch: 0.3, bell: 0.3, bottle: 0.2, brine: 0.2, canyon: 0.35, chest: 0.7, helmet: 0.6, idol: 0.35, rocks: 1, ruins: 0.5, skull: 0.7, sponges: 0.5, statue: 0.35, vent: 0.2, wheel: 0.3, wreck: 0.2 },
      visitors: ["sub"] },
    { name: "lagune", top: "#9af0ee", mid: "#3cc4cc", bottom: "#127080", tintK: 0.06,
      ray: "255,255,235", rayA: 0.14, snow: "235,255,250",
      sand: ["#f0e6c8", "#b8a87a"], rock: "#9a9a88",
      kelp: ["#5aa04a", "#6ab058", "#4a8a3e"],
      fish: [["#f2d24a", "#6a5a10"], ["#4ad0e0", "#1a6070"], ["#f07ab0", "#7a2a54"], ["#8ae06a", "#2a6a1a"], ["#ffffff", "#7a8a90"]],
      jelly: ["255,240,220", "220,250,255"], glow: false, whale: "20,70,80",
      surface: true, caustics: true, fewKelp: true,
      props: { amphora: 0.15, anchor: 0.3, anemone: 0.7, bottle: 0.6, car: 0.1, chest: 0.4, clam: 0.6, coral: 0.6, idol: 0.15, phonebox: 0.15, rocks: 0.5, seagrass: 1, skull: 0.2, sponges: 0.5, wheel: 0.2 },
      visitors: [] },
    { name: "sargasso", top: "#2f7fb8", mid: "#0f3f72", bottom: "#04142a", tintK: 0.3,
      ray: "220,240,255", rayA: 0.12, snow: "200,225,245",
      sand: ["#5a6a78", "#1a2430"], rock: "#2e3844",
      kelp: ["#8a7a2a", "#9a8a34"],
      fish: [["#9ac0e0", "#3a5a7a"], ["#d8e4ee", "#5a6a7a"], ["#f2c040", "#6a5010"]],
      jelly: ["200,230,255", "255,210,240"], glow: false, whale: "6,24,48",
      surface: true, sargasso: true, fewKelp: true,
      props: { anchor: 0.4, bell: 0.3, bottle: 0.7, canyon: 0.4, chest: 0.4, helmet: 0.3, idol: 0.1, mine: 0.3, phonebox: 0.1, plane: 0.3, rocks: 0.5, skull: 0.4, wheel: 0.4, wreck: 0.5 },
      visitors: [] },
    // The Wadden Sea: shallow, cool and murky with sand and silt, flat as a table (no abyss), with sandbanks near the top.
    // It came after the first nine: only seeds from WADDEN_SEED up are Wadden Sea, so every older link stays the same.
    { name: "wadden", top: "#9cb2a2", mid: "#5a7466", bottom: "#28382e", tintK: 0.32,
      ray: "240,245,225", rayA: 0.07, snow: "215,212,190",
      sand: ["#aa9e80", "#5a5240"], rock: "#5c5a4e",
      kelp: ["#6a7a3a", "#7a8a42", "#556a30"],
      fish: [["#c8d0cc", "#5a6a66"], ["#b8b090", "#5a5440"], ["#d0d8d8", "#6a7478"]],
      jelly: ["240,230,210", "225,235,250"], glow: false, whale: "18,34,30",
      surface: true, mudflat: true, fewKelp: true,
      props: { anchor: 0.45, bell: 0.2, bottle: 0.6, cannon: 0.15, chest: 0.25, helmet: 0.2, mine: 0.25, rocks: 0.3, seagrass: 0.6, skull: 0.1, wheel: 0.3, wreck: 0.3 },
      visitors: [] },
  ];
  // How the water of an ocean is chosen: the first roll of a seed picks one of the first nine waters, as it always did.
  // Seeds from WADDEN_SEED up (randomSeed gives them about one time in eleven) are the Wadden Sea.
  const FIRST_WATERS = 9, WADDEN_SEED = 1e9, SEED_RANGE = 1.1e9;
  const waterOfSeed = (sd, firstRoll) => sd >= WADDEN_SEED ? WATERS.findIndex(w => w.name === "wadden") : Math.floor(firstRoll * FIRST_WATERS);
  for (const w of WATERS) w.life = {};
  for (const [key, a] of Object.entries(ANIMALS)) {
    for (const w of WATERS) {
      if (a.life && a.life[w.name]) w.life[key] = a.life[w.name];
      if (a.visits && a.visits[w.name]) for (let i = 0; i < a.visits[w.name]; i++) w.visitors.push(key);
    }
  }

  // Everything the aquarium can switch on, and everything the logbook can record.
  const PROP_KEYS = ["wreck", "plane", "chest", "anchor", "cannon", "ruins", "statue", "city", "arch", "helmet", "mine", "bottle", "skull", "coral", "anemone", "vent", "volcano", "brine", "rocks", "canyon", "amphora", "car", "bell", "clam", "seagrass", "wheel", "idol", "phonebox", "sponges"];
  const LIFE_KEYS = Object.keys(ANIMALS).filter(k => ANIMALS[k].life);
  const VIS_KEYS = [...Object.keys(ANIMALS).filter(k => ANIMALS[k].visits), "sub"];
  const RARE_KEYS = ["mermaid", "kraken", "ghost", "whalefall", "serpent", "megalodon", "goldpearl", "mobydick", "ghostdiver", "ghostsub", "leviathan", "lighthouse"];
  // An aquarium code has one bit per key, in this order. Keys only ever go at the end, so codes stay readable.
  // A new animal that lives somewhere or visits goes at the end of AQ_BASE by hand (the self-test checks it), so its bit
  // never moves, wherever its record stands in 00-animals.js.
  const AQ_BASE = ["wreck", "plane", "chest", "anchor", "cannon", "ruins", "statue", "city", "arch", "helmet", "mine", "bottle", "skull", "coral", "anemone", "vent", "volcano", "brine", "rocks", "canyon", "crab", "starfish", "urchin", "octopus", "ray", "eels", "seahorse", "puffer", "angler", "moray", "squid", "hermit", "slugs", "comb", "lantern", "otters", "seal", "penguins", "mantis", "archer", "cleaners", "flyingfish", "whale", "humpback", "shark", "turtle", "manta", "dolphins", "swordfish", "sub", "narwhal", "mermaid", "kraken", "ghost", "whalefall", "amphora", "car", "bell", "clam", "seagrass", "cassiopea", "lionfish", "cuttlefish", "lobster", "nautilus", "isopod", "seadragon", "manatee", "orca", "hammerhead", "sunfish", "beluga", "serpent", "megalodon", "goldpearl", "wheel", "idol", "phonebox", "sponges", "parrotfish", "boxfish", "pistol", "sargassumfish", "spidercrab", "crocodile", "whaleshark", "sealion", "eagleray", "spermwhale", "aurora", "mobydick", "ghostdiver", "triggerfish", "wrasse", "surgeonfish", "mandarinfish", "frogfish", "scorpionfish", "stonefish", "blenny", "goby", "needlefish", "electricray", "guitarfish", "sanddollar", "brittlestar", "seacucumber", "featherstar", "seasnake", "seakrait", "iguana", "albatross", "cormorant", "pelican", "walrus", "polarbear", "thresher", "whitetip", "greatwhite", "marlin", "tuna", "barracuda", "coelacanth", "sawfish", "bluewhale", "finwhale", "pilotwhale", "falsekiller", "ghostsub", "xmastree", "coconut", "moorish", "angelfish", "crownthorns", "hawksbill", "horseshoe", "dugong", "mudskipper", "puffin", "gannet", "porpoise", "flatfish", "cod", "wolffish", "garibaldi", "leopardshark", "manowar", "glaucus", "icefish", "leopardseal", "krill", "vampire", "dumbo", "viperfish", "gulper", "hatchet", "herring", "greenland", "leatherback", "leviathan", "lighthouse",
    "lugworm", "cockle", "shrimp", "eider",
    "sandeel", "compass", "loggerhead", "cavefish", "tripodfish", "polarcod"];
  const AQ_ALL = [...AQ_BASE, ...Object.keys(ANIMALS).filter(k => (ANIMALS[k].life || ANIMALS[k].visits) && !AQ_BASE.includes(k))];
  // Keys that can no longer be chosen in the aquarium: animals taken out of the game, and the northern lights,
  // which became an ordinary weather moment. They keep their place in AQ_BASE.
  const RETIRED = new Set(["whale", "shark", "frogfish", "blenny", "aurora"]);
  // Only a few oceans hold something rare, and every rare thing has its own waters.
  const RARE_RATE = 0.15;
  const RARES_BY_WATER = {
    rif: ["mermaid", "goldpearl"], lagune: ["goldpearl", "mermaid"], diepzee: ["kraken", "megalodon", "whalefall", "ghostsub", "leviathan"],
    noordzee: ["ghost", "ghostdiver", "ghostsub", "lighthouse"], kelpwoud: ["mermaid", "serpent", "lighthouse"], ijszee: ["mobydick", "ghostsub", "lighthouse"],
    mangrove: ["serpent"], grot: ["ghostdiver", "kraken"], sargasso: ["ghost", "mobydick", "megalodon", "whalefall", "leviathan"],
    wadden: ["lighthouse", "ghost"],
  };
  const MOMENT_KEYS = ["giant", "baitball", "spawning", "coralspawn", "storm", "eruption", "task", "jellybloom", "glowtide", "hatchlings", "whalesong",
    "eelmigration", "quake", "crabmarch", "bubblerings", "ghostnet", "waterspout", "whirlpool", "sardinerun", "meteor", "eclipse"];
  // names of the waters, finds, moments and rare things; the animals bring their own
  const NAMES = {
    "w:rif": "Koraalrif", "w:diepzee": "Diepzee", "w:noordzee": "Noordzee", "w:kelpwoud": "Kelpwoud",
    "w:ijszee": "IJszee", "w:mangrove": "Mangrove", "w:grot": "Onderwatergrot", "w:lagune": "Lagune",
    "w:sargasso": "Sargassozee", "w:wadden": "Waddenzee", wreck: "Piratenwrak", plane: "Vliegtuigwrak", chest: "Schatkist",
    anchor: "Anker", cannon: "Kanon", ruins: "Zuilen", statue: "Atlantis",
    city: "Gezonken stad", arch: "Rotsboog", helmet: "Duikerhelm", mine: "Zeemijn",
    bottle: "Flessenpost", skull: "Doodshoofd", vent: "Heetwaterbron", volcano: "Onderzeese vulkaan",
    brine: "Pekelmeer", rocks: "Rotsblokken", canyon: "Afgrond", amphora: "Amforen",
    car: "Gezonken auto", bell: "Scheepsbel", seagrass: "Zeegrasveld", wheel: "Scheepsroer",
    idol: "Gouden beeldje", phonebox: "Telefooncel", aurora: "Noorderlicht", baitball: "Bait-ball",
    bubblerings: "Bellenringen", coralspawn: "Koraalpaai", crabmarch: "Krabbentrek", eclipse: "Maansverduistering",
    eelmigration: "Palingtrek", eruption: "Vulkaanuitbarsting", ghostnet: "Spooknet", glowtide: "Zeevonken",
    hatchlings: "Babyschildpadjes", jellybloom: "Kwallenzwerm", meteor: "Vallende sterren", quake: "Zeebeving",
    sardinerun: "Sardinetrek", spawning: "Paaiende vissen", storm: "Onweer", sub: "Duikboot",
    task: "Alle zeepaardjes gevonden", treasure: "Opgegraven schat", waterspout: "Waterhoos", whalesong: "Walvisgezang",
    whirlpool: "Draaikolk", mermaid: "Zeemeermin", kraken: "Kraken", ghost: "Spookschip",
    whalefall: "Walvisval", serpent: "Zeeslang", megalodon: "Megalodon", goldpearl: "Gouden parel",
    mobydick: "Witte potvis", ghostdiver: "Spookduiker", ghostsub: "Spookonderzeeër", leviathan: "Leviathan",
    lighthouse: "Spookvuurtoren",
  };
  const NAMES_EN = {
    "w:rif": "Coral reef", "w:diepzee": "Deep sea", "w:noordzee": "North Sea", "w:kelpwoud": "Kelp forest",
    "w:ijszee": "Polar sea", "w:mangrove": "Mangrove", "w:grot": "Underwater cave", "w:lagune": "Lagoon",
    "w:sargasso": "Sargasso Sea", "w:wadden": "Wadden Sea", wreck: "Pirate wreck", plane: "Plane wreck", chest: "Treasure chest",
    anchor: "Anchor", cannon: "Cannon", ruins: "Columns", statue: "Atlantis",
    city: "Sunken town", arch: "Rock arch", helmet: "Diving helmet", mine: "Sea mine",
    bottle: "Message in a bottle", skull: "Skull", vent: "Hydrothermal vent", volcano: "Undersea volcano",
    brine: "Brine pool", rocks: "Boulders", canyon: "Abyss", amphora: "Amphorae",
    car: "Sunken car", bell: "Ship's bell", seagrass: "Seagrass meadow", wheel: "Ship's wheel",
    idol: "Golden idol", phonebox: "Phone box", aurora: "Northern lights", baitball: "Bait ball",
    bubblerings: "Bubble rings", coralspawn: "Coral spawning", crabmarch: "Crab march", eclipse: "Lunar eclipse",
    eelmigration: "Eel migration", eruption: "Volcanic eruption", ghostnet: "Ghost net", glowtide: "Sea sparkle",
    hatchlings: "Turtle hatchlings", jellybloom: "Jellyfish swarm", meteor: "Shooting stars", quake: "Seaquake",
    sardinerun: "Sardine run", spawning: "Spawning fish", storm: "Thunderstorm", sub: "Submarine",
    task: "All seahorses found", treasure: "Dug-up treasure", waterspout: "Waterspout", whalesong: "Whale song",
    whirlpool: "Whirlpool", mermaid: "Mermaid", kraken: "Kraken", ghost: "Ghost ship",
    whalefall: "Whale fall", serpent: "Sea serpent", megalodon: "Megalodon", goldpearl: "Golden pearl",
    mobydick: "White sperm whale", ghostdiver: "Ghost diver", ghostsub: "Ghost submarine", leviathan: "Leviathan",
    lighthouse: "Ghost lighthouse",
  };
  Object.assign(NAMES, animalTable("nl"));
  Object.assign(NAMES_EN, animalTable("en"));
  // The logbook in a sensible order: each group is split into small families. The animals come in the order of 00-animals.js.
  const LOG_SUBS = {
    "Wateren": [
      ["Warm en ondiep", "Warm and shallow", ["w:lagune", "w:rif", "w:mangrove"]],
      ["Koel en open", "Cool and open", ["w:wadden", "w:kelpwoud", "w:noordzee", "w:sargasso"]],
      ["Koud en donker", "Cold and dark", ["w:ijszee", "w:grot", "w:diepzee"]],
    ],
    "Dieren": FAMILIES.map(([nl, en]) => [nl, en, Object.keys(ANIMALS).filter(k => ANIMALS[k].family === nl)]),
    "Momenten": [
      ["Weer en aarde", "Weather and earth", ["storm", "waterspout", "quake", "eruption", "whirlpool", "glowtide", "meteor", "eclipse", "aurora"]],
      ["Paaien en trekken", "Spawning and migration", ["coralspawn", "spawning", "jellybloom", "eelmigration", "crabmarch", "hatchlings", "sardinerun"]],
      ["Dieren in actie", "Animals in action", ["baitball", "whalesong", "bubblerings"]],
      ["Speurtochten", "Quests", ["treasure", "task"]],
      ["Mensen op zee", "People at sea", ["sub", "ghostnet"]],
    ],
    "Zeldzaam": [
      ["Legendes", "Legends", ["mermaid", "serpent", "kraken", "megalodon", "mobydick", "leviathan"]],
      ["Spoken", "Ghosts", ["ghost", "ghostdiver", "ghostsub", "lighthouse"]],
      ["Wonderen", "Wonders", ["goldpearl", "whalefall"]],
    ],
  };
  const LOG_ALL = {
    "Wateren": WATERS.map(w => "w:" + w.name),
    "Dieren": Object.keys(ANIMALS),
    "Momenten": [...MOMENT_KEYS.filter(k => k !== "giant"), "treasure", "sub", "aurora"],
    "Zeldzaam": RARE_KEYS,
  };
  // anything not placed in a family yet still shows, at the end of its group
  for (const title in LOG_ALL) {
    const placed = new Set(LOG_SUBS[title].flatMap(s => s[2]));
    const rest = LOG_ALL[title].filter(k => !placed.has(k));
    if (rest.length) LOG_SUBS[title].push(["Overig", "Other", rest]);
  }
  const LOG_GROUPS = Object.keys(LOG_SUBS).map(title => [title, LOG_SUBS[title].flatMap(s => s[2]), LOG_SUBS[title]]);

  // Shinies are rare colour variants with their own page in the logbook. The odds are set per kind of animal:
  // where there are hundreds (school fish) each one has a small chance, where there is one (a whale) the chance is bigger,
  // so that every kind of shiny turns up about as often. The animals bring their own odds; these are the moments and rare things.
  const SHINY_OTHER = {
    hatchlings: 150, eelmigration: 600, kraken: 50, ghost: 50, whalefall: 50, serpent: 50, megalodon: 50,
    goldpearl: 50, mobydick: 50, ghostdiver: 50, ghostsub: 50, leviathan: 50, lighthouse: 50, mermaid: 225,
    // the moments with animals: one roll when the moment starts (see momentShiny in 10-shiny.js)
    coralspawn: 40, spawning: 40, jellybloom: 40, crabmarch: 40, sardinerun: 40, baitball: 40, whalesong: 40, bubblerings: 40,
  };
  const SHINY_N = Object.assign({}, SHINY_OTHER, animalTable("shiny"));
  // Calendar events: a few days a year the ocean is a little different, for everyone on that date. They only change
  // chances (from their own random stream), never what can be found, so the logbook can always be completed.
  //   from, to   "MM-DD", inclusive; a range over New Year wraps round
  //   rare       for oceans without anything rare: the chance of one of these rare things, if they belong to that water
  //   aurora     northern lights over every water with a surface
  //   shiny      shinies this many times as often
  const EVENTS = [
    { id: "spookweek", from: "10-24", to: "11-02", nl: "Spookweek", en: "Ghost week", rare: { chance: 0.3, keys: ["ghost", "ghostdiver", "ghostsub", "lighthouse"] },
      say: ["Het is spookweek: de spoken in de oceaan zijn onrustig. Spookschepen, spookduikers en de spookvuurtoren laten zich vaker zien.", "It is ghost week: the ghosts of the ocean are restless. Ghost ships, ghost divers and the ghost lighthouse show up more often."] },
    { id: "winterlicht", from: "12-15", to: "01-06", nl: "Winterlicht", en: "Winter lights", aurora: true,
      say: ["Het is winterlicht: op donkere nachten kan het noorderlicht nu boven elk water verschijnen.", "Winter lights: on dark nights the northern lights can now appear over every water."] },
    { id: "oceaandag", from: "06-08", to: "06-08", nl: "Dag van de Oceaan", en: "World Ocean Day", shiny: 2,
      say: ["Vandaag is het de Dag van de Oceaan: shiny's zijn de hele dag twee keer zo vaak.", "Today is World Ocean Day: shinies are twice as common all day."] },
  ];
  let forceEvent = null; // the self-test tries every event
  function activeEvent() {
    if (selfTesting) return forceEvent;
    const d = new Date(), md = `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return EVENTS.find(e => e.from <= e.to ? md >= e.from && md <= e.to : md >= e.from || md <= e.to) || null;
  }

  // The glitter meter: every ocean of your own (not a shared link, not an aquarium) without a new shiny makes shinies
  // a little more likely, up to three times as often after 40 oceans; a new shiny empties it again. It is personal:
  // a shared ocean shows its usual shinies, and the boost is fixed per ocean, so turning the phone changes nothing.
  const GLINT_KEY = "oceaan-glinster", GLINT_MAX = 40;
  let oceanBoost = 1, personalOcean = false;
  const glintBoost = () => 1 + Math.min(store.get(GLINT_KEY, 0), GLINT_MAX) * 0.05;
  // in an aquarium with "Everything shiny" every animal is shiny (those do not count for the logbook)
  const shinyChance = key => aquarium && aquarium.shiny ? 1 : Math.min(1, (selfTesting ? 1 : oceanBoost) / (SHINY_N[key] || 200));
  const SHINY_KEYS = [...Object.keys(ANIMALS).filter(k => ANIMALS[k].shiny), ...Object.keys(SHINY_OTHER)];
  const SHINY_NAMES = Object.assign({"hatchlings": "babyschildpadje", "eelmigration": "glasaaltje"}, animalTable("shinyNl"));
  const SHINY_NAMES_EN = Object.assign({"hatchlings": "turtle hatchling", "eelmigration": "glass eel"}, animalTable("shinyEn"));
  // names that start with a proper noun keep their capital ("Shiny Groenlandse haai")
  const shinyLower = (key, name, lang) => ((ANIMALS[key] || {}).capital || []).includes(lang) ? name : name.toLowerCase();
  for (const k of SHINY_KEYS) NAMES["shiny:" + k] = "Shiny " + (SHINY_NAMES[k] || shinyLower(k, NAMES[k], "nl"));
  for (const k of SHINY_KEYS) NAMES_EN["shiny:" + k] = "Shiny " + (SHINY_NAMES_EN[k] || shinyLower(k, NAMES_EN[k], "en"));
  // the shinies follow the same order as the animals, visitors, moments and rare things
  {
    const subs = ["Dieren", "Momenten", "Zeldzaam"].map(title => {
      const order = LOG_SUBS[title].flatMap(s => s[2]).filter(k => SHINY_KEYS.includes(k));
      return [title, title, order.map(k => "shiny:" + k)];
    }).filter(s => s[2].length);
    const placed = new Set(subs.flatMap(s => s[2]));
    const rest = SHINY_KEYS.map(k => "shiny:" + k).filter(k => !placed.has(k));
    if (rest.length) subs.push(["Overig", "Other", rest]);
    LOG_GROUPS.push(["Shiny", subs.flatMap(s => s[2]), subs]);
  }
  const LOGGABLE = new Set(LOG_GROUPS.flatMap(g => g[1]));
  // Scientific names and field notes (Biologist reward) come only with animals.
  const SCI = animalTable("sci");
  const FIELD_NOTES = animalTable("note", 0), FIELD_NOTES_EN = animalTable("note", 1);

  const GROUP_EN = { "Wateren": "Waters", "Bodem en vondsten": "Seabed and finds", "Dieren": "Animals", "Bezoekers": "Visitors", "Momenten": "Moments", "Zeldzaam": "Rare", "Shiny": "Shiny" };
  const groupName = title => L(title, GROUP_EN[title] || title);
  const LOG_KEY = "oceaan-logboek";
  const LOUD = new Set([...VIS_KEYS, ...RARE_KEYS, ...MOMENT_KEYS, "treasure", ...SHINY_KEYS.map(k => "shiny:" + k)]);
  // The logbook remembers, for everything found, how often it was seen and the date of the first time.
  // Older logbooks were a plain list of names; those still load.
  function loadLog(raw) {
    const m = new Map();
    if (Array.isArray(raw)) { for (const k of raw) if (NAMES[k]) m.set(k, { n: 1, first: null }); }
    else if (raw && typeof raw === "object") {
      for (const k of Object.keys(raw)) {
        const v = raw[k];
        if (NAMES[k] && v && typeof v.n === "number" && v.n >= 1) m.set(k, { n: Math.floor(v.n), first: typeof v.first === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v.first) ? v.first : null });
      }
    }
    return m;
  }
  let logbook = new Map();
  try { logbook = loadLog(JSON.parse(localStorage.getItem(LOG_KEY) || "[]")); } catch (e) {}
  // The logbook matters more than photos: when the browser storage is full and the album is still in localStorage
  // (no IndexedDB), the oldest album photo makes room (see 17).
  function saveLog() {
    const data = JSON.stringify(Object.fromEntries(logbook));
    for (let tries = 0; tries < 30; tries++) {
      try { localStorage.setItem(LOG_KEY, data); return true; } catch (e) { if (!makeRoomInAlbum()) return false; }
    }
    return false;
  }

  let rebuilding = false;
  function seen(key, pos) {
    if (!NAMES[key] || rebuilding || !LOGGABLE.has(key)) return;
    questEvent("seen", key);
    const entry = logbook.get(key);
    if (entry) { entry.n++; saveLog(); return; }
    const before = reached();
    const d = new Date();
    logbook.set(key, { n: 1, first: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` });
    saveLog();
    fresh.add(key); saveFresh();
    if (key.startsWith("shiny:")) store.set(GLINT_KEY, 0);
    announceNew(key);
    huntFound(key);
    noteDiveFind(key);
    queueDiscovery(key, pos);
    if (panelEl.hidden || panelTab !== "log") bookDot.hidden = false;
    checkMilestones(before);
    if (!panelEl.hidden && panelTab === "log" && !detailOpen) renderPanel();
  }

  // Every new find gets a message; finds that come in together share one message, so none get lost.
  let newBatch = [], newTimer = null;
  function announceNew(key) {
    newBatch.push(nm(key));
    clearTimeout(newTimer);
    newTimer = setTimeout(() => {
      const names = newBatch;
      newBatch = [];
      if (!names.length) return;
      let list;
      if (names.length > 4) list = names.slice(0, 3).join(", ") + L(` en nog ${names.length - 3}`, ` and ${names.length - 3} more`);
      else if (names.length > 1) list = names.slice(0, -1).join(", ") + L(" en ", " and ") + names[names.length - 1];
      else list = names[0];
      toast(L("Nieuw in je logboek: ", "New in your logbook: ") + list, "new");
    }, 700);
  }

  // Milestones unlock small rewards: a coloured book, new fins and a golden tank for the diver.
  const BASE_LOG_KEYS = LOG_GROUPS.flatMap(g => g[1]).filter(k => !k.startsWith("shiny:"));
  const foundCount = () => BASE_LOG_KEYS.filter(k => logbook.has(k)).length;
  const shinyCount = () => SHINY_KEYS.filter(k => logbook.has("shiny:" + k)).length;
  // How long the wait for a new ocean is, depending on how many finds are in the logbook.
  const LOCK_STEPS = [[0, 150], [10, 75], [25, 30], [50, 15], [75, 7.5], [90, 5]];
  function lockSeconds() {
    const n = foundCount();
    if (n >= BASE_LOG_KEYS.length) return 1;
    let sec = 150;
    for (const [need, s] of LOCK_STEPS) if (n >= need) sec = s;
    return sec;
  }
  // "2,5 minuten", "1 minuut en 15 seconden", "7,5 seconden"
  const durationText = sec => {
    const num = v => LANG === "en" ? String(v) : String(v).replace(".", ",");
    if (sec < 60) return sec === 1 ? L("seconde", "second") : L(`${num(sec)} seconden`, `${num(sec)} seconds`);
    const m = Math.floor(sec / 60), r = sec % 60;
    if (!r) return m === 1 ? L("minuut", "minute") : L(`${m} minuten`, `${m} minutes`);
    if (r === 30) return L(`${num(m + 0.5)} minuten`, `${num(m + 0.5)} minutes`);
    return L(`${m === 1 ? "1 minuut" : m + " minuten"} en ${num(r)} seconden`, `${m === 1 ? "1 minute" : m + " minutes"} and ${num(r)} seconds`);
  };
  const groupKeys = title => (LOG_GROUPS.find(g => g[0] === title) || [0, []])[1];
  const groupHave = title => groupKeys(title).filter(k => logbook.has(k)).length;
  // Each milestone says how far along you are; the ones with a reward change something you can see.
  const tier = (id, nl, en, n, rewardNl, rewardEn) => ({ id, name: [nl, en], goal: [`${n} vondsten`, `${n} finds`], prog: () => [foundCount(), n], reward: rewardNl ? [rewardNl, rewardEn] : null });
  const shinyTier = (id, nl, en, n, rewardNl, rewardEn) => ({ id, name: [nl, en], goal: [n === 1 ? "1 shiny" : `${n} shiny's`, n === 1 ? "1 shiny" : `${n} shinies`], prog: () => [shinyCount(), n], reward: rewardNl ? [rewardNl, rewardEn] : null });
  const allOf = (id, nl, en, title, wordNl, wordEn, rewardNl, rewardEn) => ({ id, name: [nl, en], goal: [`alle ${groupKeys(title).length} ${wordNl}`, `all ${groupKeys(title).length} ${wordEn}`], prog: () => [groupHave(title), groupKeys(title).length], reward: rewardNl ? [rewardNl, rewardEn] : null });
  // every animal that lives in one water, for the water milestones
  const waterAnimals = name => { const w = WATERS.find(x => x.name === name); const dieren = groupKeys("Dieren"); return [...new Set([...Object.keys(w.life), ...w.visitors])].filter(k => dieren.includes(k)); };
  const rescued = () => store.get("oceaan-gered", 0);
  // wordNl and wordEn include the article: "de Noordzee", "het kelpwoud"; "the North Sea", "the kelp forest"
  const waterTier = (id, nl, en, name, wordNl, wordEn) => ({ id, name: [nl, en], goal: [`alle ${waterAnimals(name).length} dieren van ${wordNl}`, `all ${waterAnimals(name).length} animals of ${wordEn}`],
    prog: () => { const keys = waterAnimals(name); return [keys.filter(k => logbook.has(k)).length, keys.length]; }, reward: ["een sticker in je logboek", "a sticker in your logbook"] });
  // the photo tasks of the photo book (checked in 19-quests.js)
  const PHOTO_TASKS = [
    ["whale", "Een walvis of dolfijn en je duiker samen op één foto", "A whale or dolphin and your diver together in one photo"],
    ["shiny", "Een shiny op de foto", "A shiny in the photo"],
    ["lamp3", "Drie soorten tegelijk in je lamp", "Three kinds at once in your lamp"],
    ["freed", "Een dier dat je net hebt bevrijd", "An animal you have just set free"],
    ["bear", "De ijsbeer die in het water springt", "The polar bear jumping into the water"],
    ["sardine", "De sardinetrek", "The sardine run"],
    ["aurora", "Een foto onder het noorderlicht", "A photo under the northern lights"],
    ["leviathan", "De Leviathan in beeld", "The Leviathan in view"],
  ];
  const MILESTONES = [
    tier("m10", "Ontdekker", "Explorer", 10, "elke 75 seconden een nieuwe oceaan", "a new ocean every 75 seconds"),
    tier("m25", "Zeekenner", "Sea expert", 25, "elke 30 seconden een nieuwe oceaan", "a new ocean every 30 seconds"),
    tier("m50", "Oceanograaf", "Oceanographer", 50, "elke 15 seconden een nieuwe oceaan", "a new ocean every 15 seconds"),
    tier("m75", "Duikmeester", "Dive master", 75, "elke 7,5 seconden een nieuwe oceaan", "a new ocean every 7.5 seconds"),
    tier("m100", "Zeeheld", "Sea hero", 90, "gouden randjes in je logboek en elke 5 seconden een nieuwe oceaan", "golden edges in your logbook and a new ocean every 5 seconds"),
    // between 90 and everything: steps to keep going for
    tier("m110", "Rifwachter", "Reef keeper", 110),
    tier("m130", "Diepzeeverkenner", "Deep explorer", 130),
    tier("m150", "Levende encyclopedie", "Living encyclopedia", 150),
    { id: "mall", name: ["Meester van de zee", "Master of the sea"], goal: ["alles gevonden", "everything found"], prog: () => [foundCount(), BASE_LOG_KEYS.length], reward: ["elke seconde een nieuwe oceaan", "a new ocean every second"] },
    shinyTier("s1", "Eerste shiny", "First shiny", 1, "een belletje als er een shiny in beeld komt", "a little bell when a shiny comes into view"),
    shinyTier("s5", "Glinsterzoeker", "Sparkle seeker", 5),
    shinyTier("s15", "Shinyjager", "Shiny hunter", 15, "shiny's laten een glinsterend spoor achter", "shinies leave a glittering trail"),
    shinyTier("s30", "Shinyverzamelaar", "Shiny collector", 30, "een spoor van sterretjes achter je duiker", "a trail of stars behind your diver"),
    shinyTier("s50", "Glanskenner", "Shine connoisseur", 50),
    { id: "sall", name: ["Glimmende legende", "Shining legend"], goal: ["alle shiny's", "every shiny"], prog: () => [shinyCount(), SHINY_KEYS.length], reward: ["een gouden duikpak", "a golden diving suit"] },
    // whoever had all nine waters before the Wadden Sea came keeps this reward (see GLOBE_KEY below)
    Object.assign(allOf("gw", "Wereldreiziger", "Globetrotter", "Wateren", "wateren", "waters", "zelf het water kiezen: houd R of de nieuwe-oceaanknop ingedrukt", "choosing the water yourself: hold down R or the new-ocean button"),
      { prog: () => { const n = groupKeys("Wateren").length; return store.get(GLOBE_KEY, false) ? [n, n] : [groupHave("Wateren"), n]; } }),
    allOf("ga", "Bioloog", "Biologist", "Dieren", "dieren", "animals", "de wetenschappelijke naam en een extra veldnotitie bij elk dier in je logboek", "the scientific name and an extra field note for every animal in your logbook"),
    { id: "gv", name: ["Gastvrij", "Welcoming host"], goal: [`alle ${VIS_KEYS.length} bezoekers`, `all ${VIS_KEYS.length} visitors`], prog: () => [VIS_KEYS.filter(k => logbook.has(k)).length, VIS_KEYS.length], reward: ["een knop om een bezoeker te roepen (B)", "a button to call a visitor (B)"] },
    allOf("gm", "Oog voor het moment", "Moment catcher", "Momenten", "momenten", "moments", "een knop om een moment op te roepen (M)", "a button to call up a moment (M)"),
    allOf("gr", "Mythejager", "Myth hunter", "Zeldzaam", "zeldzame dingen", "rare things", "een pijl die altijd naar iets zeldzaams wijst", "an arrow that always points to something rare"),
    { id: "ph", name: ["Fotograaf", "Photographer"], goal: ["5 foto's in je album", "5 photos in your album"], prog: () => [typeof album === "undefined" ? 0 : album.length, 5], reward: ["fotofilters voor je camera", "photo filters for your camera"] },
    { id: "rd", name: ["Redder", "Rescuer"], goal: ["5 dieren uit een spooknet bevrijd", "5 animals freed from a ghost net"], prog: () => [rescued(), 5], reward: ["een sticker, en bevrijde dieren zwemmen eerst een bedankrondje om je duiker", "a sticker, and freed animals first swim a thank-you lap round your diver"] },
    waterTier("nz", "Noordzeekenner", "North Sea expert", "noordzee", "de Noordzee", "the North Sea"),
    waterTier("dz", "Diepzeeduiker", "Deep-sea diver", "diepzee", "de diepzee", "the deep sea"),
    waterTier("wr", "Rifkenner", "Reef expert", "rif", "het koraalrif", "the coral reef"),
    waterTier("wk", "Kelpkenner", "Kelp expert", "kelpwoud", "het kelpwoud", "the kelp forest"),
    waterTier("wi", "Poolreiziger", "Polar explorer", "ijszee", "de IJszee", "the polar sea"),
    waterTier("wm", "Wortelkruiper", "Root crawler", "mangrove", "de mangrove", "the mangrove"),
    waterTier("wg", "Grotduiker", "Cave diver", "grot", "de onderwatergrot", "the underwater cave"),
    waterTier("wl", "Lagunekenner", "Lagoon expert", "lagune", "de lagune", "the lagoon"),
    waterTier("ws", "Wierzwerver", "Weed wanderer", "sargasso", "de Sargassozee", "the Sargasso Sea"),
    { id: "vh", name: ["Volhouder", "Keeper-upper"], goal: ["7 opdrachten van de dag", "7 quests of the day"], prog: () => [store.get("oceaan-dagen", 0), 7], reward: ["een sticker in je logboek", "a sticker in your logbook"] },
    { id: "fj", name: ["Fotojager", "Photo hunter"], goal: ["het hele fotoboek", "the whole photo book"], prog: () => [PHOTO_TASKS.filter(x => store.get("oceaan-fotoboek", []).includes(x[0])).length, PHOTO_TASKS.length], reward: ["een sticker in je logboek", "a sticker in your logbook"] },
    { id: "sk", name: ["Sterrenkijker", "Stargazer"], goal: ["vallende sterren, maansverduistering en noorderlicht", "shooting stars, lunar eclipse and northern lights"], prog: () => [["meteor", "eclipse", "aurora"].filter(k => logbook.has(k)).length, 3], reward: ["een sticker in je logboek", "a sticker in your logbook"] },
  ];
  // The Wadden Sea made ten waters. A logbook that already had the first nine keeps the Globetrotter reward;
  // this is worked out once, on the first visit after the update (called from the start in 20-language-and-start.js).
  const GLOBE_KEY = "oceaan-wereldreiziger";
  function keepGlobetrotter() {
    if (WATERS.slice(0, FIRST_WATERS).every(w => logbook.has("w:" + w.name))) store.set(GLOBE_KEY, true);
  }
  // the stickers that milestones give, with the animal or moment shown on each
  const STICKERS = [["rd", "hawksbill"], ["nz", "puffin"], ["dz", "vampire"], ["wr", "clown"], ["wk", "otters"], ["wi", "polarbear"], ["wm", "archer"],
    ["wg", "nautilus"], ["wl", "dugong"], ["ws", "sargassumfish"], ["sk", "meteor"], ["vh", "turtle"], ["fj", "orca"]];
  for (const m of MILESTONES) m.need = () => { const [a, b] = m.prog(); return a >= b; };
  let rewards = new Set();
  const reached = () => MILESTONES.filter(m => m.need()).map(m => m.id);
  function applyRewards() {
    rewards = new Set(reached());
    bookBtn.dataset.rank = MILESTONES.every(m => rewards.has(m.id)) ? "gold" : "";
    bookBtn.classList.remove("glitter");
    panelEl.classList.toggle("gilded", rewards.has("m100"));
    // the call buttons only appear once they are earned
    const vb = document.getElementById("callVisitor"), mb = document.getElementById("callMoment");
    if (vb) vb.hidden = !rewards.has("gv");
    if (mb) mb.hidden = !rewards.has("gm");
    const pf = document.getElementById("photoFilters");
    if (pf) pf.hidden = !rewards.has("ph");
  }
  function checkMilestones(before) {
    for (const id of reached()) {
      if (before.includes(id)) continue;
      const m = MILESTONES.find(x => x.id === id);
      toast(m.reward ? L(`Mijlpaal: ${m.name[0]}! Je krijgt ${m.reward[0]}.`, `Milestone: ${m.name[1]}! You get ${m.reward[1]}.`) : L(`Mijlpaal: ${m.name[0]}!`, `Milestone: ${m.name[1]}!`), "important");
      buzz([60, 60, 120]);
    }
    applyRewards();
  }

  // Messages wait their turn instead of piling on top of each other.
  const toastQueue = [];
  let toastBusy = false;
  // kind "new" is the "new in your logbook" message (skipped in calm mode); "important" messages (milestones) are never dropped
  function toast(msg, kind) {
    if (restMode && kind === "new") return;
    if (toastQueue.includes(msg)) { if (!toastBusy) nextToast(); return; }
    if (toastQueue.length >= 4) {
      if (kind !== "important") { if (!toastBusy) nextToast(); return; }
      // make room by dropping the oldest ordinary message
      const i = toastQueue.findIndex(m => !importantToasts.has(m));
      if (i >= 0) toastQueue.splice(i, 1);
    }
    toastQueue.push(msg);
    if (kind === "important") importantToasts.add(msg);
    if (!toastBusy) nextToast();
  }
  const importantToasts = new Set();
  function nextToast() {
    const msg = toastQueue.shift();
    if (!msg) { toastBusy = false; return; }
    importantToasts.delete(msg);
    toastBusy = true;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    setTimeout(() => { toastEl.classList.remove("show"); setTimeout(nextToast, 400); }, Math.max(2600, msg.length * 55));
  }

  // Settings a viewer keeps in their own browser.
  const store = {
    get(key, fallback) { try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} },
  };
  // The first three dives of a new player (see 19-quests.js); here, because the new-ocean lock needs them early.
  const INTRO_KEY = "oceaan-intro";
  const INTRO = [
    { water: "lagune", seed: 101, set: ["starfish", "turtle", "chest"],
      tips: [["Eerste duik (1 van 3): roep de duiker met D of de duikerknop.", "First dive (1 of 3): call the diver with D or the diver button."],
        ["Houd zijn lamp even stil op een dier. Als het ringetje vol is, staat het in je logboek. Zwem daarna naar de schatkist.", "Hold its lamp still on an animal for a moment. When the ring is full, it is in your logbook. Then swim to the treasure chest."]] },
    { water: "rif", seed: 102, set: ["coral", "anemone", "crab", "parrotfish", "puffer", "bottle"],
      tips: [["Tweede duik (2 van 3): tik op de fles. Er zit een schatkaart in, en op het kruisje graaf je een schat op.", "Second dive (2 of 3): tap the bottle. There is a treasure map inside, and you dig up treasure at the cross."]] },
    { water: "noordzee", seed: 103, set: ["wreck", "anchor", "crab", "starfish", "lobster", "flatfish", "cod", "puffin", "ghost"],
      tips: [["Derde duik (3 van 3): hier is iets zeldzaams. Druk met de duiker op de sonar (Q) en volg de gouden echo.", "Third dive (3 of 3): something rare is here. Use the sonar (Q) with the diver and follow the golden echo."]] },
  ];
  const introDone = () => store.get(INTRO_KEY, INTRO.length);
  const introLeft = () => introDone() < INTRO.length;
  let restMode = store.get("oceaan-rust", false);
  // What was found since the logbook was last opened; it shows at the top of the logbook.
  let fresh = new Set(store.get("oceaan-nieuw", []));
  const saveFresh = () => store.set("oceaan-nieuw", [...fresh]);
  // Animals whose shiny you chose to show in the logbook (by picking the Shiny tab).
  let shinyPick = new Set(store.get("oceaan-shinykeuze", []));
  const saveShinyPick = () => store.set("oceaan-shinykeuze", [...shinyPick]);

  // Dutch or English. The first visit follows the browser's language.
  let LANG = store.get("oceaan-taal", String(navigator.language || "nl").toLowerCase().startsWith("nl") ? "nl" : "en");
  if (LANG !== "nl" && LANG !== "en") LANG = "nl";
  const L = (nl, en) => (LANG === "en" ? en : nl);
  const nm = key => (LANG === "en" ? NAMES_EN[key] : NAMES[key]) || NAMES[key] || key;
  // Long compound names on a small card ("Kokosnootoctopus") get soft hyphens where their parts meet, so they break
  // as "Kokosnoot-octopus" and not halfway a part; browsers without a Dutch hyphenation dictionary need this.
  // Only for HTML text: canvas text keeps nm().
  const BREAK_PARTS = ["octopus", "inktvis", "kreeft", "garnaal", "grondel", "krab", "kwal", "draak", "schildpad", "slang", "slak",
    "worm", "egel", "ster", "komkommer", "schelp", "vis", "haai", "rog", "eend", "duiker", "walvis", "dolfijn", "zeeleeuw",
    "uitbarsting", "verduistering", "trek", "zwerm", "schip", "wrak", "beeld", "kenner", "verkenner", "zoeker", "jager",
    "verzamelaar", "reiziger", "kruiper", "wever", "kijker", "encyclopedie", "vulkaan", "hoos", "beving", "vonken", "licht",
    "boom", "ringen", "zuilen", "fish", "shark", "whale", "octopus", "eruption", "shrimp", "lobster"];
  const breakable = text => text.replace(/\S{11,}/g, w => {
    const lw = w.toLowerCase(), at = new Set();
    for (const p of BREAK_PARTS) for (let i = lw.indexOf(p, 4); i >= 0; i = lw.indexOf(p, i + 1)) if (w.length - i >= 3) at.add(i);
    let out = "", last = 0;
    for (const i of [...at].sort((a, b) => a - b)) if (i - last >= 3) { out += w.slice(last, i) + "­"; last = i; }
    return out + w.slice(last);
  });
  const nmBreak = key => breakable(nm(key));
  const dateText = iso => new Date(iso + "T12:00:00").toLocaleDateString(LANG === "en" ? "en-GB" : "nl-NL", { day: "numeric", month: "long", year: "numeric" });
  let volume = store.get("oceaan-volume", 0.8);
  let dprCap = 2;

  // The director keeps the big moments apart: one at a time, with quiet in between.
  let busyUntil = 0;
  function claim(seconds) {
    if (restMode || (aquarium && aquarium.intro) || t < busyUntil) return false;
    busyUntil = t + seconds + 12;
    return true;
  }

  function mulberry32(a) {
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---- drawing helpers -------------------------------------------------------
  // Hand-drawn outlines (SVG path data, 100 units = f.s), cached as Path2D.
  const PATHS = {};
  const P = d => PATHS[d] || (PATHS[d] = new Path2D(d));
  // Everything below the waterline (y > 0) gets a veil of water, so it looks submerged.
  function underVeil(path) {
    ctx.save(); ctx.clip(path);
    ctx.fillStyle = "rgba(30,80,120,0.42)"; ctx.fillRect(-200, 0, 400, 200);
    ctx.restore();
  }
  // a part that is fully under water: its colour, then the same veil on top
  function fillUnder(path, col) { ctx.fillStyle = col; ctx.fill(path); ctx.fillStyle = "rgba(30,80,120,0.42)"; ctx.fill(path); }
  function ripple(x0, x1, ph) {
    ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x0, 1); ctx.quadraticCurveTo((x0 + x1) / 2, -2 + Math.sin(ph * 3) * 1.2, x1, 1); ctx.stroke();
  }

  // fill a part, then lay a second colour over the region inside a clip shape (white fin tips, a pale belly)
  function fillWith(path, col) { ctx.fillStyle = col; ctx.fill(path); }
  // The standard eye of the style guide: a dark dot with a small catch of light towards the top, where the light comes from.
  function eye(x, y, r, col = "#101418") {
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.36, r * 0.34, 0, TAU); ctx.fill();
  }
  function paintInside(path, col, region) { ctx.save(); ctx.clip(path); ctx.fillStyle = col; ctx.fill(region); ctx.restore(); }
  // a soft shadow on the sand under something that hovers
  function sandShadow(f, w) { if (!f.lift) return; ctx.fillStyle = "rgba(0,0,0,0.13)"; ctx.beginPath(); ctx.ellipse(f.x, f.cy + f.lift, w, w * 0.18, 0, 0, TAU); ctx.fill(); }

  // An animal that changes direction turns round smoothly instead of flipping in one frame:
  // its width shrinks to a sliver and grows back the other way, as if it turns its body.
  let frameK = 1;
  function faceOf(o) {
    const dir = o.dir || 1;
    if (o.turn === undefined || !isFinite(o.turn) || Math.abs(o.turn) > 1) o.turn = dir;
    o.turn += (dir - o.turn) * Math.min(1, 0.14 * frameK);
    if (Math.abs(dir - o.turn) < 0.01) o.turn = dir;
    return Math.abs(o.turn) < 0.06 ? (o.turn < 0 ? -0.06 : 0.06) : o.turn;
  }

  // The colour scheme of the shiny that is being drawn right now (see 10-shiny.js), or null.
  let shinyPal = null;


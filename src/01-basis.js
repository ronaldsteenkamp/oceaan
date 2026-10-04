  const canvas = document.getElementById("c");
  let ctx = canvas.getContext("2d");
  const seedEl = document.querySelector("#seed b");
  const rareEl = document.getElementById("rare");
  const soundBtn = document.getElementById("sound");
  const clockEl = document.getElementById("clock");
  const welcomeEl = document.getElementById("welcome");
  const diverBtn = document.getElementById("diver");
  const photoBtn = document.getElementById("photo");
  const menuBtn = document.getElementById("menu");
  const bookBtn = document.getElementById("book");
  const bookDot = document.getElementById("bookDot");
  const taskEl = document.getElementById("task");
  const toastEl = document.getElementById("toast");
  const panelEl = document.getElementById("panel");
  const panelBody = document.getElementById("panelBody");
  const panelTitle = document.getElementById("panelTitle");
  const toolbarEl = document.querySelector(".toolbar");
  const sceneDescEl = document.getElementById("sceneDesc");
  // inside a claude.ai artifact the page cannot use its own address for sharing
  const IN_ARTIFACT = !!(window.claude && typeof window.claude.use === "function");
  // a short buzz on phones that support it
  function buzz(pattern) { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} }
  const photoView = document.getElementById("photoView");
  const polaroidImg = document.getElementById("polaroid");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const TAU = Math.PI * 2;

  // Three waters. Each lists how likely every landmark and creature is to appear.
  const WATERS = [
    { name: "rif", top: "#3aaab6", mid: "#14678a", bottom: "#0a2a45", tintK: 0.12,
      ray: "230,255,248", rayA: 0.11, snow: "220,245,240",
      sand: ["#d3c193", "#7d6f50"], rock: "#6b6656",
      kelp: ["#2e6e4c", "#3f8a57", "#24573f"],
      fish: [["#f2b134", "#8a5810"], ["#ef6f5e", "#7d2b22"], ["#e7eef0", "#6f818a"], ["#7fd8c9", "#2d6f66"], ["#3e6fd1", "#16306b"], ["#f4d24a", "#3a3a3a"]],
      jelly: ["255,196,224", "255,232,200"], glow: false, whale: "8,38,62",
      props: { wreck: 0.8, chest: 0.75, anchor: 0.5, cannon: 0.45, ruins: 0.3, bottle: 0.5, skull: 0.35, coral: 1, anemone: 0.95, vent: 0, rocks: 0.6 },
      life: { crab: 0.9, starfish: 1, urchin: 0.7, octopus: 0.8, ray: 0.7, eels: 0.8, seahorse: 0.8, puffer: 0.9, angler: 0, moray: 0.8 },
      visitors: ["turtle", "manta", "shark", "whale", "turtle"] },
    { name: "diepzee", top: "#143e68", mid: "#081a33", bottom: "#02050c", tintK: 0.5,
      ray: "150,200,255", rayA: 0.05, snow: "170,210,255",
      sand: ["#2a3846", "#0a1118"], rock: "#1a242e",
      kelp: ["#123c3f", "#0f3134", "#18484a"],
      fish: [["#9cc3e6", "#3a5a7a"], ["#cfdbe6", "#5a6a7a"], ["#5e86b8", "#203a5c"], ["#e0a96d", "#6b4320"]],
      jelly: ["120,240,255", "255,120,220", "180,150,255"], glow: true, whale: "2,8,18",
      props: { wreck: 0.85, chest: 0.65, anchor: 0.4, cannon: 0.4, ruins: 0.4, bottle: 0.3, skull: 0.7, coral: 0, anemone: 0, vent: 0.95, rocks: 0.7 },
      life: { crab: 0.8, starfish: 0.5, urchin: 0.8, octopus: 0.7, ray: 0.5, eels: 0.3, seahorse: 0, puffer: 0.2, angler: 1, moray: 0.8 },
      visitors: ["whale", "shark", "manta"] },
    { name: "noordzee", top: "#64a096", mid: "#2f6566", bottom: "#0e2a2d", tintK: 0.28,
      ray: "235,250,230", rayA: 0.09, snow: "225,235,220",
      sand: ["#959076", "#4a4738"], rock: "#4a4d42",
      kelp: ["#4a6a30", "#5b7a35", "#39552a"],
      fish: [["#c9d6d2", "#5f716d"], ["#a4b9b4", "#45584f"], ["#e2b47e", "#7a5530"], ["#8fa7b8", "#3c5260"]],
      jelly: ["240,220,200", "220,235,255"], glow: false, whale: "12,38,40",
      props: { wreck: 0.85, chest: 0.5, anchor: 0.75, cannon: 0.65, ruins: 0.4, bottle: 0.6, skull: 0.45, coral: 0, anemone: 0.3, vent: 0, rocks: 0.9 },
      life: { crab: 1, starfish: 0.9, urchin: 0.7, octopus: 0.7, ray: 0.7, eels: 0.6, seahorse: 0.5, puffer: 0.3, angler: 0, moray: 0.7 },
      visitors: ["whale", "shark", "turtle", "manta", "shark"] },
  ];

  // Newer landmarks, creatures and visitors for the first three waters.
  const EXTRA = {
    rif: { surface: true,
      props: { helmet: 0.4, mine: 0.2, plane: 0.3, statue: 0.3, arch: 0.45 },
      life: { squid: 0.6, hermit: 0.8, slugs: 0.9 },
      visitors: ["turtle", "manta", "shark", "whale", "dolphins", "swordfish", "sub", "humpback", "turtle", "dolphins"] },
    diepzee: { surface: false, giantSquid: true,
      props: { helmet: 0.4, mine: 0.4, plane: 0.3, statue: 0.45, arch: 0.6 },
      life: { squid: 0.8, hermit: 0.4, slugs: 0.6, comb: 0.7, lantern: 1 },
      visitors: ["whale", "shark", "manta", "sub", "sub", "swordfish"] },
    noordzee: { surface: true,
      props: { helmet: 0.5, mine: 0.6, plane: 0.4, statue: 0.25, arch: 0.5 },
      life: { squid: 0.6, hermit: 0.7, slugs: 0.5, comb: 0.3 },
      visitors: ["whale", "shark", "turtle", "manta", "dolphins", "sub", "humpback", "swordfish", "dolphins"] },
  };
  WATERS.forEach(w => {
    const e = EXTRA[w.name];
    Object.assign(w.props, e.props);
    Object.assign(w.life, e.life);
    w.visitors = e.visitors;
    w.surface = e.surface;
    w.giantSquid = !!e.giantSquid;
  });
  WATERS.push(
    { name: "kelpwoud", top: "#5aa58a", mid: "#1f5a50", bottom: "#0a2624", tintK: 0.25,
      ray: "235,255,220", rayA: 0.12, snow: "225,240,215",
      sand: ["#8f8a6a", "#46432f"], rock: "#3f463a",
      kelp: ["#7a6f2a", "#8a7d33", "#5f5a22", "#6d7a2c"],
      fish: [["#c9a46a", "#5f4a2a"], ["#e88a3a", "#6b3a14"], ["#a9b8b0", "#4a5a52"], ["#3f5f7a", "#1a2c3a"]],
      jelly: ["255,215,170", "235,225,255"], glow: false, whale: "10,36,34",
      surface: true, denseKelp: true,
      props: { wreck: 0.5, plane: 0.3, chest: 0.45, anchor: 0.5, cannon: 0.3, helmet: 0.5, mine: 0.35, bottle: 0.4, skull: 0.3, rocks: 0.9, arch: 0.5, statue: 0.2 },
      life: { crab: 0.9, starfish: 0.9, urchin: 1, octopus: 0.8, ray: 0.4, eels: 0.2, seahorse: 0.5, puffer: 0.2, moray: 0.7, squid: 0.4, hermit: 0.8, slugs: 0.7, otters: 1, seal: 0.4 },
      visitors: ["shark", "dolphins", "whale", "sub", "humpback", "dolphins"] },
    { name: "ijszee", top: "#86bfd0", mid: "#2b5e7a", bottom: "#0a2236", tintK: 0.25,
      ray: "235,248,255", rayA: 0.12, snow: "235,245,255",
      sand: ["#7d8a90", "#3a4448"], rock: "#4a555c",
      kelp: ["#5d7a66", "#4f6b5a", "#6b8a70"],
      fish: [["#c7d2d8", "#5a6870"], ["#9fb0bc", "#3e4c56"], ["#d9c8a6", "#6a5a3c"]],
      jelly: ["220,240,255", "255,225,240"], glow: false, whale: "12,34,50",
      surface: true, ice: true, fewKelp: true,
      props: { wreck: 0.55, plane: 0.3, anchor: 0.5, mine: 0.5, helmet: 0.4, chest: 0.3, rocks: 1, arch: 0.5, skull: 0.3, bottle: 0.3, cannon: 0.3 },
      life: { crab: 0.6, starfish: 0.9, urchin: 0.6, octopus: 0.4, hermit: 0.3, slugs: 0.4, comb: 0.8, penguins: 1, seal: 0.9, squid: 0.4, lantern: 0.3 },
      visitors: ["narwhal", "humpback", "whale", "sub", "narwhal", "shark"] },
  );

  // Volcanoes, brine pools, sunken cities, canyons and the newest creatures.
  const MORE = {
    rif: { props: { volcano: 0, brine: 0, city: 0.15, canyon: 0.3 }, life: { mantis: 0.7, archer: 0.6, cleaners: 0.9, flyingfish: 0.85 } },
    diepzee: { props: { volcano: 0.45, brine: 0.5, city: 0.1, canyon: 0.5 }, life: { mantis: 0, archer: 0, cleaners: 0, flyingfish: 0 } },
    noordzee: { props: { volcano: 0, brine: 0.2, city: 0.3, canyon: 0.3 }, life: { mantis: 0.3, archer: 0.3, cleaners: 0.4, flyingfish: 0.45 } },
    kelpwoud: { props: { volcano: 0, brine: 0, city: 0.2, canyon: 0.25 }, life: { mantis: 0.3, archer: 0.3, cleaners: 0.4, flyingfish: 0.35 } },
    ijszee: { props: { volcano: 0.1, brine: 0.25, city: 0, canyon: 0.35 }, life: { mantis: 0, archer: 0, cleaners: 0, flyingfish: 0 } },
  };
  WATERS.forEach(w => { Object.assign(w.props, MORE[w.name].props); Object.assign(w.life, MORE[w.name].life); });

  // Mangroves, caves and the newest finds, animals and visitors.
  const NEWEST = {
    rif: { props: { amphora: 0.25, car: 0.15, bell: 0.2, clam: 0.7, seagrass: 0.5 }, life: { lionfish: 0.6, cuttlefish: 0.4, cassiopea: 0.2, seadragon: 0.15, lobster: 0.2 }, visitors: ["hammerhead", "sunfish", "manatee"] },
    diepzee: { props: { amphora: 0.2, car: 0.05, bell: 0.25 }, life: { nautilus: 0.5, isopod: 0.8, lobster: 0.2 }, visitors: ["sunfish"] },
    noordzee: { props: { amphora: 0.15, car: 0.3, bell: 0.4, clam: 0.1, seagrass: 0.4 }, life: { lobster: 0.8, cuttlefish: 0.6 }, visitors: ["orca", "sunfish"] },
    kelpwoud: { props: { amphora: 0.15, car: 0.2, bell: 0.3, clam: 0.15, seagrass: 0.3 }, life: { lobster: 0.5, seadragon: 0.6, cuttlefish: 0.3 }, visitors: ["orca", "sunfish"] },
    ijszee: { props: { amphora: 0.05, car: 0.1, bell: 0.35 }, life: { isopod: 0.3, lobster: 0.2 }, visitors: ["orca", "beluga", "beluga"] },
  };
  WATERS.forEach(w => { Object.assign(w.props, NEWEST[w.name].props); Object.assign(w.life, NEWEST[w.name].life); w.visitors.push(...NEWEST[w.name].visitors); });
  WATERS.push(
    { name: "mangrove", top: "#7fa66a", mid: "#3b5e3c", bottom: "#16271a", tintK: 0.3,
      ray: "245,255,220", rayA: 0.13, snow: "220,230,190",
      sand: ["#7a6a4a", "#3a3020"], rock: "#4a4434",
      kelp: ["#5c7a34", "#6d8a3a", "#4a6a2c"],
      fish: [["#e8d070", "#6a5a20"], ["#9ab8c8", "#3a5868"], ["#f08a4a", "#6a3414"], ["#c8c8b0", "#5a5a48"]],
      jelly: ["240,220,170", "220,240,200"], glow: false, whale: "20,40,24",
      surface: true, mangrove: true, fewKelp: true,
      props: { wreck: 0.3, chest: 0.5, anchor: 0.4, bottle: 0.6, skull: 0.4, rocks: 0.6, helmet: 0.3, cannon: 0.2, plane: 0.15, arch: 0.2, amphora: 0.2, car: 0.35, bell: 0.25, clam: 0.3, seagrass: 0.9 },
      life: { crab: 1, starfish: 0.4, urchin: 0.3, octopus: 0.4, ray: 0.6, eels: 0.2, seahorse: 0.7, puffer: 0.7, hermit: 0.8, slugs: 0.4, archer: 0.9, flyingfish: 0.2, cassiopea: 0.9, lionfish: 0.3, cuttlefish: 0.3, mantis: 0.4, cleaners: 0.3 },
      visitors: ["manatee", "turtle", "shark", "hammerhead", "manatee", "dolphins", "turtle"] },
    { name: "grot", top: "#1f4f63", mid: "#0c2433", bottom: "#03080e", tintK: 0.45,
      ray: "200,240,255", rayA: 0.2, snow: "190,220,235",
      sand: ["#4a4a46", "#161816"], rock: "#2a2e30",
      kelp: ["#1f3a3a", "#244444"],
      fish: [["#e8e4dc", "#8a847a"], ["#c8d4dc", "#5a6a74"], ["#9cc3e6", "#3a5a7a"]],
      jelly: ["170,230,255", "210,190,255"], glow: true, whale: "4,10,16",
      surface: false, cave: true, fewKelp: true,
      props: { wreck: 0.2, chest: 0.7, skull: 0.7, rocks: 1, helmet: 0.6, bottle: 0.2, anchor: 0.3, ruins: 0.5, statue: 0.35, arch: 0.3, canyon: 0.35, vent: 0.2, brine: 0.2, amphora: 0.7, bell: 0.3, clam: 0.4 },
      life: { crab: 0.7, starfish: 0.4, urchin: 0.5, octopus: 0.5, eels: 0.3, moray: 0.6, hermit: 0.4, slugs: 0.5, comb: 0.6, lantern: 0.8, squid: 0.3, nautilus: 0.8, isopod: 0.9, lobster: 0.5 },
      visitors: ["shark", "turtle", "sub", "turtle"] },
  );

  // Everything the aquarium can switch on, and everything the logbook can record.
  const PROP_KEYS = ["wreck", "plane", "chest", "anchor", "cannon", "ruins", "statue", "city", "arch", "helmet", "mine", "bottle", "skull", "coral", "anemone", "vent", "volcano", "brine", "rocks", "canyon"];
  const LIFE_KEYS = ["crab", "starfish", "urchin", "octopus", "ray", "eels", "seahorse", "puffer", "angler", "moray", "squid", "hermit", "slugs", "comb", "lantern", "otters", "seal", "penguins", "mantis", "archer", "cleaners", "flyingfish"];
  const VIS_KEYS = ["whale", "humpback", "shark", "turtle", "manta", "dolphins", "swordfish", "sub", "narwhal"];
  const RARE_KEYS = ["mermaid", "kraken", "ghost", "whalefall"];
  const AQ_ALL = [...PROP_KEYS, ...LIFE_KEYS, ...VIS_KEYS, ...RARE_KEYS];
  // newer keys go at the end of the aquarium code, so older aquarium links keep working
  const NEW_PROPS = ["amphora", "car", "bell", "clam", "seagrass"];
  const NEW_LIFE = ["cassiopea", "lionfish", "cuttlefish", "lobster", "nautilus", "isopod", "seadragon"];
  const NEW_VIS = ["manatee", "orca", "hammerhead", "sunfish", "beluga"];
  const NEW_RARE = ["serpent", "megalodon", "goldpearl"];
  PROP_KEYS.push(...NEW_PROPS); LIFE_KEYS.push(...NEW_LIFE); VIS_KEYS.push(...NEW_VIS); RARE_KEYS.push(...NEW_RARE);
  AQ_ALL.push(...NEW_PROPS, ...NEW_LIFE, ...NEW_VIS, ...NEW_RARE);
  const MOMENT_KEYS = ["giant", "baitball", "spawning", "coralspawn", "storm", "eruption", "task", "jellybloom", "glowtide", "hatchlings", "whalesong"];
  const NAMES = {
    "w:rif": "Koraalrif", "w:diepzee": "Diepzee", "w:noordzee": "Noordzee", "w:kelpwoud": "Kelpwoud", "w:ijszee": "IJszee",
    "w:mangrove": "Mangrove", "w:grot": "Onderwatergrot",
    amphora: "Amforen", car: "Gezonken auto", bell: "Scheepsbel", clam: "Reuzenschelp", seagrass: "Zeegrasveld",
    cassiopea: "Omgekeerde kwal", lionfish: "Koraalduivel", cuttlefish: "Zeekat", lobster: "Kreeft", nautilus: "Nautilus",
    isopod: "Reuzenpissebed", seadragon: "Bladzeedraak",
    manatee: "Zeekoe", orca: "Orka", hammerhead: "Hamerhaai", sunfish: "Maanvis", beluga: "Beluga",
    jellybloom: "Kwallenzwerm", glowtide: "Zeevonken", hatchlings: "Babyschildpadjes", whalesong: "Walvisgezang",
    serpent: "Zeeslang", megalodon: "Megalodon", goldpearl: "Gouden parel",
    wreck: "Piratenwrak", plane: "Vliegtuigwrak", chest: "Schatkist", treasure: "Opgegraven schat", anchor: "Anker", cannon: "Kanon",
    ruins: "Zuilen", statue: "Atlantis", city: "Gezonken stad", arch: "Rotsboog", helmet: "Duikerhelm", mine: "Zeemijn",
    bottle: "Flessenpost", skull: "Doodshoofd", coral: "Koraaltuin", anemone: "Anemoon", vent: "Heetwaterbron",
    volcano: "Onderzeese vulkaan", brine: "Pekelmeer", rocks: "Rotsblokken", canyon: "Afgrond",
    fish: "Scholen vissen", jelly: "Kwal", crab: "Krab", starfish: "Zeester", urchin: "Zee-egel", octopus: "Octopus",
    ray: "Pijlstaartrog", eels: "Zandalen", seahorse: "Zeepaardje", puffer: "Kogelvis", angler: "Hengelvis", moray: "Murene",
    squid: "Inktvisjes", hermit: "Heremietkreeft", slugs: "Zeekomkommer", comb: "Ribkwal", lantern: "Lantaarnvis",
    otters: "Zeeotter", seal: "Zeehond", penguins: "Pinguïns", clown: "Clownvis", mantis: "Bidsprinkhaankreeft",
    archer: "Schuttersvis", cleaners: "Poetsvisjes", grouper: "Tandbaars", flyingfish: "Vliegende vis",
    whale: "Walvis", humpback: "Bultrug", shark: "Haai", turtle: "Zeeschildpad", manta: "Manta", dolphins: "Dolfijnen",
    swordfish: "Zeilvis", sub: "Duikboot", narwhal: "Narwal",
    giant: "Reuzeninktvis", baitball: "Bait-ball", spawning: "Paaiende vissen", coralspawn: "Koraalpaai",
    storm: "Onweer", eruption: "Vulkaanuitbarsting", task: "Alle zeepaardjes gevonden",
    mermaid: "Zeemeermin", kraken: "Kraken", ghost: "Spookschip", whalefall: "Walvisval",
  };
  const LOG_GROUPS = [
    ["Wateren", WATERS.map(w => "w:" + w.name)],
    ["Bodem en vondsten", [...PROP_KEYS.slice(0, 2), "chest", "treasure", ...PROP_KEYS.slice(3)]],
    ["Dieren", ["fish", "jelly", ...LIFE_KEYS, "clown", "grouper"]],
    ["Bezoekers", VIS_KEYS],
    ["Momenten", MOMENT_KEYS],
    ["Zeldzaam", RARE_KEYS],
  ];

  // Shinies are rare colour variants with their own page in the logbook. The odds are set per kind of animal:
  // where there are hundreds (school fish) each one has a small chance, where there is one (a whale) the chance is bigger,
  // so that every kind of shiny turns up about as often.
  const SHINY_N = {
    fish: 60000, lantern: 9000, jelly: 6000, crab: 1500, starfish: 600, urchin: 450, octopus: 150, ray: 150, eels: 1200,
    seahorse: 300, puffer: 150, angler: 150, squid: 750, hermit: 300, slugs: 450, comb: 600, otters: 300, seal: 1500,
    penguins: 3000, clown: 300, mantis: 150, archer: 150, cleaners: 450, grouper: 150, flyingfish: 900,
    whale: 450, humpback: 450, shark: 450, turtle: 450, manta: 450, dolphins: 1800, swordfish: 450, narwhal: 450, mermaid: 450,
    cassiopea: 600, lionfish: 150, cuttlefish: 150, lobster: 300, nautilus: 150, isopod: 300, seadragon: 150,
    manatee: 450, orca: 450, hammerhead: 450, sunfish: 450, beluga: 450,
  };
  const shinyChance = key => 1 / (SHINY_N[key] || 1000);
  const SHINY_KEYS = ["fish", "lantern", "jelly", "crab", "starfish", "urchin", "octopus", "ray", "eels", "seahorse", "puffer", "angler",
    "squid", "hermit", "slugs", "comb", "otters", "seal", "penguins", "clown", "mantis", "archer", "cleaners", "grouper", "flyingfish",
    "whale", "humpback", "shark", "turtle", "manta", "dolphins", "swordfish", "narwhal", "mermaid",
    "cassiopea", "lionfish", "cuttlefish", "lobster", "nautilus", "isopod", "seadragon", "manatee", "orca", "hammerhead", "sunfish", "beluga"];
  const SHINY_NAMES = { fish: "schoolvis", eels: "zandaal", squid: "inktvisje", slugs: "zeekomkommer", otters: "zeeotter", penguins: "pinguïn", cleaners: "poetsvisje", dolphins: "dolfijn" };
  for (const k of SHINY_KEYS) NAMES["shiny:" + k] = "Shiny " + (SHINY_NAMES[k] || NAMES[k].toLowerCase());
  LOG_GROUPS.push(["Shiny", SHINY_KEYS.map(k => "shiny:" + k)]);

  const NAMES_EN = {
    "w:rif": "Coral reef", "w:diepzee": "Deep sea", "w:noordzee": "North Sea", "w:kelpwoud": "Kelp forest", "w:ijszee": "Polar sea",
    "w:mangrove": "Mangrove", "w:grot": "Underwater cave",
    amphora: "Amphorae", car: "Sunken car", bell: "Ship's bell", clam: "Giant clam", seagrass: "Seagrass meadow",
    cassiopea: "Upside-down jellyfish", lionfish: "Lionfish", cuttlefish: "Cuttlefish", lobster: "Lobster", nautilus: "Nautilus",
    isopod: "Giant isopod", seadragon: "Leafy seadragon",
    manatee: "Manatee", orca: "Orca", hammerhead: "Hammerhead shark", sunfish: "Ocean sunfish", beluga: "Beluga",
    jellybloom: "Jellyfish swarm", glowtide: "Sea sparkle", hatchlings: "Turtle hatchlings", whalesong: "Whale song",
    serpent: "Sea serpent", megalodon: "Megalodon", goldpearl: "Golden pearl",
    wreck: "Pirate wreck", plane: "Plane wreck", chest: "Treasure chest", treasure: "Dug-up treasure", anchor: "Anchor", cannon: "Cannon",
    ruins: "Columns", statue: "Atlantis", city: "Sunken town", arch: "Rock arch", helmet: "Diving helmet", mine: "Sea mine",
    bottle: "Message in a bottle", skull: "Skull", coral: "Coral garden", anemone: "Anemone", vent: "Hydrothermal vent",
    volcano: "Undersea volcano", brine: "Brine pool", rocks: "Boulders", canyon: "Abyss",
    fish: "Fish schools", jelly: "Jellyfish", crab: "Crab", starfish: "Starfish", urchin: "Sea urchin", octopus: "Octopus",
    ray: "Stingray", eels: "Garden eels", seahorse: "Seahorse", puffer: "Pufferfish", angler: "Anglerfish", moray: "Moray eel",
    squid: "Squid", hermit: "Hermit crab", slugs: "Sea cucumber", comb: "Comb jelly", lantern: "Lanternfish",
    otters: "Sea otter", seal: "Seal", penguins: "Penguins", clown: "Clownfish", mantis: "Mantis shrimp",
    archer: "Archerfish", cleaners: "Cleaner wrasse", grouper: "Grouper", flyingfish: "Flying fish",
    whale: "Whale", humpback: "Humpback whale", shark: "Shark", turtle: "Sea turtle", manta: "Manta ray", dolphins: "Dolphins",
    swordfish: "Sailfish", sub: "Submarine", narwhal: "Narwhal",
    giant: "Giant squid", baitball: "Bait ball", spawning: "Spawning fish", coralspawn: "Coral spawning",
    storm: "Thunderstorm", eruption: "Volcanic eruption", task: "All seahorses found",
    mermaid: "Mermaid", kraken: "Kraken", ghost: "Ghost ship", whalefall: "Whale fall",
  };
  const SHINY_NAMES_EN = { fish: "school fish", eels: "garden eel", slugs: "sea cucumber", otters: "sea otter", penguins: "penguin", cleaners: "cleaner wrasse", dolphins: "dolphin" };
  for (const k of SHINY_KEYS) NAMES_EN["shiny:" + k] = "Shiny " + (SHINY_NAMES_EN[k] || NAMES_EN[k].toLowerCase());
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
  function saveLog() { try { localStorage.setItem(LOG_KEY, JSON.stringify(Object.fromEntries(logbook))); } catch (e) {} }

  let rebuilding = false;
  function seen(key) {
    if (!NAMES[key] || rebuilding) return;
    const entry = logbook.get(key);
    if (entry) { entry.n++; saveLog(); return; }
    const before = reached();
    const d = new Date();
    logbook.set(key, { n: 1, first: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` });
    saveLog();
    if (LOUD.has(key)) toast(L("Nieuw in je logboek: ", "New in your logbook: ") + nm(key));
    if (panelEl.hidden || panelTab !== "log") bookDot.hidden = false;
    checkMilestones(before);
    if (!panelEl.hidden && panelTab === "log" && !detailOpen) renderPanel();
  }

  // Milestones unlock small rewards: a coloured book, new fins and a golden tank for the diver.
  const BASE_LOG_KEYS = LOG_GROUPS.flatMap(g => g[1]).filter(k => !k.startsWith("shiny:"));
  const foundCount = () => BASE_LOG_KEYS.filter(k => logbook.has(k)).length;
  const shinyCount = () => SHINY_KEYS.filter(k => logbook.has("shiny:" + k)).length;
  const MILESTONES = [
    { id: "m10", name: ["Ontdekker", "Explorer"], goal: ["10 vondsten", "10 finds"], need: () => foundCount() >= 10, reward: ["een bronzen boekje", "a bronze logbook"] },
    { id: "s1", name: ["Eerste shiny", "First shiny"], goal: ["1 shiny", "1 shiny"], need: () => shinyCount() >= 1, reward: ["een glinsterend boekje", "a glittering logbook"] },
    { id: "m25", name: ["Zeekenner", "Sea expert"], goal: ["25 vondsten", "25 finds"], need: () => foundCount() >= 25, reward: ["groene zwemvliezen voor je duiker", "green fins for your diver"] },
    { id: "m50", name: ["Oceanograaf", "Oceanographer"], goal: ["50 vondsten", "50 finds"], need: () => foundCount() >= 50, reward: ["een zilveren boekje", "a silver logbook"] },
    { id: "s10", name: ["Shinyjager", "Shiny hunter"], goal: ["10 shiny's", "10 shinies"], need: () => shinyCount() >= 10, reward: ["regenboogzwemvliezen voor je duiker", "rainbow fins for your diver"] },
    { id: "mall", name: ["Meester van de zee", "Master of the sea"], goal: ["alles gevonden", "everything found"], need: () => foundCount() >= BASE_LOG_KEYS.length, reward: ["een gouden boekje en een gouden duikfles", "a golden logbook and a golden air tank"] },
  ];
  let rewards = new Set();
  const reached = () => MILESTONES.filter(m => m.need()).map(m => m.id);
  function applyRewards() {
    rewards = new Set(reached());
    bookBtn.dataset.rank = rewards.has("mall") ? "gold" : rewards.has("m50") ? "silver" : rewards.has("m10") ? "bronze" : "";
    bookBtn.classList.toggle("glitter", rewards.has("s1"));
  }
  function checkMilestones(before) {
    for (const id of reached()) {
      if (before.includes(id)) continue;
      const m = MILESTONES.find(x => x.id === id);
      toast(L(`Mijlpaal: ${m.name[0]}! Je krijgt ${m.reward[0]}.`, `Milestone: ${m.name[1]}! You get ${m.reward[1]}.`));
      buzz([60, 60, 120]);
    }
    applyRewards();
  }

  // Messages wait their turn instead of piling on top of each other.
  const toastQueue = [];
  let toastBusy = false;
  function toast(msg) {
    if (restMode && (msg.startsWith("Nieuw in je logboek") || msg.startsWith("New in your logbook"))) return;
    if (toastQueue.length < 4 && !toastQueue.includes(msg)) toastQueue.push(msg);
    if (!toastBusy) nextToast();
  }
  function nextToast() {
    const msg = toastQueue.shift();
    if (!msg) { toastBusy = false; return; }
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
  let restMode = store.get("oceaan-rust", false);

  // Dutch or English. The first visit follows the browser's language.
  let LANG = store.get("oceaan-taal", String(navigator.language || "nl").toLowerCase().startsWith("nl") ? "nl" : "en");
  if (LANG !== "nl" && LANG !== "en") LANG = "nl";
  const L = (nl, en) => (LANG === "en" ? en : nl);
  const nm = key => (LANG === "en" ? NAMES_EN[key] : NAMES[key]) || NAMES[key] || key;
  const dateText = iso => new Date(iso + "T12:00:00").toLocaleDateString(LANG === "en" ? "en-GB" : "nl-NL", { day: "numeric", month: "long", year: "numeric" });
  let volume = store.get("oceaan-volume", 0.8);
  let dprCap = 2;

  // The director keeps the big moments apart: one at a time, with quiet in between.
  let busyUntil = 0;
  function claim(seconds) {
    if (restMode || t < busyUntil) return false;
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


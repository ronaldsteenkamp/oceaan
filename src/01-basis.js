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
      visitors: ["turtle", "manta", "whitetip", "finwhale", "turtle"] },
    { name: "diepzee", top: "#143e68", mid: "#081a33", bottom: "#02050c", tintK: 0.5,
      ray: "150,200,255", rayA: 0.05, snow: "170,210,255",
      sand: ["#2a3846", "#0a1118"], rock: "#1a242e",
      kelp: ["#123c3f", "#0f3134", "#18484a"],
      fish: [["#9cc3e6", "#3a5a7a"], ["#cfdbe6", "#5a6a7a"], ["#5e86b8", "#203a5c"], ["#e0a96d", "#6b4320"]],
      jelly: ["120,240,255", "255,120,220", "180,150,255"], glow: true, whale: "2,8,18",
      props: { wreck: 0.85, chest: 0.65, anchor: 0.4, cannon: 0.4, ruins: 0.4, bottle: 0.3, skull: 0.7, coral: 0, anemone: 0, vent: 0.95, rocks: 0.7 },
      life: { crab: 0.8, starfish: 0.5, urchin: 0.8, octopus: 0.7, ray: 0.5, eels: 0.3, seahorse: 0, puffer: 0.2, angler: 1, moray: 0.8 },
      visitors: ["finwhale", "greatwhite", "manta"] },
    { name: "noordzee", top: "#64a096", mid: "#2f6566", bottom: "#0e2a2d", tintK: 0.28,
      ray: "235,250,230", rayA: 0.09, snow: "225,235,220",
      sand: ["#959076", "#4a4738"], rock: "#4a4d42",
      kelp: ["#4a6a30", "#5b7a35", "#39552a"],
      fish: [["#c9d6d2", "#5f716d"], ["#a4b9b4", "#45584f"], ["#e2b47e", "#7a5530"], ["#8fa7b8", "#3c5260"]],
      jelly: ["240,220,200", "220,235,255"], glow: false, whale: "12,38,40",
      props: { wreck: 0.85, chest: 0.5, anchor: 0.75, cannon: 0.65, ruins: 0.4, bottle: 0.6, skull: 0.45, coral: 0, anemone: 0.3, vent: 0, rocks: 0.9 },
      life: { crab: 1, starfish: 0.9, urchin: 0.7, octopus: 0.7, ray: 0.7, eels: 0.6, seahorse: 0.5, puffer: 0.3, angler: 0, moray: 0.7 },
      visitors: ["finwhale", "greatwhite", "turtle", "manta", "greatwhite"] },
  ];

  // Newer landmarks, creatures and visitors for the first three waters.
  const EXTRA = {
    rif: { surface: true,
      props: { helmet: 0.4, mine: 0.2, plane: 0.3, statue: 0.3, arch: 0.45 },
      life: { squid: 0.6, hermit: 0.8, slugs: 0.9 },
      visitors: ["turtle", "manta", "whitetip", "finwhale", "dolphins", "swordfish", "sub", "humpback", "turtle", "dolphins"] },
    diepzee: { surface: false, giantSquid: true,
      props: { helmet: 0.4, mine: 0.4, plane: 0.3, statue: 0.45, arch: 0.6 },
      life: { squid: 0.8, hermit: 0.4, slugs: 0.6, comb: 0.7, lantern: 1 },
      visitors: ["finwhale", "greatwhite", "manta", "sub", "sub", "swordfish"] },
    noordzee: { surface: true,
      props: { helmet: 0.5, mine: 0.6, plane: 0.4, statue: 0.25, arch: 0.5 },
      life: { squid: 0.6, hermit: 0.7, slugs: 0.5, comb: 0.3 },
      visitors: ["finwhale", "greatwhite", "turtle", "manta", "dolphins", "sub", "humpback", "swordfish", "dolphins"] },
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
      visitors: ["greatwhite", "dolphins", "finwhale", "sub", "humpback", "dolphins"] },
    { name: "ijszee", top: "#86bfd0", mid: "#2b5e7a", bottom: "#0a2236", tintK: 0.25,
      ray: "235,248,255", rayA: 0.12, snow: "235,245,255",
      sand: ["#7d8a90", "#3a4448"], rock: "#4a555c",
      kelp: ["#5d7a66", "#4f6b5a", "#6b8a70"],
      fish: [["#c7d2d8", "#5a6870"], ["#9fb0bc", "#3e4c56"], ["#d9c8a6", "#6a5a3c"]],
      jelly: ["220,240,255", "255,225,240"], glow: false, whale: "12,34,50",
      surface: true, ice: true, fewKelp: true,
      props: { wreck: 0.55, plane: 0.3, anchor: 0.5, mine: 0.5, helmet: 0.4, chest: 0.3, rocks: 1, arch: 0.5, skull: 0.3, bottle: 0.3, cannon: 0.3 },
      life: { crab: 0.6, starfish: 0.9, urchin: 0.6, octopus: 0.4, hermit: 0.3, slugs: 0.4, comb: 0.8, penguins: 1, seal: 0.9, squid: 0.4, lantern: 0.3 },
      visitors: ["narwhal", "humpback", "finwhale", "sub", "narwhal", "greatwhite"] },
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
      visitors: ["manatee", "turtle", "whitetip", "hammerhead", "manatee", "dolphins", "turtle"] },
    { name: "grot", top: "#1f4f63", mid: "#0c2433", bottom: "#03080e", tintK: 0.45,
      ray: "200,240,255", rayA: 0.2, snow: "190,220,235",
      sand: ["#4a4a46", "#161816"], rock: "#2a2e30",
      kelp: ["#1f3a3a", "#244444"],
      fish: [["#e8e4dc", "#8a847a"], ["#c8d4dc", "#5a6a74"], ["#9cc3e6", "#3a5a7a"]],
      jelly: ["170,230,255", "210,190,255"], glow: true, whale: "4,10,16",
      surface: false, cave: true, fewKelp: true,
      props: { wreck: 0.2, chest: 0.7, skull: 0.7, rocks: 1, helmet: 0.6, bottle: 0.2, anchor: 0.3, ruins: 0.5, statue: 0.35, arch: 0.3, canyon: 0.35, vent: 0.2, brine: 0.2, amphora: 0.7, bell: 0.3, clam: 0.4 },
      life: { crab: 0.7, starfish: 0.4, urchin: 0.5, octopus: 0.5, eels: 0.3, moray: 0.6, hermit: 0.4, slugs: 0.5, comb: 0.6, lantern: 0.8, squid: 0.3, nautilus: 0.8, isopod: 0.9, lobster: 0.5 },
      visitors: ["whitetip", "turtle", "sub", "turtle"] },
  );

  // The lagoon, the Sargasso Sea and the third wave of finds, animals and visitors.
  const WAVE3 = {
    rif: { props: { wheel: 0.25, idol: 0.12, phonebox: 0.05, sponges: 0.6 }, life: { parrotfish: 0.8, boxfish: 0.5, pistol: 0.5 }, visitors: ["eagleray", "whaleshark"] },
    diepzee: { props: { wheel: 0.2, idol: 0.15, sponges: 0.4 }, life: { spidercrab: 0.7 }, visitors: ["spermwhale"] },
    noordzee: { props: { wheel: 0.35, phonebox: 0.2, sponges: 0.2 }, life: { spidercrab: 0.3 }, visitors: ["sealion", "spermwhale"] },
    kelpwoud: { props: { wheel: 0.25, phonebox: 0.1, sponges: 0.3 }, life: { boxfish: 0.1 }, visitors: ["sealion", "sealion"] },
    ijszee: { props: { wheel: 0.3, sponges: 0.3 }, life: { spidercrab: 0.4 }, visitors: ["spermwhale"] },
    mangrove: { props: { wheel: 0.2, phonebox: 0.1, sponges: 0.3, idol: 0.1 }, life: { pistol: 0.5, boxfish: 0.3, parrotfish: 0.3 }, visitors: ["crocodile", "crocodile", "eagleray"] },
    grot: { props: { wheel: 0.3, idol: 0.35, sponges: 0.5 }, life: { spidercrab: 0.5 }, visitors: [] },
  };
  WATERS.forEach(w => { Object.assign(w.props, WAVE3[w.name].props); Object.assign(w.life, WAVE3[w.name].life); w.visitors.push(...WAVE3[w.name].visitors); });
  WATERS.push(
    { name: "lagune", top: "#9af0ee", mid: "#3cc4cc", bottom: "#127080", tintK: 0.06,
      ray: "255,255,235", rayA: 0.14, snow: "235,255,250",
      sand: ["#f0e6c8", "#b8a87a"], rock: "#9a9a88",
      kelp: ["#5aa04a", "#6ab058", "#4a8a3e"],
      fish: [["#f2d24a", "#6a5a10"], ["#4ad0e0", "#1a6070"], ["#f07ab0", "#7a2a54"], ["#8ae06a", "#2a6a1a"], ["#ffffff", "#7a8a90"]],
      jelly: ["255,240,220", "220,250,255"], glow: false, whale: "20,70,80",
      surface: true, caustics: true, fewKelp: true,
      props: { seagrass: 1, coral: 0.6, anemone: 0.7, rocks: 0.5, chest: 0.4, bottle: 0.6, sponges: 0.5, phonebox: 0.15, wheel: 0.2, idol: 0.15, clam: 0.6, amphora: 0.15, car: 0.1, anchor: 0.3, skull: 0.2 },
      life: { starfish: 1, ray: 0.9, eels: 0.9, seahorse: 0.5, puffer: 0.6, cassiopea: 0.6, hermit: 0.8, crab: 0.7, parrotfish: 0.8, boxfish: 0.7, pistol: 0.8, slugs: 0.5, octopus: 0.4, cleaners: 0.5, lionfish: 0.3, flyingfish: 0.3 },
      visitors: ["turtle", "turtle", "eagleray", "eagleray", "whitetip", "dolphins", "manatee", "whaleshark"] },
    { name: "sargasso", top: "#2f7fb8", mid: "#0f3f72", bottom: "#04142a", tintK: 0.3,
      ray: "220,240,255", rayA: 0.12, snow: "200,225,245",
      sand: ["#5a6a78", "#1a2430"], rock: "#2e3844",
      kelp: ["#8a7a2a", "#9a8a34"],
      fish: [["#9ac0e0", "#3a5a7a"], ["#d8e4ee", "#5a6a7a"], ["#f2c040", "#6a5010"]],
      jelly: ["200,230,255", "255,210,240"], glow: false, whale: "6,24,48",
      surface: true, sargasso: true, fewKelp: true,
      props: { wreck: 0.5, plane: 0.3, chest: 0.4, anchor: 0.4, bottle: 0.7, skull: 0.4, rocks: 0.5, wheel: 0.4, idol: 0.1, phonebox: 0.1, mine: 0.3, helmet: 0.3, bell: 0.3, canyon: 0.4 },
      life: { sargassumfish: 1, flyingfish: 0.9, squid: 0.6, comb: 0.4, lantern: 0.4, octopus: 0.3, crab: 0.4, starfish: 0.3, spidercrab: 0.3, puffer: 0.3 },
      visitors: ["finwhale", "humpback", "sunfish", "dolphins", "spermwhale", "greatwhite", "turtle", "swordfish"] },
  );

  // The fourth wave: thirty-six more animals.
  const WAVE4 = {
    rif: { life: { triggerfish: 0.6, wrasse: 0.7, surgeonfish: 0.7, mandarinfish: 0.35, scorpionfish: 0.4, stonefish: 0.3, goby: 0.5, needlefish: 0.3, electricray: 0.25, guitarfish: 0.25, brittlestar: 0.3, seacucumber: 0.4, featherstar: 0.4, seasnake: 0.3, seakrait: 0.25 },
      visitors: ["thresher", "whitetip", "marlin", "tuna", "barracuda", "falsekiller"] },
    lagune: { life: { triggerfish: 0.6, wrasse: 0.5, surgeonfish: 0.6, mandarinfish: 0.3, stonefish: 0.35, goby: 0.6, needlefish: 0.5, electricray: 0.2, guitarfish: 0.4, sanddollar: 0.6, seacucumber: 0.4, seasnake: 0.3, seakrait: 0.3, iguana: 0.25, pelican: 0.4 },
      visitors: ["whitetip", "barracuda", "sawfish"] },
    mangrove: { life: { triggerfish: 0.2, mandarinfish: 0.2, stonefish: 0.3, goby: 0.5, needlefish: 0.4, guitarfish: 0.3, seasnake: 0.4, iguana: 0.15, cormorant: 0.3, pelican: 0.5 },
      visitors: ["whitetip", "barracuda", "sawfish"] },
    noordzee: { life: { wrasse: 0.3, scorpionfish: 0.3, goby: 0.3, electricray: 0.3, sanddollar: 0.3, brittlestar: 0.4, seacucumber: 0.3, cormorant: 0.5 },
      visitors: ["thresher", "greatwhite", "tuna", "finwhale", "pilotwhale"] },
    kelpwoud: { life: { wrasse: 0.3, scorpionfish: 0.2, sanddollar: 0.3, cormorant: 0.4, albatross: 0.2 },
      visitors: ["greatwhite", "pilotwhale"] },
    sargasso: { life: { needlefish: 0.3, albatross: 0.5 },
      visitors: ["thresher", "greatwhite", "marlin", "tuna", "bluewhale", "finwhale", "pilotwhale", "falsekiller"] },
    ijszee: { life: { brittlestar: 0.4, walrus: 0.6, polarbear: 0.4, albatross: 0.3 },
      visitors: ["bluewhale", "finwhale"] },
    diepzee: { life: { electricray: 0.2, brittlestar: 0.6, seacucumber: 0.5, featherstar: 0.3 },
      visitors: ["coelacanth", "bluewhale"] },
    grot: { life: { scorpionfish: 0.3, brittlestar: 0.5, seacucumber: 0.3, featherstar: 0.3 },
      visitors: ["coelacanth"] },
  };
  WATERS.forEach(w => { const e = WAVE4[w.name]; if (!e) return; Object.assign(w.life, e.life); w.visitors.push(...e.visitors); });

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
  const W3_PROPS = ["wheel", "idol", "phonebox", "sponges"];
  const W3_LIFE = ["parrotfish", "boxfish", "pistol", "sargassumfish", "spidercrab"];
  const W3_VIS = ["crocodile", "whaleshark", "sealion", "eagleray", "spermwhale"];
  const W3_RARE = ["aurora", "mobydick", "ghostdiver"];
  const W4_LIFE = ["triggerfish", "wrasse", "surgeonfish", "mandarinfish", "frogfish", "scorpionfish", "stonefish", "blenny", "goby", "needlefish", "electricray", "guitarfish", "sanddollar", "brittlestar", "seacucumber", "featherstar", "seasnake", "seakrait", "iguana", "albatross", "cormorant", "pelican", "walrus", "polarbear"];
  const W4_VIS = ["thresher", "whitetip", "greatwhite", "marlin", "tuna", "barracuda", "coelacanth", "sawfish", "bluewhale", "finwhale", "pilotwhale", "falsekiller"];
  PROP_KEYS.push(...NEW_PROPS, ...W3_PROPS); LIFE_KEYS.push(...NEW_LIFE, ...W3_LIFE, ...W4_LIFE); VIS_KEYS.push(...NEW_VIS, ...W3_VIS, ...W4_VIS); RARE_KEYS.push(...NEW_RARE, ...W3_RARE);
  AQ_ALL.push(...NEW_PROPS, ...NEW_LIFE, ...NEW_VIS, ...NEW_RARE, ...W3_PROPS, ...W3_LIFE, ...W3_VIS, ...W3_RARE, ...W4_LIFE, ...W4_VIS);
  const W5_RARE = ["ghostsub"];
  RARE_KEYS.push(...W5_RARE); AQ_ALL.push(...W5_RARE);
  // Keys that can no longer be chosen in the aquarium: animals taken out of the game, and the northern lights,
  // which became an ordinary weather moment. They keep their place in AQ_ALL, so older aquarium links still read correctly.
  const RETIRED = new Set(["whale", "shark", "frogfish", "blenny", "aurora"]);
  for (const list of [LIFE_KEYS, VIS_KEYS, RARE_KEYS]) for (let i = list.length - 1; i >= 0; i--) if (RETIRED.has(list[i])) list.splice(i, 1);
  // Only a few oceans hold something rare, and every rare thing has its own waters.
  const RARE_RATE = 0.15;
  const RARES_BY_WATER = {
    rif: ["mermaid", "goldpearl"], lagune: ["goldpearl", "mermaid"], diepzee: ["kraken", "megalodon", "whalefall", "ghostsub"],
    noordzee: ["ghost", "ghostdiver", "ghostsub"], kelpwoud: ["mermaid", "serpent"], ijszee: ["mobydick", "ghostsub"],
    mangrove: ["serpent"], grot: ["ghostdiver", "kraken"], sargasso: ["ghost", "mobydick", "megalodon", "whalefall"],
  };
  const MOMENT_KEYS = ["giant", "baitball", "spawning", "coralspawn", "storm", "eruption", "task", "jellybloom", "glowtide", "hatchlings", "whalesong",
    "eelmigration", "quake", "crabmarch", "bubblerings"];
  const NAMES = {
    "w:rif": "Koraalrif", "w:diepzee": "Diepzee", "w:noordzee": "Noordzee", "w:kelpwoud": "Kelpwoud", "w:ijszee": "IJszee",
    "w:mangrove": "Mangrove", "w:grot": "Onderwatergrot",
    amphora: "Amforen", car: "Gezonken auto", bell: "Scheepsbel", clam: "Reuzenschelp", seagrass: "Zeegrasveld",
    cassiopea: "Omgekeerde kwal", lionfish: "Koraalduivel", cuttlefish: "Zeekat", lobster: "Kreeft", nautilus: "Nautilus",
    isopod: "Reuzenpissebed", seadragon: "Bladzeedraak",
    manatee: "Zeekoe", orca: "Orka", hammerhead: "Hamerhaai", sunfish: "Maanvis", beluga: "Beluga",
    jellybloom: "Kwallenzwerm", glowtide: "Zeevonken", hatchlings: "Babyschildpadjes", whalesong: "Walvisgezang",
    serpent: "Zeeslang", megalodon: "Megalodon", goldpearl: "Gouden parel",
    "w:lagune": "Lagune", "w:sargasso": "Sargassozee",
    wheel: "Scheepsroer", idol: "Gouden beeldje", phonebox: "Telefooncel", sponges: "Sponzen",
    mimic: "Mimicoctopus", parrotfish: "Papegaaivis", boxfish: "Koffervis", pistol: "Pistoolgarnaal en wachtersgrondel", sargassumfish: "Sargassumvis", spidercrab: "Japanse reuzenkrab",
    crocodile: "Zeekrokodil", whaleshark: "Walvishaai", sealion: "Zeeleeuw", eagleray: "Adelaarsrog", spermwhale: "Potvis",
    eelmigration: "Palingtrek", quake: "Zeebeving", crabmarch: "Krabbentrek", bubblerings: "Bellenringen",
    aurora: "Noorderlicht", mobydick: "Witte potvis", ghostdiver: "Spookduiker", ghostsub: "Spookonderzeeër",
    triggerfish: "Trekkersvis", wrasse: "Lipvis", surgeonfish: "Doktersvis", mandarinfish: "Mandarijnvis",
    scorpionfish: "Schorpioenvis", stonefish: "Steenvis", goby: "Grondel", needlefish: "Naaldvis",
    thresher: "Voshaai", whitetip: "Witpuntrifhaai", greatwhite: "Witte haai", marlin: "Marlijn", tuna: "Tonijn", barracuda: "Barracuda", coelacanth: "Coelacant",
    electricray: "Sidderrog", guitarfish: "Vioolrog", sawfish: "Zaagvis",
    sanddollar: "Zanddollar", brittlestar: "Slangster", seacucumber: "Zeekomkommer", featherstar: "Haarster",
    seasnake: "Geelbuikzeeslang", seakrait: "Zeekrait", iguana: "Zeeleguaan",
    bluewhale: "Blauwe vinvis", finwhale: "Gewone vinvis", pilotwhale: "Griend", falsekiller: "Zwarte zwaardwalvis",
    albatross: "Albatros", cormorant: "Aalscholver", pelican: "Pelikaan", walrus: "Walrus", polarbear: "IJsbeer",
    wreck: "Piratenwrak", plane: "Vliegtuigwrak", chest: "Schatkist", treasure: "Opgegraven schat", anchor: "Anker", cannon: "Kanon",
    ruins: "Zuilen", statue: "Atlantis", city: "Gezonken stad", arch: "Rotsboog", helmet: "Duikerhelm", mine: "Zeemijn",
    bottle: "Flessenpost", skull: "Doodshoofd", coral: "Koraaltuin", anemone: "Anemoon", vent: "Heetwaterbron",
    volcano: "Onderzeese vulkaan", brine: "Pekelmeer", rocks: "Rotsblokken", canyon: "Afgrond",
    fish: "Scholen vissen", jelly: "Kwal", crab: "Krab", starfish: "Zeester", urchin: "Zee-egel", octopus: "Octopus",
    ray: "Pijlstaartrog", eels: "Zandalen", seahorse: "Zeepaardje", puffer: "Kogelvis", angler: "Hengelvis", moray: "Murene",
    squid: "Inktvisjes", hermit: "Heremietkreeft", slugs: "Zeenaaktslak", comb: "Ribkwal", lantern: "Lantaarnvis",
    otters: "Zeeotter", seal: "Zeehond", penguins: "Pinguïns", clown: "Clownvis", mantis: "Bidsprinkhaankreeft",
    archer: "Schuttersvis", cleaners: "Poetsvisjes", grouper: "Tandbaars", flyingfish: "Vliegende vis",
    humpback: "Bultrug", turtle: "Zeeschildpad", manta: "Manta", dolphins: "Dolfijnen",
    swordfish: "Zeilvis", sub: "Duikboot", narwhal: "Narwal",
    giant: "Reuzeninktvis", baitball: "Bait-ball", spawning: "Paaiende vissen", coralspawn: "Koraalpaai",
    storm: "Onweer", eruption: "Vulkaanuitbarsting", task: "Alle zeepaardjes gevonden",
    mermaid: "Zeemeermin", kraken: "Kraken", ghost: "Spookschip", whalefall: "Walvisval",
  };
  // The logbook in a sensible order: each group is split into small families, from warm to cold, from fish to mammals.
  const LOG_SUBS = {
    "Wateren": [
      ["Warm en ondiep", "Warm and shallow", ["w:lagune", "w:rif", "w:mangrove"]],
      ["Koel en open", "Cool and open", ["w:kelpwoud", "w:noordzee", "w:sargasso"]],
      ["Koud en donker", "Cold and dark", ["w:ijszee", "w:grot", "w:diepzee"]],
    ],
    "Dieren": [
      ["Vissen", "Fish", ["fish", "lantern", "clown", "cleaners", "grouper", "archer", "parrotfish", "boxfish", "puffer", "lionfish", "flyingfish", "angler", "sargassumfish", "moray", "eels",
        "triggerfish", "wrasse", "surgeonfish", "mandarinfish", "scorpionfish", "stonefish", "goby", "needlefish"]],
      ["Haaien en grote vissen", "Sharks and big fish", ["hammerhead", "whaleshark", "thresher", "whitetip", "greatwhite", "swordfish", "marlin", "tuna", "barracuda", "sunfish", "coelacanth"]],
      ["Roggen", "Rays", ["ray", "manta", "eagleray", "electricray", "guitarfish", "sawfish"]],
      ["Zeepaardjes en zeedraken", "Seahorses and seadragons", ["seahorse", "seadragon"]],
      ["Kwallen", "Jellies", ["jelly", "cassiopea", "comb"]],
      ["Inktvissen", "Cephalopods", ["octopus", "mimic", "squid", "giant", "cuttlefish", "nautilus"]],
      ["Schaaldieren", "Crustaceans", ["crab", "hermit", "lobster", "spidercrab", "mantis", "pistol", "isopod"]],
      ["Zeesterren, egels en slakken", "Starfish, urchins and slugs", ["starfish", "brittlestar", "featherstar", "urchin", "sanddollar", "seacucumber", "slugs"]],
      ["Koralen, sponzen en schelpen", "Corals, sponges and clams", ["coral", "anemone", "sponges", "clam"]],
      ["Reptielen", "Reptiles", ["turtle", "crocodile", "seasnake", "seakrait", "iguana"]],
      ["Walvissen en dolfijnen", "Whales and dolphins", ["dolphins", "orca", "falsekiller", "pilotwhale", "beluga", "narwhal", "humpback", "spermwhale", "finwhale", "bluewhale"]],
      ["Zoogdieren en vogels", "Mammals and birds", ["otters", "seal", "sealion", "walrus", "manatee", "polarbear", "penguins", "albatross", "cormorant", "pelican"]],
    ],
    "Momenten": [
      ["Weer en aarde", "Weather and earth", ["storm", "quake", "eruption", "glowtide", "aurora"]],
      ["Paaien en trekken", "Spawning and migration", ["coralspawn", "spawning", "jellybloom", "eelmigration", "crabmarch", "hatchlings"]],
      ["Dieren in actie", "Animals in action", ["baitball", "whalesong", "bubblerings"]],
      ["Speurtochten", "Quests", ["treasure", "task"]],
      ["Mensen op zee", "People at sea", ["sub"]],
    ],
    "Zeldzaam": [
      ["Legendes", "Legends", ["mermaid", "serpent", "kraken", "megalodon", "mobydick"]],
      ["Spoken", "Ghosts", ["ghost", "ghostdiver", "ghostsub"]],
      ["Wonderen", "Wonders", ["goldpearl", "whalefall"]],
    ],
  };
  const LOG_ALL = {
    "Wateren": WATERS.map(w => "w:" + w.name),
    "Dieren": ["fish", "jelly", ...LIFE_KEYS, "clown", "grouper", "giant", "mimic", ...VIS_KEYS.filter(k => k !== "sub"), "coral", "anemone", "sponges", "clam"],
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
  // so that every kind of shiny turns up about as often.
  const SHINY_N = {
    fish: 1000, lantern: 1000, jelly: 1000, crab: 1500, starfish: 600, urchin: 450, octopus: 150, ray: 150, eels: 1200,
    seahorse: 300, puffer: 150, angler: 150, squid: 750, hermit: 300, slugs: 450, comb: 600, otters: 300, seal: 1500,
    penguins: 3000, clown: 300, mantis: 150, archer: 150, cleaners: 450, grouper: 150, flyingfish: 900,
    humpback: 450, turtle: 450, manta: 450, dolphins: 1800, swordfish: 450, narwhal: 450, mermaid: 450,
    cassiopea: 600, lionfish: 150, cuttlefish: 150, lobster: 300, nautilus: 150, isopod: 300, seadragon: 150,
    manatee: 450, orca: 450, hammerhead: 450, sunfish: 450, beluga: 450,
    parrotfish: 150, boxfish: 150, pistol: 300, sargassumfish: 150, spidercrab: 300,
    crocodile: 450, whaleshark: 450, sealion: 450, eagleray: 450, spermwhale: 450,
    kraken: 100, ghost: 100, whalefall: 100, serpent: 100, megalodon: 100, goldpearl: 100, mobydick: 100, ghostdiver: 100, ghostsub: 100,
    hatchlings: 300, eelmigration: 1200, giant: 150, mimic: 150,
    triggerfish: 150, wrasse: 150, surgeonfish: 150, mandarinfish: 150, scorpionfish: 150, stonefish: 150, goby: 450, needlefish: 150,
    electricray: 150, guitarfish: 150, sanddollar: 600, brittlestar: 600, seacucumber: 450, featherstar: 300, seasnake: 150, seakrait: 150, iguana: 150,
    albatross: 150, cormorant: 150, pelican: 150, walrus: 150, polarbear: 150,
    thresher: 450, whitetip: 450, greatwhite: 450, marlin: 450, tuna: 450, barracuda: 450, coelacanth: 300, sawfish: 450, bluewhale: 450, finwhale: 450, pilotwhale: 450, falsekiller: 450,
  };
  // shinies are twice as easy to find as the base table above (it used to be five times: they had become too common)
  const SHINY_EASE = 2;
  for (const k in SHINY_N) SHINY_N[k] = Math.max(50, Math.round(SHINY_N[k] / SHINY_EASE));
  const shinyChance = key => 1 / (SHINY_N[key] || 200);
  const SHINY_KEYS = ["fish", "lantern", "jelly", "crab", "starfish", "urchin", "octopus", "ray", "eels", "seahorse", "puffer", "angler",
    "squid", "hermit", "slugs", "comb", "otters", "seal", "penguins", "clown", "mantis", "archer", "cleaners", "grouper", "flyingfish",
    "humpback", "turtle", "manta", "dolphins", "swordfish", "narwhal", "mermaid",
    "cassiopea", "lionfish", "cuttlefish", "lobster", "nautilus", "isopod", "seadragon", "manatee", "orca", "hammerhead", "sunfish", "beluga",
    "parrotfish", "boxfish", "pistol", "sargassumfish", "spidercrab", "crocodile", "whaleshark", "sealion", "eagleray", "spermwhale",
    "kraken", "ghost", "whalefall", "serpent", "megalodon", "goldpearl", "mobydick", "ghostdiver", "ghostsub",
    "hatchlings", "eelmigration", "giant", "mimic",
    "triggerfish", "wrasse", "surgeonfish", "mandarinfish", "scorpionfish", "stonefish", "goby", "needlefish", "electricray", "guitarfish", "sanddollar", "brittlestar", "seacucumber", "featherstar", "seasnake", "seakrait", "iguana", "albatross", "cormorant", "pelican", "walrus", "polarbear",
    "thresher", "whitetip", "greatwhite", "marlin", "tuna", "barracuda", "coelacanth", "sawfish", "bluewhale", "finwhale", "pilotwhale", "falsekiller"];
  const SHINY_NAMES = { fish: "schoolvis", eels: "zandaal", squid: "inktvisje", slugs: "zeenaaktslak", otters: "zeeotter", penguins: "pinguïn", cleaners: "poetsvisje", dolphins: "dolfijn",
    hatchlings: "babyschildpadje", eelmigration: "glasaaltje", giant: "reuzeninktvis" };
  for (const k of SHINY_KEYS) NAMES["shiny:" + k] = "Shiny " + (SHINY_NAMES[k] || NAMES[k].toLowerCase());
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

  const NAMES_EN = {
    "w:rif": "Coral reef", "w:diepzee": "Deep sea", "w:noordzee": "North Sea", "w:kelpwoud": "Kelp forest", "w:ijszee": "Polar sea",
    "w:mangrove": "Mangrove", "w:grot": "Underwater cave",
    amphora: "Amphorae", car: "Sunken car", bell: "Ship's bell", clam: "Giant clam", seagrass: "Seagrass meadow",
    cassiopea: "Upside-down jellyfish", lionfish: "Lionfish", cuttlefish: "Cuttlefish", lobster: "Lobster", nautilus: "Nautilus",
    isopod: "Giant isopod", seadragon: "Leafy seadragon",
    manatee: "Manatee", orca: "Orca", hammerhead: "Hammerhead shark", sunfish: "Ocean sunfish", beluga: "Beluga",
    jellybloom: "Jellyfish swarm", glowtide: "Sea sparkle", hatchlings: "Turtle hatchlings", whalesong: "Whale song",
    serpent: "Sea serpent", megalodon: "Megalodon", goldpearl: "Golden pearl",
    "w:lagune": "Lagoon", "w:sargasso": "Sargasso Sea",
    wheel: "Ship's wheel", idol: "Golden idol", phonebox: "Phone box", sponges: "Sponges",
    mimic: "Mimic octopus", parrotfish: "Parrotfish", boxfish: "Boxfish", pistol: "Pistol shrimp and watchman goby", sargassumfish: "Sargassum fish", spidercrab: "Japanese spider crab",
    crocodile: "Saltwater crocodile", whaleshark: "Whale shark", sealion: "Sea lion", eagleray: "Spotted eagle ray", spermwhale: "Sperm whale",
    eelmigration: "Eel migration", quake: "Seaquake", crabmarch: "Crab march", bubblerings: "Bubble rings",
    aurora: "Northern lights", mobydick: "White sperm whale", ghostdiver: "Ghost diver", ghostsub: "Ghost submarine",
    triggerfish: "Triggerfish", wrasse: "Wrasse", surgeonfish: "Surgeonfish", mandarinfish: "Mandarinfish",
    scorpionfish: "Scorpionfish", stonefish: "Stonefish", goby: "Goby", needlefish: "Needlefish",
    thresher: "Thresher shark", whitetip: "Whitetip reef shark", greatwhite: "Great white shark", marlin: "Marlin", tuna: "Tuna", barracuda: "Barracuda", coelacanth: "Coelacanth",
    electricray: "Electric ray", guitarfish: "Guitarfish", sawfish: "Sawfish",
    sanddollar: "Sand dollar", brittlestar: "Brittle star", seacucumber: "Sea cucumber", featherstar: "Feather star",
    seasnake: "Sea snake", seakrait: "Sea krait", iguana: "Marine iguana",
    bluewhale: "Blue whale", finwhale: "Fin whale", pilotwhale: "Pilot whale", falsekiller: "False killer whale",
    albatross: "Albatross", cormorant: "Cormorant", pelican: "Pelican", walrus: "Walrus", polarbear: "Polar bear",
    wreck: "Pirate wreck", plane: "Plane wreck", chest: "Treasure chest", treasure: "Dug-up treasure", anchor: "Anchor", cannon: "Cannon",
    ruins: "Columns", statue: "Atlantis", city: "Sunken town", arch: "Rock arch", helmet: "Diving helmet", mine: "Sea mine",
    bottle: "Message in a bottle", skull: "Skull", coral: "Coral garden", anemone: "Anemone", vent: "Hydrothermal vent",
    volcano: "Undersea volcano", brine: "Brine pool", rocks: "Boulders", canyon: "Abyss",
    fish: "Fish schools", jelly: "Jellyfish", crab: "Crab", starfish: "Starfish", urchin: "Sea urchin", octopus: "Octopus",
    ray: "Stingray", eels: "Garden eels", seahorse: "Seahorse", puffer: "Pufferfish", angler: "Anglerfish", moray: "Moray eel",
    squid: "Squid", hermit: "Hermit crab", slugs: "Sea slug", comb: "Comb jelly", lantern: "Lanternfish",
    otters: "Sea otter", seal: "Seal", penguins: "Penguins", clown: "Clownfish", mantis: "Mantis shrimp",
    archer: "Archerfish", cleaners: "Cleaner wrasse", grouper: "Grouper", flyingfish: "Flying fish",
    humpback: "Humpback whale", turtle: "Sea turtle", manta: "Manta ray", dolphins: "Dolphins",
    swordfish: "Sailfish", sub: "Submarine", narwhal: "Narwhal",
    giant: "Giant squid", baitball: "Bait ball", spawning: "Spawning fish", coralspawn: "Coral spawning",
    storm: "Thunderstorm", eruption: "Volcanic eruption", task: "All seahorses found",
    mermaid: "Mermaid", kraken: "Kraken", ghost: "Ghost ship", whalefall: "Whale fall",
  };
  const SHINY_NAMES_EN = { fish: "school fish", eels: "garden eel", slugs: "sea slug", otters: "sea otter", penguins: "penguin", cleaners: "cleaner wrasse", dolphins: "dolphin",
    hatchlings: "turtle hatchling", eelmigration: "glass eel", giant: "giant squid" };
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
  function seen(key, pos) {
    if (!NAMES[key] || rebuilding || !LOGGABLE.has(key)) return;
    const entry = logbook.get(key);
    if (entry) { entry.n++; saveLog(); return; }
    const before = reached();
    const d = new Date();
    logbook.set(key, { n: 1, first: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` });
    saveLog();
    fresh.add(key); saveFresh();
    announceNew(key);
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
      toast(L("Nieuw in je logboek: ", "New in your logbook: ") + list);
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
  const allOf = (id, nl, en, title, wordNl, wordEn) => ({ id, name: [nl, en], goal: [`alle ${groupKeys(title).length} ${wordNl}`, `all ${groupKeys(title).length} ${wordEn}`], prog: () => [groupHave(title), groupKeys(title).length], reward: null });
  const MILESTONES = [
    tier("m10", "Ontdekker", "Explorer", 10, "elke 75 seconden een nieuwe oceaan", "a new ocean every 75 seconds"),
    tier("m25", "Zeekenner", "Sea expert", 25, "elke 30 seconden een nieuwe oceaan", "a new ocean every 30 seconds"),
    tier("m50", "Oceanograaf", "Oceanographer", 50, "een echte zaklamp voor je duiker en elke 15 seconden een nieuwe oceaan", "a proper torch for your diver and a new ocean every 15 seconds"),
    tier("m75", "Duikmeester", "Dive master", 75, "een fellere, bredere duiklamp en elke 7,5 seconden een nieuwe oceaan", "a brighter, wider diving lamp and a new ocean every 7.5 seconds"),
    tier("m100", "Zeeheld", "Sea hero", 90, "gouden randjes in je logboek en elke 5 seconden een nieuwe oceaan", "golden edges in your logbook and a new ocean every 5 seconds"),
    { id: "mall", name: ["Meester van de zee", "Master of the sea"], goal: ["alles gevonden", "everything found"], prog: () => [foundCount(), BASE_LOG_KEYS.length], reward: ["elke seconde een nieuwe oceaan", "a new ocean every second"] },
    shinyTier("s1", "Eerste shiny", "First shiny", 1),
    shinyTier("s5", "Glinsterzoeker", "Sparkle seeker", 5),
    shinyTier("s15", "Shinyjager", "Shiny hunter", 15),
    shinyTier("s30", "Shinyverzamelaar", "Shiny collector", 30, "een spoor van sterretjes achter je duiker", "a trail of stars behind your diver"),
    { id: "sall", name: ["Glimmende legende", "Shining legend"], goal: ["alle shiny's", "every shiny"], prog: () => [shinyCount(), SHINY_KEYS.length], reward: null },
    allOf("gw", "Wereldreiziger", "Globetrotter", "Wateren", "wateren", "waters"),
    allOf("ga", "Bioloog", "Biologist", "Dieren", "dieren", "animals"),
    { id: "gv", name: ["Gastvrij", "Welcoming host"], goal: [`alle ${VIS_KEYS.length} bezoekers`, `all ${VIS_KEYS.length} visitors`], prog: () => [VIS_KEYS.filter(k => logbook.has(k)).length, VIS_KEYS.length], reward: null },
    allOf("gm", "Oog voor het moment", "Moment catcher", "Momenten", "momenten", "moments"),
    allOf("gr", "Mythejager", "Myth hunter", "Zeldzaam", "zeldzame dingen", "rare things"),
    { id: "ph", name: ["Fotograaf", "Photographer"], goal: ["5 foto's in je album", "5 photos in your album"], prog: () => [typeof album === "undefined" ? 0 : album.length, 5], reward: null },
  ];
  for (const m of MILESTONES) m.need = () => { const [a, b] = m.prog(); return a >= b; };
  let rewards = new Set();
  const reached = () => MILESTONES.filter(m => m.need()).map(m => m.id);
  function applyRewards() {
    rewards = new Set(reached());
    bookBtn.dataset.rank = MILESTONES.every(m => rewards.has(m.id)) ? "gold" : "";
    bookBtn.classList.remove("glitter");
    panelEl.classList.toggle("gilded", rewards.has("m100"));
  }
  function checkMilestones(before) {
    for (const id of reached()) {
      if (before.includes(id)) continue;
      const m = MILESTONES.find(x => x.id === id);
      toast(m.reward ? L(`Mijlpaal: ${m.name[0]}! Je krijgt ${m.reward[0]}.`, `Milestone: ${m.name[1]}! You get ${m.reward[1]}.`) : L(`Mijlpaal: ${m.name[0]}!`, `Milestone: ${m.name[1]}!`));
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

  // ---- shiny animals ----------------------------------------------------
  // Creatures that exist when the ocean is built are rolled from the seed, so a shared seed keeps its shinies.
  function registerShinies(s) {
    const sr = mulberry32((seed ^ 0x9e3779b9) >>> 0);
    const list = [];
    // obj is the creature that gets recoloured; get() says where it is, for the glints and the logbook
    const add = (key, obj, r, get, alive) => { if (sr() < shinyChance(key)) { obj.shiny = key; list.push({ key, obj, r, get, alive }); } };
    const tag = (obj, hue) => { obj.shinyBase = hue; return obj; };
    const floorY = x => sandY(x) + 5 * u;
    for (const sp of s.species) for (const f of sp.fish) add(sp.lantern ? "lantern" : "fish", sp.lantern ? f : tag(f, hexHue(sp.main)), sp.size * u, () => [f.x, f.y], () => sp.fish.includes(f));
    for (const j of s.jellies) { const [r, g, b] = j.col.split(",").map(Number); add("jelly", tag(j, rgbHue(r, g, b)), j.r, () => [j.x, j.y - j.r * 0.3]); }
    for (const c of s.crabs) add("crab", tag(c, hexHue(c.color)), c.s * 0.8, () => [c.x, floorY(c.x) - c.s * 0.45]);
    for (const f of s.starfish) add("starfish", tag(f, hexHue(f.color)), f.s * 0.8, () => [f.x, sandY(f.x) + 3 * u - f.s * 0.55]);
    for (const o of s.urchins) add("urchin", o, o.s, () => [o.x, floorY(o.x) - o.s * 0.4]);
    if (s.octopus) { const o = s.octopus; add("octopus", o, o.s * 0.8, () => [o.x, floorY(o.x) - o.s * 0.9]); }
    if (s.ray) {
      const r = s.ray;
      add("ray", r, r.s * 0.5, () => [r.x, Math.min(sandY(r.x), H * (1 - s.sand.frac) + 12 * u) + 6 * u - r.lift - Math.sin(r.ph * 0.3) * 6 * u]);
    }
    for (const g of s.ground) {
      if (g.kind === "eels") for (const e of g.eels) add("eels", e, 5 * u, () => [g.x + e.dx, sandY(g.x + e.dx) + 6 * u - e.h * g.e * 0.6], () => g.e > 0.3);
      if (g.kind === "anemone" && g.clown) {
        g.clownObjs = [{}, {}];
        g.clownObjs.forEach((o, i) => add("clown", o, g.s * 0.35, () => {
          const a = t * 0.9 + i * Math.PI;
          return [g.x + Math.cos(a) * g.s * 1.3, sandY(g.x) + 5 * u - g.s * 1.3 + Math.sin(a * 1.3) * g.s * 0.35];
        }));
      }
    }
    for (const h of s.seahorses) add("seahorse", tag(h, hexHue(h.color)), h.s * 0.6, () => [h.x + Math.sin(t * 0.3 + h.ph) * 10 * u, sandY(h.x) - h.lift + Math.sin(t * 0.8 + h.ph) * 10 * u - h.s * 0.3]);
    if (s.puffer) { const pf = s.puffer; add("puffer", pf, pf.s, () => [pf.x, pf.y]); }
    if (s.angler) { const a = s.angler; add("angler", a, a.s * 0.7, () => [a.x, a.y + Math.sin(a.ph) * 8 * u]); }
    for (const q of s.squids) add("squid", q, q.s * 0.7, () => [q.x, q.y]);
    for (const h of s.hermits) add("hermit", h, h.s * 0.7, () => [h.x, floorY(h.x) - h.s * 0.6]);
    for (const o of s.slugs) add("slugs", tag(o, o.type === "nudi" ? hexHue(o.body) : hexHue(o.color)), o.s * 0.7, () => [o.x, floorY(o.x) - o.s * 0.3]);
    for (const c of s.combs) add("comb", c, c.r * 0.7, () => [c.x, c.y]);
    for (const o of s.otters) add("otters", o, o.s * 0.5, () => [o.x, waveY(o.x)]);
    if (s.seal) { const se = s.seal; add("seal", se, se.s * 0.4, () => [se.x, se.y !== undefined ? se.y : se.y0]); }
    for (const pg of s.penguins) add("penguins", pg, pg.s * 0.7, () => [pg.x, waveY(pg.x) + 6 * u + Math.max(0, Math.sin((pg.ph % TAU) * 0.5)) * pg.depth]);
    if (s.mantis) { const m = s.mantis; add("mantis", m, m.s * 0.6, () => [m.x, sandY(m.x) + 6 * u - m.s * 0.7]); }
    if (s.archer) { const a = s.archer; add("archer", a, a.s * 0.8, () => [a.x, waveY(a.x) + 28 * u]); }
    if (s.station) {
      const st = s.station, gp = st.grouper;
      add("grouper", gp, gp.s * 0.7, () => [gp.x, gp.y]);
      st.cleanObjs = [{}, {}, {}];
      st.cleanObjs.forEach((o, i) => add("cleaners", o, 4 * u, () => st["c" + i] || [st.x, sandY(st.x) - 55 * u]));
    }
    registerMoreShinies(s, add, tag);
    registerWave2Shinies(s, add);
    registerRareShinies(s, add);
    registerFaunaShinies(s, add);
    s.shinies = list;
  }

  // ---- shiny colour schemes ---------------------------------------------------------
  // Like a shiny Pokémon, a shiny animal keeps its shape and pattern but gets a whole colour scheme of its own,
  // chosen per animal, often after real colour morphs (albino, black, golden, blue, white).
  // map: every colour the drawing uses gets its own replacement. Colours that are not in the map (the ones that come
  // from the water or by chance, like the colours of a school or a crab) follow the rule: a hue for the light,
  // middle and dark tones, so dark fins and a light body can still end up in different colours.
  function pal(map, rule = {}) {
    const m = {};
    for (const pair of map.split(/\s+/).filter(Boolean)) { const [a, b] = pair.split(">"); m[a.toLowerCase()] = b.toLowerCase(); }
    return Object.assign({ map: m, cache: new Map() }, rule);
  }
  const SHINY_PAL = {
    // fish
    fish: pal("#f2b134>#f06a9a #8a5810>#5a2a8a", { hue: 335, hueDark: 270, hueLight: 48, sat: 1.1 }),
    lantern: pal("#1c2633>#6a1838 #0b1119>#2a0612"),
    clown: pal("#f07c1e>#2e2026 #1d1d1d>#f2801e #fbfbf6>#fbfbf6"),
    cleaners: pal("#58b4f2>#f6d838 #10202e>#7a2ac8"),
    grouper: pal("#7a5a3a>#e8b828 #3e2c1c>#9a6a08 #5a3f26>#c89418"),
    archer: pal("#d9dfe0>#f2cc48 #2a2e30>#1c3a6e"),
    parrotfish: pal("#f08ab0>#f6e44a #f2c060>#e85aa0 #f2eee0>#f8f4ff", { hue: 212, sat: 1.1 }),
    boxfish: pal("#f2d030>#3a86d8 #b89818>#1c4888 #e8a030>#f2d030"),
    puffer: pal("#e8c66a>#384a6c #6b5a2a>#f4f2ea #f6efd8>#efe2f2 #fbfbf6>#ffffff"),
    lionfish: pal("#c84a3a>#2a2230 #b8392c>#161218 #f2e6d8>#f2e6d8 #e8c8b0>#c8a6ec"),
    flyingfish: pal("#4f86c6>#e8583a #24466e>#8a1c2a #dfe8ef>#fff2e2"),
    angler: pal("#1b1e26>#5c2c14 #070709>#2a0e06 #b8d8e8>#ff9a3a #e9e4d2>#fff6d8"),
    sargassumfish: pal("#b8902e>#c84a2a #6a5218>#6a1c12 #c8a840>#c8a840 #a89030>#a89030 #7a6a24>#7a6a24"),
    triggerfish: pal("#f2ead6>#2c2c3c #bfae7a>#5c4c8c #1e1e22>#f2f0e8 #3a7fe0>#f2b820 #f2b820>#e84a8a #6a6450>#c8c0e0"),
    wrasse: pal("#3fbf8a>#ec9a2c #2fa0b0>#d84a6a #e8609a>#3a8ad8 #f070b0>#5ad0f0 #f2c840>#7a3ad8"),
    surgeonfish: pal("#2f5fe0>#f4ca2c #0e1430>#2a62e0 #f2d030>#0e1430"),
    mandarinfish: pal("#2f6fe0>#e2402a #f08a30>#36d6e0 #3fc0a0>#f2d030 #f2c030>#2fe070"),
    needlefish: pal("#c8d8e0>#ecd8a0 #3a8a7a>#2a48d8"),
    scorpionfish: pal("#b84a3a>#ecc84a #7a2a20>#8a6a10 #e8b8a0>#faf2e2"),
    stonefish: pal("#5a5246>#c84a3a #3a3228>#7a1e18 #7a7060>#ea705a #6a8a5a>#f2c040"),
    goby: pal("#d8c8a0>#5ac0e8 #9a7a4a>#2a6a9a #8a6a3a>#f2f040"),
    pistol: pal("#e8603a>#3a86d8 #f2d0a0>#f2f0fa #f0a070>#a0c8f0 #f2c830>#ea5070 #c8961a>#a02848 #4aa8f0>#f2e040"),
    eels: pal("#e8e0c8>#f2a03a #2a2620>#fbf6ea"),
    // sharks and big fish: every one its own colours
    thresher: pal("#5a6a8a>#8a3a6a #dfe4ea>#f4e2ec"),
    whitetip: pal("#7a8288>#34343c #d8dcdf>#c8ccd6 #f4f4f4>#ffd040"),
    greatwhite: pal("#5e6870>#1a1e24 #f2f2ee>#e8d6b0"),
    hammerhead: pal("#7a8a94>#a87a48 #4a5862>#6a4a2a #d8dde0>#f4e8d2"),
    whaleshark: pal("#3a5068>#e2dccf #dfe8ee>#3a5a78 #c8d4dc>#f6f2ea"),
    swordfish: pal("#2d4f8a>#1c1a26 #1e335a>#d8a020 #3a5fa8>#e8b830 #8ab8e8>#f4e8a0 #c9d4dc>#d8d0c0"),
    marlin: pal("#1e3a6a>#4a1a6a #6ab0e8>#f2c040 #c8d8e8>#ecdcf2"),
    tuna: pal("#1e3050>#2a5a3a #c8d4dc>#ece2c8 #f2d030>#e84a6a"),
    barracuda: pal("#b8c4cc>#dab878 #4a5862>#6a4a20 #d8e0e4>#f4e8c8"),
    sunfish: pal("#9aa4ae>#c8a8d8 #6a747e>#8a6aa0 #c8d0d6>#f4eaf8"),
    coelacanth: pal("#2a3a5a>#7a5a3a #3a4c70>#9a7a4a #1e2c46>#5a3e24 #e8eef2>#f2d880 #c8d8a0>#3ad8ff"),
    sawfish: pal("#9a8a6a>#6a7a8a #8a7a5a>#4a5a6a #e8e0cc>#e8f0f4 #f2ead8>#f8fafc"),
    // rays
    ray: pal("#7c6a55>#cac4b8 #3e342a>#2b5a8a #4a3e30>#7a7466"),
    manta: pal("#121a22>#2a5aa8 #dce6eb>#f4f0e0"),
    eagleray: pal("#2a3442>#f2e8d8 #e8eef2>#2a3442"),
    electricray: pal("#8a5a3a>#3a4a8a #5e3a24>#f2d040"),
    guitarfish: pal("#c8a878>#8a9aa8 #8a6a48>#4a5a68 #e8d4a8>#f2f6fa"),
    // seahorses, jellies, cephalopods
    seahorse: pal("", { hue: 332, hueDark: 300, lit: 0.05, sat: 1.1 }),
    seadragon: pal("#9aa040>#c8508a #d8a040>#e85a3a"),
    jelly: pal("", { hue: 42, hueLight: 46, sat: 1.5, lit: -0.24 }),
    cassiopea: pal("#c8bc90>#3a6ad8 #a89c70>#2a4aa8 #f0ecc0>#f2f0ff", { hue: 222 }),
    comb: pal("", { body: "#ffd24a" }),
    octopus: pal("#f2c34a>#d8203a #f4ecd8>#fff0f2", { hue: 340, sat: 0.4, lit: 0.28, bodyHue: 345, bodySat: 40, bodyLight: 1.45 }),
    squid: pal("", { body: "#4a7af0" }),
    cuttlefish: pal("#c8a888>#f2d04a #b08860>#8a3a8a #a07850>#6a2a7a #ece6dc>#f8e8f8"),
    nautilus: pal("#f2e8d8>#2c2c3c #b0603a>#e8c040 #e8c8a8>#5a5a74 #b07858>#c8a030 #c8b8a0>#44445a"),
    giant: pal("#8a2e2a>#e8e8f0 #5a1a18>#a8a8c0 #c86a5a>#5a7ad8"),
    // crustaceans
    crab: pal("#5a2418>#14304a", { hue: 205, sat: 0.95 }),
    hermit: pal("#d9543b>#2a8a7a #c9603c>#1f6a5e", { hue: 296, sat: 0.9 }),
    lobster: pal("#2f4a78>#e8902a #1c2c4a>#5a2a14 #5a78a8>#f2c860 #a05a3a>#3a2a2a"),
    spidercrab: pal("#d8783a>#e8e0d0 #f0d8b0>#c84a5a"),
    mantis: pal("#57c27c>#c84ab8 #6fd3e0>#f2e04a #e8553a>#3a6ae8 #e8b03c>#ffffff #f08a3c>#7a3ad8 #2f8f5a>#8a2a7a #3a7fd0>#e8a020 #3fa86b>#a8389a"),
    isopod: pal("#a898a8>#e8c060 #8a7a8a>#b88a20 #857585>#a87810 #b8a8b8>#f2d888"),
    // starfish, urchins, slugs and the rest of the floor
    starfish: pal("", { hue: 268, lit: -0.04 }),
    urchin: pal("", { hue: 142, sat: 0.8, lit: 0.12 }),
    slugs: pal("#e8d8b0>#f2d030", { hue: 48, hueLight: 186, hueDark: 20, sat: 1.1 }),
    sanddollar: pal("#c8b8c8>#3a3a5a #a898a8>#2a2a40 #f0e8f0>#f2d870"),
    brittlestar: pal("#d88ab8>#5ad0c0 #b86a9a>#2a9a8a"),
    seacucumber: pal("#8a5a40>#f2d030 #6a4030>#c83a2a #e8c8a0>#e83a8a"),
    featherstar: pal("#e8603a>#7a3ad8 #f2c030>#e85ab0", { hue: 285 }),
    // reptiles
    turtle: pal("#6a5434>#2a6a8a #3b301f>#e8c040 #7d8a6a>#e8d8a0 #5d6a4c>#c8a860 #d8c890>#f6f0e0"),
    hatchlings: pal("#5a5e48>#e8e0d0 #4a4430>#c8bca8 #6e6648>#f2ead8 #c8c098>#fffaf0"),
    crocodile: pal("#5a6a3a>#e8d8c0 #3a4628>#c8b090 #b8b088>#f8f0e0 #f0f0e0>#ffffff"),
    seasnake: pal("#1a1a1a>#e8e4f0 #f2c830>#c83a3a"),
    seakrait: pal("#6a9ad8>#f2e8d0 #141820>#c8302a #f2c830>#141820"),
    iguana: pal("#3a4040>#c8402a #262c2c>#2a6a3a #6a7068>#3aa060"),
    // whales and dolphins
    dolphins: pal("#7d8f9c>#e8a0b0 #4f5f6b>#c8708a #d5dde0>#fbe6ea"),
    orca: pal("#14181c>#f2f0ec #f0f0ea>#1a2230 #9aa2a8>#c8ccd0"),
    beluga: pal("#eef2f2>#6a7a8a #c8d2d6>#4a5a6a #8a9498>#2a3440"),
    narwhal: pal("#8e969a>#2a2e3a #4a5256>#e8ecf0 #6e767a>#1a1e28 #c8ccce>#5a6070 #ece4cc>#f2d880 #a89e84>#c8a040"),
    humpback: pal("#26313b>#e8e8e4 #c9cfd2>#ffffff #dfe3e2>#f8f8f6 #7d878c>#b8bcbc #8a949a>#c8ccca"),
    spermwhale: pal("#5a6068>#8a4a3a #3a3e44>#5a2a20"),
    bluewhale: pal("#5a7a98>#2a3a5a #8aa4b8>#e8d8a0"),
    finwhale: pal("#3e4650>#5a4a3a #e8eaea>#f2e6d0"),
    pilotwhale: pal("#22262a>#5a6a7a"),
    falsekiller: pal("#16181a>#3a2a4a"),
    // mammals and birds
    seal: pal("#6f7478>#e8e4dc #3e4246>#a8a29a #a9aca8>#ffffff"),
    sealion: pal("#7a5a3a>#b0b8c0 #5a4028>#7a8490 #a88a64>#d8dce0"),
    otters: pal("#5a3e2a>#e8dcc8 #c9b49a>#fff6e8 #e6c9a8>#f2e2c8"),
    manatee: pal("#8a8a80>#a8c0a0 #5a5a52>#6a8a68"),
    penguins: pal("#15181c>#8a6a4a #f2f2ec>#fbf6ee #f29a2e>#e8604a #f2be3c>#f2e0a0"),
    walrus: pal("#b4806a>#c8c8d0 #8a5a48>#8a8a98 #d4a48c>#e8e8f0 #f4ecd8>#f2d060"),
    polarbear: pal("#f4f0e2>#c8a070 #d6cfba>#a07a50"),
    albatross: pal("#f6f6f2>#f2e6c8 #d8dadc>#e0c890 #3a3a42>#6a3a20 #2a2a30>#4a2a14 #f0b0a0>#e8c040 #d88a78>#c89a20 #f0b8a0>#e8c040"),
    pelican: pal("#f4f0e4>#f8d8dc #c8c4b8>#e8b0b8 #2a2a2a>#3a2a2a #e89838>#e85a7a #f2c878>#f2a0b0 #f2d8a8>#f8c8d0"),
    cormorant: pal("#1e2226>#f0f0ea #2e4a3a>#c8d0c8 #e8b040>#e8603a"),
    // legends and wonders
    mermaid: pal("#2fa58f>#c83a6a #7fd8c9>#f2a0c0 #8a5ad0>#2fa58f #b5452f>#f2e0a0 #d9a07a>#d9a07a"),
    serpent: pal("#2f6a4a>#3a2a6a #1a3a28>#1a1238 #a8c070>#f2c860 #c84a3a>#3ad8c0"),
    kraken: pal("#6a1f2e>#1f5a4a #e0a0a0>#f2d060 #4a1420>#123a30"),
    megalodon: pal("#040a12>#5a1414"),
    mobydick: pal("#eceae4>#e8c860 #a8a6a0>#a88a30"),
    whalefall: pal("#ddd6c2>#f2d880 #c98a8a>#7a5ad8"),
    goldpearl: pal("#f2c440>#ff7ac8 #a89c88>#2a2a3a #d8d0c0>#4a4a6a"),
    ghostdiver: pal("#96ffd7>#c8a0ff #cdffeb>#ecdcff #061e20>#1a0830"),
    eelmigration: pal("", { body: "#f2c040" }),
  };
  // Swap one colour for its shiny colour (only "#rrggbb" colours; everything else stays as it is).
  function shinySwap(hex) {
    const p = shinyPal;
    if (!p || typeof hex !== "string" || hex.length !== 7 || hex[0] !== "#") return hex;
    const k = hex.toLowerCase();
    if (p.map[k]) return p.map[k];
    let v = p.cache.get(k);
    if (!v) { v = shinyRule(k, p); p.cache.set(k, v); }
    return v;
  }
  function shinyRule(hex, p) {
    const [r, g, b] = hexRgb(hex).map(c => c / 255);
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let l = (mx + mn) / 2, s = d ? d / (1 - Math.abs(2 * l - 1)) : 0, h = d ? rgbHue(r * 255, g * 255, b * 255) : 0;
    let target = p.hue;
    if (p.hueDark !== undefined && l < 0.33) target = p.hueDark;
    else if (p.hueLight !== undefined && l > 0.72) target = p.hueLight;
    if (target !== undefined) { h = target; if (s < 0.12) s = 0.45; }
    else h = (h + (p.rot !== undefined ? p.rot : 150)) % 360;
    s = Math.max(0, Math.min(1, s * (p.sat || 1)));
    l = Math.max(0.03, Math.min(0.97, l + (p.lit || 0)));
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
    const [rr, gg, bb] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return "#" + [rr, gg, bb].map(v => Math.round((v + m) * 255).toString(16).padStart(2, "0")).join("");
  }
  // for colours that are not mixed with the water: the shiny colour if a shiny is being drawn
  const sc = hex => shinyPal ? shinySwap(hex) : hex;
  const sca = (hex, a) => { const [r, g, b] = hexRgb(sc(hex)); return `rgba(${r},${g},${b},${a})`; };
  // a scheme's own body colour, used as it is
  const rgbaOf = (hex, a) => { const [r, g, b] = hexRgb(hex); return `rgba(${r},${g},${b},${a})`; };
  // an "r,g,b" colour, as the jellies use
  function scTriplet(rgb) {
    if (!shinyPal) return rgb;
    const hex = "#" + rgb.split(",").map(v => (+v).toString(16).padStart(2, "0")).join("");
    return hexRgb(shinySwap(hex)).join(",");
  }

  // Things without a scheme of their own (the ghost ship is a ready-made picture) get one colour over everything,
  // far round the colour wheel from their own colour.
  const BASE_HUE = {
    octopus: 18, ray: 30, eels: 45, puffer: 45, squid: 340, hermit: 15, otters: 25, clown: 25, mantis: 140, archer: 190,
    cleaners: 205, grouper: 30, turtle: 40, swordfish: 220, mermaid: 170, urchin: 290, comb: 200, angler: 220,
    humpback: 210, manta: 210, dolphins: 205, narwhal: 200, seal: 210, penguins: 210, lantern: 215,
  };
  // The rare things can be shiny too; they are rolled with the ocean, so a shared seed keeps them.
  function registerRareShinies(s, add) {
    const R = s.rares;
    if (R.includes("kraken")) add("kraken", s.kraken, 70 * u, () => s.kraken.eye ? [s.kraken.eye.x, s.kraken.eye.y] : [W / 2, H + 100], () => s.kraken.active && s.kraken.reach > 0.4);
    if (R.includes("ghost") && s.ghost) add("ghost", s.ghost, 90 * u, () => [s.ghost.x, s.ghost.y]);
    for (const g of s.ground) {
      if (g.kind === "whalefall") add("whalefall", g, g.w * 0.3, () => [g.x, sandY(g.x) - 15 * u]);
      if (g.kind === "clam" && g.pearl === "gold") add("goldpearl", g, g.s, () => [g.x, sandY(g.x) - g.s * 0.4], () => g.pearl === "gold");
    }
    if (R.includes("serpent")) add("serpent", s.serpent, 34 * u, () => [s.serpent.hx === undefined ? -999 : s.serpent.hx, s.serpent.hy || 0], () => s.serpent.active);
    if (R.includes("megalodon")) add("megalodon", s.megalodon, 120 * u, () => [s.megalodon.x, s.megalodon.y], () => s.megalodon.active);
    if (R.includes("mobydick")) add("mobydick", s.moby, 100 * u, () => [s.moby.x, s.moby.y], () => s.moby.active);
    if (s.ghostDiver) add("ghostdiver", s.ghostDiver, 24 * u, () => [s.ghostDiver.x, s.ghostDiver.cy || s.ghostDiver.y]);
  }
  Object.assign(BASE_HUE, { hatchlings: 60, eelmigration: 200, giant: 0 });
  Object.assign(BASE_HUE, { kraken: 350, ghost: 160, whalefall: 40, serpent: 140, megalodon: 210, goldpearl: 45, mobydick: 50, ghostdiver: 160 });

  // A creature that has left and come back (or is new) gets a fresh shiny roll.
  function maybeShiny(key, obj, r, get, alive) {
    // only creatures that have really gone are tidied away; a kraken that is resting stays on the list
    scene.shinies = scene.shinies.filter(e => e.obj !== obj && !(e.temp && e.alive && !e.alive()));
    delete obj.shiny;
    if (Math.random() < shinyChance(key)) { obj.shiny = key; scene.shinies.push({ key, obj, r, get, alive, temp: true }); }
  }

  // ---- coming and going ----------------------------------------------------
  // Now and then a school swims off or a crab walks away, and new ones arrive, each with its own shiny chance.
  function updateTurnover(dtSec) {
    const S = scene;
    S.turnTimer -= dtSec;
    if (S.turnTimer > 0) return;
    S.turnTimer = 14 + Math.random() * 18;
    const schools = S.species.filter(sp => !sp.leaving && sp.fish.length && !sp.fish.some(f => f.shiny));
    const crabExit = S.floorL <= 0 || S.floorR >= W;
    const options = [];
    if (schools.length) options.push("school");
    const leavers = S.crabs.filter(c => !c.shiny);
    if (leavers.length && crabExit && !S.crabs.some(c => c.leaving)) options.push("crab");
    if (!options.length) return;
    if (options[Math.floor(Math.random() * options.length)] === "school") {
      const sp = schools[Math.floor(Math.random() * schools.length)];
      let cx = 0;
      for (const f of sp.fish) cx += f.x;
      sp.leaving = cx / sp.fish.length < W / 2 ? -1 : 1;
    } else {
      const c = leavers[Math.floor(Math.random() * leavers.length)];
      const leftOk = S.floorL <= 0, rightOk = S.floorR >= W;
      c.leaving = leftOk && (!rightOk || c.x < W / 2) ? -1 : 1;
      c.dir = c.leaving; c.pause = 0;
    }
  }

  function renewSchool(sp) {
    const pal = water.fish[Math.floor(Math.random() * water.fish.length)];
    if (!sp.lantern) { sp.main = pal[0]; sp.dark = pal[1]; }
    sp.leaving = 0;
    const from = Math.random() < 0.5 ? -1 : 1, n = sp.predator ? Math.min(12, sp.count) : sp.count, cy = H * sp.bandC;
    sp.fish = Array.from({ length: n }, () => {
      const f = {
        x: from < 0 ? -60 * u - Math.random() * 140 * u : W + 60 * u + Math.random() * 140 * u,
        y: cy + (Math.random() - 0.5) * 80 * u, vx: -from * sp.speed * u, vy: 0,
        ph: Math.random() * TAU, scale: 0.85 + Math.random() * 0.3, shinyBase: hexHue(sp.main),
      };
      if (sp.predator) f.hunger = 5 + Math.random() * 15;
      maybeShiny(sp.lantern ? "lantern" : "fish", f, sp.size * u, () => [f.x, f.y], () => sp.fish.includes(f));
      return f;
    });
  }

  function renewCrab(c) {
    const S = scene, sides = [];
    if (S.floorL <= 0) sides.push(-1);
    if (S.floorR >= W) sides.push(1);
    const side = sides[Math.floor(Math.random() * sides.length)] || -1;
    c.leaving = 0;
    c.x = side < 0 ? -30 : W + 30;
    c.dir = -side;
    c.color = ["#d9543b", "#e07a3a", "#b84a5a", "#c9603c"][Math.floor(Math.random() * 4)];
    c.s = (12 + Math.random() * 8) * u;
    c.shinyBase = hexHue(c.color);
    maybeShiny("crab", c, c.s * 0.8, () => [c.x, floorY(c.x) - c.s * 0.45]);
  }

  function renewJelly(j) {
    j.col = water.jelly[Math.floor(Math.random() * water.jelly.length)];
    j.r = (12 + Math.random() * 18) * u;
    const [r, g, b] = j.col.split(",").map(Number);
    j.shinyBase = rgbHue(r, g, b);
    maybeShiny("jelly", j, j.r, () => [j.x, j.y - j.r * 0.3]);
  }

  // Feeding brings a few new fish in from the nearest side.
  function bringNewcomers() {
    const cands = scene.species.filter(sp => !sp.predator && !sp.lantern && !sp.leaving && sp.fish.length < sp.count * 1.5);
    if (!cands.length) return;
    const sp = cands[Math.floor(Math.random() * cands.length)], side = pointer.x < W / 2 ? -1 : 1, n = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      const f = {
        x: side < 0 ? -40 * u - i * 18 * u : W + 40 * u + i * 18 * u,
        y: Math.max(pointer.y + (Math.random() - 0.5) * 60 * u, (water.surface ? waveY(pointer.x) : 0) + 30 * u),
        vx: -side * sp.speed * u, vy: 0, ph: Math.random() * TAU, scale: 0.85 + Math.random() * 0.3, shinyBase: hexHue(sp.main),
      };
      sp.fish.push(f);
      maybeShiny("fish", f, sp.size * u, () => [f.x, f.y], () => sp.fish.includes(f));
    }
  }

  function rgbHue(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    if (!d) return 0;
    const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return (h * 60 + 360) % 360;
  }
  const hexHue = hex => { const [r, g, b] = hexRgb(hex); return rgbHue(r, g, b); };
  function shinyHueFor(key, obj) {
    const base = obj && obj.shinyBase !== undefined ? obj.shinyBase : BASE_HUE[key] !== undefined ? BASE_HUE[key] : 200;
    return (base + 150) % 360;
  }

  // A shiny creature is drawn into a spare layer, recoloured there, and then put back.
  // The spare layers match whatever is being drawn on: the ocean itself, or a small logbook picture.
  let shinyA = null, shinyB = null, shinyMain = null;
  const shinyBufs = new Map();
  // With a scheme, a shiny is simply drawn with its own colours; only things without one go through the spare layers.
  const palStack = [];
  function beginShiny(key) {
    const scheme = key && SHINY_PAL[key];
    if (scheme) { palStack.push(shinyPal); shinyPal = scheme; return true; }
    const target = ctx.canvas;
    if (shinyMain || !target || !target.width || !target.height) return false;
    const size = target.width + "x" + target.height;
    let bufs = shinyBufs.get(size);
    if (!bufs) {
      if (shinyBufs.size > 3) shinyBufs.clear();
      bufs = [document.createElement("canvas"), document.createElement("canvas")];
      for (const c of bufs) { c.width = target.width; c.height = target.height; }
      shinyBufs.set(size, bufs);
    }
    [shinyA, shinyB] = bufs;
    const a = shinyA.getContext("2d");
    a.setTransform(1, 0, 0, 1, 0, 0);
    a.clearRect(0, 0, shinyA.width, shinyA.height);
    a.setTransform(ctx.getTransform());
    a.globalAlpha = ctx.globalAlpha;
    shinyMain = ctx;
    ctx = a;
    return true;
  }
  function endShiny(key, obj) {
    if (key && SHINY_PAL[key] && palStack.length) { shinyPal = palStack.pop(); return; }
    if (!shinyMain) return;
    const a = ctx, w = shinyA.width, h = shinyA.height;
    ctx = shinyMain;
    shinyMain = null;
    const b = shinyB.getContext("2d");
    b.setTransform(1, 0, 0, 1, 0, 0);
    b.globalCompositeOperation = "copy";
    b.drawImage(shinyA, 0, 0);
    b.globalCompositeOperation = "source-over";
    a.setTransform(1, 0, 0, 1, 0, 0);
    a.globalAlpha = 1;
    // keep the shading of the animal, but swap its colour; whites and blacks get a tint too
    const hue = shinyHueFor(key, obj);
    a.globalCompositeOperation = "color";
    a.fillStyle = `hsl(${hue} 80% ${50 + 8 * Math.sin(t * 2.5)}%)`;
    a.fillRect(0, 0, w, h);
    a.globalCompositeOperation = "multiply";
    a.globalAlpha = 0.45;
    a.fillStyle = `hsl(${hue} 85% 72%)`;
    a.fillRect(0, 0, w, h);
    a.globalCompositeOperation = "screen";
    a.globalAlpha = 0.35;
    a.fillStyle = `hsl(${hue} 70% 32%)`;
    a.fillRect(0, 0, w, h);
    a.globalAlpha = 1;
    a.globalCompositeOperation = "destination-in";
    a.drawImage(shinyB, 0, 0);
    a.globalCompositeOperation = "source-over";
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(shinyA, 0, 0);
    ctx.restore();
  }
  // Draw something; recolour it when the creature is shiny.
  function shinyDraw(obj, fn) {
    if (obj && obj.shiny && beginShiny(obj.shiny)) { try { fn(); } finally { endShiny(obj.shiny, obj); } }
    else fn();
  }

  function drawShinies() {
    for (const e of scene.shinies) {
      if (e.alive && !e.alive()) continue;
      const [x, y] = e.get();
      if (!isFinite(x) || !isFinite(y) || !isFinite(e.r)) continue; // a zero-size pane can give odd positions
      if (x < -60 || x > W + 60 || y < -60 || y > H + 60) continue;
      if (!e.told && lit(x, y, e.r)) {
        // the first time it swims into view: a chime, and a note in the logbook
        e.told = true;
        const key = "shiny:" + e.key, isNew = !logbook.has(key);
        seen(key, [x, y]);
        if (!isNew) toast(L(`Er is een ${nm(key).toLowerCase()} in de buurt!`, `There is a ${nm(key).toLowerCase()} nearby!`));
        sfxShiny();
        buzz([30, 40, 30]);
      }
      // small glints that flash on the body itself
      for (let i = 0; i < 3; i++) {
        const slot = Math.floor(t * 1.6 + i * 0.37), ph = (t * 1.6 + i * 0.37) % 1;
        const tw = Math.sin(ph * Math.PI);
        if (tw < 0.15) continue;
        const rx = Math.sin(slot * 12.9898 + i * 78.233) * 0.5, ry = Math.sin(slot * 39.346 + i * 11.135) * 0.35;
        const sx = x + rx * e.r * 1.4, sy = y + ry * e.r * 1.4, sz = (1.5 + 2.5 * tw) * u;
        ctx.fillStyle = `rgba(255,252,235,${0.9 * tw})`;
        ctx.beginPath();
        ctx.moveTo(sx, sy - sz); ctx.lineTo(sx + sz * 0.22, sy - sz * 0.22); ctx.lineTo(sx + sz, sy); ctx.lineTo(sx + sz * 0.22, sy + sz * 0.22);
        ctx.lineTo(sx, sy + sz); ctx.lineTo(sx - sz * 0.22, sy + sz * 0.22); ctx.lineTo(sx - sz, sy); ctx.lineTo(sx - sz * 0.22, sy - sz * 0.22);
        ctx.fill();
      }
    }
  }


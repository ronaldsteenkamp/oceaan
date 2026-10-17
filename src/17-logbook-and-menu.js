  // ---- detail card ------------------------------------------------------
  const FACTS = {
    "w:rif": "Koraalriffen bedekken minder dan één procent van de oceaanbodem, maar bijna een kwart van alle zeedieren leeft erop of eromheen.",
    "w:diepzee": "Dieper dan duizend meter komt geen zonlicht meer. Veel dieren maken daar hun eigen licht.",
    "w:noordzee": "De Noordzee is gemiddeld maar zo'n 95 meter diep. Op de Doggersbank is het op sommige plekken minder dan twintig meter.",
    "w:kelpwoud": "Reuzenkelp is een van de snelst groeiende organismen op aarde: op een goede dag tot een halve meter.",
    "w:ijszee": "Zeewater bevriest pas rond min 1,9 graden, omdat het zout het vriespunt verlaagt.",
    "w:mangrove": "Mangrovebossen groeien op de grens van land en zee. Tussen hun wortels groeien jonge vissen veilig op.",
    "w:grot": "Sommige onderwatergrotten, zoals de cenotes in Mexico, lopen kilometers door. Het water is er vaak kristalhelder.",
    "w:wadden": "De Waddenzee is het grootste getijdengebied ter wereld. Twee keer per dag valt een groot deel van de bodem droog, en dan kun je er wadlopen.",
    amphora: "Romeinen vervoerden wijn, olijfolie en vissaus in amforen. Duikers vinden soms complete ladingen op de bodem.",
    car: "Sommige landen laten oude auto's en treinen bewust zinken, zodat er een kunstmatig rif ontstaat.",
    bell: "Aan de scheepsbel kun je vaak de naam van een wrak aflezen: die staat er meestal in gegraveerd.",
    seagrass: "Zeegras is geen zeewier maar een plant met wortels en bloemen. Zeekoeien en schildpadden grazen erop.",
    jellybloom: "Soms drijven er miljoenen kwallen tegelijk door de zee. Dat heet een kwallenbloei.",
    glowtide: "Zeevonk is een piepklein eencellig diertje dat blauw licht geeft als het water beweegt.",
    hatchlings: "Babyschildpadjes kruipen 's nachts uit hun nest naar zee en zwemmen dagenlang door naar de open oceaan.",
    whalesong: "Het lied van een bultrug kan een half uur duren en is honderden kilometers ver te horen.",
    serpent: "Verhalen over zeeslangen zijn eeuwen oud. Waarschijnlijk zagen zeelieden soms een riemvis, die wel acht meter lang wordt.",
    megalodon: "De megalodon was een haai van ruim vijftien meter die miljoenen jaren geleden uitstierf. Zijn tanden waren groter dan je hand.",
    goldpearl: "Gouden parels groeien in een bijzondere parelschelp en horen bij de zeldzaamste parels ter wereld.",
    "w:lagune": "In een lagune ligt ondiep, warm water achter een rif. Het zonlicht maakt dansende lichtnetten op de witte bodem.",
    "w:sargasso": "De Sargassozee is de enige zee zonder kust. Hij wordt begrensd door zeestromen, en er drijven grote matten bruin zeewier.",
    wheel: "Met het stuurrad draaide de stuurman via touwen of kettingen het roer van het schip.",
    idol: "Verhalen over vervloekte gouden beeldjes zijn bijna net zo oud als verhalen over piraten.",
    phonebox: "Duikers hebben echt telefooncellen op de zeebodem neergezet, als vreemde duikplek of als kunstwerk.",
    mussels: "Mosselen zitten vast met byssusdraad: sterke draadjes die ze zelf maken. Een mosselbank is een thuis voor krabben, wormen en jonge vissen.",
    driftwood: "Eendenmosselen zijn geen schelpdieren maar kreeftjes. Ze zitten met een steeltje vast aan drijvend hout en vangen eten met hun veerachtige pootjes.",
    eelmigration: "Europese palingen worden geboren in de Sargassozee. Als doorzichtige glasaaltjes zwemmen ze helemaal naar onze rivieren.",
    quake: "Bij een zeebeving schuift de bodem even op. Vissen en andere dieren merken de trillingen vaak eerder dan mensen.",
    crabmarch: "Op Christmaseiland trekken elk jaar tientallen miljoenen rode krabben tegelijk naar zee om eitjes te leggen.",
    bubblerings: "Dolfijnen blazen voor de lol ringen van lucht. Daarna spelen ze ermee en bijten ze er soms in.",
    aurora: "Het noorderlicht ontstaat als deeltjes van de zon botsen op de lucht hoog boven de aarde.",
    mobydick: "Moby Dick is de witte potvis uit het boek van Herman Melville. Er zijn echt witte potvissen gezien.",
    ghostsub: "Op de zeebodem liggen honderden gezonken onderzeeërs uit de wereldoorlogen. Zeelieden vertellen over eentje die nog steeds rondvaart, met brandende lampen.",
    ghostdiver: "Vroeger doken duikers met een koperen helm en een slang naar het schip. Zeelieden vertellen dat er nog steeds een rondspookt.",
    wreck: "Rond een scheepswrak ontstaat vaak binnen een paar jaar een kunstmatig rif vol leven.",
    plane: "Op veel zeebodems liggen nog vliegtuigwrakken uit de Tweede Wereldoorlog. Sommige zijn populaire duikplekken geworden.",
    chest: "Piraten begroeven hun buit bijna nooit. Meestal werd die meteen verdeeld en uitgegeven.",
    treasure: "De schatkaart met een kruisje komt vooral uit boeken zoals Schateiland. Echt opgegraven piratenschatten zijn heel zeldzaam.",
    anchor: "Het anker van een groot vrachtschip kan meer dan tien ton wegen.",
    cannon: "Oude kanonnen worden vaak gevonden in een harde korst van zand en kalk, die ze eeuwenlang beschermt.",
    ruins: "In de Middellandse Zee liggen hele havens onder water, zoals delen van de oude haven van Alexandrië.",
    statue: "Atlantis komt uit een verhaal van de Griekse filosoof Plato. Er is nooit bewijs gevonden dat het echt bestond.",
    city: "Bij de Sint-Elisabethsvloed van 1421 verdwenen in Nederland hele dorpen in de golven.",
    arch: "Een rotsboog ontstaat doordat golven en stroming zachter gesteente sneller wegslijpen dan hard gesteente.",
    helmet: "Koperen duikhelmen zijn meer dan honderd jaar gebruikt. De duiker kreeg lucht door een slang vanaf het schip.",
    mine: "In de Noordzee liggen nog duizenden zeemijnen uit de wereldoorlogen. Ze worden nog steeds opgeruimd.",
    bottle: "Een van de oudste gevonden flessenposten heeft meer dan honderd jaar rondgedreven voordat hij aanspoelde.",
    skull: "De vlag met het doodshoofd heet ook wel de Jolly Roger.",
    vent: "Bij heetwaterbronnen kan het water heter worden dan 350 graden. Door de enorme druk kookt het toch niet.",
    volcano: "Het grootste deel van alle vulkanen op aarde ligt onder water.",
    brine: "Een pekelmeer is zo zout dat het zwaarder is dan het zeewater erboven. Het heeft een eigen oppervlak, met golfjes en al.",
    rocks: "Op rotsen leven veel dieren die zich vastzetten, zoals mosselen, zeepokken en anemonen.",
    canyon: "Het diepste punt van de oceaan, in de Marianentrog, ligt bijna elf kilometer diep.",
    sub: "Rond 1620 bouwde de Nederlander Cornelis Drebbel een van de eerste duikboten, die onder water door de Theems voer.",
    baitball: "Bij een bait-ball drukken kleine vissen zich samen tot een draaiende bal, zodat een rover er niet één kan uitkiezen.",
    spawning: "Veel vissen leggen duizenden of zelfs miljoenen eitjes tegelijk. Maar een paar daarvan worden volwassen.",
    coralspawn: "Op het Groot Barrièrerif laten koralen een paar nachten na een volle maan allemaal tegelijk hun eitjes los.",
    storm: "Onder water merk je weinig van een storm. Een paar meter diep is het al veel rustiger.",
    eruption: "Lava die onder water naar buiten komt, stolt razendsnel tot ronde klonten: kussenlava.",
    task: "Zeepaardjes zijn meesters in camouflage. Sommige soorten kunnen van kleur veranderen.",
    mermaid: "Verhalen over zeemeerminnen bestaan over de hele wereld. Zeelieden zagen soms een zeekoe voor een zeemeermin aan.",
    kraken: "De Kraken komt uit Noorse zeemansverhalen. Waarschijnlijk is het verhaal geïnspireerd door de echte reuzeninktvis.",
    ghost: "De Vliegende Hollander is het beroemdste spookschip uit de zeemansverhalen.",
    whalefall: "Een dode walvis op de bodem kan tientallen jaren lang voedsel zijn voor honderden soorten dieren.",
    ghostnet: "Verloren visnetten, spooknetten, drijven soms jaren door de zee en blijven al die tijd dieren vangen. Duikers ruimen ze op.",
    waterspout: "Een waterhoos is een kleine tornado boven zee. Aan de voet wervelt het zeewater op tot een wolk van druppels.",
    whirlpool: "De Maelstrom bij de Lofoten in Noorwegen is een van de sterkste draaikolken ter wereld. Hij ontstaat door het getij tussen de eilanden.",
    sardinerun: "Elke winter trekken miljarden sardines langs de kust van Zuid-Afrika. Dolfijnen, haaien, walvissen en jan-van-genten komen erop af.",
    meteor: "Een vallende ster is geen ster, maar een steentje uit de ruimte dat verbrandt in de lucht. De meeste zijn niet groter dan een zandkorrel.",
    eclipse: "Bij een maansverduistering schuift de aarde tussen de zon en de maan. De maan wordt dan niet zwart, maar donker koperrood.",
    leviathan: "De Leviathan is een zeemonster uit eeuwenoude verhalen, zo groot dat het de diepe zee kon laten koken als een pot.",
    lighthouse: "Zeelieden vertellen over een vuurtoren die 's nachts schijnt op een plek waar helemaal geen land is. Wie het licht volgt, vindt nooit de kust.",
  };
  Object.assign(FACTS, animalTable("fact", 0));

  const FACTS_EN = {
    "w:rif": "Coral reefs cover less than one percent of the ocean floor, yet almost a quarter of all sea creatures live on or around them.",
    "w:diepzee": "Below a thousand metres no sunlight reaches. Many animals down there make their own light.",
    "w:noordzee": "The North Sea is only about 95 metres deep on average. On the Dogger Bank it is less than twenty metres in places.",
    "w:kelpwoud": "Giant kelp is one of the fastest-growing living things on earth: up to half a metre on a good day.",
    "w:ijszee": "Seawater only freezes at about minus 1.9 degrees, because the salt lowers the freezing point.",
    "w:mangrove": "Mangrove forests grow where the land meets the sea. Young fish grow up safely between their roots.",
    "w:grot": "Some underwater caves, like the cenotes in Mexico, run on for kilometres. The water there is often crystal clear.",
    "w:wadden": "The Wadden Sea is the largest tidal area in the world. Twice a day much of its floor falls dry, and then you can walk across it.",
    amphora: "The Romans shipped wine, olive oil and fish sauce in amphorae. Divers sometimes find whole cargoes on the seabed.",
    car: "Some countries sink old cars and trains on purpose, so that an artificial reef grows on them.",
    bell: "A ship's bell often tells you the name of a wreck: it is usually engraved on it.",
    seagrass: "Seagrass is not seaweed but a plant with roots and flowers. Manatees and turtles graze on it.",
    jellybloom: "Sometimes millions of jellyfish drift through the sea together. This is called a jellyfish bloom.",
    glowtide: "Sea sparkle is a tiny single-celled creature that gives off blue light when the water moves.",
    hatchlings: "Turtle hatchlings crawl from their nest to the sea at night and swim for days to reach the open ocean.",
    whalesong: "A humpback's song can last half an hour and be heard hundreds of kilometres away.",
    serpent: "Stories of sea serpents are centuries old. Sailors probably saw an oarfish now and then, which grows up to eight metres long.",
    megalodon: "The megalodon was a shark over fifteen metres long that died out millions of years ago. Its teeth were bigger than your hand.",
    goldpearl: "Golden pearls grow in a special pearl oyster and are among the rarest pearls in the world.",
    "w:lagune": "A lagoon is shallow, warm water behind a reef. The sunlight makes dancing nets of light on the white floor.",
    "w:sargasso": "The Sargasso Sea is the only sea without a coast. Ocean currents form its borders, and big mats of brown seaweed float on it.",
    wheel: "With the wheel, the helmsman turned the ship's rudder through ropes or chains.",
    idol: "Stories about cursed golden idols are almost as old as stories about pirates.",
    phonebox: "Divers really have put phone boxes on the seabed, as a strange dive site or as a work of art.",
    mussels: "Mussels hold on with byssus threads: strong little threads they make themselves. A mussel bed is a home for crabs, worms and young fish.",
    driftwood: "Goose barnacles are not shellfish but crustaceans. They hang from floating wood on a little stalk and catch food with their feathery legs.",
    eelmigration: "European eels are born in the Sargasso Sea. As see-through glass eels they swim all the way to European rivers.",
    quake: "In a seaquake the seabed shifts for a moment. Fish and other animals often feel the trembling before people do.",
    crabmarch: "On Christmas Island tens of millions of red crabs march to the sea together every year to lay their eggs.",
    bubblerings: "Dolphins blow rings of air for fun. Then they play with them and sometimes bite them.",
    aurora: "The northern lights appear when particles from the sun crash into the air high above the earth.",
    mobydick: "Moby Dick is the white sperm whale from Herman Melville's book. Real white sperm whales have been seen.",
    ghostsub: "Hundreds of submarines from the world wars lie sunk on the seabed. Sailors tell of one that still sails around, its lamps still burning.",
    ghostdiver: "Long ago divers went down with a copper helmet and an air hose from the ship. Sailors say one still haunts the deep.",
    wreck: "Within a few years a shipwreck often becomes an artificial reef full of life.",
    plane: "Many seabeds still hold plane wrecks from the Second World War. Some have become popular dive sites.",
    chest: "Pirates hardly ever buried their loot. Usually it was shared out and spent straight away.",
    treasure: "The treasure map with a cross mostly comes from books like Treasure Island. Real dug-up pirate treasure is very rare.",
    anchor: "The anchor of a large cargo ship can weigh more than ten tonnes.",
    cannon: "Old cannons are often found inside a hard crust of sand and lime that protects them for centuries.",
    ruins: "In the Mediterranean whole harbours lie under water, such as parts of the ancient harbour of Alexandria.",
    statue: "Atlantis comes from a story by the Greek philosopher Plato. No evidence has ever been found that it really existed.",
    city: "In the St Elizabeth flood of 1421, whole villages in the Netherlands disappeared beneath the waves.",
    arch: "A rock arch forms because waves and currents wear away softer rock faster than hard rock.",
    helmet: "Copper diving helmets were used for more than a hundred years. The diver got air through a hose from the ship.",
    mine: "Thousands of sea mines from the world wars still lie in the North Sea. They are still being cleared.",
    bottle: "One of the oldest messages in a bottle ever found drifted for more than a hundred years before it washed ashore.",
    skull: "The flag with the skull is also called the Jolly Roger.",
    vent: "At hydrothermal vents the water can be hotter than 350 degrees. Because of the enormous pressure it still does not boil.",
    volcano: "Most of the volcanoes on earth are under water.",
    brine: "A brine pool is so salty that it is heavier than the seawater above it. It has its own surface, waves and all.",
    rocks: "Many animals that attach themselves live on rocks, such as mussels, barnacles and anemones.",
    canyon: "The deepest point of the ocean, in the Mariana Trench, is almost eleven kilometres down.",
    sub: "Around 1620 the Dutchman Cornelis Drebbel built one of the first submarines, which travelled under water along the Thames.",
    baitball: "In a bait ball small fish press together into a spinning ball, so a predator cannot pick out a single one.",
    spawning: "Many fish lay thousands or even millions of eggs at once. Only a few of them grow up.",
    coralspawn: "On the Great Barrier Reef, corals release their eggs all at once a few nights after a full moon.",
    storm: "Under water you notice little of a storm. A few metres down it is already much calmer.",
    eruption: "Lava that comes out under water cools in a flash into round lumps: pillow lava.",
    task: "Seahorses are masters of camouflage. Some species can change colour.",
    mermaid: "Stories about mermaids exist all over the world. Sailors sometimes mistook a manatee for a mermaid.",
    kraken: "The Kraken comes from Norwegian sea tales. The story was probably inspired by the real giant squid.",
    ghost: "The Flying Dutchman is the most famous ghost ship in sea tales.",
    whalefall: "A dead whale on the seabed can feed hundreds of kinds of animals for decades.",
    ghostnet: "Lost fishing nets, ghost nets, sometimes drift through the sea for years and keep catching animals all that time. Divers clean them up.",
    waterspout: "A waterspout is a small tornado over the sea. At its foot the seawater whirls up into a cloud of spray.",
    whirlpool: "The Maelstrom off the Lofoten islands in Norway is one of the strongest whirlpools in the world. The tide between the islands causes it.",
    sardinerun: "Every winter billions of sardines travel along the coast of South Africa. Dolphins, sharks, whales and gannets come to feast.",
    meteor: "A shooting star is not a star, but a little stone from space burning up in the air. Most are no bigger than a grain of sand.",
    eclipse: "In a lunar eclipse the Earth moves between the Sun and the Moon. The Moon does not turn black, but a deep copper red.",
    leviathan: "The Leviathan is a sea monster from age-old stories, so big that it could make the deep sea boil like a pot.",
    lighthouse: "Sailors tell of a lighthouse that shines at night in a place where there is no land at all. Whoever follows the light never finds the coast.",
  };
  Object.assign(FACTS_EN, animalTable("fact", 1));

  let detailOpen = false, logScroll = 0, detailKey = null;
  function openDetail(key, sameAnimal, step) {
    if (!sameAnimal) logScroll = panelBody.scrollTop;
    detailOpen = true; detailKey = key;
    const base = key.startsWith("shiny:") ? key.slice(6) : key, e = logbook.get(key);
    const facts = LANG === "en" ? FACTS_EN : FACTS;
    const fact = key.startsWith("shiny:") ? L("Een shiny is een zeldzame kleurvariant. ", "A shiny is a rare colour variant. ") + (facts[base] || "") : facts[key] || "";
    const where = hintFor(key);
    const when = e && e.first ? dateText(e.first) : "";
    // an animal with a shiny gets two tabs: the ordinary one and its shiny
    const isShiny = key.startsWith("shiny:"), se = logbook.get("shiny:" + base);
    const tabs = SHINY_KEYS.includes(base) ? `<div class="dtabs" role="tablist" aria-label="${L("Kleur", "Colour")}">
        <button type="button" role="tab" aria-selected="${!isShiny}" class="${isShiny ? "" : "on"}" data-dtab="${base}">${L("Gewoon", "Ordinary")}</button>
        <button type="button" role="tab" aria-selected="${isShiny}" class="${isShiny ? "on" : ""}${se ? " got" : ""}" data-dtab="shiny:${base}">✦ Shiny</button>
      </div>` : "";
    // a page of the notebook: the photo taped in, the name in pencil, and the notes beside it
    const group = (LOG_GROUPS.find(g => g[0] !== "Shiny" && g[1].includes(base)) || ["Dieren"])[0];
    const photo = { top: `<div class="nb-run">${groupName(group)}</div>${tabs}`, figure: `
      <figure class="nb-photo${isShiny && e ? " shinybig" : ""}${isShiny && !e && rewards.has("s5") ? " peek" : ""}" style="--tilt:${tiltOf(base) - 1}deg"><img class="big" alt="${nm(base)}" src="${thumbURL(key, !!e || (isShiny && rewards.has("s5")), 4)}"><figcaption>${nm(base)}${!isShiny && se ? ` <span class="shinymark inline" title="${L("Shiny gevonden", "Shiny found")}">✦</span>` : ""}</figcaption></figure>` };
    renderBookDetail(photo, {
      back: `<button type="button" id="detailBack" class="nb-back">‹ ${L("Terug naar het logboek", "Back to the logbook")}</button>`,
      body: `<h2 class="nb-title small">${nm(base)}</h2>${rewards.has("ga") && SCI[base] ? `<p class="nb-sci">${SCI[base]}</p>` : ""}
        <p class="nb-fact">${fact}</p>
        ${rewards.has("ga") && (LANG === "en" ? FIELD_NOTES_EN : FIELD_NOTES)[base] ? `<p class="nb-note-field"><b>${L("Veldnotitie", "Field note")}</b> ${(LANG === "en" ? FIELD_NOTES_EN : FIELD_NOTES)[base]}</p>`
          : !rewards.has("ga") && FIELD_NOTES[base] ? `<p class="nb-note-field locked"><b>${L("Veldnotitie", "Field note")}</b> ${L("Hier komt een tweede weetje bij zodra je de mijlpaal Bioloog haalt: alle dieren gevonden.", "A second fact appears here once you reach the Biologist milestone: every animal found.")}</p>` : ""}`,
      side: `<dl class="nb-dl">
          ${isShiny ? `<div><dt>${L("Kans", "Chance")}</dt><dd>${shinyOdds(base)}</dd></div>`
            : `<div><dt>${L("Waar", "Where")}</dt><dd>${where ? where.charAt(0).toUpperCase() + where.slice(1) : L("Overal", "Everywhere")}</dd></div>`}
          ${!e ? `<div><dt>${L("Gezien", "Seen")}</dt><dd>${L("Nog niet gevonden", "Not found yet")}${huntButtonHTML(key)}</dd></div>` : ""}
          ${when ? `<div><dt>${L("Eerste keer", "First time")}</dt><dd>${when}</dd></div>` : ""}
          ${e && e.n > 1 ? `<div><dt>${L("Aantal keer", "Times seen")}</dt><dd>${L(`${e.n} keer gezien`, `seen ${e.n} times`)}</dd></div>` : ""}
        </dl>`,
      nav: detailNavHTML(key),
    });
    panelBody.scrollTop = 0;
    const tabBtn = sameAnimal && panelBody.querySelector(".dtabs .on");
    (step && panelBody.querySelector(`[data-dnav="${step > 0 ? 1 : -1}"]`) || tabBtn || document.getElementById("detailBack")).focus();
  }
  function shinyOdds(base) {
    const n = SHINY_N[base] || 200;
    return RARE_KEYS.includes(base) ? L(`Ongeveer 1 op de ${n} keer is het shiny`, `About 1 in ${n} times it is shiny`)
      : L(`Ongeveer 1 op de ${n} van deze dieren is shiny`, `About 1 in ${n} of these animals is shiny`);
  }
  function closeDetail() {
    detailOpen = false; detailKey = null;
    renderPanel();
    panelBody.scrollTop = logScroll;
  }

  // Hints are worked out from the same tables that build the oceans.
  const EVENT_HINTS = {
    treasure: "tik op een fles voor de schatkaart en graaf op het kruisje",
    baitball: "gebeurt af en toe, in elk water behalve de diepzee",
    spawning: "scholen leggen af en toe eitjes",
    coralspawn: "op een volle-maannacht bij het koraal",
    storm: "trekt af en toe over wateren met een oppervlak",
    eruption: "wacht bij de onderzeese vulkaan",
    task: "zoek de drie zeepaardjes die in de kelp verstopt zitten",
    jellybloom: "drijft af en toe door het water",
    whalesong: "een bultrug zingt soms als hij langszwemt",
    glowtide: "alleen op een donkere nacht, in wateren met een oppervlak; beweeg dan je vinger door het water",
    aurora: "af en toe op een donkere nacht in de IJszee, de Noordzee en het kelpwoud",
    hatchlings: "zwemmen af en toe langs in wateren met zeeschildpadden",
    eelmigration: "trekt af en toe voorbij in de Sargassozee, de Noordzee, de Waddenzee, het kelpwoud en de mangrove",
    quake: "heel af en toe, in elk water",
    crabmarch: "steekt af en toe de bodem over, als er geen afgrond is",
    bubblerings: "dolfijnen blazen ze soms als ze langszwemmen",
    ghostnet: "drijft af en toe voorbij met een dier erin; zwem er met de duiker naartoe om het dier te bevrijden",
    waterspout: "soms tijdens onweer, in wateren met een oppervlak",
    whirlpool: "af en toe in de Noordzee, het kelpwoud en de IJszee",
    sardinerun: "trekt af en toe voorbij in het kelpwoud en de Sargassozee",
    meteor: "op een heldere nacht, in wateren met een oppervlak",
    eclipse: "heel af en toe, op een nacht met volle maan",
  };
  Object.assign(EVENT_HINTS, animalTable("hint", 0));
  function hintFor(key) {
    if (key.startsWith("shiny:")) {
      const base = hintFor(key.slice(6));
      const n = SHINY_N[key.slice(6)] || 200;
      const what = RARE_KEYS.includes(key.slice(6)) ? L(`ongeveer 1 op de ${n} keer is het shiny`, `about 1 in ${n} times it is shiny`) : L(`ongeveer 1 op de ${n} van deze dieren is shiny`, `about 1 in ${n} of these animals is shiny`);
      return what + (base ? "; " + base : "");
    }
    if (key.startsWith("w:")) return L(`elke oceaan kiest een van de ${WATERS.length} wateren`, `every ocean picks one of the ${WATERS.length} waters`);
    if (RARE_KEYS.includes(key)) {
      const parts = WATERS.filter(w => (RARES_BY_WATER[w.name] || []).includes(key)).map(w => {
        const n = Math.round(RARES_BY_WATER[w.name].length / RARE_RATE);
        return L(`${nm("w:" + w.name)}: ongeveer 1 op de ${n} oceanen`, `${nm("w:" + w.name)}: about 1 in ${n} oceans`);
      });
      const extra = key === "goldpearl" ? L("; tik op de reuzenschelp als hij openstaat", "; tap the giant clam while it is open") : "";
      return L("heel zeldzaam. ", "very rare. ") + parts.join("; ") + extra;
    }
    const hints = LANG === "en" ? EVENT_HINTS_EN : EVENT_HINTS;
    if (hints[key]) return hints[key];
    const pole = (ANIMALS[key] || {}).pole;
    const atPole = w => w.poles && pole ? (pole === "n" ? L(" bij de noordpool", " at the North Pole") : L(" bij de zuidpool", " at the South Pole")) : "";
    const where = WATERS.filter(w => (w.props[key] || 0) > 0 || (w.life[key] || 0) > 0 || w.visitors.includes(key)).map(w => nm("w:" + w.name) + atPole(w));
    return where.length ? L("komt voor in ", "found in ") + where.join(", ") : "";
  }

  const EVENT_HINTS_EN = {
    treasure: "tap a bottle for the treasure map, then dig at the cross",
    baitball: "happens now and then, in every water except the deep sea",
    spawning: "schools lay eggs now and then",
    aurora: "now and then on a dark night in the Arctic Sea, the North Sea and the kelp forest",
    coralspawn: "on a full-moon night at the coral",
    storm: "now and then rolls over waters with a surface",
    eruption: "waiting at the undersea volcano",
    task: "find the three seahorses hidden in the kelp",
    jellybloom: "drifts through now and then",
    whalesong: "a humpback sometimes sings as it swims by",
    glowtide: "only on a dark night, in waters with a surface; move your finger through the water",
    hatchlings: "swim past now and then in waters with sea turtles",
    eelmigration: "passes by now and then in the Sargasso Sea, the North Sea, the Wadden Sea, the kelp forest and the mangrove",
    quake: "very now and then, in any water",
    crabmarch: "crosses the floor now and then, where there is no abyss",
    bubblerings: "dolphins sometimes blow them as they swim past",
    ghostnet: "drifts by now and then with an animal caught in it; swim the diver up to it to set the animal free",
    waterspout: "sometimes during a storm, in waters with a surface",
    whirlpool: "now and then in the North Sea, the kelp forest and the Arctic Sea",
    sardinerun: "passes by now and then in the kelp forest and the Sargasso Sea",
    meteor: "on a clear night, in waters with a surface",
    eclipse: "very now and then, on a night with a full moon",
  };
  Object.assign(EVENT_HINTS_EN, animalTable("hint", 1));

  // "Maken en delen": sharing, settings and your own aquarium on one page.
  function renderMake() {
    const keep = panelBody.scrollTop;
    panelBody.innerHTML = settingsHTML() + `<h3 class="section">${L("Eigen aquarium", "Your own aquarium")}</h3>` + aquariumHTML();
    panelBody.scrollTop = keep;
  }

  function shareLink() {
    const code = "#" + (aquarium ? aqCode() : seed);
    return IN_ARTIFACT ? code : location.href.split("#")[0] + code;
  }

  function settingsHTML() {
    const link = shareLink(), canShare = !IN_ARTIFACT && !!navigator.share;
    // sections with a handwritten head; within a section the parts have a small head of their own
    return `
      <h3 class="section first">${L("Delen", "Share")}</h3>
      <h3>${L("Deze oceaan delen", "Share this ocean")}</h3>
      <p class="sum">${IN_ARTIFACT ? L("Stuur deze code mee met de link. Wie hem hieronder invult, krijgt precies deze oceaan.", "Send this code along with the link. Whoever enters it below gets exactly this ocean.") : L("Wie deze link opent, krijgt precies deze oceaan.", "Whoever opens this link gets exactly this ocean.")}</p>
      <div class="share"><input id="shareCode" readonly value="${link}" aria-label="${L("Code van deze oceaan", "Code of this ocean")}"><button type="button" id="shareCopy">${L("Kopieer", "Copy")}</button>${canShare ? `<button type="button" id="shareNative" class="primary">${L("Delen", "Share")}</button>` : ""}</div>
      <h3>${L("Logboek vergelijken", "Compare logbooks")}</h3>
      <p class="sum">${L("Stuur je logboekcode naar een vriend en vul de zijne hieronder in: dan zie je wat de ander heeft dat jij nog mist.", "Send your logbook code to a friend and enter theirs below: you will see what the other has that you are still missing.")}</p>
      <div class="share"><input id="myLogCode" readonly value="${logCode()}" aria-label="${L("Jouw logboekcode", "Your logbook code")}"><button type="button" id="copyLogCode">${L("Kopieer", "Copy")}</button></div>
      <div class="share"><input id="friendLogCode" placeholder="lb-…" aria-label="${L("Logboekcode van je vriend", "Your friend's logbook code")}"><button type="button" id="compareGo">${L("Vergelijk", "Compare")}</button></div>
      <div id="compareOut"></div>
      <h3>${L("Een code openen", "Open a code")}</h3>
      <div class="share"><input id="openCode" placeholder="#12345" aria-label="${L("Code om te openen", "Code to open")}"><button type="button" id="openGo">${L("Open", "Open")}</button></div>
      <h3 class="section">${L("Rust en geluid", "Calm and sound")}</h3>
      <div class="row"><button type="button" id="restToggle" class="switch" role="switch" aria-checked="${restMode}"><span class="track"></span>${L("Rustmodus", "Calm mode")}</button></div>
      <p class="sum">${L("Langzamer, zonder grote gebeurtenissen en meldingen. Fijn als achtergrond.", "Slower, without big events or messages. Nice as a background.")}</p>
      <div class="row"><label for="vol">${L("Volume", "Volume")}</label><input id="vol" type="range" min="0" max="100" value="${Math.round(volume * 100)}"></div>
      <div class="row"><label for="volMusic">${L("Muziek", "Music")}</label><input id="volMusic" type="range" min="0" max="100" value="${Math.round(musicVol * 100)}"></div>
      <div class="row"><label for="volFx">${L("Geluiden", "Sounds")}</label><input id="volFx" type="range" min="0" max="100" value="${Math.round(fxVol * 100)}"></div>
      <h3 class="section">${L("Taal", "Language")}</h3>
      <div class="chips" role="group" aria-label="${L("Taal", "Language")}">
        <button type="button" class="chip pick ${LANG === "nl" ? "on" : ""}" data-lang="nl" aria-pressed="${LANG === "nl"}" lang="nl">Nederlands</button>
        <button type="button" class="chip pick ${LANG === "en" ? "on" : ""}" data-lang="en" aria-pressed="${LANG === "en"}" lang="en">English</button>
      </div>
      <h3 class="section">${L("Uitleg", "Help")}</h3>
      <div class="row"><button type="button" id="showWelcome">${L("Uitleg opnieuw tonen", "Show the introduction again")}</button></div>
      <p class="sum">${L("Met het toetsenbord: pijltjes sturen de duiker, E opent wat de duiker aanraakt, Q stuurt een sonarpuls uit, D roept de duiker of stuurt hem weg, R geeft een nieuwe oceaan (ingedrukt houden: water kiezen, met Wereldreiziger), L opent het logboek, F maakt een foto, G zet het geluid aan of uit, H verbergt de knoppen en Esc sluit dit menu.", "With a keyboard: arrow keys steer the diver, E opens what the diver touches, Q sends a sonar ping, D calls or dismisses the diver, R gives a new ocean (hold it: choose the water, with Globetrotter), L opens the logbook, F takes a photo, G switches sound on or off, H hides the buttons and Esc closes this menu.")}</p>`;
  }

  function openCode(raw) {
    const str = raw.trim().replace(/^.*#/, "").toLowerCase();
    const aq = parseAq(str);
    if (aq) { aquarium = { water: aq.water, set: aq.set, shiny: aq.shiny }; aqDraft = null; newVariant(aq.seed, true); return true; }
    if (/^\d{1,10}$/.test(str)) { aquarium = null; aqDraft = null; newVariant(Number(str), true); return true; }
    return false;
  }

  panelBody.addEventListener("input", e => {
    if (e.target.id === "vol") setVolume(Number(e.target.value) / 100);
    if (e.target.id === "volMusic") setMixVolume("music", Number(e.target.value) / 100);
    if (e.target.id === "volFx") setMixVolume("fx", Number(e.target.value) / 100);
  });
  panelBody.addEventListener("change", e => {
    if (e.target.id !== "logFile" || !e.target.files || !e.target.files[0]) return;
    const reader = new FileReader();
    reader.onload = () => {
      const n = importLog(String(reader.result));
      if (n) { renderPanel(); toast(L(`Logboek ingeladen: ${n} vondsten`, `Logbook loaded: ${n} finds`)); }
      else toast(L("Dit bestand is geen logboek van de oceaan", "This file is not an ocean logbook"));
    };
    reader.onerror = () => toast(L("Het bestand kon niet worden gelezen", "The file could not be read"));
    reader.readAsText(e.target.files[0]);
  });
  panelBody.addEventListener("keydown", e => { if (e.target.id === "openCode" && e.key === "Enter") document.getElementById("openGo").click(); });

  const inLogOrder = (title, keys) => groupKeys(title).filter(k => keys.includes(k)).concat(keys.filter(k => !groupKeys(title).includes(k)));
  const AQ_GROUPS = [["Bodem en vondsten", inLogOrder("Bodem en vondsten", PROP_KEYS)], ["Dieren", inLogOrder("Dieren", LIFE_KEYS)], ["Bezoekers", inLogOrder("Dieren", VIS_KEYS)], ["Zeldzaam", inLogOrder("Zeldzaam", RARE_KEYS)]];

  // animals (and everything else that goes into the logbook) can only be chosen once you have seen them;
  // things on the seabed are not in the logbook, so they can always be chosen
  const aqOpen = k => !LOGGABLE.has(k) || logbook.has(k);
  function currentAsDraft() {
    const d = currentAsDraftAll();
    for (const k of [...d.set]) if (!aqOpen(k)) d.set.delete(k);
    return d;
  }
  function currentAsDraftAll() {
    const S = scene, set = new Set();
    for (const g of S.ground) if (PROP_KEYS.includes(g.kind)) set.add(g.kind);
    if (S.canyon) set.add("canyon");
    const life = presentLife(S);
    for (const k of LIFE_KEYS) if (life[k]) set.add(k);
    for (const v of S.visitorPool) if (VIS_KEYS.includes(v)) set.add(v);
    for (const r of S.rares) set.add(r);
    if (S.flyers && S.flyers.enabled) set.add("flyingfish");
    return { water: S.waterIndex, set, shiny: !!(aquarium && aquarium.shiny) };
  }

  function aquariumHTML() {
    if (!aqDraft) aqDraft = currentAsDraft();
    let html = `<p class="sum">${L("Kies zelf wat er in je oceaan komt. Op een smal scherm passen niet alle grote dingen naast elkaar.", "Choose what goes into your ocean. On a narrow screen not all large things fit side by side.")}</p><h3>${L("Water", "Water")}</h3><div class="chips">`;
    html += WATERS.map((w, i) => `<button type="button" class="chip pick ${aqDraft.water === i ? "on" : ""}" data-water="${i}" aria-pressed="${aqDraft.water === i}">${nm("w:" + w.name)}</button>`).join("") + `</div>`;
    html += `<p class="sum">${L("Dieren en andere vondsten kun je pas kiezen als ze in je logboek staan.", "Animals and other finds can only be chosen once they are in your logbook.")}</p>
      <div class="row"><button type="button" id="aqAll">${L("Alles selecteren", "Select all")}</button><button type="button" id="aqNone">${L("Alles deselecteren", "Deselect all")}</button><button type="button" id="aqNoShiny">${L("Dieren zonder shiny", "Animals without a shiny")}</button></div>
      <div class="row"><button type="button" id="aqShiny" class="switch" role="switch" aria-checked="${!!aqDraft.shiny}"><span class="track"></span>${L("Alles shiny", "Everything shiny")}</button></div>
      <p class="sum">${L("Met Alles shiny is elk dier shiny. Die shiny's tellen niet mee voor je logboek.", "With Everything shiny every animal is shiny. Those shinies do not count for your logbook.")}</p>`;
    for (const [title, keys] of AQ_GROUPS) {
      html += `<h3>${groupName(title)}</h3><div class="chips">` + keys.map(k => aqOpen(k)
        ? `<button type="button" class="chip pick ${aqDraft.set.has(k) ? "on" : ""}" data-key="${k}" aria-pressed="${aqDraft.set.has(k)}">${nm(k)}</button>`
        : `<button type="button" class="chip pick locked" disabled title="${L("Nog niet gezien", "Not seen yet")}">???</button>`).join("") + `</div>`;
    }
    html += `<div class="actions"><button type="button" id="aqBuild" class="primary">${L("Bouw dit aquarium", "Build this aquarium")}</button><button type="button" id="aqRandom">${L("Terug naar willekeurig", "Back to random")}</button></div>`;
    if (aquarium) html += `<p class="sum">${L("Je aquarium is gebouwd. De code bovenaan deze pagina deelt precies dit aquarium.", "Your aquarium is built. The code at the top of this page shares exactly this aquarium.")}</p>`;
    return html;
  }

  panelBody.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.detail) { openDetail(b.dataset.detail); return; }
    if (b.dataset.dtab) {
      // the tab you pick is remembered: a found shiny then also shows on the logbook page
      const k = b.dataset.dtab, base = k.replace("shiny:", "");
      if (k.startsWith("shiny:") && logbook.has(k)) shinyPick.add(base); else shinyPick.delete(base);
      saveShinyPick();
      openDetail(k, true); return;
    }
    if (b.dataset.filter) { logFilter = b.dataset.filter; renderPanel(); return; }
    if (b.dataset.logwater !== undefined) { logWater = b.dataset.logwater; renderPanel(); return; }
    if (b.dataset.lang) { setLang(b.dataset.lang); return; }
    if (b.dataset.photo) { openPhoto(b.dataset.photo); return; }
    if (b.id === "photoSave") { const ph = album.find(x => x.id === b.dataset.id); if (ph) fetch(ph.img).then(r => r.blob()).then(bl => saveBlob(bl, `oceaan-${ph.seed}.jpg`)); return; }
    if (b.id === "photoDelete") { document.getElementById("photoDeleteConfirm").hidden = false; b.hidden = true; fitDetail(); return; }
    if (b.id === "photoDeleteYes") { album = album.filter(x => x.id !== b.dataset.id); saveAlbum(); closeDetail(); toast(L("Foto verwijderd", "Photo removed")); return; }
    if (b.id === "detailBack") { closeDetail(); return; }
    if (b.dataset.hunt) { toggleHunt(b.dataset.hunt); openDetail(detailKey, true); const hb = panelBody.querySelector("[data-hunt]"); if (hb) hb.focus(); return; }
    if (b.dataset.dnav) { detailStep(Number(b.dataset.dnav)); return; }
    if (b.id === "logExport") { exportLog(); return; }
    if (b.id === "logImport") { document.getElementById("logFile").click(); return; }
    if (b.id === "logReset") {
      document.getElementById("resetRow").hidden = true;
      document.getElementById("resetConfirm").hidden = false;
      document.getElementById("logResetNo").focus();
      return;
    }
    if (b.id === "logResetNo") {
      document.getElementById("resetConfirm").hidden = true;
      document.getElementById("resetRow").hidden = false;
      return;
    }
    if (b.id === "logResetYes") { b.disabled = true; startOver(); return; }
    if (b.id === "shareNative") {
      navigator.share({ title: "Oceaan", text: L("Kijk eens naar deze oceaan", "Have a look at this ocean"), url: shareLink() }).catch(() => {});
      return;
    }
    if (b.id === "shareCopy") {
      const inp = document.getElementById("shareCode");
      navigator.clipboard.writeText(inp.value).then(() => toast(L("Gekopieerd", "Copied")), () => { inp.select(); toast(L("Selecteer en kopieer de code zelf", "Select and copy the code yourself")); });
      return;
    }
    if (b.id === "copyLogCode") {
      const inp = document.getElementById("myLogCode");
      navigator.clipboard.writeText(inp.value).then(() => toast(L("Gekopieerd", "Copied")), () => { inp.select(); toast(L("Selecteer en kopieer de code zelf", "Select and copy the code yourself")); });
      return;
    }
    if (b.id === "compareGo") { document.getElementById("compareOut").innerHTML = compareHTML(document.getElementById("friendLogCode").value); return; }
    if (b.id === "openGo") {
      const inp = document.getElementById("openCode");
      if (openCode(inp.value)) { renderMake(); toast(L("Code geopend", "Code opened")); }
      else toast(L("Die code herken ik niet. Een code is een getal of begint met #aq-", "That code is not recognised. A code is a number or starts with #aq-"));
      return;
    }
    if (b.id === "restToggle") {
      restMode = !restMode;
      store.set("oceaan-rust", restMode);
      renderMake();
      return;
    }
    if (b.id === "showWelcome") { panelEl.hidden = true; welcomeEl.hidden = false; document.getElementById("welcomeGo").focus(); return; }
    if (b.dataset.water) { aqDraft.water = Number(b.dataset.water); renderMake(); }
    else if (b.dataset.key) { const k = b.dataset.key; if (!aqOpen(k)) return; if (aqDraft.set.has(k)) aqDraft.set.delete(k); else aqDraft.set.add(k); renderMake(); }
    else if (b.id === "aqAll") { for (const [, keys] of AQ_GROUPS) for (const k of keys) if (aqOpen(k)) aqDraft.set.add(k); renderMake(); }
    else if (b.id === "aqNone") { aqDraft.set.clear(); renderMake(); }
    else if (b.id === "aqShiny") { aqDraft.shiny = !aqDraft.shiny; renderMake(); }
    else if (b.id === "aqNoShiny") {
      // only the animals you have seen whose shiny is not in your logbook yet
      const want = AQ_GROUPS.flatMap(([, keys]) => keys).filter(k => SHINY_KEYS.includes(k) && aqOpen(k) && !logbook.has("shiny:" + k));
      for (const k of [...aqDraft.set]) if (SHINY_KEYS.includes(k)) aqDraft.set.delete(k);
      for (const k of want) aqDraft.set.add(k);
      toast(want.length ? L(`${want.length} dieren gekozen waarvan je de shiny nog mist`, `${want.length} animals chosen whose shiny you are still missing`) : L("Je hebt van alle geziene dieren de shiny al", "You already have the shiny of every animal you have seen"));
      renderMake();
    }
    else if (b.id === "aqBuild") { aquarium = { water: aqDraft.water, set: new Set(aqDraft.set), shiny: !!aqDraft.shiny }; newVariant(seed, true); renderMake(); toast(L("Je aquarium is gebouwd", "Your aquarium has been built")); }
    else if (b.id === "aqRandom") { aquarium = null; aqDraft = null; newVariant(seed, true); renderMake(); }
  });

  function aqCode() {
    let m = 0n;
    AQ_ALL.forEach((k, i) => { if (aquarium.set.has(k)) m |= 1n << BigInt(i); });
    return `aq-${aquarium.water}-${seed.toString(36)}-${m.toString(36)}${aquarium.shiny ? "-s" : ""}`;
  }

  function parseAq(str) {
    const mm = /^aq-(\d)-([0-9a-z]+)-([0-9a-z]+)(-s)?$/.exec(str);
    if (!mm) return null;
    let m = 0n;
    for (const ch of mm[3]) m = m * 36n + BigInt(parseInt(ch, 36));
    return { water: Math.min(WATERS.length - 1, Number(mm[1])), set: new Set(AQ_ALL.filter((k, i) => !RETIRED.has(k) && (m >> BigInt(i)) & 1n)), seed: parseInt(mm[2], 36), shiny: !!mm[4] };
  }

  let polaroidCanvas = null;
  // Photographer reward: a few filters for the camera
  const PHOTO_FILTERS = [["none", "Gewoon", "Plain"], ["grayscale(1) contrast(1.1)", "Zwart-wit", "Black and white"], ["sepia(0.85) saturate(1.1)", "Sepia", "Sepia"],
    ["saturate(1.8) contrast(1.12)", "Levendig", "Vivid"], ["hue-rotate(40deg) saturate(1.4) brightness(1.05)", "Droomzee", "Dream sea"]];
  let photoFilter = "none";
  async function makePolaroid() {
    try { await document.fonts.load("600 40px Caveat"); } catch (e) {}
    const scale = Math.min(1, 1400 / canvas.width);
    const iw = Math.round(canvas.width * scale), ih = Math.round(canvas.height * scale);
    const pad = Math.round(iw * 0.05), bottom = Math.round(iw * 0.16);
    const c = document.createElement("canvas");
    c.width = iw + pad * 2; c.height = ih + pad + bottom;
    const g = c.getContext("2d");
    g.fillStyle = "#f7f4ec"; g.fillRect(0, 0, c.width, c.height);
    if (photoFilter !== "none" && "filter" in g) g.filter = photoFilter;
    g.drawImage(canvas, pad, pad, iw, ih);
    g.filter = "none";
    g.strokeStyle = "rgba(0,0,0,0.08)"; g.strokeRect(pad, pad, iw, ih);
    const date = new Date().toLocaleDateString(LANG === "en" ? "en-GB" : "nl-NL", { day: "numeric", month: "long", year: "numeric" });
    g.fillStyle = "#2b2a33"; g.textBaseline = "middle";
    g.font = `600 ${Math.round(bottom * 0.36)}px Caveat, "Segoe Print", cursive`;
    g.fillText(`${waterTitle()} · ${date}`, pad, ih + pad + bottom * 0.42);
    g.font = `${Math.round(bottom * 0.17)}px "DM Mono", monospace`; g.fillStyle = "rgba(43,42,51,0.6)";
    g.fillText(`${L("oceaan", "ocean")} ${seed}${scene.rare ? " · " + nm(scene.rare) : ""}`, pad, ih + pad + bottom * 0.75);
    return c;
  }

  function closePhoto() { photoView.hidden = true; paused = false; photoBtn.focus(); }

  // Photos you keep go into an album in this browser, as small pictures so many of them fit.
  // The album lives in IndexedDB, which has far more room than localStorage and does not hold up the page while it
  // writes. Where IndexedDB is missing (some embedded pages, private windows) it falls back to localStorage, as before.
  // An album from before is moved over once, which also frees localStorage for the logbook.
  const ALBUM_KEY = "oceaan-album", ALBUM_MAX = 24;
  const validPhotos = list => (Array.isArray(list) ? list : []).filter(x => x && typeof x.id === "string" && typeof x.img === "string" && x.img.startsWith("data:image/jpeg"));
  let album = validPhotos(store.get(ALBUM_KEY, []));
  let albumDB = null; // the open database, once it is known to work
  function idb(mode, fn) {
    return new Promise((resolve, reject) => {
      const tx = albumDB.transaction("kv", mode), req = fn(tx.objectStore("kv"));
      tx.oncomplete = () => resolve(req && req.result); tx.onerror = tx.onabort = () => reject(tx.error);
    });
  }
  function openAlbumDB() {
    try {
      if (!window.indexedDB) return;
      const req = indexedDB.open("oceaan", 1);
      req.onupgradeneeded = () => req.result.createObjectStore("kv");
      req.onerror = () => {};
      req.onsuccess = async () => {
        albumDB = req.result;
        try {
          const stored = validPhotos(await idb("readonly", s => s.get(ALBUM_KEY)));
          const have = new Set(stored.map(x => x.id));
          const merged = [...stored, ...album.filter(x => !have.has(x.id))].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, ALBUM_MAX);
          const moved = album.length > 0;
          album = merged;
          await idb("readwrite", s => s.put(album, ALBUM_KEY));
          if (moved) { try { localStorage.removeItem(ALBUM_KEY); } catch (e) {} }
          applyRewards();
          if (!panelEl.hidden && panelTab === "log" && !detailOpen) renderPanel();
        } catch (e) { albumDB = null; }
      };
    } catch (e) { albumDB = null; }
  }
  openAlbumDB();
  function saveAlbum() {
    if (albumDB) { idb("readwrite", s => s.put(album, ALBUM_KEY)).catch(() => { albumDB = null; saveAlbum(); }); return true; }
    while (album.length) {
      try { localStorage.setItem(ALBUM_KEY, JSON.stringify(album)); return true; }
      catch (e) { if (album.length <= 1) return false; album.pop(); toast(L("Je album is vol: de oudste foto is eruit gegaan", "Your album is full: the oldest photo was removed")); }
    }
    try { localStorage.removeItem(ALBUM_KEY); } catch (e) {}
    return true;
  }
  // Called when the logbook cannot be saved because storage is full: drop the oldest photo, if the album is in localStorage.
  function makeRoomInAlbum() {
    if (typeof album === "undefined" || !album.length || albumDB) return false;
    album.pop();
    try { if (album.length) localStorage.setItem(ALBUM_KEY, JSON.stringify(album)); else localStorage.removeItem(ALBUM_KEY); } catch (e) {}
    toast(L("De opslag was vol: de oudste foto uit je album is eruit gegaan, zodat je logboek bewaard blijft", "Storage was full: the oldest photo in your album was removed so your logbook stays saved"), "important");
    return true;
  }
  function addToAlbum() {
    const w = 520, h = Math.round(polaroidCanvas.height * (w / polaroidCanvas.width));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.getContext("2d").drawImage(polaroidCanvas, 0, 0, w, h);
    const d = new Date();
    const before = reached();
    album.unshift({ id: String(Date.now()), d: d.toISOString().slice(0, 10), seed, water: water.name, img: c.toDataURL("image/jpeg", 0.78) });
    album.length = Math.min(album.length, ALBUM_MAX);
    photoBookAdd(lastPhotoHits); lastPhotoHits = [];
    questEvent("photo");
    toast(saveAlbum() ? L("Bewaard in je album, te vinden in het logboek", "Kept in your album, in the logbook") : L("Bewaren lukt hier niet", "Keeping photos is not possible here"));
    checkMilestones(before);
  }
  function openPhoto(id) {
    const ph = album.find(x => x.id === id);
    if (!ph) return;
    logScroll = panelBody.scrollTop;
    detailOpen = true; detailKey = null;
    const when = dateText(ph.d);
    // a page of the book, like an animal's page: the photo taped in, and beside it when and where it was taken
    renderBookDetail({
      top: `<div class="nb-run">${L("Mijn foto's", "My photos")}</div>`,
      figure: `<figure class="nb-photo album" style="--tilt:${tiltOf(ph.id) - 1}deg"><img alt="${L("Foto van ", "Photo from ")}${when}" src="${ph.img}"></figure>`,
    }, {
      back: `<button type="button" id="detailBack" class="nb-back">‹ ${L("Terug naar het logboek", "Back to the logbook")}</button>`,
      body: `<h2 class="nb-title small">${nm("w:" + ph.water)}</h2>`,
      side: `<dl class="nb-dl">
          <div><dt>${L("Gemaakt", "Taken")}</dt><dd>${when}</dd></div>
          <div><dt>${L("Oceaan", "Ocean")}</dt><dd>${nm("w:" + ph.water)} · ${ph.seed}</dd></div>
        </dl>`,
      nav: `<div class="nb-dnav nb-photo-actions">
          <div class="row">
            <button type="button" id="photoSave" class="primary" data-id="${ph.id}">${L("Opslaan", "Save")}</button>
            <button type="button" id="photoDelete">${L("Verwijderen", "Delete")}</button>
          </div>
          <div class="row" id="photoDeleteConfirm" hidden>
            <span class="nb-note">${L("Deze foto uit je album verwijderen?", "Remove this photo from your album?")}</span>
            <button type="button" id="photoDeleteYes" data-id="${ph.id}">${L("Ja, verwijder", "Yes, delete")}</button>
          </div>
        </div>`,
    });
    document.getElementById("detailBack").focus();
  }

  photoBtn.addEventListener("click", async () => {
    paused = true;
    lastPhotoHits = photoHits(); // what is in view now counts for the photo book, once the photo is kept
    photoFilter = "none";
    renderPhotoFilters();
    polaroidCanvas = await makePolaroid();
    polaroidImg.src = polaroidCanvas.toDataURL("image/png");
    photoView.hidden = false;
    document.getElementById("savePolaroid").focus();
  });
  function renderPhotoFilters() {
    const el = document.getElementById("photoFilters");
    el.hidden = !rewards.has("ph");
    el.innerHTML = PHOTO_FILTERS.map(([f, nl, en]) => `<button type="button" class="chip pick ${photoFilter === f ? "on" : ""}" data-filter-css="${f}" aria-pressed="${photoFilter === f}">${L(nl, en)}</button>`).join("");
  }
  document.getElementById("photoFilters").addEventListener("click", async e => {
    const bt = e.target.closest("button");
    if (!bt) return;
    photoFilter = bt.dataset.filterCss;
    renderPhotoFilters();
    polaroidCanvas = await makePolaroid();
    polaroidImg.src = polaroidCanvas.toDataURL("image/png");
  });
  document.getElementById("savePolaroid").addEventListener("click", () => saveCanvas(polaroidCanvas, `oceaan-${seed}-polaroid.png`));
  document.getElementById("savePlain").addEventListener("click", () => saveCanvas(canvas, `oceaan-${seed}.png`));
  document.getElementById("saveAlbum").addEventListener("click", () => { if (polaroidCanvas) addToAlbum(); });
  document.getElementById("closePhoto").addEventListener("click", closePhoto);

  function saveCanvas(c, filename) {
    c.toBlob(blob => { if (blob) saveBlob(blob, filename); else toast(L("Opslaan mislukt", "Saving failed")); }, "image/png");
  }

  async function saveBlob(blob, filename) {
    {
      if (downloads) {
        try { await downloads.save({ filename, data: blob }); toast(L("Opgeslagen", "Saved")); }
        catch (err) {
          if (err && err.code === "declined") return;
          toast(L("Opslaan is hier niet beschikbaar", "Saving is not available here"));
        }
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }
  }



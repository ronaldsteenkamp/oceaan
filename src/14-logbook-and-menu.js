  // ---- detail card ------------------------------------------------------
  const FACTS = {
    "w:rif": "Koraalriffen bedekken minder dan één procent van de oceaanbodem, maar bijna een kwart van alle zeedieren leeft erop of eromheen.",
    "w:diepzee": "Dieper dan duizend meter komt geen zonlicht meer. Veel dieren maken daar hun eigen licht.",
    "w:noordzee": "De Noordzee is gemiddeld maar zo'n 95 meter diep. Op de Doggersbank is het op sommige plekken minder dan twintig meter.",
    "w:kelpwoud": "Reuzenkelp is een van de snelst groeiende organismen op aarde: op een goede dag tot een halve meter.",
    "w:ijszee": "Zeewater bevriest pas rond min 1,9 graden, omdat het zout het vriespunt verlaagt.",
    "w:mangrove": "Mangrovebossen groeien op de grens van land en zee. Tussen hun wortels groeien jonge vissen veilig op.",
    "w:grot": "Sommige onderwatergrotten, zoals de cenotes in Mexico, lopen kilometers door. Het water is er vaak kristalhelder.",
    amphora: "Romeinen vervoerden wijn, olijfolie en vissaus in amforen. Duikers vinden soms complete ladingen op de bodem.",
    car: "Sommige landen laten oude auto's en treinen bewust zinken, zodat er een kunstmatig rif ontstaat.",
    bell: "Aan de scheepsbel kun je vaak de naam van een wrak aflezen: die staat er meestal in gegraveerd.",
    clam: "Een reuzenschelp kan meer dan een meter breed en wel honderd jaar oud worden. Algen in zijn mantel geven hem kleur.",
    seagrass: "Zeegras is geen zeewier maar een plant met wortels en bloemen. Zeekoeien en schildpadden grazen erop.",
    cassiopea: "De omgekeerde kwal ligt met zijn armen omhoog op de bodem, zodat de algen in zijn armen zonlicht krijgen.",
    lionfish: "De stekels van een koraalduivel zijn giftig. Zijn felle strepen waarschuwen andere dieren.",
    cuttlefish: "Een zeekat kan in een fractie van een seconde van kleur en patroon veranderen, terwijl hij zelf kleurenblind is.",
    lobster: "Een Europese kreeft is blauwzwart. Pas als hij gekookt wordt, kleurt hij rood.",
    nautilus: "De nautilus bestaat al zo'n 500 miljoen jaar. Met gas in de kamers van zijn schelp regelt hij hoe hoog hij zweeft.",
    isopod: "Een reuzenpissebed kan groter worden dan een halve meter en jaren zonder eten op de diepzeebodem.",
    seadragon: "De bladzeedraak lijkt op een drijvend stukje zeewier. Net als bij zeepaardjes draagt het mannetje de eitjes.",
    manatee: "Een zeekoe eet tot wel honderd kilo zeegras per dag. Zijn verste familielid is de olifant.",
    orca: "Orka's zijn eigenlijk de grootste dolfijnen. Elke familiegroep heeft een eigen 'dialect' van geluiden.",
    hammerhead: "Door zijn brede kop kan een hamerhaai bijna rondom kijken. Hij voelt zelfs prooien die in het zand verstopt zitten.",
    sunfish: "De maanvis is de zwaarste beenvis ter wereld: meer dan tweeduizend kilo. Hij eet vooral kwallen.",
    beluga: "Belugas worden ook wel zeekanaries genoemd, omdat ze zoveel fluiten, klikken en piepen.",
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
    sponges: "Sponzen zijn dieren zonder organen. Ze pompen elke dag duizenden liters water door hun lichaam om voedsel eruit te halen.",
    parrotfish: "Een papegaaivis knabbelt aan koraal en poept het fijngemalen uit als wit zand. Veel witte stranden komen deels van hem.",
    boxfish: "Een koffervis zit in een stevig pantser van benen plaatjes en kan alleen zijn vinnen en staart bewegen.",
    pistol: "De klik van een pistoolgarnaal is een van de hardste geluiden in de zee. Een grondel houdt voor hem de wacht.",
    sargassumfish: "De sargassumvis ziet er precies uit als het zeewier waarin hij woont, en klimt erin rond met zijn vinnen als armpjes.",
    spidercrab: "De Japanse reuzenkrab heeft de langste poten van alle geleedpotigen: van punt tot punt tot bijna vier meter.",
    crocodile: "Zeekrokodillen zijn de grootste reptielen ter wereld en zwemmen soms honderden kilometers over open zee.",
    whaleshark: "De walvishaai is de grootste vis ter wereld, maar eet alleen plankton en kleine visjes.",
    sealion: "Zeeleeuwen kunnen, anders dan zeehonden, hun achterflippers onder hun lijf zetten en zo op het land lopen.",
    eagleray: "Een adelaarsrog 'vliegt' met zijn vinnen door het water en springt soms helemaal uit zee.",
    spermwhale: "Een potvis duikt meer dan een kilometer diep om reuzeninktvissen te jagen, en heeft de grootste hersenen van alle dieren.",
    eelmigration: "Europese palingen worden geboren in de Sargassozee. Als doorzichtige glasaaltjes zwemmen ze helemaal naar onze rivieren.",
    quake: "Bij een zeebeving schuift de bodem even op. Vissen en andere dieren merken de trillingen vaak eerder dan mensen.",
    crabmarch: "Op Christmaseiland trekken elk jaar tientallen miljoenen rode krabben tegelijk naar zee om eitjes te leggen.",
    bubblerings: "Dolfijnen blazen voor de lol ringen van lucht. Daarna spelen ze ermee en bijten ze er soms in.",
    aurora: "Het noorderlicht ontstaat als deeltjes van de zon botsen op de lucht hoog boven de aarde.",
    mobydick: "Moby Dick is de witte potvis uit het boek van Herman Melville. Er zijn echt witte potvissen gezien.",
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
    coral: "Koraal is geen plant maar een kolonie van piepkleine diertjes: poliepen.",
    anemone: "Een anemoon steekt met netelcellen, maar clownvissen worden beschermd door een slijmlaagje.",
    vent: "Bij heetwaterbronnen kan het water heter worden dan 350 graden. Door de enorme druk kookt het toch niet.",
    volcano: "Het grootste deel van alle vulkanen op aarde ligt onder water.",
    brine: "Een pekelmeer is zo zout dat het zwaarder is dan het zeewater erboven. Het heeft een eigen oppervlak, met golfjes en al.",
    rocks: "Op rotsen leven veel dieren die zich vastzetten, zoals mosselen, zeepokken en anemonen.",
    canyon: "Het diepste punt van de oceaan, in de Marianentrog, ligt bijna elf kilometer diep.",
    fish: "Vissen in een school houden afstand met hun zijlijn, een zintuig dat kleine trillingen in het water voelt.",
    jelly: "Kwallen hebben geen hersenen, geen hart en geen botten. Ze bestaan voor ruim 95 procent uit water.",
    crab: "Krabben lopen meestal zijwaarts, omdat hun poten zo scharnieren dat dat het snelst gaat.",
    starfish: "Een zeester kan een verloren arm weer aangroeien.",
    urchin: "Een zee-egel loopt op honderden kleine buisvoetjes tussen zijn stekels.",
    octopus: "Een octopus heeft drie harten en blauw bloed.",
    ray: "Een pijlstaartrog ligt vaak half ingegraven in het zand, met alleen zijn ogen erboven.",
    eels: "Zandalen leven in kolonies en schieten razendsnel terug in hun holletje als er gevaar is.",
    seahorse: "Bij zeepaardjes krijgt het mannetje de jongen. Hij draagt de eitjes in een buidel.",
    puffer: "Een kogelvis blaast zichzelf op door snel heel veel water in te slikken.",
    angler: "Het lichtje van een hengelvis komt van bacteriën die in het lokaas leven.",
    moray: "Een murene doet steeds zijn bek open en dicht. Zo pompt hij water langs zijn kieuwen.",
    squid: "Inktvissen zwemmen met straalaandrijving: ze persen water met kracht naar buiten.",
    hermit: "Een heremietkreeft verhuist naar een grotere schelp als hij gegroeid is.",
    slugs: "Bij gevaar kan een zeekomkommer een deel van zijn ingewanden naar buiten werpen. Later groeien die weer aan.",
    comb: "Ribkwallen zijn geen echte kwallen. Het regenbooglicht komt van rijen trilhaartjes die het licht breken.",
    lantern: "Lantaarnvissen zwemmen elke nacht honderden meters omhoog om te eten en duiken bij daglicht weer de diepte in.",
    otters: "Zeeotters houden soms elkaars poot vast als ze slapen, zodat ze niet uit elkaar drijven.",
    seal: "Een zeehond kan tijdens het duiken zijn hartslag flink verlagen om zuurstof te sparen.",
    penguins: "Pinguïns kunnen niet vliegen, maar onder water vliegen ze bijna, met hun vleugels als vinnen.",
    clown: "Clownvissen worden allemaal als mannetje geboren. De grootste van een groepje wordt een vrouwtje.",
    mantis: "Een bidsprinkhaankreeft slaat zo snel dat er in het water een flitsje en een knalletje ontstaan.",
    archer: "Een schuttersvis schiet met een straaltje water insecten van takken boven het water.",
    flyingfish: "Vliegende vissen springen uit het water en zweven op hun grote borstvinnen tientallen meters ver, om roofvissen te ontwijken.",
    cleaners: "Poetsvisjes eten parasieten van grotere vissen, die daar speciaal voor naar hun poetsstation komen.",
    grouper: "Tandbaarzen kunnen heel groot worden. De reuzentandbaars wordt meer dan twee meter lang.",
    whale: "Walvissen stammen af van landdieren die zo'n vijftig miljoen jaar geleden de zee weer in gingen.",
    humpback: "Mannetjes bultruggen zingen lange liederen, die soms meer dan twintig minuten duren en urenlang worden herhaald.",
    shark: "Een haai heeft geen botten. Zijn skelet is van kraakbeen, net als je oorschelp.",
    turtle: "Zeeschildpadden komen om eieren te leggen vaak terug naar het strand waar ze zelf geboren zijn.",
    manta: "Een reuzenmanta kan een spanwijdte van zo'n zeven meter hebben.",
    dolphins: "Dolfijnen slapen met één hersenhelft tegelijk, zodat ze kunnen blijven ademen.",
    swordfish: "De zeilvis is een van de snelste vissen. Hij klapt zijn grote rugvin op om een school vissen bij elkaar te drijven.",
    sub: "Rond 1620 bouwde de Nederlander Cornelis Drebbel een van de eerste duikboten, die onder water door de Theems voer.",
    narwhal: "De slagtand van een narwal is een tand die door de bovenlip naar buiten groeit, soms bijna drie meter lang.",
    giant: "Een reuzeninktvis heeft ogen zo groot als een etensbord.",
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
  };

  const FACTS_EN = {
    "w:rif": "Coral reefs cover less than one percent of the ocean floor, yet almost a quarter of all sea creatures live on or around them.",
    "w:diepzee": "Below a thousand metres no sunlight reaches. Many animals down there make their own light.",
    "w:noordzee": "The North Sea is only about 95 metres deep on average. On the Dogger Bank it is less than twenty metres in places.",
    "w:kelpwoud": "Giant kelp is one of the fastest-growing living things on earth: up to half a metre on a good day.",
    "w:ijszee": "Seawater only freezes at about minus 1.9 degrees, because the salt lowers the freezing point.",
    "w:mangrove": "Mangrove forests grow where the land meets the sea. Young fish grow up safely between their roots.",
    "w:grot": "Some underwater caves, like the cenotes in Mexico, run on for kilometres. The water there is often crystal clear.",
    amphora: "The Romans shipped wine, olive oil and fish sauce in amphorae. Divers sometimes find whole cargoes on the seabed.",
    car: "Some countries sink old cars and trains on purpose, so that an artificial reef grows on them.",
    bell: "A ship's bell often tells you the name of a wreck: it is usually engraved on it.",
    clam: "A giant clam can grow more than a metre wide and live for a hundred years. Algae in its mantle give it colour.",
    seagrass: "Seagrass is not seaweed but a plant with roots and flowers. Manatees and turtles graze on it.",
    cassiopea: "The upside-down jellyfish lies on the seabed with its arms up, so the algae in its arms get sunlight.",
    lionfish: "The spines of a lionfish are venomous. Its bright stripes warn other animals.",
    cuttlefish: "A cuttlefish can change colour and pattern in a fraction of a second, even though it is colour-blind itself.",
    lobster: "A European lobster is blue-black. It only turns red when it is cooked.",
    nautilus: "The nautilus has been around for some 500 million years. Gas in the chambers of its shell sets how high it floats.",
    isopod: "A giant isopod can grow longer than half a metre and go for years without food on the deep seabed.",
    seadragon: "A leafy seadragon looks like a drifting bit of seaweed. Just like seahorses, the male carries the eggs.",
    manatee: "A manatee eats up to a hundred kilos of seagrass a day. Its distant relative is the elephant.",
    orca: "Orcas are really the largest dolphins. Every family group has its own 'dialect' of calls.",
    hammerhead: "Its wide head lets a hammerhead look almost all the way round, and even sense prey hidden in the sand.",
    sunfish: "The ocean sunfish is the heaviest bony fish in the world: over two thousand kilos. It mostly eats jellyfish.",
    beluga: "Belugas are also called sea canaries, because they whistle, click and squeak so much.",
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
    sponges: "Sponges are animals without organs. Every day they pump thousands of litres of water through their bodies to filter out food.",
    parrotfish: "A parrotfish nibbles coral and poops it out as fine white sand. Many white beaches come partly from parrotfish.",
    boxfish: "A boxfish lives in a stiff armour of bony plates and can only move its fins and tail.",
    pistol: "The snap of a pistol shrimp is one of the loudest sounds in the sea. A goby keeps watch for it.",
    sargassumfish: "The sargassum fish looks just like the seaweed it lives in, and climbs around in it with arm-like fins.",
    spidercrab: "The Japanese spider crab has the longest legs of any arthropod: almost four metres from tip to tip.",
    crocodile: "Saltwater crocodiles are the largest reptiles in the world and sometimes swim hundreds of kilometres across open sea.",
    whaleshark: "The whale shark is the biggest fish in the world, yet it only eats plankton and tiny fish.",
    sealion: "Unlike seals, sea lions can turn their back flippers under their body and walk on land.",
    eagleray: "An eagle ray 'flies' through the water with its fins and sometimes leaps right out of the sea.",
    spermwhale: "A sperm whale dives more than a kilometre deep to hunt giant squid, and has the largest brain of any animal.",
    eelmigration: "European eels are born in the Sargasso Sea. As see-through glass eels they swim all the way to European rivers.",
    quake: "In a seaquake the seabed shifts for a moment. Fish and other animals often feel the trembling before people do.",
    crabmarch: "On Christmas Island tens of millions of red crabs march to the sea together every year to lay their eggs.",
    bubblerings: "Dolphins blow rings of air for fun. Then they play with them and sometimes bite them.",
    aurora: "The northern lights appear when particles from the sun crash into the air high above the earth.",
    mobydick: "Moby Dick is the white sperm whale from Herman Melville's book. Real white sperm whales have been seen.",
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
    coral: "Coral is not a plant but a colony of tiny animals: polyps.",
    anemone: "An anemone stings with stinging cells, but clownfish are protected by a layer of mucus.",
    vent: "At hydrothermal vents the water can be hotter than 350 degrees. Because of the enormous pressure it still does not boil.",
    volcano: "Most of the volcanoes on earth are under water.",
    brine: "A brine pool is so salty that it is heavier than the seawater above it. It has its own surface, waves and all.",
    rocks: "Many animals that attach themselves live on rocks, such as mussels, barnacles and anemones.",
    canyon: "The deepest point of the ocean, in the Mariana Trench, is almost eleven kilometres down.",
    fish: "Fish in a school keep their distance with their lateral line, a sense that feels tiny vibrations in the water.",
    jelly: "Jellyfish have no brain, no heart and no bones. They are more than 95 percent water.",
    crab: "Crabs usually walk sideways, because their legs are hinged in a way that makes that the fastest.",
    starfish: "A starfish can regrow a lost arm.",
    urchin: "A sea urchin walks on hundreds of tiny tube feet between its spines.",
    octopus: "An octopus has three hearts and blue blood.",
    ray: "A stingray often lies half buried in the sand, with only its eyes showing.",
    eels: "Garden eels live in colonies and dart back into their burrows the moment there is danger.",
    seahorse: "With seahorses, the male has the babies. He carries the eggs in a pouch.",
    puffer: "A pufferfish inflates itself by quickly swallowing a lot of water.",
    angler: "The light of an anglerfish comes from bacteria that live in its lure.",
    moray: "A moray keeps opening and closing its mouth. That is how it pumps water over its gills.",
    squid: "Squid swim by jet propulsion: they squirt water out with force.",
    hermit: "A hermit crab moves into a bigger shell once it has grown.",
    slugs: "When threatened, a sea cucumber can throw out part of its insides. They grow back later.",
    comb: "Comb jellies are not real jellyfish. The rainbow light comes from rows of tiny hairs that break up the light.",
    lantern: "Every night lanternfish swim hundreds of metres up to feed, and dive back into the deep at daybreak.",
    otters: "Sea otters sometimes hold paws while they sleep, so they do not drift apart.",
    seal: "A seal can slow its heartbeat a lot while diving to save oxygen.",
    penguins: "Penguins cannot fly, but under water they almost do, using their wings as flippers.",
    clown: "All clownfish are born male. The largest of a small group becomes a female.",
    mantis: "A mantis shrimp strikes so fast that a tiny flash and pop appear in the water.",
    archer: "An archerfish shoots insects off branches above the water with a jet of water.",
    flyingfish: "Flying fish leap out of the water and glide for tens of metres on their big pectoral fins, to escape from predators.",
    cleaners: "Cleaner wrasse eat parasites off larger fish, which visit their cleaning station especially for that.",
    grouper: "Groupers can grow very large. The giant grouper reaches more than two metres.",
    whale: "Whales descend from land animals that went back into the sea about fifty million years ago.",
    humpback: "Male humpback whales sing long songs that can last more than twenty minutes and are repeated for hours.",
    shark: "A shark has no bones. Its skeleton is made of cartilage, like your ear.",
    turtle: "Sea turtles often return to lay eggs on the beach where they themselves were born.",
    manta: "A giant manta can have a wingspan of about seven metres.",
    dolphins: "Dolphins sleep with one half of their brain at a time, so they can keep breathing.",
    swordfish: "The sailfish is one of the fastest fish. It raises its big dorsal fin to herd a school of fish together.",
    sub: "Around 1620 the Dutchman Cornelis Drebbel built one of the first submarines, which travelled under water along the Thames.",
    narwhal: "A narwhal tusk is a tooth that grows out through the upper lip, sometimes almost three metres long.",
    giant: "A giant squid has eyes as big as a dinner plate.",
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
  };

  let detailOpen = false, logScroll = 0;
  function openDetail(key) {
    logScroll = panelBody.scrollTop;
    detailOpen = true;
    const base = key.startsWith("shiny:") ? key.slice(6) : key, e = logbook.get(key);
    const facts = LANG === "en" ? FACTS_EN : FACTS;
    const fact = key.startsWith("shiny:")
      ? L(`Een shiny is een zeldzame kleurvariant: ongeveer 1 op de ${SHINY_N[base] || 1000} van deze dieren ziet er zo uit. `, `A shiny is a rare colour variant: about 1 in ${SHINY_N[base] || 1000} of these animals looks like this. `) + (facts[base] || "")
      : facts[key] || "";
    const where = hintFor(key);
    const when = e && e.first ? dateText(e.first) : "";
    panelBody.innerHTML = `
      <div class="detail">
        <button type="button" id="detailBack" class="ghost">${L("Terug naar het logboek", "Back to the logbook")}</button>
        <img class="big" alt="${nm(key)}" src="${thumbURL(key, !!e, 4)}">
        <h2>${nm(key)}</h2>
        <p class="fact">${fact}</p>
        <dl>
          <div><dt>${L("Waar", "Where")}</dt><dd>${where ? where.charAt(0).toUpperCase() + where.slice(1) : L("Overal", "Everywhere")}</dd></div>
          ${!e ? `<div><dt>${L("Gezien", "Seen")}</dt><dd>${L("Nog niet gevonden", "Not found yet")}</dd></div>`
            : key.startsWith("shiny:") ? `<div><dt>${L("Gezien", "Seen")}</dt><dd>${e.n === 1 ? L("1 keer", "once") : e.n > 99 ? L("99+ keer", "99+ times") : L(e.n + " keer", e.n + " times")}</dd></div>` : ""}
          ${when ? `<div><dt>${L("Eerste keer", "First time")}</dt><dd>${when}</dd></div>` : ""}
        </dl>
      </div>`;
    panelBody.scrollTop = 0;
    document.getElementById("detailBack").focus();
  }
  function closeDetail() {
    detailOpen = false;
    renderPanel();
    panelBody.scrollTop = logScroll;
  }

  // Hints are worked out from the same tables that build the oceans.
  const EVENT_HINTS = {
    fish: "overal te zien", jelly: "drijft in bijna elk water",
    treasure: "tik op een fles voor de schatkaart en graaf op het kruisje",
    moray: "woont in het gat van het piratenwrak", clown: "woont in de anemoon op het koraalrif",
    grouper: "komt langs bij het poetsstation", giant: "steekt af en toe zijn tentakels uit in de diepzee",
    baitball: "gebeurt af en toe, in elk water behalve de diepzee", spawning: "scholen leggen af en toe eitjes",
    coralspawn: "op een volle-maannacht bij het koraal", storm: "trekt af en toe over wateren met een oppervlak",
    eruption: "wacht bij de onderzeese vulkaan", task: "zoek de drie zeepaardjes die in de kelp verstopt zitten",
    mermaid: "zeldzaam, ongeveer 1 op de 17 oceanen", kraken: "zeldzaam, ongeveer 1 op de 17 oceanen",
    ghost: "zeldzaam, ongeveer 1 op de 17 oceanen", whalefall: "zeldzaam, ongeveer 1 op de 20 oceanen",
    serpent: "zeldzaam, ongeveer 1 op de 25 oceanen", megalodon: "zeldzaam, ongeveer 1 op de 25 oceanen",
    goldpearl: "zeldzaam, ongeveer 1 op de 33 oceanen; tik op de reuzenschelp als hij openstaat",
    jellybloom: "drijft af en toe door het water", whalesong: "een bultrug zingt soms als hij langszwemt",
    glowtide: "op een donkere nacht in wateren met een oppervlak; beweeg dan je vinger door het water",
    hatchlings: "zwemmen af en toe langs in wateren met zeeschildpadden",
    eelmigration: "trekt af en toe voorbij in de Sargassozee, de Noordzee, het kelpwoud en de mangrove",
    quake: "heel af en toe, in elk water", crabmarch: "steekt af en toe de bodem over, als er geen afgrond is",
    bubblerings: "dolfijnen blazen ze soms als ze langszwemmen",
    aurora: "zeldzaam, ongeveer 1 op de 33 oceanen, alleen in wateren met een oppervlak",
    mobydick: "zeldzaam, ongeveer 1 op de 33 oceanen", ghostdiver: "zeldzaam, ongeveer 1 op de 33 oceanen",
    sargassumfish: "verstopt zich in drijvend sargassumwier",
  };
  function hintFor(key) {
    if (key.startsWith("shiny:")) {
      const base = hintFor(key.slice(6));
      const n = SHINY_N[key.slice(6)] || 1000;
      return L(`ongeveer 1 op de ${n} van deze dieren is shiny`, `about 1 in ${n} of these animals is shiny`) + (base ? "; " + base : "");
    }
    if (key.startsWith("w:")) return L(`elke oceaan kiest een van de ${WATERS.length} wateren`, `every ocean picks one of the ${WATERS.length} waters`);
    const hints = LANG === "en" ? EVENT_HINTS_EN : EVENT_HINTS;
    if (hints[key]) return hints[key];
    const where = WATERS.filter(w => (w.props[key] || 0) > 0 || (w.life[key] || 0) > 0 || w.visitors.includes(key)).map(w => nm("w:" + w.name));
    return where.length ? L("komt voor in ", "found in ") + where.join(", ") : "";
  }

  const EVENT_HINTS_EN = {
    fish: "seen everywhere", jelly: "drifts in almost every water",
    treasure: "tap a bottle for the treasure map, then dig at the cross",
    moray: "lives in the hole in the pirate wreck", clown: "lives in the anemone on the coral reef",
    grouper: "visits the cleaning station", giant: "now and then reaches out its tentacles in the deep sea",
    baitball: "happens now and then, in every water except the deep sea", spawning: "schools lay eggs now and then",
    coralspawn: "on a full-moon night at the coral", storm: "now and then rolls over waters with a surface",
    eruption: "waiting at the undersea volcano", task: "find the three seahorses hidden in the kelp",
    mermaid: "rare, about 1 in 17 oceans", kraken: "rare, about 1 in 17 oceans",
    ghost: "rare, about 1 in 17 oceans", whalefall: "rare, about 1 in 20 oceans",
    serpent: "rare, about 1 in 25 oceans", megalodon: "rare, about 1 in 25 oceans",
    goldpearl: "rare, about 1 in 33 oceans; tap the giant clam while it is open",
    jellybloom: "drifts through now and then", whalesong: "a humpback sometimes sings as it swims by",
    glowtide: "on a dark night in waters with a surface; move your finger through the water",
    hatchlings: "swim past now and then in waters with sea turtles",
    eelmigration: "passes by now and then in the Sargasso Sea, the North Sea, the kelp forest and the mangrove",
    quake: "very now and then, in any water", crabmarch: "crosses the floor now and then, where there is no abyss",
    bubblerings: "dolphins sometimes blow them as they swim past",
    aurora: "rare, about 1 in 33 oceans, only in waters with a surface",
    mobydick: "rare, about 1 in 33 oceans", ghostdiver: "rare, about 1 in 33 oceans",
    sargassumfish: "hides in floating sargassum weed",
  };

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
    return `
      <h3>${L("Deze oceaan delen", "Share this ocean")}</h3>
      <p class="sum">${IN_ARTIFACT ? L("Stuur deze code mee met de link. Wie hem hieronder invult, krijgt precies deze oceaan.", "Send this code along with the link. Whoever enters it below gets exactly this ocean.") : L("Wie deze link opent, krijgt precies deze oceaan.", "Whoever opens this link gets exactly this ocean.")}</p>
      <div class="share"><input id="shareCode" readonly value="${link}" aria-label="${L("Code van deze oceaan", "Code of this ocean")}"><button type="button" id="shareCopy">${L("Kopieer", "Copy")}</button>${canShare ? `<button type="button" id="shareNative" class="primary">${L("Delen", "Share")}</button>` : ""}</div>
      <h3>${L("Een code openen", "Open a code")}</h3>
      <div class="share"><input id="openCode" placeholder="#12345" aria-label="${L("Code om te openen", "Code to open")}"><button type="button" id="openGo">${L("Open", "Open")}</button></div>
      <h3>${L("Rust en geluid", "Calm and sound")}</h3>
      <div class="row"><button type="button" id="restToggle" class="switch" role="switch" aria-checked="${restMode}"><span class="track"></span>${L("Rustmodus", "Calm mode")}</button></div>
      <p class="sum">${L("Langzamer, zonder grote gebeurtenissen en meldingen. Fijn als achtergrond.", "Slower, without big events or messages. Nice as a background.")}</p>
      <div class="row"><label for="vol">${L("Volume", "Volume")}</label><input id="vol" type="range" min="0" max="100" value="${Math.round(volume * 100)}"></div>
      <h3>${L("Taal", "Language")}</h3>
      <div class="chips" role="group" aria-label="${L("Taal", "Language")}">
        <button type="button" class="chip pick ${LANG === "nl" ? "on" : ""}" data-lang="nl" aria-pressed="${LANG === "nl"}" lang="nl">Nederlands</button>
        <button type="button" class="chip pick ${LANG === "en" ? "on" : ""}" data-lang="en" aria-pressed="${LANG === "en"}" lang="en">English</button>
      </div>
      <h3>${L("Uitleg", "Help")}</h3>
      <div class="row"><button type="button" id="showWelcome">${L("Uitleg opnieuw tonen", "Show the introduction again")}</button></div>
      <p class="sum">${L("Met het toetsenbord: pijltjes sturen de duiker, E opent wat de duiker aanraakt, de spatiebalk geeft een nieuwe oceaan en Esc sluit dit menu.", "With a keyboard: arrow keys steer the diver, E opens what the diver touches, space gives a new ocean and Esc closes this menu.")}</p>`;
  }

  function openCode(raw) {
    const str = raw.trim().replace(/^.*#/, "").toLowerCase();
    const aq = parseAq(str);
    if (aq) { aquarium = { water: aq.water, set: aq.set }; aqDraft = null; newVariant(aq.seed, true); return true; }
    if (/^\d{1,10}$/.test(str)) { aquarium = null; aqDraft = null; newVariant(Number(str), true); return true; }
    return false;
  }

  panelBody.addEventListener("input", e => { if (e.target.id === "vol") setVolume(Number(e.target.value) / 100); });
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

  const AQ_GROUPS = [["Bodem en vondsten", PROP_KEYS], ["Dieren", LIFE_KEYS], ["Bezoekers", VIS_KEYS], ["Zeldzaam", RARE_KEYS]];

  function currentAsDraft() {
    const S = scene, set = new Set();
    for (const g of S.ground) if (PROP_KEYS.includes(g.kind)) set.add(g.kind);
    if (S.canyon) set.add("canyon");
    const life = presentLife(S);
    for (const k of LIFE_KEYS) if (life[k]) set.add(k);
    for (const v of S.visitorPool) if (VIS_KEYS.includes(v)) set.add(v);
    for (const r of S.rares) set.add(r);
    if (S.flyers && S.flyers.enabled) set.add("flyingfish");
    return { water: S.waterIndex, set };
  }

  function aquariumHTML() {
    if (!aqDraft) aqDraft = currentAsDraft();
    let html = `<p class="sum">${L("Kies zelf wat er in je oceaan komt. Op een smal scherm passen niet alle grote dingen naast elkaar.", "Choose what goes into your ocean. On a narrow screen not all large things fit side by side.")}</p><h3>${L("Water", "Water")}</h3><div class="chips">`;
    html += WATERS.map((w, i) => `<button type="button" class="chip pick ${aqDraft.water === i ? "on" : ""}" data-water="${i}" aria-pressed="${aqDraft.water === i}">${nm("w:" + w.name)}</button>`).join("") + `</div>`;
    for (const [title, keys] of AQ_GROUPS) {
      html += `<h3>${groupName(title)}</h3><div class="chips">` + keys.map(k => `<button type="button" class="chip pick ${aqDraft.set.has(k) ? "on" : ""}" data-key="${k}" aria-pressed="${aqDraft.set.has(k)}">${nm(k)}</button>`).join("") + `</div>`;
    }
    html += `<div class="actions"><button type="button" id="aqBuild" class="primary">${L("Bouw dit aquarium", "Build this aquarium")}</button><button type="button" id="aqRandom">${L("Terug naar willekeurig", "Back to random")}</button></div>`;
    if (aquarium) html += `<p class="sum">${L("Je aquarium is gebouwd. De code bovenaan deze pagina deelt precies dit aquarium.", "Your aquarium is built. The code at the top of this page shares exactly this aquarium.")}</p>`;
    return html;
  }

  panelBody.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.detail) { openDetail(b.dataset.detail); return; }
    if (b.dataset.filter) { logFilter = b.dataset.filter; renderPanel(); return; }
    if (b.dataset.lang) { setLang(b.dataset.lang); return; }
    if (b.dataset.photo) { openPhoto(b.dataset.photo); return; }
    if (b.id === "photoSave") { const ph = album.find(x => x.id === b.dataset.id); if (ph) fetch(ph.img).then(r => r.blob()).then(bl => saveBlob(bl, `oceaan-${ph.seed}.jpg`)); return; }
    if (b.id === "photoDelete") { document.getElementById("photoDeleteConfirm").hidden = false; b.hidden = true; return; }
    if (b.id === "photoDeleteYes") { album = album.filter(x => x.id !== b.dataset.id); saveAlbum(); closeDetail(); toast(L("Foto verwijderd", "Photo removed")); return; }
    if (b.id === "detailBack") { closeDetail(); return; }
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
    if (b.id === "logResetYes") {
      resetLogbook();
      renderPanel();
      toast(L("Je logboek is gewist", "Your logbook has been cleared"));
      return;
    }
    if (b.id === "shareNative") {
      navigator.share({ title: "Oceaan", text: "Kijk eens naar deze oceaan", url: shareLink() }).catch(() => {});
      return;
    }
    if (b.id === "shareCopy") {
      const inp = document.getElementById("shareCode");
      navigator.clipboard.writeText(inp.value).then(() => toast(L("Gekopieerd", "Copied")), () => { inp.select(); toast(L("Selecteer en kopieer de code zelf", "Select and copy the code yourself")); });
      return;
    }
    if (b.id === "openGo") {
      const inp = document.getElementById("openCode");
      if (openCode(inp.value)) { renderMake(); toast(L("Code geopend", "Code opened")); }
      else toast(L("Die code herken ik niet. Een code is een getal of begint met #aq-", "That code is not recognised. A code is a number or starts with #aq-"));
      return;
    }
    if (b.id === "restToggle") {
      restMode = !restMode;
      store.set("oceaan-rust", restMode);
      updateTask();
      renderMake();
      return;
    }
    if (b.id === "showWelcome") { panelEl.hidden = true; welcomeEl.hidden = false; document.getElementById("welcomeGo").focus(); return; }
    if (b.dataset.water) { aqDraft.water = Number(b.dataset.water); renderMake(); }
    else if (b.dataset.key) { const k = b.dataset.key; if (aqDraft.set.has(k)) aqDraft.set.delete(k); else aqDraft.set.add(k); renderMake(); }
    else if (b.id === "aqBuild") { aquarium = { water: aqDraft.water, set: new Set(aqDraft.set) }; newVariant(seed, true); renderMake(); toast(L("Je aquarium is gebouwd", "Your aquarium has been built")); }
    else if (b.id === "aqRandom") { aquarium = null; aqDraft = null; newVariant(randomSeed(), true); renderMake(); }
  });

  function aqCode() {
    let m = 0n;
    AQ_ALL.forEach((k, i) => { if (aquarium.set.has(k)) m |= 1n << BigInt(i); });
    return `aq-${aquarium.water}-${seed.toString(36)}-${m.toString(36)}`;
  }

  function parseAq(str) {
    const mm = /^aq-(\d)-([0-9a-z]+)-([0-9a-z]+)$/.exec(str);
    if (!mm) return null;
    let m = 0n;
    for (const ch of mm[3]) m = m * 36n + BigInt(parseInt(ch, 36));
    return { water: Math.min(WATERS.length - 1, Number(mm[1])), set: new Set(AQ_ALL.filter((k, i) => (m >> BigInt(i)) & 1n)), seed: parseInt(mm[2], 36) };
  }

  let polaroidCanvas = null;
  async function makePolaroid() {
    try { await document.fonts.load("600 40px Caveat"); } catch (e) {}
    const scale = Math.min(1, 1400 / canvas.width);
    const iw = Math.round(canvas.width * scale), ih = Math.round(canvas.height * scale);
    const pad = Math.round(iw * 0.05), bottom = Math.round(iw * 0.16);
    const c = document.createElement("canvas");
    c.width = iw + pad * 2; c.height = ih + pad + bottom;
    const g = c.getContext("2d");
    g.fillStyle = "#f7f4ec"; g.fillRect(0, 0, c.width, c.height);
    g.drawImage(canvas, pad, pad, iw, ih);
    g.strokeStyle = "rgba(0,0,0,0.08)"; g.strokeRect(pad, pad, iw, ih);
    const date = new Date().toLocaleDateString(LANG === "en" ? "en-GB" : "nl-NL", { day: "numeric", month: "long", year: "numeric" });
    g.fillStyle = "#2b2a33"; g.textBaseline = "middle";
    g.font = `600 ${Math.round(bottom * 0.36)}px Caveat, "Segoe Print", cursive`;
    g.fillText(`${nm("w:" + water.name)} · ${date}`, pad, ih + pad + bottom * 0.42);
    g.font = `${Math.round(bottom * 0.17)}px "DM Mono", monospace`; g.fillStyle = "rgba(43,42,51,0.6)";
    g.fillText(`${L("oceaan", "ocean")} ${seed}${scene.rare ? " · " + nm(scene.rare) : ""}`, pad, ih + pad + bottom * 0.75);
    return c;
  }

  function closePhoto() { photoView.hidden = true; paused = false; photoBtn.focus(); }

  // Photos you keep go into an album in this browser, as small pictures so many of them fit.
  const ALBUM_KEY = "oceaan-album", ALBUM_MAX = 24;
  let album = store.get(ALBUM_KEY, []);
  if (!Array.isArray(album)) album = [];
  album = album.filter(x => x && typeof x.img === "string" && x.img.startsWith("data:image/jpeg"));
  function saveAlbum() {
    while (album.length) {
      try { localStorage.setItem(ALBUM_KEY, JSON.stringify(album)); return true; }
      catch (e) { if (album.length <= 1) return false; album.pop(); toast(L("Je album is vol: de oudste foto is eruit gegaan", "Your album is full: the oldest photo was removed")); }
    }
    try { localStorage.removeItem(ALBUM_KEY); } catch (e) {}
    return true;
  }
  function addToAlbum() {
    const w = 520, h = Math.round(polaroidCanvas.height * (w / polaroidCanvas.width));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.getContext("2d").drawImage(polaroidCanvas, 0, 0, w, h);
    const d = new Date();
    album.unshift({ id: String(Date.now()), d: d.toISOString().slice(0, 10), seed, water: water.name, img: c.toDataURL("image/jpeg", 0.78) });
    album.length = Math.min(album.length, ALBUM_MAX);
    toast(saveAlbum() ? L("Bewaard in je album, te vinden in het logboek", "Kept in your album, in the logbook") : L("Bewaren lukt hier niet", "Keeping photos is not possible here"));
  }
  function albumHTML() {
    if (!album.length) return `<p class="sum">${L(`Nog geen foto's. Maak een foto met de camera en kies "In mijn album".`, `No photos yet. Take a photo with the camera and choose "Add to my album".`)}</p>`;
    return `<h3>${L("Mijn foto's", "My photos")}</h3><div class="album">` + album.map(ph => `<button type="button" data-photo="${ph.id}" aria-label="${L("Foto van ", "Photo from ")}${dateText(ph.d)}"><img alt="" src="${ph.img}"></button>`).join("") + `</div>`;
  }
  function openPhoto(id) {
    const ph = album.find(x => x.id === id);
    if (!ph) return;
    logScroll = panelBody.scrollTop;
    detailOpen = true;
    const when = dateText(ph.d);
    panelBody.innerHTML = `
      <div class="detail album-view">
        <button type="button" id="detailBack" class="ghost">${L("Terug naar het logboek", "Back to the logbook")}</button>
        <img alt="${L("Foto van ", "Photo from ")}${when}" src="${ph.img}">
        <dl>
          <div><dt>${L("Gemaakt", "Taken")}</dt><dd>${when}</dd></div>
          <div><dt>${L("Oceaan", "Ocean")}</dt><dd>${nm("w:" + ph.water)} · ${ph.seed}</dd></div>
        </dl>
        <div class="row">
          <button type="button" id="photoSave" class="primary" data-id="${ph.id}">${L("Opslaan", "Save")}</button>
          <button type="button" id="photoDelete">${L("Verwijderen", "Delete")}</button>
        </div>
        <div class="row" id="photoDeleteConfirm" hidden>
          <span class="sum">${L("Deze foto uit je album verwijderen?", "Remove this photo from your album?")}</span>
          <button type="button" id="photoDeleteYes" data-id="${ph.id}">${L("Ja, verwijder", "Yes, delete")}</button>
        </div>
      </div>`;
    panelBody.scrollTop = 0;
    document.getElementById("detailBack").focus();
  }

  photoBtn.addEventListener("click", async () => {
    paused = true;
    polaroidCanvas = await makePolaroid();
    polaroidImg.src = polaroidCanvas.toDataURL("image/png");
    photoView.hidden = false;
    document.getElementById("savePolaroid").focus();
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



# Biologische evaluatie van de dieren in Oceaan

*Oktober 2026 — beoordeling door een mariene bioloog van alle 128 dieren in `src/00-animals.js`, met verbeterplan. In deze ronde is geen spelcode aangepast.*

## Stand van uitvoering (16 oktober 2026)

Uitgevoerd in zes commits:

| commit | wat | rapport |
|---|---|---|
| Biologie: elk dier in zijn eigen water, groepsnamen, betere feiten | verspreiding Noordzee/kelpwoud/Sargassozee/diepzee/grot/bezoekers, groepsnamen als SCI, reuzenschelp alleen rif en lagune, alle feitcorrecties, Tuinalen, Lamantijn, Yellow-bellied sea snake | 3.2–3.10 |
| IJszee: noordpool en zuidpool apart | veld `pole` in het register, poolkeuze per oceaan uit een eigen stroom, titel "IJszee · noordpool/zuidpool", pool in de logboekhint | 3.1 |
| Gedrag: dieren in verhouding, ademen aan het oppervlak, zeeslang bovenin | orka, potvis, witpuntrifhaai, dolfijn, Japanse reuzenkrab; luchthappers komen ademen, walvissen blazen; zeeslang vlak onder het oppervlak | 3.11 |
| Tekeningen: reuzenschelp, Portugees oorlogsschip, ribkwal, oorkwal, clownvis | 3.12 (Middel); oorkwal en reuzenschelp later op verzoek teruggezet naar de oude tekening | 3.12 |
| Tekeningen en shiny's: haarster, bladzeedraak, heremiet, echte kleurvarianten | 3.12 (Laag) en 3.13 | 3.12–3.13 |
| (vaste oceanen vastgelegd in `zaden.json`) | oude links tonen een andere oceaan; dat was afgesproken | — |

Bewust nog **niet** gedaan:
- **Volgorde in LOG_SUBS** (19): verandert alleen de volgorde in het logboek, maar raakt `LIFE_KEYS` en de grens van vier nieuwe dieren. Dat is een smaakkeuze voor Ronald.
- **Naam "Naaldvis" → "Geep"** (18): de Nederlandse naam is twijfel.
- **Lantaarnvis, walvishaai, zeekomkommer, pijlstaartrog bijtekenen** (3.12, Laag): door de groepsnamen is het meeste niet meer nodig.
- **Witpuntrifhaai 's nachts vaker** (3.11): optioneel.
- **Nieuwe dieren** (hoofdstuk 5): alleen suggesties; elk nieuw dier gaat via de skill `oceaan-nieuw-dier`.
- De regelnummers in hoofdstuk 3 verwijzen naar de stand **vóór** deze commits.

## Werkwijze

- **Inventaris** uit het register (`00-animals.js`), de bewegingstabellen `FAUNA`/`FAUNA_VIS` (`13-fauna-system.js`), `W6_FAUNA`/`W6_VISITORS` (`14-wave6.js`), `W7_FAUNA` (`14-wave7-wadden.js`), de bezoekers (`VISITOR_SIZE`/`VISITOR_SPEED` in `04-creatures.js`, `11-mangrove-and-cave.js`, `12-lagoon-and-sargasso.js`) en de oudere dieren in `02-scene.js`, `11-` en `12-`. De getallen zijn uit het draaiende spel gehaald (headless Chrome), niet overgetypt. De volledige tabel staat in **bijlage A**.
- **Bekeken**: `python build.py` gedraaid; daarna elk logboekplaatje en elke shiny los gerenderd op 3× schaal (`thumbURL(k, true, 3)`) en zelf bekeken, tien dieren per vel.
- **Let op:** het bestand `11-x3-fauna.js` uit de opdracht bestaat niet (meer). De tekenstijl staat nu in de stijlgids bovenaan `00-animals.js`; de tekeningen staan in `04-`, `05-`, `11-`, `12-`, `13-fauna-system.js`, `14-wave6.js` en `14-wave7-wadden.js`. Tekenvoorstellen hieronder volgen die stijlgids: `sh()`/`sc()`, weinig paden, `eye()`, kijkrichting via `dir`/`faceOf`.
- **Bronnen**: FishBase, SeaLifeBase, wetenschappelijke literatuur en musea; per afgekeurd feit genoemd. Waar ik twijfel, staat **twijfel** en niet "fout".

Scores: 1 = fout, 3 = redelijk, 5 = klopt. Shiny: **E** echte kleurvariant, **J** jong dier of vrouwtje, **S** kleur van een andere soort, **F** fantasiekleur.

---

## 1. Samenvatting: de tien belangrijkste problemen

1. **IJsbeer en pinguïn in één zee.** De IJszee mengt het noordpoolgebied (ijsbeer, walrus, narwal, beluga, Groenlandse haai, papegaaiduiker) met Antarctica (keizerspinguïn, luipaardrob, Antarctische krill, ijsvis, grote albatros). Dat is precies de klassieke fout.
2. **Witte haai, zeeleeuw, zeilvis en manta in de Noordzee.** Geen van de vier komt daar voor (er zijn geen moderne waarnemingen van witte haaien in de Noordzee; de Californische zeeleeuw leeft in de Stille Oceaan). De witte haai komt er zelfs dubbel zo vaak langs als de bruinvis.
3. **Tropische rifvissen in de Noordzee en het kelpwoud.** Poetsvisje (0,4), schuttersvis (0,3), maanstaartlipvis (0,3), groene murene (0,7), tuinalen (0,6), vliegende vis (0,45), kogelvis (0,3) en pauwbidsprinkhaankreeft (0,3) staan in de Noordzee. De meeste staan ook in het (Californische) kelpwoud.
4. **Eén soortnaam, overal ter wereld.** Veel "algemene" dieren hebben de naam van één soort, maar zwemmen in zeven tot tien wateren. Voorbeelden: de zee-egel *Diadema setosum* (tropisch) staat ook in de IJszee en het kelpwoud, de zeester *Asterias rubens* (Noordoost-Atlantisch) op het koraalrif, de Noordzeegrondel *Pomatoschistus minutus* alleen in tropische wateren, en *Octopus vulgaris* in de diepzee en de IJszee. Herstel: een groepsnaam als SCI, zoals het register al toestaat ("for a group with many kinds the family or class"), of minder wateren.
5. **Japanse reuzenkrab in de Noordzee, de IJszee en de Sargassozee.** Deze krab leeft alleen rond Japan.
6. **"Zandalen" is de verkeerde Nederlandse naam.** Een zandaal (*Ammodytes*) is een Noordzeevisje. *Heteroconger hassi* is een tuinaal (garden eel). Die naamverwarring verklaart waarschijnlijk ook waarom de tuinaal in de Noordzee staat.
7. **Albatros in de Sargassozee.** In de Noord-Atlantische Oceaan leven geen albatrossen, op een enkele verdwaalde vogel na.
8. **Foute feiten.** Een lamantijn eet geen honderd kilo per dag en de olifant is geen "verste" maar zijn naaste familielid. *Mola mola* is niet de zwaarste beenvis. De garibaldi-vrouwtjes kiezen een nest met eitjes, niet "het mooiste nest". "Een druppel bloed op honderden meters" is een fabel. De nautilus zelf bestaat geen 500 miljoen jaar.
9. **Groottes kloppen niet onderling.** De orka (170–240) is kleiner dan de witte haai (230–300). De potvis (max. 55% van het scherm) is half zo groot als de bultrug (95%). De witpuntrifhaai (130–170) is groter dan een dolfijn (70–95).
10. **Vier tekeningen geven een verkeerd beeld.** De reuzenschelp is een oester met een parel, het Portugees oorlogsschip een kwal met een koepel, de ribkwal heeft liggende in plaats van staande kamrijen, en de oorkwal mist de vier ringen waar zijn veldnotitie over gaat.

Wat **goed** is: de meeste tekeningen zijn herkenbaar en verrassend precies, zoals de keizersvis, wimpelvis, mandarijnvis, pauwbidsprinkhaankreeft, kokosnootoctopus, lederschildpad (met roze kopvlek), narwal en jan-van-gent. De lantaarnvis trekt 's nachts omhoog, de papegaaivis slaapt in slijm, de zeevogels vertrekken in de winter en de lederschildpad heeft zijn roze kopvlek. Ook de shiny's van clownvis, koraalduivel, steenvis, kabeljauw, walvishaai, bultrug, orka, zeeleguaan en pinguïn zijn echt bestaande kleurvarianten. Bijna alle feiten zijn juist en goed op kindniveau.

---

## 2. Scores per familie

### Vissen

| dier | U | G | V | F | shiny | belangrijkste opmerking |
|---|---|---|---|---|---|---|
| fish – Scholen vissen | 4 | 4 | 5 | 4 | F | vissen houden afstand ook met hun ogen, niet alleen met de zijlijn |
| lantern – Lantaarnvis | 3 | 5 | 4 | 5 | F | gewone baarsvorm met hoge rugvin; lantaarnvissen zijn slank met grote ogen; grot 0,8 is vreemd |
| clown – Clownvis | 3 | 4 | 5 | 5 | E | drie banden zitten te dicht bij elkaar; de staart is zwart, maar hoort oranje met een zwart randje te zijn |
| cleaners – Poetsvisjes | 4 | 4 | 2 | 5 | F | *Labroides* staat in de Noordzee, het kelpwoud en de mangrove |
| grouper – Tandbaars | 4 | 4 | 5 | 5 | E? | goed |
| archer – Schuttersvis | 3 | 4 | 2 | 5 | F | staat in de Noordzee, het kelpwoud en het rif; hoort bij mangrove en estuaria |
| parrotfish – Papegaaivis | 4 | 5 | 5 | 5 | F | goed (slaapcocon) |
| boxfish – Koffervis | 5 | 4 | 3 | 5 | F | kelpwoud 0,1 klopt niet |
| puffer – Kogelvis | 4 | 4 | 2 | 5 | F | staat in diepzee, Noordzee en kelpwoud |
| lionfish – Koraalduivel | 3 | 4 | 4 | 4 | E | borstvinnen als waaier onder het lijf; "uitgezet" moet "waarschijnlijk losgelaten" zijn |
| flyingfish – Vliegende vis | 4 | 4 | 2 | 5 | F | Noordzee 0,45 en mangrove kloppen niet; de onderste staartlob hoort langer te zijn |
| angler – Hengelvis | 5 | 4 | 5 | 4 | F | goed |
| sargassumfish – Sargassumvis | 3 | 4 | 5 | 5 | E | lijkt op een stekelige kogelvis; mist de franjes en armvinnen |
| moray – Murene | 4 | 4 | 2 | 5 | F | de groene murene staat in de Noordzee 0,7, de diepzee 0,8 en het kelpwoud |
| eels – Zandalen | 4 | 5 | 2 | 5 | S | **naam fout** (tuinalen); staat in de Noordzee, diepzee, grot en mangrove |
| triggerfish – Trekkersvis | 5 | 4 | 5 | 5 | F | uitstekend |
| wrasse – Lipvis | 4 | 4 | 2 | 4 | F | Noordzee en kelpwoud; het feit herhaalt de slijmcocon van de papegaaivis |
| surgeonfish – Doktersvis | 5 | 4 | 5 | 4 | F | deze soort eet vooral plankton, de veldnotitie zegt "grazen algen" |
| mandarinfish – Mandarijnvis | 5 | 4 | 4 | 5 | E? | goed |
| scorpionfish – Schorpioenvis | 4 | 5 | 3 | 4 | E | *S. scrofa* (Middellandse Zee/O-Atlantisch) op rif en in kelpwoud; vervel-frequentie twijfel |
| stonefish – Steenvis | 4 | 5 | 5 | 4 | E | "een dag op het droge" alleen zwak onderbouwd (twijfel) |
| goby – Grondel | 4 | 4 | 1 | 4 | F | *Pomatoschistus minutus* is een Noordzeesoort, staat hier alleen in tropische wateren |
| needlefish – Naaldvis | 4 | 4 | 4 | 5 | F | NL-naam: Belonidae heten in het Nederlands "gepen" (twijfel); "naald" is ook de zeenaald |
| moorish – Wimpelvis | 5 | 4 | 5 | 5 | F | uitstekend |
| angelfish – Keizersvis | 5 | 4 | 5 | 5 | J | uitstekend; shiny lijkt op het jonge dier |
| garibaldi – Garibaldi | 5 | 5 | 5 | 3 | J | veldnotitie over nestkeuze klopt niet |
| mudskipper – Slijkspringer | 5 | 5 | 5 | 5 | F | uitstekend |
| herring – Haring | 4 | 5 | 5 | 5 | F | goed |
| cod – Kabeljauw | 5 | 4 | 5 | 5 | E | drie rugvinnen en baarddraad; shiny = rode "kelpkabeljauw" |
| flatfish – Schol | 4 | 5 | 4 | 5 | F | goed; ontbreekt in kelpwoud niet terecht (schol is Europees) |
| wolffish – Zeewolf | 4 | 4 | 4 | 4 | F | "elk jaar nieuwe tanden" alleen uit één bron (twijfel) |
| icefish – IJsvis | 4 | 4 | 3 | 5 | F | Antarctisch, staat in een gemengde IJszee |
| hatchet – Bijlvisjes | 4 | 4 | 5 | 5 | F | goed |
| viperfish – Addervis | 4 | 4 | 5 | 5 | F | goed |
| gulper – Pelikaanaal | 4 | 4 | 5 | 5 | F | goed |

### Haaien en grote vissen

| dier | U | G | V | F | shiny | belangrijkste opmerking |
|---|---|---|---|---|---|---|
| hammerhead – Hamerhaai | 4 | 4 | 5 | 5 | F | goed; mangrove klopt (jonge hamerhaaien) |
| whaleshark – Walvishaai | 4 | 4 | 4 | 5 | E | leucistische walvishaai bestaat; mist de lichte strepen tussen de vlekken |
| thresher – Voshaai | 5 | 4 | 4 | 5 | F | goed |
| whitetip – Witpuntrifhaai | 4 | 3 | 3 | 5 | F | te groot (130–170, groter dan een dolfijn); mangrove ×2 hoort bij de zwartpuntrifhaai |
| greatwhite – Witte haai | 5 | 4 | 2 | 3 | F | Noordzee ×2 en IJszee kloppen niet; bloedfeit is een fabel |
| swordfish – Zeilvis | 5 | 4 | 2 | 4 | F | zeilvis in Noordzee en diepzee |
| marlin – Marlijn | 5 | 4 | 4 | 3 | F | feit herhaalt de zeilvis ("snelste", "van kleur veranderen") |
| tuna – Tonijn | 4 | 4 | 3 | 4 | F | geelvintonijn in de Noordzee; daar komt alleen de blauwvintonijn terug |
| barracuda – Barracuda | 4 | 4 | 5 | 5 | F | goed |
| sunfish – Maanvis | 5 | 4 | 4 | 3 | F | "zwaarste beenvis" is *Mola alexandrini*, niet *M. mola* |
| coelacanth – Coelacant | 5 | 4 | 5 | 5 | S | uitstekend; shiny = de bruine Indonesische coelacant |
| leopardshark – Luipaardhaai | 4 | 4 | 5 | 5 | F | goed |
| greenland – Groenlandse haai | 4 | 5 | 4 | 5 | F | goed, alleen noordpool |

### Roggen

| dier | U | G | V | F | shiny | belangrijkste opmerking |
|---|---|---|---|---|---|---|
| ray – Pijlstaartrog | 3 | 4 | 2 | 5 | F | *Dasyatis pastinaca* is effen bruin (geen vlekken) en hoort niet op het rif of in de diepzee |
| manta – Manta | 5 | 4 | 3 | 5 | F | manta in de Noordzee klopt niet; echte variant = zwarte (melanistische) manta |
| eagleray – Adelaarsrog | 5 | 4 | 5 | 5 | F | uitstekend |
| electricray – Sidderrog | 5 | 4 | 3 | 5 | F | *T. marmorata* op tropisch rif en in de lagune |
| guitarfish – Vioolrog | 4 | 4 | 3 | 3 | F | "is half haai, half rog" klopt niet: het is een rog |
| sawfish – Zaagvis | 5 | 4 | 5 | 4 | F | feit en notitie zeggen allebei "voelt prooi in het zand" |

### Zeepaardjes en zeedraken

| dier | U | G | V | F | shiny | belangrijkste opmerking |
|---|---|---|---|---|---|---|
| seahorse – Zeepaardje | 4 | 4 | 3 | 4 | E | *H. kuda* (Indo-Pacific) in Noordzee 0,5 en kelpwoud; "veel soorten dansje" → "sommige" |
| seadragon – Bladzeedraak | 3 | 4 | 3 | 5 | F | blaadjes hangen als pootjes eronder; leeft in koel Zuid-Australisch water, niet op koraalrif |

### Kwallen

| dier | U | G | V | F | shiny | belangrijkste opmerking |
|---|---|---|---|---|---|---|
| jelly – Kwal | 3 | 4 | 3 | 5 | F | mist de vier ringen uit de veldnotitie; *Aurelia* gloeit niet in de diepzee |
| cassiopea – Omgekeerde kwal | 4 | 4 | 5 | 5 | E | goed |
| comb – Ribkwal | 2 | 4 | 2 | 5 | F | kamrijen horen van boven naar onder te lopen; *Mnemiopsis* staat in IJszee, diepzee en grot |
| manowar – Portugees oorlogsschip | 2 | 4 | 5 | 5 | F | getekend als kwal met koepel; het echte dier heeft een langwerpige blaas met een kam |

### Inktvissen

| dier | U | G | V | F | shiny | belangrijkste opmerking |
|---|---|---|---|---|---|---|
| octopus – Octopus | 4 | 4 | 2 | 5 | E | *O. vulgaris* in diepzee 0,7 en IJszee 0,4 |
| coconut – Kokosnootoctopus | 5 | 5 | 5 | 4 | F | uitstekend |
| mimic – Mimicoctopus | 5 | 4 | 5 | 5 | F | uitstekend |
| squid – Inktvisjes | 4 | 4 | 2 | 5 | E | *Loligo vulgaris* in diepzee 0,8 en IJszee |
| giant – Reuzeninktvis | 4 | 4 | 5 | 5 | F | goed |
| cuttlefish – Zeekat | 4 | 4 | 3 | 5 | E | *Sepia officinalis* (Europees) op rif en in de mangrove |
| nautilus – Nautilus | 5 | 4 | 3 | 3 | F | grot 0,8 klopt niet (diepe rifhelling); "bestaat 500 miljoen jaar" geldt voor de groep |
| vampire – Vampierinktvis | 5 | 4 | 5 | 5 | E? | uitstekend |
| dumbo – Dumbo-octopus | 4 | 4 | 5 | 5 | F | goed |

### Schaaldieren en degenkrab

| dier | U | G | V | F | shiny | belangrijkste opmerking |
|---|---|---|---|---|---|---|
| krill – Krill | 4 | 4 | 3 | 5 | F | Antarctische krill; hoort bij de zuidpool |
| crab – Krab | 4 | 4 | 5 | 5 | E | goed (groepsnaam); in de Sargassozee bestaat echt een sargassumkrab |
| hermit – Heremietkreeft | 3 | 4 | 3 | 5 | F | schelp lijkt op een ammoniet; *Pagurus bernhardus* op tropisch rif |
| lobster – Kreeft | 5 | 4 | 2 | 5 | E | *Homarus* op koraalrif, in IJszee en diepzee |
| spidercrab – Japanse reuzenkrab | 4 | 3 | 1 | 5 | F | alleen Japan, staat in Noordzee, IJszee en Sargassozee; te klein (26–34) |
| mantis – Bidsprinkhaankreeft | 5 | 4 | 2 | 5 | F | Indo-Pacifische soort in Noordzee en kelpwoud |
| pistol – Pistoolgarnaal en wachtersgrondel | 5 | 5 | 5 | 4 | F | feitzin te lang voor een kind |
| isopod – Reuzenpissebed | 4 | 4 | 3 | 5 | F | grot 0,9 en IJszee kloppen niet voor *B. giganteus* |
| horseshoe – Degenkrab | 4 | 4 | 4 | 5 | F | goed |
| shrimp – Garnalen | 4 | 5 | 3 | 5 | F | ontbreekt in de Noordzee, waar hij heel algemeen is |

### Zeesterren, egels, slakken en wormen

| dier | U | G | V | F | shiny | belangrijkste opmerking |
|---|---|---|---|---|---|---|
| starfish – Zeester | 4 | 4 | 2 | 5 | E | *Asterias rubens* op rif 1,0, in lagune 1,0 en Sargassozee |
| crownthorns – Doornenkroon | 4 | 4 | 5 | 5 | E | goed; blauwe doornenkronen bestaan echt |
| brittlestar – Slangster | 5 | 4 | 4 | 5 | E | goed |
| featherstar – Haarster | 3 | 4 | 3 | 5 | E | lijkt op een struik; *Antedon bifida* is Europees, staat op het rif |
| urchin – Zee-egel | 5 | 4 | 1 | 5 | F | tropische *Diadema* in IJszee, kelpwoud (1,0), Noordzee en diepzee |
| sanddollar – Zanddollar | 4 | 4 | 2 | 5 | F | geen zanddollars in de Noordzee |
| seacucumber – Zeekomkommer | 3 | 4 | 2 | 5 | S | tekening is een bruine zeekomkommer, SCI is de rode zeeappel; staat in Noordzee en diepzee |
| slugs – Zeenaaktslak | 5 | 4 | 2 | 5 | F | *Flabellina iodinea* (Californië) in Noordzee, IJszee en diepzee |
| glaucus – Blauwe zeedraak | 3 | 5 | 5 | 5 | F | redelijk herkenbaar |
| xmastree – Kerstboomwormpjes | 5 | 5 | 5 | 5 | E | uitstekend |
| lugworm – Wadpier | 5 | 5 | 5 | 5 | F | uitstekend |

### Koralen, sponzen en schelpen

| dier | U | G | V | F | shiny | belangrijkste opmerking |
|---|---|---|---|---|---|---|
| coral – Koraaltuin | 4 | 5 | 5 | 5 | E | goed |
| anemone – Anemoon | 4 | 5 | 3 | 5 | E | *Heteractis magnifica* in de Noordzee (landschap 0,3) |
| sponges – Sponzen | 4 | 5 | 5 | 5 | E | goed |
| clam – Reuzenschelp | 2 | 5 | 2 | 5 | E | getekend als oester met parel; *Tridacna* in Noordzee, kelpwoud, grot en mangrove |
| cockle – Kokkel | 5 | 5 | 5 | 5 | F | uitstekend |

### Reptielen

| dier | U | G | V | F | shiny | belangrijkste opmerking |
|---|---|---|---|---|---|---|
| turtle – Zeeschildpad | 5 | 3 | 4 | 5 | F | soepschildpad in de Noordzee is een uiterst zeldzame dwaalgast; zwemt nooit naar boven om te ademen |
| hawksbill – Karetschildpad | 5 | 4 | 5 | 5 | F | uitstekend |
| leatherback – Lederschildpad | 5 | 4 | 4 | 5 | F | lagune klopt niet (open oceaan) |
| crocodile – Zeekrokodil | 5 | 4 | 5 | 5 | E | uitstekend |
| seasnake – Geelbuikzeeslang | 5 | 3 | 5 | 5 | F | drijft in het echt vlak onder het oppervlak (band 0,4–0,7 is te diep); echte shiny = helemaal geel |
| seakrait – Zeekrait | 5 | 4 | 5 | 5 | F | uitstekend |
| iguana – Zeeleguaan | 4 | 4 | 3 | 5 | E | shiny = rode "kerstleguaan" van Española; lagune en mangrove zijn ruim |

### Walvissen en dolfijnen

| dier | U | G | V | F | shiny | belangrijkste opmerking |
|---|---|---|---|---|---|---|
| porpoise – Bruinvis | 5 | 4 | 5 | 5 | E | uitstekend |
| dolphins – Dolfijnen | 4 | 3 | 5 | 5 | E | te klein (70–95); shiny = albino tuimelaar |
| orca – Orka | 5 | 3 | 5 | 5 | E | kleiner dan de witte haai |
| falsekiller – Zwarte zwaardwalvis | 4 | 4 | 5 | 5 | F | goed |
| pilotwhale – Griend | 4 | 4 | 5 | 5 | F | goed |
| beluga – Beluga | 5 | 4 | 4 | 5 | J | shiny grijs = jong dier |
| narwhal – Narwal | 5 | 4 | 4 | 4 | J | "waarschijnlijk voelt hij" → "misschien" |
| humpback – Bultrug | 5 | 3 | 4 | 5 | E | witte bultrug (Migaloo) bestaat; ademt nooit |
| spermwhale – Potvis | 4 | 3 | 5 | 3 | F | te klein; "om reuzeninktvissen te jagen" overdreven |
| finwhale – Gewone vinvis | 4 | 3 | 2 | 5 | F | op koraalrif en in de diepzee |
| bluewhale – Blauwe vinvis | 5 | 3 | 3 | 3 | F | diepzee klopt niet; "ruim dertig meter" overdreven |

### Zoogdieren en vogels

| dier | U | G | V | F | shiny | belangrijkste opmerking |
|---|---|---|---|---|---|---|
| otters – Zeeotter | 5 | 5 | 5 | 5 | E | uitstekend |
| seal – Zeehond | 4 | 4 | 4 | 5 | E | gewone zeehond is niet hoogarctisch (IJszee 0,9) |
| sealion – Zeeleeuw | 4 | 4 | 3 | 5 | F | Californische zeeleeuw in de Noordzee |
| leopardseal – Luipaardrob | 5 | 4 | 2 | 5 | F | Antarctisch, naast ijsberen |
| walrus – Walrus | 5 | 4 | 3 | 4 | E | Arctisch, naast pinguïns; bleek na een koude duik is echt |
| manatee – Zeekoe | 4 | 4 | 5 | 2 | F | "honderd kilo" en "verste familielid" fout; naam botst met de doejongtekst |
| dugong – Doejong | 5 | 4 | 5 | 5 | F | uitstekend |
| polarbear – IJsbeer | 5 | 5 | 2 | 4 | F | naast pinguïns; shiny bruin lijkt een grizzly |
| penguins – Pinguïns | 4 | 4 | 2 | 5 | E | naast ijsberen |
| puffin – Papegaaiduiker | 5 | 4 | 4 | 5 | E | goed |
| gannet – Jan-van-gent | 5 | 5 | 5 | 5 | F | uitstekend; echte shiny = bruin gespikkelde jonge vogel |
| albatross – Albatros | 5 | 4 | 2 | 5 | J | geen albatrossen in de Sargassozee |
| cormorant – Aalscholver | 4 | 5 | 4 | 5 | E | hals iets te zwaan-achtig |
| pelican – Pelikaan | 5 | 4 | 4 | 5 | E | goed (roze broedblos) |
| eider – Eidereend | 5 | 5 | 5 | 5 | J | shiny is het vrouwtje |

---

## 3. Per dier: wat er mis is, waarom, en het herstel

Regelnummers verwijzen naar `src/00-animals.js`, tenzij anders vermeld. Een kans weghalen betekent: het water uit `life` of `visits` halen. De sleutel blijft bestaan en het dier blijft in ten minste één water vindbaar.

### 3.1 IJszee: noordpool en zuidpool door elkaar (Hoog)

**Wat.** Eén IJszee bevat ijsbeer (`polarbear` 1256), walrus (1226), narwal (1136), beluga (1126), Groenlandse haai (529), zeewolf (358), papegaaiduiker (1277) en gewone zeehond (1196) uit het noorden, en pinguïns (1267), luipaardrob (1216), krill (751), ijsvis (369) en albatros (1299) uit het zuiden.
**Waarom.** IJsberen leven alleen in het Arctisch gebied en pinguïns (op de Galápagos na) alleen op het zuidelijk halfrond. Bron: [Polar Bears International](https://polarbearsinternational.org), [Australian Antarctic Division](https://www.antarctica.gov.au).
**Herstel (voorstel).** Laat elke IJszee-oceaan bij het bouwen kiezen uit *noordpool* of *zuidpool*, met een eigen stroom (`sub("pole", …)`), zodat de rest van de oceaan niet verschuift. Geef de pooldieren een veld `pole: "n"` of `pole: "s"` in het register:
- **noord:** polarbear, walrus, narwhal, beluga, greenland, wolffish, puffin, seal
- **zuid:** penguins, leopardseal, krill, icefish, albatross
- de rest (walvissen, orka, kwallen, bodemdieren) mag in beide

Filter `w.life` en `visitorPool` op de gekozen pool in `02-scene.js` (rond regel 282 en 482). Laat in de oceaantitel zien welke pool het is ("IJszee – Noordpool"). Het logboek houdt één water `w:ijszee`; aquariumcodes veranderen niet. Controleer daarna met `#zelftest` dat elk pooldier nog vindbaar is.

### 3.2 Noordzee (Hoog)

| dier | nu | voorstel | reden / bron |
|---|---|---|---|
| greatwhite (449) | bezoeker ×2 | weg | geen moderne waarnemingen in de Noordzee, alleen fossielen ([Divernet 2026](https://divernet.com/world-dives/could-warming-seas-return-great-white-sharks-to-north-sea/)) |
| sealion (1206) | bezoeker ×1 | weg | *Zalophus californianus* leeft alleen in de NO-Stille Oceaan ([NOAA](https://www.fisheries.noaa.gov/species/california-sea-lion)) |
| swordfish (459) | bezoeker | weg | zeilvis is (sub)tropisch ([FishBase](https://www.fishbase.se/summary/Istiophorus-platypterus.html)) |
| manta (550) | bezoeker | weg | tropisch/subtropisch ([FishBase](https://www.fishbase.se/summary/Mobula-birostris.html)) |
| turtle (1006) | bezoeker | weg | soepschildpad is in de Noordzee een uiterst zeldzame dwaalgast; de lederschildpad mag blijven |
| tuna (479) | geelvintonijn | SCI → *Thunnus* (geslacht) | in de Noordzee keert de **blauwvintonijn** terug ([ICES](https://ices-library.figshare.com/articles/journal_contribution/Long-term_occurrence_of_atlantic_bluefin_tuna_Thunnus_thynnus_in_the_North_Sea_Contributions_of_non-fishery_data_to_population_studies/18640169/1)) |
| cleaners (85) | 0,4 | weg | *Labroides* is Indo-Pacifisch ([FishBase](https://www.fishbase.se/summary/Labroides-dimidiatus.html)) |
| archer (105) | 0,3 | weg | mangrove/estuaria Indo-Pacific ([FishBase](https://www.fishbase.se/summary/Toxotes-jaculatrix.html)) |
| wrasse (217) | 0,3 | weg | *T. lunare* is Indo-Pacifisch; zie kans 5 (gevlekte lipvis) |
| flyingfish (155) | 0,45 | weg | vliegende vissen leven in warme oceanen |
| moray (186) | 0,7 | weg | geen murenen in de Noordzee ([FishBase](https://www.fishbase.se/summary/Gymnothorax-funebris.html)) |
| eels (197) | 0,6 | weg | tuinalen leven in tropisch zand ([FishBase](https://www.fishbase.se/summary/Heteroconger-hassi.html)) |
| puffer (135) | 0,3 | weg | |
| mantis (802) | 0,3 | weg | *O. scyllarus* is Indo-Pacifisch ([SeaLifeBase](https://www.sealifebase.se/summary/Odontodactylus-scyllarus.html)) |
| spidercrab (791) | 0,3 | weg | alleen Japan ([SeaLifeBase](https://www.sealifebase.se/summary/Macrocheira-kaempferi.html)) |
| sanddollar (902) | 0,3 | weg | de Noordzee heeft zeeklitten, geen zanddollars |
| scorpionfish (247) | 0,3 | weg (of SCI → *Scorpaenidae*, 0,1) | *S. scrofa* komt hooguit in het zuiden van de Britse wateren voor |
| seahorse (600) | 0,5 | 0,1 | zeepaardjes zijn in de Noordzee zeldzaam (en het zijn andere soorten) |
| electricray (570) | 0,3 | 0,1 | zeldzaam in de Noordzee |
| ray (540) | 0,7 | 0,2 | de pijlstaartrog is zeldzaam; de algemene rog is de stekelrog (zie kansen) |
| octopus (661) | 0,7 | 0,3 | *O. vulgaris* zeldzaam; de algemene soort is de kleine achtarm *Eledone cirrhosa* |
| shrimp (842) | alleen wadden | + noordzee 0,7 | de Noordzeegarnaal is algemeen langs de hele kust (Nederlands Soortenregister, nederlandsesoorten.nl) |

Let op: na deze wijzigingen heeft de Noordzee minder "life"-dieren. Kansen voor nieuwe Noordzeedieren staan in hoofdstuk 5.

### 3.3 Kelpwoud (Hoog)

Het kelpwoud is door garibaldi, luipaardhaai, zeeotter en zeeleeuw duidelijk Californisch.
- **Weg:** cleaners (0,4), archer (0,3), boxfish (0,1), puffer (0,2), wrasse (0,3), eels (0,2). Bron: hun FishBase-verspreiding (zie 3.2).
- **Houden met een groepsnaam:** de murene (de Californische murene *Gymnothorax mordax* bestaat echt, zie 3.6), de schorpioenvis (*Scorpaena guttata*), de bidsprinkhaankreeft (*Hemisquilla californiensis*) en de zanddollar (*Dendraster excentricus*).
- **Bladzeedraak** (610, kelpwoud 0,6): leeft in Zuid-Australische kelp en zeegras. Dat past bij "kelpwoud" als algemeen water; laat hem staan, maar haal **rif 0,15** weg ([FishBase](https://www.fishbase.se/summary/Phycodurus-eques.html)).

### 3.4 Sargassozee (Hoog)

- **albatross (1299) sargasso 0,5 → weg.** In de Noord-Atlantische Oceaan broeden geen albatrossen; er komen alleen zeldzame dwaalgasten ([Olson & Hearty 2003, PNAS](https://pmc.ncbi.nlm.nih.gov/articles/PMC240703)). Het kelpwoud (0,2) houdt hem; met de poolsplitsing (3.1) wordt hij een zuidpooldier.
- **spidercrab (791) 0,3 en starfish (852) 0,3 → weg.** De Sargassozee is 4 à 6 km diep; dit zijn ondiepe bodemdieren. De krab mag blijven: in sargassumwier leeft echt een krab (*Portunus sayi*, *Planes minutus*).
- **octopus (661) 0,3**: twijfel. Er zijn weinig octopussen in drijvend wier. Ik stel 0,1 voor.

### 3.5 Diepzee en grot (Hoog/Middel)

- **Weg uit diepzee:** moray (0,8), eels (0,3), puffer (0,2), ray (0,5). Dit zijn ondiepe soorten.
- **Bezoekers uit diepzee weg:** swordfish (zeilvis), finwhale en bluewhale. De diepzee heeft geen oppervlak, en deze dieren eten in de bovenste paar honderd meter. De potvis, witte haai, maanvis en manta duiken wel diep en mogen blijven.
- **Grot:** isopod 0,9 → 0,2 (*B. giganteus* leeft op de diepe bodem, niet in grotten) en nautilus 0,8 → 0,3 (diepe rifhelling, [Australian Museum](https://australian.museum/learn/animals/molluscs/chambered-nautilus/)). Lantern 0,8 → 0,2: lantaarnvissen zijn dieren van de open oceaan. Eels 0,3 → weg (geen zandbodem). De coelacant, witpuntrifhaai en zeeschildpad horen terecht in de grot.

### 3.6 Eén soortnaam voor een dier dat overal leeft (Hoog)

Het register zegt zelf: "for a group with many kinds the family or class". Voorstel per dier. Het **SCI-veld** verandert; de sleutel en het plaatje blijven.

| dier (regel) | nu | voorgestelde SCI | reden |
|---|---|---|---|
| octopus (660) | *Octopus vulgaris* | *Octopodidae* | staat in 9 wateren, ook diepzee en IJszee |
| squid (690) | *Loligo vulgaris* | *Teuthida* | 7 wateren, ook diepzee en IJszee |
| crab (760) | *Brachyura* | — | al goed |
| hermit (770) | *Pagurus bernhardus* | *Paguroidea* | 9 wateren, ook tropisch |
| lobster (780) | *Homarus gammarus* | blijft; rif 0,2 en IJszee 0,2 weg, diepzee 0,2 weg | het feit gaat over de Europese kreeft |
| starfish (851) | *Asterias rubens* | *Asteroidea* | 10 wateren; *A. rubens* is Noordoost-Atlantisch ([SeaLifeBase](https://www.sealifebase.se/summary/Asterias-rubens.html)) |
| brittlestar (871) | *Ophiothrix fragilis* | *Ophiuroidea* | ook rif en diepzee |
| featherstar (881) | *Antedon bifida* | *Crinoidea* | rif, diepzee, grot |
| urchin (891) | *Diadema setosum* | *Echinoidea* | ook IJszee, kelpwoud, Noordzee; *D. setosum* is tropisch ([SeaLifeBase](https://www.sealifebase.se/summary/Diadema-setosum.html)) |
| sanddollar (901) | *Echinarachnius parma* | *Clypeasteroida* | NW-Atlantisch/N-Pacifisch, nu in lagune en kelpwoud |
| seacucumber (911) | *Pseudocolochirus violaceus* | *Holothuroidea* | tekening is geen zeeappel; staat in 5 wateren |
| slugs (921) | *Flabellina iodinea* | *Nudibranchia* | 8 wateren; *F. iodinea* is Californisch |
| comb (639) | *Mnemiopsis leidyi* | *Ctenophora* | *Mnemiopsis* niet in IJszee, diepzee of grot ([verspreiding in Scandinavië](https://core.ac.uk/works/5793079)) |
| jelly (619) | *Aurelia aurita* | blijft | een oorkwal; maar zie 3.9 (tekening) |
| anemone (971) | *Heteractis magnifica* | *Actiniaria* | ook als landschap in de Noordzee |
| goby (266) | *Pomatoschistus minutus* | *Gobiidae* | staat alleen in rif, mangrove, lagune; *P. minutus* is een Noordzeesoort ([FishBase](https://www.fishbase.se/summary/Pomatoschistus-minutus.html)) |
| ray (539) | *Dasyatis pastinaca* | *Dasyatidae* | rif, lagune, mangrove |
| electricray (569) | *Torpedo marmorata* | *Torpedinidae* | rif, lagune |
| guitarfish (579) | *Rhinobatos rhinobatos* | *Rhinobatidae* | rif, mangrove, lagune; *R. rhinobatos* is Oost-Atlantisch/Middellands |
| scorpionfish (246) | *Scorpaena scrofa* | *Scorpaenidae* | rif, kelpwoud, grot |
| moray (185) | *Gymnothorax funebris* | *Muraenidae* | na 3.2/3.5: rif, kelpwoud, grot |
| cuttlefish (710) | *Sepia officinalis* | *Sepiidae* | ook op rif en in de mangrove |
| mantis (801) | *Odontodactylus scyllarus* | blijft; kelpwoud weg | tekening is precies deze soort |
| seahorse (599) | *Hippocampus kuda* | *Hippocampus* | ook kelpwoud en Noordzee |
| tuna (478) | *Thunnus albacares* | *Thunnus* | zie 3.2 |
| clam (987) | *Tridacna gigas* | blijft; landschap in Noordzee/kelpwoud/grot/mangrove weg (`01-basis.js:55,64,82,91`) | reuzenschelpen leven alleen op Indo-Pacifische riffen |

Op het rif komen ook de spidercrab (diepzee mag blijven: 50–600 m bij Japan) en de isopod (diepzee). Na de wijzigingen blijft de Japanse reuzenkrab in diepzee en grot over.

### 3.7 Bezoekers per water (Middel)

- **whitetip (439):** mangrove ×2 → ×0. De witpuntrifhaai is een rifhaai; in mangroves zwemt de zwartpuntrifhaai (zie kansen).
- **leatherback (1026):** lagune → weg. Een lederschildpad leeft in de open oceaan.
- **finwhale (1166):** rif → weg. Vinvissen leven in koel, open water.
- **turtle (1006):** noordzee → weg (3.2).
- **RARES_BY_WATER:** dit zijn legendes en wonderen, zoals een walvisval in de diepzee en de Sargassozee. Biologisch is daar niets aan op te merken.

### 3.8 Feiten met fouten (Hoog)

Elke vervangende zin is kort en NL en EN zeggen hetzelfde.

**manatee (1239, fact).** "tot wel honderd kilo zeegras" is te veel: een lamantijn eet ongeveer 4–9% van zijn gewicht, gemiddeld 15–50 kg ([SeaWorld](https://seaworld.org/animals/all-about/manatee/diet/), [Worthy e.a., UCF](https://sciences.ucf.edu/biology/PEBL/wp-content/uploads/sites/18/2014/04/erratum-for-PBZ.pdf)). "Zijn verste familielid is de olifant" zegt het omgekeerde van wat bedoeld is: de olifant is juist zijn **naaste** familie op het land.
- NL: "Een lamantijn eet tot wel vijftig kilo zeegras per dag. Zijn naaste familie op het land is de olifant."
- EN: "A manatee eats up to fifty kilos of seagrass a day. Its closest relatives on land are elephants."
- Naam (1235): `nl: "Lamantijn"`. De doejongtekst (1249) zegt al "de lamantijn heeft een ronde staart", en "zeekoe" is de naam van de hele groep (de doejong is ook een zeekoe). Ook de shinynaam wordt dan "Shiny lamantijn".

**sunfish (502, fact).** "De zwaarste beenvis" is *Mola alexandrini* (2744 kg); de zwaarste gemeten *Mola mola* woog 1320 kg ([Sawai e.a. 2022, J. Fish Biol.](https://doi.org/10.1111/jfb.15244)).
- NL: "De maanvis is een van de zwaarste beenvissen: hij kan meer dan duizend kilo wegen. Hij eet veel kwallen."
- EN: "The ocean sunfish is one of the heaviest bony fish: it can weigh more than a thousand kilos. It eats lots of jellyfish."

**greatwhite (452, fact).** "Ruikt een druppel bloed van honderden meters ver" is een bekende fabel. Haaien ruiken een *geurspoor* dat de stroming meevoert, geen losse druppel ([SurferToday](https://www.surfertoday.com/environment/can-sharks-smell-blood-in-the-water)).
- NL: "De witte haai kan zes meter lang worden. Met zijn neus volgt hij een geurspoor dat de stroming meevoert."
- EN: "The great white shark can grow to six metres long. With its nose it follows a scent trail carried along by the current."

**garibaldi (313, note).** Vrouwtjes kiezen vooral een nest waar al **jonge eitjes** in liggen, niet "het mooiste nest" ([Sikkel 1988/1989](https://www.researchgate.net/publication/258022743_Factors_Influencing_Spawning_Site_Choice_by_Female_Garibaldi_Hypsypops_rubicundus_Pisces_Pomacentridae)).
- NL: "Het mannetje maakt een nestje van rode algen. Vrouwtjes leggen hun eitjes het liefst in een nest waar al verse eitjes in liggen."
- EN: "The male makes a little nest of red algae. Females prefer to lay their eggs in a nest that already holds fresh eggs."

**nautilus (724, fact).** De groep nautiloïden is ~500 miljoen jaar oud; het geslacht *Nautilus* zelf veel jonger ([Australian Museum](https://australian.museum/learn/animals/molluscs/chambered-nautilus/)).
- NL: "Nautilussen en hun voorouders zwemmen al zo'n 500 miljoen jaar rond. Met gas in de kamers van hun schelp regelen ze hoe hoog ze zweven."
- EN: "Nautiluses and their ancestors have been swimming around for some 500 million years. Gas in the chambers of their shell sets how high they float."

**spermwhale (1159, fact).** Potvissen eten vooral middelgrote inktvissen; reuzeninktvissen zijn een klein deel ([maaginhoud potvissen Nieuw-Zeeland, AUT](https://openrepository.aut.ac.nz/items/ee092de8-de60-46c5-a792-29fa6ffecd13)).
- NL: "Een potvis duikt meer dan een kilometer diep om inktvissen te vangen, soms zelfs een reuzeninktvis. Hij heeft de grootste hersenen van alle dieren."
- EN: "A sperm whale dives more than a kilometre deep to catch squid, sometimes even a giant squid. It has the largest brain of any animal."

**guitarfish (583, fact).** Een vioolrog *is* een rog; hij lijkt alleen half haai.
- NL: "Een vioolrog lijkt half haai, half rog: een platte kop met een haaienstaart. Toch is hij echt een rog."
- EN: "A guitarfish looks half shark, half ray: a flat head with a shark's tail. But it really is a ray."

**bluewhale (1179, fact)** — *twijfel, Laag*. 29,9 m is de grootste betrouwbaar gemeten lengte; de 33 m uit de walvisvaart is omstreden.
- NL: "De blauwe vinvis is het grootste dier dat ooit heeft geleefd: zo'n dertig meter lang."
- EN: "The blue whale is the largest animal that has ever lived: about thirty metres long."

**lionfish (150, note).** "Hij is daar uitgezet" is te stellig: waarschijnlijk zijn koraalduivels uit aquaria in Florida losgelaten.
- NL: "In het Caribisch gebied hoort de koraalduivel niet thuis. Hij kwam er waarschijnlijk uit aquaria terecht en eet zoveel kleine vissen dat duikers hem er actief vangen."
- EN: "Lionfish do not belong in the Caribbean. They probably got there from aquariums, and eat so many small fish that divers actively catch them."

### 3.9 Feiten die dubbel of vaag zijn (Middel/Laag)

- **marlin (472)** herhaalt de zeilvis ("een van de snelsten", "verandert van kleur"). Nieuwe fact:
  NL "Een marlijn slaat met zijn lange snavel door een school vissen en eet daarna de verdoofde visjes op." / EN "A marlin slashes through a school of fish with its long bill, then eats the stunned fish."
- **wrasse (220)** herhaalt de slijmcocon van de papegaaivis (120). Nieuwe fact:
  NL "Lipvissen zwemmen vooral met hun borstvinnen, alsof ze roeien. Hun staart gebruiken ze voor een snelle sprint." / EN "Wrasses swim mostly with their pectoral fins, as if rowing. They use their tail for a quick sprint."
- **surgeonfish (232, note)**: de getekende blauwe doktersvis eet vooral plankton ([FAO](https://www.fao.org/docrep/pdf/009/ad468e/ad468eAI.pdf), [SURG](https://www.surg.org.au/species/paracanthurus-hepatus-linnaeus-1766/)).
  NL "De meeste doktersvissen grazen algen van het koraal. Deze blauwe doktersvis eet juist vooral plankton." / EN "Most surgeonfish graze algae off the coral. This blue tang, though, eats mostly plankton."
- **sawfish (595, note)** herhaalt "voelt prooi in het zand" uit de fact. Fact:
  NL "Een zaagvis is een rog. Met zijn getande snuit slaat hij door scholen vissen." / EN "A sawfish is a ray. It slashes through schools of fish with its toothed snout."
- **fish (58)**: "met hun ogen en hun zijlijn" / "with their eyes and their lateral line".
- **seahorse (605)**: "Veel soorten leven in vaste paartjes" → "Sommige soorten…" / "Some species…".
- **narwhal (1141)**: "Waarschijnlijk voelt hij" → "Misschien voelt hij" / "It may sense". De functie van de slagtand is nog omstreden.
- **polarbear (1262, note)**: dat de zwarte huid zonnewarmte "goed opneemt" via de haren is grotendeels ontkracht.
  NL "Onder de witte vacht van een ijsbeer zit een zwarte huid. Zijn haren zijn eigenlijk doorzichtig en hol." / EN "Under a polar bear's white fur is black skin. Its hairs are actually see-through and hollow."
- **pistol (815)**: de feitzin is drie keer zo lang als de andere. Fact: "De klik van een pistoolgarnaal is een van de hardste geluiden in de zee. Een grondel houdt voor hem de wacht." / "The snap of a pistol shrimp is one of the loudest sounds in the sea. A goby keeps watch for it."
- **Twijfel, alleen herformuleren als je zeker wilt zijn:**
  - steenvis "tot een dag op het droge" (262): alleen het [WA Museum](https://museum.wa.gov.au/online-collections/names/synanceia-horrida) noemt dit, zonder onderzoek;
  - schorpioenvis "een paar keer per maand" (252): gemeten is "om de paar weken" bij de bladschorpioenvis ([Fishes of Australia](https://fishesofaustralia.net.au/home/species/3342)). Voorstel: "zo nu en dan" / "now and then";
  - zeewolf "elk jaar nieuwe tanden" (362): één bron.

### 3.10 Namen (Hoog/Laag)

- **eels (196), Hoog:** `nl: "Tuinalen"`, `shinyNl: "tuinaal"`. "Zandaal" is in het Nederlands *Ammodytes* (Nederlands Soortenregister, nederlandsesoorten.nl). "Tuinaal" is de letterlijke vertaling van *garden eel* en wordt in duik- en aquariumliteratuur gebruikt. In het Soortenregister kon ik die naam niet vinden (twijfel); het blijft wel veel beter dan "zandaal".
- **manatee (1235), Middel:** "Lamantijn" (zie 3.8).
- **needlefish (276), Laag, twijfel:** de familie Belonidae heet in het Nederlands "gepen" ([EU-handelsnamen](https://fish-commercial-names.ec.europa.eu/fish-names/species/belonidae_nl), [GBIF](https://www.gbif.org/species/7190)). "Naaldvis" kan verward worden met de zeenaald. Voorstel: "Geep" (de logboekpagina kan zeggen dat het een tropische geep is).
- **seasnake (1045), Laag:** EN "Sea snake" → "Yellow-bellied sea snake", gelijk aan de NL-naam.
- **LOG_SUBS-familie:** alle dieren staan in de juiste familie. De walvissen staan los van de vissen, de zaagvis en de vioolrog bij de roggen, de degenkrab heeft zijn eigen vermelding. De ribkwal en het Portugees oorlogsschip zijn geen echte kwallen, maar hun feiten zeggen dat ook.

### 3.11 Gedrag en grootte (Middel)

- **orca** (`11-mangrove-and-cave.js:650`): 170–240 → **300–380**. Een orka (6–8 m) is groter dan een witte haai (230–300 u ≈ 5–6 m).
- **spermwhale** (`12-lagoon-and-sargasso.js:549`): min(W·0,55, 420–540) → min(W·0,85, 800–900). Een potvis (16 m) is ongeveer zo groot als een bultrug.
- **whitetip** (`13-fauna-system.js:799`): 130–170 → 75–95 (1,6 m).
- **dolphins** (`04-creatures.js:657`): 70–95 → 100–130 (2,5–3 m, groter dan een witpuntrifhaai).
- **spidercrab** (`12-lagoon-and-sargasso.js:27`): 26–34 → 50–70. Hij moet duidelijk groter zijn dan de kreeft (26–34); het feit zegt "bijna vier meter".
- **seasnake** (`13-fauna-system.js:780`): band 0,4–0,7 → 0,08–0,25. De geelbuikzeeslang drijft vlak onder het oppervlak, in drijfvuillijnen.
- **Ademen.** Bezoekende walvissen, dolfijnen, zeeschildpadden en zeekoeien steken nooit naar het oppervlak. Voorstel: laat een bezoeker in een water met `surface` eens per oversteek kort naar de golflijn zwemmen en (bij walvissen) een wolkje blazen. Dat kan in `updateVisitor` in `04-creatures.js`, met een kleine boog op `v.yOff`. Zeehond en pinguïn kunnen hetzelfde krijgen.
- **Nachtactief.** De witpuntrifhaai jaagt 's nachts (feit). De lantaarnvis en de papegaaivis volgen de nacht al. Optioneel: laat de witpuntrifhaai 's nachts vaker langskomen (`visitorPool` dubbelen als `night > 0.6`).

### 3.12 Tekeningen (Middel/Laag)

Elk voorstel past in de stijlgids: drie tot vijf vlakken, `sh()`-kleuren, lijnen alleen voor dunne delen.

- **clam (`11-mangrove-and-cave.js:220`), Middel.** Nu een oester met een witte parel. Een reuzenschelp ligt met het **slot naar beneden** en de open, golvende rand **naar boven**, met de gekleurde mantel als een dikke lip ertussen. Voorstel: twee schelphelften als zigzag-vlakken (5–6 golven), een mantelvlak met een paar lichte stippen, en **geen parel**. Reuzenschelpen maken zelden parels, en een parel laat kinderen aan de oester denken.
- **manowar (`14-wave6.js:628`), Middel.** Nu een kwalkoepel. De blaas van *Physalia* is **langwerpig en scheef**, als een opgeblazen zakje, met een **golvende kam** erbovenop (blauw-paars met een roze rand). De tentakels hangen in trossen aan één kant. Voorstel: één ovaal pad schuin op het water, één kampad, en de bestaande tentakellijnen.
- **comb (`05-more-creatures-and-landmarks.js:487`), Middel.** Nu liggende regenboogrijen. Een ribkwal heeft **acht kamrijen die van boven naar onder lopen**, en het regenbooglicht loopt over die rijen heen. Voorstel: vier zichtbare verticale stippellijnen per kant, de regenboogkleur verschuivend in de tijd (`ph`).
- **jelly (`04-creatures.js:237`), Middel.** De veldnotitie noemt "de vier ringen". Voorstel: vier kleine hoefijzers (`sh("#e8a0c8")`, alpha 0,6) in de koepel, en een rand van veel korte tentakels in plaats van een paar lange.
- **clown (`04-creatures.js:26`, `CLOWN_BANDS`), Laag.** De drie banden horen achter het oog, midden op het lijf en bij de staartwortel. Nu zitten ze dicht bij elkaar. De staartvin is zwart, maar hoort oranje met een zwarte rand te zijn (`dark` alleen als rand).
- **seacucumber (`13-fauna-system.js:397`), Laag.** Past nu bij een gewone zeekomkommer. Met SCI *Holothuroidea* (3.6) klopt dat; geen tekenwerk nodig.
- **featherstar (`13-fauna-system.js:412`), Laag.** Lijkt op een struik. Een haarster heeft 10 (of meer) **gebogen**, gevederde armen die van een klein schijfje omhoog krullen, met pootjes (cirri) die zich vastgrijpen. Voorstel: kromme in plaats van rechte armen.
- **seadragon (`11-mangrove-and-cave.js:493`), Laag.** De blaadjes hangen als pootjes onder het lijf. Bij de bladzeedraak zitten ze ook **op de rug en de kop** en zijn ze vertakt; de hals is gebogen zoals bij een zeepaardje.
- **ray (`04-creatures.js:484`), Laag.** *Dasyatis* is effen bruin; de stippen passen eerder bij de blauwgestippelde pijlstaartrog van het rif. Met SCI *Dasyatidae* is dit geen probleem meer.
- **hermit (`05-more-creatures-and-landmarks.js:379`), Laag.** De schelp is plat opgerold, als een ammoniet. Echte heremietkreeften wonen in een **puntige slakkenhuisschelp** (wulk, alikruik).
- **lantern, Laag.** Een lantaarnvis is slank met een **groot oog**, een kleine rugvin en een vetvinnetje. Nu is het de standaardbaars met een hoge rugvin.
- **whaleshark, Laag.** Tussen de witte stippen lopen dunne lichte strepen (een "dambordpatroon").

### 3.13 Shiny's (Laag)

Shiny's mogen fantasie zijn. Waar een echte variant net zo mooi is, stel ik die voor:
- **seasnake:** helemaal geel (*Hydrophis platurus xanthos*, Costa Rica).
- **manta:** zwart met witte mond (melanistische manta).
- **gannet:** donkerbruin met witte spikkels (het jonge dier).
- **polarbear:** nu bruin, wat op een grizzly lijkt. Beter roomgeel (ijsberen kleuren geel van zeehondenvet).
- **clown:** de "Darwin black" ocellaris heeft ook zwarte vinnen.
- **eider:** de shiny is het vrouwtje. Dat kan in de veldnotitie: "Shiny: zo ziet het vrouwtje eruit."

---

## 4. Verbeterplan

Kleine, losse commits. Na elke commit `python build.py` (zelftest). Aquariumcodes veranderen nergens: geen sleutel verdwijnt en AQ_BASE blijft gelijk. Zeeën met een gegeven zaadnummer kunnen er anders uitzien; dat mag volgens de eerdere keuze.

### Hoog — feitelijk fout of verkeerd water

1. **"IJszee: noordpool en zuidpool apart"** — veld `pole` in het register, poolkeuze per oceaan uit een eigen stroom, filter in `02-scene.js`, titel in de oceaan (3.1).
2. **"Noordzee: alleen dieren die er echt leven"** — tabel 3.2 (`life`/`visits` in `00-animals.js`).
3. **"Kelpwoud: geen tropische rifvissen"** — 3.3.
4. **"Sargassozee: geen albatros en geen ondiepe bodemdieren"** — 3.4.
5. **"Diepzee en grot: alleen dieren die daar thuishoren"** — 3.5.
6. **"Namen: groepsnamen voor dieren die overal leven"** — SCI-velden uit 3.6, plus reuzenschelp uit vier waterlandschappen in `01-basis.js`.
7. **"Feiten: lamantijn, maanvis, witte haai, garibaldi, nautilus, potvis, vioolrog, koraalduivel"** — 3.8.
8. **"Namen: tuinalen en lamantijn"** — 3.10.

### Middel — onherkenbaar of onjuist gedrag

9. **"Grootte: orka, potvis, witpuntrifhaai, dolfijn en reuzenkrab in verhouding"** — 3.11.
10. **"Bezoekers: witpuntrifhaai, lederschildpad en vinvis in het juiste water"** — 3.7.
11. **"Zeeslang drijft vlak onder het oppervlak"** — 3.11.
12. **"Walvissen en dolfijnen komen ademen"** — 3.11.
13. **"Tekening: reuzenschelp zonder parel"**, **"Tekening: Portugees oorlogsschip met blaas en kam"**, **"Tekening: ribkwal met staande kamrijen"**, **"Tekening: oorkwal met vier ringen"** — vier losse commits (3.12).
14. **"Feiten: marlijn, lipvis, doktersvis en zaagvis zonder herhaling"** — 3.9.

### Laag — verfijning

15. **"Feiten: kleine verfijningen"** — scholen, zeepaardje, narwal, ijsbeer, pistoolgarnaal, blauwe vinvis, twijfelzinnen (3.8, 3.9).
16. **"Tekening: clownvis, haarster, bladzeedraak, heremietschelp, lantaarnvis"** (3.12).
17. **"Shiny's: echte kleurvarianten"** (3.13).
18. **"Namen: geep, yellow-bellied sea snake"** (3.10).
19. **"Logboek: volgorde per familie van warm naar koud"** — zie hieronder.

**Volgorde in LOG_SUBS.** De volgorde is nu de volgorde waarin de dieren zijn toegevoegd: niet van klein naar groot en niet van warm naar koud. Voorstel voor de vissen, van warm naar koud en daarbinnen van klein naar groot:
`fish`, goby, mandarinfish, cleaners, clown, eels, mudskipper, boxfish, puffer, surgeonfish, moorish, triggerfish, angelfish, wrasse, archer, stonefish, lionfish, sargassumfish, flyingfish, needlefish, parrotfish, moray, grouper | herring, garibaldi, flatfish, scorpionfish, cod, wolffish | icefish, lantern, hatchet, viperfish, angler, gulper.
De andere families op dezelfde manier. Het register herschikken verandert de volgorde van `LIFE_KEYS` (gebruikt in `02-scene.js:601` en de aquariumgroepen). Controleer met de zelftest dat `buildLimited` nog dezelfde grens van vier nieuwe dieren haalt. De aquariumcodes zelf hangen aan `AQ_BASE` en veranderen niet.

---

## 5. Kansen: kenmerkende dieren die ontbreken (alleen suggestie)

- **Noordzee:** zandaal (de echte *Ammodytes*, die zich ingraaft en hoofdvoedsel is van papegaaiduiker en bruinvis), hondshaai (*Scyliorhinus canicula*, met een "zeemeerminnentasje"), stekelrog, gevlekte lipvis (*Labrus bergylta*), zeedonderpad, kompaskwal, zeeanjelier (*Metridium*), grijze zeehond.
- **Waddenzee:** strandkrab (*Carcinus maenas*), mossel, wulk, bot, grijze zeehond, scholekster.
- **Koraalrif:** vlindervis, juffertje, napoleonvis (een reuzenlipvis), zwartpuntrifhaai.
- **Mangrove:** wenkkrab (zwaait met één grote schaar), zwartpuntrifhaai (jong), mangrovesnapper.
- **Lagune:** koningsslak (*Aliger gigas*), bonefish, blauwgestippelde pijlstaartrog (*Taeniura lymma*).
- **Kelpwoud:** Californische schapenkop (een lipvis die de egels opeet), purperen zee-egel, zeeoor (abalone).
- **IJszee noord:** ringelrob, poolkabeljauw. **IJszee zuid:** weddellzeehond, adeliepinguïn.
- **Diepzee:** zeevarkentje (*Scotoplanes*), driepootvis, yetikrab bij de heetwaterbron, reuzenkokerworm (*Riftia*).
- **Grot:** grotgarnaal, blinde grotvis (*Lucifuga*).
- **Sargassozee:** sargassumkrab (eigen plaatje op het wier), sargassum-naaktslak, jonge karetschildpadden in het wier.

---

## Bijlage A — Inventaris

Bewegingsgetallen in spel-eenheden (`u`); band = deel van de schermhoogte, lift = pixels boven de bodem, v = snelheid. Visitor-groottes gemeten op een scherm van 1440×900. "b×" = aantal lotjes in de bezoekerspot van dat water. De shiny-kolom geeft de kans (1 op N); het schema (`pal`/`palRule`) staat per dier in `00-animals.js`, en mijn oordeel (E/J/S/F) staat in de tabellen van hoofdstuk 2.

| sleutel | NL / EN | SCI | familie | beweging (kind, size, band/lift, speed, count) | wateren (kans; b× = bezoekerslotjes) | shiny 1/N |
|---|---|---|---|---|---|---|
| `fish` | Scholen vissen / Fish schools | *Actinopterygii* | Vissen | school, 5–13, 8–60 per school | — | 2000 |
| `lantern` | Lantaarnvis / Lanternfish | *Myctophidae* | Vissen | school, 5, 8–36, stijgt 's nachts | sargasso 0.4, ijszee 0.3, grot 0.8, diepzee 1 | 500 |
| `clown` | Clownvis / Clownfish | *Amphiprion ocellaris* | Vissen | in anemoon (alleen rif), ±0.38×anemoon | — | 150 |
| `cleaners` | Poetsvisjes / Cleaner wrasse | *Labroides dimidiatus* | Vissen | poetsstation (2) | rif 0.9, lagune 0.5, mangrove 0.3, kelpwoud 0.4, noordzee 0.4 | 225 |
| `grouper` | Tandbaars / Grouper | *Epinephelus lanceolatus* | Vissen | bij poetsstation, 26–34 | — | 75 |
| `archer` | Schuttersvis / Archerfish | *Toxotes jaculatrix* | Vissen | oppervlak, 13–17 | rif 0.6, mangrove 0.9, kelpwoud 0.3, noordzee 0.3 | 75 |
| `parrotfish` | Papegaaivis / Parrotfish | *Scaridae* | Vissen | swim, 30–38, slaapt in slijm | rif 0.8, lagune 0.8, mangrove 0.3 | 75 |
| `boxfish` | Koffervis / Boxfish | *Ostracion cubicus* | Vissen | swim 45–68%, 18–24 | rif 0.5, lagune 0.7, mangrove 0.3, kelpwoud 0.1 | 75 |
| `puffer` | Kogelvis / Pufferfish | *Tetraodontidae* | Vissen | swim 40–62%, 13–17 | rif 0.9, lagune 0.6, mangrove 0.7, kelpwoud 0.2, noordzee 0.3, sargasso 0.3, diepzee 0.2 | 75 |
| `lionfish` | Koraalduivel / Lionfish | *Pterois volitans* | Vissen | swim 50–70%, 28–36 | rif 0.6, lagune 0.3, mangrove 0.3 | 75 |
| `flyingfish` | Vliegende vis / Flying fish | *Exocoetidae* | Vissen | springt aan oppervlak | rif 0.85, lagune 0.3, mangrove 0.2, kelpwoud 0.35, noordzee 0.45, sargasso 0.9 | 450 |
| `angler` | Hengelvis / Anglerfish | *Melanocetus johnsonii* | Vissen | swim 50–68%, 26–36 | diepzee 1 | 75 |
| `sargassumfish` | Sargassumvis / Sargassum fish | *Histrio histrio* | Vissen | in drijvend wier, 22–28 | sargasso 1 | 75 |
| `moray` | Murene / Moray eel | *Gymnothorax funebris* | Vissen | in wrak, uit hol | rif 0.8, kelpwoud 0.7, noordzee 0.7, grot 0.6, diepzee 0.8 | 75 |
| `eels` | Zandalen / Garden eels | *Heteroconger hassi* | Vissen | kolonie 5–10, hol | rif 0.8, lagune 0.9, mangrove 0.2, kelpwoud 0.2, noordzee 0.6, grot 0.3, diepzee 0.3 | 600 |
| `triggerfish` | Trekkersvis / Triggerfish | *Rhinecanthus aculeatus* | Vissen | swim, 22–28, band 0.35–0.65, v 0.4 | rif 0.6, lagune 0.6, mangrove 0.2 | 75 |
| `wrasse` | Lipvis / Wrasse | *Thalassoma lunare* | Vissen | swim, 22–28, band 0.35–0.7, v 0.6 | rif 0.7, lagune 0.5, kelpwoud 0.3, noordzee 0.3 | 75 |
| `surgeonfish` | Doktersvis / Surgeonfish | *Paracanthurus hepatus* | Vissen | swim, 20–26, band 0.3–0.65, v 0.5 | rif 0.7, lagune 0.6 | 75 |
| `mandarinfish` | Mandarijnvis / Mandarinfish | *Synchiropus splendidus* | Vissen | swim, 13–16, band 0.7–0.8, v 0.25 | rif 0.35, lagune 0.3, mangrove 0.2 | 75 |
| `scorpionfish` | Schorpioenvis / Scorpionfish | *Scorpaena scrofa* | Vissen | floor, 26–32 | rif 0.4, kelpwoud 0.2, noordzee 0.3, grot 0.3 | 75 |
| `stonefish` | Steenvis / Stonefish | *Synanceia verrucosa* | Vissen | floor, 22–28 | rif 0.3, lagune 0.35, mangrove 0.3 | 75 |
| `goby` | Grondel / Goby | *Pomatoschistus minutus* | Vissen | floor, 13–17, kruip 0.12, ×1–3 | rif 0.5, lagune 0.6, mangrove 0.5, noordzee 0.3 | 225 |
| `needlefish` | Naaldvis / Needlefish | *Tylosurus crocodilus* | Vissen | swim, 32–42, band 0.06–0.16, v 0.9 | rif 0.3, lagune 0.5, mangrove 0.4, sargasso 0.3 | 75 |
| `moorish` | Wimpelvis / Moorish idol | *Zanclus cornutus* | Vissen | swim, 22–28, band 0.3–0.6, v 0.45 | rif 0.5 | 75 |
| `angelfish` | Keizersvis / Emperor angelfish | *Pomacanthus imperator* | Vissen | swim, 24–30, band 0.35–0.7, v 0.35 | rif 0.5, lagune 0.3 | 75 |
| `garibaldi` | Garibaldi / Garibaldi | *Hypsypops rubicundus* | Vissen | swim, 22–28, band 0.4–0.75, v 0.45 | kelpwoud 0.6 | 75 |
| `mudskipper` | Slijkspringer / Mudskipper | *Boleophthalmus boddarti* | Vissen | floor, 13–16, ×1–3 | mangrove 0.7 | 150 |
| `herring` | Haring / Herring | *Clupea harengus* | Vissen | bezoeker, 30–36, v 1.6 | wadden b×2, noordzee b×2 | 225 |
| `cod` | Kabeljauw / Cod | *Gadus morhua* | Vissen | swim, 34–42, band 0.45–0.75, v 0.4 | noordzee 0.5 | 75 |
| `flatfish` | Schol / Plaice | *Pleuronectes platessa* | Vissen | floor, 22–28, ×1–2 | wadden 0.8, noordzee 0.6 | 150 |
| `wolffish` | Zeewolf / Atlantic wolffish | *Anarhichas lupus* | Vissen | floor, 36–44, kruip 0.03 | noordzee 0.3, ijszee 0.3 | 75 |
| `icefish` | IJsvis / Icefish | *Chaenocephalus aceratus* | Vissen | glide, 28–34, lift 16–30, v 0.25 | ijszee 0.4 | 75 |
| `hatchet` | Bijlvisjes / Hatchetfish | *Argyropelecus* | Vissen | swim, 10–13, band 0.45–0.75, v 0.35, ×3–5 | diepzee 0.5 | 225 |
| `viperfish` | Addervis / Viperfish | *Chauliodus sloani* | Vissen | swim, 26–32, band 0.4–0.8, v 0.35 | diepzee 0.45 | 75 |
| `gulper` | Pelikaanaal / Pelican eel | *Eurypharynx pelecanoides* | Vissen | swim, 40–52, band 0.4–0.8, v 0.3 | diepzee 0.3 | 75 |
| `hammerhead` | Hamerhaai / Hammerhead shark | *Sphyrna lewini* | Haaien en grote vissen | bezoeker, 153–207, v 1 | rif b×1, mangrove b×1 | 225 |
| `whaleshark` | Walvishaai / Whale shark | *Rhincodon typus* | Haaien en grote vissen | bezoeker, 386–499, v 0.45 | rif b×1, lagune b×1 | 225 |
| `thresher` | Voshaai / Thresher shark | *Alopias vulpinus* | Haaien en grote vissen | bezoeker, 180–239, v 1.1 | rif b×1, noordzee b×1, sargasso b×1 | 225 |
| `whitetip` | Witpuntrifhaai / Whitetip reef shark | *Triaenodon obesus* | Haaien en grote vissen | bezoeker, 130–170, v 1 | rif b×2, lagune b×2, mangrove b×2, grot b×1 | 225 |
| `greatwhite` | Witte haai / Great white shark | *Carcharodon carcharias* | Haaien en grote vissen | bezoeker, 232–297, v 0.9 | kelpwoud b×2, noordzee b×2, sargasso b×2, ijszee b×1, diepzee b×1 | 225 |
| `swordfish` | Zeilvis / Sailfish | *Istiophorus platypterus* | Haaien en grote vissen | bezoeker, 131–178, v 2.4 | rif b×1, noordzee b×1, sargasso b×1, diepzee b×1 | 225 |
| `marlin` | Marlijn / Marlin | *Makaira nigricans* | Haaien en grote vissen | bezoeker, 171–220, v 2.2 | rif b×1, sargasso b×1 | 225 |
| `tuna` | Tonijn / Tuna | *Thunnus albacares* | Haaien en grote vissen | bezoeker, 70–90, v 1.8 | rif b×1, noordzee b×1, sargasso b×1 | 225 |
| `barracuda` | Barracuda / Barracuda | *Sphyraena barracuda* | Haaien en grote vissen | bezoeker, 110–140, v 1.3 | rif b×1, lagune b×1, mangrove b×1 | 225 |
| `sunfish` | Maanvis / Ocean sunfish | *Mola mola* | Haaien en grote vissen | bezoeker, 90–129, v 0.35 | rif b×1, kelpwoud b×1, noordzee b×1, sargasso b×1, diepzee b×1 | 225 |
| `coelacanth` | Coelacant / Coelacanth | *Latimeria chalumnae* | Haaien en grote vissen | bezoeker, 110–138, v 0.4 | grot b×1, diepzee b×1 | 150 |
| `leopardshark` | Luipaardhaai / Leopard shark | *Triakis semifasciata* | Haaien en grote vissen | glide, 62–78, lift 20–34, v 0.45 | kelpwoud 0.4 | 75 |
| `greenland` | Groenlandse haai / Greenland shark | *Somniosus microcephalus* | Haaien en grote vissen | bezoeker, 230–290, v 0.35 | ijszee b×2 | 225 |
| `ray` | Pijlstaartrog / Stingray | *Dasyatis pastinaca* | Roggen | glide, 45–70, lift 12–30 | rif 0.7, lagune 0.9, mangrove 0.6, kelpwoud 0.4, noordzee 0.7, diepzee 0.5 | 75 |
| `manta` | Manta / Manta ray | *Mobula birostris* | Roggen | bezoeker, 111–169, v 0.7 | rif b×1, noordzee b×1, diepzee b×1 | 225 |
| `eagleray` | Adelaarsrog / Spotted eagle ray | *Aetobatus narinari* | Roggen | bezoeker, 110–150, v 0.8 | rif b×1, lagune b×2, mangrove b×1 | 225 |
| `electricray` | Sidderrog / Electric ray | *Torpedo marmorata* | Roggen | glide, 28–36, lift 14–26, v 0.3 | rif 0.25, lagune 0.2, noordzee 0.3, diepzee 0.2 | 75 |
| `guitarfish` | Vioolrog / Guitarfish | *Rhinobatos rhinobatos* | Roggen | glide, 44–56, lift 10–20, v 0.35 | rif 0.25, lagune 0.4, mangrove 0.3 | 75 |
| `sawfish` | Zaagvis / Sawfish | *Pristis pristis* | Roggen | bezoeker, 190–240, v 0.6 | lagune b×1, mangrove b×1 | 225 |
| `seahorse` | Zeepaardje / Seahorse | *Hippocampus kuda* | Zeepaardjes en zeedraken | bij kelp, 1–2, 20–28 | rif 0.8, lagune 0.5, mangrove 0.7, kelpwoud 0.5, noordzee 0.5 | 150 |
| `seadragon` | Bladzeedraak / Leafy seadragon | *Phycodurus eques* | Zeepaardjes en zeedraken | bij kelp, 34–44 | rif 0.15, kelpwoud 0.6 | 75 |
| `jelly` | Kwal / Jellyfish | *Aurelia aurita* | Kwallen | drijft, 2–8, r 12–30 | — | 500 |
| `cassiopea` | Omgekeerde kwal / Upside-down jellyfish | *Cassiopea andromeda* | Kwallen | bodem, 2–4, 12–18 | rif 0.2, lagune 0.6, mangrove 0.9 | 300 |
| `comb` | Ribkwal / Comb jelly | *Mnemiopsis leidyi* | Kwallen | drijft, 2–4, r 10–18 | wadden 0.5, noordzee 0.3, sargasso 0.4, ijszee 0.8, grot 0.6, diepzee 0.7 | 300 |
| `manowar` | Portugees oorlogsschip / Portuguese man o' war | *Physalia physalis* | Kwallen | surface, 26–32, v 0.06 | sargasso 0.5 | 75 |
| `octopus` | Octopus / Octopus | *Octopus vulgaris* | Inktvissen | bodem, 26–36 | rif 0.8, lagune 0.4, mangrove 0.4, kelpwoud 0.8, noordzee 0.7, sargasso 0.3, ijszee 0.4, grot 0.5, diepzee 0.7 | 75 |
| `coconut` | Kokosnootoctopus / Coconut octopus | *Amphioctopus marginatus* | Inktvissen | floor, 20–26, kruip 0.1 | rif 0.2, lagune 0.5 | 75 |
| `mimic` | Mimicoctopus / Mimic octopus | *Thaumoctopus mimicus* | Inktvissen | in schatkist | — | 75 |
| `squid` | Inktvisjes / Squid | *Loligo vulgaris* | Inktvissen | groep 3–6, 10–16 | rif 0.6, kelpwoud 0.4, noordzee 0.6, sargasso 0.6, ijszee 0.4, grot 0.3, diepzee 0.8 | 375 |
| `giant` | Reuzeninktvis / Giant squid | *Architeuthis dux* | Inktvissen | moment diepzee | — | 75 |
| `cuttlefish` | Zeekat / Cuttlefish | *Sepia officinalis* | Inktvissen | swim 40–65%, 30–40 | rif 0.4, mangrove 0.3, kelpwoud 0.3, noordzee 0.6 | 75 |
| `nautilus` | Nautilus / Nautilus | *Nautilus pompilius* | Inktvissen | swim 30–60%, 16–22 | grot 0.8, diepzee 0.5 | 75 |
| `vampire` | Vampierinktvis / Vampire squid | *Vampyroteuthis infernalis* | Inktvissen | swim, 22–28, band 0.4–0.75, v 0.3 | diepzee 0.4 | 75 |
| `dumbo` | Dumbo-octopus / Dumbo octopus | *Grimpoteuthis* | Inktvissen | swim, 20–26, band 0.45–0.8, v 0.22 | diepzee 0.4 | 75 |
| `krill` | Krill / Krill | *Euphausia superba* | Schaaldieren en degenkrab | swim, 70–90, band 0.3–0.6, v 0.15 | ijszee 0.5 | 75 |
| `crab` | Krab / Crab | *Brachyura* | Schaaldieren en degenkrab | bodem, 1–3, 12–20 | rif 0.9, lagune 0.7, mangrove 1, wadden 1, kelpwoud 0.9, noordzee 1, sargasso 0.4, ijszee 0.6, grot 0.7, diepzee 0.8 | 750 |
| `hermit` | Heremietkreeft / Hermit crab | *Pagurus bernhardus* | Schaaldieren en degenkrab | bodem, 1–2, 10–14 | rif 0.8, lagune 0.8, mangrove 0.8, wadden 0.4, kelpwoud 0.8, noordzee 0.7, ijszee 0.3, grot 0.4, diepzee 0.4 | 150 |
| `lobster` | Kreeft / Lobster | *Homarus gammarus* | Schaaldieren en degenkrab | bodem, 1–2, 26–34 | rif 0.2, kelpwoud 0.5, noordzee 0.8, ijszee 0.2, grot 0.5, diepzee 0.2 | 150 |
| `spidercrab` | Japanse reuzenkrab / Japanese spider crab | *Macrocheira kaempferi* | Schaaldieren en degenkrab | bodem, 26–34 | noordzee 0.3, sargasso 0.3, ijszee 0.4, grot 0.5, diepzee 0.7 | 150 |
| `mantis` | Bidsprinkhaankreeft / Mantis shrimp | *Odontodactylus scyllarus* | Schaaldieren en degenkrab | hol, 13–17 | rif 0.7, mangrove 0.4, kelpwoud 0.3, noordzee 0.3 | 75 |
| `pistol` | Pistoolgarnaal en wachtersgrondel / Pistol shrimp and watchman goby | *Alpheus & Cryptocentrus cinctus* | Schaaldieren en degenkrab | hol + grondel | rif 0.5, lagune 0.8, mangrove 0.5 | 150 |
| `isopod` | Reuzenpissebed / Giant isopod | *Bathynomus giganteus* | Schaaldieren en degenkrab | bodem, 1–2, 22–30 | ijszee 0.3, grot 0.9, diepzee 0.8 | 150 |
| `horseshoe` | Degenkrab / Horseshoe crab | *Limulus polyphemus* | Schaaldieren en degenkrab | floor, 24–30, kruip 0.07 | lagune 0.3, mangrove 0.4 | 75 |
| `shrimp` | Garnalen / Brown shrimp | *Crangon crangon* | Schaaldieren en degenkrab | glide, 16–20, lift 3–9, v 0.3, ×2–3 | wadden 1 | 600 |
| `starfish` | Zeester / Starfish | *Asterias rubens* | Zeesterren, egels, slakken en wormen | bodem, 2–4, 9–15 | rif 1, lagune 1, mangrove 0.4, wadden 0.6, kelpwoud 0.9, noordzee 0.9, sargasso 0.3, ijszee 0.9, grot 0.4, diepzee 0.5 | 300 |
| `crownthorns` | Doornenkroon / Crown-of-thorns starfish | *Acanthaster planci* | Zeesterren, egels, slakken en wormen | floor, 20–26, kruip 0.02 | rif 0.3 | 150 |
| `brittlestar` | Slangster / Brittle star | *Ophiothrix fragilis* | Zeesterren, egels, slakken en wormen | floor, 11–15, kruip 0.06, ×2–4 | rif 0.3, noordzee 0.4, ijszee 0.4, grot 0.5, diepzee 0.6 | 300 |
| `featherstar` | Haarster / Feather star | *Antedon bifida* | Zeesterren, egels, slakken en wormen | floor, 16–22, ×1–2 | rif 0.4, grot 0.3, diepzee 0.3 | 150 |
| `urchin` | Zee-egel / Sea urchin | *Diadema setosum* | Zeesterren, egels, slakken en wormen | bodem, 1–3, 7–11 | rif 0.7, mangrove 0.3, kelpwoud 1, noordzee 0.7, ijszee 0.6, grot 0.5, diepzee 0.8 | 225 |
| `sanddollar` | Zanddollar / Sand dollar | *Echinarachnius parma* | Zeesterren, egels, slakken en wormen | floor, 9–13, ×2–4 | lagune 0.6, kelpwoud 0.3, noordzee 0.3 | 300 |
| `seacucumber` | Zeekomkommer / Sea cucumber | *Pseudocolochirus violaceus* | Zeesterren, egels, slakken en wormen | floor, 18–24, kruip 0.04, ×1–3 | rif 0.4, lagune 0.4, noordzee 0.3, grot 0.3, diepzee 0.5 | 225 |
| `slugs` | Zeenaaktslak / Sea slug | *Flabellina iodinea* | Zeesterren, egels, slakken en wormen | bodem, 2–4, 10–16 | rif 0.9, lagune 0.5, mangrove 0.4, kelpwoud 0.7, noordzee 0.5, ijszee 0.4, grot 0.5, diepzee 0.6 | 225 |
| `glaucus` | Blauwe zeedraak / Blue dragon | *Glaucus atlanticus* | Zeesterren, egels, slakken en wormen | surface, 16–20, v 0.04 | sargasso 0.35 | 75 |
| `xmastree` | Kerstboomwormpjes / Christmas tree worms | *Spirobranchus giganteus* | Zeesterren, egels, slakken en wormen | floor, 18–24, ×2–4 | rif 0.6, lagune 0.3 | 225 |
| `lugworm` | Wadpier / Lugworm | *Arenicola marina* | Zeesterren, egels, slakken en wormen | floor, 16–20, ×2–4 | wadden 0.9 | 300 |
| `coral` | Koraaltuin / Coral garden | *Anthozoa* | Koralen, sponzen en schelpen | landschap | — | 60 |
| `anemone` | Anemoon / Anemone | *Heteractis magnifica* | Koralen, sponzen en schelpen | landschap | — | 60 |
| `sponges` | Sponzen / Sponges | *Porifera* | Koralen, sponzen en schelpen | landschap | — | 60 |
| `clam` | Reuzenschelp / Giant clam | *Tridacna gigas* | Koralen, sponzen en schelpen | landschap | — | 60 |
| `cockle` | Kokkel / Cockle | *Cerastoderma edule* | Koralen, sponzen en schelpen | floor, 12–15, ×2–4 | wadden 0.8 | 300 |
| `turtle` | Zeeschildpad / Sea turtle | *Chelonia mydas* | Reptielen | bezoeker, 70–96, v 0.55 | rif b×2, lagune b×2, mangrove b×2, noordzee b×1, sargasso b×1, grot b×2 | 225 |
| `hawksbill` | Karetschildpad / Hawksbill turtle | *Eretmochelys imbricata* | Reptielen | swim, 44–54, band 0.35–0.65, v 0.4 | rif 0.3, lagune 0.3 | 150 |
| `leatherback` | Lederschildpad / Leatherback turtle | *Dermochelys coriacea* | Reptielen | bezoeker, 140–177, v 0.55 | lagune b×1, noordzee b×1, sargasso b×1 | 225 |
| `crocodile` | Zeekrokodil / Saltwater crocodile | *Crocodylus porosus* | Reptielen | bezoeker, 203–258, v 0.5 | mangrove b×2 | 225 |
| `seasnake` | Geelbuikzeeslang / Sea snake | *Hydrophis platurus* | Reptielen | swim, 44–56, band 0.4–0.7, v 0.5 | rif 0.3, lagune 0.3, mangrove 0.4 | 75 |
| `seakrait` | Zeekrait / Sea krait | *Laticauda colubrina* | Reptielen | swim, 42–52, band 0.45–0.75, v 0.5 | rif 0.25, lagune 0.3 | 75 |
| `iguana` | Zeeleguaan / Marine iguana | *Amblyrhynchus cristatus* | Reptielen | glide, 38–46, lift 20–40, v 0.35 | lagune 0.25, mangrove 0.15 | 75 |
| `porpoise` | Bruinvis / Harbour porpoise | *Phocoena phocoena* | Walvissen en dolfijnen | swim, 48–58, band 0.25–0.5, v 0.9 | wadden 0.35, noordzee 0.45 | 75 |
| `dolphins` | Dolfijnen / Dolphins | *Tursiops truncatus* | Walvissen en dolfijnen | bezoeker, 70–94, v 1.7 | rif b×2, lagune b×1, mangrove b×1, kelpwoud b×2, noordzee b×2, sargasso b×1 | 900 |
| `orca` | Orka / Orca | *Orcinus orca* | Walvissen en dolfijnen | bezoeker, 170–240, v 1.4 | kelpwoud b×1, noordzee b×1, ijszee b×1 | 225 |
| `falsekiller` | Zwarte zwaardwalvis / False killer whale | *Pseudorca crassidens* | Walvissen en dolfijnen | bezoeker, 120–150, v 1.4 | rif b×1, sargasso b×1 | 225 |
| `pilotwhale` | Griend / Pilot whale | *Globicephala melas* | Walvissen en dolfijnen | bezoeker, 111–140, v 1.1 | kelpwoud b×1, noordzee b×1, sargasso b×1 | 225 |
| `beluga` | Beluga / Beluga | *Delphinapterus leucas* | Walvissen en dolfijnen | bezoeker, 120–159, v 0.7 | ijszee b×2 | 225 |
| `narwhal` | Narwal / Narwhal | *Monodon monoceros* | Walvissen en dolfijnen | bezoeker, 111–147, v 0.8 | ijszee b×2 | 225 |
| `humpback` | Bultrug / Humpback whale | *Megaptera novaeangliae* | Walvissen en dolfijnen | bezoeker, 950–950, v 0.6 | rif b×1, kelpwoud b×1, noordzee b×1, sargasso b×1, ijszee b×1 | 225 |
| `spermwhale` | Potvis / Sperm whale | *Physeter macrocephalus* | Walvissen en dolfijnen | bezoeker, 423–540, v 0.4 | noordzee b×1, sargasso b×1, ijszee b×1, diepzee b×1 | 225 |
| `finwhale` | Gewone vinvis / Fin whale | *Balaenoptera physalus* | Walvissen en dolfijnen | bezoeker, 900–900, v 0.5 | rif b×1, kelpwoud b×1, noordzee b×2, sargasso b×2, ijszee b×2, diepzee b×1 | 225 |
| `bluewhale` | Blauwe vinvis / Blue whale | *Balaenoptera musculus* | Walvissen en dolfijnen | bezoeker, 1150–1150, v 0.35 | sargasso b×1, ijszee b×1, diepzee b×1 | 225 |
| `otters` | Zeeotter / Sea otter | *Enhydra lutris* | Zoogdieren en vogels | oppervlak, 1–2, 26–34 | kelpwoud 1 | 150 |
| `seal` | Zeehond / Seal | *Phoca vitulina* | Zoogdieren en vogels | swim 30–50%, 50–70 | wadden 1, kelpwoud 0.4, ijszee 0.9 | 750 |
| `sealion` | Zeeleeuw / Sea lion | *Zalophus californianus* | Zoogdieren en vogels | bezoeker, 90–119, v 1.5 | kelpwoud b×2, noordzee b×1 | 225 |
| `leopardseal` | Luipaardrob / Leopard seal | *Hydrurga leptonyx* | Zoogdieren en vogels | swim, 80–96, band 0.3–0.6, v 0.7 | ijszee 0.3 | 75 |
| `walrus` | Walrus / Walrus | *Odobenus rosmarus* | Zoogdieren en vogels | surface, 54–66, v 0.25 | ijszee 0.6 | 75 |
| `manatee` | Zeekoe / Manatee | *Trichechus manatus* | Zoogdieren en vogels | bezoeker, 131–170, v 0.4 | rif b×1, lagune b×1, mangrove b×2 | 225 |
| `dugong` | Doejong / Dugong | *Dugong dugon* | Zoogdieren en vogels | glide, 72–88, lift 14–26, v 0.25 | lagune 0.35 | 150 |
| `polarbear` | IJsbeer / Polar bear | *Ursus maritimus* | Zoogdieren en vogels | surface, 52–62, v 0.3 | ijszee 0.4 | 75 |
| `penguins` | Pinguïns / Penguins | *Aptenodytes forsteri* | Zoogdieren en vogels | groep 3–6, 14–18, alleen met ijs | ijszee 1 | 1500 |
| `puffin` | Papegaaiduiker / Puffin | *Fratercula arctica* | Zoogdieren en vogels | dive, 20–24, v 0.35 | noordzee 0.4, ijszee 0.3 | 75 |
| `gannet` | Jan-van-gent / Northern gannet | *Morus bassanus* | Zoogdieren en vogels | dive, 30–36, v 0.3 | noordzee 0.5 | 75 |
| `albatross` | Albatros / Albatross | *Diomedea exulans* | Zoogdieren en vogels | surface, 30–36, v 0.15 | kelpwoud 0.2, sargasso 0.5, ijszee 0.3 | 75 |
| `cormorant` | Aalscholver / Cormorant | *Phalacrocorax carbo* | Zoogdieren en vogels | dive, 24–28, v 0.4 | mangrove 0.3, wadden 0.4, kelpwoud 0.4, noordzee 0.5 | 75 |
| `pelican` | Pelikaan / Pelican | *Pelecanus onocrotalus* | Zoogdieren en vogels | surface, 32–38, v 0.12 | lagune 0.4, mangrove 0.5 | 75 |
| `eider` | Eidereend / Common eider | *Somateria mollissima* | Zoogdieren en vogels | dive, 26–30, v 0.22 | wadden 0.6 | 150 |

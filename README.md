# Oceaan

Een levende onderwaterwereld die elke keer anders is, in tien wateren van koraalrif en lagune tot Sargassozee, mangrove, onderwatergrot en Waddenzee: scholen vissen, kwallen, krabben, een octopus, walvissen, orka's en haaien, gezonken piratenschepen, auto's en amforen, schatkisten, Atlantis en heel zeldzaam de Kraken, een spookschip, een zeemeermin, een zeeslang, een megalodon, de witte potvis of een spookduiker. Met dag en nacht, seizoenen, onweer, een duiker, een logboek met plaatjes, shiny dieren en een fotoalbum. In het Nederlands en het Engels.

Speel online op **https://ronaldsteenkamp.github.io/oceaan/**. Op je telefoon kun je hem als app op je beginscherm zetten; daarna werkt hij ook zonder internet.

## Bediening

- Een nieuwe speler begint met drie **oefenduiken**: een rustige lagune, een koraalrif met een fles en de Noordzee met iets zeldzaams voor de sonar, steeds met een korte tip. Ze staan in `INTRO` in `01-basis.js`. Wie al vondsten heeft, slaat ze over.
- De pijltjesknop onderaan (of R) geeft een nieuwe oceaan. Na de oefenduiken (of, voor wie ze oversloeg, na vijf vrije oceanen) wacht je tweeënhalve minuut, en elke mijlpaal van vondsten maakt dat korter, tot vijf seconden (één seconde als je alles hebt).
- Roep de duiker met D; hij verschijnt bij je cursor. Houd zijn lamp ongeveer een seconde op iets nieuws (een ringetje loopt vol), dan gaat het in je logboek. Gewone vondsten vliegen als polaroidje naar het logboek terwijl je doorspeelt; alleen iets bijzonders (je eerste vondst, een shiny, iets zeldzaams, elke 50e vondst) krijgt een grote foto. Roep je de duiker terug of ga je naar een nieuwe oceaan, dan zie je een duikverslag met alles wat nieuw was; het sluit na vijf seconden vanzelf. De dieren reageren alleen op de duiker.
- Houd ingedrukt om de vissen te voeren.
- Zwem met de duiker naar een schatkist om hem te openen. Tik op een fles (schatkaart), een reuzenschelp of een verstopt zeepaardje.
- Het boekje onderaan is je logboek. Onder "Maken en delen" bouw je je eigen aquarium en deel je je oceaan. Dezelfde code geeft op elk scherm en in elke browser dezelfde oceaan.
- Met de duiker zoek je met de sonarknop (of Q) naar iets zeldzaams: een gouden echo wijst de richting.
- Met een toetsenbord: pijltjes sturen de duiker, E roept de duiker en opent wat hij aanraakt, Q stuurt een sonarpuls uit, L opent het logboek, F maakt een foto, G zet het geluid aan of uit, R geeft een nieuwe oceaan (ingedrukt houden: zelf het water kiezen, met de beloning Wereldreiziger).
- Zet tot drie dingen die je nog zoekt op je **speurlijst** (op hun pagina in het logboek). Een nieuwe oceaan meldt of ze er zijn of kunnen langskomen.
- De **glinstermeter** vult zich met elke eigen oceaan zonder nieuwe shiny: shiny's worden dan steeds iets vaker, tot drie keer zo vaak. Een nieuwe shiny maakt hem leeg. Gedeelde links en aquaria tellen niet mee.
- Een paar keer per jaar is er een **kalender-event**, voor iedereen op die datum: Spookweek (24 oktober tot 2 november, meer spoken), Winterlicht (15 december tot 6 januari, noorderlicht boven elk water) en de Dag van de Oceaan (8 juni, dubbel zoveel shiny's). Ze staan in `EVENTS` in `01-basis.js` en veranderen alleen kansen, nooit wat er te vinden is.
- Je logboek staat in je browser. Achterin het logboek, onder Bewaren, sla je alles op als bestand (vondsten, album, fotoboek, geredde dieren) en laad je het op een ander apparaat weer in.

## Hoe het in elkaar zit

De bron staat in `src/`. `build.py` plakt de genummerde JS-bestanden op volgorde aan elkaar in één `(() => { ... })()`. Functies uit een later bestand zijn daardoor overal bruikbaar, maar een `const` pas na zijn eigen regel: zet tabellen dus vóór de code die ze bij het laden gebruikt.

| Bestand | Inhoud |
| --- | --- |
| `head.html`, `styles.css`, `body.html`, `fonts/` | titel, stijl, opmaak van de bediening en de lettertypes |
| `00-animals.js` | **het dierenregister**: per dier naam, familie, wetenschappelijke naam, wateren, shiny, weetje en veldnotitie |
| `01-basis.js` | wateren, vondsten, momenten, logboekvolgorde, mijlpalen, meldingen |
| `02-scene.js` | een oceaan opbouwen uit een seed (met zijstromen, zodat de seed niet van het scherm afhangt) |
| `03` tot en met `08` | water en bodem, de eerste dieren en bezoekers, logboekplaatjes, oppervlak en licht, geluid |
| `09-moments-and-diver.js` | vulkaan, stad, bait-ball, onweer, vliegende vissen, de duiker, schatkaart |
| `10-shiny.js` | shiny's: kansen, kleurenschema's en het tekenen ervan |
| `11-mangrove-and-cave.js` | mangrove, grot en de tweede ronde dieren, bezoekers en momenten |
| `12-lagoon-and-sargasso.js` | lagune, Sargassozee, de derde ronde, noorderlicht en de sonar |
| `13-fauna-system.js` | het systeem dat dieren laat zwemmen, kruipen en drijven (`FAUNA`, `FAUNA_VIS`) en de vierde ronde |
| `14-wave6.js` | de zesde ronde: dertig dieren, de klimmende ijsbeer, zes momenten en twee legendes |
| `14-wave7-wadden.js` | de zevende ronde: de Waddenzee met wadpier, kokkel, garnalen en eidereend |
| `15-frame.js` | de animatielus, automatische kwaliteit en het meetscherm |
| `16-controls.js` | aanraken, toetsen, duiker, nieuwe oceaan, reservekopie |
| `17-logbook-and-menu.js` | weetjes van de rest, detailkaarten, album en "Maken en delen" |
| `18-notebook.js` | het logboek als notitieboek |
| `19-quests.js` | opdracht van de dag, fotoboek, waterfilter, logboeken vergelijken |
| `20-language-and-start.js` | taal, zelftest en opstarten |

## Bouwen en testen

```
pip install pillow
python build.py
```

Dit bouwt `dist/` (de pagina `oceaan.html`, die ook als claude.ai-artifact wordt gepubliceerd, en de app: `index.html`, `sw.js`, manifest en iconen), draait de zelftest in een onzichtbare Chrome en maakt schermafbeeldingen in `checks/`. Vindt de zelftest een fout, dan wordt er niets gebouwd. Chrome wordt vanzelf gevonden; anders zet je het pad in `CHROME`. `python check.py` controleert alleen.

De zelftest bouwt 40 oceanen, dwingt alle momenten en bezoekers af, tekent elk logboekplaatje en controleert ook: of elk dier compleet geregistreerd is, of dezelfde seed op computer, telefoon en liggende telefoon dezelfde oceaan geeft, terugkerende shiny dieren, en of er tekenfouten zijn ingeslikt.

**Gedeelde oceanen:** de zelftest vergelijkt 35 vaste oceanen (seeds 1 tot 30 en vijf Waddenzee-seeds) met `zaden.json` (water, seizoen, zeldzaamheid, bodem, dieren en hun plek, shiny's, timers). Verandert er iets, bijvoorbeeld door een nieuw dier of een andere kans, dan meldt de build welke oceanen en welk onderdeel: wie een oude link opent, ziet dan iets anders. Is dat de bedoeling, leg de nieuwe stand dan vast met `python build.py --zaden-vastleggen` en commit `zaden.json` mee.

**Publiceren:** `python publish.py` bouwt en test de oceaan en zet `dist/` op de branch `gh-pages`; GitHub Pages toont die branch. De bouwresultaten staan zo nooit in `main`. De versie is een vingerafdruk van de pagina: alleen bij een echte wijziging krijgen geïnstalleerde apps de melding "nieuwe versie". In `ci/pages.yml` staat een GitHub Action die precies hetzelfde (ook naar `gh-pages`) bij elke push naar `main` vanzelf doet, zodat GitHub Pages altijd de branch `gh-pages` blijft tonen; die werkt zodra hij in `.github/workflows/` staat en het GitHub-token de scope `workflow` heeft (`gh auth refresh -h github.com -s workflow`).

**Schermtests:** `#schermtest-<seed>` met `-logboek`, `-detail`, `-ontdek`, `-menu`, `-welkom` of `-nacht` opent die oceaan in een vaste stand; `#stijlblad` toont alle logboekplaatjes per familie (gewoon, shiny en nog niet gevonden).

**Meten:** open de oceaan met `?meten` achter het adres (`https://ronaldsteenkamp.github.io/oceaan/?meten`). Linksboven staan dan de fps, de tekentijd per frame, het deel trage frames en het kwaliteitsniveau. Tik erop om een kort rapport te kopiëren.

## Een nieuw dier toevoegen

1. **`src/00-animals.js`**: voeg een record toe aan het eind van zijn familie, met `nl`, `en`, `family`, `sci`, `life` (`{ water: kans }`) of `visits` (`{ water: kaartjes }` voor een bezoeker), `shiny` (1 op ...), `pal` (shiny-kleuren "#oud>#nieuw ..." voor elke kleur van de tekening) en/of `hue`, `fact` en `note` (`[nl, en]`). Begint de naam met een eigennaam ("Groenlandse haai"), zet dan `capital`; een zeevogel die 's winters wegtrekt krijgt `winterLeaves`. De bovenkant van het bestand legt elk veld uit.
2. **Tekenen**: schrijf een `function drawX(f)` (of `drawX(x, y, dir, L, ph)` voor een bezoeker) in een bestand bij zijn ronde, bijvoorbeeld `14-wave6.js`, en zet het dier in `FAUNA` (met `kind`, `size`, `draw`, `thumb`) of `FAUNA_VIS`. Een bodemdier (`kind: "floor"` of `"glide"`) krijgt vanzelf zand in zijn logboekplaatje, en een bezoeker in `FAUNA_VIS` vanzelf zijn tekening en grootte. Gebruik hex-kleuren met `sh("#...")`, zodat het water en de shiny ze kunnen omzetten.
3. **`python build.py`**: de zelftest zegt precies wat er nog mist ("dier x: mist ...").
4. **Stijl**: volg de stijlgids bovenaan `src/00-animals.js` (vlakken zonder omtrek, `eye()` voor de ogen, licht van boven, een shiny die echt van kleur verandert) en bekijk het dier op het stijlblad (`#stijlblad` achter het adres, of `checks/stijlblad.png` na een build) naast de andere dieren van zijn familie.

Zet een nieuw dier dat ergens leeft of langskomt ook achteraan in `AQ_BASE` (`01-basis.js`): zo houdt het een vaste plek in de aquariumcode en blijven oude aquariumlinks werken. Geef een nieuw dier in `FAUNA` ook `stream: true`, dan gooit het met een eigen dobbelsteen en blijven bestaande oceanen precies hetzelfde (de zelftest controleert beide).

## Credits

Gemaakt door Ronald.

Lettertypes: Caveat, DM Mono en Figtree (SIL Open Font License), meegeleverd in `src/fonts/`; de site haalt niets bij Google op.

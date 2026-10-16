# Ontwerpevaluatie Oceaan

*Oktober 2026. Bekeken in Chrome op 1440×900, 1280×800 en 390×844, in het Nederlands en het Engels, met een leeg logboek en met een half gevuld logboek (93 van 173 dieren, 20 shiny's). Screenshots staan in [`ontwerp-evaluatie/`](ontwerp-evaluatie/). Er is nog geen code aangepast.*

## 1. Samenvatting

**Sterk**
1. **Twee duidelijke werelden die elk kloppen.** De oceaan is vlakke, rustige vectorillustratie met diepte door licht en kleur; het logboek is een tastbaar veldnotitieboek (ruitjespapier, polaroids, plakband, Caveat). Beide zijn met zorg uitgewerkt.
2. **Kleur per water is centraal en goed gekozen.** Elk water heeft in `WATERS` (`01-basis.js`) een eigen `top/mid/bottom`-verloop; lagune, Waddenzee, mangrove en grot voelen echt anders ([lagune](ontwerp-evaluatie/desktop-lagune.jpg), [wadden](ontwerp-evaluatie/desktop-wadden.jpg), [grot](ontwerp-evaluatie/desktop-grot.jpg)).
3. **Rustige, levende beweging.** Scholen, kwallen met gloed, lichtbundels en bubbels zorgen voor sfeer zonder druk te worden. Er is al rekening gehouden met `prefers-reduced-motion` en een rustmodus.

**Grootste problemen**
1. **Op de telefoon voelt de oceaan leeg.** De scène wordt niet opnieuw gecomponeerd voor staand beeld: zo'n 70% van het scherm is lege waterkolom, dieren zijn piepklein en de bodem is een smalle strook ([telefoon-lagune](ontwerp-evaluatie/telefoon-lagune.jpg), [telefoon-mangrove](ontwerp-evaluatie/telefoon-mangrove.jpg)).
2. **De dierillustraties delen geen vastgelegde stijl.** Schaal in het plaatje, ogen, contourlijnen en detailniveau verschillen per golf; nieuwere dieren (eidereend) zijn grover dan oudere (pelikaan). Shiny's zijn vaak alleen een kleurwissel met drie sterretjes.
3. **Er zitten slordigheden in tekst en layout:** woorden breken midden in een woord ("Kokosnootoctopu‑s", "Maansverduisteri‑ng"), een tooltip valt buiten beeld, het statuslabel is onleesbaar op licht zand, het logboek heeft halflege pagina's en de afgrond trekt een harde verticale naad door het water.

## 2. Bevindingen per onderdeel

### 2.1 Visuele identiteit

**Wat ik zag.** De oceaan is een herkenbare stijl: vlakke vormen zonder contour, gedempte kleuren, licht als belangrijkste effect. Het logboek is een tweede, even sterke stijl. Het menu "Maken en delen", de welkomstkaart, het duikverslag en de toasts zijn een derde stijl: een generiek donker 'glass'-dashboard met Figtree ([menu](ontwerp-evaluatie/menu-tooltip-afgesneden.jpg), [welkom](ontwerp-evaluatie/welkom.jpg)).

**Waarom het telt.** De derde stijl is nergens fout, maar heeft geen eigen karakter. Hij ziet eruit als instellingen van een willekeurige app, juist op de momenten die de toon zetten (de allereerste kaart, het duikverslag).

**Voorstel.** Kies het notitieboek als merk en laat de 'glass'-laag daar duidelijk een kleine broer van zijn: koppen van welkom, menu en duikverslag in Caveat (het duikverslag doet dat al), een papierkleurige accentlijn of een stukje plakband op de kaart, en dezelfde polaroidrand om plaatjes. Het menu hoeft geen papier te worden; het moet alleen dezelfde familie zijn.

**Props verdunnen het water.** Duikerhelm, amforen, de grijze stenen koepel en octopus duiken in bijna elk water op: in [mangrove](ontwerp-evaluatie/desktop-mangrove.jpg), [ijszee](ontwerp-evaluatie/desktop-ijszee.jpg) (met een gloeiende vulkaan) en [diepzee](ontwerp-evaluatie/desktop-diepzee.jpg). De kansen staan per water in `props` in `WATERS`. Voorstel: per water maximaal één 'algemeen' prop en vooral de eigen props. Dit verandert wel de seeds, dus het moet samen met `zaden.json`.

### 2.2 Kleur

**Wat ik zag.**
- Kleuren in de UI staan grotendeels als tokens in `:root` in `styles.css` (`--deep`, `--surface`, `--accent`, `--gold` …). Het notitieboek heeft eigen variabelen (`--paper`, `--ink`, `--pencil`) die alleen op `#panel.book` staan, en de tabkleuren staan hardcoded in `BOOK_TABS` (`18-notebook.js:6`). Verder zitten er losse waarden in de CSS (`#9ae4d8`, `#b8322a`, `#2f7a3a`, `#a8780a`, `#9a6f10`, `#c89a1a`, `#e6f4ef`), drie verschillende goudtinten voor 'shiny' en twee voor 'nieuw'.
- In de tekeningen staan ruim 800 hex-waarden, wat normaal is voor illustraties. Doordat ze via `sh()` lopen, kunnen water en shiny ze omzetten; dat is een goede basis.
- Diepte werkt: de lagune is licht en turkoois, de diepzee en grot zijn donkerblauw met gloeiende accenten. Op de telefoon legt de nachtstand een grauwe waas over het hele beeld, waardoor de lagune 's nachts vlak en mistig oogt ([telefoon-lagune](ontwerp-evaluatie/telefoon-lagune.jpg)).

**Voorstel.** Maak één tokenlaag (zie §3) en laat de CSS en `BOOK_TABS` daar alleen naar verwijzen. Gebruik één goud voor shiny op donker en één voor shiny op papier, en één rood voor 'nieuw'. Geef de nacht meer contrast in plaats van alleen een donkerder waas: donkerder water, maar heldere randen of gloed op dieren dichtbij.

### 2.3 Illustraties van dieren

**Wat ik zag** (logboek met 93 dieren, [vissen](ontwerp-evaluatie/logboek-vissen.jpg), [schaaldieren](ontwerp-evaluatie/logboek-schaaldieren.jpg), [telefoon](ontwerp-evaluatie/telefoon-logboek-vissen-en.jpg)):
- **Schaal in het plaatje wisselt sterk.** De garibaldi vult de helft van zijn foto, de naaldvis is een dunne streep, de zeilvis is klein en de haring is een school stipjes. Op een kaart van 92 px valt dat meteen op.
- **Ogen hebben geen vaste vorm.** Er komen grote witte ogen met pupil voor (kogelvis, garibaldi), zwarte stipjes (kabeljauw, zeeleeuw) en sluitstreepjes (octopus).
- **Contour is niet consequent.** De meeste dieren hebben geen lijn, maar trekkersvis, mandarijnvis en kraken hebben donkere randen of strepen met een eigen `lineWidth` (277 keer gezet, waarden van 0,9 tot 2,2).
- **Detailniveau verschilt per golf.** De mandarijnvis en de schorpioenvis zijn rijk uitgewerkt, de garibaldi is een egale vlek. De [eidereend](ontwerp-evaluatie/shiny-eidereend.jpg) uit golf 7 (`14-wave7-wadden.js:112`) heeft een hoekige kop die in één blok overgaat in de nek. Naast de [pelikaan](ontwerp-evaluatie/shiny-pelikaan.jpg) (`13-fauna-system.js:460`) valt hij uit de toon.
- **Vogels zitten in een onderwaterfoto.** De pelikaan en de eidereend drijven op een golflijn met een diepblauw vlak eronder, terwijl de lucht ontbreekt. Een strook lucht boven de waterlijn zou het plaatje kloppend maken.
- **Shiny's.** De pelikaan (wit naar roze) is een mooie variant. Bij veel andere is het een tintverschuiving die op een kleine kaart nauwelijks afwijkt, en in de oceaan zelf zijn de drie sterretjes het enige signaal (in [wadden](ontwerp-evaluatie/desktop-wadden.jpg) zie je de shiny krab rechtsonder bijna niet). Het gouden stickertje op de logboekkaart staat bovenop de illustratie.

**Waarom het telt.** Het logboek is de plek waar je de dieren naast elkaar ziet. Elk verschil in schaal of ogen leest daar als slordigheid, en het wordt erger met elke nieuwe golf.

**Voorstel.** Een stijlgids (§3.4) en een vaste kadrering van de logboekplaatjes: elk dier vult ongeveer 60% van de breedte, op één ooghoogte. Geef shiny's een tweede kenmerk naast de kleur: een zachte lichtrand of glans die langzaam over het lichaam schuift, en in de oceaan een lichte gloed. Zet het shinystickertje op de witte rand van de polaroid in plaats van op de foto.

### 2.4 Typografie

**Wat ik zag.** Er zijn drie lettertypes met een duidelijke taak: Figtree voor de UI, Caveat voor het handschrift in het boek en DM Mono voor codes en tellers. Dat is een goede keuze. De basismaat is 13 px met veel 11–12 px (`.card`, `.chip`, `.badge`, `#nextTime` 11,5 px, `.shinymark small` 9,5 px).

**Problemen.**
1. **Afbreken midden in een woord.** `overflow-wrap: anywhere` op `.card span`, `.nb-sticker`, `#diveReport figure` en `.dc-mini span` geeft "Kokosnootoctopu / s", "Volkaanuitbarstin / g", "Maansverduisteri / ng" en "Bidsprinkhaankr / eeft" ([afbreking](ontwerp-evaluatie/logboek-afbreking-kokosnoot.jpg), [momenten](ontwerp-evaluatie/logboek-momenten-lege-pagina.jpg)). Lange Nederlandse samenstellingen zijn de normale gevallen, geen uitzonderingen.
2. **Kleine UI-tekst.** Op de telefoon is 11–12 px Figtree aan de krappe kant. Caveat leest pas goed vanaf ongeveer 17 px.
3. **Hiërarchie in het menu.** De sectiekoppen (11–12 px, hoofdletters, 60% wit) en de uitleg eronder liggen qua gewicht dicht bij elkaar, waardoor het menu één lange lap is ([menu](ontwerp-evaluatie/menu-tooltip-afgesneden.jpg)).

**Voorstel.** Gebruik `overflow-wrap: break-word` met `hyphens: auto`. `lang` wordt al gezet in `20-language-and-start.js:4`, dus de browser breekt dan netjes af ("Kokosnoot-octopus"). Zet de UI op een minimum van 13 px en Caveat op minimaal 17 px. Gebruik in het menu een duidelijke schaal: sectiekop 13/600, uitleg 13/400 gedimd, en meer ruimte tussen secties dan binnen een sectie.

### 2.5 Layout en UI

1. **Tooltip valt buiten beeld.** De tooltip van de laatste knop ("Maken en delen") staat gecentreerd en loopt van het scherm af ([menu-tooltip](ontwerp-evaluatie/menu-tooltip-afgesneden.jpg)). Dit zit in `.tool[data-tip]:hover::after` in `styles.css`. Voorstel: rechts uitlijnen voor de laatste twee knoppen.
2. **Statusregel onleesbaar op licht water.** "Lagune · eerste duik 1 van 3" staat in 12 px wit met alleen een tekstschaduw op licht zand, met een contrast van ongeveer 1,4:1 ([oefenduik](ontwerp-evaluatie/oefenduik-lagune.jpg)). Voorstel: dezelfde glass-achtergrond als de toolbar, als een klein pilletje.
3. **Iconen in het welkom kloppen niet met de tekst.** Een golfje staat bij "roep de duiker", een sterretje bij "schatkisten en flessen" en een doelwit bij "de pijltjesknop" ([welkom](ontwerp-evaluatie/welkom.jpg), `body.html:37-39`). Voorstel: gebruik dezelfde iconen als in de toolbar (duikbril, sonar, pijltjes), zodat het welkom meteen uitlegt welke knop wat doet.
4. **Halflege pagina's in het logboek.** Elke familie begint op een nieuwe pagina, waardoor pagina's met 1–3 kaartjes en veel leeg papier ontstaan (pagina 11, 15, 19). Het boek heeft daardoor 26–29 pagina's ([momenten](ontwerp-evaluatie/logboek-momenten-lege-pagina.jpg)). Ook de rechterpagina van een dier is grotendeels leeg ([pelikaan](ontwerp-evaluatie/shiny-pelikaan.jpg)). Voorstel: families laten doorlopen met een kop ertussen, en op de dierpagina de foto groter maken of de veldnotitie en een 'waar gezien'-kaartje naar rechts verplaatsen.
5. **Niet-gevonden momenten zijn grijze blokken.** Niet-gevonden dieren krijgen een silhouet (goed), maar momenten zijn een egaal grijs vlak met een paar streepjes. Voorstel: een vaag silhouet of een potloodschets, zodat er ook hier iets te verlangen valt.
6. **Twee knopstijlen naast elkaar.** "Terug naar het logboek" heeft een dubbele focusrand in turquoise (de globale `:focus-visible` uit de donkere UI) op papier ([telefoon-detail](ontwerp-evaluatie/telefoon-detail.png)). Geef de focusrand op papier de potloodkleur.
7. **Het duikverslag is sterk.** Het idee (polaroids, Caveat-kop, shiny met gouden rand) werkt ([duikverslag](ontwerp-evaluatie/duikverslag.png)). Het is wel de enige 'glass'-kaart met een handschriftkop, wat de inconsistentie uit §2.1 juist zichtbaar maakt.

### 2.6 Beweging en sfeer

**Goed.** Het tempo is rustig, kwallen pulseren, lichtbundels bewegen traag en scholen zwermen geloofwaardig. Het bladeren door het boek is een mooi detail.

**Problemen.**
1. **Harde naad bij de afgrond.** `drawAbyss` (`09-moments-and-diver.js:556`) vult een rechthoek met alleen een verticaal verloop. Bij `c.x0` ontstaat daardoor een kaarsrechte verticale rand door de waterkolom, goed te zien in [ijszee](ontwerp-evaluatie/desktop-ijszee.jpg) (x≈470) en [sargasso](ontwerp-evaluatie/desktop-sargasso.jpg) (x≈910). Voorstel: ook horizontaal laten uitvloeien (een tweede verloop over ±60·u) of een masker.
2. **Lange fade-in bij de start.** De scène komt na het laden langzaam op. Dat is mooi, maar duurt lang genoeg dat het eerste beeld op een trage telefoon even 'zwart scherm' kan lijken. Dit is het controleren waard.
3. **De duiker is klein.** Op 1280 px breed is hij ongeveer 50 px lang. Hij is het enige personage waar je je mee identificeert; 20–30% groter, of een zachte lichtcirkel om hem heen, maakt hem tot het visuele anker.

### 2.7 Toegankelijkheid

Contrast berekend volgens WCAG:

| Combinatie | Contrast | AA (4,5:1) |
| --- | --- | --- |
| `--text-dim` op `--surface` | 7,0 | ✓ |
| `--text-faint` op `--surface` | 6,0 | ✓ |
| `--ink-soft` op papier | 5,0 | ✓ |
| niet-gevonden kaart `#8a7d62` op papier | 3,4 | ✗ |
| glinstermeter `#a8780a` op papier | 3,3 | ✗ |
| shiny-tab `#9a6f10` op papier | 3,8 | ✗ |
| statusregel wit op lagunezand | ≈1,4 | ✗ |
| "Vorige" uitgeschakeld (opacity .3) | n.v.t. | bewust gedimd, prima |

- **Kleurenblindheid.** Shiny wordt aangeduid met goud plus een ✦-teken en 'nieuw' met rood plus het woord "Nieuw". Dat is goed, want het hangt niet alleen van kleur af. De tabs van het logboek verschillen alleen in kleur, maar hebben ook een tekstlabel, dus dat is in orde.
- **Focus.** Er is een `:focus-visible` op knoppen en invoervelden, maar die is turquoise, ook op papier (zie §2.5.6).
- **Reduced motion.** De CSS-animaties zijn afgedekt, en het canvas loopt op halve snelheid zonder schudden of flitsen. De bubbels, gloed en het bladeren blijven doorlopen, en de toast schuift nog. Voorstel: bij reduced motion geen deeltjes die over het scherm drijven en geen schuivende overgangen (alleen fade).
- **Canvas-label.** `aria-label` op het canvas noemt vast een piratenschip en een schatkist, ook in een oceaan zonder piratenschip (`body.html:2`). `#sceneDesc` beschrijft de echte scène al, dus het vaste label kan algemener.

### 2.8 Responsief

- Er is geen horizontaal scrollen gevonden. Toolbar, logboek en menu passen op 390 px, en het logboek wordt op de telefoon één pagina met scrollende tabs en een vervagende rand ([telefoon-logboek](ontwerp-evaluatie/telefoon-logboek-en.jpg)). Dat is goed opgelost.
- **De oceaan zelf schaalt niet mee met staand beeld** (zie samenvatting). Dieren hebben een grootte in `u`, maar de compositie (bodemstrook, waar scholen zwemmen, hoe hoog planten worden) is gemaakt voor liggend beeld. Op de telefoon gebeurt alles in de onderste 25% ([telefoon-wadden](ontwerp-evaluatie/telefoon-wadden.jpg), [telefoon-kelpwoud](ontwerp-evaluatie/telefoon-kelpwoud.jpg)).
- Het label "Mangrove" valt op de telefoon over de bodemprops heen ([telefoon-mangrove](ontwerp-evaluatie/telefoon-mangrove.jpg)).
- Op de telefoon staan de statusregel en toolbar soms zichtbaar door het onderste deel van de logboekpagina heen ([telefoon-detail](ontwerp-evaluatie/telefoon-detail.png)). Dit is mogelijk een momentopname tijdens de schuifanimatie, en moet ik nog verifiëren voordat het een bug heet.

## 3. Voorstel voor een designsysteem

### 3.1 Kleurtokens

Alles in `:root` van `styles.css`. JS leest ze waar nodig met `getComputedStyle` of uit één kleine tabel `THEME` in `01-basis.js`.

```css
:root {
  /* water-UI (donker, glas) */
  --ui-bg:        #06182a;   /* was --deep */
  --ui-surface:   rgba(7, 24, 39, .92);
  --ui-raised:    rgba(16, 40, 60, .92);
  --ui-glass:     rgba(6, 22, 36, .58);
  --ui-text:      #eaf4f6;
  --ui-text-dim:  rgba(220, 236, 240, .70);
  --ui-line:      rgba(220, 236, 240, .14);
  --ui-line-strong: rgba(220, 236, 240, .28);
  --accent:       #7fd8c9;   /* zeegroen: actie, duiker, selectie */
  --accent-hover: #9ae4d8;
  --accent-ink:   #05221f;   /* tekst op accent */

  /* papier (logboek) */
  --paper:        #f3ead3;
  --paper-card:   #fffdf7;
  --tape:         rgba(236, 222, 178, .85);
  --ink:          #2d2a24;
  --ink-soft:     #6e624c;   /* 5,0:1 */
  --ink-faint:    #74684f;   /* nieuw, ≥ 4,5:1, voor niet-gevonden */
  --pencil:       #29507a;
  --cover:        #34463a;
  --cover-gold:   #6a5422;

  /* betekenis, één waarde per betekenis */
  --shiny:        #ffd479;   /* op donker */
  --shiny-ink:    #8a6206;   /* op papier, ≥ 4,5:1 */
  --new:          #b8322a;
  --ok:           #2f7a3a;

  /* tabs van het boek */
  --tab-intro: #e9dcb5; --tab-animals: #a9cfa6; --tab-moments: #e8bd86;
  --tab-rare: #cdb0dc;  --tab-waters: #9cc6dc;  --tab-photos: #e9aaa6; --tab-keep: #d4ccb6;
}
```

De waterkleuren blijven in `WATERS`, want dat is data. Wel met een regel: `bottom` is altijd minstens 4× donkerder (relatieve luminantie) dan `top`, zodat de diepte in elk water leesbaar blijft.

### 3.2 Typografische schaal

| Token | Font | Maat / regel | Gebruik |
| --- | --- | --- | --- |
| `--fs-xs` | Figtree 500 | 12 / 1.3 | tellers, badges (minimum) |
| `--fs-sm` | Figtree 400 | 13 / 1.5 | uitleg, chips, kaartjes |
| `--fs-md` | Figtree 400 | 15 / 1.55 | weetjes, lopende tekst |
| `--fs-lg` | Figtree 600 | 17 / 1.3 | paneelkoppen |
| `--fs-xl` | Figtree 600 | 22 / 1.2 | welkom, dierennaam (UI) |
| `--hand-sm` | Caveat 600 | 18 / 1.05 | kaartnamen, labels op papier (minimum) |
| `--hand-md` | Caveat 600 | 25 / 1.05 | familiekoppen |
| `--hand-lg` | Caveat 600 | 36–44 / 1 | paginatitels |
| `--mono` | DM Mono 400 | 12 / 1.3 | codes, tellers, 'DIEREN'-kicker |

Regellengte maximaal 64ch (staat al op `.sum`); doe hetzelfde voor `.nb-fact`.

### 3.3 Ruimte, vormen en schaduw

- Spacing in stappen van 4: `--sp-1: 4px` tot en met `--sp-8: 32px`, gebruikt als 4, 8, 12, 16, 24, 32. Binnen een sectie 8–12, tussen secties 24–32.
- Radius: `--r-sm: 6px` (chips op papier, foto's), `--r-md: 10px` (knoppen), `--r-lg: 14–18px` (panelen), `--r-pill: 999px`.
- Schaduw: één `--shadow-ui` voor donkere panelen en één `--shadow-paper` voor polaroids en kaartjes (de twee varianten die nu in `.nb .card`, `.nb .album button` en `.nb-photo` herhaald worden).
- Focus: `--focus: var(--accent)` in de donkere UI en `--focus: var(--pencil)` binnen `.nb`.

### 3.4 Stijlgids voor dierillustraties

Kort genoeg om bovenaan `00-animals.js` of in de skill `oceaan-nieuw-dier` te zetten.

1. **Vorm.** Vlakke vormen zonder contourlijn. Er zijn hooguit 3–5 vlakken per dier: basiskleur, één donkerdere rugtint, één lichtere buiktint, en markeringen. Strepen en vlekken mogen, maar dan als vlak en niet als `stroke`.
2. **Lijnen** alleen voor dunne onderdelen die geen vlak kunnen zijn (voelsprieten, tentakels, vinstralen, snorharen), met `lineWidth` van 1–1,5·u en in een donkere tint van de basiskleur, nooit zwart.
3. **Ogen.** Eén standaard: een donkere stip van ongeveer 7% van de lichaamslengte met een klein wit lichtpuntje linksboven. Grote witte ogen met pupil alleen voor dieren die bekendstaan om grote ogen (kogelvis, vampierinktvis, dieptezeedieren).
4. **Licht.** Het licht valt van boven: de rug is donkerder en de buik lichter. Geen slagschaduw onder zwemmende dieren; bodemdieren krijgen een zachte ovale schaduw.
5. **Perspectief.** Strikt van opzij, met de kop in de zwemrichting. Uitzonderingen zijn roggen, zeesterren en platvissen, die een iets schuin bovenaanzicht krijgen.
6. **Kleur.** Gebruik altijd `sh("#…")`. Kies de basiskleur zo dat hij tegen `mid` van zijn eigen water minstens 2:1 contrast heeft, anders verdwijnt het dier. Geen pure verzadigde kleuren behalve voor één accent (een vin of vlek).
7. **Schaal.** Grootte in de oceaan volgt de werkelijkheid (krill < vis < haai < walvis). Het logboekplaatje kadreert altijd hetzelfde: het dier vult ongeveer 60% van de breedte en het oog staat op ⅓ van boven. Vogels krijgen een strook lucht.
8. **Shiny.** Een `pal` voor élke kleur van de tekening, met een duidelijk andere tint en niet alleen een andere helderheid. De shiny moet op 92 px nog herkenbaar anders zijn. Daarnaast komt er een gedeeld effect (lichtrand of glans) uit `10-shiny.js`, zodat elk dier hetzelfde signaal krijgt.
9. **Controle.** Teken een nieuw dier altijd ook in een vergelijkingsblad met drie bestaande dieren uit dezelfde familie (zie fase 2: een `#stijlblad`-pagina).

## 4. Verbeterplan

Omvang: **S** = minder dan een uur, **M** = een middag, **L** = meerdere sessies.

### Fase 1: Snelle winst (uitgevoerd)

| # | Wat | Omvang | Bestanden | Stand |
| --- | --- | --- | --- | --- |
| 1.1 | Woorden niet meer midden in een woord breken: `overflow-wrap: break-word` met `hyphens: auto`, plus zachte afbreekstreepjes op de grenzen van samenstellingen (`breakable()`/`nmBreak()`), omdat niet elke browser een Nederlands afbreekwoordenboek heeft | S | `styles.css`, `01-basis.js`, `16-controls.js`, `18-notebook.js`, `19-quests.js` | ✓ "Kokosnoot-octopus", "Bidsprinkhaan-kreeft" |
| 1.2 | Tooltip van de laatste twee knoppen rechts uitlijnen | S | `styles.css` | ✓ |
| 1.3 | Statusregel op een glass-pilletje | S | `styles.css` | ✓ |
| 1.4 | Welkomsticonen gelijk aan de toolbar (duiker, schatkist, pijltjes) | S | `body.html` | ✓ |
| 1.5 | Contrast op papier naar AA: niet-gevonden kaart (`--ink-faint`, 4,6:1), glinstermeter, gift-ster en shiny-tab (`--shiny-ink`, 4,6:1) | S | `styles.css` | ✓ |
| 1.6 | Focusrand op papier in potloodblauw | S | `styles.css` | ✓ |
| 1.7 | Shinysticker op de hoek van de polaroid | S | `styles.css` | ✓ |
| 1.8 | Afgrond loopt zijwaarts uit, zonder naad (één keer per scène getekend en daarna hergebruikt) | S | `09-moments-and-diver.js` | ✓ |
| 1.9 | Canvas-label algemeen en tweetalig | S | `body.html`, `20-language-and-start.js` | ✓ |
| 1.10 | Kleuren in de CSS als tokens in `:root` (papier, inkt, potlood, kaft, shiny, nieuw, tabs); `BOOK_TABS` verwijst naar `--tab-…` | M | `styles.css`, `18-notebook.js` | ✓ (alleen de brons- en zilverkleur van de logboekknop zijn nog los) |

Zelftest OK en `zaden.json` is ongewijzigd: geen enkele oceaan ziet er anders uit. Na fase 1: [ijszee zonder naad](ontwerp-evaluatie/na-fase1-ijszee.jpg) en [lagune met de statusregel op een pilletje](ontwerp-evaluatie/na-fase1-lagune.jpg). De overige screenshots tonen de stand vóór fase 1.

### Fase 2: Middellang

| # | Wat | Omvang | Bestanden |
| --- | --- | --- | --- |
| 2.1 | Logboekpagina's vullen: families lopen door, de dierpagina gebruikt de rechterkant beter | M | `18-notebook.js`, `styles.css` |
| 2.2 | Silhouet of potloodschets voor niet-gevonden momenten en zeldzaamheden | M | `06-logbook-pictures.js`, `17-logbook-and-menu.js` |
| 2.3 | Typografische schaal en spacing-tokens doorvoeren; het menu krijgt duidelijke secties | M | `styles.css`, `17-logbook-and-menu.js` |
| 2.4 | Welkom, menu en duikverslag in dezelfde familie als het boek (Caveat-koppen, papieren accent) | M | `styles.css`, `body.html` |
| 2.5 | Shiny-effect dat elk dier deelt (lichtrand of glans) in de oceaan en in het plaatje | M | `10-shiny.js`, `06-logbook-pictures.js` |
| 2.6 | Een `#stijlblad`-pagina die alle logboekplaatjes in een raster toont, als controle voor de stijl en input voor de zelftest | M | `20-language-and-start.js`, `check.py` |
| 2.7 | Vaste kadrering van de logboekplaatjes (≈60% breedte, oog op ⅓) en vogels met lucht | M | `06-logbook-pictures.js`, `13-fauna-system.js` (`thumb`) |
| 2.8 | Reduced motion uitbreiden: geen drijvende deeltjes en alleen fade-overgangen | S | `15-frame.js`, `07-surface-and-light.js`, `styles.css` |
| 2.9 | De duiker 20–30% groter met een zachte lichtcirkel | S | `09-moments-and-diver.js` |

### Fase 3: Lange termijn

| # | Wat | Omvang | Bestanden |
| --- | --- | --- | --- |
| 3.1 | Compositie voor staand beeld: een hogere bodem, scholen en planten verdeeld over de hoogte en een iets grotere `u` op de telefoon. Let op: dit moet zonder dat seeds per scherm verschillen (de zelftest controleert dat al) | L | `02-scene.js`, `03-water-and-landmarks.js`, `15-frame.js` |
| 3.2 | Illustratieronde langs de stijlgids: ogen, contouren en detail gelijktrekken, te beginnen met de nieuwste golven (golf 6 en 7) | L | `04`, `05`, `11`, `12`, `13`, `14-wave6.js`, `14-wave7-wadden.js` |
| 3.3 | Water-identiteit: props per water herzien, met minder algemene props en meer eigen props. Dit verandert seeds, dus samen met een nieuw `zaden.json` | L | `01-basis.js` (`WATERS.props`), `zaden.json` |
| 3.4 | Nachtstand herzien: donkerder, maar met meer contrast in plaats van een waas | M | `07-surface-and-light.js`, `03-water-and-landmarks.js` |

### Stand van uitvoering (16 oktober 2026)

| # | stand |
| --- | --- |
| 2.1 | ✓ families lopen door (al eerder); de dierpagina vult nu de hele spread: links de foto en een rij verwanten, rechts weetje, veldnotitie, waar, wanneer en hoe vaak |
| 2.2 | ✓ niet-gevonden momenten en zeldzaamheden zijn silhouetten (stond al) |
| 2.4 | deels: welkom en duikverslag hebben papier en plakband; het menu heeft Caveat-koppen maar blijft donker glas |
| 2.5 | ✓ gouden lichtrand bij elke shiny (stond al) |
| 2.6 | ✓ `#stijlblad` bestaat en `check.py` maakt er een schermafbeelding van |
| 2.8 | ✓ reduced motion: geen bubbels of deeltjes, alleen fades in het boek (stond al) |
| 2.9 | ✓ duiker 66 in plaats van 58 u, met een zachte lichtcirkel |
| 3.1 | ✓ hogere bodem en verspreide scholen op staand scherm (stond al); nu ook ~12% grotere `u` op de telefoon |
| 3.3 | ✓ eigen vondsten voor Wadden (mosselbank) en Sargasso (drijfhout met eendenmosselen); duikerhelm, amforen, mijnen en auto minder in wateren waar ze niet horen; `zaden.json` opnieuw vastgelegd |
| 3.4 | ✓ de nacht vermenigvuldigt met nachtblauw in plaats van een grijze waas (stond al) |
| 2.3, 2.7, 3.2 | nog open |

## 5. Vragen aan jou

Voordat ik fase 1 uitvoer, wil ik graag weten:

1. **Is het notitieboek de 'echte' stijl van Oceaan?** Ik ga ervan uit dat het donkere glass-menu functioneel is en het boek het hart. Klopt dat, dan trekken punt 2.4 en de tokens de rest naar het boek toe.
2. **Moet de diepzee bewust zo donker zijn?** Ik heb aangenomen dat dat de bedoeling is (de lamp van de duiker maakt het spannend) en stel daar niets aan voor.
3. **Mogen bestaande seeds veranderen** voor fase 3.3 (props per water)? Fase 1 en 2 laten ze ongemoeid.

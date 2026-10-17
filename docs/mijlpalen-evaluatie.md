# Mijlpalen en beloningen: overzicht en voorstellen

Stand van 17 oktober 2026, na de nieuwe beloningen, het bewaren van mijlpalen, de Wadloper en de Spookjager. De mijlpalen staan in `MILESTONES` in `src/01-basis.js`, de kopjes in `MILESTONE_GROUPS`.

## 1. Overzicht

Er zijn **39 mijlpalen**, onder vijf kopjes. 38 tellen mee voor het gouden logboek; de Spookjager niet, omdat je die alleen in de Spookweek kunt halen. Het logboek telt 184 vondsten: 10 wateren, 139 dieren, 23 momenten en 12 zeldzame dingen. Daarnaast zijn er 161 shiny's.

Een gehaalde mijlpaal blijft gehaald. Hij staat opgeslagen in `oceaan-mijlpalen` en gaat mee in het reservebestand. Komen er in een update dieren bij, dan stijgt het doel, maar je houdt je beloning.

### Vondsten (9)

| id | Naam | Doel | Beloning |
| --- | --- | --- | --- |
| m10 | Ontdekker | 10 vondsten | elke 75 s een nieuwe oceaan (was 150 s) |
| m25 | Zeekenner | 25 vondsten | elke 30 s |
| m50 | Oceanograaf | 50 vondsten | elke 15 s |
| m75 | Duikmeester | 75 vondsten | elke 7,5 s |
| m90 | Zeeheld | 90 vondsten | gouden randjes in het logboek, elke 5 s (het id was `m100`) |
| m110 | Rifwachter | 110 vondsten | 5 nieuwe dieren per oceaan in plaats van 4 |
| m130 | Diepzeeverkenner | 130 vondsten | een speurlijst met 5 plekken in plaats van 3 |
| m150 | Levende encyclopedie | 150 vondsten | elke nieuwe oceaan meldt hoeveel nieuwe dieren er te vinden zijn |
| mall | Meester van de zee | alles (184) | elke seconde een nieuwe oceaan |

### Shiny's (9)

| id | Naam | Doel | Beloning |
| --- | --- | --- | --- |
| s1 | Eerste shiny | 1 | belletje als er een shiny in beeld komt |
| s5 | Glinsterzoeker | 5 | shiny's die je nog mist, zie je vaag in hun kleuren in het logboek |
| s15 | Shinyjager | 15 | shiny's laten een glinsterspoor achter |
| s30 | Shinyverzamelaar | 30 | sterretjes achter je duiker |
| s50 | Glanskenner | 50 | de glinstermeter loopt door tot 4× |
| s75 | Glinsterspeurder | 75 | het belletje klinkt al als er ergens in de oceaan een shiny zwemt |
| s100 | Glimmeester | 100 | de glinstermeter loopt door tot 5× |
| s125 | Glansduiker | 125 | elke nieuwe oceaan meldt of er een shiny zwemt die je nog mist |
| sall | Glimmende legende | alle 161 | shiny's komen in je eigen oceanen 6× zo vaak |

### Hulp bij het zoeken (5)

De hulpmiddelen komen halverwege, zodat je er nog iets mee kunt vinden.

| id | Naam | Doel | Beloning |
| --- | --- | --- | --- |
| gw | Wereldreiziger | alle 10 wateren | zelf het water kiezen (R ingedrukt houden) |
| ga | Bioloog | 70 van de 139 dieren | wetenschappelijke naam en veldnotitie bij elk dier |
| gv | Gastvrij | 16 van de 32 bezoekers | knop om een bezoeker te roepen (B) |
| gm | Oog voor het moment | 12 van de 23 momenten | knop om een moment op te roepen (M) |
| gr | Mythejager | 6 van de 12 zeldzame dingen | pijl die naar iets zeldzaams wijst |

### Wateren (10), elk met een sticker

| id | Naam | Dieren in dat water |
| --- | --- | --- |
| wl | Lagunekenner | 48 |
| wm | Wortelkruiper | 38 |
| wr | Rifkenner | 58 |
| ws | Wierzwerver | 28 |
| wd | Wadloper | 15 |
| nz | Noordzeekenner | 37 |
| wk | Kelpkenner | 32 |
| wi | Poolreiziger | 30 |
| wg | Grotduiker | 23 |
| dz | Diepzeeduiker | 29 |

### Bijzonder (6)

| id | Naam | Doel | Beloning |
| --- | --- | --- | --- |
| ph | Fotograaf | 5 foto's in je album | fotofilters |
| rd | Redder | 5 dieren uit een spooknet bevrijd | sticker, en een bedankrondje om de duiker |
| vh | Volhouder | 7 opdrachten van de dag | sticker |
| fj | Fotojager | het hele fotoboek (8 foto-opdrachten) | sticker |
| sk | Sterrenkijker | vallende sterren, maansverduistering en noorderlicht | sticker |
| sj | Spookjager | een spook gevonden in de Spookweek (24 oktober tot 2 november) | spoken komen in je eigen oceanen vaker langs, het hele jaar |

## 2. Wat goed werkt

- **De wachttijd als motor.** De eerste vijf mijlpalen maken een nieuwe oceaan steeds sneller beschikbaar: 150 → 75 → 30 → 15 → 7,5 → 5 s. Dat voel je meteen, en het beloont precies wat het spel wil: blijven zoeken.
- **Beloningen die je ziet.** Het belletje, het glinsterspoor, de sterretjes en het gouden pak veranderen het spel zelf, niet alleen een getal.
- **Melding met uitleg.** Bij een nieuwe mijlpaal zegt de melding meteen wat je krijgt ("Je krijgt een knop om een bezoeker te roepen").
- **Een mix van soorten doelen.** Er zijn naast verzamelen ook mijlpalen voor redden, fotograferen en dagopdrachten. Zo is er ook iets te doen voor wie niet alles wil vinden.

## 3. Problemen en voorstellen

De punten 3.1 tot en met 3.6 en de Spookweek-mijlpaal uit 3.8 zijn uitgevoerd; het overzicht hierboven laat de huidige stand zien. De rest staat er als achtergrond.

### Hoog

**3.1 Beloningen kunnen weer verdwijnen.** `applyRewards()` rekent bij elke start uit welke mijlpalen je *nu* haalt (`rewards = new Set(reached())`). Er wordt niets bewaard. Komt er in een update een dier bij, dan zakt "139 van 139" naar "139 van 140". De speler verliest dan zonder melding:

- als Bioloog de veldnotities en wetenschappelijke namen;
- als Gastvrij of Oog voor het moment de B- en M-knop;
- de sticker van het water waar het dier leeft;
- de vijfvoudige shinykans van Glimmende legende (bij een nieuwe shiny);
- de gouden logboekknop.

Dat is bij de Waddenzee al eens gebeurd; daarom bestaat `GLOBE_KEY`, een losse reparatie alleen voor Wereldreiziger. Elke nieuwe ronde dieren raakt juist de spelers die het verst zijn.

*Voorstel:* bewaar verdiende mijlpalen in een eigen sleutel (bijvoorbeeld `oceaan-mijlpalen`) en neem die mee in het reservebestand (`PROGRESS_KEYS` in `16-controls.js`). Eenmaal verdiend is verdiend. De voortgang mag wel meegroeien ("139/142, 3 nieuw"), zodat er weer iets te zoeken is, maar de beloning blijft. `GLOBE_KEY` kan dan weg. Bij de eerste start na de update worden de mijlpalen die je op dat moment haalt meteen vastgelegd, zodat niemand iets kwijtraakt.

**3.2 De Waddenzee heeft geen mijlpaal.** Alle andere negen wateren hebben er een, met een sticker. De Waddenzee kwam later (`FIRST_WATERS = 9`) en is overgeslagen.

*Voorstel:* een mijlpaal **Wadloper** ("alle 15 dieren van de Waddenzee") met een eigen sticker, bijvoorbeeld een zandplaat met een wadpierhoopje en een zeehond op de achtergrond.

**3.3 Op een telefoon zie je niet wat je krijgt.** In de lijst van mijlpalen staat bij een beloning alleen een ★. Wat je krijgt, staat in een `title`, en die zie je alleen als je met een muis over de ster beweegt. Op een telefoon of tablet zie je het dus nooit, tot je de mijlpaal haalt.

*Voorstel:* zet de beloning in een klein regeltje onder de naam ("→ een knop om een bezoeker te roepen"), of laat een tik op de regel een kaartje met doel en beloning openen.

### Middel

**3.4 De lijst van mijlpalen is één lange rij van 34.** De volgorde springt heen en weer: Fotograaf en Redder staan tussen Mythejager en de wateren. Je moet ver scrollen om te zien wat er nog openstaat.

*Voorstel:* dezelfde kopjes als in het overzicht hierboven (Vondsten, Shiny's, Een hele groep, Wateren, Bijzonder), met per kopje een teller ("Wateren 3/10"). Zet de wateren in de logboekvolgorde: lagune, mangrove, rif, Sargassozee, Waddenzee, Noordzee, kelpwoud, IJszee, grot, diepzee.

**3.5 De hulpmiddelen komen pas als je ze niet meer nodig hebt.** De bezoekersknop krijg je pas als je alle bezoekers hebt, de momentknop pas na alle momenten, de pijl pas na alle zeldzame dingen. De veldnotities krijg je pas als je elk dier al gezien hebt. Daarna helpen ze alleen nog bij shiny's zoeken.

*Voorstel:* splits elk in twee stappen.

| Mijlpaal | Halverwege: het hulpmiddel | Alles: een sticker |
| --- | --- | --- |
| Gastvrij | B-knop bij 16 bezoekers | sticker |
| Oog voor het moment | M-knop bij 12 momenten | sticker |
| Mythejager | pijl bij 6 zeldzame dingen | sticker |
| Bioloog | veldnotities per familie, zodra je die familie compleet hebt (sluit mooi aan op de nieuwe groepen) | sticker |

Dit maakt het spel iets makkelijker. Dat is een keuze voor jou.

**3.6 Gaten en lege stappen.** Bij de shiny's zit een groot gat: van 50 naar alle 161. (Gedaan: de vijf mijlpalen zonder beloning hebben er nu een die helpt bij het zoeken, zie het overzicht hierboven. Het gouden duikpak is vervangen door een vijf keer zo grote shinykans. De zelftest eist dat elke mijlpaal een beloning heeft.)

*Voorstel:*
- extra shinystappen bij 75, 100 en 125;
- Een shinybeloning die echt helpt, bijvoorbeeld bij 100: in het logboek zien in welk water een ontbrekende shiny te vinden is.

### Laag

**3.7 Twee keer goud.** Zeeheld (90) geeft "gouden randjes", en alle mijlpalen samen geven een gouden logboekknop. Wie de randjes al heeft, merkt het verschil met het grote einddoel nauwelijks.

*Voorstel:* maak het einddoel anders, bijvoorbeeld een gouden kaft met de titel "Meester van de zee" op de voorkant van het logboek.

**3.8 Mijlpalen voor wat er al in het spel zit.** De speurlijst, het aquarium, het delen en de kalender-events hebben geen mijlpaal. Ideeën:
- **Speurneus**: 3 dingen van je speurlijst gevonden.
- **Aquariumbouwer**: een eigen aquarium gemaakt en gedeeld.
- **Eventstickers**: bijvoorbeeld een spooksticker als je tijdens de Spookweek een spook vindt.

De Spookweek begint op 24 oktober. Laat eventstickers niet meetellen voor het goud: een sticker die je een jaar moet missen, voelt anders als straf.

**3.9 De Fotojager hangt aan geluk.** Voor het fotoboek moet je de Leviathan op de foto krijgen. Die komt alleen in de diepzee en de Sargassozee, en ook daar zelden. Vaak is dat de laatste opdracht.

*Voorstel:* zet bij die foto-opdracht in welke wateren je moet zoeken, of laat de Mythejager-pijl (zie 3.5) eerder helpen.

**3.10 Kleine dingen.**
- Het id `m100` hoort bij 90 vondsten. Hernoem het naar `m90` voordat 3.1 de ids gaat bewaren; daarna kan dat niet meer.
- Volhouder telt dagen, niet dagen op rij. Dat is vriendelijk; een tweede stap bij 30 opdrachten zou een langer doel geven.
- Rifkenner vraagt 58 dieren en Grotduiker 23. Het rif is daardoor veel zwaarder dan de rest. Dat mag, maar dan past de rif-sticker beter later in de lijst.

## 4. Stand

Gedaan op 17 oktober 2026:

1. **3.1** Mijlpalen worden bewaard (`oceaan-mijlpalen`, ook in het reservebestand); `m100` heet nu `m90`, en oude opgeslagen waarden worden omgezet.
2. **3.2** De Wadloper, met een eigen sticker.
3. **3.3 en 3.4** In de lijst staat onder elke mijlpaal wat hij geeft, en de mijlpalen staan onder vijf kopjes met een teller.
4. **3.5** De hulpmiddelen komen halverwege.
5. **3.6** Extra shinystappen bij 75, 100 en 125, en elke mijlpaal heeft een beloning (de zelftest eist dat).
6. **3.8** De Spookjager voor de Spookweek.

Nog open: 3.7 (twee keer goud), de rest van 3.8 (speurlijst en aquarium), 3.9 (de Fotojager) en 3.10.

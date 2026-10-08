# Oceaan

Een levende onderwaterwereld die elke keer anders is, in negen wateren van koraalrif en lagune tot Sargassozee, mangrove en onderwatergrot: scholen vissen, kwallen, krabben, een octopus, walvissen, orka's en haaien, gezonken piratenschepen, auto's en amforen, schatkisten, Atlantis en heel zeldzaam de Kraken, een spookschip, een zeemeermin, een zeeslang, een megalodon, de witte potvis of een spookduiker. Met dag en nacht, seizoenen, onweer, een duiker, een logboek met plaatjes, shiny dieren en een fotoalbum. In het Nederlands en het Engels.

Speel online op **https://ronaldsteenkamp.github.io/oceaan/**. Op je telefoon kun je hem als app op je beginscherm zetten; daarna werkt hij ook zonder internet.

## Bediening

- De pijltjesknop onderaan (of R) geeft een nieuwe oceaan. In het begin kan dat elke tien minuten; elke mijlpaal van vondsten maakt dat korter, tot tien seconden.
- Roep de duiker met D; hij verschijnt bij je cursor. Alles wat in het licht van zijn lamp komt, gaat in je logboek. De dieren reageren alleen op de duiker.
- Houd ingedrukt om de vissen te voeren.
- Tik op een schatkist, een fles, een reuzenschelp of een verstopt zeepaardje. Tik op de zoekopdracht bovenin voor uitleg.
- Het boekje onderaan is je logboek. Onder "Maken en delen" bouw je je eigen aquarium en deel je je oceaan.
- Met de duiker zoek je met de sonarknop (of Q) naar iets zeldzaams: een gouden echo wijst de richting.
- Met een toetsenbord: pijltjes sturen de duiker, E roept de duiker en opent wat hij aanraakt, Q stuurt een sonarpuls uit, L opent het logboek, F maakt een foto, G zet het geluid aan of uit, R geeft een nieuwe oceaan.

## Hoe het in elkaar zit

De bron staat in `src/`:

| Bestand | Inhoud |
| --- | --- |
| `head.html`, `styles.css`, `body.html` | titel, stijl en opmaak van de bediening |
| `01-basis.js` | wateren, namen, logboek, mijlpalen, meldingen |
| `02-scene.js` | het opbouwen van een oceaan uit een seed |
| `03` tot en met `10` | water, bodem, dieren, bezoekers, geluid, licht en shiny's |
| `11-expansion.js` | mangrove, grot, nieuwe vondsten, dieren, bezoekers, momenten en zeldzame dingen |
| `11-x2-lagoon-and-sargasso.js` | lagune, Sargassozee en de derde ronde nieuwe dingen |
| `12-frame.js` | de animatielus, snelheid en automatische kwaliteit |
| `13-controls.js` | aanraken, duiker, foto en knoppen |
| `14-logbook-and-menu.js` | logboek, detailkaarten, album en "Maken en delen" |
| `15-language-and-start.js` | taal, zelftest en opstarten |

## Bijwerken

```
python build.py
```

Dit voegt `src/` samen tot `../oceaan.html` (de versie die ook als claude.ai-artifact wordt gepubliceerd), draait de zelftest in een onzichtbare Chrome, maakt schermafbeeldingen in `checks/` en schrijft daarna de app (`index.html`, `sw.js`, manifest en iconen). Vindt de zelftest een fout, dan wordt er niets gebouwd. Het versienummer gaat elke keer omhoog, zodat geïnstalleerde apps de nieuwe versie ophalen en een melding tonen.

Alleen controleren kan ook: `python check.py`.

## Credits

Gemaakt door Ronald.

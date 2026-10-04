# Oceaan

Een levende onderwaterwereld die elke keer anders is: scholen vissen, kwallen, krabben, een octopus, walvissen en haaien, gezonken piratenschepen, schatkisten, Atlantis en heel zeldzaam de Kraken, een spookschip of een zeemeermin. Met dag en nacht, seizoenen, onweer, een duiker, een logboek met plaatjes, shiny dieren en een fotoalbum. In het Nederlands en het Engels.

Speel online op **https://ronaldsteenkamp.github.io/oceaan/**. Op je telefoon kun je hem als app op je beginscherm zetten; daarna werkt hij ook zonder internet.

## Bediening

- Tik op het water voor een nieuwe oceaan.
- Sleep om de dieren te laten schrikken, houd ingedrukt om de vissen te voeren.
- Tik op een schatkist, een fles of een verstopt zeepaardje. Tik op de zoekopdracht bovenin voor uitleg.
- Het boekje onderaan is je logboek. Onder "Maken en delen" bouw je je eigen aquarium en deel je je oceaan.
- Met een toetsenbord: pijltjes sturen de duiker, E opent wat hij aanraakt, de spatiebalk geeft een nieuwe oceaan.

## Hoe het in elkaar zit

De bron staat in `src/`:

| Bestand | Inhoud |
| --- | --- |
| `head.html`, `styles.css`, `body.html` | titel, stijl en opmaak van de bediening |
| `01-basis.js` | wateren, namen, logboek, mijlpalen, meldingen |
| `02-scene.js` | het opbouwen van een oceaan uit een seed |
| `03` tot en met `10` | water, bodem, dieren, bezoekers, geluid, licht en shiny's |
| `11-frame.js` | de animatielus, snelheid en automatische kwaliteit |
| `12-controls.js` | aanraken, duiker, foto en knoppen |
| `13-logbook-and-menu.js` | logboek, detailkaarten, album en "Maken en delen" |
| `14-language-and-start.js` | taal, zelftest en opstarten |

## Bijwerken

```
python build.py
```

Dit voegt `src/` samen tot `../oceaan.html` (de versie die ook als claude.ai-artifact wordt gepubliceerd), draait de zelftest in een onzichtbare Chrome, maakt schermafbeeldingen in `checks/` en schrijft daarna de app (`index.html`, `sw.js`, manifest en iconen). Vindt de zelftest een fout, dan wordt er niets gebouwd. Het versienummer gaat elke keer omhoog, zodat geïnstalleerde apps de nieuwe versie ophalen en een melding tonen.

Alleen controleren kan ook: `python check.py`.

## Credits

Gemaakt door Ronald.

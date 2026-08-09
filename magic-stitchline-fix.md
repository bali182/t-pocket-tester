A következő feladat: Egy olyan függvényt összerakni, ami rendreteszi a varrásoknak megfelelően a komponensek méreteit, és a sarokkal nem rendelkező stitchline-ok offseteit.
A fő célunk ezzel:

- Minden öltés (stitch hole középpont) közt sarkoknál is azonos legyen a távolság
- Amikor egy varrás áthalad komponensen/zseben az elem szélére merőlegesen, a stitchhole közepe stitchHoleDistance / 2 távolságra legyen az elem széltől. Ezzel azt biztosítva, hogy a lyukasztás nem szakítja át az elemek szélét, így a varrás összefogja az elemeket ahelyett hogy gyengítené azokat.

Megkötések:

- Csak ComponentBoundsStitchLineSchema-kkal foglalkozunk (cluster zseb alján levő varrással nem foglalkozunk)
- Csak ComponentSchema-n levő varrásokkal foglalkozunk (hole-ok most nem érdekelnek minket)
- Mindig próbáljunk az eredeti, user által megadott mérethez a lehető legközelebb maradni.
- Fill layoutokat nem szabad megbontani. ilyenkor gap-el vagy szülő mérettel kell megoldani a problémát, de erről később részletesen.
- Ha egy komponensen 2 fajta varrás van két különböző konfigurációval (StitchLineCommonConfigSchema), ezzel nem foglalkozunk. Két konfiguráció akkor különböző, ha a stitchMargin vagy a stitchHoleDistance különböző, a többi kozmetikai beállítás, ezek lehetnek különbözőek.
  - Ebben az esetben a komponenst ki kell hagyni, és `incompatible-stitch-configurations` problémát kell visszaadni.

Szabályok:

1. Panelek (PanelSchema és RootPanelSchema):

- Különálló akár lekerekített akár sima sarkokkal nem foglalkozunk.
- Fill oldalhosszakat nem szabad direktben módosítani. ebben az esetben ami állítható:
  - Az esetlegesen több elemű parentben levő gap
  - Az első nem fill méretű szülő panel (vagy root panel) szélessége / hosszúsága.
  - Ha a fill komponens igényelt módosítása közös gap- vagy szülőméret-változtatáson keresztül más komponens kényszerével ütközik, csak az ugyanahhoz a közös változóhoz kötött konfliktusos komponenseket kell kihagyni. A független faágak tovább módosíthatók.
  - A kihagyott komponensekre `conflicting-layout-constraints` problémát kell visszaadni.
  - Egy komponens azonos tengelyű szabad endpointjait együtt kell feloldani a közös mérettel. Ha az összes megengedett offset- és méretjelölttel sincs közös geometriai megoldás, a komponens `conflicting-stitch-geometry` problémát kap.
  - Main-axis fill gyerekeknél a feloldás a valódi layout-egyenletet használja: `parentSize - (childCount - 1) * layoutGap - fixedChildSizes = autoChildCount * requiredAutoChildSize`. A parent saját varrásigénye és a gyerekek igényei ugyanennek az egyenletrendszernek a részei; a `layoutGap >= 0` marad.
- Oldal szakaszok
  - Az invariánsok oldalanként minden szabad (cornerhez nem kötött) kezdő- vagy végpontra vonatkoznak; nem feltétel, hogy az egész oldal sarok nélküli legyen.
    - Minden esetben a szakasz végpontja egybeesen az utolsó stitchHole pontjával (ha kell itt epszilon használható, ha nem bízunk a matek tizedes pontosságában). Ez különálló szakaszoknál egyszerű hossz-matek, sarkokkal rendelkezőknél bonyolultabb.
    - A panel szélén NEM túllógó szakasz végpontokra (nem stitchhole, szakasz végpont) a célunk, hogy a panel szélétől legalább Math.min(stitchHoleDistance / 2, stitchMargin) távolságra legyen a első és utolsó stitchHole.
    - Amennyiben ez nem valósul meg:
      - Mindig a sértő végpontot kell mozgatni. Ha pl a szakasz kezdő pontja stitchMargin vagy stitchHoleDistance / 2 távolságnál nagyobb távolságra van a széltől, akkor ezt békén kell hagyni és a végpontot kell igzaítani. Ugyanígy ha a kezdőpont sérti a szabályt, akkor először ezt kell helyretenni, majd végpontot ellenőrizni és esetlegesen igazítani.
      - A kezdőpontnál ezt az offsett-el kell javítani, mivel ez pontosan meghatározza az első lyuk helyét.
      - A végpontnál pedig a panel szélességét vagy hosszúságát kell úgy módosítani hogy az invariáns igaz legyen, (Math.min(stitchHoleDistance / 2, stitchMargin) távolságra legyünk legalább a véponthoz közelebb eső panel széltől), ÉS a szakasz hossza osztható legyen a stitchHoleDistance-al.
    - A panel szélén TÚLLÓGÓ szakasz végpontoknál a cél, hogy az utolsó, a panel bounding-boxán belül levő stitch hole pontosan Math.min(stitchHoleDistance / 2) távolságra legyen a panel szélétől.
      - Ezt a panel adott irányú szélesség/hosszúságának az állításával szabályottuk.
      - A szakasz kezdő és végpontja továbbra is essen egybe az első/utolsó stitch hole középpontjával.
  - Invariáns corner-el összekötött oldalakra
    - Lekerekített corner-eknél, ahol megjelenik a varráson a rádiusz
      - 4 összekötött sarok és oldal esetén úgy kell kiszámolni a komponens méreteit, hogy kezdő és befejező varrás pontjai közt `0.000001 mm` toleranciával stitchHoleDistance legyen a távolság. A jelöltek közül a legkisebb `|Δwidth| + |Δheight|` értékű marad; döntetlennél a nagyobb méretjelölt.
      - 2 vagy 3 sarok esetén a szabad oldalak invariánsainak kell megvalósulnia.
      - Továbbra is a cél, hogy a kezdő és a végpontja a szakasznak pontosan egy stitchHole-ra essen
      - Ha a szakasz kezdő és végpontjai beljebb vannak panel szélétől mint minimum a Math.min(stitchHoleDistance / 2, stitchMargin) távolság, akkor ezeket a távolságokat a széltől tartsuk meg amennyiben lehetséges.
      - Amennyiben túllógnak, akkor Mindkét oldalnál KÖTELEZŐ, hogy az oldalon belül és az oldalon kívül eső stitch hole is pontosan stitchHoleDistance / 2 távolságra legyen a panel szélétől.
    - Nem lekerekített sakroknál
      - 4 összekötött sarok és oldal esetén mindkét oldalnak (2 _ stitchMargin) + (n _ stitchHoleDistance) hosszúságúnak kell lennie úgy, hogy az eredeti mérethez legközelebb maradjon a komponens mérete.
      - 2 vagy 3 sarok esetén itt is a szabad oldalak invariánsainak kell megvalósulnia.

2. PocketClusterSchema

   - A panelekre érvényes invariánsok itt is 100%-ban érvényesek.
   - Amennyiben van varrás a zsebek nyílására merőlegesen, akár összkötött sarkokkal akár nem:
     - pocketStep - ez a stitchHoleDistance többszöröse legyen, úgy hogy nem lehet 0 az értéke. Az aktuális értékhez legközelebbi többszörst kell választani.
     - Egy t-zseb fülén átmenő első és/vagy utolsó öltésnek pontosan stitchHoleDistance / 2 távolságra kell lennie a fül szélétől. Ez azért jöhet ki, mert a pocketstep-et stitchHoleDistance többszörösére állítottuk.
     - A front pocket úgy viselkedik mint egy panel - szélén áthaladó és nem áthaladó varrások tekintetében itt is élnek a korábban megadott megszorítások.
       - A pocket cluster mindkét külső mérete ugyanúgy módosítható, mint a paneleké. A `pocketStep` nem használható a front pocket méretének módosítására, és a `pocketCount`-hoz nem nyúlhatunk.
       - Ha az ehhez szükséges méretmódosítás fill layout-konfliktust okoz, a pocket clustert ki kell hagyni, és `conflicting-layout-constraints` problémát kell visszaadni.
   - Ha a `pocketStep` minimum `1 * stitchHoleDistance` értéke a pocket count és a rendelkezésre álló cluster-méret mellett nem fér el, a pocket clustert ki kell hagyni, `console.log`-ot kell írni, és `pocket-step-does-not-fit` problémát kell visszaadni.

Implementáció: 
  - A logika ide kerül: src/logic/magic-stitch-line-fix/performMagicStitchLineFix.ts
  - Segédfüggvények kerülhetnek a mappába a fő függvény mellé
  - Felhasználhatóak egyéb függvények a logic-ból
  - A teljes fa méretezését egyetlen előre összeállított módosítási tervvel kell megoldani; újraszámolásos iteráció nem használható.
  - A `performMagicStitchLineFix` a módosított `SubProjectSchema` mellett problémalistát is visszaad.
    - A lista minden eleme egy `componentId`-t és egy okot tartalmaz.
    - Az okok string unionje: `incompatible-stitch-configurations`, `conflicting-layout-constraints`, `conflicting-stitch-geometry`, `pocket-step-does-not-fit`.
    - A problémák UI-os megjelenítése későbbi feladat.
  - A UI-on itt kerül felhasználásra: src/components/EditorMenu.tsx.

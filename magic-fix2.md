# Magic fix – új iteratív koncepció

## Cél

A magic fix célja, hogy a `getComputedSubProject` által kiszámolt, varráshoz tartozó stitchhole-ok megfeleljenek a varrási geometriai szabályoknak.

Nem saját, közelítő stitchhole-geometriát tart fenn. Minden próbálkozásból a meglévő production computed-model számítás hozza létre a valós route-okat és hole-okat; a magic fix ezeket validálja, majd ezek alapján módosítja a következő inputot.

A korábbi, egyszeri statikus constraint-feloldó megközelítés helyett ez egy workerben futó, effort-korlátos iteráció.

## Meglévő modellek

- [MagicFixConfigSchema](src/schemas/magicFixConfig.ts): mit és milyen tartományban módosíthat a magic fix.
- [MagicFixChangeRequest](src/schemas/magicFixChangeRequest.ts): az input modellen végrehajtható elemi módosítások.
- [MagicFixValidationIssueSchema](src/schemas/magicFixIssues.ts): a computed modellben talált konkrét geometriai problémák.
- [SubProjectSchema](src/schemas/subProject.ts): a javítandó modell.
- [ComputedSubProjectSchema](src/schemas/subProject.ts): a valódi layout-, route- és stitchhole-számítás eredménye.
- [getComputedSubProject](src/logic/getComputedProject.ts): a production computed-modell számítás.

## Konfiguráció

A `MagicFixConfigSchema` rögzíti a magic fix szabadsági fokait. A user komponens- és stitchline-szinten adja meg, mit módosíthat a magic fix; ezek nem az algoritmusban vannak hardkódolva.

A későbbi default- és UI-réteg kényelmi konfigurációt adhat, de az algoritmus kizárólag a kapott configból dolgozik.

### Globális mezők

- `effort`: a worker futásához engedett iterációs keret. A konkrét maximális iterációszámot később ebből képezzük.
- `accuracy`: mm-ben megadott elfogadott eltérés. Egy pontos célértéket csak akkor tekintünk sértettnek, ha az abszolút eltérés nagyobb ennél.
- `componentConfigs`: komponensenkénti szabadsági fokok és fizikai él-távolsági preferenciák.
- `stitchLineConfigs`: stitchline-onkénti szabadsági fokok.

A configból származó numerikus tartományok mindig az eredeti, user által megadott értékhez viszonyulnak:

- `maxDecrease`: legfeljebb ennyivel lehet kisebb az érték az eredetinél.
- `maxIncrease`: legfeljebb ennyivel lehet nagyobb az érték az eredetinél.

A `0` az adott irány tiltását jelenti. Ez megakadályozza, hogy a gördülő iteráció a korábbi módosításokra korlátlan további módosításokat halmozzon.

### Komponens-konfiguráció

A RootPanel, Panel és PocketCluster configjai meghatározhatják többek között:

- fix `width` és `height` értékének módosítási tartományát;
- `layoutGap` módosítási tartományát ott, ahol a komponensnek van layoutja;
- `borderRadius`, illetve a négy egyedi sarokrádiusz módosítási tartományát;
- PocketClusternél a `pocketStep` módosítási tartományát;
- hogy auto szélesség vagy magasság átváltható-e fix értékre;
- hogy közös rádiuszból átváltható-e egyedi rádiuszokra;
- a komponens saját fizikai széleihez tartozó `preferredMinimumDistanceFromEdge` értéket.

A `preferredMinimumDistanceFromEdge` komponenshez tartozik, mert a szabály fizikai anyaghatárra vonatkozik:

- Panel vagy RootPanel saját széle esetén a panel vagy root configja érvényes.
- PocketCluster front pocket széle esetén a PocketCluster configja érvényes.
- T-pocket fülek széleinél szintén az őket tartalmazó PocketCluster configja érvényes.

A default később lehet például a projekt stitchhole-távolságának fele, de az érték itt abszolút mm-ben megadható. Ez lehetővé teszi, hogy a user kisebb elfogadott minimumot adjon meg olyan geometriákhoz, ahol a `stitchHoleDistance / 2` nem kívánatos vagy nem reális.

### Stitchline-konfiguráció

A ComponentBounds stitchline esetén külön-külön szabályozható:

- a négy oldal start- és end-offsetjének módosítási tartománya;
- az egyes oldalak stitch irányának megfordíthatósága.

PocketCluster stitchline esetén szabályozható:

- `startOffset` és `endOffset` módosítási tartománya;
- a stitch irány megfordíthatósága.

A túllógó nyitott endpoint is módosítható, ha a hozzá tartozó offsettartomány ezt engedi. Sarokhoz kötött endpoint esetén a heurisztika csak akkor módosíthat offsetet, ha annak a konkrét stitchline-mezőnek a configja ezt engedi; a request-applier nem dönt erről.

## Change requestek

A `MagicFixChangeRequest` egy elemi inputmódosítás. A heurisztika egy iterációhoz több requestet is előállíthat; ezek együtt alkotják az adott iteráció atomi módosítását.

A jelenlegi requestek:

- komponens `width` vagy `height` beállítása;
- komponens `layoutGap` beállítása;
- közös vagy egyedi komponensrádiusz beállítása;
- PocketCluster `pocketStep` beállítása;
- ComponentBounds stitchline offsetjének beállítása;
- ComponentBounds stitchline vízszintes vagy függőleges irányának beállítása;
- PocketCluster stitchline offsetjének beállítása;
- PocketCluster stitchline irányának beállítása.

A requestek szándékosan csak azt mondják meg, mit kell beállítani. Nem tartalmaznak config-ellenőrzést és nem magyarázzák, miért szükségesek.

A heurisztika felelőssége, hogy csak olyan requestet adjon ki:

- amelyhez a megfelelő config engedélyt ad;
- amely az eredeti userértékhez viszonyított numerikus tartományon belül marad;
- amely értelmes az aktuális komponensállapotban.

A request-applier felelőssége, hogy a request szemantikáját atomikusan alkalmazza:

- `width` vagy `height` beállításakor az adott `autoWidth` vagy `autoHeight` kikapcsol;
- egyedi sarokrádiusz beállításakor az `individualRadii` bekapcsol, majd a kért egyedi mező beáll;
- közös `borderRadius` beállítása nem konvertál vissza közös rádiusz módba;
- az applier az aktuális input subprojectből készít új subprojectet, nem computed modellből.

Az auto méretre, illetve közös rádiuszra való visszakonvertálás nem magic fix feladat. Ezek user kényelmi funkciók, nem a feloldás szabadsági fokai.

## Validációs szabályok

A validátor csak a tényleges `ComputedSubProjectSchema` route- és hole-geometriáját értékeli. Nem ad change requestet és nem javasol javítást; kizárólag azt állapítja meg, mi hibás.

A validáció a következő öt issue-t állíthatja elő.

### 1. Éles sarok hole-távolsága

`sharp-corner-stitch-hole-distance`

Akkor keletkezik, amikor egy összefüggő route éles, 90 fokos sarkán:

- a sarok előtti utolsó hole;
- és a sarok utáni első hole

közti euklideszi távolság nem egyezik a route `stitchHoleDistance` értékével az `accuracy` tűrésén belül.

A szabály csak ugyanazon összefüggő route-on értelmezhető. Két külön, nem összekötött stitchline-szakasz között nincs ilyen kötelezettség.

Az issue a route-ra, a sarokra, a két hole indexére, valamint az elvárt és tényleges távolság eltérésére referál.

### 2. Zárt route záró hole-távolsága

`closed-route-stitch-hole-distance`

Akkor keletkezik, amikor egy zárt, nem éles route első és utolsó hole-ja közötti euklideszi távolság nem egyezik a route `stitchHoleDistance` értékével az `accuracy` tűrésén belül.

### 3. Nyitott route végpontján hiányzó hole

`route-endpoint-missing-stitch-hole`

Akkor keletkezik, amikor egy nyitott route utolsó hole-ja az `accuracy` értéknél távolabb van a route geometriai végpontjától.

A route elején nincs külön megfelelője ennek a szabálynak: nem üres route esetén a generátor első hole-ja a route kezdőpontja. Ez az issue ezért csak a route végpontjára vonatkozik.

### 4. Nem túllógó endpoint minimális él-távolsága

`endpoint-minimum-edge-distance`

Akkor keletkezik, amikor egy nem túllógó route-endpointnál levő hole túl közel kerül az érintett fizikai komponens- vagy zsebhatárhoz.

A szabály teljesül, ha:

```text
actualDistance >= preferredMinimumDistanceFromEdge - accuracy
```

A `preferredMinimumDistanceFromEdge` a boundary tulajdonosának komponens-configjából jön.

### 5. Fizikai él keresztezése körüli minimum él-távolság

`edge-crossing-minimum-stitch-hole-distance`

Akkor keletkezik, amikor egy route fizikailag keresztez egy komponens- vagy zsebhatárt, és a keresztezés egyik oldalán:

- nincs a keresztezéshez tartozó szomszédos hole; vagy
- a szomszédos hole a saját oldalon túl közel van a boundaryhoz.

A szabály mindkét oldalra külön érvényes:

```text
actualDistance >= preferredMinimumDistanceFromEdge - accuracy
```

A user a komponens configjában adja meg a preferált minimumot. A szabály PocketCluster belső T-pocket határainál is érvényes: a validátor nem csak a front pocket külső határait vizsgálja.

## Pontosság

Az `accuracy` minden távolsági szabálynál ugyanazt jelenti:

- pontos célérték esetén: az abszolút eltérés lehet legfeljebb `accuracy`;
- minimumtávolság esetén: a tényleges távolság lehet legfeljebb `accuracy`-val kisebb a preferált minimumnál;
- route endpointnál: az utolsó hole endpointtól vett távolsága lehet legfeljebb `accuracy`.

A user által adott mm-es tolerancia határozza meg, mi tekinthető megfelelő eredménynek.

## Workerben futó orchestráció

A magic fix nem a UI szálán fut. A worker feladata az iteráció teljes vezérlése.

### Worker bemenete

A worker megkapja:

- a `ProjectSchema`-t;
- a javítandó subproject azonosítóját;
- a `MagicFixConfigSchema`-t;

A worker a projektből választja ki a javítandó subprojectet és a stitching settingset. Az `effort` értékből maga képezi a maximális iterációszámot; az `effort` → iterációszám leképezés későbbi döntés.

### Gördülő állapot

A worker két különböző inputállapotot kezel:

- `originalSubProject`: a user eredeti terve. Nem módosítjuk.
- `currentSubProject`: az éppen vizsgált változat. Ez gördül tovább iterációról iterációra.

A config numerikus korlátait minden esetben az `originalSubProject` megfelelő eredeti értékeihez mérjük, nem a `currentSubProject` már módosított értékeihez.

### Inicializáló számítás

1. `currentSubProject = originalSubProject`.
2. A worker kiszámítja a valódi `ComputedSubProjectSchema`-t a meglévő production logikával.
3. A validátor lefut a computed modellen és a configon.
4. A validátor visszaadja az aktuális `MagicFixValidationIssueSchema[]` listát.

Ha a lista üres, az eredeti modell már megfelelő, a worker azonnal sikerrel visszatér.

### Iteráció

Amíg van validation issue és maradt iteráció:

1. A heurisztika megkapja:
   - az eredeti subprojectet;
   - az aktuális `currentSubProject`-et;
   - az aktuális computed subprojectet;
   - az aktuális validation issue-listát;
   - a configot.

2. A heurisztika előállít egy atomi `MagicFixChangeRequest[]` listát a következő próbálkozáshoz.

3. A request-applier a teljes requestlistát alkalmazza a `currentSubProject`-re, és előállítja a következő input `SubProjectSchema`-t.

4. A worker ebből az új inputból ismét lefuttatja a valódi computed-modell számítást.

5. A validátor ugyanazokkal a szabályokkal újra ellenőrzi az új computed modellt.

6. Ha maradt issue, az új input lesz az új `currentSubProject`, és a következő iteráció ezzel indul.

A heurisztika tehát nem stitchhole-okat helyez közvetlenül át. Csak inputmezőket módosíthat requesteken keresztül. A hole-ok minden körben kizárólag a meglévő calculated outputból származnak.

### A heurisztika helye

A konkrét heurisztika még nincs definiálva. Ez szándékosan külön felelősségi kör.

A heurisztika bemenete a valós computed eredmény és annak konkrét validációs problémái. Kimenete egyetlen következő iterációhoz tartozó requestcsomag vagy az, hogy az aktuális állapothoz nem tud szabályos következő requestet adni.

A heurisztika később cserélhető anélkül, hogy megváltozna:

- a config jelentése;
- a requestek jelentése;
- a request-applier;
- a production computed számítás;
- a validátor;
- a worker iterációs életciklusa.

### Kilépési feltételek

A worker három módon állhat meg.

1. **Siker**

   A validátor issue-listája üres. A visszaadott `currentSubProject` megfelelő.

2. **Heurisztikai kimerülés**

   A validátor még talál problémákat, de a heurisztika az aktuális problémákból nem tud a configon belüli, szabályos következő requestcsomagot képezni.

   Ez nem azt állítja, hogy a geometria matematikailag megoldhatatlan. Csak azt, hogy az adott heurisztika nem tud tovább lépni.

3. **Effort-kimerülés**

   A validátor még talál problémákat, de elfogyott az effortból képzett maximális iterációszám.

Az első verzióban nincs cycle detection, state hash vagy általános „iteráció közben bizonyítottan megoldhatatlan” felismerés. A futást az effort határolja. Később a heurisztika javítható, és a worker elé külön szanitizáló réteg kerülhet.

> Nyitott kérdés: a worker siker-, heurisztikai kimerülés- és effort-kimerülés esetén visszaadott eredményének, hibakezelésének és UI-kommunikációjának szerződése később definiálandó.

## Szerepkörök

| Rész | Felelősség |
|---|---|
| Config | Meghatározza a módosítható mezőket, az eredeti értékhez viszonyított tartományokat, a pontosságot és a fizikai él-minimumokat |
| Computed-model számítás | Előállítja a tényleges layoutot, route-okat és stitchhole-okat |
| Validátor | A computed modellen az öt geometriai szabály alapján issue-listát készít |
| Heurisztika | Az aktuális issue-listából legális következő requestcsomagot képez, vagy jelzi, hogy nem tud lépni |
| Request-applier | Az atomi requestcsomagot a current inputra alkalmazza, beleértve a requestekhez tartozó konverziós szemantikát |
| Worker orchestrátor | Inicializál, ismétel, számoltat, validál, figyeli az iteration limitet, progresszt és végállapotot ad |
| UI / hook | Elindítja a workert, megjeleníti a futást, majd átveszi az eredményt; nem végez geometriaszámítást |

## Szándékosan még hiányzó rész

Jelenleg nincs szanitizáló réteg.

Később ez a worker futása előtt felismerhet olyan konfigurációkat, amelyek user hibának tekinthetők vagy várhatóan nem érdemes velük iterálni — például ugyanazon komponensen inkompatibilis stitchhole-távolságú, egymással versengő stitchline-konfigurációk.

Ez nem része az első iteratív workernek. Addig a worker a validátor aktuális issue-listájából dolgozik, és sikerrel, heurisztikai kimerüléssel vagy effort-kimerüléssel áll meg.

Ami most innen kimaradt: src/logic/magic-fix-2/issue-detection/getEndpointMinimumEdgeDistanceIssues.test.ts

Fordított traversal
Component-bounds top stitchline topStitchDirection: 'right-to-left'. A valódi computed route hole-sorrendje alapján a bal oldali logikai endpointot kell vizsgálni.

Boundary-keresztezés
Source topStartOffset vagy topEndOffset beállítással a route ténylegesen kilép a root/panel boundary-ján. A computed route-on a 4. szabály nem ad issue-t; ez az 5. szabályé.

Front-pocket boundary
Valódi source hole-t kell a front pocket belsejébe tenni, és arra component-bounds stitchline-t tenni. Így a route, a stitch hole-ok és a front-pocket containment is a computed pipeline-ból jön.

T-pocket boundary
Valódi PocketClusterSchema + pocket-cluster-stitch-line szükséges. A source stitchMargin, startOffset, endOffset, pocket méretek és a config minimum együtt állítja elő azt a route-ot, amely a tényleges T-pocket pathon belül marad, és a T-pocket saját fragmentjéhez túl közel ér.

Sarokba futás, két fragment
Ehhez előbb ki kell deríteni, hogy a jelenlegi source stitchline-generátor képes-e olyan computed endpointot előállítani, amelynek végirányú sugara egy physical boundary sarokpontját találja el. Ha igen, abból írjuk meg a tesztet. Ha nem, akkor a jelenlegi source modellből ez az issue-eset nem keletkezhet, és nem szabad hamis computed fixture-rel „tesztelni”.

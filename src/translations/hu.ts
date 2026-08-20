export const HU = {
  common: {
    actions: {
      add: 'Hozzáadás',
      cancel: 'Mégse',
      next: 'Tovább',
      apply: 'Alkalmaz',
      remove: 'Törlés',
      clone: 'Duplikálás',
      flipHorizontal: 'Vízszintes tükrözés',
      flipVertical: 'Függőleges tükrözés',
      settings: 'Beállítások',
      addByName: (name: string) => `${name} hozzáadása`,
    },
    labels: {
      general: 'Általános',
      name: 'Név',
      component: 'Komponens',
      color: 'Szín',
      size: 'Méret',
      width: 'Szélesség',
      height: 'Magasság',
      direction: 'Irány',
      type: 'Típus',
      amount: 'Mennyiség',
      spacing: 'Köz',
      measure: 'Mérték',
    },
    placeholders: {
      fill: 'Kitöltés',
      selectComponent: 'Komponens kiválasztása',
    },
    directions: {
      top: 'Felső oldal',
      right: 'Jobb oldal',
      bottom: 'Alsó oldal',
      left: 'Bal oldal',
      topLeft: 'Bal felső sarok',
      topRight: 'Jobb felső sarok',
      bottomLeft: 'Bal alsó sarok',
      bottomRight: 'Jobb alsó sarok',
    },
  },
  editor: {
    menus: {
      file: {
        name: 'Fájl',
        export: {
          name: 'Projekt exportálása',
          svg: 'SVG Exportálás',
          pdf: 'PDF Exportálás',
        },
      },
      edit: {
        name: 'Szerkesztés',
        step: {
          name: 'Lépésköz',
          tiny: 'Apró',
          small: 'Kicsi',
          default: 'Alapértelmezett',
          stitch: `Öltés`,
          size: (size: number) => `${size}mm`,
        },
      },
      view: {
        name: 'Nézet',
        scaling: 'Skálázás',
      },
    },
    scalingDialog: {
      title: 'Skálázás',
      description:
        'Tegyél egy vonalzót a képernyőhöz, és a csúszkával állítsd be, hogy a képen látható vonalzó 10cm hosszúságú legyen. Így a grafikák méretarányosan fognak megjelenni.',
    },
    panels: {
      components: 'Elemek',
      stitching: 'Varrás',
    },
  },
  exportSettings: {
    sections: {
      layout: 'Elrendezés',
      content: 'Tartalom',
    },
    labels: {
      gap: 'Térköz',
      padding: 'Belső margó',
      stitchLineMode: 'Varróvonalak',
      showNames: 'Nevek megjelenítése',
      showDimensions: 'Méretek megjelenítése',
      childMarkers: 'Gyermekjelölők megjelenítése',
      cutHelperDistance: 'Vágási segédtávolság',
    },
    stitchLineModes: {
      ownStitchLines: 'Csak a saját varróvonalak',
      allStitchLines: 'Összes varróvonal',
    },
  },
  svgExport: {
    frontPocketName: (ownerName: string) => `${ownerName} - első zseb`,
    tPocketName: (ownerName: string, index: number) => `${ownerName} - ${index}. zseb`,
    dimensions: (width: string, height: string) => `${width}mm × ${height}mm`,
    dialog: {
      title: 'SVG exportálása',
      actions: {
        export: 'Exportálás',
      },
    },
  },
  pdfExport: {
    dialog: {
      title: 'PDF exportálása',
      actions: {
        export: 'Exportálás',
      },
      sections: {
        page: 'Oldal',
      },
      labels: {
        page: 'Papírméret',
        orientation: 'Tájolás',
        layout: 'Elrendezés',
      },
      orientations: {
        portrait: 'Álló',
        landscape: 'Fekvő',
      },
      layouts: {
        vertical: 'Függőleges',
        horizontal: 'Vízszintes',
        compact: 'Tömör',
      },
      errors: {
        exportFailed: 'A PDF exportálása nem sikerült.',
        unplaceablePanels: 'Egy vagy több panel nem fér el a kiválasztott oldalra.',
      },
    },
  },
  magicFix: {
    menu: 'Javítás varázsló',
    dialog: {
      title: 'Javítás varázsló',
      steps: {
        settings: 'Beállítások',
        fixing: 'Javítás',
        review: 'Kiértékelés',
      },
      progress: {
        message: 'Dolgozunk a javításon…',
        completed: 'Elkészült',
      },
      actions: {
        back: 'Vissza',
        addNewModule: 'Új modul létrehozása',
        overwriteModule: 'Modul felülírása',
      },
      review: {
        success: 'A javítás sikeresen elkészült.',
        error: 'A javítás sikertelen volt.',
        noResult: 'A javítás nem tudott eredményt létrehozni.',
      },
      settings: {
        noSelectionTitle: 'Válassz egy elemet!',
        noSelectionDescription:
          'Részletes komponens szintű beállítások megjelenítéséhez válassz egy elemet a bal oldai fából!',
        tabs: {
          basic: 'Alapbeállítások',
          advanced: 'Részletes beállítások',
        },
        basic: {
          sections: {
            accuracyAndEffort: 'Pontosság és ráfordítás',
            sharedLimits: 'Közös korlátok',
          },
          labels: {
            accuracy: 'Pontosság',
            effort: 'Ráfordítás',
            preferredMinimumDistanceFromEdge: 'Öltés távolság széltől',
            modifyRange: 'Módosítási tartomány',
          },
          efforts: {
            low: 'Alacsony',
            medium: 'Közepes',
            high: 'Magas',
          },
        },
        advanced: {
          sections: {
            distance: 'Távolság a széltől',
            layoutGap: 'Elrendezési térköz',
            dimensions: 'Méretek',
            autoDimensions: 'Automatikus méretek',
            cornerRadius: 'Sarokkerekítés',
            pocketStep: 'Zseblépték',
            offset: 'Eltolás',
            flip: 'Tükrözés',
          },
          labels: {
            preferredMinimumDistanceFromEdge: 'Előnyben részesített minimum',
            layoutGap: 'Térköz',
            canConvertToFixedHeight: 'Fix magasság engedélyezése',
            canConvertToFixedWidth: 'Fix szélesség engedélyezése',
            canConvertToIndividualRadii: 'Egyedi sarkok engedélyezése',
            borderRadius: 'Minden sarok',
            pocketStep: 'Lépték',
            topStart: 'Felső eleje',
            topEnd: 'Felső vége',
            rightStart: 'Jobb eleje',
            rightEnd: 'Jobb vége',
            bottomStart: 'Alsó eleje',
            bottomEnd: 'Alsó vége',
            leftStart: 'Bal eleje',
            leftEnd: 'Bal vége',
            start: 'Eleje',
            end: 'Vége',
            canFlipStitchDirection: 'Tükrözés engedélyezése',
          },
        },
      },
    },
  },
  projects: {
    title: 'Projektek',
    actions: {
      create: 'Új projekt',
    },
    createDialog: {
      title: 'Új projekt létrehozása',
      actions: {
        create: 'Létrehozás',
      },
    },
    settingsDialog: {
      title: 'Projekt beállításai',
      components: {
        title: 'Komponensek',
        baseColor: 'Alapszín',
      },
      tabs: {
        basic: 'Alapbeállítások',
        stitching: 'Varrás',
      },
    },
    notFound: {
      title: 'A projekt nem található',
      description: 'A megnyitni kívánt projekt nem létezik.',
    },
  },
  component: {
    types: {
      rootPanel: 'Fő panel',
      panel: 'Panel',
      pocketCluster: 'Zsebek',
    },
    editor: {
      missing: {
        title: 'Hiba',
        description: 'Ehhez a komponenshez még nincs szerkesztő!',
      },
      actions: {
        addChild: 'Elem hozzáadása',
      },
      layout: {
        title: 'Elrendezés',
        orientation: 'Tájolás',
        horizontal: 'Vízszintes',
        vertical: 'Függőleges',
        order: 'Irány',
        defaultOrder: 'Alapértelmezett',
        reverseOrder: 'Fordított',
        gap: 'Térköz',
      },
      cornerRadius: {
        title: 'Lekerekítés',
        type: 'Típus',
        individual: 'Egyedi lekerekítés',
        uniform: 'Egységes lekerekítés',
        individualMeasure: 'Mérték',
        uniformMeasure: 'Mérték',
      },
      pocketCluster: {
        title: 'Zsebek',
        card: 'Kártya',
        noCard: 'Nincs',
        opening: 'Nyílás',
        fromTop: 'Felülről',
        fromBottom: 'Alulról',
        fromLeft: 'Balról',
        fromRight: 'Jobbról',
      },
      tPocket: {
        title: 'T-zsebek',
        flapWidth: 'Fül szélesség',
        taper: 'Szűkülés',
      },
    },
  },
  hole: {
    title: 'Lyuk',
    editor: {
      position: {
        title: 'Pozíció',
        xAnchor: 'Vízszintes igazítás',
        yAnchor: 'Függőleges igazítás',
        xOffset: 'X eltolás',
        yOffset: 'Y eltolás',
        left: 'Bal',
        center: 'Közép',
        right: 'Jobb',
        top: 'Fent',
        bottom: 'Lent',
      },
      size: {
        radius: 'Sugár',
      },
    },
  },
  stitchLine: {
    types: {
      componentBounds: 'Körvonal varrás',
      pocketCluster: 'Zseb-alj varrás',
    },
    add: {
      title: 'Varrás hozzáadása',
      type: 'Varrás típusa',
      typePlaceholder: 'Varrás típusának kiválasztása',
    },
    tree: {
      empty: {
        title: 'Nincs még varrás',
        description: 'Adj hozzá varrást a fa menüjéből vagy a szerkesztőből!',
      },
    },
    editor: {
      seamLine: {
        title: 'Varratvonal',
      },
      sidesAndCorners: {
        topDirection: 'Felső varrat iránya',
        rightDirection: 'Jobb varrat iránya',
        bottomDirection: 'Alsó varrat iránya',
        leftDirection: 'Bal varrat iránya',
      },
      offsets: {
        bottomEnd: 'Alsó oldal végpontjának eltolása',
        bottomStart: 'Alsó oldal kezdőpontjának eltolása',
        leftEnd: 'Bal oldal végpontjának eltolása',
        leftStart: 'Bal oldal kezdőpontjának eltolása',
        rightEnd: 'Jobb oldal végpontjának eltolása',
        rightStart: 'Jobb oldal kezdőpontjának eltolása',
        topEnd: 'Felső oldal végpontjának eltolása',
        topStart: 'Felső oldal kezdőpontjának eltolása',
      },
      pocketStitch: {
        title: 'Zsebvarrás',
        enabled: 'Engedélyezve',
        startOffset: 'Kezdő eltolás',
        endOffset: 'Vég eltolás',
      },
      stitching: {
        title: 'Varrás',
        holeColor: 'Lyuk színe',
        lineColor: 'Vonal színe',
        margin: 'Margó',
        holeLength: 'Lyuk hossza',
        holeDistance: 'Lyuktávolság',
        holeThickness: 'Lyuk vastagsága',
        lineThickness: 'Vonal vastagsága',
        reset: 'Projektérték használata',
      },
    },
  },
  validation: {
    multipleIssues: (count: number) => `${count} hiba`,
    name: {
      empty: 'A név nem lehet üres.',
      duplicate: 'Ez a név már foglalt.',
    },
    number: {
      invalidFormat: 'Érvénytelen számformátum.',
      integerOnly: 'Csak egész érték adható meg.',
      minimumExclusive: (value: string) => `Az értéknek a minimum felett kell lennie (${value}).`,
      minimumInclusive: (value: string) => `Minimum érték: ${value}.`,
      maximumExclusive: (value: string) => `Az értéknek a maximum alatt kell lennie (${value}).`,
      maximumInclusive: (value: string) => `Maximum érték: ${value}.`,
      step: (value: string) => `Lépték: ${value}.`,
    },
    primitive: {
      required: 'Kötelező érték.',
      invalid: 'Érvénytelen érték.',
    },
    hexColor: {
      invalid: 'Érvénytelen hex szín.',
    },
  },
  defaults: {
    projectName: 'Új projekt',
    rootComponentName: 'Modul',
    stitchLineName: (number: number) => `Varrás ${number}`,
  },
}

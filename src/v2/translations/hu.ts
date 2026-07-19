export const HU = {
  navigation: {
    home: 'Kezdőlap',
  },
  common: {
    actions: {
      add: 'Hozzáadás',
      addStitchLine: 'Új varrás',
      remove: 'Törlés',
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
      selectComponent: 'Komponens kiválasztása',
    },
    accessibility: {
      selectColor: 'Szín kiválasztása',
      componentTree: {
        moveUp: 'Elem mozgatása fel',
        moveDown: 'Elem mozgatása le',
        add: 'Elem hozzáadása',
        remove: 'Elem törlése',
      },
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
    panels: {
      leather: 'Bőr',
      stitching: 'Varrás',
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
        individual: 'Egyedi lekerekítések',
        uniform: 'Egységes lekerekítés',
        individualMeasure: 'Mérték',
        uniformMeasure: 'Mérték',
      },
      pocketCluster: {
        title: 'Zsebek',
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
  stitchLine: {
    add: {
      title: 'Varrás hozzáadása',
      type: 'Varrás típusa',
      typePlaceholder: 'Varrás típusának kiválasztása',
      types: {
        componentBounds: 'Komponens határvonala',
        pocketCluster: 'T-zsebek aljának varrása',
      },
    },
    tree: {
      empty: {
        title: 'Nincs még varrás',
        description: 'Adj hozzá egy varrást az általad kiválasztott komponenshez!',
      },
      accessibility: {
        deleteNamed: '{name} törlése',
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
        enableAccessibility: 'Zsebvarrás engedélyezése',
        startOffset: 'Kezdő eltolás',
        endOffset: 'Vég eltolás',
        directionAccessibility: 'Zsebvarrás iránya',
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
      },
    },
  },
  validation: {
    name: {
      empty: 'A név nem lehet üres.',
      duplicate: 'Ez a név már foglalt.',
    },
    number: {
      invalidFormat: 'Érvénytelen számformátum.',
      integerOnly: 'Csak egész érték adható meg.',
      minimumExclusive: 'Az értéknek a minimum felett kell lennie ({value}).',
      minimumInclusive: 'Minimum érték: {value}.',
      maximumExclusive: 'Az értéknek a maximum alatt kell lennie ({value}).',
      maximumInclusive: 'Maximum érték: {value}.',
      step: 'Lépték: {value}.',
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
    rootComponentName: 'Alap',
    stitchLineName: 'Varrás {number}',
  },
} as const

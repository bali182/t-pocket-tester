export const HU = {
  navigation: {
    home: 'Kezdőlap',
    project: 'Projekt',
  },
  common: {
    actions: {
      add: 'Hozzáadás',
      addStitchLine: 'Új varrás',
      cancel: 'Mégse',
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
    },
    componentActions: {
      add: (name: string) => `${name} hozzáadása`,
      moveUp: 'Elem mozgatása fel',
      moveDown: 'Elem mozgatása le',
      remove: 'Elem törlése',
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
        description: 'Adj hozzá egy varrást az általad kiválasztott komponenshez!',
      },
      accessibility: {
        deleteNamed: (name: string) => `${name} törlése`,
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
    rootComponentName: 'Alap',
    stitchLineName: (number: number) => `Varrás ${number}`,
  },
}

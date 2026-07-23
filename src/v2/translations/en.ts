import type { HU } from './hu'

export const EN: typeof HU = {
  navigation: {
    home: 'Home',
    project: 'Project',
  },
  common: {
    actions: {
      add: 'Add',
      addStitchLine: 'Add stitch line',
      cancel: 'Cancel',
      remove: 'Delete',
      reorder: 'Reorder',
      finishReorder: 'Finish reordering',
    },
    labels: {
      general: 'General',
      name: 'Name',
      component: 'Component',
      color: 'Color',
      size: 'Size',
      width: 'Width',
      height: 'Height',
      direction: 'Direction',
      type: 'Type',
      amount: 'Amount',
      spacing: 'Spacing',
      measure: 'Measurement',
    },
    placeholders: {
      selectComponent: 'Select a component',
    },
    accessibility: {
      selectColor: 'Select color',
    },
    componentActions: {
      clone: 'Clone item',
      moveUp: 'Move item up',
      moveDown: 'Move item down',
      add: (name: string) => `Add ${name.toLowerCase()}`,
      remove: 'Delete item',
    },
    directions: {
      top: 'Top edge',
      right: 'Right edge',
      bottom: 'Bottom edge',
      left: 'Left edge',
      topLeft: 'Top-left corner',
      topRight: 'Top-right corner',
      bottomLeft: 'Bottom-left corner',
      bottomRight: 'Bottom-right corner',
    },
  },
  editor: {
    panels: {
      leather: 'Leather',
      stitching: 'Stitching',
    },
  },
  projects: {
    title: 'Projects',
    actions: {
      create: 'New project',
    },
    createDialog: {
      title: 'Create new project',
      actions: {
        create: 'Create',
      },
    },
    notFound: {
      title: 'Project not found',
      description: 'The project you want to open does not exist.',
    },
  },
  component: {
    types: {
      rootPanel: 'Root panel',
      panel: 'Panel',
      pocketCluster: 'Pocket cluster',
    },
    editor: {
      missing: {
        title: 'Error',
        description: 'There is no editor for this component yet.',
      },
      actions: {
        addChild: 'Add item',
      },
      layout: {
        title: 'Layout',
        orientation: 'Orientation',
        horizontal: 'Horizontal',
        vertical: 'Vertical',
        order: 'Order',
        defaultOrder: 'Default',
        reverseOrder: 'Reverse',
        gap: 'Gap',
      },
      cornerRadius: {
        title: 'Corner radius',
        type: 'Type',
        individual: 'Individual corner radii',
        uniform: 'Uniform corner radius',
        individualMeasure: 'Measurement',
        uniformMeasure: 'Measurement',
      },
      pocketCluster: {
        title: 'Pockets',
        opening: 'Opening',
        fromTop: 'From the top',
        fromBottom: 'From the bottom',
        fromLeft: 'From the left',
        fromRight: 'From the right',
      },
      tPocket: {
        title: 'T-pockets',
        flapWidth: 'Tab width',
        taper: 'Taper',
      },
    },
  },
  stitchLine: {
    types: {
      componentBounds: 'Outline stitching',
      pocketCluster: 'Pocket-bottom stitching',
    },
    add: {
      title: 'Add stitch line',
      type: 'Stitch line type',
      typePlaceholder: 'Select a stitch line type',
    },
    tree: {
      empty: {
        title: 'No stitch lines yet',
        description: 'Add a stitch line to the selected component.',
      },
      accessibility: {
        deleteNamed: (name: string) => `Delete ${name}`,
      },
    },
    editor: {
      seamLine: {
        title: 'Seam line',
      },
      sidesAndCorners: {
        topDirection: 'Top seam direction',
        rightDirection: 'Right seam direction',
        bottomDirection: 'Bottom seam direction',
        leftDirection: 'Left seam direction',
      },
      offsets: {
        bottomEnd: 'Bottom edge end offset',
        bottomStart: 'Bottom edge start offset',
        leftEnd: 'Left edge end offset',
        leftStart: 'Left edge start offset',
        rightEnd: 'Right edge end offset',
        rightStart: 'Right edge start offset',
        topEnd: 'Top edge end offset',
        topStart: 'Top edge start offset',
      },
      pocketStitch: {
        title: 'Pocket stitch',
        enabled: 'Enabled',
        enableAccessibility: 'Enable pocket stitch',
        startOffset: 'Start offset',
        endOffset: 'End offset',
        directionAccessibility: 'Pocket stitch direction',
      },
      stitching: {
        title: 'Stitching',
        holeColor: 'Hole color',
        lineColor: 'Thread color',
        margin: 'Margin',
        holeLength: 'Hole length',
        holeDistance: 'Hole spacing',
        holeThickness: 'Hole thickness',
        lineThickness: 'Thread thickness',
        reset: 'Use project value',
      },
    },
  },
  validation: {
    name: {
      empty: 'Name cannot be empty.',
      duplicate: 'This name is already in use.',
    },
    number: {
      invalidFormat: 'Invalid number format.',
      integerOnly: 'Only whole numbers are allowed.',
      minimumExclusive: (value: string) => `Value must be greater than ${value}.`,
      minimumInclusive: (value: string) => `Minimum value: ${value}.`,
      maximumExclusive: (value: string) => `Value must be less than ${value}.`,
      maximumInclusive: (value: string) => `Maximum value: ${value}.`,
      step: (value: string) => `Step: ${value}.`,
    },
    primitive: {
      required: 'This value is required.',
      invalid: 'Invalid value.',
    },
    hexColor: {
      invalid: 'Invalid hexadecimal color.',
    },
  },
  defaults: {
    projectName: 'New project',
    rootComponentName: 'Base',
    stitchLineName: (number: number) => `Stitch line ${number}`,
  },
}

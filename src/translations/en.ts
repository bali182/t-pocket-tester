import type { HU } from './hu'

export const EN: typeof HU = {
  common: {
    actions: {
      add: 'Add',
      cancel: 'Cancel',
      next: 'Next',
      remove: 'Delete',
      apply: 'Apply',
      clone: 'Clone',
      flipHorizontal: 'Flip horizontal',
      flipVertical: 'Flip vertical',
      settings: 'Settings',
      addByName: (name: string) => `Add ${name.toLowerCase()}`,
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
      fill: 'Fill',
      selectComponent: 'Select a component',
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
    menus: {
      file: {
        name: 'File',
        export: {
          name: 'Export project',
          svg: 'Export SVG',
          pdf: 'Export PDF',
        },
      },
      edit: {
        name: 'Edit',
        step: {
          name: 'Step',
          tiny: 'Tiny',
          small: 'Small',
          default: 'Default',
          stitch: 'Stitch-size',
          size: (size: number) => `${size} mm`,
        },
      },
      view: {
        name: 'View',
        scaling: 'Scaling',
      },
    },
    scalingDialog: {
      title: 'Scaling',
      description:
        'Hold a ruler up to your screen and use the slider to make the ruler shown on screen 10 cm long. This will make the graphics appear at the correct scale.',
    },
    panels: {
      components: 'Components',
      stitching: 'Stitching',
    },
  },
  exportSettings: {
    sections: {
      layout: 'Layout',
      content: 'Content',
    },
    labels: {
      gap: 'Gap',
      padding: 'Padding',
      stitchLineMode: 'Stitch lines',
      showNames: 'Show names',
      showDimensions: 'Show dimensions',
      childMarkers: 'Show child markers',
      cutHelperDistance: 'Cut helper distance',
    },
    stitchLineModes: {
      ownStitchLines: 'Own stitch lines only',
      allStitchLines: 'All stitch lines',
    },
  },
  svgExport: {
    frontPocketName: (ownerName: string) => `${ownerName} - front pocket`,
    tPocketName: (ownerName: string, index: number) => `${ownerName} - ${index}. pocket`,
    dimensions: (width: string, height: string) => `${width}mm × ${height}mm`,
    dialog: {
      title: 'Export SVG',
      actions: {
        export: 'Export',
      },
    },
  },
  pdfExport: {
    dialog: {
      title: 'Export PDF',
      actions: {
        export: 'Export',
      },
      sections: {
        page: 'Page',
      },
      labels: {
        page: 'Paper size',
        orientation: 'Orientation',
        layout: 'Layout',
      },
      orientations: {
        portrait: 'Portrait',
        landscape: 'Landscape',
      },
      layouts: {
        vertical: 'Vertical',
        horizontal: 'Horizontal',
        compact: 'Compact',
      },
      errors: {
        exportFailed: 'The PDF export failed.',
        unplaceablePanels: 'One or more panels do not fit on the selected page.',
      },
    },
  },
  magicFix: {
    menu: 'Magic fix',
    dialog: {
      title: 'Magic fix',
      steps: {
        settings: 'Settings',
        fixing: 'Fixing',
        review: 'Review',
      },
      progress: {
        message: 'Working on the fix…',
        completed: 'Complete',
      },
      actions: {
        back: 'Back',
        addNewModule: 'Add new module',
        overwriteModule: 'Overwrite module',
      },
      review: {
        success: 'The magic fix completed successfully.',
        error: 'The magic fix failed.',
        noResult: 'The magic fix could not produce a result.',
      },
      settings: {
        noSelectionTitle: 'Select an item!',
        noSelectionDescription: 'For detailed component-level setting pick an item from the tree on the left!',
        tabs: {
          basic: 'Basic settings',
          advanced: 'Advanced settings',
        },
        basic: {
          sections: {
            accuracyAndEffort: 'Accuracy and effort',
            sharedLimits: 'Shared limits',
          },
          labels: {
            accuracy: 'Accuracy',
            effort: 'Effort',
            preferredMinimumDistanceFromEdge: 'Stitch distance from edge',
            modifyRange: 'Modification range',
          },
          efforts: {
            low: 'Low',
            medium: 'Medium',
            high: 'High',
          },
        },
        advanced: {
          sections: {
            distance: 'Distance from edge',
            layoutGap: 'Layout gap',
            dimensions: 'Dimensions',
            autoDimensions: 'Auto dimensions',
            cornerRadius: 'Corner radius',
            pocketStep: 'Pocket step',
            offset: 'Offset',
            flip: 'Flip',
          },
          labels: {
            preferredMinimumDistanceFromEdge: 'Preferred minimum',
            layoutGap: 'Gap',
            canConvertToFixedHeight: 'Allow fixed height',
            canConvertToFixedWidth: 'Allow fixed width',
            canConvertToIndividualRadii: 'Allow individual radii',
            borderRadius: 'All corners',
            pocketStep: 'Step',
            topStart: 'Top start',
            topEnd: 'Top end',
            rightStart: 'Right start',
            rightEnd: 'Right end',
            bottomStart: 'Bottom start',
            bottomEnd: 'Bottom end',
            leftStart: 'Left start',
            leftEnd: 'Left end',
            start: 'Start',
            end: 'End',
            canFlipStitchDirection: 'Allow flip',
          },
        },
      },
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
    settingsDialog: {
      title: 'Project settings',
      components: {
        title: 'Components',
        baseColor: 'Base color',
      },
      tabs: {
        basic: 'Basic settings',
        stitching: 'Stitching',
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
        individual: 'Individual',
        uniform: 'Uniform',
        individualMeasure: 'Measurement',
        uniformMeasure: 'Measurement',
      },
      pocketCluster: {
        title: 'Pockets',
        card: 'Card',
        noCard: 'None',
        opening: 'Opening',
        fromTop: 'Top',
        fromBottom: 'Bottom',
        fromLeft: 'Left',
        fromRight: 'Right',
      },
      tPocket: {
        title: 'T-pockets',
        flapWidth: 'Tab width',
        taper: 'Taper',
      },
    },
  },
  hole: {
    title: 'Hole',
    editor: {
      position: {
        title: 'Position',
        xAnchor: 'Horizontal alignment',
        yAnchor: 'Vertical alignment',
        xOffset: 'X offset',
        yOffset: 'Y offset',
        left: 'Left',
        center: 'Center',
        right: 'Right',
        top: 'Top',
        bottom: 'Bottom',
      },
      size: {
        radius: 'Radius',
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
        description: 'Add a stitch line from the tree or the editors!',
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
        startOffset: 'Start offset',
        endOffset: 'End offset',
      },
      stitching: {
        title: 'Stitching',
        holeColor: 'Hole color',
        lineColor: 'Line color',
        margin: 'Margin',
        holeLength: 'Hole length',
        holeDistance: 'Hole spacing',
        holeThickness: 'Hole thickness',
        lineThickness: 'Line thickness',
        reset: 'Use project value',
      },
    },
  },
  validation: {
    multipleIssues: (count: number) => `${count} issues`,
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
    rootComponentName: 'Module',
    stitchLineName: (number: number) => `Stitch line ${number}`,
  },
}

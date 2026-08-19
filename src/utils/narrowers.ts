import { HasType } from '../schemas/common'
import { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import {
  ComputedComponentSchema,
  ComputedPanelSchema,
  ComputedPocketClusterSchema,
  ComputedRootPanelSchema,
} from '../schemas/computed'
import { ComponentBoundsStitchLineSchema, PocketClusterStitchLineSchema, StitchLineSchema } from '../schemas/stitching'

export const narrowers = {
  is: {
    // Component
    rootPanel: (input: ComponentSchema): input is RootPanelSchema => {
      return hasType(input, 'root-panel')
    },
    panel: (input: ComponentSchema): input is PanelSchema => {
      return hasType(input, 'panel')
    },
    pocketCluster: (input: ComponentSchema): input is PocketClusterSchema => {
      return hasType(input, 'pocket-cluster')
    },
    // Computed component
    computedRootPanel: (input: ComputedComponentSchema): input is ComputedRootPanelSchema => {
      return hasType(input, 'computed-root-panel')
    },
    computedPanel: (input: ComputedComponentSchema): input is ComputedPanelSchema => {
      return hasType(input, 'computed-panel')
    },
    computedPocketCluster: (input: ComputedComponentSchema): input is ComputedPocketClusterSchema => {
      return hasType(input, 'computed-pocket-cluster')
    },
    // Stitch line
    componentBoundsStitchLine: (input: StitchLineSchema): input is ComponentBoundsStitchLineSchema => {
      return hasType(input, 'component-bounds-stitch-line')
    },
    pocketClusterStitchLine: (input: StitchLineSchema): input is PocketClusterStitchLineSchema => {
      return hasType(input, 'pocket-cluster-stitch-line')
    },
  },
  assert: {
    // Component
    rootPanel: (input: ComponentSchema): RootPanelSchema => {
      return assertType(input, 'root-panel')
    },
    panel: (input: ComponentSchema): PanelSchema => {
      return assertType(input, 'panel')
    },
    pocketCluster: (input: ComponentSchema): PocketClusterSchema => {
      return assertType(input, 'pocket-cluster')
    },
    // Computed component
    computedRootPanel: (input: ComputedComponentSchema): ComputedRootPanelSchema => {
      return assertType(input, 'computed-root-panel')
    },
    computedPanel: (input: ComputedComponentSchema): ComputedPanelSchema => {
      return assertType(input, 'computed-panel')
    },
    computedPocketCluster: (input: ComputedComponentSchema): ComputedPocketClusterSchema => {
      return assertType(input, 'computed-pocket-cluster')
    },
    // Stitch line
    componentBoundsStitchLine: (input: StitchLineSchema): ComponentBoundsStitchLineSchema => {
      return assertType(input, 'component-bounds-stitch-line')
    },
    pocketClusterStitchLine: (input: StitchLineSchema): PocketClusterStitchLineSchema => {
      return assertType(input, 'pocket-cluster-stitch-line')
    },
  },
}

const hasType = <Data, CurrentType extends string, ExpectedType extends CurrentType>(
  input: Data & HasType<CurrentType>,
  expectedType: ExpectedType,
): input is Data & HasType<ExpectedType> => {
  return input.type === expectedType
}

const assertType = <Data, CurrentType extends string, ExpectedType extends CurrentType>(
  input: Data & HasType<CurrentType>,
  expectedType: ExpectedType,
): Data & HasType<ExpectedType> => {
  if (!hasType(input, expectedType)) {
    throw new Error(`Excpected type='${expectedType}', but was '${input.type}'.`)
  }
  return input
}

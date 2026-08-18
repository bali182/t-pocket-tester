import { HasType } from '../schemas/common'
import { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import { HoleSchema } from '../schemas/hole'
import { ComponentBoundsStitchLineSchema, PocketClusterStitchLineSchema, StitchLineSchema } from '../schemas/stitching'
import { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { isDefined } from './isDefined'

export const accessors = {
  subProject: (subProject: SubProjectSchema) => {
    const component = (id: string): ComponentSchema => {
      const anyComponent = subProject.components[id]
      if (!isDefined(anyComponent)) {
        throw new Error(createMissingErrorMessage('component', 'sub-project', subProject.id))
      }
      return anyComponent
    }

    const stitchLine = (id: string): StitchLineSchema => {
      const anyStitchLine = subProject.stitchLines.find((s) => s.id === id)
      if (!isDefined(anyStitchLine)) {
        throw new Error(createMissingErrorMessage('stitch line', 'sub-project', subProject.id))
      }
      return anyStitchLine
    }

    const hole = (id: string): HoleSchema => {
      const h = subProject.holes.find((s) => s.id === id)
      if (!isDefined(h)) {
        throw new Error(createMissingErrorMessage('hole', 'sub-project', subProject.id))
      }
      return h
    }

    const rootPanel = (): RootPanelSchema => {
      return assertTypeField(component(subProject.root), 'root-panel')
    }

    const panel = (id: string): PanelSchema => {
      return assertTypeField(component(id), 'panel')
    }

    const pocketCluster = (id: string): PocketClusterSchema => {
      return assertTypeField(component(id), 'pocket-cluster')
    }

    const componentBoundsStitchLine = (id: string): ComponentBoundsStitchLineSchema => {
      return assertTypeField(stitchLine(id), 'component-bounds-stitch-line')
    }

    const pocketClusterStitchLine = (id: string): PocketClusterStitchLineSchema => {
      return assertTypeField(stitchLine(id), 'pocket-cluster-stitch-line')
    }

    return {
      component,
      stitchLine,
      hole,
      rootPanel,
      panel,
      pocketCluster,
      componentBoundsStitchLine,
      pocketClusterStitchLine,
    }
  },

  computedSubProject: (computedSubProject: ComputedSubProjectSchema) => {
    const component = (id: string) => {
      const anyComponent = computedSubProject.components[id]
      if (!isDefined(anyComponent)) {
        throw new Error(createMissingErrorMessage('component', 'computed sub-project', computedSubProject.id))
      }
      return anyComponent
    }

    const stitchLine = (id: string) => {
      const anyStitchLine = computedSubProject.stitchLines.find((s) => s.stitchLineId === id)
      if (!isDefined(anyStitchLine)) {
        throw new Error(createMissingErrorMessage('stitch line', 'computed sub-project', computedSubProject.id))
      }
      return anyStitchLine
    }

    const hole = (id: string) => {
      const anyHole = computedSubProject.holes.find((h) => h.holeId === id)
      if (!isDefined(anyHole)) {
        throw new Error(createMissingErrorMessage('hole', 'computed sub-project', computedSubProject.id))
      }
      return anyHole
    }

    const rootPanel = () => {
      return assertTypeField(component(computedSubProject.root), 'computed-root-panel')
    }

    const panel = (id: string) => {
      return assertTypeField(component(id), 'computed-panel')
    }

    const pocketCluster = (id: string) => {
      return assertTypeField(component(id), 'computed-pocket-cluster')
    }

    return {
      component,
      stitchLine,
      hole,
      rootPanel,
      panel,
      pocketCluster,
    }
  },
}

const createMissingErrorMessage = (componentType: string, ownerType: string, ownerId: string, ownerName?: string) => {
  return `Missing ${componentType} from ${ownerType} ${ownerId}${isDefined(ownerName ? ` (${ownerName})` : '')}.`
}

export const assertTypeField = <Data, CurrentType extends string, ExpectedType extends CurrentType>(
  input: Data & HasType<CurrentType>,
  expectedType: ExpectedType,
): Data & HasType<ExpectedType> => {
  if (input.type !== expectedType) {
    throw new Error(`Excpected type='${expectedType}', but was '${input.type}'.`)
  }
  return input as Data & HasType<ExpectedType>
}

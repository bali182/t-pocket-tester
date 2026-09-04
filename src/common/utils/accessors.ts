import { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import { HoleSchema } from '../schemas/hole'
import { ComponentBoundsStitchLineSchema, PocketClusterStitchLineSchema, StitchLineSchema } from '../schemas/stitching'
import { ComputedSubProjectSchema, SubProjectSchema } from '../schemas/subProject'
import { isDefined } from './isDefined'
import { narrowers } from './narrowers'

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
      return narrowers.assert.rootPanel(component(subProject.root))
    }

    const panel = (id: string): PanelSchema => {
      return narrowers.assert.panel(component(id))
    }

    const pocketCluster = (id: string): PocketClusterSchema => {
      return narrowers.assert.pocketCluster(component(id))
    }

    const componentBoundsStitchLine = (id: string): ComponentBoundsStitchLineSchema => {
      return narrowers.assert.componentBoundsStitchLine(stitchLine(id))
    }

    const pocketClusterStitchLine = (id: string): PocketClusterStitchLineSchema => {
      return narrowers.assert.pocketClusterStitchLine(stitchLine(id))
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
      return narrowers.assert.computedRootPanel(component(computedSubProject.root))
    }

    const panel = (id: string) => {
      return narrowers.assert.computedPanel(component(id))
    }

    const pocketCluster = (id: string) => {
      return narrowers.assert.computedPocketCluster(component(id))
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

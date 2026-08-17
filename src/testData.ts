import { createComponent } from './operations/subProject/utils/createComponent'
import { createHole } from './operations/subProject/utils/createHole'
import { createStitchLine } from './operations/subProject/utils/createStitchLine'
import { HasComponentReferenceSchema, HasComponentTargetSchema, HasId, HasTargetSchema } from './schemas/common'
import { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from './schemas/components'
import { HoleSchema } from './schemas/hole'
import {
  MagicFixComponentBoundsStitchLineConfigSchema,
  MagicFixConfigSchema,
  MagicFixNumericRangeSchema,
  MagicFixPanelConfigSchema,
  MagicFixPocketClusterConfigSchema,
  MagicFixPocketClusterStitchLineConfigSchema,
  MagicFixRootPanelConfigSchema,
} from './schemas/magicFixConfig'
import { ProjectSchema } from './schemas/project'
import {
  ComponentBoundsStitchLineSchema,
  PocketClusterStitchLineSchema,
  StitchLineCommonConfigSchema,
  StitchLineSchema,
} from './schemas/stitching'
import { SubProjectSchema } from './schemas/subProject'
import { createProject } from './utils/createProject'
import { createSubProject } from './utils/createSubProject'
import { isDefined } from './utils/isDefined'

type CreateTestProjectConfig = HasId & {
  subProjects: SubProjectSchema[]
  stitchingSettings?: StitchLineCommonConfigSchema
}

type CreateSubProjectConfig = HasId & {
  root: RootPanelSchema
  components?: (PanelSchema | PocketClusterSchema)[]
  stitchLines?: StitchLineSchema[]
  holes?: HoleSchema[]
}

type CreateRootPanelConfig = Partial<RootPanelSchema> & HasId
type CreatePanelConfig = Partial<PanelSchema> & HasId
type CreatePocketClusterConfig = Partial<PocketClusterSchema> & HasId

type CreateHoleConfig = Partial<HoleSchema> & HasId & HasComponentReferenceSchema

type CreateComponentBoundsStitchLineConfig = Partial<ComponentBoundsStitchLineSchema> & HasId & HasTargetSchema
type CreatePocketClusterStitchLineConfig = Partial<PocketClusterStitchLineSchema> & HasId & HasComponentTargetSchema

type CreateMagicFixRootPanelConfig = Partial<Omit<MagicFixRootPanelConfigSchema, 'type' | 'componentId'>>
type CreateMagicFixPanelConfig = Partial<Omit<MagicFixPanelConfigSchema, 'type' | 'componentId'>>
type CreateMagicFixPocketClusterConfig = Partial<Omit<MagicFixPocketClusterConfigSchema, 'type' | 'componentId'>>
type CreateMagicFixComponentBoundsStitchLineConfig = Partial<
  Omit<MagicFixComponentBoundsStitchLineConfigSchema, 'type' | 'stitchLineId'>
>
type CreateMagicFixPocketClusterStitchLineConfig = Partial<
  Omit<MagicFixPocketClusterStitchLineConfigSchema, 'type' | 'stitchLineId'>
>

type MagicFixChanges =
  | CreateMagicFixRootPanelConfig
  | CreateMagicFixPanelConfig
  | CreateMagicFixPocketClusterConfig
  | CreateMagicFixComponentBoundsStitchLineConfig
  | CreateMagicFixPocketClusterStitchLineConfig

export type MagicFixManipulator = {
  get(rootPanel: RootPanelSchema): MagicFixRootPanelConfigSchema
  get(panel: PanelSchema): MagicFixPanelConfigSchema
  get(pocketCluster: PocketClusterSchema): MagicFixPocketClusterConfigSchema
  get(stitchLine: ComponentBoundsStitchLineSchema): MagicFixComponentBoundsStitchLineConfigSchema
  get(stitchLine: PocketClusterStitchLineSchema): MagicFixPocketClusterStitchLineConfigSchema

  set(rootPanel: RootPanelSchema, changes: CreateMagicFixRootPanelConfig): MagicFixManipulator
  set(panel: PanelSchema, changes: CreateMagicFixPanelConfig): MagicFixManipulator
  set(pocketCluster: PocketClusterSchema, changes: CreateMagicFixPocketClusterConfig): MagicFixManipulator
  set(
    stitchLine: ComponentBoundsStitchLineSchema,
    changes: CreateMagicFixComponentBoundsStitchLineConfig,
  ): MagicFixManipulator
  set(
    stitchLine: PocketClusterStitchLineSchema,
    changes: CreateMagicFixPocketClusterStitchLineConfig,
  ): MagicFixManipulator
  disableAll(): MagicFixManipulator

  toMagicFix(): MagicFixConfigSchema
}

export const d = {
  project: ({ id, subProjects, stitchingSettings }: CreateTestProjectConfig): ProjectSchema => {
    const project = createProject(id)
    project.id = id
    project.subProjects = subProjects
    if (isDefined(stitchingSettings)) {
      project.stitchingSettings = stitchingSettings
    }
    return project
  },

  subProject: ({
    id,
    root,
    components = [],
    stitchLines = [],
    holes = [],
  }: CreateSubProjectConfig): SubProjectSchema => {
    const subProject = createSubProject(id)
    subProject.root = root.id
    subProject.components = {
      [root.id]: root,
    }
    for (const component of components) {
      subProject.components[component.id] = component
    }
    subProject.stitchLines = stitchLines
    subProject.holes = holes
    return subProject
  },

  rootPanel: ({ id, ...rest }: CreateRootPanelConfig): RootPanelSchema => {
    return { ...createComponent({ type: 'root-panel', id, name: id }), ...rest }
  },

  panel: ({ id, ...rest }: CreatePanelConfig): PanelSchema => {
    return { ...createComponent({ type: 'panel', id, name: id }), ...rest }
  },

  pocketCluster: ({ id, ...rest }: CreatePocketClusterConfig): PocketClusterSchema => {
    return { ...createComponent({ type: 'pocket-cluster', id, name: id }), ...rest }
  },

  hole: ({ id, componentId, ...rest }: CreateHoleConfig): HoleSchema => {
    return { ...createHole({ id, name: id, componentId, ...rest }) }
  },

  componentBoundsStitchLine: ({
    id,
    targetId,
    targetType,
    ...rest
  }: CreateComponentBoundsStitchLineConfig): ComponentBoundsStitchLineSchema => {
    const stitchLine = createStitchLine(
      'component-bounds-stitch-line',
      { targetId, targetType },
      id,
      id,
    ) as ComponentBoundsStitchLineSchema
    return { ...stitchLine, ...rest }
  },

  pocketClusterStitchLine: ({
    id,
    targetId,
    targetType,
    ...rest
  }: CreatePocketClusterStitchLineConfig): PocketClusterStitchLineSchema => {
    const stitchLine = createStitchLine(
      'pocket-cluster-stitch-line',
      { targetId, targetType },
      id,
      id,
    ) as PocketClusterStitchLineSchema
    return { ...stitchLine, ...rest }
  },
}

export const m = (config: MagicFixConfigSchema): MagicFixManipulator => {
  const getter = (target: ComponentSchema | StitchLineSchema) => {
    switch (target.type) {
      case 'root-panel': {
        const targetConfig = config.componentConfigs[target.id]
        if (!isDefined(targetConfig)) {
          throw new Error(`Missing Magic Fix config for root panel: "${target.id}"!`)
        }
        if (targetConfig.type !== 'magic-fix-root-panel-config') {
          throw new Error(`Invalid Magic Fix config type for root panel: "${target.id}"!`)
        }
        return targetConfig
      }

      case 'panel': {
        const targetConfig = config.componentConfigs[target.id]
        if (!isDefined(targetConfig)) {
          throw new Error(`Missing Magic Fix config for panel: "${target.id}"!`)
        }
        if (targetConfig.type !== 'magic-fix-panel-config') {
          throw new Error(`Invalid Magic Fix config type for panel: "${target.id}"!`)
        }
        return targetConfig
      }

      case 'pocket-cluster': {
        const targetConfig = config.componentConfigs[target.id]
        if (!isDefined(targetConfig)) {
          throw new Error(`Missing Magic Fix config for pocket cluster: "${target.id}"!`)
        }
        if (targetConfig.type !== 'magic-fix-pocket-cluster-config') {
          throw new Error(`Invalid Magic Fix config type for pocket cluster: "${target.id}"!`)
        }
        return targetConfig
      }

      case 'component-bounds-stitch-line': {
        const targetConfig = config.stitchLineConfigs[target.id]
        if (!isDefined(targetConfig)) {
          throw new Error(`Missing Magic Fix config for component bounds stitch line: "${target.id}"!`)
        }
        if (targetConfig.type !== 'magic-fix-component-bounds-stitch-line-config') {
          throw new Error(`Invalid Magic Fix config type for component bounds stitch line: "${target.id}"!`)
        }
        return targetConfig
      }

      case 'pocket-cluster-stitch-line': {
        const targetConfig = config.stitchLineConfigs[target.id]
        if (!isDefined(targetConfig)) {
          throw new Error(`Missing Magic Fix config for pocket cluster stitch line: "${target.id}"!`)
        }
        if (targetConfig.type !== 'magic-fix-pocket-cluster-stitch-line-config') {
          throw new Error(`Invalid Magic Fix config type for pocket cluster stitch line: "${target.id}"!`)
        }
        return targetConfig
      }
    }
  }

  const manipulator: MagicFixManipulator = {
    get: getter as MagicFixManipulator['get'],

    set(target: ComponentSchema | StitchLineSchema, changes: MagicFixChanges) {
      Object.assign(getter(target), changes)
      return manipulator
    },

    disableAll(): MagicFixManipulator {
      const createDisabledRange = (): MagicFixNumericRangeSchema => ({ maxDecrease: 0, maxIncrease: 0 })
      for (const componentConfig of Object.values(config.componentConfigs)) {
        componentConfig.fixedWidthRange = createDisabledRange()
        componentConfig.fixedHeightRange = createDisabledRange()
        componentConfig.borderRadiusRange = createDisabledRange()
        componentConfig.topLeftRadiusRange = createDisabledRange()
        componentConfig.topRightRadiusRange = createDisabledRange()
        componentConfig.bottomRightRadiusRange = createDisabledRange()
        componentConfig.bottomLeftRadiusRange = createDisabledRange()
        componentConfig.canConvertToIndividualRadii = false
        if (
          componentConfig.type === 'magic-fix-root-panel-config' ||
          componentConfig.type === 'magic-fix-panel-config'
        ) {
          componentConfig.layoutGapRange = createDisabledRange()
        }
        if (
          componentConfig.type === 'magic-fix-panel-config' ||
          componentConfig.type === 'magic-fix-pocket-cluster-config'
        ) {
          componentConfig.canConvertToFixedWidth = false
          componentConfig.canConvertToFixedHeight = false
        }
        if (componentConfig.type === 'magic-fix-pocket-cluster-config') {
          componentConfig.pocketStepRange = createDisabledRange()
        }
      }

      for (const stitchLineConfig of Object.values(config.stitchLineConfigs)) {
        if (stitchLineConfig.type === 'magic-fix-component-bounds-stitch-line-config') {
          stitchLineConfig.topStartOffsetRange = createDisabledRange()
          stitchLineConfig.topEndOffsetRange = createDisabledRange()
          stitchLineConfig.rightStartOffsetRange = createDisabledRange()
          stitchLineConfig.rightEndOffsetRange = createDisabledRange()
          stitchLineConfig.bottomStartOffsetRange = createDisabledRange()
          stitchLineConfig.bottomEndOffsetRange = createDisabledRange()
          stitchLineConfig.leftStartOffsetRange = createDisabledRange()
          stitchLineConfig.leftEndOffsetRange = createDisabledRange()
          stitchLineConfig.canFlipTopStitchDirection = false
          stitchLineConfig.canFlipRightStitchDirection = false
          stitchLineConfig.canFlipBottomStitchDirection = false
          stitchLineConfig.canFlipLeftStitchDirection = false
        } else {
          stitchLineConfig.startOffsetRange = createDisabledRange()
          stitchLineConfig.endOffsetRange = createDisabledRange()
          stitchLineConfig.canFlipStitchDirection = false
        }
      }
      return manipulator
    },

    toMagicFix: () => config,
  }
  return manipulator
}

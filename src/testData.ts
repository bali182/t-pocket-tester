import { createComponent } from './operations/subProject/utils/createComponent'
import { createHole } from './operations/subProject/utils/createHole'
import { createStitchLine } from './operations/subProject/utils/createStitchLine'
import { HasComponentReferenceSchema, HasId, HasTargetSchema } from './schemas/common'
import { PanelSchema, PocketClusterSchema, RootPanelSchema } from './schemas/components'
import { HoleSchema } from './schemas/hole'
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
type CreatePocketClusterStitchLineConfig = Partial<PocketClusterStitchLineSchema> & HasId & HasTargetSchema

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
      'component-bounds-stitch-line',
      { targetId, targetType },
      id,
      id,
    ) as PocketClusterStitchLineSchema
    return { ...stitchLine, ...rest }
  },
}

import { HasIdentitySchema } from './common'
import { ComponentSchema } from './components'
import { ComputedComponentSchema, ComputedHoleSchema, ComputedStitchLineSchema } from './computed'
import { ComponentBaseSettings, ProjectEditingSettingSchema } from './editingSettings'
import { HoleSchema } from './hole'
import { StitchLineCommonConfigSchema, StitchLineSchema } from './stitching'

export type ProductSchema = HasIdentitySchema & {
  subProjects: ProjectSchema[]
  editingSettings: ProjectEditingSettingSchema
  stitchingSettings: StitchLineCommonConfigSchema
  componentSettings: ComponentBaseSettings
}

export type ProjectSchema = HasIdentitySchema & {
  root: string
  components: Record<string, ComponentSchema>
  holes: HoleSchema[]
  stitchLines: StitchLineSchema[]
  editingSettings: ProjectEditingSettingSchema
  stitchingSettings: StitchLineCommonConfigSchema
  componentSettings: ComponentBaseSettings
}

export type ComputedProjectSchema = HasIdentitySchema & {
  root: string
  components: Record<string, ComputedComponentSchema>
  holes: ComputedHoleSchema[]
  stitchLines: ComputedStitchLineSchema[]
}

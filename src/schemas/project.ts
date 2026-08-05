import { HasIdentitySchema } from './common'
import { ComponentBaseSettings, ProjectEditingSettingSchema } from './editingSettings'
import { StitchLineCommonConfigSchema } from './stitching'
import { SubProjectSchema } from './subProject'

export type ProjectSchema = HasIdentitySchema & {
  subProjects: SubProjectSchema[]
  editingSettings: ProjectEditingSettingSchema
  stitchingSettings: StitchLineCommonConfigSchema
  componentSettings: ComponentBaseSettings
}

export type ComputedProjectSchema = HasIdentitySchema & {
  subProjects: ComputedProjectSchema[]
}

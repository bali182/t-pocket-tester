import { HasIdentitySchema } from './common'
import { ColorSettingsSchema, ProjectEditingSettingSchema } from './settings'
import { StitchLineCommonConfigSchema } from './stitching'
import { ComputedSubProjectSchema, SubProjectSchema } from './subProject'

export type ProjectSchema = HasIdentitySchema & {
  subProjects: SubProjectSchema[]
  editingSettings: ProjectEditingSettingSchema
  stitchingSettings: StitchLineCommonConfigSchema
  colorSettings: ColorSettingsSchema
}

export type ComputedProjectSchema = HasIdentitySchema & {
  subProjects: ComputedSubProjectSchema[]
}

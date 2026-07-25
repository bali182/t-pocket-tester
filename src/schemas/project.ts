import { ComponentSchema } from './components'
import { ComputedComponentSchema, ComputedStitchLineSchema } from './computed'
import { ComponentBaseSettings, ProjectEditingSettingSchema } from './editingSettings'
import { StitchLineCommonConfigSchema, StitchLineSchema } from './stitching'

export type ProjectSchema = {
  id: string
  name: string
  root: string
  components: Record<string, ComponentSchema>
  stitchLines: StitchLineSchema[]
  editingSettings: ProjectEditingSettingSchema
  stitchingSettings: StitchLineCommonConfigSchema
  componentSettings: ComponentBaseSettings
}

export type ComputedProjectSchema = {
  id: string
  name: string
  root: string
  components: Record<string, ComputedComponentSchema>
  stitchLines: ComputedStitchLineSchema[]
}

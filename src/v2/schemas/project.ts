import { ComponentSchema } from './components'
import { ComputedComponentSchema, ComputedStitchLineSchema } from './computed'
import { ProjectEditingSettingSchema } from './editingSettings'
import { StitchingSettingsSchema, StitchLineSchema } from './stitching'

export type ProjectSchema = {
  id: string
  name: string
  root: string
  components: Record<string, ComponentSchema>
  stitchLines: StitchLineSchema[]
  editingSettings: ProjectEditingSettingSchema
  stitchingSettings: StitchingSettingsSchema
}

export type ComputedProjectSchema = {
  id: string
  name: string
  root: string
  components: Record<string, ComputedComponentSchema>
  stitchLines: ComputedStitchLineSchema[]
}

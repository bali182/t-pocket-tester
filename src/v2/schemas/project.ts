import { ComponentSchema } from './components'
import { ComputedComponentSchema, ComputedStitchLineSchema } from './computed'
import { ProjectEditingSettingSchema } from './editingSettings'
import { ProjectStitchLineSchema, StitchingSettingsSchema } from './stitching'

export type ProjectSchema = {
  id: string
  name: string
  root: string
  components: Record<string, ComponentSchema>
  stitchLines: ProjectStitchLineSchema[]
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

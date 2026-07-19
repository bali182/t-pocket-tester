import { ComponentSchema } from './components'
import { ComputedComponentSchema, ComputedStitchLineSchema } from './computed'
import { ProjectEditingSettingSchema } from './editingSettings'
import { StitchLineSchema, StitchLineCommonConfigSchema } from './stitching'

export type ProjectSchema = {
  id: string
  name: string
  root: string
  components: Record<string, ComponentSchema>
  stitchLines: StitchLineSchema[]
  editingSettings: ProjectEditingSettingSchema
  stitchingSettings: StitchLineCommonConfigSchema
}

export type ComputedProjectSchema = {
  id: string
  name: string
  root: string
  components: Record<string, ComputedComponentSchema>
  stitchLines: ComputedStitchLineSchema[]
}

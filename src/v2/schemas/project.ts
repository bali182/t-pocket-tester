import { ComponentSchema } from './components'
import { ComputedComponentSchema } from './computed'
import { ProjectEditingSettingSchema } from './editingSettings'

export type ProjectSchema = {
  id: string
  name: string
  root: string
  components: Record<string, ComponentSchema>
  editingSettings: ProjectEditingSettingSchema
}

export type ComputedProjectSchema = {
  id: string
  name: string
  root: string
  components: Record<string, ComputedComponentSchema>
}

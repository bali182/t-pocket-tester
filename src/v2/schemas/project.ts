import { ComponentSchema } from './components'
import { ComputedComponentSchema } from './computed'

export type ProjectSchema = {
  id: string
  name: string
  root: string
  components: Record<string, ComponentSchema>
}

export type ComputedProjectSchema = {
  id: string
  name: string
  root: string
  components: Record<string, ComputedComponentSchema>
}

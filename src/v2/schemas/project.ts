import { ComponentSchema } from './components'
import { ComputedComponentSchema } from './computed'
import * as Computed2 from './computed2'

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

export type ComputedProjectSchema2 = {
  id: string
  name: string
  root: string
  components: Record<string, Computed2.ComputedComponentSchema>
}

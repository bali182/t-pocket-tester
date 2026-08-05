import type { ComponentSchema } from '../../../schemas/components'
import type { ComputedComponentSchema } from '../../../schemas/computed'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../../../schemas/subProject'

export const updateProjectComponents = (
  subProject: SubProjectSchema,
  computedProject: ComputedSubProjectSchema,
  mapper: (id: string, component: ComponentSchema, computedComponent: ComputedComponentSchema) => ComponentSchema,
): SubProjectSchema => {
  let components = subProject.components

  for (const [id, component] of Object.entries(subProject.components)) {
    const updatedComponent = mapper(id, component, computedProject.components[id])

    if (updatedComponent === component) {
      continue
    }

    if (components === subProject.components) {
      components = { ...subProject.components }
    }

    components[id] = updatedComponent
  }

  return components === subProject.components ? subProject : { ...subProject, components }
}

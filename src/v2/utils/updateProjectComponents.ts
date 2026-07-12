import type { ComponentSchema } from '../schemas/components'
import type { ComputedComponentSchema } from '../schemas/computed'
import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'

export const updateProjectComponents = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
  mapper: (id: string, component: ComponentSchema, computedComponent: ComputedComponentSchema) => ComponentSchema,
): ProjectSchema => {
  let components = project.components

  for (const [id, component] of Object.entries(project.components)) {
    const updatedComponent = mapper(id, component, computedProject.components[id])

    if (updatedComponent === component) {
      continue
    }

    if (components === project.components) {
      components = { ...project.components }
    }

    components[id] = updatedComponent
  }

  return components === project.components ? project : { ...project, components }
}

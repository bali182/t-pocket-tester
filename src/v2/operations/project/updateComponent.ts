import { ComponentSchema } from '../../schemas/components'
import { ProjectSchema } from '../../schemas/project'

export type UpdateComponentParams = {
  component: ComponentSchema
}

export const updateComponent = (project: ProjectSchema, { component }: UpdateComponentParams): ProjectSchema => {
  return {
    ...project,
    components: {
      ...project.components,
      [component.id]: component,
    },
  }
}

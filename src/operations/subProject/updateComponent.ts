import { ComponentSchema } from '../../schemas/components'
import { SubProjectSchema } from '../../schemas/subProject'

export type UpdateComponentParams = {
  component: ComponentSchema
}

export const updateComponent = (
  subProject: SubProjectSchema,
  { component }: UpdateComponentParams,
): SubProjectSchema => {
  return {
    ...subProject,
    components: {
      ...subProject.components,
      [component.id]: component,
    },
  }
}

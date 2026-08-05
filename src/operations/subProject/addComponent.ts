import { ComponentSchema } from '../../schemas/components'
import { SubProjectSchema } from '../../schemas/subProject'
import { isDefined } from '../../utils/isDefined'
import { hasComponentChildren } from './utils/hasComponentChildren'

export type AddComponentParams = {
  parentId: string
  component: ComponentSchema
}

export const addComponent = (subProject: SubProjectSchema, params: AddComponentParams): SubProjectSchema => {
  const parent = subProject.components[params.parentId]

  if (!isDefined(parent) || !hasComponentChildren(parent)) {
    throw new Error('Missing parent or cannot have child elements')
  }

  return {
    ...subProject,
    components: {
      ...subProject.components,
      [parent.id]: {
        ...parent,
        children: [...parent.children, params.component.id],
      },
      [params.component.id]: params.component,
    },
  }
}

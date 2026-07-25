import { ComponentSchema } from '../../schemas/components'
import { ProjectSchema } from '../../schemas/project'
import { isDefined } from '../../utils/isDefined'
import { hasComponentChildren } from './utils/hasComponentChildren'

export type AddComponentParams = {
  parentId: string
  component: ComponentSchema
}

export const addComponent = (project: ProjectSchema, params: AddComponentParams): ProjectSchema => {
  const parent = project.components[params.parentId]

  if (!isDefined(parent) || !hasComponentChildren(parent)) {
    throw new Error('Missing parent or cannot have child elements')
  }

  return {
    ...project,
    components: {
      ...project.components,
      [parent.id]: {
        ...parent,
        children: [...parent.children, params.component.id],
      },
      [params.component.id]: params.component,
    },
  }
}

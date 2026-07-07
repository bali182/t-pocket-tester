import { ComponentSchema } from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'
import { createComponent } from './createComponent'
import { getComponentNestingLevel } from './getComponentNestingLevel'
import { hasChildren } from './hasChildren'
import { isDefined } from './isDefined'

export const addComponent = (
  parentId: string,
  type: ComponentSchema['type'],
  project: ProjectSchema,
): ProjectSchema => {
  const parent = project.components[parentId]

  if (!isDefined(parent) || !hasChildren(parent)) {
    return project
  }

  const component = createComponent(type, project, getComponentNestingLevel(parent.id, project) + 1)

  return {
    ...project,
    components: {
      ...project.components,
      [parent.id]: {
        ...parent,
        children: [...parent.children, component.id],
      },
      [component.id]: component,
    },
  }
}

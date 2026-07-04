import { ComponentSchema } from '../schemas/components'
import { createComponent } from './createComponent'
import { getComponentNestingLevel } from './getComponentNestingLevel'
import { hasChildren } from './hasChildren'

export const addComponent = (
  parentId: string,
  type: ComponentSchema['type'],
  components: Record<string, ComponentSchema>,
): Record<string, ComponentSchema> => {
  const parent = components[parentId]

  if (!parent || !hasChildren(parent)) {
    return components
  }

  const component = createComponent(type, components, getComponentNestingLevel(parent.id, components) + 1)

  return {
    ...components,
    [parent.id]: {
      ...parent,
      children: [...parent.children, component.id],
    },
    [component.id]: component,
  }
}

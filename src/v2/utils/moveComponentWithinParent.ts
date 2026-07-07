import type { ComponentSchema } from '../schemas/components'
import { getParent } from './getParent'
import { isDefined } from './isDefined'

export type MoveComponentDirection = 'up' | 'down'

export const moveComponentWithinParent = (
  componentId: string,
  direction: MoveComponentDirection,
  components: Record<string, ComponentSchema>,
): Record<string, ComponentSchema> => {
  const component = components[componentId]

  if (!isDefined(component) || component.type === 'root-panel') {
    return components
  }

  const parent = getParent(componentId, components)

  if (!isDefined(parent)) {
    return components
  }

  const currentIndex = parent.children.indexOf(componentId)
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (targetIndex < 0 || targetIndex >= parent.children.length) {
    return components
  }

  const children = parent.children.slice()
  const [movedChildId] = children.splice(currentIndex, 1)
  children.splice(targetIndex, 0, movedChildId)

  return {
    ...components,
    [parent.id]: {
      ...parent,
      children,
    },
  }
}

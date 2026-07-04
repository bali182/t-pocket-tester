import type { ComponentSchema } from '../schemas/components'
import { hasChildren } from './hasChildren'
import { isDefined } from './isDefined'

export const getComponentNestingLevel = (
  componentId: string,
  components: Record<string, ComponentSchema>,
): number => {
  const rootComponent = Object.values(components).find((component) => component.type === 'root-panel')

  if (!rootComponent) {
    return 0
  }

  return findComponentNestingLevel(componentId, rootComponent, components) ?? 0
}

const findComponentNestingLevel = (
  componentId: string,
  component: ComponentSchema,
  components: Record<string, ComponentSchema>,
  currentNestingLevel = 0,
): number | undefined => {
  if (component.id === componentId) {
    return currentNestingLevel
  }

  if (!hasChildren(component)) {
    return undefined
  }

  for (const childId of component.children) {
    const child = components[childId]

    if (!isDefined(child)) {
      continue
    }

    const childNestingLevel = findComponentNestingLevel(componentId, child, components, currentNestingLevel + 1)

    if (isDefined(childNestingLevel)) {
      return childNestingLevel
    }
  }

  return undefined
}

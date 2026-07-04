import { ComponentSchema } from '../schemas/components'
import { hasChildren } from './hasChildren'
import { isDefined } from './isDefined'

export const removeComponent = (
  id: string,
  components: Record<string, ComponentSchema>,
): Record<string, ComponentSchema> => {
  const component = components[id]

  if (!component || component.type === 'root-panel') {
    return components
  }

  const deletedIds = collectDescendantIds(component, components)

  return Object.fromEntries(
    Object.entries(components)
      .filter(([id]) => !deletedIds.has(id))
      .map(([id, component]) => [id, removeDeletedChildren(component, deletedIds)]),
  )
}

const collectDescendantIds = (component: ComponentSchema, components: Record<string, ComponentSchema>): Set<string> => {
  const ids = new Set<string>([component.id])

  if (!hasChildren(component)) {
    return ids
  }

  component.children.forEach((childId) => {
    const child = components[childId]
    if (!isDefined(child)) {
      return
    }
    collectDescendantIds(child, components).forEach((id) => ids.add(id))
  })

  return ids
}

const removeDeletedChildren = (component: ComponentSchema, deletedIds: Set<string>): ComponentSchema => {
  if (!hasChildren(component)) {
    return component
  }

  return {
    ...component,
    children: component.children.filter((childId) => !deletedIds.has(childId)),
  }
}

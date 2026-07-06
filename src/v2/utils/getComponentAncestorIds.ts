import type { ComponentSchema } from '../schemas/components'
import { getChildIds } from './getChildIds'

export const getComponentAncestorIds = (componentId: string, components: Record<string, ComponentSchema>): string[] => {
  const parentIdsByChildId = new Map<string, string>()

  for (const component of Object.values(components)) {
    for (const childId of getChildIds(component)) {
      parentIdsByChildId.set(childId, component.id)
    }
  }

  const ancestorIds: string[] = []
  let parentId = parentIdsByChildId.get(componentId)

  while (parentId) {
    ancestorIds.push(parentId)
    parentId = parentIdsByChildId.get(parentId)
  }

  return ancestorIds
}

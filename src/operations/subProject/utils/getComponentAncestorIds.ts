import type { SubProjectSchema } from '../../../schemas/subProject'
import { getComponentChildIds } from './getComponentChildIds'

export const getComponentAncestorIds = (componentId: string, subProject: SubProjectSchema): string[] => {
  const parentIdsByChildId = new Map<string, string>()

  for (const component of Object.values(subProject.components)) {
    for (const childId of getComponentChildIds(component)) {
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

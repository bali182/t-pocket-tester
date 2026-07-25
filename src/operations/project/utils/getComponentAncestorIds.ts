import type { ProjectSchema } from '../../../schemas/project'
import { getComponentChildIds } from './getComponentChildIds'

export const getComponentAncestorIds = (componentId: string, project: ProjectSchema): string[] => {
  const parentIdsByChildId = new Map<string, string>()

  for (const component of Object.values(project.components)) {
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

import { ComponentSchema } from '../schemas/components'
import { ProjectSchema } from '../schemas/project'
import { hasChildren } from './hasChildren'
import { isDefined } from './isDefined'

const collectDescendantIds = (component: ComponentSchema, project: ProjectSchema, ids: Set<string>): void => {
  if (!hasChildren(component)) {
    return
  }

  component.children.forEach((childId) => {
    ids.add(childId)
    const child = project.components[childId]
    if (isDefined(child)) {
      collectDescendantIds(child, project, ids)
    }
  })
}

export const getDescendants = (component: ComponentSchema, project: ProjectSchema): string[] => {
  const ids = new Set<string>([component.id])
  collectDescendantIds(component, project, ids)
  return Array.from(ids)
}

import { ComponentSchema } from '../../../schemas/components'
import { ProjectSchema } from '../../../schemas/project'
import { isDefined } from '../../../utils/isDefined'
import { hasComponentChildren } from './hasComponentChildren'

const collectDescendantIds = (component: ComponentSchema, project: ProjectSchema, ids: Set<string>): void => {
  if (!hasComponentChildren(component)) {
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

export const getComponentDescendants = (component: ComponentSchema, project: ProjectSchema): string[] => {
  const ids = new Set<string>([component.id])
  collectDescendantIds(component, project, ids)
  return Array.from(ids)
}

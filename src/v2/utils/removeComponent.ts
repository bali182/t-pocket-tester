import { ComponentSchema } from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'
import { hasChildren } from './hasChildren'
import { isDefined } from './isDefined'

export const removeComponent = (id: string, project: ProjectSchema): ProjectSchema => {
  const component = project.components[id]

  if (!isDefined(component) || component.type === 'root-panel') {
    return project
  }

  const deletedIds = collectDescendantIds(component, project)

  return {
    ...project,
    components: Object.fromEntries(
      Object.entries(project.components)
        .filter(([id]) => !deletedIds.has(id))
        .map(([id, component]) => [id, removeDeletedChildren(component, deletedIds)]),
    ),
  }
}

const collectDescendantIds = (component: ComponentSchema, project: ProjectSchema): Set<string> => {
  const ids = new Set<string>([component.id])

  if (!hasChildren(component)) {
    return ids
  }

  component.children.forEach((childId) => {
    const child = project.components[childId]
    if (!isDefined(child)) {
      return
    }
    collectDescendantIds(child, project).forEach((id) => ids.add(id))
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

import type { ComponentSchema } from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'
import { hasChildren } from './hasChildren'
import { isDefined } from './isDefined'

export const getComponentNestingLevel = (componentId: string, project: ProjectSchema): number => {
  const rootComponent = project.components[project.root]

  if (!isDefined(rootComponent)) {
    return 0
  }

  return findComponentNestingLevel(componentId, rootComponent, project) ?? 0
}

const findComponentNestingLevel = (
  componentId: string,
  component: ComponentSchema,
  project: ProjectSchema,
  currentNestingLevel = 0,
): number | undefined => {
  if (component.id === componentId) {
    return currentNestingLevel
  }

  if (!hasChildren(component)) {
    return undefined
  }

  for (const childId of component.children) {
    const child = project.components[childId]

    if (!isDefined(child)) {
      continue
    }

    const childNestingLevel = findComponentNestingLevel(componentId, child, project, currentNestingLevel + 1)

    if (isDefined(childNestingLevel)) {
      return childNestingLevel
    }
  }

  return undefined
}

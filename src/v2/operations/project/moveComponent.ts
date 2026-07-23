import { ProjectSchema } from '../../schemas/project'
import { isDefined } from '../../utils/isDefined'
import { getComponentDescendants } from './utils/getComponentDescendants'
import { getComponentParent } from './utils/getComponentParent'
import { hasComponentChildren } from './utils/hasComponentChildren'

export type MoveComponentParams = {
  componentId: string
  targetParentId: string
  beforeComponentId: string | undefined
}

export const moveComponent = (
  project: ProjectSchema,
  { beforeComponentId, componentId, targetParentId }: MoveComponentParams,
): ProjectSchema => {
  const movedComponent = project.components[componentId]
  const targetParent = project.components[targetParentId]

  if (!isDefined(movedComponent) || movedComponent.type === 'root-panel' || !hasComponentChildren(targetParent)) {
    return project
  }

  if (getComponentDescendants(movedComponent, project).includes(targetParentId)) {
    return project
  }

  const sourceParent = getComponentParent(componentId, project)

  if (!isDefined(sourceParent)) {
    return project
  }

  const sourceChildren = removeChild(sourceParent.children, componentId)
  const targetChildren = sourceParent.id === targetParent.id ? sourceChildren : targetParent.children
  const updatedTargetChildren = insertChildBefore(targetChildren, componentId, beforeComponentId)

  if (!isDefined(updatedTargetChildren)) {
    return project
  }

  if (sourceParent.id === targetParent.id && areEqualChildren(sourceParent.children, updatedTargetChildren)) {
    return project
  }

  return {
    ...project,
    components: {
      ...project.components,
      [sourceParent.id]: {
        ...sourceParent,
        children: sourceChildren,
      },
      [targetParent.id]: {
        ...targetParent,
        children: updatedTargetChildren,
      },
    },
  }
}

const removeChild = (children: string[], componentId: string): string[] => {
  return children.filter((childId) => childId !== componentId)
}

const insertChildBefore = (
  children: string[],
  componentId: string,
  beforeComponentId: string | undefined,
): string[] | undefined => {
  if (!isDefined(beforeComponentId)) {
    return [...children, componentId]
  }

  const index = children.indexOf(beforeComponentId)

  if (index < 0) {
    return undefined
  }

  return [...children.slice(0, index), componentId, ...children.slice(index)]
}

const areEqualChildren = (firstChildren: string[], secondChildren: string[]): boolean => {
  return (
    firstChildren.length === secondChildren.length &&
    firstChildren.every((childId, index) => childId === secondChildren[index])
  )
}

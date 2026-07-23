import { ComponentSchema, PanelSchema, RootPanelSchema } from '../../../schemas/components'
import { ProjectSchema } from '../../../schemas/project'
import { id } from '../../../utils/id'
import { isDefined } from '../../../utils/isDefined'
import { getComponentParent } from './getComponentParent'
import { hasComponentChildren } from './hasComponentChildren'

export type ResolvedComponentClone = {
  clonedComponents: Record<string, ComponentSchema>
  clonedRootId: string
  sourceIndex: number
  sourceParent: RootPanelSchema | PanelSchema
}

export const resolveComponentClone = (
  project: ProjectSchema,
  componentId: string,
): ResolvedComponentClone | undefined => {
  const sourceComponent = project.components[componentId]

  if (!isDefined(sourceComponent) || sourceComponent.type === 'root-panel') {
    return undefined
  }

  const sourceParent = getComponentParent(componentId, project)

  if (!isDefined(sourceParent)) {
    return undefined
  }

  const sourceIndex = sourceParent.children.indexOf(componentId)

  if (sourceIndex < 0) {
    return undefined
  }

  const sourceComponents: ComponentSchema[] = []
  const visitedComponentIds = new Set<string>()

  if (!collectComponentTree(sourceComponent, project, sourceComponents, visitedComponentIds)) {
    return undefined
  }

  const clonedComponentIds = new Map<string, string>()

  for (const sourceComponent of sourceComponents) {
    clonedComponentIds.set(sourceComponent.id, id())
  }

  const clonedComponents: Record<string, ComponentSchema> = {}

  for (const sourceComponent of sourceComponents) {
    const clonedComponentId = clonedComponentIds.get(sourceComponent.id)

    if (!isDefined(clonedComponentId)) {
      return undefined
    }

    if (!hasComponentChildren(sourceComponent)) {
      clonedComponents[clonedComponentId] = {
        ...sourceComponent,
        id: clonedComponentId,
      }
      continue
    }

    const clonedChildren: string[] = []

    for (const childId of sourceComponent.children) {
      const clonedChildId = clonedComponentIds.get(childId)

      if (!isDefined(clonedChildId)) {
        return undefined
      }

      clonedChildren.push(clonedChildId)
    }

    clonedComponents[clonedComponentId] = {
      ...sourceComponent,
      children: clonedChildren,
      id: clonedComponentId,
    }
  }

  const clonedRootId = clonedComponentIds.get(componentId)

  if (!isDefined(clonedRootId)) {
    return undefined
  }

  return {
    clonedComponents,
    clonedRootId,
    sourceIndex,
    sourceParent,
  }
}

const collectComponentTree = (
  component: ComponentSchema,
  project: ProjectSchema,
  sourceComponents: ComponentSchema[],
  visitedComponentIds: Set<string>,
): boolean => {
  if (visitedComponentIds.has(component.id)) {
    return false
  }

  visitedComponentIds.add(component.id)
  sourceComponents.push(component)

  if (!hasComponentChildren(component)) {
    return true
  }

  for (const childId of component.children) {
    const child = project.components[childId]

    if (!isDefined(child) || !collectComponentTree(child, project, sourceComponents, visitedComponentIds)) {
      return false
    }
  }

  return true
}

import type { ComponentSchema } from '../../schemas/components'
import type { ProjectSchema } from '../../schemas/project'
import { isDefined } from '../../utils/isDefined'
import { getComponentParent } from './utils/getComponentParent'
import { hasComponentChildren } from './utils/hasComponentChildren'

export type CloneComponentParams = {
  componentId: string
  getUnusedId: () => string
  getUnusedName: (sourceName: string, usedComponentNames: Set<string>) => string
}

export type CloneComponentResult = {
  clonedRootId: string
  project: ProjectSchema
}

export const cloneComponent = (
  project: ProjectSchema,
  { componentId, getUnusedId, getUnusedName }: CloneComponentParams,
): CloneComponentResult | undefined => {
  const componentsToClone = getClonedComponents(project, componentId)

  if (!isDefined(componentsToClone)) {
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

  const clonedComponentIdBySourceComponentId = getClonedComponentIdMapping(componentsToClone, getUnusedId)
  const clonedComponentNameById = getClonedComponentNameById(
    project,
    componentsToClone,
    clonedComponentIdBySourceComponentId,
    getUnusedName,
  )
  const componentClones = createComponentClones(
    componentsToClone,
    clonedComponentIdBySourceComponentId,
    clonedComponentNameById,
  )
  const clonedRootId = clonedComponentIdBySourceComponentId[componentId]

  return {
    clonedRootId,
    project: {
      ...project,
      components: {
        ...project.components,
        ...componentClones,
        [sourceParent.id]: {
          ...sourceParent,
          children: [
            ...sourceParent.children.slice(0, sourceIndex + 1),
            clonedRootId,
            ...sourceParent.children.slice(sourceIndex + 1),
          ],
        },
      },
    },
  }
}

const getClonedComponents = (project: ProjectSchema, componentId: string): ComponentSchema[] | undefined => {
  const sourceComponent = project.components[componentId]

  if (!isDefined(sourceComponent) || sourceComponent.type === 'root-panel') {
    return undefined
  }

  const clonedComponents: ComponentSchema[] = []

  if (!collectClonedComponents(project, sourceComponent, clonedComponents, new Set<string>())) {
    return undefined
  }

  return clonedComponents
}

const collectClonedComponents = (
  project: ProjectSchema,
  component: ComponentSchema,
  collectedComponents: ComponentSchema[],
  visitedComponentIds: Set<string>,
): boolean => {
  if (visitedComponentIds.has(component.id)) {
    return false
  }

  visitedComponentIds.add(component.id)
  collectedComponents.push(component)

  if (!hasComponentChildren(component)) {
    return true
  }

  for (const childId of component.children) {
    const child = project.components[childId]

    if (!isDefined(child) || !collectClonedComponents(project, child, collectedComponents, visitedComponentIds)) {
      return false
    }
  }

  return true
}

const getClonedComponentIdMapping = (
  componentsToClone: ComponentSchema[],
  getUnusedId: () => string,
): Record<string, string> => {
  return Object.fromEntries(componentsToClone.map((component) => [component.id, getUnusedId()]))
}

const getClonedComponentNameById = (
  project: ProjectSchema,
  componentsToClone: ComponentSchema[],
  clonedComponentIdBySourceComponentId: Record<string, string>,
  getUnusedName: (sourceName: string, usedComponentNames: Set<string>) => string,
): Record<string, string> => {
  const usedComponentNames = new Set(Object.values(project.components).map((component) => component.name))
  const clonedComponentNameById: Record<string, string> = {}

  for (const component of componentsToClone) {
    const clonedComponentId = clonedComponentIdBySourceComponentId[component.id]
    const clonedComponentName = getUnusedName(component.name, usedComponentNames)

    clonedComponentNameById[clonedComponentId] = clonedComponentName
    usedComponentNames.add(clonedComponentName)
  }

  return clonedComponentNameById
}

const createComponentClones = (
  componentsToClone: ComponentSchema[],
  clonedComponentIdBySourceComponentId: Record<string, string>,
  clonedComponentNameById: Record<string, string>,
): Record<string, ComponentSchema> => {
  return Object.fromEntries(
    componentsToClone.map((sourceComponent) => {
      const componentClone = createComponentClone(
        sourceComponent,
        clonedComponentIdBySourceComponentId,
        clonedComponentNameById,
      )

      return [componentClone.id, componentClone]
    }),
  )
}

const createComponentClone = (
  sourceComponent: ComponentSchema,
  clonedComponentIdBySourceComponentId: Record<string, string>,
  clonedComponentNameById: Record<string, string>,
): ComponentSchema => {
  const clonedComponentId = clonedComponentIdBySourceComponentId[sourceComponent.id]

  if (!hasComponentChildren(sourceComponent)) {
    return {
      ...sourceComponent,
      id: clonedComponentId,
      name: clonedComponentNameById[clonedComponentId],
    }
  }

  return {
    ...sourceComponent,
    children: sourceComponent.children.map((childId) => clonedComponentIdBySourceComponentId[childId]),
    id: clonedComponentId,
    name: clonedComponentNameById[clonedComponentId],
  }
}

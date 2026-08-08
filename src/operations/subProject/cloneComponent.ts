import type { ComponentSchema } from '../../schemas/components'
import type { SubProjectSchema } from '../../schemas/subProject'
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
  subProject: SubProjectSchema
}

export type CloneComponentTreeParams = {
  componentId: string
  getUnusedId: () => string
  getClonedName: (component: ComponentSchema) => string
}

export type CloneComponentTreeResult = {
  clonedComponentIdBySourceComponentId: Record<string, string>
  clonedComponents: Record<string, ComponentSchema>
}

export const cloneComponent = (
  subProject: SubProjectSchema,
  { componentId, getUnusedId, getUnusedName }: CloneComponentParams,
): CloneComponentResult | undefined => {
  const sourceComponent = subProject.components[componentId]

  if (!isDefined(sourceComponent) || sourceComponent.type === 'root-panel') {
    return undefined
  }

  const sourceParent = getComponentParent(componentId, subProject)

  if (!isDefined(sourceParent)) {
    return undefined
  }

  const sourceIndex = sourceParent.children.indexOf(componentId)

  if (sourceIndex < 0) {
    return undefined
  }

  const usedComponentNames = new Set(Object.values(subProject.components).map((component) => component.name))
  const cloneResult = cloneComponentTree(subProject, {
    componentId,
    getUnusedId,
    getClonedName: (component) => {
      const clonedName = getUnusedName(component.name, usedComponentNames)
      usedComponentNames.add(clonedName)
      return clonedName
    },
  })

  if (!isDefined(cloneResult)) {
    return undefined
  }

  const clonedRootId = cloneResult.clonedComponentIdBySourceComponentId[componentId]

  const projectWithClone: SubProjectSchema = {
    ...subProject,
    components: {
      ...subProject.components,
      ...cloneResult.clonedComponents,
      [sourceParent.id]: {
        ...sourceParent,
        children: [
          ...sourceParent.children.slice(0, sourceIndex + 1),
          clonedRootId,
          ...sourceParent.children.slice(sourceIndex + 1),
        ],
      },
    },
  }

  return { clonedRootId, subProject: projectWithClone }
}

export const cloneComponentTree = (
  subProject: SubProjectSchema,
  { componentId, getUnusedId, getClonedName }: CloneComponentTreeParams,
): CloneComponentTreeResult | undefined => {
  const sourceComponent = subProject.components[componentId]

  if (!isDefined(sourceComponent)) {
    return undefined
  }

  const clonedComponents: ComponentSchema[] = []

  if (!collectClonedComponents(subProject, sourceComponent, clonedComponents, new Set<string>())) {
    return undefined
  }

  const clonedComponentIdBySourceComponentId = getClonedComponentIdMapping(clonedComponents, getUnusedId)
  const clonedComponentsById = createComponentClones(
    clonedComponents,
    clonedComponentIdBySourceComponentId,
    getClonedName,
  )

  return {
    clonedComponentIdBySourceComponentId,
    clonedComponents: clonedComponentsById,
  }
}

const collectClonedComponents = (
  subProject: SubProjectSchema,
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
    const child = subProject.components[childId]

    if (!isDefined(child) || !collectClonedComponents(subProject, child, collectedComponents, visitedComponentIds)) {
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

const createComponentClones = (
  componentsToClone: ComponentSchema[],
  clonedComponentIdBySourceComponentId: Record<string, string>,
  getClonedName: (component: ComponentSchema) => string,
): Record<string, ComponentSchema> => {
  return Object.fromEntries(
    componentsToClone.map((sourceComponent) => {
      const componentClone = createComponentClone(
        sourceComponent,
        clonedComponentIdBySourceComponentId,
        getClonedName(sourceComponent),
      )

      return [componentClone.id, componentClone]
    }),
  )
}

const createComponentClone = (
  sourceComponent: ComponentSchema,
  clonedComponentIdBySourceComponentId: Record<string, string>,
  clonedComponentName: string,
): ComponentSchema => {
  const clonedComponentId = clonedComponentIdBySourceComponentId[sourceComponent.id]

  if (!hasComponentChildren(sourceComponent)) {
    return {
      ...sourceComponent,
      id: clonedComponentId,
      name: clonedComponentName,
    }
  }

  return {
    ...sourceComponent,
    children: sourceComponent.children.map((childId) => clonedComponentIdBySourceComponentId[childId]),
    id: clonedComponentId,
    name: clonedComponentName,
  }
}

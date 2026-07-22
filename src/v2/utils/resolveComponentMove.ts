import type { ComponentSchema, PanelSchema, RootPanelSchema } from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'
import { getDescendants } from './getDescendants'
import { getParent } from './getParent'
import { hasChildren } from './hasChildren'
import { isDefined } from './isDefined'

type ResolvedComponentMove = {
  beforeComponentId: string | undefined
  movedComponent: ComponentSchema
  sourceParent: RootPanelSchema | PanelSchema
  targetParent: RootPanelSchema | PanelSchema
}

export const resolveComponentMove = (
  project: ProjectSchema,
  componentId: string,
  targetParentId: string,
  beforeComponentId: string | undefined,
): ResolvedComponentMove | undefined => {
  const movedComponent = project.components[componentId]
  const targetParent = project.components[targetParentId]

  if (!isDefined(movedComponent) || !hasChildren(targetParent) || movedComponent.type === 'root-panel') {
    return undefined
  }

  const blockedTargetComponentIds = new Set(getDescendants(movedComponent, project))

  if (blockedTargetComponentIds.has(targetParentId)) {
    return undefined
  }

  const sourceParent = getParent(componentId, project)

  if (!isDefined(sourceParent)) {
    return undefined
  }

  if (isDefined(beforeComponentId) && beforeComponentId !== componentId && !targetParent.children.includes(beforeComponentId)) {
    return undefined
  }

  return {
    beforeComponentId,
    movedComponent,
    sourceParent,
    targetParent,
  }
}

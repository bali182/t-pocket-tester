import { ComponentSchema, PanelSchema, RootPanelSchema } from '../../../schemas/components'
import { ProjectSchema } from '../../../schemas/project'
import { isDefined } from '../../../utils/isDefined'
import { getComponentDescendants } from './getComponentDescendants'
import { getComponentParent } from './getComponentParent'
import { hasComponentChildren } from './hasComponentChildren'

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

  if (!isDefined(movedComponent) || !hasComponentChildren(targetParent) || movedComponent.type === 'root-panel') {
    return undefined
  }

  const blockedTargetComponentIds = new Set(getComponentDescendants(movedComponent, project))

  if (blockedTargetComponentIds.has(targetParentId)) {
    return undefined
  }

  const sourceParent = getComponentParent(componentId, project)

  if (!isDefined(sourceParent)) {
    return undefined
  }

  if (
    isDefined(beforeComponentId) &&
    beforeComponentId !== componentId &&
    !targetParent.children.includes(beforeComponentId)
  ) {
    return undefined
  }

  return {
    beforeComponentId,
    movedComponent,
    sourceParent,
    targetParent,
  }
}

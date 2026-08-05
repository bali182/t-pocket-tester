import type { PanelSchema, RootPanelSchema } from '../../../schemas/components'
import type { SubProjectSchema } from '../../../schemas/subProject'
import { hasComponentChildren } from './hasComponentChildren'

export const getComponentParent = (
  componentId: string,
  subProject: SubProjectSchema,
): RootPanelSchema | PanelSchema | undefined => {
  return Object.values(subProject.components).find(
    (component): component is RootPanelSchema | PanelSchema =>
      hasComponentChildren(component) && component.children.includes(componentId),
  )
}

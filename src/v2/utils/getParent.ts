import type { ComponentSchema, PanelSchema, RootPanelSchema } from '../schemas/components'
import { hasChildren } from './hasChildren'

export const getParent = (
  componentId: string,
  components: Record<string, ComponentSchema>,
): RootPanelSchema | PanelSchema | undefined => {
  return Object.values(components).find(
    (component): component is RootPanelSchema | PanelSchema =>
      hasChildren(component) && component.children.includes(componentId),
  )
}

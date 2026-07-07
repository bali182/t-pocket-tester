import type { ComponentSchema, PanelSchema, RootPanelSchema } from '../schemas/components'

export const hasChildren = (component: ComponentSchema): component is RootPanelSchema | PanelSchema => {
  return component.type === 'root-panel' || component.type === 'panel'
}

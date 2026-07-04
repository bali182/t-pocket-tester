import type { ComponentSchema, PanelSchema, RootPanelSchema } from '../schemas/components'

export type HasChildren = RootPanelSchema | PanelSchema

export const hasChildren = (component: ComponentSchema): component is HasChildren => {
  return component.type === 'root-panel' || component.type === 'panel'
}

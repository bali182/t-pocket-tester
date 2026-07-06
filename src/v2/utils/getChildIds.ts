import { ComponentSchema } from '../schemas/components'

export const getChildIds = (component: ComponentSchema): string[] => {
  switch (component.type) {
    case 'root-panel':
    case 'panel':
      return component.children ?? []
    default:
      return []
  }
}

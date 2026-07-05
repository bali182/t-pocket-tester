import type { ComponentSchema } from '../schemas/components'

const getChildIds = (component: ComponentSchema): string[] => {
  switch (component.type) {
    case 'root-panel':
    case 'panel':
      return component.children ?? []
    default:
      return []
  }
}

export const getChildren = (
  component: ComponentSchema,
  components: Record<string, ComponentSchema>,
): ComponentSchema[] => {
  return getChildIds(component).map((id) => {
    const component = components[id]

    if (!component) {
      throw new Error(`Child component not found: ${id}`)
    }

    return component
  })
}

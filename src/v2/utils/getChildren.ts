import type { ComponentSchema } from '../schemas/components'
import { getChildIds } from './getChildIds'

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

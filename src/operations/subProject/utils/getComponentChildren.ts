import type { ComponentSchema } from '../../../schemas/components'
import type { SubProjectSchema } from '../../../schemas/subProject'
import { isDefined } from '../../../utils/isDefined'
import { getComponentChildIds } from './getComponentChildIds'

export const getComponentChildren = (component: ComponentSchema, subProject: SubProjectSchema): ComponentSchema[] => {
  return getComponentChildIds(component).map((id) => {
    const component = subProject.components[id]

    if (!isDefined(component)) {
      throw new Error(`Child component not found: ${id}`)
    }

    return component
  })
}

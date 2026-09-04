import type { ComponentSchema } from '../../../schemas/components'
import type { SubProjectSchema } from '../../../schemas/subProject'
import { accessors } from '../../../utils/accessors'
import { getComponentChildIds } from './getComponentChildIds'

export const getComponentChildren = (component: ComponentSchema, subProject: SubProjectSchema): ComponentSchema[] => {
  const accessor = accessors.subProject(subProject)
  return getComponentChildIds(component).map((id) => accessor.component(id))
}

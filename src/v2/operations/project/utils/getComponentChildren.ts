import type { ComponentSchema } from '../../../schemas/components'
import type { ProjectSchema } from '../../../schemas/project'
import { isDefined } from '../../../utils/isDefined'
import { getComponentChildIds } from './getComponentChildIds'

export const getComponentChildren = (component: ComponentSchema, project: ProjectSchema): ComponentSchema[] => {
  return getComponentChildIds(component).map((id) => {
    const component = project.components[id]

    if (!isDefined(component)) {
      throw new Error(`Child component not found: ${id}`)
    }

    return component
  })
}

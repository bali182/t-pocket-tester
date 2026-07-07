import type { ComponentSchema } from '../schemas/components'
import type { ProjectSchema } from '../schemas/project'
import { getChildIds } from './getChildIds'
import { isDefined } from './isDefined'

export const getChildren = (component: ComponentSchema, project: ProjectSchema): ComponentSchema[] => {
  return getChildIds(component).map((id) => {
    const component = project.components[id]

    if (!isDefined(component)) {
      throw new Error(`Child component not found: ${id}`)
    }

    return component
  })
}

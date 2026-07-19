import type { ComponentSchema } from '../schemas/components'
import { isDefined } from '../utils/isDefined'
import { useProject } from './useProject'

export const useComponent = <T extends ComponentSchema = ComponentSchema>(id: string): T => {
  const { project } = useProject()
  const component = project.components[id]

  if (!isDefined(component)) {
    throw new Error(`Component not found: ${id}`)
  }

  return component as T
}

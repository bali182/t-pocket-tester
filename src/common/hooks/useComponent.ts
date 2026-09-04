import type { ComponentSchema } from '../schemas/components'
import { isDefined } from '../utils/isDefined'
import { useSubProject } from './useSubProject'

export const useComponent = <T extends ComponentSchema = ComponentSchema>(id: string): T => {
  const { subProject } = useSubProject()
  const component = subProject.components[id]

  if (!isDefined(component)) {
    throw new Error(`Component not found: ${id}`)
  }

  return component as T
}

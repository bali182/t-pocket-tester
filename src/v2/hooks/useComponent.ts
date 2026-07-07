import { useAtomValue } from 'jotai'

import type { ComponentSchema } from '../schemas/components'
import { projectAtom } from '../state'
import { isDefined } from '../utils/isDefined'

export const useComponent = <T extends ComponentSchema = ComponentSchema>(id: string): T => {
  const project = useAtomValue(projectAtom)
  const component = project.components[id]

  if (!isDefined(component)) {
    throw new Error(`Component not found: ${id}`)
  }

  return component as T
}

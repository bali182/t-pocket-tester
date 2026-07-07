import { useAtomValue } from 'jotai'

import type { ComponentSchema } from '../schemas/components'
import { projectAtom } from '../state'
import { isDefined } from '../utils/isDefined'

export const useChild = (id: string): ComponentSchema => {
  const project = useAtomValue(projectAtom)
  const component = project.components[id]

  if (!isDefined(component)) {
    throw new Error(`Child component not found: ${id}`)
  }

  return component
}

import { useAtomValue } from 'jotai'

import type { ComponentSchema } from '../schemas/components'
import { componentsAtom } from '../state'

export const useChild = (id: string): ComponentSchema => {
  const components = useAtomValue(componentsAtom)
  const component = components[id]

  if (!component) {
    throw new Error(`Child component not found: ${id}`)
  }

  return component
}

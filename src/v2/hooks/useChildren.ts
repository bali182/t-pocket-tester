import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import type { ComponentSchema } from '../schemas/components'
import { componentsAtom } from '../state'

export const useChildren = (ids: string[]): ComponentSchema[] => {
  const components = useAtomValue(componentsAtom)

  return useMemo<ComponentSchema[]>(() => {
    return ids.map((id) => {
      const component = components[id]

      if (!component) {
        throw new Error(`Child component not found: ${id}`)
      }

      return component
    })
  }, [components, ids])
}

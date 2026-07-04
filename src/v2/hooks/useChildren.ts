import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import type { ComponentSchema } from '../schemas/components'
import { componentsAtom } from '../state'

export const useChildren = (component: ComponentSchema): ComponentSchema[] => {
  const childIds = useMemo(() => {
    switch (component.type) {
      case 'root-panel':
      case 'panel':
        return component.children ?? []
      default:
        return []
    }
  }, [component])

  const components = useAtomValue(componentsAtom)

  return useMemo<ComponentSchema[]>(() => {
    return childIds.map((id) => {
      const component = components[id]

      if (!component) {
        throw new Error(`Child component not found: ${id}`)
      }

      return component
    })
  }, [components, childIds])
}

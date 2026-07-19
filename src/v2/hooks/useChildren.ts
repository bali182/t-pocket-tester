import { useAtomValue } from 'jotai'
import { useMemo } from 'react'

import type { ComponentSchema } from '../schemas/components'
import { projectAtom } from '../state/projectAtom'
import { getChildren } from '../utils/getChildren'

export const useChildren = (component: ComponentSchema): ComponentSchema[] => {
  const project = useAtomValue(projectAtom)

  return useMemo<ComponentSchema[]>(() => {
    return getChildren(component, project)
  }, [component, project])
}

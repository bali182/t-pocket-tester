import { useMemo } from 'react'

import { getComponentChildren } from '../operations/subProject/utils/getComponentChildren'
import type { ComponentSchema } from '../schemas/components'
import { useSubProject } from './useSubProject'

export const useChildren = (component: ComponentSchema): ComponentSchema[] => {
  const { subProject } = useSubProject()

  return useMemo<ComponentSchema[]>(() => {
    return getComponentChildren(component, subProject)
  }, [component, subProject])
}

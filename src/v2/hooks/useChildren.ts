import { useMemo } from 'react'

import type { ComponentSchema } from '../schemas/components'
import { getChildren } from '../utils/getChildren'
import { useProject } from './useProject'

export const useChildren = (component: ComponentSchema): ComponentSchema[] => {
  const { project } = useProject()

  return useMemo<ComponentSchema[]>(() => {
    return getChildren(component, project)
  }, [component, project])
}

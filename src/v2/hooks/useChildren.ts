import { useMemo } from 'react'

import type { ComponentSchema } from '../schemas/components'
import { getComponentChildren } from '../operations/project/utils/getComponentChildren'
import { useProject } from './useProject'

export const useChildren = (component: ComponentSchema): ComponentSchema[] => {
  const { project } = useProject()

  return useMemo<ComponentSchema[]>(() => {
    return getComponentChildren(component, project)
  }, [component, project])
}

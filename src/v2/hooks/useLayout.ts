import { useMemo } from 'react'

import { useAtomValue } from 'jotai'
import { calculateLayoutBoundingBoxes } from '../logic/calculateLayoutBoundingBoxes'
import type { PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import type { RectSchema } from '../schemas/geometry'
import { componentsAtom } from '../state'

type LayoutComponent = RootPanelSchema | PanelSchema
type LayoutChildComponent = PanelSchema | PocketClusterSchema

type UseLayoutParams = {
  rect: RectSchema
  component: LayoutComponent
}

export const useLayout = ({ rect, component }: UseLayoutParams): [LayoutChildComponent, RectSchema][] => {
  const components = useAtomValue(componentsAtom)
  return useMemo<[LayoutChildComponent, RectSchema][]>(
    () => calculateLayoutBoundingBoxes(component, components, rect),
    [component, components, rect],
  )
}

import { createContext, useContext } from 'react'

import type { ComponentSchema } from '../schemas/components'
import { noop } from '../utils/noop'

export type DrawAreaContextValue = {
  component: ComponentSchema | undefined
  element: SVGGraphicsElement | undefined
  isInteractive: boolean
  onComponentClick: (component: ComponentSchema, element: SVGGraphicsElement) => void
}

export const DrawAreaContext = createContext<DrawAreaContextValue>({
  component: undefined,
  element: undefined,
  isInteractive: false,
  onComponentClick: noop,
})

export const useDrawAreaContext = (): DrawAreaContextValue => {
  return useContext(DrawAreaContext)
}

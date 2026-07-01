import { createContext, useContext } from 'react'

import type { ComponentSchema } from '../schemas/components'

export type DrawAreaContextValue = {
  isInteractive: boolean
  onComponentClick: (component: ComponentSchema, element: SVGGraphicsElement) => void
  getHoverBackgroundColor: (component: ComponentSchema) => string
}

export const DrawAreaContext = createContext<DrawAreaContextValue>({
  isInteractive: false,
  onComponentClick: () => undefined,
  getHoverBackgroundColor: (component) => component.color,
})

export const useDrawAreaContext = (): DrawAreaContextValue => {
  return useContext(DrawAreaContext)
}

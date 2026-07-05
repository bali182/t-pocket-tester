import { createContext, useContext } from 'react'

import type { ComponentSchema } from '../schemas/components'
import { noop } from '../utils/noop'

export type EditedComponent = {
  component: ComponentSchema
  element: SVGGraphicsElement
}

export type DrawAreaContextValue = {
  editedComponent: EditedComponent | undefined
  isInteractive: boolean
  onComponentClick: (component: ComponentSchema, element: SVGGraphicsElement) => void
}

export const DrawAreaContext = createContext<DrawAreaContextValue>({
  editedComponent: undefined,
  isInteractive: false,
  onComponentClick: noop,
})

export const useDrawAreaContext = (): DrawAreaContextValue => {
  return useContext(DrawAreaContext)
}

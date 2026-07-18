import { createContext, useContext } from 'react'

import { noop } from '../utils/noop'

export type DrawAreaContextValue = {
  clearSelection: () => void
  isComponentSelected: (componentId: string) => boolean
  isInteractive: boolean
  selectComponent: (componentId: string) => void
  selectStitchLine: (stitchLineId: string) => void
}

export const DrawAreaContext = createContext<DrawAreaContextValue>({
  clearSelection: noop,
  isComponentSelected: () => false,
  isInteractive: false,
  selectComponent: noop,
  selectStitchLine: noop,
})

export const useDrawAreaContext = (): DrawAreaContextValue => {
  return useContext(DrawAreaContext)
}

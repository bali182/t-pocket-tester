import { createContext, useContext } from 'react'
import { ComponentSchema } from '../schemas/components'
import { HoleSchema } from '../schemas/hole'
import { SelectionSchema } from '../schemas/selection'
import { StitchLineSchema } from '../schemas/stitching'
import { noop } from '../utils/noop'
import { produce } from '../utils/produce'

export type SubProjectSelectionContextValue = {
  selectedComponent: ComponentSchema | undefined
  selectedStitchLine: StitchLineSchema | undefined
  selectedHole: HoleSchema | undefined
  hoveredStitchLineId: string | undefined
  hoveredTreeSelection: SelectionSchema | undefined
  editorSelection: SelectionSchema | undefined
  clearSelection: () => void
  isComponentSelected: (componentId: string) => boolean
  selectComponent: (componentId: string) => void
  selectStitchLine: (stitchLineId: string) => void
  selectHole: (holeId: string) => void
  setHoveredStitchLine: (stitchLineId: string | undefined) => void
  setHoveredTreeSelection: (selection: SelectionSchema | undefined) => void
}

export const defaultSubProjectSelection: SubProjectSelectionContextValue = {
  selectedComponent: undefined,
  selectedStitchLine: undefined,
  selectedHole: undefined,
  hoveredStitchLineId: undefined,
  hoveredTreeSelection: undefined,
  editorSelection: undefined,
  clearSelection: noop,
  isComponentSelected: produce(false),
  selectComponent: noop,
  selectStitchLine: noop,
  selectHole: noop,
  setHoveredStitchLine: noop,
  setHoveredTreeSelection: noop,
}

export const SubProjectSelectionContext = createContext<SubProjectSelectionContextValue>(defaultSubProjectSelection)

export const useSubProjectSelectionContext = () => {
  return useContext(SubProjectSelectionContext)
}

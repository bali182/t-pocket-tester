import { createContext, useContext } from 'react'

import { ComponentSchema } from '../schemas/components'
import { StitchLineSchema } from '../schemas/stitching'
import { noop } from '../utils/noop'
import { produce } from '../utils/produce'

export type DrawAreaSelection = {
  highlightedComponentId: string | undefined
  selectedComponent: ComponentSchema | undefined
  selectedStitchLine: StitchLineSchema | undefined
  clearSelection: () => void
  isComponentSelected: (componentId: string) => boolean
  selectComponent: (componentId: string) => void
  selectStitchLine: (stitchLineId: string) => void
}

export type DrawAreaComponentStyles = {
  getBackgroundColor: (component: ComponentSchema, isHovered: boolean) => string | undefined
  getBorderColor: (component: ComponentSchema, isHovered: boolean) => string | undefined
  getBorderThickness: (component: ComponentSchema, isHovered: boolean) => number | undefined
  getFilter: (component: ComponentSchema, isHovered: boolean) => string | undefined
}

export type DrawAreaStitchLineStyles = {
  getLineColor: (stitchLine: StitchLineSchema) => string | undefined
  getLineThickness: (stitchLine: StitchLineSchema) => number | undefined
  getStitchHoleColor: (stitchLine: StitchLineSchema) => string | undefined
  getStitchHoleThickness: (stitchLine: StitchLineSchema) => number | undefined
}

export type DrawAreaContextValue = {
  isInteractive: boolean
  selection: DrawAreaSelection
  stitchLineStyles: DrawAreaStitchLineStyles
  componentStyles: DrawAreaComponentStyles
}

const drawAreaDefaultSelection: DrawAreaSelection = {
  highlightedComponentId: undefined,
  selectedComponent: undefined,
  selectedStitchLine: undefined,
  clearSelection: noop,
  isComponentSelected: () => false,
  selectComponent: noop,
  selectStitchLine: noop,
}

const drawAreaDefaultStitchLineStyles: DrawAreaStitchLineStyles = {
  getLineColor: produce(undefined),
  getLineThickness: produce(undefined),
  getStitchHoleColor: produce(undefined),
  getStitchHoleThickness: produce(undefined),
}

const drawAreaDefaultComponentStyles: DrawAreaComponentStyles = {
  getBackgroundColor: produce(undefined),
  getBorderColor: produce(undefined),
  getBorderThickness: produce(undefined),
  getFilter: produce(undefined),
}

const defaultDrawAreaContext: DrawAreaContextValue = {
  isInteractive: false,
  selection: drawAreaDefaultSelection,
  stitchLineStyles: drawAreaDefaultStitchLineStyles,
  componentStyles: drawAreaDefaultComponentStyles,
}

export const DrawAreaContext = createContext<DrawAreaContextValue>(defaultDrawAreaContext)

export const useDrawAreaContext = (): DrawAreaContextValue => {
  return useContext(DrawAreaContext)
}

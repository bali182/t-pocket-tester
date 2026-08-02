import { createContext, useContext } from 'react'

import { ComponentSchema, PocketClusterSchema } from '../schemas/components'
import { HoleSchema } from '../schemas/hole'
import { EditorSelectionSchema } from '../schemas/selection'
import { StitchLineSchema } from '../schemas/stitching'
import { SvgExportElementSchema } from '../schemas/svgExport'
import { noop } from '../utils/noop'
import { produce } from '../utils/produce'

export type DrawAreaSelection = {
  selectedComponent: ComponentSchema | undefined
  selectedStitchLine: StitchLineSchema | undefined
  selectedHole: HoleSchema | undefined
  hoveredStitchLineId: string | undefined
  editorSelection: EditorSelectionSchema | undefined
  clearSelection: () => void
  isComponentSelected: (componentId: string) => boolean
  selectComponent: (componentId: string) => void
  selectStitchLine: (stitchLineId: string) => void
  selectHole: (holeId: string) => void
  setHoveredStitchLine: (stitchLineId: string | undefined) => void
}

export type DrawAreaComponentStyles = {
  getBackgroundColor: (component: ComponentSchema, nestingLevel: number, isHovered: boolean) => string | undefined
  getBorderColor: (component: ComponentSchema, isHovered: boolean) => string | undefined
  getBorderThickness: (component: ComponentSchema, isHovered: boolean) => number | undefined
  getFilter: (component: ComponentSchema, isHovered: boolean) => string | undefined
}

export type DrawAreaCardStyles = {
  getBackgroundColor: (owner: PocketClusterSchema, isParentHovered: boolean) => string | undefined
  getStrokeColor: (owner: PocketClusterSchema, isParentHovered: boolean) => string | undefined
  getStrokeThickness: (owner: PocketClusterSchema, isParentHovered: boolean) => number | undefined
}

export type DrawAreaStitchLineStyles = {
  getLineColor: (stitchLine: StitchLineSchema) => string | undefined
  getLineThickness: (stitchLine: StitchLineSchema) => number | undefined
  getStitchHoleColor: (stitchLine: StitchLineSchema) => string | undefined
  getStitchHoleThickness: (stitchLine: StitchLineSchema) => number | undefined
}

export type DrawAreaHoleStyles = {
  getFillColor: (hole: HoleSchema, isHovered: boolean) => string | undefined
  getStrokeColor: (hole: HoleSchema, isHovered: boolean) => string | undefined
  getStrokeThickness: (hole: HoleSchema, isHovered: boolean) => number | undefined
}

export type DrawAreaExportTextStyles = {
  getNameText: (element: SvgExportElementSchema) => string | undefined
  getNameTextColor: (element: SvgExportElementSchema) => string | undefined
  getNameTextFontFamily: (element: SvgExportElementSchema) => string | undefined
  getNameTextFontSize: (element: SvgExportElementSchema) => number | undefined
  getDimensionsText: (element: SvgExportElementSchema) => string | undefined
  getDimensionsTextColor: (element: SvgExportElementSchema) => string | undefined
  getDimensionsTextFontFamily: (element: SvgExportElementSchema) => string | undefined
  getDimensionsTextFontSize: (element: SvgExportElementSchema) => number | undefined
  getNameDimensionsGap: (element: SvgExportElementSchema) => number | undefined
}

export type DrawAreaMarkerStyles = {
  getColor: () => string | undefined
  getThickness: () => number | undefined
}

export type DrawAreaContextValue = {
  isInteractive: boolean
  isShowingCards: boolean
  selection: DrawAreaSelection
  holeStyles: DrawAreaHoleStyles
  stitchLineStyles: DrawAreaStitchLineStyles
  componentStyles: DrawAreaComponentStyles
  cardStyles: DrawAreaCardStyles
  exportTextStyles: DrawAreaExportTextStyles
  markerStyles: DrawAreaMarkerStyles
}

const drawAreaDefaultSelection: DrawAreaSelection = {
  selectedComponent: undefined,
  selectedStitchLine: undefined,
  selectedHole: undefined,
  hoveredStitchLineId: undefined,
  editorSelection: undefined,
  clearSelection: noop,
  isComponentSelected: () => false,
  selectComponent: noop,
  selectStitchLine: noop,
  selectHole: noop,
  setHoveredStitchLine: noop,
}

const drawAreaDefaultStitchLineStyles: DrawAreaStitchLineStyles = {
  getLineColor: produce(undefined),
  getLineThickness: produce(undefined),
  getStitchHoleColor: produce(undefined),
  getStitchHoleThickness: produce(undefined),
}

const drawAreaDefaultHoleStyles: DrawAreaHoleStyles = {
  getFillColor: produce(undefined),
  getStrokeColor: produce(undefined),
  getStrokeThickness: produce(undefined),
}

const drawAreaDefaultComponentStyles: DrawAreaComponentStyles = {
  getBackgroundColor: produce(undefined),
  getBorderColor: produce(undefined),
  getBorderThickness: produce(undefined),
  getFilter: produce(undefined),
}

const drawAreaDefaultCardStyles: DrawAreaCardStyles = {
  getBackgroundColor: produce(undefined),
  getStrokeColor: produce(undefined),
  getStrokeThickness: produce(undefined),
}

const drawAreaDefaultExportTextStyles: DrawAreaExportTextStyles = {
  getNameText: produce(undefined),
  getNameTextColor: produce(undefined),
  getNameTextFontFamily: produce(undefined),
  getNameTextFontSize: produce(undefined),
  getDimensionsText: produce(undefined),
  getDimensionsTextColor: produce(undefined),
  getDimensionsTextFontFamily: produce(undefined),
  getDimensionsTextFontSize: produce(undefined),
  getNameDimensionsGap: produce(undefined),
}

const drawAreaDefaultMarkerStyles: DrawAreaMarkerStyles = {
  getColor: produce(undefined),
  getThickness: produce(undefined),
}

const defaultDrawAreaContext: DrawAreaContextValue = {
  isInteractive: false,
  isShowingCards: false,
  selection: drawAreaDefaultSelection,
  holeStyles: drawAreaDefaultHoleStyles,
  stitchLineStyles: drawAreaDefaultStitchLineStyles,
  componentStyles: drawAreaDefaultComponentStyles,
  cardStyles: drawAreaDefaultCardStyles,
  exportTextStyles: drawAreaDefaultExportTextStyles,
  markerStyles: drawAreaDefaultMarkerStyles,
}

export const DrawAreaContext = createContext<DrawAreaContextValue>(defaultDrawAreaContext)

export const useDrawAreaContext = (): DrawAreaContextValue => {
  return useContext(DrawAreaContext)
}

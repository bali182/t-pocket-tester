import { useMemo } from 'react'
import { COMPONENT_DIMENSIONS_COLOR, COMPONENT_NAME_COLOR, STROKE_COLOR, STROKE_THICKNESS } from '../constants/drawing'
import {
  DrawAreaCardStyles,
  DrawAreaComponentStyles,
  DrawAreaContextValue,
  DrawAreaExportIdentifiers,
  DrawAreaExportTextStyles,
  DrawAreaHoleStyles,
  DrawAreaMarkerStyles,
  DrawAreaSelection,
  DrawAreaStitchLineStyles,
} from '../contexts/DrawAreaContext'
import { getSvgExportElementBoundingRect } from '../logic/exports/getSvgExportElementBoundingRect'
import type { ProjectSchema } from '../schemas/project'
import type { SvgExportParamsSchema } from '../schemas/svgExport'
import { useTranslation } from '../translations/translation'
import { noop } from '../utils/noop'
import { produce } from '../utils/produce'

const drawAreaSelection: DrawAreaSelection = {
  clearSelection: noop,
  isComponentSelected: produce(false),
  selectComponent: noop,
  selectStitchLine: noop,
  selectHole: noop,
  setHoveredStitchLine: noop,
  setHoveredTreeSelection: noop,
  selectedComponent: undefined,
  selectedStitchLine: undefined,
  selectedHole: undefined,
  hoveredStitchLineId: undefined,
  hoveredTreeSelection: undefined,
  editorSelection: undefined,
}

export const useSvgDrawArea = (project: ProjectSchema, params: SvgExportParamsSchema): DrawAreaContextValue => {
  const t = useTranslation()
  const componentStyles = useMemo<DrawAreaComponentStyles>(
    () => ({
      getBackgroundColor: produce('none'),
      getBorderColor: produce(STROKE_COLOR),
      getBorderThickness: produce(STROKE_THICKNESS),
      getFilter: produce(undefined),
    }),
    [],
  )

  const cardStyles = useMemo<DrawAreaCardStyles>(
    () => ({
      getBackgroundColor: produce(undefined),
      getStrokeColor: produce(undefined),
      getStrokeThickness: produce(undefined),
    }),
    [],
  )

  const stitchLineStyles = useMemo<DrawAreaStitchLineStyles>(
    () => ({
      getLineColor: produce(STROKE_COLOR),
      getLineThickness: (stitchLine) => {
        return stitchLine.stitchLineThickness ?? project.stitchingSettings.stitchLineThickness
      },
      getStitchHoleColor: produce(STROKE_COLOR),
      getStitchHoleThickness: (stitchLine) => {
        return stitchLine.stitchHoleThickness ?? project.stitchingSettings.stitchHoleThickness
      },
    }),
    [project.stitchingSettings.stitchHoleThickness, project.stitchingSettings.stitchLineThickness],
  )

  const holeStyles = useMemo<DrawAreaHoleStyles>(
    () => ({
      getFillColor: produce('transparent'),
      getStrokeColor: produce('transparent'),
      getStrokeThickness: produce(STROKE_THICKNESS),
    }),
    [],
  )

  const exportIdentifiers = useMemo<DrawAreaExportIdentifiers>(
    () => ({
      getElementId: (element) => {
        return element.id
      },
      getStitchLineId: (stitchLine) => {
        return stitchLine.id
      },
      getNameText: (element) => {
        if (!params.showNames) {
          return undefined
        }

        switch (element.type) {
          case 'svg-export-panel':
            return element.component.name
          case 'svg-export-front-pocket':
            return t.svgExport.frontPocketName(element.ownerComponent.name)
          case 'svg-export-t-pocket':
            return t.svgExport.tPocketName(element.ownerComponent.name, element.pocketIndex + 1)
        }
      },
    }),
    [params.showNames, t.svgExport],
  )

  const exportTextStyles = useMemo<DrawAreaExportTextStyles>(
    () => ({
      getNameTextColor: produce(COMPONENT_NAME_COLOR),
      getNameTextFontFamily: produce('sans-serif'),
      getNameTextFontSize: produce(3),
      getDimensionsText: (element) => {
        if (!params.showDimensions) {
          return undefined
        }

        const boundingRect = getSvgExportElementBoundingRect(element)
        return t.svgExport.dimensions(boundingRect.width.toFixed(1), boundingRect.height.toFixed(1))
      },
      getDimensionsTextColor: produce(COMPONENT_DIMENSIONS_COLOR),
      getDimensionsTextFontFamily: produce('sans-serif'),
      getDimensionsTextFontSize: produce(2.5),
      getNameDimensionsGap: produce(1),
    }),
    [params.showDimensions, t],
  )

  const markerStyles = useMemo<DrawAreaMarkerStyles>(
    () => ({
      getColor: produce('#666666'),
      getThickness: produce(0.3),
    }),
    [],
  )

  const drawAreaContextValue = useMemo<DrawAreaContextValue>(
    () => ({
      isInteractive: false,
      isShowingCards: false,
      selection: drawAreaSelection,
      holeStyles,
      componentStyles,
      cardStyles,
      stitchLineStyles,
      exportTextStyles,
      markerStyles,
      exportIdentifiers,
    }),
    [cardStyles, componentStyles, exportIdentifiers, exportTextStyles, holeStyles, markerStyles, stitchLineStyles],
  )

  return drawAreaContextValue
}

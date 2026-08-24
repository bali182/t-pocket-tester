import { useCallback, useMemo } from 'react'
import {
  CARD_COLOR,
  SELECTED_HOLE_FILL_COLOR,
  SELECTED_HOLE_STROKE_COLOR,
  SELECTED_STITCH_LINE_HOLE_COLOR,
  SELECTED_STITCH_LINE_STROKE_COLOR,
  SELECTED_STROKE_COLOR,
  STROKE_COLOR,
  STROKE_THICKNESS,
} from '../constants/drawing'
import {
  DrawAreaCardStyles,
  DrawAreaComponentStyles,
  DrawAreaContextValue,
  DrawAreaExportIdentifiers,
  DrawAreaExportTextStyles,
  DrawAreaHoleStyles,
  DrawAreaMarkerStyles,
  DrawAreaStitchLineStyles,
} from '../contexts/DrawAreaContext'
import { getComponentColor } from '../utils/getComponentColor'
import { isDefined } from '../utils/isDefined'
import { produce } from '../utils/produce'
import { useProject } from './useProject'
import { useSubProject } from './useSubProject'

import { formatHex8, parse } from 'culori'
import { getSelectionObstructingComponentIds } from '../logic/getSelectionObstructingComponentIds'
import { useSubProjectSelection } from './useSubProjectSelection'

const addAlpha = (color: string): string => {
  const parsed = parse(color)
  if (!isDefined(parsed)) {
    return color
  }
  return formatHex8({ ...parsed, alpha: 0.3 })
}

const exportIdentifiers: DrawAreaExportIdentifiers = {
  getElementId: produce(undefined),
  getNameText: produce(undefined),
  getStitchLineId: produce(undefined),
}

const exportTextStyles: DrawAreaExportTextStyles = {
  getNameTextColor: produce(undefined),
  getNameTextFontFamily: produce(undefined),
  getNameTextFontSize: produce(undefined),
  getDimensionsText: produce(undefined),
  getDimensionsTextColor: produce(undefined),
  getDimensionsTextFontFamily: produce(undefined),
  getDimensionsTextFontSize: produce(undefined),
  getNameDimensionsGap: produce(undefined),
}

const markerStyles: DrawAreaMarkerStyles = {
  getColor: produce(undefined),
  getThickness: produce(undefined),
}

export const useEditorDrawArea = (): DrawAreaContextValue => {
  const { project } = useProject()
  const { subProject } = useSubProject()
  const drawAreaSelection = useSubProjectSelection(subProject)
  const {
    editorSelection: selection,
    hoveredStitchLineId,
    hoveredTreeSelection,
    selectedHole,
    selectedStitchLine,
    isComponentSelected,
  } = drawAreaSelection

  const selectionObstructingComponentIds = useMemo<ReadonlySet<string>>(
    () => getSelectionObstructingComponentIds(hoveredTreeSelection ?? selection, subProject),
    [hoveredTreeSelection, subProject, selection],
  )

  const isComponentTreeHovered = useCallback(
    (componentId: string): boolean =>
      hoveredTreeSelection?.type === 'component' && hoveredTreeSelection.componentId === componentId,
    [hoveredTreeSelection],
  )

  const isHoleTreeHovered = useCallback(
    (holeId: string): boolean => hoveredTreeSelection?.type === 'hole' && hoveredTreeSelection.holeId === holeId,
    [hoveredTreeSelection],
  )

  const isStitchLineTreeHovered = useCallback(
    (stitchLineId: string): boolean =>
      hoveredTreeSelection?.type === 'stitch-line' && hoveredTreeSelection.stitchLineId === stitchLineId,
    [hoveredTreeSelection],
  )

  const componentStyles = useMemo<DrawAreaComponentStyles>(
    () => ({
      getBackgroundColor: ({ component, nestingLevel }) => {
        const color = component.color ?? getComponentColor(project.componentSettings.baseColor, nestingLevel)
        return selectionObstructingComponentIds.has(component.id) ? addAlpha(color) : color
      },
      getBorderColor: ({ component, isHovered }) => {
        if (isComponentSelected(component.id) || isComponentTreeHovered(component.id) || isHovered) {
          return SELECTED_STROKE_COLOR
        }
        return selectionObstructingComponentIds.has(component.id) ? addAlpha(STROKE_COLOR) : STROKE_COLOR
      },
      getBorderThickness: () => {
        return STROKE_THICKNESS
      },
      getFilter: ({ component, isHovered }) => {
        return isComponentSelected(component.id) || isComponentTreeHovered(component.id) || isHovered
          ? `drop-shadow(0px 0px 2px ${SELECTED_STROKE_COLOR})`
          : undefined
      },
    }),
    [
      isComponentSelected,
      isComponentTreeHovered,
      project.componentSettings.baseColor,
      selectionObstructingComponentIds,
    ],
  )

  const cardStyles = useMemo<DrawAreaCardStyles>(
    () => ({
      getBackgroundColor: ({ owner }) => {
        return selectionObstructingComponentIds.has(owner.id) ? addAlpha(CARD_COLOR) : CARD_COLOR
      },
      getStrokeColor: ({ owner }) => {
        return selectionObstructingComponentIds.has(owner.id) ? addAlpha(STROKE_COLOR) : STROKE_COLOR
      },
      getStrokeThickness: () => {
        return STROKE_THICKNESS
      },
    }),
    [selectionObstructingComponentIds],
  )

  const holeStyles = useMemo<DrawAreaHoleStyles>(
    () => ({
      getFillColor: ({ hole, isHovered }) => {
        return selectedHole?.id === hole.id || isHoleTreeHovered(hole.id) || isHovered
          ? SELECTED_HOLE_FILL_COLOR
          : 'transparent'
      },
      getStrokeColor: ({ hole, isHovered }) => {
        return selectedHole?.id === hole.id || isHoleTreeHovered(hole.id) || isHovered
          ? SELECTED_HOLE_STROKE_COLOR
          : 'transparent'
      },
      getStrokeThickness: () => {
        return STROKE_THICKNESS
      },
    }),
    [isHoleTreeHovered, selectedHole?.id],
  )

  const stitchLineStyles = useMemo<DrawAreaStitchLineStyles>(
    () => ({
      getLineColor: (stitchLine) => {
        if (
          selectedStitchLine?.id === stitchLine.id ||
          hoveredStitchLineId === stitchLine.id ||
          isStitchLineTreeHovered(stitchLine.id)
        ) {
          return SELECTED_STITCH_LINE_STROKE_COLOR
        }

        return stitchLine.stitchLineColor ?? project.stitchingSettings.stitchLineColor
      },
      getLineThickness: (stitchLine) => {
        return stitchLine.stitchLineThickness ?? project.stitchingSettings.stitchLineThickness
      },
      getStitchHoleColor: (stitchLine) => {
        if (
          selectedStitchLine?.id === stitchLine.id ||
          hoveredStitchLineId === stitchLine.id ||
          isStitchLineTreeHovered(stitchLine.id)
        ) {
          return SELECTED_STITCH_LINE_HOLE_COLOR
        }

        return stitchLine.stitchHoleColor ?? project.stitchingSettings.stitchHoleColor
      },
      getStitchHoleThickness: (stitchLine) => {
        return stitchLine.stitchHoleThickness ?? project.stitchingSettings.stitchHoleThickness
      },
    }),
    [
      project.stitchingSettings.stitchHoleColor,
      project.stitchingSettings.stitchHoleThickness,
      project.stitchingSettings.stitchLineColor,
      project.stitchingSettings.stitchLineThickness,
      hoveredStitchLineId,
      isStitchLineTreeHovered,
      selectedStitchLine?.id,
    ],
  )

  const drawAreaContextValue = useMemo<DrawAreaContextValue>(
    () => ({
      isInteractive: true,
      isShowingCards: true,
      selection: drawAreaSelection,
      holeStyles,
      componentStyles,
      cardStyles,
      stitchLineStyles,
      exportTextStyles,
      markerStyles,
      exportIdentifiers,
    }),
    [cardStyles, componentStyles, drawAreaSelection, holeStyles, stitchLineStyles],
  )

  return drawAreaContextValue
}

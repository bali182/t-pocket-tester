import { useCallback, useMemo, useState } from 'react'
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
  DrawAreaExportTextStyles,
  DrawAreaHoleStyles,
  DrawAreaMarkerStyles,
  DrawAreaSelection,
  DrawAreaStitchLineStyles,
} from '../contexts/DrawAreaContext'
import { ComponentSchema } from '../schemas/components'
import { EditorSelectionSchema } from '../schemas/selection'
import { StitchLineSchema } from '../schemas/stitching'
import { getComponentColor } from '../utils/getComponentColor'
import { isDefined } from '../utils/isDefined'
import { produce } from '../utils/produce'
import { useProject } from './useProject'

import { formatHex8, parse } from 'culori'
import { getSelectionObstructingComponentIds } from '../logic/getSelectionObstructingComponentIds'
import { HoleSchema } from '../schemas/hole'

const addAlpha = (color: string): string => {
  const parsed = parse(color)
  if (!isDefined(parsed)) {
    return color
  }
  return formatHex8({ ...parsed, alpha: 0.3 })
}

const exportTextStyles: DrawAreaExportTextStyles = {
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

const markerStyles: DrawAreaMarkerStyles = {
  getColor: produce(undefined),
  getThickness: produce(undefined),
}

export const useEditorDrawArea = (): DrawAreaContextValue => {
  const [selection, setSelection] = useState<EditorSelectionSchema | undefined>()
  const [hoveredStitchLineId, setHoveredStitchLine] = useState<string | undefined>()
  const [hoveredTreeSelection, setHoveredTreeSelection] = useState<EditorSelectionSchema | undefined>()
  const { project, touchComponent } = useProject()

  const selectedComponent = useMemo<ComponentSchema | undefined>(() => {
    if (!isDefined(selection) || selection.type !== 'component') {
      return undefined
    }

    return project.components[selection.componentId]
  }, [project.components, selection])

  const selectedHole = useMemo<HoleSchema | undefined>(() => {
    if (!isDefined(selection) || selection.type !== 'hole') {
      return undefined
    }

    return project.holes.find((hole) => hole.id === selection.holeId)
  }, [project.holes, selection])

  const selectedStitchLine = useMemo<StitchLineSchema | undefined>(() => {
    if (!isDefined(selection) || selection.type !== 'stitch-line') {
      return undefined
    }

    return project.stitchLines.find((stitchLine) => stitchLine.id === selection.stitchLineId)
  }, [project.stitchLines, selection])

  const selectionObstructingComponentIds = useMemo<ReadonlySet<string>>(
    () => getSelectionObstructingComponentIds(hoveredTreeSelection ?? selection, project),
    [hoveredTreeSelection, project, selection],
  )

  const selectComponent = useCallback(
    (componentId: string): void => {
      touchComponent(componentId)
      setHoveredStitchLine(undefined)
      setSelection({ componentId, type: 'component' })
    },
    [touchComponent],
  )

  const selectStitchLine = useCallback((stitchLineId: string): void => {
    setSelection({ stitchLineId, type: 'stitch-line' })
  }, [])

  const selectHole = useCallback((holeId: string): void => {
    setHoveredStitchLine(undefined)
    setSelection({ holeId, type: 'hole' })
  }, [])

  const clearSelection = useCallback((): void => {
    setHoveredStitchLine(undefined)
    setSelection(undefined)
  }, [])

  const isComponentSelected = useCallback(
    (componentId: string): boolean => isDefined(selectedComponent) && componentId === selectedComponent.id,
    [selectedComponent],
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

  const drawAreaSelection = useMemo<DrawAreaSelection>(
    () => ({
      clearSelection,
      isComponentSelected,
      selectComponent,
      selectStitchLine,
      selectHole,
      selectedHole,
      selectedComponent,
      selectedStitchLine,
      hoveredStitchLineId,
      hoveredTreeSelection,
      editorSelection: selection,
      setHoveredStitchLine,
      setHoveredTreeSelection,
    }),
    [
      clearSelection,
      isComponentSelected,
      selectComponent,
      selectStitchLine,
      selectHole,
      selectedHole,
      selectedComponent,
      selectedStitchLine,
      hoveredStitchLineId,
      hoveredTreeSelection,
      selection,
    ],
  )

  const componentStyles = useMemo<DrawAreaComponentStyles>(
    () => ({
      getBackgroundColor: (component, nestingLevel) => {
        const color = component.color ?? getComponentColor(project.componentSettings.baseColor, nestingLevel)
        return selectionObstructingComponentIds.has(component.id) ? addAlpha(color) : color
      },
      getBorderColor: (component, isHovered) => {
        if (isComponentSelected(component.id) || isComponentTreeHovered(component.id) || isHovered) {
          return SELECTED_STROKE_COLOR
        }
        return selectionObstructingComponentIds.has(component.id) ? addAlpha(STROKE_COLOR) : STROKE_COLOR
      },
      getBorderThickness: (_component, _isHovered) => {
        return STROKE_THICKNESS
      },
      getFilter: (component, isHovered) => {
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
      getBackgroundColor: (owner) => {
        return selectionObstructingComponentIds.has(owner.id) ? addAlpha(CARD_COLOR) : CARD_COLOR
      },
      getStrokeColor: (owner) => {
        return selectionObstructingComponentIds.has(owner.id) ? addAlpha(STROKE_COLOR) : STROKE_COLOR
      },
      getStrokeThickness: (_owner, _isParentHovered) => {
        return STROKE_THICKNESS
      },
    }),
    [selectionObstructingComponentIds],
  )

  const holeStyles = useMemo<DrawAreaHoleStyles>(
    () => ({
      getFillColor: (hole, isHovered) => {
        return selectedHole?.id === hole.id || isHoleTreeHovered(hole.id) || isHovered
          ? SELECTED_HOLE_FILL_COLOR
          : 'transparent'
      },
      getStrokeColor: (hole, isHovered) => {
        return selectedHole?.id === hole.id || isHoleTreeHovered(hole.id) || isHovered
          ? SELECTED_HOLE_STROKE_COLOR
          : 'transparent'
      },
      getStrokeThickness: (_hole, _isHovered) => {
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
    }),
    [cardStyles, componentStyles, drawAreaSelection, holeStyles, stitchLineStyles],
  )

  return drawAreaContextValue
}

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
import { getComponentDescendants } from '../operations/project/utils/getComponentDescendants'
import { ComponentSchema } from '../schemas/components'
import { ProjectSchema } from '../schemas/project'
import { EditorSelectionSchema } from '../schemas/selection'
import { StitchLineSchema } from '../schemas/stitching'
import { getComponentColor } from '../utils/getComponentColor'
import { isDefined } from '../utils/isDefined'
import { produce } from '../utils/produce'
import { useProject } from './useProject'

import { formatHex8, parse } from 'culori'
import { HoleSchema } from '../schemas/hole'

const addAlpha = (color: string): string => {
  const parsed = parse(color)
  if (!isDefined(parsed)) {
    return color
  }
  return formatHex8({ ...parsed, alpha: 0.5 })
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

  const selectedStitchLineCoveredComponentIds = useMemo<Set<string>>(
    () => getSelectedStitchLineCoveredComponentIds(selectedStitchLine, project),
    [project, selectedStitchLine],
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
      editorSelection: selection,
      setHoveredStitchLine,
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
      selection,
    ],
  )

  const componentStyles = useMemo<DrawAreaComponentStyles>(
    () => ({
      getBackgroundColor: (component, nestingLevel) => {
        const color = component.color ?? getComponentColor(project.componentSettings.baseColor, nestingLevel)
        return selectedStitchLineCoveredComponentIds.has(component.id) ? addAlpha(color) : color
      },
      getBorderColor: (component, isHovered) => {
        if (isComponentSelected(component.id) || isHovered) {
          return SELECTED_STROKE_COLOR
        }
        return selectedStitchLineCoveredComponentIds.has(component.id) ? addAlpha(STROKE_COLOR) : STROKE_COLOR
      },
      getBorderThickness: (_component, _isHovered) => {
        return STROKE_THICKNESS
      },
      getFilter: (component, isHovered) => {
        return isComponentSelected(component.id) || isHovered
          ? `drop-shadow(0px 0px 2px ${SELECTED_STROKE_COLOR})`
          : undefined
      },
    }),
    [isComponentSelected, project.componentSettings.baseColor, selectedStitchLineCoveredComponentIds],
  )

  const cardStyles = useMemo<DrawAreaCardStyles>(
    () => ({
      getBackgroundColor: (owner, isParentHovered) => {
        return isComponentSelected(owner.id) || isParentHovered ? addAlpha(CARD_COLOR) : CARD_COLOR
      },
      getStrokeColor: (owner, isParentHovered) => {
        return isComponentSelected(owner.id) || isParentHovered ? SELECTED_STROKE_COLOR : STROKE_COLOR
      },
      getStrokeThickness: (_owner, _isParentHovered) => {
        return STROKE_THICKNESS
      },
    }),
    [isComponentSelected],
  )

  const holeStyles = useMemo<DrawAreaHoleStyles>(
    () => ({
      getFillColor: (hole, isHovered) => {
        return selectedHole?.id === hole.id || isHovered ? SELECTED_HOLE_FILL_COLOR : 'transparent'
      },
      getStrokeColor: (hole, isHovered) => {
        return selectedHole?.id === hole.id || isHovered ? SELECTED_HOLE_STROKE_COLOR : 'transparent'
      },
      getStrokeThickness: (_hole, _isHovered) => {
        return STROKE_THICKNESS
      },
    }),
    [selectedHole?.id],
  )

  const stitchLineStyles = useMemo<DrawAreaStitchLineStyles>(
    () => ({
      getLineColor: (stitchLine) => {
        if (selectedStitchLine?.id === stitchLine.id || hoveredStitchLineId === stitchLine.id) {
          return SELECTED_STITCH_LINE_STROKE_COLOR
        }

        return stitchLine.stitchLineColor ?? project.stitchingSettings.stitchLineColor
      },
      getLineThickness: (stitchLine) => {
        return stitchLine.stitchLineThickness ?? project.stitchingSettings.stitchLineThickness
      },
      getStitchHoleColor: (stitchLine) => {
        if (selectedStitchLine?.id === stitchLine.id || hoveredStitchLineId === stitchLine.id) {
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

const getSelectedStitchLineCoveredComponentIds = (
  selectedStitchLine: StitchLineSchema | undefined,
  project: ProjectSchema,
): Set<string> => {
  if (!isDefined(selectedStitchLine)) {
    return new Set<string>()
  }

  const ownerComponent = getStitchLineOwnerComponent(selectedStitchLine, project)

  if (!isDefined(ownerComponent)) {
    return new Set<string>()
  }

  const coveredComponentIds = new Set(getComponentDescendants(ownerComponent, project))
  coveredComponentIds.delete(ownerComponent.id)

  if (ownerComponent.type === 'pocket-cluster' && selectedStitchLine.type === 'pocket-cluster-stitch-line') {
    coveredComponentIds.add(ownerComponent.id)
  }

  return coveredComponentIds
}

const getStitchLineOwnerComponent = (
  stitchLine: StitchLineSchema,
  project: ProjectSchema,
): ComponentSchema | undefined => {
  if (stitchLine.targetType === 'component') {
    return project.components[stitchLine.targetId]
  }
  const targetHole = project.holes.find((hole) => hole.id === stitchLine.targetId)
  return isDefined(targetHole) ? project.components[targetHole.componentId] : undefined
}

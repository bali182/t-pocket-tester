import { useCallback, useMemo, useState } from 'react'
import { SELECTED_STROKE_COLOR, STROKE_COLOR, STROKE_THICKNESS } from '../constants/drawing'
import {
  DrawAreaComponentStyles,
  DrawAreaContextValue,
  DrawAreaSelection,
  DrawAreaStitchLineStyles,
} from '../contexts/DrawAreaContext'
import { ComponentSchema } from '../schemas/components'
import { EditorSelectionSchema } from '../schemas/selection'
import { StitchLineSchema } from '../schemas/stitching'
import { getComponentColor } from '../utils/getComponentColor'
import { isDefined } from '../utils/isDefined'
import { useProject } from './useProject'

import { formatHex8, parse } from 'culori'

const addAlpha = (color: string): string => {
  const parsed = parse(color)
  if (!isDefined(parsed)) {
    return color
  }
  return formatHex8({ ...parsed, alpha: 0.6 })
}

export const useEditorDrawArea = (): DrawAreaContextValue => {
  const [selection, setSelection] = useState<EditorSelectionSchema | undefined>()
  const { project, touchComponent } = useProject()

  const selectedComponent = useMemo<ComponentSchema | undefined>(() => {
    if (!isDefined(selection) || selection.type !== 'component') {
      return undefined
    }

    return project.components[selection.componentId]
  }, [project.components, selection])

  const selectedStitchLine = useMemo<StitchLineSchema | undefined>(() => {
    if (!isDefined(selection) || selection.type !== 'stitch-line') {
      return undefined
    }

    return project.stitchLines.find((stitchLine) => stitchLine.id === selection.stitchLineId)
  }, [project.stitchLines, selection])

  const highlightedComponentId = useMemo<string | undefined>(() => {
    if (isDefined(selectedComponent)) {
      return selectedComponent.id
    }

    if (isDefined(selectedStitchLine)) {
      return selectedStitchLine.componentId
    }

    return undefined
  }, [selectedComponent, selectedStitchLine])

  const selectComponent = useCallback(
    (componentId: string): void => {
      touchComponent(componentId)
      setSelection({ componentId, type: 'component' })
    },
    [touchComponent],
  )

  const selectStitchLine = useCallback((stitchLineId: string): void => {
    setSelection({ stitchLineId, type: 'stitch-line' })
  }, [])

  const clearSelection = useCallback((): void => {
    setSelection(undefined)
  }, [])

  const isComponentSelected = useCallback(
    (componentId: string): boolean => componentId === highlightedComponentId,
    [highlightedComponentId],
  )

  const drawAreaSelection = useMemo<DrawAreaSelection>(
    () => ({
      clearSelection,
      isComponentSelected,
      selectComponent,
      selectStitchLine,
      selectedComponent,
      selectedStitchLine,
      highlightedComponentId,
    }),
    [
      clearSelection,
      isComponentSelected,
      selectComponent,
      selectStitchLine,
      selectedComponent,
      selectedStitchLine,
      highlightedComponentId,
    ],
  )

  const componentStyles = useMemo<DrawAreaComponentStyles>(
    () => ({
      getBackgroundColor: (component, nestingLevel, isHovered) => {
        const color = component.color ?? getComponentColor(project.componentSettings.baseColor, nestingLevel)
        if (component.type === 'root-panel') {
          return color
        }
        return isComponentSelected(component.id) || isHovered ? addAlpha(color) : color
      },
      getBorderColor: (component, isHovered) => {
        return isComponentSelected(component.id) || isHovered ? SELECTED_STROKE_COLOR : STROKE_COLOR
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
    [isComponentSelected, project.componentSettings.baseColor],
  )

  const stitchLineStyles = useMemo<DrawAreaStitchLineStyles>(
    () => ({
      getLineColor: (stitchLine) => {
        return stitchLine.stitchLineColor ?? project.stitchingSettings.stitchLineColor
      },
      getLineThickness: (stitchLine) => {
        return stitchLine.stitchLineThickness ?? project.stitchingSettings.stitchLineThickness
      },
      getStitchHoleColor: (stitchLine) => {
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
    ],
  )

  const drawAreaContextValue = useMemo<DrawAreaContextValue>(
    () => ({
      isInteractive: true,
      selection: drawAreaSelection,
      componentStyles,
      stitchLineStyles,
    }),
    [componentStyles, drawAreaSelection, stitchLineStyles],
  )

  return drawAreaContextValue
}

import { useCallback, useMemo, useState } from 'react'
import { SELECTED_STROKE_COLOR, STROKE_COLOR, STROKE_THICKNESS } from '../constants/drawing'
import {
  DrawAreaComponentStlyes,
  DrawAreaContextValue,
  DrawAreaSelection,
  DrawAreaStitchLineStlyes,
} from '../contexts/DrawAreaContext'
import { ComponentSchema } from '../schemas/components'
import { EditorSelectionSchema } from '../schemas/selection'
import { StitchLineSchema } from '../schemas/stitching'
import { isDefined } from '../utils/isDefined'
import { useProject } from './useProject'

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

  const componentStyles = useMemo<DrawAreaComponentStlyes>(
    () => ({
      getBackgroundColor: (component) => component.color,
      getBorderColor: (_component) => STROKE_COLOR,
      getBorderThickness: (_component) => STROKE_THICKNESS,
      getFilter: (component) =>
        isComponentSelected(component.id) ? `drop-shadow(0px 0px 2px ${SELECTED_STROKE_COLOR})` : undefined,
    }),
    [isComponentSelected],
  )

  const stitchLineStyles = useMemo<DrawAreaStitchLineStlyes>(
    () => ({
      getLineColor: (stitchLine) => stitchLine.stitchLineColor ?? project.stitchingSettings.stitchLineColor,
      getLineThickness: (stitchLine) => stitchLine.stitchLineThickness ?? project.stitchingSettings.stitchLineThickness,
      getStitchHoleColor: (stitchLine) => stitchLine.stitchHoleColor ?? project.stitchingSettings.stitchHoleColor,
      getStitchHoleThickness: (stitchLine) =>
        stitchLine.stitchHoleThickness ?? project.stitchingSettings.stitchHoleThickness,
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

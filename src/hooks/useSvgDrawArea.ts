import { useMemo } from 'react'
import { STROKE_COLOR, STROKE_THICKNESS } from '../constants/drawing'
import {
  DrawAreaComponentStyles,
  DrawAreaContextValue,
  DrawAreaSelection,
  DrawAreaStitchLineStyles,
} from '../contexts/DrawAreaContext'
import { noop } from '../utils/noop'
import { produce } from '../utils/produce'
import { useProject } from './useProject'

export const useSvgDrawArea = (): DrawAreaContextValue => {
  const { project } = useProject()

  const drawAreaSelection = useMemo<DrawAreaSelection>(
    () => ({
      clearSelection: noop,
      isComponentSelected: produce(false),
      selectComponent: noop,
      selectStitchLine: noop,
      selectedComponent: undefined,
      selectedStitchLine: undefined,
      highlightedComponentId: undefined,
    }),
    [],
  )

  const componentStyles = useMemo<DrawAreaComponentStyles>(
    () => ({
      getBackgroundColor: produce(undefined),
      getBorderColor: produce(STROKE_COLOR),
      getBorderThickness: produce(STROKE_THICKNESS),
      getFilter: produce(undefined),
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

  const drawAreaContextValue = useMemo<DrawAreaContextValue>(
    () => ({
      isInteractive: false,
      selection: drawAreaSelection,
      componentStyles,
      stitchLineStyles,
    }),
    [componentStyles, drawAreaSelection, stitchLineStyles],
  )

  return drawAreaContextValue
}

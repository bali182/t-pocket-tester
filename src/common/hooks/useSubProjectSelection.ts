import { useCallback, useMemo, useState } from 'react'
import { ComponentSchema } from '../schemas/components'
import { SelectionSchema } from '../schemas/selection'
import { StitchLineSchema } from '../schemas/stitching'
import { isDefined } from '../utils/isDefined'

import { SubProjectSelectionContextValue } from '../contexts/SubProjectSelectionContext'
import { HoleSchema } from '../schemas/hole'
import { SubProjectSchema } from '../schemas/subProject'

export const useSubProjectSelection = (subProject: SubProjectSchema): SubProjectSelectionContextValue => {
  const [selection, setSelection] = useState<SelectionSchema | undefined>()
  const [hoveredStitchLineId, setHoveredStitchLine] = useState<string | undefined>()
  const [hoveredTreeSelection, setHoveredTreeSelection] = useState<SelectionSchema | undefined>()

  const selectedComponent = useMemo<ComponentSchema | undefined>(() => {
    if (!isDefined(selection) || selection.type !== 'component') {
      return undefined
    }

    return subProject.components[selection.componentId]
  }, [subProject.components, selection])

  const selectedHole = useMemo<HoleSchema | undefined>(() => {
    if (!isDefined(selection) || selection.type !== 'hole') {
      return undefined
    }

    return subProject.holes.find((hole) => hole.id === selection.holeId)
  }, [subProject.holes, selection])

  const selectedStitchLine = useMemo<StitchLineSchema | undefined>(() => {
    if (!isDefined(selection) || selection.type !== 'stitch-line') {
      return undefined
    }

    return subProject.stitchLines.find((stitchLine) => stitchLine.id === selection.stitchLineId)
  }, [subProject.stitchLines, selection])

  const selectComponent = useCallback((componentId: string): void => {
    setHoveredStitchLine(undefined)
    setSelection({ componentId, type: 'component' })
  }, [])

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

  const subProjectSelection = useMemo<SubProjectSelectionContextValue>(
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

  return subProjectSelection
}

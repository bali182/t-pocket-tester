import { useSetAtom } from 'jotai'
import { useCallback } from 'react'

import type { EditableSchema } from '../schemas/editable'
import type { ComponentBoundsStitchLineSchema } from '../schemas/stitching'
import type { ValidationIssuesSchema } from '../schemas/validation'
import { projectAtom } from '../state'
import { validateStitchLineSchema } from '../validators/validateStitchLineSchema'
import { useEditableModel } from './useEditableModel'
import { useStitchLine } from './useStitchLine'

export type UseEditableStitchLineResult = {
  editableStitchLine: EditableSchema<ComponentBoundsStitchLineSchema>
  setStitchLine: (stitchLine: EditableSchema<ComponentBoundsStitchLineSchema>) => void
  stitchLine: ComponentBoundsStitchLineSchema
  validationIssues: ValidationIssuesSchema<ComponentBoundsStitchLineSchema>
}

export const useEditableStitchLine = (stitchLineId: string): UseEditableStitchLineResult => {
  const stitchLine = useStitchLine(stitchLineId)

  if (stitchLine.type !== 'component-bounds-stitch-line') {
    throw new Error('Expected a rectangular stitch line')
  }

  const setProject = useSetAtom(projectAtom)

  const commit = useCallback(
    (updatedStitchLine: ComponentBoundsStitchLineSchema): void => {
      setProject((project) => ({
        ...project,
        stitchLines: project.stitchLines.map((candidate) =>
          candidate.id === stitchLineId ? updatedStitchLine : candidate,
        ),
      }))
    },
    [setProject, stitchLineId],
  )

  const { editableValue, setValue, validationIssues } = useEditableModel({
    commit,
    validate: validateStitchLineSchema,
    value: stitchLine,
  })

  return {
    editableStitchLine: editableValue,
    setStitchLine: setValue,
    stitchLine,
    validationIssues,
  }
}

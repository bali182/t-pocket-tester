import { useCallback } from 'react'

import type { EditableSchema } from '../schemas/editable'
import type { StitchLineSchema } from '../schemas/stitching'
import type { ValidationIssuesSchema } from '../schemas/validation'
import { validateStitchLineSchema } from '../validators/validateStitchLineSchema'
import { useEditableModel } from './useEditableModel'
import { useProject } from './useProject'
import { useStitchLine } from './useStitchLine'

export type UseEditableStitchLineResult = {
  editableStitchLine: EditableSchema<StitchLineSchema>
  setStitchLine: (stitchLine: EditableSchema<StitchLineSchema>) => void
  stitchLine: StitchLineSchema
  validationIssues: ValidationIssuesSchema<StitchLineSchema>
}

export const useEditableStitchLine = (stitchLineId: string): UseEditableStitchLineResult => {
  const stitchLine = useStitchLine(stitchLineId)

  const { updateStitchLine } = useProject()

  const commit = useCallback(
    (updatedStitchLine: StitchLineSchema): void => {
      updateStitchLine(updatedStitchLine)
    },
    [updateStitchLine],
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

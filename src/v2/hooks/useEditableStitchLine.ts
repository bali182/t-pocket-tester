import { useCallback, useMemo } from 'react'

import { LANGUAGE } from '../constants/language'
import type { EditableSchema } from '../schemas/editable'
import type { StitchLineCommonConfigSchema, StitchLineSchema } from '../schemas/stitching'
import type { ValidationIssuesSchema } from '../schemas/validation'
import { getEditableSchema } from '../utils/getEditableSchema'
import { validateStitchLineSchema } from '../validators/validateStitchLineSchema'
import { useEditableModel } from './useEditableModel'
import { useProject } from './useProject'
import { useStitchLine } from './useStitchLine'

export type UseEditableStitchLineResult = {
  editableStitchLine: EditableSchema<StitchLineSchema>
  resolvedEditableStitchLine: EditableSchema<StitchLineCommonConfigSchema> & EditableSchema<StitchLineSchema>
  setStitchLine: (stitchLine: EditableSchema<StitchLineSchema>) => void
  stitchLine: StitchLineSchema
  validationIssues: ValidationIssuesSchema<StitchLineSchema>
}

export const useEditableStitchLine = (stitchLineId: string): UseEditableStitchLineResult => {
  const stitchLine = useStitchLine(stitchLineId)

  const { project, updateStitchLine } = useProject()

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
  const resolvedEditableStitchLine = useMemo(
    () => ({
      ...getEditableSchema(project.stitchingSettings, { language: LANGUAGE }),
      ...editableValue,
    }),
    [editableValue, project.stitchingSettings],
  )

  return {
    editableStitchLine: editableValue,
    resolvedEditableStitchLine,
    setStitchLine: setValue,
    stitchLine,
    validationIssues,
  }
}

import { useCallback, useMemo } from 'react'

import { LANGUAGE } from '../constants/language'
import type { EditableSchema } from '../schemas/editable'
import type { HoleSchema } from '../schemas/hole'
import type { ComponentBasedValidationContextSchema, ValidationIssuesSchema } from '../schemas/validation'
import { useTranslation } from '../translations/translation'
import { validateHoleSchema } from '../validators/validateHoleSchema'
import { useEditableModel } from './useEditableModel'
import { useHole } from './useHole'
import { useSubProject } from './useSubProject'

export type UseEditableHoleResult = {
  editableHole: EditableSchema<HoleSchema>
  hole: HoleSchema
  setHole: (hole: EditableSchema<HoleSchema>) => void
  validationIssues: ValidationIssuesSchema<HoleSchema>
}

export const useEditableHole = (holeId: string): UseEditableHoleResult => {
  const hole = useHole(holeId)
  const { computedSubProject, subProject, updateHole } = useSubProject()
  const t = useTranslation()
  const context = useMemo<ComponentBasedValidationContextSchema>(
    () => ({ computedSubProject, language: LANGUAGE, subProject, t }),
    [computedSubProject, subProject, t],
  )
  const commit = useCallback(
    (updatedHole: HoleSchema): void => {
      updateHole(updatedHole)
    },
    [updateHole],
  )
  const { editableValue, setValue, validationIssues } = useEditableModel({
    commit,
    context,
    validate: validateHoleSchema,
    value: hole,
  })

  return {
    editableHole: editableValue,
    hole,
    setHole: setValue,
    validationIssues,
  }
}

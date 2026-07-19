import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { LANGUAGE } from '../constants/language'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { computedProjectAtom, projectAtom } from '../state/state'
import { getEditableSchema } from '../utils/getEditableSchema'

export type EditableModelValidatorSchema<T> = (
  input: EditableSchema<T>,
  currentValue: T,
  context: ValidationContextSchema,
) => ValidationResultSchema<T>

export type UseEditableModelResult<T> = {
  editableValue: EditableSchema<T>
  setValue: (value: EditableSchema<T>) => void
  validationIssues: ValidationIssuesSchema<T>
  value: T
}

type UseEditableModelOptions<T> = {
  commit: (value: T) => void
  validate: EditableModelValidatorSchema<T>
  value: T
}

export const useEditableModel = <T>({ commit, validate, value }: UseEditableModelOptions<T>): UseEditableModelResult<T> => {
  const project = useAtomValue(projectAtom)
  const computedProject = useAtomValue(computedProjectAtom)
  const [isDirty, setIsDirty] = useState(false)
  const [locallyCommittedValue, setLocallyCommittedValue] = useState<T | undefined>(undefined)
  const [lastObservedValue, setLastObservedValue] = useState(value)
  const [editableValue, setEditableValue] = useState<EditableSchema<T>>(() => getEditableSchema(value, { language: LANGUAGE }))
  const [processedEditableValue, setProcessedEditableValue] = useState<EditableSchema<T> | undefined>(undefined)

  const validationContext = useMemo<ValidationContextSchema>(
    () => ({ computedProject, language: LANGUAGE, project }),
    [computedProject, project],
  )
  const validationResult = useMemo(
    () => validate(editableValue, value, validationContext),
    [editableValue, validationContext, validate, value],
  )

  useEffect(() => {
    if (value === lastObservedValue) {
      return
    }

    setLastObservedValue(value)

    if (value === locallyCommittedValue) {
      setLocallyCommittedValue(undefined)
      return
    }

    setEditableValue(getEditableSchema(value, { language: LANGUAGE }))
    setIsDirty(false)
  }, [lastObservedValue, locallyCommittedValue, value])

  useEffect(() => {
    if (!isDirty || editableValue === processedEditableValue) {
      return
    }

    setProcessedEditableValue(editableValue)
    setLocallyCommittedValue(validationResult.committedValue)
    commit(validationResult.committedValue)
  }, [commit, editableValue, isDirty, processedEditableValue, validationResult])

  const setValue = useCallback((updatedValue: EditableSchema<T>): void => {
    setEditableValue(updatedValue)
    setIsDirty(true)
  }, [])

  return { editableValue, setValue, validationIssues: validationResult.issues, value }
}

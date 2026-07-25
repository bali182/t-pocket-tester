import { useCallback, useEffect, useState } from 'react'

import type { EditableSchema, EditableSchemaContextSchema } from '../schemas/editable'
import type { ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { getEditableSchema } from '../utils/getEditableSchema'

export type UseEditableModelResult<T> = {
  editableValue: EditableSchema<T>
  setValue: (value: EditableSchema<T>) => void
  validationIssues: ValidationIssuesSchema<T>
  value: T
}

type UseEditableModelOptions<T, C> = {
  commit: (value: T) => void
  context: C
  validate: (input: EditableSchema<T>, currentValue: T, context: C) => ValidationResultSchema<T>
  value: T
}

export const useEditableModel = <T, C extends EditableSchemaContextSchema>({
  commit,
  context,
  validate,
  value,
}: UseEditableModelOptions<T, C>): UseEditableModelResult<T> => {
  const [isDirty, setIsDirty] = useState(false)
  const [locallyCommittedValue, setLocallyCommittedValue] = useState<T | undefined>(undefined)
  const [lastObservedValue, setLastObservedValue] = useState(value)
  const [editableValue, setEditableValue] = useState<EditableSchema<T>>(() =>
    getEditableSchema(value, context),
  )
  const [processedEditableValue, setProcessedEditableValue] = useState<EditableSchema<T> | undefined>(undefined)

  const validationResult = validate(editableValue, value, context)

  useEffect(() => {
    if (value === lastObservedValue) {
      return
    }

    setLastObservedValue(value)

    if (value === locallyCommittedValue) {
      setLocallyCommittedValue(undefined)
      return
    }

    setEditableValue(getEditableSchema(value, context))
    setIsDirty(false)
  }, [context, lastObservedValue, locallyCommittedValue, value])

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

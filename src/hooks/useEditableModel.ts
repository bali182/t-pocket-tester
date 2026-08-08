import { useCallback, useEffect, useState } from 'react'

import type { EditableSchema, EditableSchemaContextSchema } from '../schemas/editable'
import type { ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { getEditableSchema } from '../utils/getEditableSchema'
import { isReferentiallyEqual } from '../utils/isReferentiallyEqual'

export type UseEditableModelResult<T> = {
  editableValue: EditableSchema<T>
  validationIssues: ValidationIssuesSchema<T>
  value: T
  setValue: (value: EditableSchema<T>) => void
}

type UseEditableModelOptions<T, C> = {
  context: C
  value: T
  validate: (input: EditableSchema<T>, currentValue: T, context: C) => ValidationResultSchema<T>
  commit: (value: T) => void
  isEqual?: (a: T | undefined, b: T | undefined) => boolean
}

export const useEditableModel = <T, C extends EditableSchemaContextSchema>({
  commit,
  context,
  validate,
  value,
  isEqual = isReferentiallyEqual,
}: UseEditableModelOptions<T, C>): UseEditableModelResult<T> => {
  const [isDirty, setIsDirty] = useState(false)
  const [locallyCommittedValue, setLocallyCommittedValue] = useState<T | undefined>(undefined)
  const [lastObservedValue, setLastObservedValue] = useState(value)
  const [editableValue, setEditableValue] = useState<EditableSchema<T>>(() => getEditableSchema(value, context))
  const [processedEditableValue, setProcessedEditableValue] = useState<EditableSchema<T> | undefined>(undefined)

  const validationResult = validate(editableValue, value, context)

  useEffect(() => {
    if (value === lastObservedValue) {
      return
    }

    setLastObservedValue(value)

    if (isEqual(value, locallyCommittedValue)) {
      setLocallyCommittedValue(undefined)
      return
    }

    setEditableValue(getEditableSchema(value, context))
    setIsDirty(false)
  }, [context, isEqual, lastObservedValue, locallyCommittedValue, value])

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

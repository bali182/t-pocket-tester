import { useCallback, useMemo } from 'react'

import { LANGUAGE } from '../constants/language'
import type { EditableSchema } from '../schemas/editable'
import type { BaseValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { useTranslation } from '../translations/translation'
import { useEditableModel } from './useEditableModel'

type UseEditableMagicFixConfigEntryOptions<T> = {
  config: T
  onChange: (config: T) => void
  isEqual?: (first: T | undefined, second: T | undefined) => boolean
  validate: (
    input: EditableSchema<T>,
    currentValue: T,
    context: BaseValidationContextSchema,
  ) => ValidationResultSchema<T>
}

export type UseEditableMagicFixConfigEntryResult<T> = {
  editableConfig: EditableSchema<T>
  validationIssues: ValidationIssuesSchema<T>
  setConfig: (config: EditableSchema<T>) => void
}

export const useEditableMagicFixConfigEntry = <T>({
  config,
  isEqual,
  onChange,
  validate,
}: UseEditableMagicFixConfigEntryOptions<T>): UseEditableMagicFixConfigEntryResult<T> => {
  const t = useTranslation()
  const context = useMemo<BaseValidationContextSchema>(() => ({ language: LANGUAGE, t }), [t])
  const commit = useCallback((updatedConfig: T): void => onChange(updatedConfig), [onChange])
  const { editableValue, setValue, validationIssues } = useEditableModel({
    commit,
    context,
    isEqual,
    validate,
    value: config,
  })

  return { editableConfig: editableValue, setConfig: setValue, validationIssues }
}

import { useCallback, useMemo } from 'react'

import { LANGUAGE } from '../constants/language'
import type { ComponentSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ComponentBasedValidationContextSchema, ValidationIssuesSchema } from '../schemas/validation'
import { useTranslation } from '../translations/translation'
import { validateComponentSchema } from '../validators/validateComponentSchema'
import { useComponent } from './useComponent'
import { useEditableModel } from './useEditableModel'
import { useSubProject } from './useSubProject'

export type UseEditableComponentResult = {
  component: ComponentSchema
  editableComponent: EditableSchema<ComponentSchema>
  validationIssues: ValidationIssuesSchema<ComponentSchema>
  setComponent: (component: EditableSchema<ComponentSchema>) => void
}

export const useEditableComponent = (componentId: string): UseEditableComponentResult => {
  const component = useComponent(componentId)

  const { computedSubProject, subProject, updateComponent } = useSubProject()
  const t = useTranslation()
  const context = useMemo<ComponentBasedValidationContextSchema>(
    () => ({ computedSubProject, language: LANGUAGE, subProject, t }),
    [computedSubProject, subProject, t],
  )

  const commit = useCallback(
    (updatedComponent: ComponentSchema): void => {
      updateComponent(updatedComponent)
    },
    [updateComponent],
  )

  const { editableValue, setValue, validationIssues } = useEditableModel({
    commit,
    context,
    validate: validateComponentSchema,
    value: component,
  })

  return {
    component,
    editableComponent: editableValue,
    setComponent: setValue,
    validationIssues,
  }
}

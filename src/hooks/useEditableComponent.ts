import { useCallback, useMemo } from 'react'

import { LANGUAGE } from '../constants/language'
import type { ComponentSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ComponentBasedValidationContextSchema, ValidationIssuesSchema } from '../schemas/validation'
import { useTranslation } from '../translations/translation'
import { validateComponentSchema } from '../validators/validateComponentSchema'
import { useComponent } from './useComponent'
import { useEditableModel } from './useEditableModel'
import { useProject } from './useProject'

export type UseEditableComponentResult = {
  component: ComponentSchema
  editableComponent: EditableSchema<ComponentSchema>
  validationIssues: ValidationIssuesSchema<ComponentSchema>
  setComponent: (component: EditableSchema<ComponentSchema>) => void
}

export const useEditableComponent = (componentId: string): UseEditableComponentResult => {
  const component = useComponent(componentId)

  const { computedProject, project, updateComponent } = useProject()
  const t = useTranslation()
  const context = useMemo<ComponentBasedValidationContextSchema>(
    () => ({ computedProject, language: LANGUAGE, project, t }),
    [computedProject, project, t],
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

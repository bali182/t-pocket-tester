import { useSetAtom } from 'jotai'
import { useCallback } from 'react'

import type { ComponentSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationIssuesSchema } from '../schemas/validation'
import { projectAtom } from '../state'
import { validateComponentSchema } from '../validators/validateComponentSchema'
import { useComponent } from './useComponent'
import { useEditableModel } from './useEditableModel'

export type UseEditableComponentResult = {
  component: ComponentSchema
  editableComponent: EditableSchema<ComponentSchema>
  validationIssues: ValidationIssuesSchema<ComponentSchema>
  setComponent: (component: EditableSchema<ComponentSchema>) => void
}

export const useEditableComponent = (componentId: string): UseEditableComponentResult => {
  const component = useComponent(componentId)

  const setProject = useSetAtom(projectAtom)

  const commit = useCallback(
    (updatedComponent: ComponentSchema): void => {
      setProject((project) => ({
        ...project,
        components: {
          ...project.components,
          [componentId]: updatedComponent,
        },
      }))
    },
    [componentId, setProject],
  )

  const { editableValue, setValue, validationIssues } = useEditableModel({
    commit,
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

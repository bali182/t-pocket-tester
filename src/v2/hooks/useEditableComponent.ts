import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { LANGUAGE } from '../constants/language'
import type { ComponentSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationIssuesSchema } from '../schemas/validation'
import { computedProjectAtom, projectAtom } from '../state'
import { getEditableSchema } from '../utils/getEditableSchema'
import { validateComponentSchema } from '../validators/validateComponentSchema'
import { useComponent } from './useComponent'

export type UseEditableComponentResult = {
  component: ComponentSchema
  editableComponent: EditableSchema<ComponentSchema>
  validationIssues: ValidationIssuesSchema<ComponentSchema>
  setComponent: (component: EditableSchema<ComponentSchema>) => void
}

export const useEditableComponent = (componentId: string): UseEditableComponentResult => {
  const component = useComponent(componentId)
  const project = useAtomValue(projectAtom)
  const computedProject = useAtomValue(computedProjectAtom)
  const setProject = useSetAtom(projectAtom)

  const [isDirty, setIsDirty] = useState(false)
  const [editableComponent, setEditableComponent] = useState<EditableSchema<ComponentSchema>>(() =>
    getEditableSchema(component, { language: LANGUAGE }),
  )

  const validationContext = useMemo(
    () => ({
      computedProject,
      language: LANGUAGE,
      project,
    }),
    [computedProject, project],
  )

  const validationResult = useMemo(
    () => validateComponentSchema(editableComponent, validationContext),
    [editableComponent, validationContext],
  )

  useEffect(() => {
    setEditableComponent(getEditableSchema(component, { language: LANGUAGE }))
    setIsDirty(false)
  }, [component])

  useEffect(() => {
    if (!isDirty || !validationResult.isValid) {
      return
    }

    setProject((project) => ({
      ...project,
      components: {
        ...project.components,
        [componentId]: validationResult.value,
      },
    }))
    setIsDirty(false)
  }, [componentId, isDirty, setProject, validationResult])

  const setComponent = useCallback((component: EditableSchema<ComponentSchema>): void => {
    setEditableComponent(component)
    setIsDirty(true)
  }, [])

  return {
    component,
    editableComponent,
    setComponent,
    validationIssues: validationResult.issues,
  }
}

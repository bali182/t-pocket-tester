import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { LANGUAGE } from '../constants/language'
import type { ComponentSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationIssuesSchema } from '../schemas/validation'
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
  const [locallyCommittedComponent, setLocallyCommittedComponent] = useState<ComponentSchema | undefined>(undefined)
  const [lastObservedComponent, setLastObservedComponent] = useState(component)
  const [editableComponent, setEditableComponent] = useState<EditableSchema<ComponentSchema>>(() =>
    getEditableSchema(component, { language: LANGUAGE }),
  )
  const [processedEditableComponent, setProcessedEditableComponent] = useState<EditableSchema<ComponentSchema> | undefined>(
    undefined,
  )

  const validationContext = useMemo<ValidationContextSchema>(
    () => ({
      computedProject,
      language: LANGUAGE,
      project,
    }),
    [computedProject, project],
  )

  const validationResult = useMemo(
    () => validateComponentSchema(editableComponent, component, validationContext),
    [component, editableComponent, validationContext],
  )

  useEffect(() => {
    if (component === lastObservedComponent) {
      return
    }

    setLastObservedComponent(component)

    if (component === locallyCommittedComponent) {
      setLocallyCommittedComponent(undefined)
      return
    }

    setEditableComponent(getEditableSchema(component, { language: LANGUAGE }))
    setIsDirty(false)
  }, [component, lastObservedComponent, locallyCommittedComponent])

  useEffect(() => {
    if (!isDirty || editableComponent === processedEditableComponent) {
      return
    }

    setProcessedEditableComponent(editableComponent)
    setLocallyCommittedComponent(validationResult.committedValue)
    setProject((project) => ({
      ...project,
      components: {
        ...project.components,
        [componentId]: validationResult.committedValue,
      },
    }))
  }, [componentId, editableComponent, isDirty, processedEditableComponent, setProject, validationResult])

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

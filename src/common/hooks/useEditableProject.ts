import { useMemo } from 'react'

import { LANGUAGE } from '../constants/language'
import type { EditableSchema } from '../schemas/editable'
import type { ProjectSchema } from '../schemas/project'
import type { ProjectBasedValidationContextSchema, ValidationIssuesSchema } from '../schemas/validation'
import { useTranslation } from '../translations/translation'
import { optionalComparators } from '../utils/comparators'
import { validateProjectSchema } from '../validators/validateProjectSchema'
import { useEditableModel } from './useEditableModel'
import { useProject } from './useProject'
import { useProjects } from './useProjects'

export type UseEditableProjectResult = {
  editableProject: EditableSchema<ProjectSchema>
  project: ProjectSchema
  setProject: (project: EditableSchema<ProjectSchema>) => void
  validationIssues: ValidationIssuesSchema<ProjectSchema>
}

export const useEditableProject = (): UseEditableProjectResult => {
  const { project, setProject } = useProject()
  const { projects } = useProjects()
  const t = useTranslation()
  const context = useMemo<ProjectBasedValidationContextSchema>(
    () => ({ language: LANGUAGE, projects, t }),
    [projects, t],
  )
  const { editableValue, setValue, validationIssues } = useEditableModel({
    commit: setProject,
    context,
    isEqual: optionalComparators.project,
    validate: validateProjectSchema,
    value: project,
  })

  return {
    editableProject: editableValue,
    project,
    setProject: setValue,
    validationIssues,
  }
}

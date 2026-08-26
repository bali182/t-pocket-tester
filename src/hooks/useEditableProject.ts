import { useMemo } from 'react'

import { LANGUAGE } from '../constants/language'
import type { EditableSchema } from '../schemas/editable'
import type { ProjectSchema } from '../schemas/project'
import type { ColorSettingsSchema, ProjectEditingSettingSchema } from '../schemas/settings'
import type { StitchLineCommonConfigSchema } from '../schemas/stitching'
import type { ProjectBasedValidationContextSchema, ValidationIssuesSchema } from '../schemas/validation'
import { useTranslation } from '../translations/translation'
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
    isEqual: isProjectEqual,
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

const isProjectEqual = (a: ProjectSchema | undefined, b: ProjectSchema | undefined): boolean => {
  if (a === undefined || b === undefined) {
    return a === b
  }

  return (
    a.name === b.name &&
    areProjectEditingSettingsEqual(a.editingSettings, b.editingSettings) &&
    areStitchingSettingsEqual(a.stitchingSettings, b.stitchingSettings) &&
    areColorSettingsEqual(a.colorSettings, b.colorSettings)
  )
}

const areProjectEditingSettingsEqual = (a: ProjectEditingSettingSchema, b: ProjectEditingSettingSchema): boolean => {
  return (
    a.addComputedSizesToAutoSized === b.addComputedSizesToAutoSized &&
    a.adjustCornerRadiiToParent === b.adjustCornerRadiiToParent &&
    a.addBaseColorByDefault === b.addBaseColorByDefault
  )
}

const areStitchingSettingsEqual = (a: StitchLineCommonConfigSchema, b: StitchLineCommonConfigSchema): boolean => {
  return (
    a.stitchMargin === b.stitchMargin &&
    a.stitchHoleLength === b.stitchHoleLength &&
    a.stitchHoleDistance === b.stitchHoleDistance &&
    a.stitchHoleThickness === b.stitchHoleThickness &&
    a.stitchLineThickness === b.stitchLineThickness
  )
}

const areColorSettingsEqual = (a: ColorSettingsSchema, b: ColorSettingsSchema): boolean => {
  return (
    a.leatherColor === b.leatherColor &&
    a.stitchHoleColor === b.stitchHoleColor &&
    a.stitchLineColor === b.stitchLineColor &&
    a.strokeColor === b.strokeColor &&
    a.selectionColor === b.selectionColor &&
    a.cardColor === b.cardColor
  )
}

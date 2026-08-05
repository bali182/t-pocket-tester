import type { EditableSchema } from '../schemas/editable'
import type { ProjectSchema } from '../schemas/project'
import type {
  ProjectBasedValidationContextSchema,
  ValidationIssuesSchema,
  ValidationResultSchema,
} from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateHexColor } from './validateHexColor'
import { validateName } from './validateName'
import { validateStitchLineCommonConfigSchema } from './validateStitchLineCommonConfigSchema'

export const validateProjectSchema = (
  input: EditableSchema<ProjectSchema>,
  currentValue: ProjectSchema,
  context: ProjectBasedValidationContextSchema,
): ValidationResultSchema<ProjectSchema> => {
  const nameResult = validateName(input.name, currentValue.name, currentValue.id, context.projects, context)
  const stitchingSettingsResult = validateStitchLineCommonConfigSchema(
    input.stitchingSettings,
    currentValue.stitchingSettings,
    context,
  )
  const componentSettingsResult = validateHexColor(
    input.componentSettings.baseColor,
    currentValue.componentSettings.baseColor,
    context,
  )
  const issues: ValidationIssuesSchema<ProjectSchema> = {
    editingSettings: {
      addComputedSizesToAutoSized: undefined,
      adjustCornerRadiiToParent: undefined,
      addBaseColorByDefault: undefined,
    },
    id: undefined,
    name: nameResult.issues,
    subProjects: [],
    componentSettings: {
      baseColor: componentSettingsResult.issues,
    },
    stitchingSettings: stitchingSettingsResult.issues,
  }
  const committedValue: ProjectSchema = {
    editingSettings: currentValue.editingSettings,
    id: currentValue.id,
    name: nameResult.committedValue,
    subProjects: currentValue.subProjects,
    stitchingSettings: stitchingSettingsResult.committedValue,
    componentSettings: {
      baseColor: componentSettingsResult.committedValue,
    },
  }

  if (!nameResult.isValid || !stitchingSettingsResult.isValid || !componentSettingsResult.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, {
    ...committedValue,
    componentSettings: {
      baseColor: componentSettingsResult.value,
    },
  })
}

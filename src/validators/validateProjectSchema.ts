import type { EditableSchema } from '../schemas/editable'
import type { ProjectSchema } from '../schemas/project'
import type {
  ProjectBasedValidationContextSchema,
  ValidationIssuesSchema,
  ValidationResultSchema,
} from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
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
  const issues: ValidationIssuesSchema<ProjectSchema> = {
    components: {},
    editingSettings: {
      addComputedSizesToAutoSized: undefined,
      adjustCornerRadiiToParent: undefined,
    },
    id: undefined,
    name: nameResult.issues,
    root: undefined,
    stitchLines: [],
    stitchingSettings: stitchingSettingsResult.issues,
  }
  const committedValue: ProjectSchema = {
    components: currentValue.components,
    editingSettings: currentValue.editingSettings,
    id: currentValue.id,
    name: nameResult.committedValue,
    root: currentValue.root,
    stitchLines: currentValue.stitchLines,
    stitchingSettings: stitchingSettingsResult.committedValue,
  }

  if (!nameResult.isValid || !stitchingSettingsResult.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

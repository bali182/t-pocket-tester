import type { EditableSchema } from '../schemas/editable'
import type { SubProjectSchema } from '../schemas/subProject'
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
  input: EditableSchema<SubProjectSchema>,
  currentValue: SubProjectSchema,
  context: ProjectBasedValidationContextSchema,
): ValidationResultSchema<SubProjectSchema> => {
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
  const issues: ValidationIssuesSchema<SubProjectSchema> = {
    components: {},
    editingSettings: {
      addComputedSizesToAutoSized: undefined,
      adjustCornerRadiiToParent: undefined,
      addBaseColorByDefault: undefined,
    },
    id: undefined,
    name: nameResult.issues,
    root: undefined,
    holes: [],
    stitchLines: [],
    componentSettings: {
      baseColor: componentSettingsResult.issues,
    },
    stitchingSettings: stitchingSettingsResult.issues,
  }
  const committedValue: SubProjectSchema = {
    components: currentValue.components,
    editingSettings: currentValue.editingSettings,
    id: currentValue.id,
    name: nameResult.committedValue,
    root: currentValue.root,
    holes: currentValue.holes,
    stitchLines: currentValue.stitchLines,
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

import type { ComponentSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationResultSchema } from '../schemas/validation'
import { validatePanelSchema } from './validatePanelSchema'
import { validatePocketClusterSchema } from './validatePocketClusterSchema'
import { validateRootPanelSchema } from './validateRootPanelSchema'

export function validateComponentSchema(
  input: EditableSchema<ComponentSchema>,
  context: ValidationContextSchema,
): ValidationResultSchema<EditableSchema<ComponentSchema>, ComponentSchema> {
  switch (input.type) {
    case 'root-panel':
      return validateRootPanelSchema(input, context)
    case 'panel':
      return validatePanelSchema(input, context)
    case 'pocket-cluster':
      return validatePocketClusterSchema(input, context)
  }
}

import type { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import type { EditableSchema } from '../schemas/editable'
import type { ValidationContextSchema, ValidationResultSchema } from '../schemas/validation'
import { validatePanelSchema } from './validatePanelSchema'
import { validatePocketClusterSchema } from './validatePocketClusterSchema'
import { validateRootPanelSchema } from './validateRootPanelSchema'

export function validateComponentSchema(
  input: EditableSchema<ComponentSchema>,
  currentValue: ComponentSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<ComponentSchema> {
  switch (input.type) {
    case 'root-panel':
      return validateRootPanelSchema(input, currentValue as RootPanelSchema, context)
    case 'panel':
      return validatePanelSchema(input, currentValue as PanelSchema, context)
    case 'pocket-cluster':
      return validatePocketClusterSchema(input, currentValue as PocketClusterSchema, context)
  }
}

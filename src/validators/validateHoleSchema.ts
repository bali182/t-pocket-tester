import type { EditableSchema } from '../schemas/editable'
import type { CircleHoleSchema, HoleSchema, RectHoleSchema } from '../schemas/hole'
import type { ComponentBasedValidationContextSchema, ValidationResultSchema } from '../schemas/validation'
import { validateCircleHoleSchema } from './validateCircleHoleSchema'
import { validateRectHoleSchema } from './validateRectHoleSchema'

export const validateHoleSchema = (
  input: EditableSchema<HoleSchema>,
  currentValue: HoleSchema,
  context: ComponentBasedValidationContextSchema,
): ValidationResultSchema<HoleSchema> => {
  switch (input.type) {
    case 'rect-hole':
      return validateRectHoleSchema(input as EditableSchema<RectHoleSchema>, currentValue as RectHoleSchema, context)
    case 'circle-hole':
      return validateCircleHoleSchema(
        input as EditableSchema<CircleHoleSchema>,
        currentValue as CircleHoleSchema,
        context,
      )
  }
}

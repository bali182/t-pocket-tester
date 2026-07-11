import type { ValidationContextSchema, ValidatorSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'

export const validateName: ValidatorSchema<
  string,
  string,
  [componentId: string, context: ValidationContextSchema]
> = (input, componentId, context) => {
  if (input === '') {
    return createInvalidValidationResult<string>({
      message: 'A név nem lehet üres.',
      severity: 'error',
    })
  }

  const hasDuplicateName = Object.values(context.project.components).some(
    (component) => component.id !== componentId && component.name === input,
  )

  if (hasDuplicateName) {
    return createInvalidValidationResult<string>({
      message: 'Ez a név már foglalt.',
      severity: 'error',
    })
  }

  return createValidValidationResult<string, string>(undefined, input)
}

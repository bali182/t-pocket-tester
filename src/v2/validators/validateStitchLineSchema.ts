import type { EditableSchema } from '../schemas/editable'
import type { ComponentBoundsStitchLineSchema, PocketClusterStitchLineSchema, StitchLineSchema } from '../schemas/stitching'
import type { ValidationContextSchema, ValidationResultSchema } from '../schemas/validation'
import { validateComponentBoundsStitchLineSchema } from './validateComponentBoundsStitchLineSchema'
import { validatePocketClusterStitchLineSchema } from './validatePocketClusterStitchLineSchema'

export const validateStitchLineSchema = (
  input: EditableSchema<StitchLineSchema>,
  currentValue: StitchLineSchema,
  context: ValidationContextSchema,
): ValidationResultSchema<StitchLineSchema> => {
  switch (currentValue.type) {
    case 'component-bounds-stitch-line':
      return validateComponentBoundsStitchLineSchema(
        input as EditableSchema<ComponentBoundsStitchLineSchema>,
        currentValue,
        context,
      )
    case 'pocket-cluster-stitch-line':
      return validatePocketClusterStitchLineSchema(
        input as EditableSchema<PocketClusterStitchLineSchema>,
        currentValue,
        context,
      )
  }
}

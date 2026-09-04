import type { EditableSchema } from '../schemas/editable'
import type { PageSchemaId } from '../schemas/page'
import type { PageLayoutSchema, PageOrientationSchema, PdfExportSettingsSchema } from '../schemas/pdfExport'
import type { BaseValidationContextSchema, ValidationIssuesSchema, ValidationResultSchema } from '../schemas/validation'
import { createInvalidValidationResult, createValidValidationResult } from './createValidationResult'
import { validateBaseExportSettingsSchema } from './validateBaseExportSettingsSchema'
import { validatePrimitiveUnion } from './validatePrimitiveUnion'

const pageSchemaIds: Record<PageSchemaId, boolean> = {
  A3: true,
  A4: true,
  A5: true,
}

const pageOrientations: Record<PageOrientationSchema, boolean> = {
  landscape: true,
  portrait: true,
}

const pageLayouts: Record<PageLayoutSchema, boolean> = {
  compact: true,
  horizontal: true,
  vertical: true,
}

export const validatePdfExportSettingsSchema = (
  input: EditableSchema<PdfExportSettingsSchema>,
  currentValue: PdfExportSettingsSchema,
  context: BaseValidationContextSchema,
): ValidationResultSchema<PdfExportSettingsSchema> => {
  const baseResult = validateBaseExportSettingsSchema(input, currentValue, context)
  const pageResult = validatePrimitiveUnion(input.page, currentValue.page, pageSchemaIds, context)
  const orientationResult = validatePrimitiveUnion(
    input.orientation,
    currentValue.orientation,
    pageOrientations,
    context,
  )
  const layoutResult = validatePrimitiveUnion(input.layout, currentValue.layout, pageLayouts, context)

  const issues: ValidationIssuesSchema<PdfExportSettingsSchema> = {
    ...baseResult.issues,
    layout: layoutResult.issues,
    orientation: orientationResult.issues,
    page: pageResult.issues,
  }
  const committedValue: PdfExportSettingsSchema = {
    ...baseResult.committedValue,
    layout: layoutResult.committedValue,
    orientation: orientationResult.committedValue,
    page: pageResult.committedValue,
  }

  if (!baseResult.isValid || !pageResult.isValid || !orientationResult.isValid || !layoutResult.isValid) {
    return createInvalidValidationResult(issues, committedValue)
  }

  return createValidValidationResult(issues, committedValue)
}

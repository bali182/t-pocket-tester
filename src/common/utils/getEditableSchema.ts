import { NumberFormatter } from '@internationalized/number'

import type { EditableSchema, EditableSchemaContextSchema } from '../schemas/editable'
import { isRecord } from './isRecord'

export const getEditableSchema = <T>(value: T, context: EditableSchemaContextSchema): EditableSchema<T> => {
  const formatter = new NumberFormatter(context.language, {
    maximumSignificantDigits: 21,
    style: 'decimal',
    useGrouping: false,
  })

  return getEditableSchemaValue(value, formatter) as EditableSchema<T>
}

const getEditableSchemaValue = (value: unknown, formatter: NumberFormatter): unknown => {
  if (typeof value === 'number') {
    return formatter.format(value)
  }

  if (Array.isArray(value)) {
    return value.map((item) => getEditableSchemaValue(item, formatter))
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, getEditableSchemaValue(nestedValue, formatter)]),
    )
  }

  return value
}

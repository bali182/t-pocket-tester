import type { ComponentTreeDropAreaSchema } from '../schemas/move'
import { isRecord } from './isRecord'

export const isComponentTreeDropAreaSchema = (value: unknown): value is ComponentTreeDropAreaSchema => {
  return (
    isRecord(value) &&
    typeof value.targetParentId === 'string' &&
    (value.beforeComponentId === undefined || typeof value.beforeComponentId === 'string')
  )
}

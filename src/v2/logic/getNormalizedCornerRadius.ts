import type { CornerRadiusSchema } from '../schemas/components'
import { isDefined } from '../utils/isDefined'

export const getNormalizedCornerRadius = (radius?: number | CornerRadiusSchema): CornerRadiusSchema => {
  if (!isDefined(radius)) {
    return {
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    }
  }

  if (typeof radius === 'number') {
    return {
      topLeft: radius,
      topRight: radius,
      bottomRight: radius,
      bottomLeft: radius,
    }
  }

  return radius
}

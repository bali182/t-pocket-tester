import { HasCornerRadiusSchema } from '../schemas/components'
import { CornerRadiusSchema } from '../schemas/geometry'

export const getNormalizedCornerRadius = (component: HasCornerRadiusSchema): CornerRadiusSchema => {
  const { individualRadii, borderRadius, bottomLeftRadius, bottomRightRadius, topLeftRadius, topRightRadius } =
    component

  return {
    topLeft: individualRadii ? topLeftRadius : borderRadius,
    topRight: individualRadii ? topRightRadius : borderRadius,
    bottomRight: individualRadii ? bottomRightRadius : borderRadius,
    bottomLeft: individualRadii ? bottomLeftRadius : borderRadius,
  }
}

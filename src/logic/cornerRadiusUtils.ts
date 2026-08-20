import BigNumber from 'bignumber.js'

import { ONE } from '../constants/layout'
import type { HasCornerRadiusSchema } from '../schemas/common'
import type { CornerRadiusSchema, RectSchema } from '../schemas/geometry'

export const getNormalizedCornerRadius = (component: HasCornerRadiusSchema): CornerRadiusSchema => {
  const { individualRadii, borderRadius, bottomLeftRadius, bottomRightRadius, topLeftRadius, topRightRadius } =
    component

  return {
    topLeft: new BigNumber(individualRadii ? topLeftRadius : borderRadius),
    topRight: new BigNumber(individualRadii ? topRightRadius : borderRadius),
    bottomRight: new BigNumber(individualRadii ? bottomRightRadius : borderRadius),
    bottomLeft: new BigNumber(individualRadii ? bottomLeftRadius : borderRadius),
  }
}

export const getFittedCornerRadius = (
  rect: RectSchema,
  { bottomLeft, bottomRight, topLeft, topRight }: CornerRadiusSchema,
): CornerRadiusSchema => {
  const scale = BigNumber.minimum(
    ONE,
    getCornerRadiusScale(rect.width, topLeft.plus(topRight)),
    getCornerRadiusScale(rect.width, bottomLeft.plus(bottomRight)),
    getCornerRadiusScale(rect.height, topLeft.plus(bottomLeft)),
    getCornerRadiusScale(rect.height, topRight.plus(bottomRight)),
  )

  return {
    topLeft: topLeft.times(scale),
    topRight: topRight.times(scale),
    bottomRight: bottomRight.times(scale),
    bottomLeft: bottomLeft.times(scale),
  }
}

const getCornerRadiusScale = (availableLength: BigNumber, requestedLength: BigNumber): BigNumber => {
  if (requestedLength.isZero()) {
    return ONE
  }

  return availableLength.dividedBy(requestedLength)
}

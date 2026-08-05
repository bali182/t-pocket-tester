import BigNumber from 'bignumber.js'

import type { HasCornerRadiusSchema } from '../schemas/common'
import type { CornerRadiusSchema, RectSchema } from '../schemas/geometry'

const ONE = new BigNumber(1)

export type FittedCornerRadiusSchema = {
  topLeft: BigNumber
  topRight: BigNumber
  bottomRight: BigNumber
  bottomLeft: BigNumber
}

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

export const getFittedCornerRadius = (rect: RectSchema, radius: CornerRadiusSchema): FittedCornerRadiusSchema => {
  const topLeft = new BigNumber(radius.topLeft)
  const topRight = new BigNumber(radius.topRight)
  const bottomRight = new BigNumber(radius.bottomRight)
  const bottomLeft = new BigNumber(radius.bottomLeft)

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

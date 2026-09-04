import BigNumber from 'bignumber.js'
import { ZERO_CORNER_RADIUS } from '../constants/layout'
import { CornerRadiusSchema, RectSchema } from '../schemas/geometry'
import { isDefined } from '../utils/isDefined'
import { getUniformCornerRadius } from './cornerRadiusUtils'

type BaseCornerRadiusAdjustmentParams = {
  parentBoundingRect?: RectSchema
  parentCornerRadius?: CornerRadiusSchema
  boundingRect: RectSchema
  cornerRadius: CornerRadiusSchema
}

type GetAdjustedCornerRadiusParams = BaseCornerRadiusAdjustmentParams & {
  radiusCap?: CornerRadiusSchema | BigNumber
}

/**
 * If isAuto = true
 *  - parentCornerRadius is the boss.
 *  - In any corner where the component touches the parent, the parents radius is applied.
 *  - In any corner where the component doesn't touch the parent, radius is ZERO.
 *  - TODO: May need refinement, eg.: child is 1mm off of parent corner, but parent has large 10mm radius. What do?
 *
 * If isAuto = false
 *  - If parentCornerRadius is larger in any corner where component touches the parent, parent radius wins.
 *
 * In any case:
 *  - Radius is capped by Math.min(boundingRect.width, boundingRect.height) / 2
 *  - Or the provided cap.
 */

export const getAdjustedCornerRadius = (params: GetAdjustedCornerRadiusParams): CornerRadiusSchema => {
  const { parentBoundingRect, boundingRect, cornerRadius, parentCornerRadius, radiusCap } = params
  const cap = getCornerRadiusCap(radiusCap, boundingRect)
  const parentAdjustedRadius = adjustToParentRadius({
    boundingRect,
    cornerRadius: cornerRadius,
    parentBoundingRect: parentBoundingRect ?? boundingRect,
    parentCornerRadius: parentCornerRadius ?? ZERO_CORNER_RADIUS,
  })
  const cappedRadius = capCornerRadius(parentAdjustedRadius, cap)
  return cappedRadius
}

const adjustToParentRadius = ({
  boundingRect,
  cornerRadius,
  parentBoundingRect,
  parentCornerRadius,
}: Required<BaseCornerRadiusAdjustmentParams>): CornerRadiusSchema => {
  const parentLeft = parentBoundingRect.x
  const parentTop = parentBoundingRect.y
  const parentWidth = parentBoundingRect.width
  const parentHeight = parentBoundingRect.height
  const parentRight = parentLeft.plus(parentWidth)
  const parentBottom = parentTop.plus(parentHeight)

  const childLeft = boundingRect.x
  const childTop = boundingRect.y
  const childWidth = boundingRect.width
  const childHeight = boundingRect.height
  const childRight = childLeft.plus(childWidth)
  const childBottom = childTop.plus(childHeight)

  const touchesLeft = childLeft.isEqualTo(parentLeft)
  const touchesRight = childRight.isEqualTo(parentRight)
  const touchesTop = childTop.isEqualTo(parentTop)
  const touchesBottom = childBottom.isEqualTo(parentBottom)

  const touchesTopLeft = touchesTop && touchesLeft
  const touchesTopRight = touchesTop && touchesRight
  const touchesBottomLeft = touchesBottom && touchesLeft
  const touchesBottomRight = touchesBottom && touchesRight

  const topLeft =
    touchesTopLeft && cornerRadius.topLeft.isLessThan(parentCornerRadius.topLeft)
      ? parentCornerRadius.topLeft
      : cornerRadius.topLeft

  const topRight =
    touchesTopRight && cornerRadius.topRight.isLessThan(parentCornerRadius.topRight)
      ? parentCornerRadius.topRight
      : cornerRadius.topRight

  const bottomLeft =
    touchesBottomLeft && cornerRadius.bottomLeft.isLessThan(parentCornerRadius.bottomLeft)
      ? parentCornerRadius.bottomLeft
      : cornerRadius.bottomLeft

  const bottomRight =
    touchesBottomRight && cornerRadius.bottomRight.isLessThan(parentCornerRadius.bottomRight)
      ? parentCornerRadius.bottomRight
      : cornerRadius.bottomRight

  return { topLeft, topRight, bottomLeft, bottomRight }
}

const capCornerRadius = (radius: CornerRadiusSchema, cap: CornerRadiusSchema): CornerRadiusSchema => ({
  bottomLeft: radius.bottomLeft.isGreaterThan(cap.bottomLeft) ? cap.bottomLeft : radius.bottomLeft,
  bottomRight: radius.bottomRight.isGreaterThan(cap.bottomRight) ? cap.bottomRight : radius.bottomRight,
  topLeft: radius.topLeft.isGreaterThan(cap.topLeft) ? cap.topLeft : radius.topLeft,
  topRight: radius.topRight.isGreaterThan(cap.topRight) ? cap.topRight : radius.topRight,
})

const getCornerRadiusCap = (
  radiusCap: CornerRadiusSchema | BigNumber | undefined,
  boundingRect: RectSchema,
): CornerRadiusSchema => {
  if (isDefined(radiusCap)) {
    return BigNumber.isBigNumber(radiusCap) ? getUniformCornerRadius(radiusCap) : radiusCap
  }
  const smallerSide = BigNumber.max(BigNumber.min(boundingRect.width, boundingRect.height), 0)
  return getUniformCornerRadius(smallerSide.div(2))
}

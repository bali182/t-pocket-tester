import BigNumber from 'bignumber.js'

import type { CornerRadiusSchema, PathCommand, PathSchema, RectSchema } from '../schemas/geometry'

const ONE = new BigNumber(1)
const ZERO = new BigNumber(0)

type ResolvedCornerRadius = {
  topLeft: BigNumber
  topRight: BigNumber
  bottomRight: BigNumber
  bottomLeft: BigNumber
}

export const calculateRectPath = (rect: RectSchema, radius: CornerRadiusSchema): PathSchema => {
  const left = rect.x
  const top = rect.y
  const right = left.plus(rect.width)
  const bottom = top.plus(rect.height)
  const { topLeft, topRight, bottomRight, bottomLeft } = getFittedCornerRadius(rect, radius)

  const commands: PathCommand[] = [
    {
      type: 'moveTo',
      point: { x: left.plus(topLeft), y: top },
    },
  ]

  if (topRight.isGreaterThan(ZERO)) {
    commands.push(
      {
        type: 'lineTo',
        point: { x: right.minus(topRight), y: top },
      },
      {
        type: 'arcTo',
        radius: topRight,
        point: { x: right, y: top.plus(topRight) },
        reversed: false,
      },
    )
  } else {
    commands.push({ type: 'lineTo', point: { x: right, y: top } })
  }

  if (bottomRight.isGreaterThan(ZERO)) {
    commands.push(
      {
        type: 'lineTo',
        point: { x: right, y: bottom.minus(bottomRight) },
      },
      {
        type: 'arcTo',
        radius: bottomRight,
        point: { x: right.minus(bottomRight), y: bottom },
        reversed: false,
      },
    )
  } else {
    commands.push({ type: 'lineTo', point: { x: right, y: bottom } })
  }

  if (bottomLeft.isGreaterThan(ZERO)) {
    commands.push(
      {
        type: 'lineTo',
        point: { x: left.plus(bottomLeft), y: bottom },
      },
      {
        type: 'arcTo',
        radius: bottomLeft,
        point: { x: left, y: bottom.minus(bottomLeft) },
        reversed: false,
      },
    )
  } else {
    commands.push({ type: 'lineTo', point: { x: left, y: bottom } })
  }

  if (topLeft.isGreaterThan(ZERO)) {
    commands.push(
      {
        type: 'lineTo',
        point: { x: left, y: top.plus(topLeft) },
      },
      {
        type: 'arcTo',
        radius: topLeft,
        point: { x: left.plus(topLeft), y: top },
        reversed: false,
      },
    )
  }

  commands.push({ type: 'close' })

  return { commands }
}

const getFittedCornerRadius = (rect: RectSchema, radius: CornerRadiusSchema): ResolvedCornerRadius => {
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

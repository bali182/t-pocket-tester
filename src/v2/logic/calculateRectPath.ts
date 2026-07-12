import BigNumber from 'bignumber.js'

import type { CornerRadiusSchema, PathCommand, PathSchema, RectSchema } from '../schemas/geometry'

const ZERO = new BigNumber(0)

export const calculateRectPath = (rect: RectSchema, radius: CornerRadiusSchema): PathSchema => {
  const left = rect.x
  const top = rect.y
  const right = left.plus(rect.width)
  const bottom = top.plus(rect.height)

  const topLeft = new BigNumber(radius.topLeft)
  const topRight = new BigNumber(radius.topRight)
  const bottomRight = new BigNumber(radius.bottomRight)
  const bottomLeft = new BigNumber(radius.bottomLeft)

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
      },
    )
  }

  commands.push({ type: 'close' })

  return { commands }
}

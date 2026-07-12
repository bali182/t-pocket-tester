import BigNumber from 'bignumber.js'

import type { CornerRadiusSchema, PathCommand, PathSchema, RectSchema } from '../schemas/geometry'

const ZERO = new BigNumber(0)

export const calculateRectPath = (rect: RectSchema, radius: CornerRadiusSchema): PathSchema => {
  const left = new BigNumber(rect.x)
  const top = new BigNumber(rect.y)
  const right = left.plus(rect.width)
  const bottom = top.plus(rect.height)

  const topLeft = new BigNumber(radius.topLeft)
  const topRight = new BigNumber(radius.topRight)
  const bottomRight = new BigNumber(radius.bottomRight)
  const bottomLeft = new BigNumber(radius.bottomLeft)

  const commands: PathCommand[] = [
    {
      type: 'moveTo',
      point: {
        x: left.plus(topLeft).toNumber(),
        y: top.toNumber(),
      },
    },
  ]

  if (topRight.isGreaterThan(ZERO)) {
    commands.push(
      {
        type: 'lineTo',
        point: {
          x: right.minus(topRight).toNumber(),
          y: top.toNumber(),
        },
      },
      {
        type: 'arcTo',
        radius: topRight.toNumber(),
        point: {
          x: right.toNumber(),
          y: top.plus(topRight).toNumber(),
        },
      },
    )
  } else {
    commands.push({ type: 'lineTo', point: { x: right.toNumber(), y: top.toNumber() } })
  }

  if (bottomRight.isGreaterThan(ZERO)) {
    commands.push(
      {
        type: 'lineTo',
        point: {
          x: right.toNumber(),
          y: bottom.minus(bottomRight).toNumber(),
        },
      },
      {
        type: 'arcTo',
        radius: bottomRight.toNumber(),
        point: {
          x: right.minus(bottomRight).toNumber(),
          y: bottom.toNumber(),
        },
      },
    )
  } else {
    commands.push({ type: 'lineTo', point: { x: right.toNumber(), y: bottom.toNumber() } })
  }

  if (bottomLeft.isGreaterThan(ZERO)) {
    commands.push(
      {
        type: 'lineTo',
        point: {
          x: left.plus(bottomLeft).toNumber(),
          y: bottom.toNumber(),
        },
      },
      {
        type: 'arcTo',
        radius: bottomLeft.toNumber(),
        point: {
          x: left.toNumber(),
          y: bottom.minus(bottomLeft).toNumber(),
        },
      },
    )
  } else {
    commands.push({ type: 'lineTo', point: { x: left.toNumber(), y: bottom.toNumber() } })
  }

  if (topLeft.isGreaterThan(ZERO)) {
    commands.push(
      {
        type: 'lineTo',
        point: {
          x: left.toNumber(),
          y: top.plus(topLeft).toNumber(),
        },
      },
      {
        type: 'arcTo',
        radius: topLeft.toNumber(),
        point: {
          x: left.plus(topLeft).toNumber(),
          y: top.toNumber(),
        },
      },
    )
  }

  commands.push({ type: 'close' })

  return { commands }
}

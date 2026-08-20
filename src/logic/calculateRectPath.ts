import { ZERO } from '../constants/layout'
import type { CornerRadiusSchema, PathCommand, PathSchema, RectSchema } from '../schemas/geometry'

export const calculateRectPath = (rect: RectSchema, cornerRadius: CornerRadiusSchema): PathSchema => {
  const left = rect.x
  const top = rect.y
  const right = left.plus(rect.width)
  const bottom = top.plus(rect.height)
  const { bottomLeft, bottomRight, topLeft, topRight } = cornerRadius

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

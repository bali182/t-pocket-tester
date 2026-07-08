import type { CornerRadius } from '../../schemas/components'
import type { Path, PathCommand, RectSchema } from '../../schemas/geometry'

export const calculateRectPath = (
  rect: RectSchema,
  { topLeft, topRight, bottomRight, bottomLeft }: CornerRadius,
): Path => {
  const right = rect.x + rect.width
  const bottom = rect.y + rect.height

  const commands: PathCommand[] = [{ type: 'moveTo', point: { x: rect.x + topLeft, y: rect.y } }]

  if (topRight > 0) {
    commands.push(
      { type: 'lineTo', point: { x: right - topRight, y: rect.y } },
      { type: 'arcTo', radius: topRight, point: { x: right, y: rect.y + topRight } },
    )
  } else {
    commands.push({ type: 'lineTo', point: { x: right, y: rect.y } })
  }

  if (bottomRight > 0) {
    commands.push(
      { type: 'lineTo', point: { x: right, y: bottom - bottomRight } },
      { type: 'arcTo', radius: bottomRight, point: { x: right - bottomRight, y: bottom } },
    )
  } else {
    commands.push({ type: 'lineTo', point: { x: right, y: bottom } })
  }

  if (bottomLeft > 0) {
    commands.push(
      { type: 'lineTo', point: { x: rect.x + bottomLeft, y: bottom } },
      { type: 'arcTo', radius: bottomLeft, point: { x: rect.x, y: bottom - bottomLeft } },
    )
  } else {
    commands.push({ type: 'lineTo', point: { x: rect.x, y: bottom } })
  }

  if (topLeft > 0) {
    commands.push(
      { type: 'lineTo', point: { x: rect.x, y: rect.y + topLeft } },
      { type: 'arcTo', radius: topLeft, point: { x: rect.x + topLeft, y: rect.y } },
    )
  }

  commands.push({ type: 'close' })

  return { commands }
}

import type { LineSchema } from '../schemas/LineSchema'
import type { StitchHoleSchema } from '../schemas/StitchHoleSchema'
import type { StitchingConfigSchema } from '../schemas/StitchingConfigSchema'

const normalizeDegrees = (degrees: number): number => {
  return ((degrees % 360) + 360) % 360
}

export const getStitchingHoles = (line: LineSchema, config: StitchingConfigSchema): StitchHoleSchema[] => {
  if (config.stitchDistance <= 0) {
    throw new RangeError('stitchDistance must be greater than 0')
  }

  if (config.stitchLength < 0) {
    throw new RangeError('stitchLength must be greater than or equal to 0')
  }

  const dx = line.end.x - line.start.x
  const dy = line.end.y - line.start.y
  const lineLength = Math.hypot(dx, dy)

  if (lineLength === 0) {
    return []
  }

  const unitX = dx / lineLength
  const unitY = dy / lineLength
  const lineAngle = (Math.atan2(dy, dx) * 180) / Math.PI
  const rotation = normalizeDegrees(lineAngle - 90)
  const holes: StitchHoleSchema[] = []

  for (let distance = 0; distance <= lineLength; distance += config.stitchDistance) {
    holes.push({
      length: config.stitchLength,
      center: {
        x: line.start.x + unitX * distance,
        y: line.start.y + unitY * distance,
      },
      rotation,
    })
  }

  return holes
}

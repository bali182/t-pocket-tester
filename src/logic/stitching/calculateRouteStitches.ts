import type { ComputedStitchHoleSchema, ComputedStitchSchema } from '../../schemas/computed'
import type { LineSchema } from '../../schemas/geometry'
import { isDefined } from '../../utils/isDefined'
import { getPointDistance } from '../geometryUtils'

export const calculateRouteStitches = (
  holes: ComputedStitchHoleSchema[],
  isClosed: boolean,
): ComputedStitchSchema[] => {
  if (holes.length < 2) {
    return []
  }

  const stitches = holes.slice(1).flatMap((toHole, index) => {
    const fromHole = holes[index]
    return isDefined(fromHole) ? [{ line: getClosestStitchLine(fromHole, toHole) }] : []
  })
  const firstHole = holes[0]
  const lastHole = holes[holes.length - 1]

  if (isClosed && isDefined(firstHole) && isDefined(lastHole)) {
    stitches.push({ line: getClosestStitchLine(lastHole, firstHole) })
  }

  return stitches
}

const getClosestStitchLine = (
  firstHole: ComputedStitchHoleSchema,
  secondHole: ComputedStitchHoleSchema,
): LineSchema => {
  const firstPoints = [firstHole.line.start, firstHole.line.end]
  const secondPoints = [secondHole.line.start, secondHole.line.end]
  let closestLine: LineSchema = { start: firstPoints[0], end: secondPoints[0] }
  let closestDistance = getPointDistance(closestLine.start, closestLine.end)

  for (const firstPoint of firstPoints) {
    for (const secondPoint of secondPoints) {
      const distance = getPointDistance(firstPoint, secondPoint)

      if (distance.isLessThan(closestDistance)) {
        closestLine = { start: firstPoint, end: secondPoint }
        closestDistance = distance
      }
    }
  }

  return closestLine
}

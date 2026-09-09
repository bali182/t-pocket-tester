import type { ComputedStitchHoleSchema, ComputedStitchSchema } from '../../schemas/computed'
import { isDefined } from '../../utils/isDefined'

export const calculateRouteStitches = (
  holes: ComputedStitchHoleSchema[],
  isClosed: boolean,
): ComputedStitchSchema[] => {
  if (holes.length < 2) {
    return []
  }

  const stitches = holes.slice(1).flatMap((toHole, index) => {
    const fromHole = holes[index]
    return isDefined(fromHole) ? [getStitch(fromHole, toHole)] : []
  })
  const firstHole = holes[0]
  const lastHole = holes[holes.length - 1]

  if (isClosed && isDefined(firstHole) && isDefined(lastHole)) {
    stitches.push(getStitch(lastHole, firstHole))
  }

  return stitches
}

const getStitch = (
  firstHole: ComputedStitchHoleSchema,
  secondHole: ComputedStitchHoleSchema,
): ComputedStitchSchema => ({
  line: {
    start: firstHole.line.end,
    end: secondHole.line.start,
  },
})

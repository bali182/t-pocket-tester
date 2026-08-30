import type { ComputedStitchRouteSchema, ComputedStitchSchema } from '../../schemas/computed'
import { isDefined } from '../../utils/isDefined'
import { getClosestStitchLine } from './getStitchHoleLine'

export const calculateRouteStitches = (routes: ComputedStitchRouteSchema[]): ComputedStitchSchema[] => {
  return routes.flatMap((route) => {
    if (route.holes.length < 2) {
      return []
    }

    const stitches = route.holes.slice(1).map((toHole, index) => ({
      line: getClosestStitchLine(route.holes[index], toHole),
    }))
    const firstHole = route.holes[0]
    const lastHole = route.holes[route.holes.length - 1]

    if (route.isClosed && isDefined(firstHole) && isDefined(lastHole)) {
      stitches.push({ line: getClosestStitchLine(lastHole, firstHole) })
    }

    return stitches
  })
}

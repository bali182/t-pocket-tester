import { ZERO_CORNER_RADIUS } from '../../constants/layout'
import type { PocketClusterSchema } from '../../schemas/components'
import type { ComputedPocketClusterSchema, ComputedStitchLineSchema } from '../../schemas/computed'
import type { ResolvedPocketClusterStitchLineSchema } from '../../schemas/stitching'
import { normalizePocketCluster } from '../normalizePocketCluster'
import { calculateRouteStitches } from './calculateRouteStitches'
import { calculateStitchLineBoundingRect } from './calculateStitchLineBoundingRect'
import { calculateTPocketStitchHoles } from './calculateTPocketStitchHoles'
import { calculateTPocketStitchLine } from './calculateTPocketStitchLine'

export const calculatePocketClusterStitchLine = (
  stitchLine: ResolvedPocketClusterStitchLineSchema,
  pocketCluster: PocketClusterSchema,
  computedPocketCluster: ComputedPocketClusterSchema,
): ComputedStitchLineSchema => {
  const normalizedPocketCluster = normalizePocketCluster(pocketCluster, computedPocketCluster.boundingRect)
  const calculatedStitchLines = computedPocketCluster.tPockets.map((tPocket) =>
    calculateTPocketStitchLine(stitchLine, normalizedPocketCluster, tPocket),
  )
  const points = calculatedStitchLines.flatMap((calculatedStitchLine) => [
    calculatedStitchLine.line.start,
    calculatedStitchLine.line.end,
  ])
  const routes = calculatedStitchLines.map((calculatedStitchLine) => {
    const holes = calculateTPocketStitchHoles(stitchLine, calculatedStitchLine.line)

    return {
      path: calculatedStitchLine.path,
      holes,
      isClosed: false,
      stitches: calculateRouteStitches(holes, false),
      disconnectedCorners: {
        'top-left': undefined,
        'top-right': undefined,
        'bottom-right': undefined,
        'bottom-left': undefined,
      },
    }
  })

  return {
    stitchLineId: stitchLine.id,
    targetType: stitchLine.targetType,
    targetId: stitchLine.targetId,
    componentId: stitchLine.targetId,
    autoComputedCornerRadius: ZERO_CORNER_RADIUS,
    boundingRect: calculateStitchLineBoundingRect(points),
    routes,
    connectingStitches: [],
  }
}

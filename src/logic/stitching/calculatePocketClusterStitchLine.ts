import { ZERO_CORNER_RADIUS } from '../../constants/layout'
import type { PocketClusterSchema } from '../../schemas/components'
import type { ComputedPocketClusterSchema, ComputedStitchLineSchema } from '../../schemas/computed'
import type { ResolvedPocketClusterStitchLineSchema } from '../../schemas/stitching'
import { normalizePocketCluster } from '../normalizePocketCluster'
import { calculateTPocketStitchHoles } from './calculateTPocketStitchHoles'
import { calculateTPocketStitchLine } from './calculateTPocketStitchLine'

export const calculatePocketClusterStitchLine = (
  stitchLine: ResolvedPocketClusterStitchLineSchema,
  pocketCluster: PocketClusterSchema,
  computedPocketCluster: ComputedPocketClusterSchema,
): ComputedStitchLineSchema => {
  const normalizedPocketCluster = normalizePocketCluster(pocketCluster, computedPocketCluster.boundingRect)

  return {
    stitchLineId: stitchLine.id,
    targetType: stitchLine.targetType,
    targetId: stitchLine.targetId,
    componentId: stitchLine.targetId,
    autoComputedCornerRadius: ZERO_CORNER_RADIUS,
    routes: computedPocketCluster.tPockets.map((tPocket) => {
      const calculatedStitchLine = calculateTPocketStitchLine(stitchLine, normalizedPocketCluster, tPocket)
      return {
        path: calculatedStitchLine.path,
        holes: calculateTPocketStitchHoles(stitchLine, calculatedStitchLine.line),
      }
    }),
  }
}

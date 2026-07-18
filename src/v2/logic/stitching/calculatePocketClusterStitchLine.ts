import type { PocketClusterSchema } from '../../schemas/components'
import type { ComputedPocketClusterSchema, ComputedStitchLineSchema } from '../../schemas/computed'
import type { PocketClusterStitchLineSchema } from '../../schemas/stitching'
import { normalizePocketCluster } from '../normalizePocketCluster'
import { calculateTPocketStitchHoles } from './calculateTPocketStitchHoles'
import { calculateTPocketStitchLine } from './calculateTPocketStitchLine'

export const calculatePocketClusterStitchLine = (
  stitchLine: PocketClusterStitchLineSchema,
  pocketCluster: PocketClusterSchema,
  computedPocketCluster: ComputedPocketClusterSchema,
): ComputedStitchLineSchema => {
  if (!stitchLine.enabled) {
    return {
      stitchLineId: stitchLine.id,
      componentId: stitchLine.componentId,
      routes: [],
    }
  }

  const normalizedPocketCluster = normalizePocketCluster(pocketCluster, computedPocketCluster.boundingRect)

  return {
    stitchLineId: stitchLine.id,
    componentId: stitchLine.componentId,
    routes: computedPocketCluster.tPockets.map((tPocket) => {
      const calculatedStitchLine = calculateTPocketStitchLine(stitchLine, normalizedPocketCluster, tPocket)

      return {
        path: calculatedStitchLine.path,
        holes: calculateTPocketStitchHoles(stitchLine, calculatedStitchLine.line),
      }
    }),
  }
}

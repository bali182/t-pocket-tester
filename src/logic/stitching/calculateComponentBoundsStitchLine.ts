import type { ComputedStitchLineSchema, ComputedStitchRouteSchema } from '../../schemas/computed'
import type { ResolvedComponentBoundsStitchLineSchema } from '../../schemas/stitching'
import { calculateRouteDisconnectedCorners } from './calculateRouteDisconnectedCorners'
import { calculateRouteStitches } from './calculateRouteStitches'
import { calculateStitchLineBoundingRect } from './calculateStitchLineBoundingRect'
import { calculateStitchLineHoles } from './calculateStitchLineHoles'
import { calculateStitchLinePaths } from './calculateStitchLinePaths'
import type { ComponentBoundsStitchLineTarget } from './helperTypes'
import { getStitchLineAutoCornerRadius } from './stitchLineRadiusUtils'

export const calculateComponentBoundsStitchLine = (
  stitchLine: ResolvedComponentBoundsStitchLineSchema,
  target: ComponentBoundsStitchLineTarget,
): ComputedStitchLineSchema => {
  const calculatedPaths = calculateStitchLinePaths(stitchLine, target)
  const points = calculatedPaths.flatMap((calculatedPath) =>
    calculatedPath.fragments.flatMap((fragment) => [fragment.start, fragment.end]),
  )
  const routes = calculatedPaths.map((calculatedPath): ComputedStitchRouteSchema => {
    const holes = calculateStitchLineHoles(stitchLine, calculatedPath)

    return {
      path: calculatedPath.path,
      holes,
      isClosed: calculatedPath.isClosed,
      stitches: calculateRouteStitches(holes, calculatedPath.isClosed),
      disconnectedCorners: calculateRouteDisconnectedCorners(stitchLine, calculatedPath, holes),
    }
  })

  return {
    stitchLineId: stitchLine.id,
    targetType: stitchLine.targetType,
    targetId: stitchLine.targetId,
    componentId: target.componentId,
    autoComputedCornerRadius: getStitchLineAutoCornerRadius(stitchLine, target),
    boundingRect: calculateStitchLineBoundingRect(points),
    routes,
    connectingStitches: [],
  }
}

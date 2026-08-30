import type { ComputedStitchLineSchema } from '../../schemas/computed'
import type { ResolvedComponentBoundsStitchLineSchema } from '../../schemas/stitching'
import { calculateStitchLineBoundingRect } from './calculateStitchLineBoundingRect'
import { calculateStitchLineHoles } from './calculateStitchLineHoles'
import { calculateStitchLinePaths } from './calculateStitchLinePaths'
import { calculateRouteStitches } from './calculateRouteStitches'
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
  const routes = calculatedPaths.map((calculatedPath) => ({
    path: calculatedPath.path,
    holes: calculateStitchLineHoles(stitchLine, calculatedPath),
    isClosed: calculatedPath.isClosed,
  }))

  return {
    stitchLineId: stitchLine.id,
    targetType: stitchLine.targetType,
    targetId: stitchLine.targetId,
    componentId: target.componentId,
    autoComputedCornerRadius: getStitchLineAutoCornerRadius(stitchLine, target),
    boundingRect: calculateStitchLineBoundingRect(points),
    routes,
    stitches: [...calculateRouteStitches(routes)],
  }
}

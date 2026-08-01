import type { ComputedStitchLineSchema } from '../../schemas/computed'
import type { ResolvedComponentBoundsStitchLineSchema } from '../../schemas/stitching'
import { calculateStitchLineHoles } from './calculateStitchLineHoles'
import { calculateStitchLinePaths } from './calculateStitchLinePaths'
import type { ComponentBoundsStitchLineTarget } from './helperTypes'

export const calculateComponentBoundsStitchLine = (
  stitchLine: ResolvedComponentBoundsStitchLineSchema,
  target: ComponentBoundsStitchLineTarget,
): ComputedStitchLineSchema => {
  const calculatedPaths = calculateStitchLinePaths(stitchLine, target)

  return {
    stitchLineId: stitchLine.id,
    targetType: stitchLine.targetType,
    targetId: stitchLine.targetId,
    componentId: target.componentId,
    routes: calculatedPaths.map((calculatedPath) => ({
      path: calculatedPath.path,
      holes: calculateStitchLineHoles(stitchLine, calculatedPath),
    })),
  }
}

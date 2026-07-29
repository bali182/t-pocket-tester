import type { ComponentSchema } from '../../schemas/components'
import type { ComputedComponentSchema, ComputedStitchLineSchema } from '../../schemas/computed'
import type { ResolvedComponentBoundsStitchLineSchema } from '../../schemas/stitching'
import { calculateStitchLineHoles } from './calculateStitchLineHoles'
import { calculateStitchLinePaths } from './calculateStitchLinePaths'

export const calculateComponentBoundsStitchLine = (
  stitchLine: ResolvedComponentBoundsStitchLineSchema,
  component: ComponentSchema,
  computedComponent: ComputedComponentSchema,
): ComputedStitchLineSchema => {
  if (stitchLine.targetType === 'hole') {
    throw new Error('Hole stitch line targets are not supported yet')
  }

  const calculatedPaths = calculateStitchLinePaths(stitchLine, component, computedComponent)

  return {
    stitchLineId: stitchLine.id,
    componentId: stitchLine.targetId,
    routes: calculatedPaths.map((calculatedPath) => ({
      path: calculatedPath.path,
      holes: calculateStitchLineHoles(stitchLine, calculatedPath),
    })),
  }
}

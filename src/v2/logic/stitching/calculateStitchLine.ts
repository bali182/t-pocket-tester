import type { ComponentSchema } from '../../schemas/components'
import type { ComputedComponentSchema, ComputedStitchLineSchema } from '../../schemas/computed'
import type { StitchLineSchema } from '../../schemas/stitching'
import { calculateStitchLineHoles } from './calculateStitchLineHoles'
import { calculateStitchLinePaths } from './calculateStitchLinePaths'

export const calculateStitchLine = (
  stitchLine: StitchLineSchema,
  component: ComponentSchema,
  computedComponent: ComputedComponentSchema,
): ComputedStitchLineSchema => {
  const calculatedPaths = calculateStitchLinePaths(stitchLine, component, computedComponent)

  return {
    stitchLineId: stitchLine.id,
    componentId: stitchLine.componentId,
    routes: calculatedPaths.map((calculatedPath) => ({
      path: calculatedPath.path,
      holes: calculateStitchLineHoles(stitchLine, calculatedPath),
    })),
  }
}

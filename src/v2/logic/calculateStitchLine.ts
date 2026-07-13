import type { ComponentSchema } from '../schemas/components'
import type { ComputedComponentSchema, ComputedStitchLineSchema } from '../schemas/computed'
import type { StitchLineSchema } from '../schemas/stitching'
import { calculateStitchLinePaths } from './calculateStitchLinePaths'

export const calculateStitchLine = (
  stitchLine: StitchLineSchema,
  component: ComponentSchema,
  computedComponent: ComputedComponentSchema,
): ComputedStitchLineSchema => {
  const paths = calculateStitchLinePaths(stitchLine, component, computedComponent)

  return {
    stitchLineId: stitchLine.id,
    componentId: stitchLine.componentId,
    routes: paths.map((path) => ({ path, holes: [] })),
  }
}

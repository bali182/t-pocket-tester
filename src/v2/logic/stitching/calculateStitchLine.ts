import type { ComponentSchema } from '../../schemas/components'
import type { ComputedComponentSchema, ComputedStitchLineSchema } from '../../schemas/computed'
import type { ProjectStitchLineSchema } from '../../schemas/stitching'
import { calculateStitchLineHoles } from './calculateStitchLineHoles'
import { calculateStitchLinePaths } from './calculateStitchLinePaths'
import { calculatePocketClusterStitchLine } from './calculatePocketClusterStitchLine'

export const calculateStitchLine = (
  stitchLine: ProjectStitchLineSchema,
  component: ComponentSchema,
  computedComponent: ComputedComponentSchema,
): ComputedStitchLineSchema => {
  if (stitchLine.type === 'pocket-cluster-stitch-line') {
    if (component.type !== 'pocket-cluster') {
      throw new Error('Pocket cluster stitch line requires a pocket cluster component')
    }

    if (computedComponent.type !== 'computed-pocket-cluster') {
      throw new Error('Pocket cluster stitch line requires a computed pocket cluster component')
    }

    return calculatePocketClusterStitchLine(stitchLine, component, computedComponent)
  }

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

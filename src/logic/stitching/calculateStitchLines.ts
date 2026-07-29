import type { ComponentSchema } from '../../schemas/components'
import type { ComputedComponentSchema, ComputedStitchLineSchema } from '../../schemas/computed'
import type { ResolvedStitchLineSchema } from '../../schemas/stitching'
import { isDefined } from '../../utils/isDefined'
import { calculateStitchLine } from './calculateStitchLine'

export const calculateStitchLines = (
  stitchLines: ResolvedStitchLineSchema[],
  components: Record<string, ComponentSchema>,
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedStitchLineSchema[] => {
  const computedStitchLines: ComputedStitchLineSchema[] = []

  for (const stitchLine of stitchLines) {
    if (stitchLine.targetType === 'hole') {
      throw new Error('Hole stitch line targets are not supported yet')
    }

    const component = components[stitchLine.targetId]
    const computedComponent = computedComponents[stitchLine.targetId]

    if (!isDefined(component) || !isDefined(computedComponent)) {
      continue
    }
    computedStitchLines.push(calculateStitchLine(stitchLine, component, computedComponent))
  }

  return computedStitchLines
}

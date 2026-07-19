import type { ComponentSchema } from '../../schemas/components'
import type { ComputedComponentSchema, ComputedStitchLineSchema } from '../../schemas/computed'
import type { StitchLineSchema } from '../../schemas/stitching'
import { isDefined } from '../../utils/isDefined'
import { calculateStitchLine } from './calculateStitchLine'

export const calculateStitchLines = (
  stitchLines: StitchLineSchema[],
  components: Record<string, ComponentSchema>,
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedStitchLineSchema[] => {
  const computedStitchLines: ComputedStitchLineSchema[] = []

  for (const stitchLine of stitchLines) {
    const component = components[stitchLine.componentId]
    const computedComponent = computedComponents[stitchLine.componentId]

    if (!isDefined(component) || !isDefined(computedComponent)) {
      continue
    }
    computedStitchLines.push(calculateStitchLine(stitchLine, component, computedComponent))
  }

  return computedStitchLines
}

import type { ComponentSchema } from '../../schemas/components'
import type { ComputedComponentSchema, ComputedStitchLineSchema } from '../../schemas/computed'
import type { StitchLineCommonConfigSchema, StitchLineSchema } from '../../schemas/stitching'
import { isDefined } from '../../utils/isDefined'
import { getResolvedStitchLine } from '../../utils/getResolvedStitchLine'
import { calculateStitchLine } from './calculateStitchLine'

export const calculateStitchLines = (
  stitchLines: StitchLineSchema[],
  stitchingSettings: StitchLineCommonConfigSchema,
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
    const resolvedStitchLine = getResolvedStitchLine(stitchLine, stitchingSettings)
    computedStitchLines.push(calculateStitchLine(resolvedStitchLine, component, computedComponent))
  }

  return computedStitchLines
}

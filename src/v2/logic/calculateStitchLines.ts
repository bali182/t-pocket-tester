import type { ComponentSchema } from '../schemas/components'
import type { ComputedComponentSchema, ComputedStitchLineSchema } from '../schemas/computed'
import type { StitchLineSchema } from '../schemas/stitching'
import { isDefined } from '../utils/isDefined'
import { calculateStitchLine } from './calculateStitchLine'

export const calculateStitchLines = (
  stitchLines: Record<string, StitchLineSchema>,
  components: Record<string, ComponentSchema>,
  computedComponents: Record<string, ComputedComponentSchema>,
): Record<string, ComputedStitchLineSchema> => {
  return Object.fromEntries(
    Object.values(stitchLines).map((stitchLine) => {
      const component = components[stitchLine.componentId]
      const computedComponent = computedComponents[stitchLine.componentId]

      if (!isDefined(component)) {
        throw new Error(`Stitch line component not found: ${stitchLine.componentId}`)
      }

      if (!isDefined(computedComponent)) {
        throw new Error(`Computed stitch line component not found: ${stitchLine.componentId}`)
      }

      return [stitchLine.id, calculateStitchLine(stitchLine, component, computedComponent)]
    }),
  )
}

import type { ComponentSchema } from '../../schemas/components'
import type { ComputedComponentSchema, ComputedStitchLineSchema } from '../../schemas/computed'
import type { ProjectStitchLineSchema } from '../../schemas/stitching'
import { isDefined } from '../../utils/isDefined'
import { calculateStitchLine } from './calculateStitchLine'

export const calculateStitchLines = (
  stitchLines: ProjectStitchLineSchema[],
  components: Record<string, ComponentSchema>,
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedStitchLineSchema[] => {
  return stitchLines.map((stitchLine) => {
    const component = components[stitchLine.componentId]
    const computedComponent = computedComponents[stitchLine.componentId]

    if (!isDefined(component)) {
      throw new Error(`Stitch line component not found: ${stitchLine.componentId}`)
    }

    if (!isDefined(computedComponent)) {
      throw new Error(`Computed stitch line component not found: ${stitchLine.componentId}`)
    }

    return calculateStitchLine(stitchLine, component, computedComponent)
  })
}

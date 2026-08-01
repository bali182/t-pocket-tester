import type { ComponentSchema } from '../../schemas/components'
import type { ComputedComponentSchema, ComputedHoleSchema, ComputedStitchLineSchema } from '../../schemas/computed'
import type { HoleSchema } from '../../schemas/hole'
import type { ResolvedStitchLineSchema } from '../../schemas/stitching'
import { isDefined } from '../../utils/isDefined'
import { getNormalizedCornerRadius } from '../cornerRadiusUtils'
import { calculateComponentBoundsStitchLine } from './calculateComponentBoundsStitchLine'
import { calculateStitchLine } from './calculateStitchLine'

export const calculateStitchLines = (
  stitchLines: ResolvedStitchLineSchema[],
  components: Record<string, ComponentSchema>,
  computedComponents: Record<string, ComputedComponentSchema>,
  holes: readonly HoleSchema[],
  computedHoles: readonly ComputedHoleSchema[],
): ComputedStitchLineSchema[] => {
  const computedStitchLines: ComputedStitchLineSchema[] = []

  for (const stitchLine of stitchLines) {
    if (stitchLine.targetType === 'hole') {
      const hole = holes.find((candidate) => candidate.id === stitchLine.targetId)
      const computedHole = computedHoles.find((candidate) => candidate.holeId === stitchLine.targetId)

      if (!isDefined(hole) || !isDefined(computedHole)) {
        continue
      }

      computedStitchLines.push(
        calculateComponentBoundsStitchLine(stitchLine, {
          componentId: computedHole.componentId,
          boundingRect: computedHole.boundingRect,
          cornerRadius: getNormalizedCornerRadius(hole),
        }),
      )

      continue
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

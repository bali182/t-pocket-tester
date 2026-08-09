import type { SubProjectSchema } from '../../schemas/subProject'
import { isDefined } from '../../utils/isDefined'
import type { MagicStitchLineFixPlan } from './types'

export const applyMagicStitchLineFixPlan = (
  subProject: SubProjectSchema,
  plan: MagicStitchLineFixPlan,
): SubProjectSchema => {
  const components = { ...subProject.components }
  for (const [componentId, component] of plan.componentUpdates) components[componentId] = component
  return {
    ...subProject,
    components,
    stitchLines: subProject.stitchLines.map((line) => {
      const updates = plan.stitchLineUpdates.get(line.id)
      return isDefined(updates) ? { ...line, ...updates } : line
    }),
  }
}

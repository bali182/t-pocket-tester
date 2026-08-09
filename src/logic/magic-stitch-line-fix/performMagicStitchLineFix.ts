import type { ProjectSchema } from '../../schemas/project'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'
import { applyMagicStitchLineFixPlan } from './applyMagicStitchLineFixPlan'
import { buildMagicStitchLineFixPlan } from './buildMagicStitchLineFixPlan'
import { collectStitchRequirements } from './collectStitchRequirements'
import type { MagicStitchLineFixResult } from './types'

export type { MagicStitchLineFixIssue, MagicStitchLineFixIssueReason, MagicStitchLineFixResult } from './types'

type MagicStitchLineFixParams = {
  project: ProjectSchema
  subProject: SubProjectSchema
  computedSubProject: ComputedSubProjectSchema
}

export const performMagicStitchLineFix = ({
  project,
  subProject,
  computedSubProject,
}: MagicStitchLineFixParams): MagicStitchLineFixResult => {
  const requirements = collectStitchRequirements(project, subProject, computedSubProject)
  const plan = buildMagicStitchLineFixPlan(subProject, computedSubProject, requirements)
  return { subProject: applyMagicStitchLineFixPlan(subProject, plan), issues: plan.issues }
}

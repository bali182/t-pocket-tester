import { MagicFixConfigSchema } from '../../../schemas/magicFixConfig'
import { MagicFixIssueSchema } from '../../../schemas/magicFixIssues'
import { ProjectSchema } from '../../../schemas/project'
import { ComputedSubProjectSchema, SubProjectSchema } from '../../../schemas/subProject'

export type MagicFixResolutionHeuristicsInput = {
  project: ProjectSchema
  subProject: SubProjectSchema
  computed: ComputedSubProjectSchema
  config: MagicFixConfigSchema
  issues: MagicFixIssueSchema[]
}

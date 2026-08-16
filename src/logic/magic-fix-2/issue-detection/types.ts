import { MagicFixConfigSchema } from '../../../schemas/magicFixConfig'
import { ProjectSchema } from '../../../schemas/project'
import { ComputedSubProjectSchema, SubProjectSchema } from '../../../schemas/subProject'

export type MagicFixIssueDetectorInput = {
  project: ProjectSchema
  subProject: SubProjectSchema
  computed: ComputedSubProjectSchema
  config: MagicFixConfigSchema
}

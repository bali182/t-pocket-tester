import { MagicFixIssueSchema } from '../../../schemas/magicFixIssues'
import { ProjectSchema } from '../../../schemas/project'
import { ComputedSubProjectSchema, SubProjectSchema } from '../../../schemas/subProject'

export const getMagicFixIssues = (
  project: ProjectSchema,
  subProject: SubProjectSchema,
  computed: ComputedSubProjectSchema,
): MagicFixIssueSchema[] => {
  // TODO
  return []
}

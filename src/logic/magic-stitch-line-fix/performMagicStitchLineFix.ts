import { ProjectSchema } from '../../schemas/project'
import { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'

type MagicStitchLineFixParams = {
  project: ProjectSchema
  subProject: SubProjectSchema
  computedSubProject: ComputedSubProjectSchema
}

export const performMagicStitchLineFix = ({
  project,
  subProject,
  computedSubProject,
}: MagicStitchLineFixParams): SubProjectSchema => {
  // TODO implement me.
  console.log(project, subProject, computedSubProject)
  return subProject
}

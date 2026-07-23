import { ProjectSchema } from '../../schemas/project'

export type MoveComponentParams = {
  componentId: string
  targetParentId: string
  beforeComponentId: string | undefined
}

export const moveComponent = (project: ProjectSchema, _params: MoveComponentParams): ProjectSchema => {
  return project
}

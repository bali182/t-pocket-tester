import { ProjectSchema } from '../../schemas/project'

export type CloneComponentParams = {
  componentId: string
}

export const cloneComponent = (project: ProjectSchema, _params: CloneComponentParams): ProjectSchema => {
  return project
}

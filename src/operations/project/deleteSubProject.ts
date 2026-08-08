import type { ProjectSchema } from '../../schemas/project'

export type DeleteSubProjectParams = {
  subProjectId: string
}

export const deleteSubProject = (project: ProjectSchema, { subProjectId }: DeleteSubProjectParams): ProjectSchema => {
  if (!project.subProjects.some((subProject) => subProject.id === subProjectId)) {
    return project
  }

  return {
    ...project,
    subProjects: project.subProjects.filter((subProject) => subProject.id !== subProjectId),
  }
}

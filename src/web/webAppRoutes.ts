export const webAppRoutes = {
  projects: '/projects',
  project: (projectId: string): string => `/projects/${projectId}`,
  subProject: (projectId: string, subProjectId: string): string => `/projects/${projectId}/${subProjectId}`,
}

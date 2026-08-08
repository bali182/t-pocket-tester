export const Routes = {
  root: '/',
  projects: '/projects',
  project: (projectId: string) => `/projects/${projectId}`,
  subProject: (projectId: string, subProjectId: string) => `/projects/${projectId}/${subProjectId}`,
}

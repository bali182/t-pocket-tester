export const electronAppRoutes = {
  projects: '/projects',
  project: (filePath: string): string => `/project/${encodeURIComponent(filePath)}`,
  subProject: (filePath: string, subProjectId: string): string =>
    `/project/${encodeURIComponent(filePath)}/${subProjectId}`,
}

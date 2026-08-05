export type ProjectRouteParams = {
  projectId: string
}

export type SubProjectRouteParams = ProjectRouteParams & {
  subProjectId: string
}

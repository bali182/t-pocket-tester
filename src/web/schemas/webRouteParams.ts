export type WebProjectRouteParamsSchema = {
  projectId: string
}

export type WebSubProjectRouteParamsSchema = WebProjectRouteParamsSchema & {
  subProjectId: string
}

export type ElectronProjectRouteParamsSchema = {
  filePath: string
}

export type ElectronSubProjectRouteParamsSchema = ElectronProjectRouteParamsSchema & {
  subProjectId: string
}

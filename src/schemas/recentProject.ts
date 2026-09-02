export type RecentProjectSchema = {
  lastOpenedAt: number
  lastSubProjectId?: string
  path?: string
  projectName?: string
}

export type RecentProjectVisualisationSchema = {
  formattedLastOpenedAt: string
  link: string
  path: string
  projectId: string
  projectName: string
  subProjectId?: string
  lastOpenedAt: number
}

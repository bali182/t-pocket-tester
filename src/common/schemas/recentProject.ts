export type RecentProjectSchema = {
  lastOpenedAt: number
  path: string
  lastSubProjectId?: string
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

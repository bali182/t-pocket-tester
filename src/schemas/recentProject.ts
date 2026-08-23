export type RecentProjectSchema = {
  lastOpenedAt: number
  lastSubProjectId?: string
}

export type RecentProjectVisualisationSchema = {
  formattedLastOpenedAt: string
  link: string
  projectId: string
  projectName: string
  subProjectId?: string
}

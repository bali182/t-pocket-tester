export type RecentProjectSchema = {
  lastOpenedAt: number
  lastSubProjectId?: string
}

// Key is either projectId (web) or file path (electron). Intentionall ambiguous, so both platform can use the same model.
export type RecentProjectsSchema = Record<string, RecentProjectSchema>

export type RecentProjectVisualisationSchema = {
  formattedLastOpenedAt: string
  id: string
  label: string
  link: string
  lastOpenedAt: number
}

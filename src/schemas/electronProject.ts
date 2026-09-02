import type { ProjectSchema } from './project'

export type ElectronProjectSchema = {
  filePath: string
  isDirty: boolean
  project: ProjectSchema
}

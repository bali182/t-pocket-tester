import type { ProjectSchema } from '../../common/schemas/project'

export type ElectronProjectSchema = {
  filePath: string
  isDirty: boolean
  project: ProjectSchema
}

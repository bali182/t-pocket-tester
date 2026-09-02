import type { Getter, Setter } from 'jotai'

import type { ProjectSchema } from '../../schemas/project'
import { isElectron } from '../isElectron'
import { electronProjectAdapter } from './electronProjectAdapter'
import { webProjectAdapter } from './webProjectAdapter'

export type ProjectAdapterSchema = {
  getFilePath: (get: Getter, projectId: string) => string | undefined
  getProjectName: (get: Getter, projectId: string) => string | undefined
  getProject: (get: Getter, projectId: string | undefined) => ProjectSchema | undefined
  setProject: (get: Getter, set: Setter, project: ProjectSchema) => void
}

export const projectAdapter: ProjectAdapterSchema = isElectron() ? electronProjectAdapter : webProjectAdapter

import { atom } from 'jotai'

import type { ProjectSchema } from '../schemas/project'

export const projectsAtom = atom<ProjectSchema[]>([])

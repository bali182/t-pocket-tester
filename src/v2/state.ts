import { atom, createStore } from 'jotai'
import { defaultProject } from './defaultStates'
import { ProjectSchema } from './schemas/project'

export const appStore = createStore()

export const projectAtom = atom<ProjectSchema>(defaultProject)

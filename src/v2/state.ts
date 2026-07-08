import { atom, createStore } from 'jotai'
import { defaultProject } from './defaultStates'
import { getComputedProject } from './logic/path/getComputedProject'
import { ProjectSchema } from './schemas/project'

export const appStore = createStore()

export const projectAtom = atom<ProjectSchema>(defaultProject)

export const computedProjectAtom = atom((get) => getComputedProject(get(projectAtom)))

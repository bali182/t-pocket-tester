import { atom, createStore } from 'jotai'
import type { SetStateAction } from 'react'

import { getPatchedProject } from '../component-patches/getPatchedProject'
import { defaultProject } from '../defaultStates'
import { getComputedProject } from '../logic/getComputedProject'
import type { ProjectSchema } from '../schemas/project'

export const appStore = createStore()

// Stores the final project model after automatic patches have been applied.
const projectStorageAtom = atom<ProjectSchema>(getPatchedProject(defaultProject, getComputedProject(defaultProject)))

// Public project atom. Writes apply the caller's update and then automatic project patches.
export const projectAtom = atom(
  (get): ProjectSchema => get(projectStorageAtom),
  (get, set, update: SetStateAction<ProjectSchema>): ProjectSchema => {
    const currentProject = get(projectStorageAtom)
    const updatedProject = typeof update === 'function' ? update(currentProject) : update
    const computedProject = getComputedProject(updatedProject)
    const patchedProject = getPatchedProject(updatedProject, computedProject)

    set(projectStorageAtom, patchedProject)

    return patchedProject
  },
)

// Read-only computed representation of the final project model.
export const computedProjectAtom = atom((get) => getComputedProject(get(projectAtom)))

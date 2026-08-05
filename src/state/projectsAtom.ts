import { atom } from 'jotai'
import type { SetStateAction } from 'react'

import type { SubProjectSchema } from '../schemas/subProject'
import { readProjectsFromStorage, saveProjectsToStorage } from './storage'

const projectsStorageAtom = atom<SubProjectSchema[]>(readProjectsFromStorage())

export const projectsAtom = atom(
  (get): SubProjectSchema[] => get(projectsStorageAtom),
  (get, set, update: SetStateAction<SubProjectSchema[]>): void => {
    const currentProjects = get(projectsStorageAtom)
    const updatedProjects = typeof update === 'function' ? update(currentProjects) : update

    set(projectsStorageAtom, updatedProjects)
    saveProjectsToStorage(updatedProjects)
  },
)

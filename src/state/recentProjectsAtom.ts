import { atom } from 'jotai'
import type { SetStateAction } from 'react'

import type { RecentProjectSchema } from '../schemas/recentProject'
import { readRecentProjectsFromStorage, saveRecentProjectsToStorage } from './storage'

const recentProjectsStorageAtom = atom<Record<string, RecentProjectSchema>>(readRecentProjectsFromStorage())

export const recentProjectsAtom = atom(
  (get): Record<string, RecentProjectSchema> => get(recentProjectsStorageAtom),
  (get, set, update: SetStateAction<Record<string, RecentProjectSchema>>): void => {
    const currentRecentProjects = get(recentProjectsStorageAtom)
    const updatedRecentProjects = typeof update === 'function' ? update(currentRecentProjects) : update

    set(recentProjectsStorageAtom, updatedRecentProjects)
    saveRecentProjectsToStorage(updatedRecentProjects)
  },
)

import { atom } from 'jotai'
import type { SetStateAction } from 'react'

import type { RecentProjectsSchema } from '../schemas/recentProject'
import { readRecentProjectsFromStorage, saveRecentProjectsToStorage } from './storage'

const recentProjectsStorageAtom = atom<RecentProjectsSchema>(readRecentProjectsFromStorage())

export const recentProjectsAtom = atom(
  (get): RecentProjectsSchema => get(recentProjectsStorageAtom),
  (get, set, update: SetStateAction<RecentProjectsSchema>): void => {
    const currentRecentProjects = get(recentProjectsStorageAtom)
    const updatedRecentProjects = typeof update === 'function' ? update(currentRecentProjects) : update

    set(recentProjectsStorageAtom, updatedRecentProjects)
    saveRecentProjectsToStorage(updatedRecentProjects)
  },
)

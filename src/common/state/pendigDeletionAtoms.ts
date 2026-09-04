import { atom } from 'jotai'

export type PendingSubProjectDeletionSchema = {
  subProjectId: string
  redirectPath: string
}

export const pendingSubProjectDeletionAtom = atom<PendingSubProjectDeletionSchema | undefined>()

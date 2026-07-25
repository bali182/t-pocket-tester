import { atom } from 'jotai'

import { readScalingFromStorage, saveScalingToStorage } from './storage'

const scalingStorageAtom = atom<number>(readScalingFromStorage())

export const scalingAtom = atom(
  (get): number => get(scalingStorageAtom),
  (_get, set, nextScaling: number): void => {
    set(scalingStorageAtom, nextScaling)
    saveScalingToStorage(nextScaling)
  },
)

import { atom } from 'jotai'

export type LastTouchedComponent = {
  projectId: string
  componentId: string
}

export const lastTouchedComponentAtom = atom<LastTouchedComponent | undefined>(undefined)

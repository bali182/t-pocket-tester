import { atom } from 'jotai'

import type { SubProjectHistoryStateSchema } from '../schemas/subProjectHistory'

const initialSubProjectHistoryState: SubProjectHistoryStateSchema = {
  histories: new Map(),
  activeThrottle: undefined,
}

export const subProjectHistoryAtom = atom<SubProjectHistoryStateSchema>(initialSubProjectHistoryState)

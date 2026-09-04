import { atom } from 'jotai'

import type { ElectronProjectSchema } from '../schemas/electronProject'

export const electronProjectAtom = atom<ElectronProjectSchema | undefined>(undefined)

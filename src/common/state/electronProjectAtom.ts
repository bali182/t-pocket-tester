import { atom } from 'jotai'

import { Loadable } from '../loadable'
import type { ElectronProjectSchema } from '../schemas/electronProject'
import type { LoadableSchema } from '../schemas/loadable'

export const electronProjectAtom = atom<LoadableSchema<ElectronProjectSchema>>(Loadable.uninitialized())

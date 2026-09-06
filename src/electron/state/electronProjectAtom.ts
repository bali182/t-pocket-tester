import { atom } from 'jotai'

import { Loadable } from '../../common/loadable'
import type { LoadableSchema } from '../../common/schemas/loadable'
import type { ElectronProjectSchema } from '../schemas/electronProject'

export const electronProjectAtom = atom<LoadableSchema<ElectronProjectSchema>>(Loadable.uninitialized())

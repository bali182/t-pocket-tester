import { atom } from 'jotai'

import { defaultSvgExportParams } from '../defaultStates'
import type { SvgExportParamsSchema } from '../schemas/svgExport'
import { readSvgExportParamsFromStorage, saveSvgExportParamsToStorage } from './storage'

const svgExportParamsStorageAtom = atom<SvgExportParamsSchema>(readSvgExportParamsFromStorage(defaultSvgExportParams))

export const svgExportParamsAtom = atom(
  (get): SvgExportParamsSchema => get(svgExportParamsStorageAtom),
  (_get, set, nextParams: SvgExportParamsSchema): void => {
    set(svgExportParamsStorageAtom, nextParams)
    saveSvgExportParamsToStorage(nextParams)
  },
)

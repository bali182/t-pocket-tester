import { atom } from 'jotai'

import { defaultSvgExportParams } from '../defaultStates'
import { BaseExportSettingsSchema } from '../schemas/settings'
import { readSvgExportParamsFromStorage, saveSvgExportParamsToStorage } from './storage'

const svgExportParamsStorageAtom = atom<BaseExportSettingsSchema>(
  readSvgExportParamsFromStorage(defaultSvgExportParams),
)

export const svgExportParamsAtom = atom(
  (get): BaseExportSettingsSchema => get(svgExportParamsStorageAtom),
  (_get, set, nextParams: BaseExportSettingsSchema): void => {
    set(svgExportParamsStorageAtom, nextParams)
    saveSvgExportParamsToStorage(nextParams)
  },
)

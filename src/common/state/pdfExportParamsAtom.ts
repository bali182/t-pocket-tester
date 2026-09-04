import { atom } from 'jotai'

import { defaultPdfExportParams } from '../defaultStates'
import type { PdfExportSettingsSchema } from '../schemas/pdfExport'
import { readPdfExportParamsFromStorage, savePdfExportParamsToStorage } from './storage'

const pdfExportParamsStorageAtom = atom<PdfExportSettingsSchema>(readPdfExportParamsFromStorage(defaultPdfExportParams))

export const pdfExportParamsAtom = atom(
  (get): PdfExportSettingsSchema => get(pdfExportParamsStorageAtom),
  (_get, set, nextParams: PdfExportSettingsSchema): void => {
    set(pdfExportParamsStorageAtom, nextParams)
    savePdfExportParamsToStorage(nextParams)
  },
)

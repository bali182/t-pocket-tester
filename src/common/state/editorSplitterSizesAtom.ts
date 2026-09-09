import { atom } from 'jotai'

import { readEditorSplitterSizesFromStorage, saveEditorSplitterSizesToStorage } from './storage'

export type EditorSplitterSizes = [string | number, string | number]

const defaultEditorSplitterSizes: EditorSplitterSizes = ['auto', '350px']

const editorSplitterSizesStorageAtom = atom<EditorSplitterSizes>(
  readEditorSplitterSizesFromStorage(defaultEditorSplitterSizes),
)

export const editorSplitterSizesAtom = atom(
  (get): EditorSplitterSizes => get(editorSplitterSizesStorageAtom),
  (_get, set, nextSizes: EditorSplitterSizes): void => {
    set(editorSplitterSizesStorageAtom, nextSizes)
    saveEditorSplitterSizesToStorage(nextSizes)
  },
)

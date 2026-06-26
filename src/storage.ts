import type { PrimitiveAtom } from 'jotai'
import type { Store } from 'jotai/vanilla/store'

import {
  cardHolderInputAtom,
  DEFAULT_CARD_HOLDER_INPUT,
  DEFAULT_INPUT_SECTION_OPEN_STATE,
  DEFAULT_IS_INPUT_DRAWER_OPEN,
  DEFAULT_SCALE,
  inputSectionOpenStateAtom,
  isInputDrawerOpenAtom,
  scaleAtom,
} from './state'

type PersistedAtomEntry<T> = {
  atom: PrimitiveAtom<T>
  name: string
  defaultValue: T
}

const createPersistedAtomEntry = <T>(atom: PrimitiveAtom<T>, name: string, defaultValue: T): PersistedAtomEntry<T> => {
  return {
    atom,
    name,
    defaultValue,
  }
}

const persistedAtoms: PersistedAtomEntry<any>[] = [
  createPersistedAtomEntry(cardHolderInputAtom, 'cardHolderInput', DEFAULT_CARD_HOLDER_INPUT),
  createPersistedAtomEntry(isInputDrawerOpenAtom, 'isInputDrawerOpen', DEFAULT_IS_INPUT_DRAWER_OPEN),
  createPersistedAtomEntry(scaleAtom, 'scale', DEFAULT_SCALE),
  createPersistedAtomEntry(inputSectionOpenStateAtom, 'inputSectionOpenState', DEFAULT_INPUT_SECTION_OPEN_STATE),
]

const getStorageKey = (name: string): string => {
  return `t-pocket-tester:${name}`
}

export const getInitialStateFromStorage = <T>(entry: PersistedAtomEntry<T>): T => {
  const storedValue = localStorage.getItem(getStorageKey(entry.name))

  if (!storedValue) {
    return entry.defaultValue
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue)

    // TODO: Add schema validation before returning persisted values.
    return parsedValue as T
  } catch {
    return entry.defaultValue
  }
}

export const initializeAtomsFromStorage = (store: Store): void => {
  persistedAtoms.forEach((entry) => {
    store.set(entry.atom, getInitialStateFromStorage(entry))
  })
}

const subscribeToAtom = <T>(store: Store, entry: PersistedAtomEntry<T>): VoidFunction => {
  return store.sub(entry.atom, () => {
    const value = store.get(entry.atom)
    localStorage.setItem(getStorageKey(entry.name), JSON.stringify(value))
  })
}

export const subscribeToAtoms = (store: Store): VoidFunction => {
  const unsubscribeList = persistedAtoms.map((entry) => subscribeToAtom(store, entry))

  return () => {
    unsubscribeList.forEach((unsubscribe) => unsubscribe())
  }
}

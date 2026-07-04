import type { PrimitiveAtom } from 'jotai'
import type { Store } from 'jotai/vanilla/store'

import typia from 'typia'
import { CardHolderInputSchema } from './schemas/CardHolderInputSchema'
import { cardHolderInputAtom, DEFAULT_CARD_HOLDER_INPUT, DEFAULT_SCALE, scaleAtom } from './state'

type PersistedAtomEntry<T> = {
  atom: PrimitiveAtom<T>
  name: string
  defaultValue: T
  validate: (input: unknown) => T
}

const createPersistedAtomEntry = <T>(
  atom: PrimitiveAtom<T>,
  name: string,
  defaultValue: T,
  validate: (input: unknown) => T,
): PersistedAtomEntry<T> => {
  return {
    atom,
    name,
    defaultValue,
    validate,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const persistedAtoms: PersistedAtomEntry<any>[] = [
  createPersistedAtomEntry(cardHolderInputAtom, 'cardHolderInput', DEFAULT_CARD_HOLDER_INPUT, (input) =>
    typia.assert<CardHolderInputSchema>(input),
  ),
  createPersistedAtomEntry(scaleAtom, 'scale', DEFAULT_SCALE, (input) => typia.assert<number>(input)),
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
    return entry.validate(JSON.parse(storedValue))
  } catch (e) {
    console.error(`Caught invalid localStorage entry "${entry.name}":`, e)
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

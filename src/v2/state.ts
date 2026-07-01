import { atom, createStore } from 'jotai'
import { defaultComponent } from './defaultStates'
import { ComponentSchema } from './schemas/components'
import { testState } from './testState'

export const appStore = createStore()

export const componentsAtom = atom<Record<string, ComponentSchema>>({
  // [defaultComponent.id]: defaultComponent,
  ...testState,
})

export const rootComponentIdAtom = atom<string>(defaultComponent.id)

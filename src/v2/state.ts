import { atom, createStore } from 'jotai'
import { defaultComponent } from './defaultStates'
import { ComponentSchema } from './schemas/components'

export const appStore = createStore()

export const componentsAtom = atom<Record<string, ComponentSchema>>({
  [defaultComponent.id]: defaultComponent,
})

export const rootComponentIdAtom = atom<string>(defaultComponent.id)

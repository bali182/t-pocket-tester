import { atom, createStore } from 'jotai'
import { defaultComponent } from './defaultStates'
import { PanelSchema } from './schemas/components'

export const appStore = createStore()

export const componentsAtom = atom<Record<string, PanelSchema>>({
  [defaultComponent.id]: defaultComponent,
})

export const rootComponentIdAtom = atom<string>(defaultComponent.id)

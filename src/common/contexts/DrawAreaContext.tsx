import { createContext, useContext } from 'react'
import type { DrawAreaContextValue } from '../schemas/drawArea'
import { defaultDrawAreaContext } from './drawAreaContextDefaults'

export const DrawAreaContext = createContext<DrawAreaContextValue>(defaultDrawAreaContext)

export const useDrawAreaContext = (): DrawAreaContextValue => {
  return useContext(DrawAreaContext)
}

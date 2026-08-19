import { createContext, useContext } from 'react'

export type NumberEditorStepContextValue = {
  step: number
}

export const defaultNumberEditorStep: NumberEditorStepContextValue = {
  step: 1,
}

export const NumberEditorStepContext = createContext<NumberEditorStepContextValue>(defaultNumberEditorStep)

export const useNumberEditorStepContext = () => {
  return useContext(NumberEditorStepContext)
}

import { createContext, useContext } from 'react'

import type { CommandNameSchema, CommandSchema } from '../schemas/shortcut'

export type ElectronCommandsContextValue = {
  emitCommand: (commandName: CommandNameSchema) => Promise<void>
  getCommand: (commandName: CommandNameSchema) => CommandSchema
  getCommandShortcut: (commandName: CommandNameSchema) => string
}

const getMissingCommand = (): never => {
  throw new Error('Electron commands context is unavailable')
}

const defaultElectronCommandsContextValue: ElectronCommandsContextValue = {
  emitCommand: getMissingCommand,
  getCommand: getMissingCommand,
  getCommandShortcut: getMissingCommand,
}

export const ElectronCommandsContext = createContext<ElectronCommandsContextValue>(defaultElectronCommandsContextValue)

export const useElectronCommandsContext = (): ElectronCommandsContextValue => {
  return useContext(ElectronCommandsContext)
}

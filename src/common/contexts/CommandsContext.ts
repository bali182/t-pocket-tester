import { createContext, useContext } from 'react'

import type { CommandSchema } from '../schemas/command'

export type CommandsContextValue<C> = {
  emitCommand: (id: C) => Promise<void>
  getCommand: (id: C) => CommandSchema<C>
}

const getMissingCommand = (): never => {
  throw new Error('CommandsContext is unavailable')
}

const defaultCommandsContextValue: CommandsContextValue<string> = {
  emitCommand: getMissingCommand,
  getCommand: getMissingCommand,
}

export const CommandsContext = createContext<CommandsContextValue<string>>(defaultCommandsContextValue)

export const useCommandsContext = <C extends string>(): CommandsContextValue<C> => {
  return useContext(CommandsContext) as unknown as CommandsContextValue<C>
}

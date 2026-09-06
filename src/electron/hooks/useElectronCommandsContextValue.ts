import { useCallback } from 'react'

import type { CommandsContextValue } from '../../common/contexts/CommandsContext'
import { useCommonCommandEmitter } from '../../common/hooks/useCommonCommandEmitter'
import { isDefined } from '../../common/utils/isDefined'
import type { ElectronCommand, ElectronCommandIdSchema } from '../schemas/electronCommands'
import { useElectronCommands } from './useElectronCommands'
import { useElectronProject } from './useElectronProject'

export const useElectronCommandsContextValue = (): CommandsContextValue<ElectronCommandIdSchema> => {
  const { openProject, saveProject, saveProjectAs } = useElectronProject()

  const commands = useElectronCommands()

  const getCommand = useCallback(
    (id: ElectronCommandIdSchema): ElectronCommand => {
      const command = commands[id]
      if (!isDefined(command)) {
        throw new Error(`Unknown command: ${id}`)
      }
      return command
    },
    [commands],
  )

  const emitCommand = useCallback(
    async (id: ElectronCommandIdSchema): Promise<void> => {
      const command = getCommand(id)

      if (command.disabled === true) {
        return
      }

      switch (id) {
        case 'open':
          return openProject()
        case 'save':
          return saveProject()
        case 'save-as':
          return saveProjectAs()
      }
    },
    [getCommand, openProject, saveProject, saveProjectAs],
  )

  useCommonCommandEmitter({ commands, execute: emitCommand })

  return { emitCommand, getCommand }
}

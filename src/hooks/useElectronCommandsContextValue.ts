import { useCallback, useEffect, useEffectEvent, useMemo } from 'react'

import type { ElectronCommandsContextValue } from '../contexts/ElectronCommandsContext'
import { fileManagement } from '../platform/fileManagement'
import type { CommandNameSchema, CommandSchema } from '../schemas/shortcut'
import { formatShortcut } from '../utils/formatShortcut'
import { isDefined } from '../utils/isDefined'
import { matchesShortcut } from '../utils/matchesShortcut'
import { useElectronProject } from './useElectronProject'

export const useElectronCommandsContextValue = (): ElectronCommandsContextValue => {
  const { electronProject, openProject, saveProject, saveProjectAs } = useElectronProject()
  const platform = fileManagement.platform
  const commands = useMemo<CommandSchema[]>(
    () => [
      {
        combination: ['CommandOrControl', 'O'],
        id: 'open',
      },
      {
        combination: ['CommandOrControl', 'S'],
        disabled: !isDefined(electronProject) || electronProject.isDirty === false,
        id: 'save',
      },
      {
        combination: ['CommandOrControl', 'Shift', 'S'],
        disabled: !isDefined(electronProject),
        id: 'save-as',
      },
    ],
    [electronProject],
  )

  const commandsMap = useMemo<Record<CommandNameSchema, CommandSchema>>(
    () =>
      commands.reduce(
        (map, command) => ({ ...map, [command.id]: command }),
        {} as Record<CommandNameSchema, CommandSchema>,
      ),
    [commands],
  )

  const getCommand = useCallback(
    (commandName: CommandNameSchema): CommandSchema => {
      const command = commandsMap[commandName]
      if (!isDefined(command)) {
        throw new Error(`Unknown Electron command: ${commandName}`)
      }
      return command
    },
    [commandsMap],
  )

  const emitCommand = useCallback(
    async (commandName: CommandNameSchema): Promise<void> => {
      const command = getCommand(commandName)

      if (command.disabled === true) {
        return
      }

      switch (commandName) {
        case 'open':
          await openProject()
          return
        case 'save':
          await saveProject()
          return
        case 'save-as':
          await saveProjectAs()
      }
    },
    [getCommand, openProject, saveProject, saveProjectAs],
  )

  const getCommandShortcut = useCallback(
    (commandName: CommandNameSchema): string => {
      const command = getCommand(commandName)
      return formatShortcut(command.combination, platform)
    },
    [getCommand, platform],
  )

  const handleKeyDown = useEffectEvent(async (event: KeyboardEvent): Promise<void> => {
    const command = commands.find((candidate: CommandSchema): boolean =>
      matchesShortcut(candidate.combination, event, platform),
    )

    if (!isDefined(command)) {
      return
    }

    event.preventDefault()
    await emitCommand(command.id)
  })

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return { emitCommand, getCommand, getCommandShortcut }
}

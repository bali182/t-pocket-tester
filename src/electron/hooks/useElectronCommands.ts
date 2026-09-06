import { useMemo } from 'react'

import { useCommonCommands } from '../../common/hooks/useCommonCommands'
import { Loadable } from '../../common/loadable'
import type { CommandSchema } from '../../common/schemas/command'
import { ElectronCommandIdSchema } from '../schemas/electronCommands'
import type { ElectronProjectSchema } from '../schemas/electronProject'
import { useElectronProject } from './useElectronProject'

export const useElectronCommands = (): Record<ElectronCommandIdSchema, CommandSchema<ElectronCommandIdSchema>> => {
  const { electronProject } = useElectronProject()
  const hasProjectAndIsDirty = Loadable.get(
    Loadable.map(electronProject, (project: ElectronProjectSchema): boolean => project.isDirty),
    true,
  )
  const hasOpenProject = Loadable.get(
    Loadable.map(electronProject, (): boolean => true),
    true,
  )

  const commonCommands = useCommonCommands({ hasOpenProject })

  const commands = useMemo<Record<ElectronCommandIdSchema, CommandSchema<ElectronCommandIdSchema>>>(() => {
    return {
      // File basics
      save: {
        id: 'save',
        disabled: !hasProjectAndIsDirty,
        combination: ['CommandOrControl', 'S'],
      },
      'save-as': {
        id: 'save-as',
        disabled: !hasOpenProject,
        combination: ['CommandOrControl', 'Shift', 'S'],
      },
      open: {
        id: 'open',
        disabled: false,
        combination: ['CommandOrControl', 'O'],
      },
      // Common commands
      ...commonCommands,
    }
  }, [commonCommands, hasOpenProject, hasProjectAndIsDirty])

  return commands
}

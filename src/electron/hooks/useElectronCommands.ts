import { useMemo } from 'react'

import { useCommonCommands } from '../../common/hooks/useCommonCommands'
import { useSubProjectHistory } from '../../common/hooks/useSubProjectHistory'
import { Loadable } from '../../common/loadable'
import type { ElectronCommandMap } from '../schemas/electronCommands'
import type { ElectronProjectSchema } from '../schemas/electronProject'
import { useElectronProject } from './useElectronProject'

export const useElectronCommands = (): ElectronCommandMap => {
  const { electronProject } = useElectronProject()
  const { canRedo, canUndo } = useSubProjectHistory()
  const hasProjectAndIsDirty = Loadable.get(
    Loadable.map(electronProject, (project: ElectronProjectSchema): boolean => project.isDirty),
    true,
  )
  const hasOpenProject = Loadable.get(
    Loadable.map(electronProject, (): boolean => true),
    true,
  )

  const commonCommands = useCommonCommands({
    canRedo,
    canUndo,
    hasOpenProject,
  })

  const commands = useMemo<ElectronCommandMap>(() => {
    return {
      // File basics
      save: {
        id: 'save',
        disabled: !hasProjectAndIsDirty,
        shortcut: { default: ['CommandOrControl', 'S'] },
      },
      'save-as': {
        id: 'save-as',
        disabled: !hasOpenProject,
        shortcut: { default: ['CommandOrControl', 'Shift', 'S'] },
      },
      open: {
        id: 'open',
        disabled: false,
        shortcut: { default: ['CommandOrControl', 'O'] },
      },
      // Common commands
      ...commonCommands,
    } satisfies ElectronCommandMap
  }, [commonCommands, hasOpenProject, hasProjectAndIsDirty])

  return commands
}

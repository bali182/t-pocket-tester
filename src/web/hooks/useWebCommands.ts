import { useMemo } from 'react'

import { useCommonCommands } from '../../common/hooks/useCommonCommands'
import { useOptionalProject } from '../../common/hooks/useOptionalProject'
import { isDefined } from '../../common/utils/isDefined'
import { WebCommandIdSchema, WebCommandSchema } from '../schemas/webCommands'

export const useWebCommands = (): Record<WebCommandIdSchema, WebCommandSchema> => {
  const { project } = useOptionalProject()
  const hasOpenProject = isDefined(project)
  const commonCommands = useCommonCommands({ hasOpenProject })

  const commands = useMemo<Record<WebCommandIdSchema, WebCommandSchema>>(() => {
    return {
      // File basics
      'download-project': {
        id: 'download-project',
        disabled: !hasOpenProject,
        combination: ['CommandOrControl', 'S'],
      },
      // Common commands
      ...commonCommands,
    }
  }, [commonCommands, hasOpenProject])

  return commands
}

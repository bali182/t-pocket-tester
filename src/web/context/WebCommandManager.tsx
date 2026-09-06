import { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { PdfExportDialog } from '../../common/components/PdfExportDialog'
import { ScalingDialog } from '../../common/components/ScalingDialog'
import { SvgExportDialog } from '../../common/components/SvgExportDialog'
import {
  EDITOR_MEDIUM_STEP,
  EDITOR_SMALL_STEP,
  EDITOR_STITCH_HOLE_DISTANCE_STEP,
} from '../../common/constants/commands'
import { CommandsContext, CommandsContextValue } from '../../common/contexts/CommandsContext'
import { useCommonCommandEmitter } from '../../common/hooks/useCommonCommandEmitter'
import { useOptionalProject } from '../../common/hooks/useOptionalProject'
import { useProjectOperations } from '../../common/hooks/useProjectOperations'
import { downloadFile } from '../../common/utils/downloadFile'
import { isDefined } from '../../common/utils/isDefined'
import { useWebCommands } from '../hooks/useWebCommands'
import { WebCommandIdSchema, WebCommandSchema } from '../schemas/webCommands'

export const WebCommandManager: FC<PropsWithChildren> = ({ children }) => {
  const [isScalingDialogOpen, setScalingDialogOpen] = useState<boolean>(false)
  const [isSvgExportDialogOpen, setSvgExportDialogOpen] = useState<boolean>(false)
  const [isPdfExportDialogOpen, setPdfExportDialogOpen] = useState<boolean>(false)
  const { updateEditingSettings, updateStitchingSettings } = useProjectOperations()
  const { project } = useOptionalProject()

  const commands = useWebCommands()

  const getCommand = useCallback(
    (id: WebCommandIdSchema): WebCommandSchema => {
      const command = commands[id]
      if (!isDefined(command)) {
        throw new Error(`Unknown command: ${id}`)
      }
      return command
    },
    [commands],
  )

  const emitCommand = useCallback(
    async (id: WebCommandIdSchema): Promise<void> => {
      const command = getCommand(id)

      if (command.disabled === true) {
        return
      }

      switch (id) {
        case 'export-svg':
          return setSvgExportDialogOpen(true)
        case 'export-pdf':
          return setSvgExportDialogOpen(true)
        case 'scaling':
          return setScalingDialogOpen(true)
        case 'increment-small':
          return updateEditingSettings({ numberEditorStep: EDITOR_SMALL_STEP })
        case 'increment-medium':
          return updateEditingSettings({ numberEditorStep: EDITOR_MEDIUM_STEP })
        case 'increment-stitch-hole-distance':
          return updateEditingSettings({ numberEditorStep: EDITOR_STITCH_HOLE_DISTANCE_STEP })
        case 'stitch-line-visibility':
          return updateStitchingSettings({ stitchLinesVisible: !project?.stitchingSettings?.stitchLinesVisible })
        case 'stitch-hole-visibility':
          return updateStitchingSettings({ stitchHolesVisible: !project?.stitchingSettings?.stitchHolesVisible })
        case 'stitches-visibility':
          return updateStitchingSettings({ stitchesVisible: !project?.stitchingSettings?.stitchesVisible })
        case 'download-project': {
          if (!isDefined(project)) {
            throw new Error(`Cannot download project.`)
          }
          return downloadFile({
            content: JSON.stringify(project, null, 2),
            contentType: 'application/json',
            fileName: `${project.name}.json`,
          })
        }
        default:
          console.log(`Command "${id}" not yet handled!`)
      }
    },
    [getCommand, project, updateEditingSettings, updateStitchingSettings],
  )

  useCommonCommandEmitter({ commands, execute: emitCommand })

  const value = useMemo<CommandsContextValue<WebCommandIdSchema>>(
    () => ({ emitCommand, getCommand }),
    [emitCommand, getCommand],
  )

  return (
    <CommandsContext.Provider value={value as CommandsContextValue<string>}>
      {children}
      {!commands['export-svg'].disabled && (
        <SvgExportDialog isOpen={isSvgExportDialogOpen} onOpenChange={setSvgExportDialogOpen} />
      )}
      {!commands['export-pdf'].disabled && (
        <PdfExportDialog isOpen={isPdfExportDialogOpen} onOpenChange={setPdfExportDialogOpen} />
      )}
      {!commands['scaling'].disabled && (
        <ScalingDialog isOpen={isScalingDialogOpen} onOpenChange={setScalingDialogOpen} />
      )}
    </CommandsContext.Provider>
  )
}

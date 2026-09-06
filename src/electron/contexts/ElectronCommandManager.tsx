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
import { isDefined } from '../../common/utils/isDefined'
import { useElectronCommands } from '../hooks/useElectronCommands'
import { useElectronProject } from '../hooks/useElectronProject'
import { ElectronCommand, ElectronCommandIdSchema } from '../schemas/electronCommands'

export const ElectronCommandManager: FC<PropsWithChildren> = ({ children }) => {
  const [isScalingDialogOpen, setScalingDialogOpen] = useState<boolean>(false)
  const [isSvgExportDialogOpen, setSvgExportDialogOpen] = useState<boolean>(false)
  const [isPdfExportDialogOpen, setPdfExportDialogOpen] = useState<boolean>(false)
  const { openProject, saveProject, saveProjectAs } = useElectronProject()
  const { updateEditingSettings, updateStitchingSettings } = useProjectOperations()
  const { project } = useOptionalProject()

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
        default:
          console.log(`Command "${id}" not yet handled!`)
      }
    },
    [
      getCommand,
      openProject,
      project?.stitchingSettings?.stitchHolesVisible,
      project?.stitchingSettings?.stitchLinesVisible,
      project?.stitchingSettings?.stitchesVisible,
      saveProject,
      saveProjectAs,
      updateEditingSettings,
      updateStitchingSettings,
    ],
  )

  useCommonCommandEmitter({ commands, execute: emitCommand })

  const value = useMemo<CommandsContextValue<ElectronCommandIdSchema>>(
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

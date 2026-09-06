import { Menu } from '@chakra-ui/react'
import { FC, useCallback, useState } from 'react'
import { PiExport, PiFloppyDisk, PiFolder } from 'react-icons/pi'
import { useCommandsContext } from '../../../contexts/CommandsContext'
import { useProject } from '../../../hooks/useProject'
import { isElectron } from '../../../platform/isElectron'
import { useTranslation } from '../../../translations/translation'
import { PdfExportDialog } from '../../PdfExportDialog'
import { SvgExportDialog } from '../../SvgExportDialog'
import { BaseMenu } from '../BaseMenu'
import { MenuShortcut } from '../MenuShortcut'

export const FileMenu: FC = () => {
  const t = useTranslation()
  const { project } = useProject()
  const [isSvgExportDialogOpen, setSvgExportDialogOpen] = useState<boolean>(false)
  const [isPdfExportDialogOpen, setPdfExportDialogOpen] = useState<boolean>(false)
  const isExportEnabled = project.subProjects.length > 0

  const handleSvgExportClick = useCallback(() => setSvgExportDialogOpen(true), [])
  const handlePdfExportClick = useCallback(() => setPdfExportDialogOpen(true), [])

  return (
    <>
      <BaseMenu title={t.editor.menus.file.name}>
        {isElectron() && <ElectronFileManegementMenu />}
        <Menu.ItemGroup>
          <Menu.ItemGroupLabel>{t.editor.menus.file.export.name}</Menu.ItemGroupLabel>
          <Menu.Item disabled={!isExportEnabled} value="export-svg" onSelect={handleSvgExportClick}>
            <PiExport />
            <Menu.ItemText>{t.editor.menus.file.export.svg}</Menu.ItemText>
          </Menu.Item>
          <Menu.Item disabled={!isExportEnabled} value="export-pdf" onSelect={handlePdfExportClick}>
            <PiExport />
            <Menu.ItemText>{t.editor.menus.file.export.pdf}</Menu.ItemText>
          </Menu.Item>
        </Menu.ItemGroup>
      </BaseMenu>

      {/* Own modals */}
      {isExportEnabled && <SvgExportDialog isOpen={isSvgExportDialogOpen} onOpenChange={setSvgExportDialogOpen} />}
      {isExportEnabled && <PdfExportDialog isOpen={isPdfExportDialogOpen} onOpenChange={setPdfExportDialogOpen} />}
    </>
  )
}

const ElectronFileManegementMenu: FC = () => {
  const t = useTranslation()
  const { emitCommand, getCommand } = useCommandsContext()
  const openCommand = getCommand('open')
  const saveCommand = getCommand('save')
  const saveAsCommand = getCommand('save-as')

  const handleOpenProjectSelect = useCallback(
    (): Promise<void> => emitCommand(openCommand.id),
    [emitCommand, openCommand.id],
  )
  const handleSaveProjectSelect = useCallback(
    (): Promise<void> => emitCommand(saveCommand.id),
    [emitCommand, saveCommand.id],
  )
  const handleSaveProjectAsSelect = useCallback(
    (): Promise<void> => emitCommand(saveAsCommand.id),
    [emitCommand, saveAsCommand.id],
  )

  return (
    <Menu.ItemGroup>
      <Menu.ItemGroupLabel>{t.editor.menus.file.file.name}</Menu.ItemGroupLabel>
      <Menu.Item disabled={openCommand.disabled} value="open-project" onSelect={handleOpenProjectSelect}>
        <PiFolder />
        <Menu.ItemText>{t.editor.menus.file.file.open}</Menu.ItemText>
        <MenuShortcut command={openCommand} />
      </Menu.Item>
      <Menu.Item disabled={saveCommand.disabled} value="save-project" onSelect={handleSaveProjectSelect}>
        <PiFloppyDisk />
        <Menu.ItemText>{t.editor.menus.file.file.save}</Menu.ItemText>
        <MenuShortcut command={saveCommand} />
      </Menu.Item>
      <Menu.Item disabled={saveAsCommand.disabled} value="save-project-as" onSelect={handleSaveProjectAsSelect}>
        <PiFloppyDisk />
        <Menu.ItemText>{t.editor.menus.file.file.saveAs}</Menu.ItemText>
        <MenuShortcut command={saveAsCommand} />
      </Menu.Item>
    </Menu.ItemGroup>
  )
}

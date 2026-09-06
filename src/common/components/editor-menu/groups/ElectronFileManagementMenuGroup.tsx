import { Menu } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { PiFloppyDisk, PiFolder } from 'react-icons/pi'
import { useCommandsContext } from '../../../contexts/CommandsContext'
import { useTranslation } from '../../../translations/translation'
import { MenuShortcut } from '../MenuShortcut'

export const ElectronFileManagementMenuGroup: FC = () => {
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

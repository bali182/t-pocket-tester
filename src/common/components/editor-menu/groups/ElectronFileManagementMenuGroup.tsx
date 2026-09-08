import { Menu } from '@chakra-ui/react'
import { FC } from 'react'
import { PiFloppyDisk, PiFolder } from 'react-icons/pi'
import { ElectronCommandIdSchema } from '../../../../electron/schemas/electronCommands'
import { useTranslation } from '../../../translations/translation'
import { CommandMenuItem } from '../items/CommandMenuItem'

export const ElectronFileManagementMenuGroup: FC = () => {
  const t = useTranslation()

  return (
    <Menu.ItemGroup>
      <Menu.ItemGroupLabel>{t.editor.menus.file.file.name}</Menu.ItemGroupLabel>
      <CommandMenuItem<ElectronCommandIdSchema> command="open" title={t.editor.menus.file.file.open} icon={PiFolder} />
      <CommandMenuItem<ElectronCommandIdSchema>
        command="save"
        title={t.editor.menus.file.file.save}
        icon={PiFloppyDisk}
      />
      <CommandMenuItem<ElectronCommandIdSchema>
        command="save-as"
        title={t.editor.menus.file.file.saveAs}
        icon={PiFloppyDisk}
      />
    </Menu.ItemGroup>
  )
}

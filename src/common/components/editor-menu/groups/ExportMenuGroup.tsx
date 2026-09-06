import { Menu } from '@chakra-ui/react'
import { FC } from 'react'
import { PiExport } from 'react-icons/pi'
import { useCommandsContext } from '../../../contexts/CommandsContext'
import { CommonCommandIdSchema } from '../../../schemas/command'
import { useTranslation } from '../../../translations/translation'
import { CommandMenuItem } from '../items/CommandMenuItem'

export const ExportMenuGroup: FC = () => {
  const t = useTranslation()
  const { getCommand } = useCommandsContext<CommonCommandIdSchema>()

  return (
    <Menu.ItemGroup>
      <Menu.ItemGroupLabel>{t.editor.menus.file.export.name}</Menu.ItemGroupLabel>
      <CommandMenuItem command={getCommand('export-svg')} title={t.editor.menus.file.export.svg} icon={PiExport} />
      <CommandMenuItem command={getCommand('export-pdf')} title={t.editor.menus.file.export.pdf} icon={PiExport} />
    </Menu.ItemGroup>
  )
}

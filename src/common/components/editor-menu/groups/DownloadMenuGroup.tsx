import { Menu } from '@chakra-ui/react'
import { FC } from 'react'
import { PiDownload } from 'react-icons/pi'
import { WebCommandIdSchema } from '../../../../web/schemas/webCommands'
import { useTranslation } from '../../../translations/translation'
import { CommandMenuItem } from '../items/CommandMenuItem'

export const DownloadMenuGroup: FC = () => {
  const t = useTranslation()

  return (
    <Menu.ItemGroup>
      <Menu.ItemGroupLabel>{t.editor.menus.file.download.name}</Menu.ItemGroupLabel>
      <CommandMenuItem<WebCommandIdSchema>
        command="download-project"
        title={t.editor.menus.file.download.download}
        icon={PiDownload}
      />
    </Menu.ItemGroup>
  )
}

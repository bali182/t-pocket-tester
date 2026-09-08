import { Menu } from '@chakra-ui/react'
import { type FC } from 'react'
import { PiDownload } from 'react-icons/pi'

import { CommandMenuItem } from '../../../../common/components/editor-menu/items/CommandMenuItem'
import { useTranslation } from '../../../../common/translations/translation'
import type { WebCommandIdSchema } from '../../../schemas/webCommands'

export const DownloadMenuGroup: FC = () => {
  const t = useTranslation()

  return (
    <Menu.ItemGroup>
      <Menu.ItemGroupLabel>{t.editor.menus.file.download.name}</Menu.ItemGroupLabel>
      <CommandMenuItem<WebCommandIdSchema>
        command="download-project"
        icon={PiDownload}
        title={t.editor.menus.file.download.download}
      />
    </Menu.ItemGroup>
  )
}

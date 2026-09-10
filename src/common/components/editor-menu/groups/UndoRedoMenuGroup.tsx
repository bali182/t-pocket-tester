import { Menu } from '@chakra-ui/react'
import { FC } from 'react'
import { PiArrowClockwise, PiArrowCounterClockwise } from 'react-icons/pi'

import { CommonCommandIdSchema } from '../../../schemas/command'
import { useTranslation } from '../../../translations/translation'
import { CommandMenuItem } from '../items/CommandMenuItem'

export const UndoRedoMenuGroup: FC = () => {
  const t = useTranslation()

  return (
    <Menu.ItemGroup>
      <Menu.ItemGroupLabel>{t.editor.menus.edit.history.name}</Menu.ItemGroupLabel>
      <CommandMenuItem<CommonCommandIdSchema>
        command="undo"
        title={t.editor.menus.edit.history.undo}
        icon={PiArrowCounterClockwise}
      />
      <CommandMenuItem<CommonCommandIdSchema>
        command="redo"
        title={t.editor.menus.edit.history.redo}
        icon={PiArrowClockwise}
      />
    </Menu.ItemGroup>
  )
}

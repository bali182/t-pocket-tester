import { Menu } from '@chakra-ui/react'
import { FC, useMemo } from 'react'
import { CommandSchema } from '../../schemas/command'
import { formatShortcut } from '../../utils/formatShortcut'
import { isDefined } from '../../utils/isDefined'

type MenuShortcutProps = {
  command: CommandSchema<unknown>
}

export const MenuShortcut: FC<MenuShortcutProps> = ({ command }) => {
  const shortcut = useMemo(() => formatShortcut(command.combination), [command.combination])
  if (!isDefined(shortcut)) {
    return null
  }
  return <Menu.ItemCommand>{shortcut}</Menu.ItemCommand>
}

import { Menu } from '@chakra-ui/react'
import { FC, useMemo } from 'react'
import { CommandSchema } from '../../schemas/command'
import { formatShortcut } from '../../utils/formatShortcut'
import { isDefined } from '../../utils/isDefined'

type MenuShortcutProps = {
  command: CommandSchema<unknown>
  noPadding?: boolean
}

export const MenuShortcut: FC<MenuShortcutProps> = ({ command, noPadding }) => {
  const shortcut = useMemo(() => formatShortcut(command.shortcut), [command.shortcut])
  if (!isDefined(shortcut)) {
    return null
  }
  return <Menu.ItemCommand {...(noPadding ? { paddingInlineStart: 0 } : {})}>{shortcut}</Menu.ItemCommand>
}

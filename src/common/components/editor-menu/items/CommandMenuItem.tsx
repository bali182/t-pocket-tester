import { Menu } from '@chakra-ui/react'
import { useCallback } from 'react'
import { IconType } from 'react-icons'
import { useCommandsContext } from '../../../contexts/CommandsContext'
import { CommandSchema } from '../../../schemas/command'
import { MenuShortcut } from '../MenuShortcut'

type CommandMenuItem<C> = {
  command: CommandSchema<C>
  title: string
  icon: IconType
}

export const CommandMenuItem = <C extends string>({ command, title, icon: Icon }: CommandMenuItem<C>) => {
  const { emitCommand } = useCommandsContext<C>()

  const handleSelect = useCallback(() => emitCommand(command.id), [command.id, emitCommand])

  return (
    <Menu.Item disabled={command.disabled} value={command.id} onSelect={handleSelect}>
      <Icon />
      <Menu.ItemText>{title}</Menu.ItemText>
      <MenuShortcut command={command} />
    </Menu.Item>
  )
}

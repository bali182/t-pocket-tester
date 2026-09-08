import { Menu } from '@chakra-ui/react'
import { useCallback, useMemo } from 'react'
import { IconType } from 'react-icons'
import { useCommandsContext } from '../../../contexts/CommandsContext'
import { MenuShortcut } from '../MenuShortcut'

type CommandMenuItem<C> = {
  command: C
  title: string
  icon: IconType
}

export const CommandMenuItem = <C extends string>({ command: commandId, title, icon: Icon }: CommandMenuItem<C>) => {
  const { emitCommand, getCommand } = useCommandsContext<C>()
  const command = useMemo(() => getCommand(commandId), [commandId, getCommand])

  const handleSelect = useCallback(() => emitCommand(command.id), [command.id, emitCommand])

  return (
    <Menu.Item disabled={command.disabled} value={command.id} onSelect={handleSelect}>
      <Icon />
      <Menu.ItemText>{title}</Menu.ItemText>
      <MenuShortcut command={command} />
    </Menu.Item>
  )
}

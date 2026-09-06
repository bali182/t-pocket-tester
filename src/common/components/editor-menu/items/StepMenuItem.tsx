import { Icon, Menu, Text } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { IconType } from 'react-icons'
import { useCommandsContext } from '../../../contexts/CommandsContext'
import { CommandSchema, CommonCommandIdSchema } from '../../../schemas/command'
import { NumberEditorStepSchema } from '../../../schemas/settings'
import { MenuShortcut } from '../MenuShortcut'

export type StepMenuItemProps = {
  title: string
  subTitle: string
  value: NumberEditorStepSchema
  selectedValue: NumberEditorStepSchema
  icon: IconType
  iconScale?: number
  command: CommandSchema<CommonCommandIdSchema>
}

export const StepMenuItem: FC<StepMenuItemProps> = ({
  title,
  value,
  subTitle,
  selectedValue,
  iconScale = 1,
  command,
  icon,
}) => {
  const { emitCommand } = useCommandsContext()
  const handleSelect = useCallback(() => emitCommand(command.id), [command.id, emitCommand])
  const isSelected = selectedValue === value
  return (
    <Menu.Item
      value={command.id}
      background={isSelected ? 'bg.emphasized' : undefined}
      onSelect={handleSelect}
      closeOnSelect={false}
    >
      <Icon as={icon} transform={`scale(${iconScale})`} transformOrigin="center" />
      <Menu.ItemText fontWeight={isSelected ? 'semibold' : undefined} mr="2">
        {title}
      </Menu.ItemText>
      <Text color="fg.muted" fontSize="xs" fontWeight={isSelected ? 'bold' : undefined}>
        {subTitle}
      </Text>
      <MenuShortcut command={command} noPadding />
    </Menu.Item>
  )
}

import { Icon, Menu, Text } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { IconType } from 'react-icons'
import { NumberEditorStepSchema } from '../../schemas/settings'

export type StepMenuItemProps = {
  title: string
  subTitle: string
  value: NumberEditorStepSchema
  selectedValue: NumberEditorStepSchema
  icon: IconType
  iconScale?: number
  onSelect: (value: NumberEditorStepSchema) => void
}

export const StepMenuItem: FC<StepMenuItemProps> = ({
  title,
  value,
  subTitle,
  selectedValue,
  iconScale = 1,
  icon,
  onSelect,
}) => {
  const handleSelect = useCallback(() => onSelect(value), [onSelect, value])
  const isSelected = selectedValue === value
  return (
    <Menu.Item
      background={isSelected ? 'bg.emphasized' : undefined}
      onSelect={handleSelect}
      value={value.toString()}
      closeOnSelect={false}
    >
      <Icon as={icon} transform={`scale(${iconScale})`} transformOrigin="center" />
      <Menu.ItemText fontWeight={isSelected ? 'semibold' : undefined} mr="2">
        {title}
      </Menu.ItemText>
      <Text color="fg.muted" fontSize="xs" fontWeight={isSelected ? 'bold' : undefined}>
        {subTitle}
      </Text>
    </Menu.Item>
  )
}

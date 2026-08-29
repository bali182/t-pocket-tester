import { Menu, Text } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { NumberEditorStepSchema } from '../../schemas/settings'

export type StepMenuItemProps = {
  title: string
  subTitle: string
  value: NumberEditorStepSchema
  selectedValue: NumberEditorStepSchema
  onSelect: (value: NumberEditorStepSchema) => void
}

export const StepMenuItem: FC<StepMenuItemProps> = ({ title, value, subTitle, selectedValue, onSelect }) => {
  const handleSelect = useCallback(() => onSelect(value), [onSelect, value])
  const isSelected = selectedValue === value
  return (
    <Menu.Item value={value.toString()} onSelect={handleSelect} background={isSelected ? 'bg.emphasized' : undefined}>
      <Menu.ItemText fontWeight={isSelected ? 'semibold' : undefined} mr="2">
        {title}
      </Menu.ItemText>
      <Text color="fg.muted" fontSize="xs" fontWeight={isSelected ? 'bold' : undefined}>
        {subTitle}
      </Text>
    </Menu.Item>
  )
}

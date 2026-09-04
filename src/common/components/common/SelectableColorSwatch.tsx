import { Box, Button, ColorSwatch, Grid, Menu, Text } from '@chakra-ui/react'
import { ComponentType, FC, useCallback } from 'react'
import { PiCheck } from 'react-icons/pi'
import type { ColorValue } from '../../hooks/useColors'

type SwatchItemProps = {
  color: ColorValue
  isSelected: boolean
  onSelect: (color: ColorValue) => void
}

type SelectableColorSwatchProps = {
  value: string | undefined
  colors: ColorValue[]
  onChange: (color: string | undefined) => void
  canReset: boolean
  Item: ComponentType<SwatchItemProps>
}

export const SelectableColorSwatch = ({ value: v, canReset, colors, Item, onChange }: SelectableColorSwatchProps) => {
  const value = v?.toLowerCase()

  const onSelect = useCallback(
    (color: ColorValue) => {
      if (color.color === value && canReset) {
        onChange(undefined)
      } else {
        onChange(color.color)
      }
    },
    [canReset, onChange, value],
  )

  return (
    <Grid gap="2" gridTemplateColumns="repeat(5, minmax(0, 1fr))">
      {colors.map((color) => {
        return <Item key={color.key} color={color} isSelected={value === color.color} onSelect={onSelect} />
      })}
    </Grid>
  )
}

export const ButtonSwatchItem: FC<SwatchItemProps> = ({ color, isSelected, onSelect }) => {
  const onClick = useCallback(() => {
    onSelect(color)
  }, [color, onSelect])

  return (
    <Button
      flexDirection="column"
      height="auto"
      key={color.key}
      onClick={onClick}
      p="1"
      variant="ghost"
      _icon={{ boxSize: '3' }}
    >
      <ColorSwatch size="xl" value={color.color}>
        {isSelected && (
          <Box
            alignItems="center"
            background="bg.inverted"
            borderRadius="full"
            boxSize="5"
            color="fg.inverted"
            display="flex"
            justifyContent="center"
          >
            <PiCheck size={8} />
          </Box>
        )}
      </ColorSwatch>
      <Text textStyle="2xs">{color.name}</Text>
    </Button>
  )
}

export const MenuColorSwatchItem: FC<SwatchItemProps> = ({ color, isSelected, onSelect }) => {
  const handleSelect = useCallback(() => onSelect(color), [color, onSelect])

  return (
    <Menu.Item
      closeOnSelect={false}
      flexDirection="column"
      height="auto"
      onSelect={handleSelect}
      p="1"
      value={color.key}
    >
      <ColorSwatch size="xl" value={color.color}>
        {isSelected && (
          <Box
            alignItems="center"
            background="bg.inverted"
            borderRadius="full"
            boxSize="5"
            color="fg.inverted"
            display="flex"
            justifyContent="center"
          >
            <PiCheck size={8} />
          </Box>
        )}
      </ColorSwatch>
      <Text textStyle="2xs">{color.name}</Text>
    </Menu.Item>
  )
}

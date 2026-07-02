import {
  createListCollection,
  HStack,
  NumberInput,
  Portal,
  Select,
  type NumberInputValueChangeDetails,
  type SelectValueChangeDetails,
} from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

type FillableSizeInputProps = {
  value: number | 'fill'
  onChange: (value: number | 'fill') => void
}

type FillableSizeMode = 'fill' | 'fixed'

const fillableSizeModeCollection = createListCollection({
  items: [
    { label: 'Kitöltés', value: 'fill' },
    { label: 'Fix', value: 'fixed' },
  ],
})

const fixedSizeFallback = 10
const panelSizeStep = 0.1
const minPanelSize = 0

const isValidPanelSize = (value: number): boolean => {
  return Number.isFinite(value) && value >= minPanelSize
}

export const FillableSizeInput: FC<FillableSizeInputProps> = ({ value, onChange }) => {
  const mode: FillableSizeMode = value === 'fill' ? 'fill' : 'fixed'

  const handleModeChange = useCallback(
    (details: SelectValueChangeDetails) => {
      const nextMode = details.value[0] as FillableSizeMode

      if (nextMode === 'fill') {
        onChange('fill')
        return
      }

      onChange(value === 'fill' ? fixedSizeFallback : value)
    },
    [onChange, value],
  )

  const handleSizeChange = useCallback(
    (details: NumberInputValueChangeDetails) => {
      if (!isValidPanelSize(details.valueAsNumber)) {
        return
      }

      onChange(details.valueAsNumber)
    },
    [onChange],
  )

  if (mode === 'fill') {
    return (
      <Select.Root collection={fillableSizeModeCollection} onValueChange={handleModeChange} value={[mode]} width="full">
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content zIndex="tooltip">
              {fillableSizeModeCollection.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    )
  }

  return (
    <HStack gap={2}>
      <Select.Root
        collection={fillableSizeModeCollection}
        flexShrink={0}
        onValueChange={handleModeChange}
        value={[mode]}
        width={20}
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content zIndex="tooltip">
              {fillableSizeModeCollection.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>

      <NumberInput.Root
        allowOverflow={false}
        clampValueOnBlur
        min={minPanelSize}
        onValueChange={handleSizeChange}
        step={panelSizeStep}
        value={String(value)}
        width="full"
      >
        <NumberInput.Input />
      </NumberInput.Root>
    </HStack>
  )
}

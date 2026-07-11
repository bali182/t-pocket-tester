import { Box, Grid, Select, createListCollection } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

import type { IssueSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'
import { NumberInput } from './NumberInput'

type FillableSizeInputProps = {
  value: string
  issue: IssueSchema | undefined
  onChange: (value: string) => void
}

type FillableSizeMode = 'fill' | 'fixed'

const fixedSizeFallback = 10

const fillableSizeModeItems: { label: string; value: FillableSizeMode }[] = [
  { label: 'Kitöltés', value: 'fill' },
  { label: 'Fix', value: 'fixed' },
]

const fillableSizeModeCollection = createListCollection({
  items: fillableSizeModeItems,
})

export const FillableSizeInput: FC<FillableSizeInputProps> = ({ issue, value, onChange }) => {
  const mode: FillableSizeMode = value === 'fill' ? 'fill' : 'fixed'

  const handleModeChange = useCallback(
    (details: Select.ValueChangeDetails) => {
      const nextMode = details.value[0]

      if (!isDefined(nextMode)) {
        return
      }

      if (nextMode === 'fill') {
        onChange('fill')
        return
      }

      if (nextMode === 'fixed') {
        onChange(value === 'fill' ? String(fixedSizeFallback) : value)
      }
    },
    [onChange, value],
  )

  if (mode === 'fill') {
    return <FillableSizeModeSelect mode={mode} onValueChange={handleModeChange} />
  }

  return (
    <Grid columnGap="2" gridTemplateColumns="minmax(0, 1fr) minmax(0, 1fr)">
      <FillableSizeModeSelect mode={mode} onValueChange={handleModeChange} />

      <Box minWidth="0">
        <NumberInput issue={issue} onChange={onChange} step={1} unit="mm" value={value} />
      </Box>
    </Grid>
  )
}

type FillableSizeModeSelectProps = {
  mode: FillableSizeMode
  onValueChange: (details: Select.ValueChangeDetails) => void
}

const FillableSizeModeSelect: FC<FillableSizeModeSelectProps> = ({ mode, onValueChange }) => {
  return (
    <Select.Root collection={fillableSizeModeCollection} onValueChange={onValueChange} size="xs" value={[mode]} width="100%">
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {fillableSizeModeCollection.items.map((item) => (
            <Select.Item item={item} key={item.value}>
              <Select.ItemText>{item.label}</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}

import {
  IconButton,
  InputGroup,
  Select,
  createListCollection,
  type ListCollection,
  type SelectValueChangeDetails,
} from '@chakra-ui/react'
import { useCallback, useMemo, type FC } from 'react'
import { PiArrowCounterClockwise } from 'react-icons/pi'

import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'

type VisibilityValue = 'hidden' | 'visible'

type VisibilityOption = {
  label: string
  value: VisibilityValue
}

type StitchVisibilitySelectProps = {
  isResetEnabled: boolean
  onChange: (value: boolean) => void
  onReset?: () => void
  value: boolean
}

export const StitchVisibilitySelect: FC<StitchVisibilitySelectProps> = ({
  isResetEnabled,
  onChange,
  onReset,
  value,
}) => {
  const t = useTranslation()

  const visibilityValue: VisibilityValue = value ? 'visible' : 'hidden'

  const visibilityOptions = useMemo<VisibilityOption[]>(
    () => [
      { label: t.stitchLine.editor.stitching.visible, value: 'visible' },
      { label: t.stitchLine.editor.stitching.hidden, value: 'hidden' },
    ],
    [t.stitchLine.editor.stitching.hidden, t.stitchLine.editor.stitching.visible],
  )

  const visibilityCollection = useMemo<ListCollection<VisibilityOption>>(
    () =>
      createListCollection<VisibilityOption>({
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
        items: visibilityOptions,
      }),
    [visibilityOptions],
  )

  const handleValueChange = useCallback(
    (details: SelectValueChangeDetails<VisibilityOption>): void => {
      const nextValue = details.value[0] as VisibilityValue

      if (!isDefined(nextValue)) {
        return
      }

      onChange(nextValue === 'visible')
    },
    [onChange],
  )
  const resetButtonEl = isDefined(onReset) ? (
    <IconButton
      alignSelf="stretch"
      borderRadius="0"
      disabled={!isResetEnabled}
      height="auto"
      onClick={onReset}
      size="xs"
      variant="plain"
    >
      <PiArrowCounterClockwise />
    </IconButton>
  ) : undefined

  return (
    <Select.Root
      collection={visibilityCollection}
      onValueChange={handleValueChange}
      size="xs"
      value={[visibilityValue]}
      width="full"
    >
      <Select.HiddenSelect />
      <InputGroup endAddon={resetButtonEl} endAddonProps={{ px: 0, size: 'xs' }} width="full">
        <Select.Control width="full">
          <Select.Trigger borderRightRadius={isDefined(resetButtonEl) ? '0' : undefined}>
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
      </InputGroup>
      <Select.Positioner>
        <Select.Content>
          {visibilityCollection.items.map((item) => (
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

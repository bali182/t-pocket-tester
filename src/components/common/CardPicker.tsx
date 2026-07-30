import { IconButton, InputGroup, Select, createListCollection, type SelectValueChangeDetails } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'
import { PiArrowCounterClockwise } from 'react-icons/pi'

import { cards } from '../../data/cards'
import type { IssueSchema } from '../../schemas/validation'
import type { CardSchema, CardSchemaId } from '../../schemas/valuables'
import { useTranslation } from '../../translations/translation'
import { isDefined } from '../../utils/isDefined'

const cardCollection = createListCollection<CardSchema>({
  itemToString: (item) => item.id,
  itemToValue: (item) => item.id,
  items: cards,
})

type CardPickerProps = {
  value: CardSchemaId | undefined
  issue: IssueSchema | undefined
  onChange: (cardId: CardSchemaId) => void
  onReset?: () => void
  isResetEnabled: boolean
}

export const CardPicker: FC<CardPickerProps> = ({ isResetEnabled, issue, onChange, onReset, value }) => {
  const t = useTranslation()
  const isInvalid = isDefined(issue) && issue.severity === 'error'
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
  const handleValueChange = useCallback(
    (details: SelectValueChangeDetails<CardSchema>): void => {
      const cardId = details.value[0]

      if (!isDefined(cardId)) {
        return
      }

      const card = cards.find((candidateCard) => candidateCard.id === cardId)

      if (!isDefined(card)) {
        return
      }

      onChange(card.id)
    },
    [onChange],
  )

  return (
    <Select.Root
      aria-invalid={isInvalid}
      collection={cardCollection}
      onValueChange={handleValueChange}
      size="xs"
      value={isDefined(value) ? [value] : []}
      width="full"
    >
      <InputGroup endAddon={resetButtonEl} endAddonProps={{ px: 0, size: 'xs' }} width="full">
        <Select.Control width="full">
          <Select.HiddenSelect />
          <Select.Trigger borderRightRadius="0">
            <Select.ValueText placeholder={t.component.editor.pocketCluster.noCard} />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
      </InputGroup>
      <Select.Positioner>
        <Select.Content>
          {cardCollection.items.map((card) => (
            <Select.Item item={card} key={card.id}>
              <Select.ItemText>{card.id}</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}

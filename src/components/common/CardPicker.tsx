import {
  HStack,
  IconButton,
  InputGroup,
  Select,
  createListCollection,
  type SelectValueChangeDetails,
} from '@chakra-ui/react'
import { useCallback, type FC } from 'react'
import { PiArrowCounterClockwise, PiCreditCard } from 'react-icons/pi'

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

const landscapeCards: CardSchemaId[] = ['ID-1-landscape', 'ID-2-landscape', 'ID-3-landscape']
const portraitCards: CardSchemaId[] = ['ID-1-portrait', 'ID-2-portrait', 'ID-3-portrait']

export const CardPicker: FC<CardPickerProps> = ({ isResetEnabled, issue, onChange, onReset, value }) => {
  const t = useTranslation()
  const isInvalid = isDefined(issue) && issue.severity === 'error'

  const handleValueChange = useCallback(
    (details: SelectValueChangeDetails<CardSchema>): void => {
      onChange(details.items[0].id)
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
      <InputGroup
        endAddon={
          isDefined(onReset) ? (
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
        }
        endAddonProps={{ px: 0, size: 'xs' }}
        width="full"
      >
        <Select.Control width="full">
          <Select.HiddenSelect />
          <Select.Trigger borderRightRadius="0">
            {isDefined(value) ? (
              <Select.ValueText asChild>
                <HStack>
                  <PiCreditCard style={portraitCards.includes(value) ? { transform: `rotate(90deg)` } : undefined} />
                  <span>{t.cards[value]}</span>
                </HStack>
              </Select.ValueText>
            ) : (
              <Select.ValueText placeholder={t.component.editor.pocketCluster.noCard} />
            )}
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
      </InputGroup>
      <Select.Positioner>
        <Select.Content>
          <Select.ItemGroup key="landscape">
            <Select.ItemGroupLabel>{t.component.editor.pocketCluster.landscape}</Select.ItemGroupLabel>
            <CardItems cardIds={landscapeCards} />
          </Select.ItemGroup>
          <Select.ItemGroup key="portrait">
            <Select.ItemGroupLabel>{t.component.editor.pocketCluster.portrait}</Select.ItemGroupLabel>
            <CardItems cardIds={portraitCards} transform="rotate(90deg)" />
          </Select.ItemGroup>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}

type CardItemsProps = {
  cardIds: CardSchemaId[]
  transform?: string
}

const CardItems: FC<CardItemsProps> = ({ cardIds, transform }) => {
  const t = useTranslation()

  return (
    <>
      {cardIds.map((cardId) => {
        const card = cards.find((c) => c.id === cardId)!
        return (
          <Select.Item item={card} key={cardId}>
            <HStack>
              <PiCreditCard style={{ transform }} />
              <Select.ItemText>
                {t.cardsSimple[cardId]} ({t.common.dimensions(card.width.toString(), card.height.toString())})
              </Select.ItemText>
            </HStack>
            <Select.ItemIndicator />
          </Select.Item>
        )
      })}
    </>
  )
}

import { Field, NativeSelect, NumberInput, Stack } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import type { ChangeEvent, FC } from 'react'
import { useCallback, useMemo } from 'react'

import { ISO_CARD_SIZE_BY_ORIENTATION } from '../constants'
import { cardHolderInputAtom } from '../state'
import type { CardOrientation } from '../types'

export const CardInputSection: FC = () => {
  const [input, setInput] = useAtom(cardHolderInputAtom)

  const orientation = useMemo<CardOrientation | undefined>(() => {
    const orientations = Object.keys(ISO_CARD_SIZE_BY_ORIENTATION) as CardOrientation[]
    return orientations.find((key) => {
      const standardSize = ISO_CARD_SIZE_BY_ORIENTATION[key]
      return input.cardSize.width === standardSize.width && input.cardSize.height === standardSize.height
    })
  }, [input.cardSize])

  const handleOrientationChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextOrientation = event.target.value as CardOrientation
      if (!ISO_CARD_SIZE_BY_ORIENTATION[nextOrientation]) {
        return
      }
      setInput((current) => ({
        ...current,
        cardSize: ISO_CARD_SIZE_BY_ORIENTATION[nextOrientation],
      }))
    },
    [setInput],
  )

  const setCardWidth = useCallback(
    (width: number) => {
      setInput((current) => ({
        ...current,
        cardSize: {
          ...current.cardSize,
          width,
        },
      }))
    },
    [setInput],
  )

  const setCardHeight = useCallback(
    (height: number) => {
      setInput((current) => ({
        ...current,
        cardSize: {
          ...current.cardSize,
          height,
        },
      }))
    },
    [setInput],
  )

  const handleCardWidthChange = useCallback(
    (details: NumberInput.ValueChangeDetails) => {
      if (Number.isFinite(details.valueAsNumber)) {
        setCardWidth(details.valueAsNumber)
      }
    },
    [setCardWidth],
  )

  const handleCardHeightChange = useCallback(
    (details: NumberInput.ValueChangeDetails) => {
      if (Number.isFinite(details.valueAsNumber)) {
        setCardHeight(details.valueAsNumber)
      }
    },
    [setCardHeight],
  )

  return (
    <Stack gap="4">
      <Field.Root>
        <Field.Label>Kártya tájolása</Field.Label>
        <NativeSelect.Root>
          <NativeSelect.Field value={orientation ?? 'custom'} onChange={handleOrientationChange}>
            <option value="landscape">Fekvő</option>
            <option value="portrait">Álló</option>
            {orientation === undefined && <option value="custom">Egyedi</option>}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Field.Root>

      <Field.Root>
        <Field.Label>Kártya szélessége</Field.Label>
        <NumberInput.Root value={String(input.cardSize.width)} onValueChange={handleCardWidthChange}>
          <NumberInput.Input />
          <NumberInput.Control>
            <NumberInput.IncrementTrigger />
            <NumberInput.DecrementTrigger />
          </NumberInput.Control>
        </NumberInput.Root>
      </Field.Root>

      <Field.Root>
        <Field.Label>Kártya magassága</Field.Label>
        <NumberInput.Root value={String(input.cardSize.height)} onValueChange={handleCardHeightChange}>
          <NumberInput.Input />
          <NumberInput.Control>
            <NumberInput.IncrementTrigger />
            <NumberInput.DecrementTrigger />
          </NumberInput.Control>
        </NumberInput.Root>
      </Field.Root>
    </Stack>
  )
}

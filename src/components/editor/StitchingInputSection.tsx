import { Field, NumberInput, Stack } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { CardHolderInputSchema } from '../../schemas/CardHolderInputSchema'
import type { CardHolderInputFieldSchema } from '../../schemas/CardHolderInputFieldSchema'
import { cardHolderInputAtom } from '../../state'

export const StitchingInputSection: FC = () => {
  const [input, setInput] = useAtom(cardHolderInputAtom)

  const fields = useMemo<CardHolderInputFieldSchema[]>(
    () => [
      { key: 'stitchMargin', label: 'Varrás távolsága a széltől' },
      { key: 'cardSideClearanceFromStitch', label: 'Oldalsó kártyaráhagyás' },
      { key: 'cardBottomClearanceFromStitch', label: 'Alsó kártyaráhagyás' },
    ],
    [],
  )

  const updateField = (key: keyof CardHolderInputSchema, value: number) => {
    setInput((current): CardHolderInputSchema => ({ ...current, [key]: value }))
  }

  return (
    <Stack gap="4">
      {fields.map((field) => (
        <Field.Root key={field.key}>
          <Field.Label>{field.label}</Field.Label>
          <NumberInput.Root
            value={String(input[field.key])}
            onValueChange={(details) => {
              if (Number.isFinite(details.valueAsNumber)) {
                updateField(field.key, details.valueAsNumber)
              }
            }}
          >
            <NumberInput.Input />
            <NumberInput.Control>
              <NumberInput.IncrementTrigger />
              <NumberInput.DecrementTrigger />
            </NumberInput.Control>
          </NumberInput.Root>
        </Field.Root>
      ))}
    </Stack>
  )
}

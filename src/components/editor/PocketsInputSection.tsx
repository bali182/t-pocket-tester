import { Field, NumberInput, Stack } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { CardHolderInputSchema } from '../../schemas/CardHolderInputSchema'
import type { CardHolderInputFieldSchema } from '../../schemas/CardHolderInputFieldSchema'
import { cardHolderInputAtom } from '../../state'

export const PocketsInputSection: FC = () => {
  const [input, setInput] = useAtom(cardHolderInputAtom)

  const fields = useMemo<CardHolderInputFieldSchema[]>(
    () => [
      { key: 'pocketCount', label: 'Zsebek száma', min: 1 },
      { key: 'pocketHeight', label: 'Zseb magassága' },
      { key: 'pocketSpacing', label: 'Zsebek távolsága' },
      { key: 'tPocketTabWidth', label: 'T-fül szélessége' },
      { key: 'tPocketTaper', label: 'T-zseb szűkülése oldalanként' },
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
            min={field.min}
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

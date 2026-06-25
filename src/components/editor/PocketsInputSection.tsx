import { Field, NumberInput, Stack } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import type { FC } from 'react'
import { useMemo } from 'react'
import { cardHolderInputAtom } from '../../state'
import type { CardHolderInput, CardHolderInputField } from '../../types'

export const PocketsInputSection: FC = () => {
  const [input, setInput] = useAtom(cardHolderInputAtom)

  const fields = useMemo<CardHolderInputField[]>(
    () => [
      { key: 'pocketCount', label: 'Zsebek száma', min: 1 },
      { key: 'visibleCardHeight', label: 'Látható kártyamagasság' },
      { key: 'pocketSpacing', label: 'Zsebek távolsága' },
      { key: 'tPocketTabWidth', label: 'T-fül szélessége' },
      { key: 'tPocketTaper', label: 'T-zseb szűkülése oldalanként' },
    ],
    [],
  )

  const updateField = (key: keyof CardHolderInput, value: number) => {
    setInput((current): CardHolderInput => ({ ...current, [key]: value }))
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

import { Box, HStack, IconButton, Input, InputGroup, VStack } from '@chakra-ui/react'
import { NumberFormatter } from '@internationalized/number'
import { useCallback, type FC, type ReactNode } from 'react'
import { PiCaretDown, PiCaretUp } from 'react-icons/pi'

import { LANGUAGE } from '../../constants/language'
import type { IssueSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'

type NumberInputProps = {
  value: string
  lastValidValue: number | undefined
  issue: IssueSchema | undefined
  onChange: (value: string) => void
  unit?: string
  step?: number
}

export const NumberInput: FC<NumberInputProps> = ({ issue, lastValidValue, onChange, step, unit, value }) => {
  const isInvalid = isDefined(issue) && issue.severity === 'error'
  const hasAddon = isDefined(step) || isDefined(unit)
  const isStepperDisabled = !isDefined(lastValidValue) || isInvalid

  const handleIncrement = useCallback(() => {
    if (!isDefined(lastValidValue) || !isDefined(step) || isInvalid) {
      return
    }

    onChange(numberFormatter.format(lastValidValue + step))
  }, [isInvalid, lastValidValue, onChange, step])

  const handleDecrement = useCallback(() => {
    if (!isDefined(lastValidValue) || !isDefined(step) || isInvalid) {
      return
    }

    onChange(numberFormatter.format(lastValidValue - step))
  }, [isInvalid, lastValidValue, onChange, step])

  const input = (
    <Input
      aria-invalid={isInvalid}
      inputMode="decimal"
      onChange={(event) => onChange(event.currentTarget.value)}
      type="text"
      value={value}
    />
  )

  if (!hasAddon) {
    return input
  }

  return (
    <InputGroup
      endAddon={
        <NumberInputAddon
          isStepperDisabled={isStepperDisabled}
          onDecrement={handleDecrement}
          onIncrement={handleIncrement}
          step={step}
          unit={unit}
        />
      }
      endAddonProps={{ p: 0 }}
    >
      {input}
    </InputGroup>
  )
}

type NumberInputAddonProps = {
  step: number | undefined
  unit: string | undefined
  isStepperDisabled: boolean
  onIncrement: () => void
  onDecrement: () => void
}

const NumberInputAddon: FC<NumberInputAddonProps> = ({
  isStepperDisabled,
  onDecrement,
  onIncrement,
  step,
  unit,
}): ReactNode => {
  return (
    <HStack alignSelf="stretch" gap="0">
      {isDefined(step) && (
        <VStack align="stretch" borderEndWidth={isDefined(unit) ? '1px' : undefined} gap="0">
          <IconButton
            aria-label="Növelés"
            disabled={isStepperDisabled}
            onClick={onIncrement}
            size="2xs"
            variant="ghost"
          >
            <PiCaretUp />
          </IconButton>
          <IconButton
            aria-label="Csökkentés"
            borderTopWidth="1px"
            disabled={isStepperDisabled}
            onClick={onDecrement}
            size="2xs"
            variant="ghost"
          >
            <PiCaretDown />
          </IconButton>
        </VStack>
      )}
      {isDefined(unit) && <Box px="2">{unit}</Box>}
    </HStack>
  )
}

const numberFormatter = new NumberFormatter(LANGUAGE, {
  maximumSignificantDigits: 21,
  style: 'decimal',
  useGrouping: false,
})

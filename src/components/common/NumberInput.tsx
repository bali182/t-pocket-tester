import { Box, HStack, IconButton, Input, InputGroup, Separator, type InputProps } from '@chakra-ui/react'
import { type FC, type ReactNode } from 'react'
import { PiArrowCounterClockwise } from 'react-icons/pi'

import type { IssueSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'

type NumberInputProps = {
  value: string
  issue: IssueSchema | undefined
  onChange: (value: string) => void
  onReset?: () => void
  isResetEnabled?: boolean
  disabled?: boolean
  startAddon?: ReactNode
  unit?: string
  step?: number
  size?: InputProps['size']
}

// TODO do we need this as a component?
export const NumberInput: FC<NumberInputProps> = ({
  disabled,
  issue,
  onChange,
  onReset,
  size = 'xs',
  startAddon,
  step,
  unit,
  value,
  isResetEnabled,
}) => {
  const isInvalid = isDefined(issue) && issue.severity === 'error'

  const input = (
    <Input
      aria-invalid={isInvalid}
      disabled={disabled}
      inputMode="decimal"
      onChange={(event) => onChange(event.currentTarget.value)}
      step={step}
      type="number"
      value={value}
      size={size}
    />
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

  const unitEl = isDefined(unit) ? <Box px="1.5">{unit}</Box> : undefined

  const resolvedEndAddon =
    isDefined(resetButtonEl) || isDefined(unitEl) ? (
      <HStack alignSelf="stretch" gap="0" height="100%">
        {isDefined(resetButtonEl) && isDefined(unitEl) ? (
          <>
            {resetButtonEl}
            <Separator alignSelf="stretch" orientation="vertical" size="sm" />
            {unitEl}
          </>
        ) : (
          (resetButtonEl ?? unitEl)
        )}
      </HStack>
    ) : undefined

  if (!isDefined(startAddon) && !isDefined(resolvedEndAddon)) {
    return input
  }

  return (
    <InputGroup
      endAddon={resolvedEndAddon}
      endAddonProps={{ size, px: 0 }}
      startAddon={startAddon}
      startAddonProps={{ size, px: '1.5' }}
    >
      {input}
    </InputGroup>
  )
}

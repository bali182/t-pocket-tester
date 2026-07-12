import { Input, InputGroup } from '@chakra-ui/react'
import { type FC, type ReactNode } from 'react'

import type { IssueSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'

type NumberInputProps = {
  value: string
  issue: IssueSchema | undefined
  onChange: (value: string) => void
  disabled?: boolean
  startAddon?: ReactNode
  unit?: string
  step?: number
}

// TODO do we need this as a component?
export const NumberInput: FC<NumberInputProps> = ({ disabled, issue, onChange, startAddon, step, unit, value }) => {
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
      size="xs"
    />
  )

  if (!isDefined(startAddon) && !isDefined(unit)) {
    return input
  }

  return (
    <InputGroup endAddon={unit} startAddon={startAddon}>
      {input}
    </InputGroup>
  )
}

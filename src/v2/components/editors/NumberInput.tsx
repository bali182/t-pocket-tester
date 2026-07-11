import { Input, InputGroup } from '@chakra-ui/react'
import { type FC } from 'react'

import type { IssueSchema } from '../../schemas/validation'
import { isDefined } from '../../utils/isDefined'

type NumberInputProps = {
  value: string
  issue: IssueSchema | undefined
  onChange: (value: string) => void
  unit?: string
  step?: number
}

// TODO do we need this as a component?
export const NumberInput: FC<NumberInputProps> = ({ issue, onChange, step, unit, value }) => {
  const isInvalid = isDefined(issue) && issue.severity === 'error'

  const input = (
    <Input
      aria-invalid={isInvalid}
      inputMode="decimal"
      onChange={(event) => onChange(event.currentTarget.value)}
      step={step}
      type="number"
      value={value}
    />
  )

  if (!isDefined(unit)) {
    return input
  }

  return <InputGroup endAddon={unit}>{input}</InputGroup>
}

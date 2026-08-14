import { HStack } from '@chakra-ui/react'
import { useCallback, type FC } from 'react'

import type { EditableSchema } from '../../schemas/editable'
import type { MagicFixNumericRangeSchema } from '../../schemas/magicFixConfig'
import type { ValidationIssuesSchema } from '../../schemas/validation'
import { NumberInput } from '../common/NumberInput'

export type MagicFixNumericRangeEditorProps = {
  value: EditableSchema<MagicFixNumericRangeSchema>
  issues: ValidationIssuesSchema<MagicFixNumericRangeSchema>
  onChange: (value: EditableSchema<MagicFixNumericRangeSchema>) => void
}

export const MagicFixNumericRangeEditor: FC<MagicFixNumericRangeEditorProps> = ({ issues, onChange, value }) => {
  const handleMaxDecreaseChange = useCallback(
    (maxDecrease: string): void => onChange({ ...value, maxDecrease }),
    [onChange, value],
  )
  const handleMaxIncreaseChange = useCallback(
    (maxIncrease: string): void => onChange({ ...value, maxIncrease }),
    [onChange, value],
  )

  return (
    <HStack gap="2">
      <NumberInput
        issue={issues.maxDecrease}
        onChange={handleMaxDecreaseChange}
        startAddon="−"
        unit="mm"
        value={value.maxDecrease}
      />
      <NumberInput
        issue={issues.maxIncrease}
        onChange={handleMaxIncreaseChange}
        startAddon="+"
        unit="mm"
        value={value.maxIncrease}
      />
    </HStack>
  )
}

import type { DropdownProps } from '@fluentui/react-components'
import { Dropdown, makeStyles, Option, tokens } from '@fluentui/react-components'
import { useCallback, type FC } from 'react'

import type { IssueSchema } from '../../schemas/validation'
import { NumberInput } from './NumberInput'

type FillableSizeInputProps = {
  value: string
  lastValidValue: number | undefined
  issue: IssueSchema | undefined
  onChange: (value: string) => void
}

type FillableSizeMode = 'fill' | 'fixed'

const fixedSizeFallback = 10

const useStyles = makeStyles({
  fixedMode: {
    columnGap: tokens.spacingHorizontalS,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  },
  dropdown: {
    minWidth: 0,
    width: '100%',
  },
  numberInput: {
    minWidth: 0,
    width: '100%',
  },
})

export const FillableSizeInput: FC<FillableSizeInputProps> = ({ issue, lastValidValue, value, onChange }) => {
  const styles = useStyles()
  const mode: FillableSizeMode = value === 'fill' ? 'fill' : 'fixed'

  const handleModeChange = useCallback(
    (_event: unknown, data: Parameters<NonNullable<DropdownProps['onOptionSelect']>>[1]) => {
      const nextMode = data.optionValue as FillableSizeMode | undefined

      if (!nextMode) {
        return
      }

      if (nextMode === 'fill') {
        onChange('fill')
        return
      }

      onChange(value === 'fill' ? String(fixedSizeFallback) : value)
    },
    [onChange, value],
  )

  if (mode === 'fill') {
    return (
      <Dropdown
        className={styles.dropdown}
        onOptionSelect={handleModeChange}
        selectedOptions={[mode]}
        size="small"
        value="Kitöltés"
      >
        <Option value="fill">Kitöltés</Option>
        <Option value="fixed">Fix</Option>
      </Dropdown>
    )
  }

  return (
    <div className={styles.fixedMode}>
      <Dropdown
        className={styles.dropdown}
        onOptionSelect={handleModeChange}
        selectedOptions={[mode]}
        size="small"
        value="Fix"
      >
        <Option value="fill">Kitöltés</Option>
        <Option value="fixed">Fix</Option>
      </Dropdown>

      <div className={styles.numberInput}>
        <NumberInput
          issue={issue}
          lastValidValue={lastValidValue}
          onChange={onChange}
          step={1}
          unit="mm"
          value={value}
        />
      </div>
    </div>
  )
}

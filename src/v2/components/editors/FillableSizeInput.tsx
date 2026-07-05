import type { DropdownProps, SpinButtonOnChangeData } from '@fluentui/react-components'
import { Dropdown, makeStyles, Option, SpinButton, tokens } from '@fluentui/react-components'
import { useCallback, type FC } from 'react'

import { SIZE_STEP } from '../../constants/editor'
import { getSpinButtonNumberValue } from './getSpinButtonNumberValue'

type FillableSizeInputProps = {
  value: number | 'fill'
  onChange: (value: number | 'fill') => void
}

type FillableSizeMode = 'fill' | 'fixed'

const fixedSizeFallback = 10
const minPanelSize = 0

const isValidPanelSize = (value: number): boolean => {
  return Number.isFinite(value) && value >= minPanelSize
}

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
  spinButton: {
    minWidth: 0,
    width: '100%',
  },
})

export const FillableSizeInput: FC<FillableSizeInputProps> = ({ value, onChange }) => {
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

      onChange(value === 'fill' ? fixedSizeFallback : value)
    },
    [onChange, value],
  )

  const handleSizeChange = useCallback(
    (_event: unknown, data: SpinButtonOnChangeData) => {
      const nextValue = getSpinButtonNumberValue(data)

      if (nextValue === undefined || !isValidPanelSize(nextValue)) {
        return
      }

      onChange(nextValue)
    },
    [onChange],
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

      <SpinButton
        className={styles.spinButton}
        min={minPanelSize}
        onChange={handleSizeChange}
        size="small"
        step={SIZE_STEP}
        value={typeof value === 'number' ? value : fixedSizeFallback}
      />
    </div>
  )
}

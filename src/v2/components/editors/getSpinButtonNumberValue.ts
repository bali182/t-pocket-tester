import type { SpinButtonOnChangeData } from '@fluentui/react-components'

export const getSpinButtonNumberValue = (data: SpinButtonOnChangeData): number | undefined => {
  if (typeof data.value === 'number' && Number.isFinite(data.value)) {
    return data.value
  }

  if (!data.displayValue) {
    return undefined
  }

  const value = Number(data.displayValue.replace(',', '.'))

  return Number.isFinite(value) ? value : undefined
}

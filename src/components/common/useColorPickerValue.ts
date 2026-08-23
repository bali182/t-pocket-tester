import { Color, ColorPicker, type ColorPickerValueChangeDetails, parseColor } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { isDefined } from '../../utils/isDefined'

type ColorPickerOpenChangeHandler = NonNullable<ColorPicker.RootProps['onOpenChange']>

type UseColorPickerValueResult = {
  handleOpenChange: ColorPickerOpenChangeHandler
  handleValueChange: (details: ColorPickerValueChangeDetails) => void
  isPickerOpen: boolean
  pickerColor: Color
  pickerColorValue: string
}

export const useColorPickerValue = (value: string, onChange: (value: string) => void): UseColorPickerValueResult => {
  const parsedColor = useMemo<Color | undefined>(() => getColor(value), [value])
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [pickerColor, setPickerColor] = useState<Color>(() => parsedColor ?? parseColor('#000000'))

  useEffect(() => {
    if (isDefined(parsedColor)) {
      setPickerColor((currentColor) => (getColorValue(currentColor) === value ? currentColor : parsedColor))
    }
  }, [parsedColor, value])

  const handleValueChange = useCallback((details: ColorPickerValueChangeDetails): void => {
    setPickerColor(details.value)
  }, [])

  const handleOpenChange = useCallback<ColorPickerOpenChangeHandler>(
    (details): void => {
      setIsPickerOpen(details.open)

      if (!details.open) {
        const pickerColorValue = getColorValue(pickerColor)

        if (pickerColorValue !== value) {
          onChange(pickerColorValue)
        }
      }
    },
    [onChange, pickerColor, value],
  )

  return {
    handleOpenChange,
    handleValueChange,
    isPickerOpen,
    pickerColor,
    pickerColorValue: getColorValue(pickerColor),
  }
}

const getColor = (value: string): Color | undefined => {
  try {
    return parseColor(value)
  } catch {
    return undefined
  }
}

const getColorValue = (color: Color): string => {
  return color.getChannelValue('alpha') === 1 ? color.toString('hex') : color.toString('hexa')
}

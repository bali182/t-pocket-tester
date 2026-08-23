import { Color, ColorPicker, type ColorPickerValueChangeDetails, parseColor } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { isDefined } from '../../utils/isDefined'

type ColorPickerOpenChangeHandler = NonNullable<ColorPicker.RootProps['onOpenChange']>

type UseColorPickerValueResult = {
  handleOpenChange: ColorPickerOpenChangeHandler
  handleValueChange: (details: ColorPickerValueChangeDetails) => void
  pickerColor: Color
}

export const useColorPickerValue = (value: string, onChange: (value: string) => void): UseColorPickerValueResult => {
  const parsedColor = useMemo<Color | undefined>(() => getColor(value), [value])
  const [pickerColor, setPickerColor] = useState<Color>(() => parsedColor ?? parseColor('#000000'))
  const colorOnPickerOpenRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (isDefined(parsedColor)) {
      colorOnPickerOpenRef.current = getColorValue(parsedColor)

      setPickerColor((currentColor) => (getColorValue(currentColor) === value ? currentColor : parsedColor))
    }
  }, [parsedColor, value])

  const handleValueChange = useCallback((details: ColorPickerValueChangeDetails): void => {
    setPickerColor(details.value)
  }, [])

  const handleOpenChange = useCallback<ColorPickerOpenChangeHandler>(
    (details): void => {
      if (details.open) {
        colorOnPickerOpenRef.current = getColorValue(pickerColor)
        return
      }

      const pickerColorValue = getColorValue(pickerColor)

      if (colorOnPickerOpenRef.current !== pickerColorValue) {
        onChange(pickerColorValue)
      }

      colorOnPickerOpenRef.current = undefined
    },
    [onChange, pickerColor],
  )

  return { handleOpenChange, handleValueChange, pickerColor }
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

import { useMemo } from 'react'
import { ColorKey } from '../data/colors'
import { useTranslation } from '../translations/translation'

export type ColorValue = {
  key: string
  name: string
  color: string
}

type ColorEntry = [ColorKey, string]

export const useColors = (values: Partial<Record<ColorKey, string>>): ColorValue[] => {
  const t = useTranslation()
  const { colors: leatherColorNames } = t

  const colors = useMemo((): ColorValue[] => {
    const entries = Object.entries(values) as ColorEntry[]
    return entries.map(([key, color]): ColorValue => ({ key, name: leatherColorNames[key], color }))
  }, [leatherColorNames, values])

  return colors
}

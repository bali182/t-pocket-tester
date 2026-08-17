import BigNumber from 'bignumber.js'

import type { AdaptiveMagicFixNumericBand } from '../types'

export const getAdaptiveMagicFixNumericBands = (
  minValue: BigNumber,
  maxValue: BigNumber,
  bandCount: number,
): AdaptiveMagicFixNumericBand[] => {
  const bandWidth = maxValue.minus(minValue).dividedBy(bandCount)

  return Array.from({ length: bandCount }, (_, index) => ({
    minValue: minValue.plus(bandWidth.times(index)),
    maxValue: index === bandCount - 1 ? maxValue : minValue.plus(bandWidth.times(index + 1)),
  }))
}

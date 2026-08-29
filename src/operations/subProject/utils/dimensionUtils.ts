import BigNumber from 'bignumber.js'

import { HasSizeSchema } from '../../../schemas/common'
import { StitchLineCommonConfigSchema } from '../../../schemas/stitching'

export const getClosestPocketStepSize = (
  preferredSize: number,
  stitchingSettings: StitchLineCommonConfigSchema,
): number => {
  return new BigNumber(preferredSize)
    .dividedBy(stitchingSettings.stitchHoleDistance)
    .integerValue(BigNumber.ROUND_CEIL)
    .times(stitchingSettings.stitchHoleDistance)
    .toNumber()
}

export const getClosestRootDimensions = (
  preferredSize: HasSizeSchema,
  stitchingSettings: StitchLineCommonConfigSchema,
): HasSizeSchema => {
  const rootMargin = new BigNumber(stitchingSettings.stitchMargin).times(2)
  const stitchHoleDistance = new BigNumber(stitchingSettings.stitchHoleDistance)
  const width = new BigNumber(preferredSize.width)
  const height = new BigNumber(preferredSize.height)

  return {
    width: getClosestRootDimension(width, rootMargin, stitchHoleDistance),
    height: getClosestRootDimension(height, rootMargin, stitchHoleDistance),
  }
}

const getClosestRootDimension = (
  preferredSize: BigNumber,
  rootMargin: BigNumber,
  stitchHoleDistance: BigNumber,
): number => {
  const stitchHoleCount = BigNumber.maximum(
    0,
    preferredSize.minus(rootMargin).dividedBy(stitchHoleDistance).integerValue(BigNumber.ROUND_CEIL),
  )
  return rootMargin.plus(stitchHoleCount.times(stitchHoleDistance)).toNumber()
}

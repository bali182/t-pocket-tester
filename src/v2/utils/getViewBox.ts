import BigNumber from 'bignumber.js'

import type { RectSchema } from '../schemas/geometry'

export const getViewBox = (boundingBox: RectSchema, padding: number): string => {
  const paddingValue = new BigNumber(padding)
  const minX = boundingBox.x.minus(paddingValue)
  const minY = boundingBox.y.minus(paddingValue)
  const width = boundingBox.width.plus(paddingValue.times(2))
  const height = boundingBox.height.plus(paddingValue.times(2))
  return `${minX.toString()} ${minY.toString()} ${width.toString()} ${height.toString()}`
}

import BigNumber from 'bignumber.js'

export const clamp = (
  value: BigNumber.Value,
  min: BigNumber.Value,
  max: BigNumber.Value,
): BigNumber => {
  return BigNumber.minimum(BigNumber.maximum(value, min), max)
}

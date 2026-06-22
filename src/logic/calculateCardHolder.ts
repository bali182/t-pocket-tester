import type { CalculatedCardHolder, CardHolderInput } from '../types'
import { calculateBackPanel } from './calculateBackPanel'
import { calculatePlainPocket } from './calculatePlainPocket'
import { calculateTPocket } from './calculateTPocket'
import { calculateOverallSize, calculateTPocketCount } from './utils'

export const calculateCardHolder = (input: CardHolderInput): CalculatedCardHolder => {
  return {
    overallSize: calculateOverallSize(input),
    backPanel: calculateBackPanel(input),
    tPockets: Array.from({ length: calculateTPocketCount(input) }, (_, index) => calculateTPocket(input, index)),
    coverPocket: calculatePlainPocket(input),
  }
}

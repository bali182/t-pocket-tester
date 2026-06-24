import type { CalculatedCardHolder, CardHolderInput } from '../types'
import { calculateBackPanel } from './calculateBackPanel'
import { calculateCard } from './calculateCard'
import { calculatePlainPocket } from './calculatePlainPocket'
import { calculateTPocket } from './calculateTPocket'
import { calculateOverallSize, calculateTPocketCount } from './utils'

export const calculateCardHolder = (input: CardHolderInput): CalculatedCardHolder => {
  return {
    overallSize: calculateOverallSize(input),
    backPanel: calculateBackPanel(input),
    cards: Array.from({ length: input.pocketCount }, (_, index) => calculateCard(input, index)),
    tPockets: Array.from({ length: calculateTPocketCount(input) }, (_, index) => calculateTPocket(input, index)),
    coverPocket: calculatePlainPocket(input),
  }
}

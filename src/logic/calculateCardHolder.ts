import type { CardHolderInputSchema } from '../schemas/CardHolderInputSchema'
import type { CalculatedCardHolderSchema } from '../schemas/CalculatedCardHolderSchema'
import { calculateBackPanel } from './calculateBackPanel'
import { calculateCard } from './calculateCard'
import { calculateTopPocket } from './calculateTopPocket'
import { calculateTPocket } from './calculateTPocket'
import { calculateOverallSize, calculateTPocketCount } from './utils'

export const calculateCardHolder = (input: CardHolderInputSchema): CalculatedCardHolderSchema => {
  return {
    overallSize: calculateOverallSize(input),
    backPanel: calculateBackPanel(input),
    cards: Array.from({ length: input.pocketCount }, (_, index) => calculateCard(input, index)),
    tPockets: Array.from({ length: calculateTPocketCount(input) }, (_, index) => calculateTPocket(input, index)),
    coverPocket: calculateTopPocket(input),
  }
}

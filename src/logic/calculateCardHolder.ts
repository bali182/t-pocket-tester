import type { CardHolderInput } from '../schemas/CardHolderInputSchema'
import type { CalculatedCardHolderModel } from '../schemas/CalculatedCardHolderModelSchema'
import { calculateBackPanel } from './calculateBackPanel'
import { calculateCard } from './calculateCard'
import { calculateTopPocket } from './calculateTopPocket'
import { calculateTPocket } from './calculateTPocket'
import { calculateOverallSize, calculateTPocketCount } from './utils'

export const calculateCardHolder = (input: CardHolderInput): CalculatedCardHolderModel => {
  return {
    overallSize: calculateOverallSize(input),
    backPanel: calculateBackPanel(input),
    cards: Array.from({ length: input.pocketCount }, (_, index) => calculateCard(input, index)),
    tPockets: Array.from({ length: calculateTPocketCount(input) }, (_, index) => calculateTPocket(input, index)),
    coverPocket: calculateTopPocket(input),
  }
}

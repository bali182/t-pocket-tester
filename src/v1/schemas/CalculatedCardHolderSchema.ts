import { BackPanelSchema } from './BackPanelSchema'
import { CardSchema } from './CardSchema'
import { SizeSchema } from './SizeSchema'
import { TopPocketSchema } from './TopPocketSchema'
import { TPocketSchema } from './TPocketSchema'

export type CalculatedCardHolderSchema = {
  overallSize: SizeSchema
  backPanel: BackPanelSchema
  cards: CardSchema[]
  tPockets: TPocketSchema[]
  coverPocket: TopPocketSchema
}

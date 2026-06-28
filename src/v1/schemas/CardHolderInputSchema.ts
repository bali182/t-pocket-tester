import { SizeSchema } from './SizeSchema'

export type CardHolderInputSchema = {
  cardSize: SizeSchema
  pocketCount: number
  stitchMargin: number
  cardSideClearanceFromStitch: number
  cardBottomClearanceFromStitch: number
  pocketSpacing: number
  tPocketTabWidth: number
  tPocketTaper: number
  pocketHeight: number
}

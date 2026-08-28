import { CardSchema } from '../schemas/valuables'

export const landscapeCards: CardSchema[] = [
  { id: 'ID-1-landscape', width: 85.6, height: 53.98, thickness: 0.76, radius: 3.18 },
  { id: 'ID-2-landscape', width: 105, height: 74, thickness: 0.76, radius: 3.18 },
  { id: 'ID-3-landscape', width: 125, height: 88, thickness: 0.76, radius: 3.18 },
]

export const portraitCards: CardSchema[] = [
  { id: 'ID-1-portrait', width: 53.98, height: 85.6, thickness: 0.76, radius: 3.18 },
  { id: 'ID-2-portrait', width: 74, height: 105, thickness: 0.76, radius: 3.18 },
  { id: 'ID-3-portrait', width: 88, height: 125, thickness: 0.76, radius: 3.18 },
]

export const cards: CardSchema[] = [...landscapeCards, ...portraitCards]

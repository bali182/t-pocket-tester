import { RectSchema } from './RectSchema'

export type CardSchema = {
  kind: 'card'
  index: number
  outline: RectSchema
}

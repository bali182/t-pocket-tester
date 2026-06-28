import { CardHolderInputSchema } from './CardHolderInputSchema'

export type CardHolderInputFieldSchema = {
  key: keyof CardHolderInputSchema
  label: string
  min?: number
  max?: number
}

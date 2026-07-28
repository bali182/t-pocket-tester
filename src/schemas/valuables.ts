export type CardSchemaId = 'ID-1' | 'ID-2' | 'ID-3'

export type CardSchema = {
  id: CardSchemaId
  width: number
  height: number
  thickness: number
  radius: number
}

export type BankNoteSchema = {
  id: string
  width: number
  height: number
}

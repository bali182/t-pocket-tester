export type CardSchemaId =
  | 'ID-1-landscape'
  | 'ID-2-landscape'
  | 'ID-3-landscape'
  | 'ID-1-portrait'
  | 'ID-2-portrait'
  | 'ID-3-portrait'

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

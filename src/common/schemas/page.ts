export type PageSchemaId = 'A5' | 'A4' | 'A3'

// Represents a page in portrait orientation.
export type PageSchema = {
  id: PageSchemaId
  width: number
  height: number
}

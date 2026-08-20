import { HasComponentReferenceSchema, HasCornerRadiusSchema, HasIdentitySchema, HasSizeSchema, HasTypeSchema } from './common'

export type HoleAnchorSchema = 'start' | 'middle' | 'end'

export type HolePositionSchema = {
  xAnchor: HoleAnchorSchema
  xOffset: number
  yAnchor: HoleAnchorSchema
  yOffset: number
}

export type HoleSchema = HasTypeSchema<'hole'> &
  HasIdentitySchema &
  HasComponentReferenceSchema &
  HolePositionSchema &
  HasSizeSchema &
  HasCornerRadiusSchema

import { HasComponentReferenceSchema, HasCornerRadiusSchema, HasIdentitySchema, HasSizeSchema } from './common'

export type HoleAnchorSchema = 'start' | 'middle' | 'end'

export type HolePositionSchema = {
  xAnchor: HoleAnchorSchema
  xOffset: number
  yAnchor: HoleAnchorSchema
  yOffset: number
}

export type HoleSchema = HasIdentitySchema &
  HasComponentReferenceSchema &
  HolePositionSchema &
  HasSizeSchema &
  HasCornerRadiusSchema

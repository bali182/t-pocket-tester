import {
  AnchorSchema,
  HasComponentReferenceSchema,
  HasCornerRadiusSchema,
  HasIdentitySchema,
  HasSizeSchema,
  HasTypeSchema,
} from './common'

export type HolePositionSchema = {
  xAnchor: AnchorSchema
  xOffset: number
  yAnchor: AnchorSchema
  yOffset: number
}

export type HoleSchema = HasTypeSchema<'hole'> &
  HasIdentitySchema &
  HasComponentReferenceSchema &
  HolePositionSchema &
  HasSizeSchema &
  HasCornerRadiusSchema

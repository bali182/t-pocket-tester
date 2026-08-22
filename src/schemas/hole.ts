import {
  AnchorSchema,
  HasComponentReferenceSchema,
  HasCornerRadiusSchema,
  HasIdentitySchema,
  HasLayoutOffsetsSchema,
  HasSizeSchema,
  HasTypeSchema,
} from './common'

export type HasAnchorsSchema = {
  xAnchor: AnchorSchema
  yAnchor: AnchorSchema
}

export type HoleSchema = HasTypeSchema<'hole'> &
  HasLayoutOffsetsSchema &
  HasIdentitySchema &
  HasComponentReferenceSchema &
  HasAnchorsSchema &
  HasSizeSchema &
  HasCornerRadiusSchema

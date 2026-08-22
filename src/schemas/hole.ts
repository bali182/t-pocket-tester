import {
  AnchorSchema,
  HasComponentReferenceSchema,
  HasCornerRadiusSchema,
  HasIdentitySchema,
  HasXYOffsetSchema,
  HasSizeSchema,
  HasTypeSchema,
} from './common'

export type HasAnchorsSchema = {
  xAnchor: AnchorSchema
  yAnchor: AnchorSchema
}

export type HoleSchema = HasTypeSchema<'hole'> &
  HasXYOffsetSchema &
  HasIdentitySchema &
  HasComponentReferenceSchema &
  HasAnchorsSchema &
  HasSizeSchema &
  HasCornerRadiusSchema

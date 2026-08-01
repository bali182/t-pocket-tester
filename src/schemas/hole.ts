import { HasComponentReferenceSchema, HasCornerRadiusSchema, HasIdentitySchema, HasSizeSchema } from './common'

export type HoleAnchorSchema = 'start' | 'middle' | 'end'

export type HolePositionSchema = {
  xAnchor: HoleAnchorSchema
  xOffset: number
  yAnchor: HoleAnchorSchema
  yOffset: number
}

export type RectHoleSchema = HasIdentitySchema &
  HasComponentReferenceSchema &
  HolePositionSchema &
  HasSizeSchema &
  HasCornerRadiusSchema & {
    type: 'rect-hole'
  }

export type CircleHoleSchema = HasIdentitySchema &
  HasComponentReferenceSchema &
  HolePositionSchema & {
    type: 'circle-hole'
    radius: number
  }

export type HoleSchema = RectHoleSchema | CircleHoleSchema

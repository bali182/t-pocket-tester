import type { CornerRadiusSchema, RectSchema } from '../../schemas/geometry'

export type ComponentBoundsStitchLineTarget = {
  componentId: string
  boundingRect: RectSchema
  cornerRadius: CornerRadiusSchema
}

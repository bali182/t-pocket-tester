import type { PointSchema, RectSchema } from '../schemas/geometry'

export const translateRect = (rect: RectSchema, translation: PointSchema): RectSchema => {
  return {
    ...rect,
    x: rect.x.plus(translation.x),
    y: rect.y.plus(translation.y),
  }
}

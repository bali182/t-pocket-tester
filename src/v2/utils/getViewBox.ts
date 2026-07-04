import type { RectSchema } from '../schemas/geometry'

export const getViewBox = (strokeWidth: number, boundingBox: RectSchema): string => {
  const strokePadding = strokeWidth / 2

  return `${boundingBox.x - strokePadding} ${boundingBox.y - strokePadding} ${boundingBox.width + strokePadding * 2} ${boundingBox.height + strokePadding * 2}`
}

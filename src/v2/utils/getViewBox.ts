import type { RectSchema } from '../schemas/geometry'

export const getViewBox = (boundingBox: RectSchema, padding: number): string => {
  const minX = boundingBox.x - padding
  const minY = boundingBox.y - padding
  const width = boundingBox.width + padding * 2
  const height = boundingBox.height + padding * 2
  return `${minX} ${minY} ${width} ${height}`
}

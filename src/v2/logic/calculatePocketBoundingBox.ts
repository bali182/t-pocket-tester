import { PocketClusterSchema } from '../schemas/components'
import { RectSchema } from '../schemas/geometry'
import { calculatePocketDepth } from './pocketUtils'

export const calculatePocketBoundingBox = (
  pocketCluster: PocketClusterSchema,
  rect: RectSchema,
  index: number,
): RectSchema => {
  const pocketDepth = calculatePocketDepth(pocketCluster, rect)

  switch (pocketCluster.orientation) {
    case 'up':
      return {
        x: rect.x,
        y: rect.y + index * pocketCluster.pocketStep,
        width: rect.width,
        height: pocketDepth,
      }
    case 'down':
      return {
        x: rect.x,
        y: rect.y + (pocketCluster.pocketCount - 1 - index) * pocketCluster.pocketStep,
        width: rect.width,
        height: pocketDepth,
      }
    case 'left':
      return {
        x: rect.x + index * pocketCluster.pocketStep,
        y: rect.y,
        width: pocketDepth,
        height: rect.height,
      }
    case 'right':
      return {
        x: rect.x + (pocketCluster.pocketCount - 1 - index) * pocketCluster.pocketStep,
        y: rect.y,
        width: pocketDepth,
        height: rect.height,
      }
  }
}

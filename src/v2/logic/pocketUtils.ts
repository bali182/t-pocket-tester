import { PocketClusterSchema } from '../schemas/components'
import { RectSchema } from '../schemas/geometry'
import { clamp } from '../utils/clamp'

export const calculatePocketDepth = (pocketCluster: PocketClusterSchema, rect: RectSchema): number => {
  return getStackLength(pocketCluster, rect) - (pocketCluster.pocketCount - 1) * pocketCluster.pocketStep
}

export const getTPocketTabDepth = (pocketCluster: PocketClusterSchema, rect: RectSchema): number => {
  return clamp(pocketCluster.pocketStep, 0, getStackLength(pocketCluster, rect))
}

const getStackLength = (pocketCluster: PocketClusterSchema, rect: RectSchema): number => {
  return pocketCluster.orientation === 'up' || pocketCluster.orientation === 'down' ? rect.height : rect.width
}

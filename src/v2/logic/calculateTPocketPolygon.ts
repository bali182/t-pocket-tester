import { PocketClusterSchema } from '../schemas/components'
import { PolygonSchema, RectSchema } from '../schemas/geometry'
import { getTPocketTabDepth } from './pocketUtils'

export const calculateTPocketPolygon = (rect: RectSchema, pocketCluster: PocketClusterSchema): PolygonSchema => {
  switch (pocketCluster.orientation) {
    case 'up':
      return calculateUpTPocketPolygon(rect, pocketCluster)
    case 'down':
      return calculateDownTPocketPolygon(rect, pocketCluster)
    case 'left':
      return calculateLeftTPocketPolygon(rect, pocketCluster)
    case 'right':
      return calculateRightTPocketPolygon(rect, pocketCluster)
  }
}

const calculateUpTPocketPolygon = (rect: RectSchema, pocketCluster: PocketClusterSchema): PolygonSchema => {
  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const tabBottomY = rect.y + tPocketTabDepth
  const bottomY = rect.y + rect.height

  const points = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: tabBottomY },
    { x: rect.x + rect.width - pocketCluster.tPocketTabWidth, y: tabBottomY },
    { x: rect.x + rect.width - pocketCluster.tPocketTaper, y: bottomY },
    { x: rect.x + pocketCluster.tPocketTaper, y: bottomY },
    { x: rect.x + pocketCluster.tPocketTabWidth, y: tabBottomY },
    { x: rect.x, y: tabBottomY },
  ]

  return { points }
}

const calculateDownTPocketPolygon = (rect: RectSchema, pocketCluster: PocketClusterSchema): PolygonSchema => {
  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const topY = rect.y
  const tabTopY = rect.y + rect.height - tPocketTabDepth
  const bottomY = rect.y + rect.height

  const points = [
    { x: rect.x, y: bottomY },
    { x: rect.x + rect.width, y: bottomY },
    { x: rect.x + rect.width, y: tabTopY },
    { x: rect.x + rect.width - pocketCluster.tPocketTabWidth, y: tabTopY },
    { x: rect.x + rect.width - pocketCluster.tPocketTaper, y: topY },
    { x: rect.x + pocketCluster.tPocketTaper, y: topY },
    { x: rect.x + pocketCluster.tPocketTabWidth, y: tabTopY },
    { x: rect.x, y: tabTopY },
  ]
  return { points }
}

const calculateLeftTPocketPolygon = (rect: RectSchema, pocketCluster: PocketClusterSchema): PolygonSchema => {
  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const tabRightX = rect.x + tPocketTabDepth
  const rightX = rect.x + rect.width

  const points = [
    { x: rect.x, y: rect.y },
    { x: rect.x, y: rect.y + rect.height },
    { x: tabRightX, y: rect.y + rect.height },
    { x: tabRightX, y: rect.y + rect.height - pocketCluster.tPocketTabWidth },
    { x: rightX, y: rect.y + rect.height - pocketCluster.tPocketTaper },
    { x: rightX, y: rect.y + pocketCluster.tPocketTaper },
    { x: tabRightX, y: rect.y + pocketCluster.tPocketTabWidth },
    { x: tabRightX, y: rect.y },
  ]
  return { points }
}

const calculateRightTPocketPolygon = (rect: RectSchema, pocketCluster: PocketClusterSchema): PolygonSchema => {
  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const leftX = rect.x
  const tabLeftX = rect.x + rect.width - tPocketTabDepth
  const rightX = rect.x + rect.width

  const points = [
    { x: rightX, y: rect.y },
    { x: rightX, y: rect.y + rect.height },
    { x: tabLeftX, y: rect.y + rect.height },
    { x: tabLeftX, y: rect.y + rect.height - pocketCluster.tPocketTabWidth },
    { x: leftX, y: rect.y + rect.height - pocketCluster.tPocketTaper },
    { x: leftX, y: rect.y + pocketCluster.tPocketTaper },
    { x: tabLeftX, y: rect.y + pocketCluster.tPocketTabWidth },
    { x: tabLeftX, y: rect.y },
  ]
  return { points }
}

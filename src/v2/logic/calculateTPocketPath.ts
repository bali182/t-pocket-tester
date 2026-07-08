import type { PocketClusterSchema } from '../schemas/components'
import type { Path, PathCommand, RectSchema } from '../schemas/geometry'
import { getTPocketTabDepth } from './pocketUtils'

export const calculateTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): Path => {
  switch (pocketCluster.orientation) {
    case 'up':
      return calculateUpTPocketPath(rect, pocketCluster)
    case 'down':
      return calculateDownTPocketPath(rect, pocketCluster)
    case 'left':
      return calculateLeftTPocketPath(rect, pocketCluster)
    case 'right':
      return calculateRightTPocketPath(rect, pocketCluster)
  }
}

const calculateUpTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): Path => {
  const r = pocketCluster.pocketRadius
  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const right = rect.x + rect.width
  const tabBottomY = rect.y + tPocketTabDepth
  const bottom = rect.y + rect.height
  const commands: PathCommand[] = [
    { type: 'moveTo', point: { x: rect.x + r, y: rect.y } },
    { type: 'lineTo', point: { x: right - r, y: rect.y } },
  ]

  if (r > 0) {
    commands.push({ type: 'arcTo', radius: r, point: { x: right, y: rect.y + r } })
  }

  commands.push(
    { type: 'lineTo', point: { x: right, y: tabBottomY } },
    { type: 'lineTo', point: { x: right - pocketCluster.tPocketTabWidth, y: tabBottomY } },
    { type: 'lineTo', point: { x: right - pocketCluster.tPocketTaper, y: bottom } },
    { type: 'lineTo', point: { x: rect.x + pocketCluster.tPocketTaper, y: bottom } },
    { type: 'lineTo', point: { x: rect.x + pocketCluster.tPocketTabWidth, y: tabBottomY } },
    { type: 'lineTo', point: { x: rect.x, y: tabBottomY } },
    { type: 'lineTo', point: { x: rect.x, y: rect.y + r } },
  )

  if (r > 0) {
    commands.push({ type: 'arcTo', radius: r, point: { x: rect.x + r, y: rect.y } })
  }

  commands.push({ type: 'close' })

  return { commands }
}

const calculateDownTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): Path => {
  const r = pocketCluster.pocketRadius
  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const top = rect.y
  const right = rect.x + rect.width
  const tabTopY = rect.y + rect.height - tPocketTabDepth
  const bottom = rect.y + rect.height
  const commands: PathCommand[] = [
    { type: 'moveTo', point: { x: rect.x, y: bottom - r } },
    { type: 'lineTo', point: { x: rect.x, y: tabTopY } },
    { type: 'lineTo', point: { x: rect.x + pocketCluster.tPocketTabWidth, y: tabTopY } },
    { type: 'lineTo', point: { x: rect.x + pocketCluster.tPocketTaper, y: top } },
    { type: 'lineTo', point: { x: right - pocketCluster.tPocketTaper, y: top } },
    { type: 'lineTo', point: { x: right - pocketCluster.tPocketTabWidth, y: tabTopY } },
    { type: 'lineTo', point: { x: right, y: tabTopY } },
    { type: 'lineTo', point: { x: right, y: bottom - r } },
  ]

  if (r > 0) {
    commands.push({ type: 'arcTo', radius: r, point: { x: right - r, y: bottom } })
  }

  commands.push({ type: 'lineTo', point: { x: rect.x + r, y: bottom } })

  if (r > 0) {
    commands.push({ type: 'arcTo', radius: r, point: { x: rect.x, y: bottom - r } })
  }

  commands.push({ type: 'close' })

  return { commands }
}

const calculateLeftTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): Path => {
  const r = pocketCluster.pocketRadius
  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const tabRightX = rect.x + tPocketTabDepth
  const right = rect.x + rect.width
  const bottom = rect.y + rect.height
  const commands: PathCommand[] = [
    { type: 'moveTo', point: { x: rect.x + r, y: rect.y } },
    { type: 'lineTo', point: { x: tabRightX, y: rect.y } },
    { type: 'lineTo', point: { x: tabRightX, y: rect.y + pocketCluster.tPocketTabWidth } },
    { type: 'lineTo', point: { x: right, y: rect.y + pocketCluster.tPocketTaper } },
    { type: 'lineTo', point: { x: right, y: bottom - pocketCluster.tPocketTaper } },
    { type: 'lineTo', point: { x: tabRightX, y: bottom - pocketCluster.tPocketTabWidth } },
    { type: 'lineTo', point: { x: tabRightX, y: bottom } },
    { type: 'lineTo', point: { x: rect.x + r, y: bottom } },
  ]

  if (r > 0) {
    commands.push({ type: 'arcTo', radius: r, point: { x: rect.x, y: bottom - r } })
  }

  commands.push({ type: 'lineTo', point: { x: rect.x, y: rect.y + r } })

  if (r > 0) {
    commands.push({ type: 'arcTo', radius: r, point: { x: rect.x + r, y: rect.y } })
  }

  commands.push({ type: 'close' })

  return { commands }
}

const calculateRightTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): Path => {
  const r = pocketCluster.pocketRadius
  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const left = rect.x
  const tabLeftX = rect.x + rect.width - tPocketTabDepth
  const right = rect.x + rect.width
  const bottom = rect.y + rect.height
  const commands: PathCommand[] = [
    { type: 'moveTo', point: { x: right, y: rect.y + r } },
    { type: 'lineTo', point: { x: right, y: bottom - r } },
  ]

  if (r > 0) {
    commands.push({ type: 'arcTo', radius: r, point: { x: right - r, y: bottom } })
  }

  commands.push(
    { type: 'lineTo', point: { x: tabLeftX, y: bottom } },
    { type: 'lineTo', point: { x: tabLeftX, y: bottom - pocketCluster.tPocketTabWidth } },
    { type: 'lineTo', point: { x: left, y: bottom - pocketCluster.tPocketTaper } },
    { type: 'lineTo', point: { x: left, y: rect.y + pocketCluster.tPocketTaper } },
    { type: 'lineTo', point: { x: tabLeftX, y: rect.y + pocketCluster.tPocketTabWidth } },
    { type: 'lineTo', point: { x: tabLeftX, y: rect.y } },
    { type: 'lineTo', point: { x: right - r, y: rect.y } },
  )

  if (r > 0) {
    commands.push({ type: 'arcTo', radius: r, point: { x: right, y: rect.y + r } })
  }

  commands.push({ type: 'close' })

  return { commands }
}

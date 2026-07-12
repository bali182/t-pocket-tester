import BigNumber from 'bignumber.js'

import type { PocketClusterSchema } from '../schemas/components'
import type { PathCommand, PathSchema, RectSchema } from '../schemas/geometry'
import { getTPocketTabDepth } from './pocketUtils'

const ZERO = new BigNumber(0)

export const calculateTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): PathSchema => {
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

const calculateUpTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): PathSchema => {
  const left = rect.x
  const top = rect.y
  const right = left.plus(rect.width)
  const bottom = top.plus(rect.height)
  const r = new BigNumber(pocketCluster.pocketRadius)
  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const tPocketTabWidth = new BigNumber(pocketCluster.tPocketTabWidth)
  const tPocketTaper = new BigNumber(pocketCluster.tPocketTaper)
  const tabBottomY = top.plus(tPocketTabDepth)
  const commands: PathCommand[] = [
    { type: 'moveTo', point: { x: left.plus(r), y: top } },
    { type: 'lineTo', point: { x: right.minus(r), y: top } },
  ]

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r, point: { x: right, y: top.plus(r) } })
  }

  commands.push(
    { type: 'lineTo', point: { x: right, y: tabBottomY } },
    { type: 'lineTo', point: { x: right.minus(tPocketTabWidth), y: tabBottomY } },
    { type: 'lineTo', point: { x: right.minus(tPocketTaper), y: bottom } },
    { type: 'lineTo', point: { x: left.plus(tPocketTaper), y: bottom } },
    { type: 'lineTo', point: { x: left.plus(tPocketTabWidth), y: tabBottomY } },
    { type: 'lineTo', point: { x: left, y: tabBottomY } },
    { type: 'lineTo', point: { x: left, y: top.plus(r) } },
  )

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r, point: { x: left.plus(r), y: top } })
  }

  commands.push({ type: 'close' })

  return { commands }
}

const calculateDownTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): PathSchema => {
  const left = rect.x
  const top = rect.y
  const right = left.plus(rect.width)
  const bottom = top.plus(rect.height)
  const r = new BigNumber(pocketCluster.pocketRadius)
  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const tPocketTabWidth = new BigNumber(pocketCluster.tPocketTabWidth)
  const tPocketTaper = new BigNumber(pocketCluster.tPocketTaper)
  const tabTopY = bottom.minus(tPocketTabDepth)
  const commands: PathCommand[] = [
    { type: 'moveTo', point: { x: left, y: bottom.minus(r) } },
    { type: 'lineTo', point: { x: left, y: tabTopY } },
    { type: 'lineTo', point: { x: left.plus(tPocketTabWidth), y: tabTopY } },
    { type: 'lineTo', point: { x: left.plus(tPocketTaper), y: top } },
    { type: 'lineTo', point: { x: right.minus(tPocketTaper), y: top } },
    { type: 'lineTo', point: { x: right.minus(tPocketTabWidth), y: tabTopY } },
    { type: 'lineTo', point: { x: right, y: tabTopY } },
    { type: 'lineTo', point: { x: right, y: bottom.minus(r) } },
  ]

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r, point: { x: right.minus(r), y: bottom } })
  }

  commands.push({ type: 'lineTo', point: { x: left.plus(r), y: bottom } })

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r, point: { x: left, y: bottom.minus(r) } })
  }

  commands.push({ type: 'close' })

  return { commands }
}

const calculateLeftTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): PathSchema => {
  const left = rect.x
  const top = rect.y
  const right = left.plus(rect.width)
  const bottom = top.plus(rect.height)
  const r = new BigNumber(pocketCluster.pocketRadius)
  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const tPocketTabWidth = new BigNumber(pocketCluster.tPocketTabWidth)
  const tPocketTaper = new BigNumber(pocketCluster.tPocketTaper)
  const tabRightX = left.plus(tPocketTabDepth)
  const commands: PathCommand[] = [
    { type: 'moveTo', point: { x: left.plus(r), y: top } },
    { type: 'lineTo', point: { x: tabRightX, y: top } },
    { type: 'lineTo', point: { x: tabRightX, y: top.plus(tPocketTabWidth) } },
    { type: 'lineTo', point: { x: right, y: top.plus(tPocketTaper) } },
    { type: 'lineTo', point: { x: right, y: bottom.minus(tPocketTaper) } },
    { type: 'lineTo', point: { x: tabRightX, y: bottom.minus(tPocketTabWidth) } },
    { type: 'lineTo', point: { x: tabRightX, y: bottom } },
    { type: 'lineTo', point: { x: left.plus(r), y: bottom } },
  ]

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r, point: { x: left, y: bottom.minus(r) } })
  }

  commands.push({ type: 'lineTo', point: { x: left, y: top.plus(r) } })

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r, point: { x: left.plus(r), y: top } })
  }

  commands.push({ type: 'close' })

  return { commands }
}

const calculateRightTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): PathSchema => {
  const left = rect.x
  const top = rect.y
  const right = left.plus(rect.width)
  const bottom = top.plus(rect.height)
  const r = new BigNumber(pocketCluster.pocketRadius)
  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const tPocketTabWidth = new BigNumber(pocketCluster.tPocketTabWidth)
  const tPocketTaper = new BigNumber(pocketCluster.tPocketTaper)
  const tabLeftX = right.minus(tPocketTabDepth)
  const commands: PathCommand[] = [
    { type: 'moveTo', point: { x: right, y: top.plus(r) } },
    { type: 'lineTo', point: { x: right, y: bottom.minus(r) } },
  ]

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r, point: { x: right.minus(r), y: bottom } })
  }

  commands.push(
    { type: 'lineTo', point: { x: tabLeftX, y: bottom } },
    { type: 'lineTo', point: { x: tabLeftX, y: bottom.minus(tPocketTabWidth) } },
    { type: 'lineTo', point: { x: left, y: bottom.minus(tPocketTaper) } },
    { type: 'lineTo', point: { x: left, y: top.plus(tPocketTaper) } },
    { type: 'lineTo', point: { x: tabLeftX, y: top.plus(tPocketTabWidth) } },
    { type: 'lineTo', point: { x: tabLeftX, y: top } },
    { type: 'lineTo', point: { x: right.minus(r), y: top } },
  )

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r, point: { x: right, y: top.plus(r) } })
  }

  commands.push({ type: 'close' })

  return { commands }
}

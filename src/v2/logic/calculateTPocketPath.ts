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
  const left = new BigNumber(rect.x)
  const top = new BigNumber(rect.y)
  const right = left.plus(rect.width)
  const bottom = top.plus(rect.height)

  const r = new BigNumber(pocketCluster.pocketRadius)

  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const tPocketTabWidth = new BigNumber(pocketCluster.tPocketTabWidth)
  const tPocketTaper = new BigNumber(pocketCluster.tPocketTaper)
  const tabBottomY = top.plus(tPocketTabDepth)

  const commands: PathCommand[] = [
    { type: 'moveTo', point: { x: left.plus(r).toNumber(), y: top.toNumber() } },
    { type: 'lineTo', point: { x: right.minus(r).toNumber(), y: top.toNumber() } },
  ]

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r.toNumber(), point: { x: right.toNumber(), y: top.plus(r).toNumber() } })
  }

  commands.push(
    { type: 'lineTo', point: { x: right.toNumber(), y: tabBottomY.toNumber() } },
    { type: 'lineTo', point: { x: right.minus(tPocketTabWidth).toNumber(), y: tabBottomY.toNumber() } },
    { type: 'lineTo', point: { x: right.minus(tPocketTaper).toNumber(), y: bottom.toNumber() } },
    { type: 'lineTo', point: { x: left.plus(tPocketTaper).toNumber(), y: bottom.toNumber() } },
    { type: 'lineTo', point: { x: left.plus(tPocketTabWidth).toNumber(), y: tabBottomY.toNumber() } },
    { type: 'lineTo', point: { x: left.toNumber(), y: tabBottomY.toNumber() } },
    { type: 'lineTo', point: { x: left.toNumber(), y: top.plus(r).toNumber() } },
  )

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r.toNumber(), point: { x: left.plus(r).toNumber(), y: top.toNumber() } })
  }

  commands.push({ type: 'close' })

  return { commands }
}

const calculateDownTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): PathSchema => {
  const left = new BigNumber(rect.x)
  const top = new BigNumber(rect.y)
  const right = left.plus(rect.width)
  const bottom = top.plus(rect.height)

  const r = new BigNumber(pocketCluster.pocketRadius)

  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const tPocketTabWidth = new BigNumber(pocketCluster.tPocketTabWidth)
  const tPocketTaper = new BigNumber(pocketCluster.tPocketTaper)
  const tabTopY = bottom.minus(tPocketTabDepth)

  const commands: PathCommand[] = [
    { type: 'moveTo', point: { x: left.toNumber(), y: bottom.minus(r).toNumber() } },
    { type: 'lineTo', point: { x: left.toNumber(), y: tabTopY.toNumber() } },
    { type: 'lineTo', point: { x: left.plus(tPocketTabWidth).toNumber(), y: tabTopY.toNumber() } },
    { type: 'lineTo', point: { x: left.plus(tPocketTaper).toNumber(), y: top.toNumber() } },
    { type: 'lineTo', point: { x: right.minus(tPocketTaper).toNumber(), y: top.toNumber() } },
    { type: 'lineTo', point: { x: right.minus(tPocketTabWidth).toNumber(), y: tabTopY.toNumber() } },
    { type: 'lineTo', point: { x: right.toNumber(), y: tabTopY.toNumber() } },
    { type: 'lineTo', point: { x: right.toNumber(), y: bottom.minus(r).toNumber() } },
  ]

  if (r.isGreaterThan(ZERO)) {
    commands.push({
      type: 'arcTo',
      radius: r.toNumber(),
      point: { x: right.minus(r).toNumber(), y: bottom.toNumber() },
    })
  }

  commands.push({ type: 'lineTo', point: { x: left.plus(r).toNumber(), y: bottom.toNumber() } })

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r.toNumber(), point: { x: left.toNumber(), y: bottom.minus(r).toNumber() } })
  }

  commands.push({ type: 'close' })

  return { commands }
}

const calculateLeftTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): PathSchema => {
  const left = new BigNumber(rect.x)
  const top = new BigNumber(rect.y)
  const right = left.plus(rect.width)
  const bottom = top.plus(rect.height)

  const r = new BigNumber(pocketCluster.pocketRadius)

  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const tPocketTabWidth = new BigNumber(pocketCluster.tPocketTabWidth)
  const tPocketTaper = new BigNumber(pocketCluster.tPocketTaper)
  const tabRightX = left.plus(tPocketTabDepth)

  const commands: PathCommand[] = [
    { type: 'moveTo', point: { x: left.plus(r).toNumber(), y: top.toNumber() } },
    { type: 'lineTo', point: { x: tabRightX.toNumber(), y: top.toNumber() } },
    { type: 'lineTo', point: { x: tabRightX.toNumber(), y: top.plus(tPocketTabWidth).toNumber() } },
    { type: 'lineTo', point: { x: right.toNumber(), y: top.plus(tPocketTaper).toNumber() } },
    { type: 'lineTo', point: { x: right.toNumber(), y: bottom.minus(tPocketTaper).toNumber() } },
    { type: 'lineTo', point: { x: tabRightX.toNumber(), y: bottom.minus(tPocketTabWidth).toNumber() } },
    { type: 'lineTo', point: { x: tabRightX.toNumber(), y: bottom.toNumber() } },
    { type: 'lineTo', point: { x: left.plus(r).toNumber(), y: bottom.toNumber() } },
  ]

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r.toNumber(), point: { x: left.toNumber(), y: bottom.minus(r).toNumber() } })
  }

  commands.push({ type: 'lineTo', point: { x: left.toNumber(), y: top.plus(r).toNumber() } })

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r.toNumber(), point: { x: left.plus(r).toNumber(), y: top.toNumber() } })
  }

  commands.push({ type: 'close' })

  return { commands }
}

const calculateRightTPocketPath = (rect: RectSchema, pocketCluster: PocketClusterSchema): PathSchema => {
  const left = new BigNumber(rect.x)
  const top = new BigNumber(rect.y)
  const right = left.plus(rect.width)
  const bottom = top.plus(rect.height)

  const r = new BigNumber(pocketCluster.pocketRadius)

  const tPocketTabDepth = getTPocketTabDepth(pocketCluster, rect)
  const tPocketTabWidth = new BigNumber(pocketCluster.tPocketTabWidth)
  const tPocketTaper = new BigNumber(pocketCluster.tPocketTaper)
  const tabLeftX = right.minus(tPocketTabDepth)

  const commands: PathCommand[] = [
    { type: 'moveTo', point: { x: right.toNumber(), y: top.plus(r).toNumber() } },
    { type: 'lineTo', point: { x: right.toNumber(), y: bottom.minus(r).toNumber() } },
  ]

  if (r.isGreaterThan(ZERO)) {
    commands.push({
      type: 'arcTo',
      radius: r.toNumber(),
      point: { x: right.minus(r).toNumber(), y: bottom.toNumber() },
    })
  }

  commands.push(
    { type: 'lineTo', point: { x: tabLeftX.toNumber(), y: bottom.toNumber() } },
    { type: 'lineTo', point: { x: tabLeftX.toNumber(), y: bottom.minus(tPocketTabWidth).toNumber() } },
    { type: 'lineTo', point: { x: left.toNumber(), y: bottom.minus(tPocketTaper).toNumber() } },
    { type: 'lineTo', point: { x: left.toNumber(), y: top.plus(tPocketTaper).toNumber() } },
    { type: 'lineTo', point: { x: tabLeftX.toNumber(), y: top.plus(tPocketTabWidth).toNumber() } },
    { type: 'lineTo', point: { x: tabLeftX.toNumber(), y: top.toNumber() } },
    { type: 'lineTo', point: { x: right.minus(r).toNumber(), y: top.toNumber() } },
  )

  if (r.isGreaterThan(ZERO)) {
    commands.push({ type: 'arcTo', radius: r.toNumber(), point: { x: right.toNumber(), y: top.plus(r).toNumber() } })
  }

  commands.push({ type: 'close' })

  return { commands }
}

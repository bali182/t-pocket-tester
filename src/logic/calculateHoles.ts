import BigNumber from 'bignumber.js'

import type { ComputedComponentSchema, ComputedHoleSchema } from '../schemas/computed'
import type { RectSchema } from '../schemas/geometry'
import type { HoleAnchorSchema, HoleSchema } from '../schemas/hole'
import { isDefined } from '../utils/isDefined'
import { calculateRectPath } from './calculateRectPath'
import { getNormalizedCornerRadius } from './getNormalizedCornerRadius'

export const calculateHoles = (
  holes: HoleSchema[],
  computedComponents: Record<string, ComputedComponentSchema>,
): ComputedHoleSchema[] => {
  return holes.map((hole) => {
    const ownerComponent = computedComponents[hole.componentId]

    if (!isDefined(ownerComponent)) {
      throw new Error(`Hole owner component not found: ${hole.componentId}`)
    }

    const geometry = calculateHoleGeometry(hole, ownerComponent.boundingRect)

    return {
      holeId: hole.id,
      componentId: hole.componentId,
      ...geometry,
    }
  })
}

const calculateHoleGeometry = (
  hole: HoleSchema,
  ownerBoundingRect: RectSchema,
): Pick<ComputedHoleSchema, 'boundingRect' | 'path'> => {
  const boundingRect = calculateHoleBoundingRect(
    ownerBoundingRect,
    new BigNumber(hole.width),
    new BigNumber(hole.height),
    hole,
  )

  return {
    boundingRect,
    path: calculateRectPath(boundingRect, getNormalizedCornerRadius(hole)),
  }
}
const calculateHoleBoundingRect = (
  ownerBoundingRect: RectSchema,
  width: BigNumber,
  height: BigNumber,
  hole: HoleSchema,
): RectSchema => {
  return {
    x: calculateAnchoredAxisStart(ownerBoundingRect.x, ownerBoundingRect.width, width, hole.xAnchor, hole.xOffset),
    y: calculateAnchoredAxisStart(ownerBoundingRect.y, ownerBoundingRect.height, height, hole.yAnchor, hole.yOffset),
    width,
    height,
  }
}

const calculateAnchoredAxisStart = (
  ownerStart: BigNumber,
  ownerLength: BigNumber,
  holeLength: BigNumber,
  anchor: HoleAnchorSchema,
  offset: number,
): BigNumber => {
  switch (anchor) {
    case 'start':
      return ownerStart.plus(offset)
    case 'middle':
      return ownerStart.plus(ownerLength.dividedBy(2)).plus(offset).minus(holeLength.dividedBy(2))
    case 'end':
      return ownerStart.plus(ownerLength).minus(offset).minus(holeLength)
  }
}

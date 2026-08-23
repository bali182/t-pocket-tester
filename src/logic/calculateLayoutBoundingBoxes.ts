import BigNumber from 'bignumber.js'

import { ZERO } from '../constants/layout'
import type { PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import type { RectSchema } from '../schemas/geometry'
import { clamp } from '../utils/clamp'

type CalculateLayoutBoundingBoxesParams = {
  component: RootPanelSchema | PanelSchema
  children: (PanelSchema | PocketClusterSchema)[]
  computedGap: BigNumber
  boundingRect: RectSchema
}

export const calculateLayoutBoundingBoxes = (
  params: CalculateLayoutBoundingBoxesParams,
): Record<string, RectSchema> => {
  switch (params.component.layoutOrientation) {
    case 'horizontal':
      return calculateHorizontalDefaultBoundingBoxes(params)
    case 'vertical':
      return calculateVerticalDefaultBoundingBoxes(params)
  }
}

const calculateHorizontalDefaultBoundingBoxes = ({
  component,
  children,
  computedGap,
  boundingRect,
}: CalculateLayoutBoundingBoxesParams): Record<string, RectSchema> => {
  const widths = calculateMainAxisSizes(children, boundingRect, component)
  let nextLeft = boundingRect.x
  const boundingBoxes: Record<string, RectSchema> = {}

  for (const child of children) {
    const width = widths[child.id]
    const height = calculateCrossAxisSize(child, boundingRect, component)
    const boundingBox: RectSchema = {
      x: nextLeft,
      y: boundingRect.y,
      width,
      height,
    }

    nextLeft = nextLeft.plus(width).plus(computedGap)

    boundingBoxes[child.id] = boundingBox
  }

  return boundingBoxes
}

const calculateVerticalDefaultBoundingBoxes = ({
  component,
  children,
  computedGap,
  boundingRect,
}: CalculateLayoutBoundingBoxesParams): Record<string, RectSchema> => {
  const heights = calculateMainAxisSizes(children, boundingRect, component)
  let nextTop = boundingRect.y
  const boundingBoxes: Record<string, RectSchema> = {}

  for (const child of children) {
    const width = calculateCrossAxisSize(child, boundingRect, component)
    const height = heights[child.id]
    const boundingBox: RectSchema = {
      x: boundingRect.x,
      y: nextTop,
      width,
      height,
    }

    nextTop = nextTop.plus(height).plus(computedGap)

    boundingBoxes[child.id] = boundingBox
  }

  return boundingBoxes
}

const calculateMainAxisSizes = (
  children: (PanelSchema | PocketClusterSchema)[],
  parentBoundingBox: RectSchema,
  parent: RootPanelSchema | PanelSchema,
): Record<string, BigNumber> => {
  const parentSpace = parent.layoutOrientation === 'horizontal' ? parentBoundingBox.width : parentBoundingBox.height
  const gapSpace = parent.autoLayoutGap
    ? ZERO
    : BigNumber.maximum(new BigNumber(children.length).minus(1), ZERO).times(new BigNumber(parent.layoutGap))
  const availableComponentSpace = BigNumber.maximum(parentSpace.minus(gapSpace), ZERO)
  const sizesById: Record<string, BigNumber> = {}

  for (const child of children) {
    if (isMainAxisAuto(child, parent)) {
      continue
    }

    sizesById[child.id] = clamp(getMainAxisSize(child, parent), ZERO, parentSpace)
  }

  const fixedComponentSpace = Object.values(sizesById).reduce((sum, componentSize) => sum.plus(componentSize), ZERO)
  const autoComponentCount = new BigNumber(children.filter((child) => isMainAxisAuto(child, parent)).length)
  const autoSizeCount = parent.autoLayoutGap
    ? autoComponentCount.plus(BigNumber.maximum(new BigNumber(children.length).minus(1), ZERO))
    : autoComponentCount
  const autoComponentSize = autoSizeCount.isZero()
    ? ZERO
    : BigNumber.maximum(availableComponentSpace.minus(fixedComponentSpace), ZERO).dividedBy(autoSizeCount)

  for (const child of children) {
    if (!isMainAxisAuto(child, parent)) {
      continue
    }

    sizesById[child.id] = autoComponentSize
  }

  return sizesById
}

const calculateCrossAxisSize = (
  child: PanelSchema | PocketClusterSchema,
  parentBoundingBox: RectSchema,
  parent: RootPanelSchema | PanelSchema,
): BigNumber => {
  const parentSpace = parent.layoutOrientation === 'horizontal' ? parentBoundingBox.height : parentBoundingBox.width

  if (isCrossAxisAuto(child, parent)) {
    return parentSpace
  }

  return clamp(getCrossAxisSize(child, parent), ZERO, parentSpace)
}

const isMainAxisAuto = (child: PanelSchema | PocketClusterSchema, parent: RootPanelSchema | PanelSchema): boolean => {
  return parent.layoutOrientation === 'horizontal' ? child.autoWidth : child.autoHeight
}

const getMainAxisSize = (child: PanelSchema | PocketClusterSchema, parent: RootPanelSchema | PanelSchema): number => {
  return parent.layoutOrientation === 'horizontal' ? child.width : child.height
}

const isCrossAxisAuto = (child: PanelSchema | PocketClusterSchema, parent: RootPanelSchema | PanelSchema): boolean => {
  return parent.layoutOrientation === 'horizontal' ? child.autoHeight : child.autoWidth
}

const getCrossAxisSize = (child: PanelSchema | PocketClusterSchema, parent: RootPanelSchema | PanelSchema): number => {
  return parent.layoutOrientation === 'horizontal' ? child.height : child.width
}

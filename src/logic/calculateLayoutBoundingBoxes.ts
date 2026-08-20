import BigNumber from 'bignumber.js'

import { ZERO } from '../constants/layout'
import { getComponentChildren } from '../operations/subProject/utils/getComponentChildren'
import type { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import type { RectSchema } from '../schemas/geometry'
import type { SubProjectSchema } from '../schemas/subProject'
import { clamp } from '../utils/clamp'

type LayoutComponent = RootPanelSchema | PanelSchema
type LayoutChildComponent = PanelSchema | PocketClusterSchema

export const calculateLayoutBoundingBoxes = (
  component: LayoutComponent,
  subProject: SubProjectSchema,
  rect: RectSchema,
): [[LayoutChildComponent, RectSchema][], BigNumber] => {
  const children = getComponentChildren(component, subProject)
  const layoutChildren = assertLayoutChildren(children)
  const computedLayoutGap = calculateMainAxisGap(layoutChildren, rect, component)

  return [calculateChildBoundingBoxes(layoutChildren, rect, component, computedLayoutGap), computedLayoutGap] as const
}

const assertLayoutChildren = (children: ComponentSchema[]): LayoutChildComponent[] => {
  return children.map((child) => {
    if (child.type !== 'panel' && child.type !== 'pocket-cluster') {
      throw new Error(`Unsupported child component type: ${child.type}`)
    }

    return child
  })
}

const calculateChildBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
  gap: BigNumber,
): [LayoutChildComponent, RectSchema][] => {
  switch (parent.layoutOrientation) {
    case 'horizontal':
      return parent.layoutOrder === 'default'
        ? calculateHorizontalDefaultBoundingBoxes(children, parentBoundingBox, parent, gap)
        : calculateHorizontalReverseBoundingBoxes(children, parentBoundingBox, parent, gap)
    case 'vertical':
      return parent.layoutOrder === 'default'
        ? calculateVerticalDefaultBoundingBoxes(children, parentBoundingBox, parent, gap)
        : calculateVerticalReverseBoundingBoxes(children, parentBoundingBox, parent, gap)
  }
}

const calculateHorizontalDefaultBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
  gap: BigNumber,
): [LayoutChildComponent, RectSchema][] => {
  const widths = calculateMainAxisSizes(children, parentBoundingBox, parent)
  let nextLeft = parentBoundingBox.x

  return children.map((child): [LayoutChildComponent, RectSchema] => {
    const width = widths[child.id]
    const height = calculateCrossAxisSize(child, parentBoundingBox, parent)
    const boundingBox: RectSchema = {
      x: nextLeft,
      y: parentBoundingBox.y,
      width,
      height,
    }

    nextLeft = nextLeft.plus(width).plus(gap)

    return [child, boundingBox]
  })
}

const calculateHorizontalReverseBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
  gap: BigNumber,
): [LayoutChildComponent, RectSchema][] => {
  const widths = calculateMainAxisSizes(children, parentBoundingBox, parent)
  let nextRight = parentBoundingBox.x.plus(parentBoundingBox.width)

  return children.map((child): [LayoutChildComponent, RectSchema] => {
    const width = widths[child.id]
    const height = calculateCrossAxisSize(child, parentBoundingBox, parent)
    const left = nextRight.minus(width)
    const boundingBox: RectSchema = {
      x: left,
      y: parentBoundingBox.y,
      width,
      height,
    }

    nextRight = left.minus(gap)

    return [child, boundingBox]
  })
}

const calculateVerticalDefaultBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
  gap: BigNumber,
): [LayoutChildComponent, RectSchema][] => {
  const heights = calculateMainAxisSizes(children, parentBoundingBox, parent)
  let nextTop = parentBoundingBox.y

  return children.map((child): [LayoutChildComponent, RectSchema] => {
    const width = calculateCrossAxisSize(child, parentBoundingBox, parent)
    const height = heights[child.id]
    const boundingBox: RectSchema = {
      x: parentBoundingBox.x,
      y: nextTop,
      width,
      height,
    }

    nextTop = nextTop.plus(height).plus(gap)

    return [child, boundingBox]
  })
}

const calculateVerticalReverseBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
  gap: BigNumber,
): [LayoutChildComponent, RectSchema][] => {
  const heights = calculateMainAxisSizes(children, parentBoundingBox, parent)
  let nextBottom = parentBoundingBox.y.plus(parentBoundingBox.height)

  return children.map((child): [LayoutChildComponent, RectSchema] => {
    const width = calculateCrossAxisSize(child, parentBoundingBox, parent)
    const height = heights[child.id]
    const top = nextBottom.minus(height)
    const boundingBox: RectSchema = {
      x: parentBoundingBox.x,
      y: top,
      width,
      height,
    }

    nextBottom = top.minus(gap)

    return [child, boundingBox]
  })
}

const calculateMainAxisSizes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
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

const calculateMainAxisGap = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
): BigNumber => {
  if (!parent.autoLayoutGap) {
    return new BigNumber(parent.layoutGap)
  }

  const parentSpace = parent.layoutOrientation === 'horizontal' ? parentBoundingBox.width : parentBoundingBox.height
  const fixedComponentSpace = children.reduce((sum, child) => {
    if (isMainAxisAuto(child, parent)) {
      return sum
    }

    return sum.plus(clamp(getMainAxisSize(child, parent), ZERO, parentSpace))
  }, ZERO)
  const autoSizeCount = new BigNumber(children.filter((child) => isMainAxisAuto(child, parent)).length).plus(
    BigNumber.maximum(new BigNumber(children.length).minus(1), ZERO),
  )

  return autoSizeCount.isZero()
    ? ZERO
    : BigNumber.maximum(parentSpace.minus(fixedComponentSpace), ZERO).dividedBy(autoSizeCount)
}

const calculateCrossAxisSize = (
  child: LayoutChildComponent,
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
): BigNumber => {
  const parentSpace = parent.layoutOrientation === 'horizontal' ? parentBoundingBox.height : parentBoundingBox.width

  if (isCrossAxisAuto(child, parent)) {
    return parentSpace
  }

  return clamp(getCrossAxisSize(child, parent), ZERO, parentSpace)
}

const isMainAxisAuto = (child: LayoutChildComponent, parent: LayoutComponent): boolean => {
  return parent.layoutOrientation === 'horizontal' ? child.autoWidth : child.autoHeight
}

const getMainAxisSize = (child: LayoutChildComponent, parent: LayoutComponent): number => {
  return parent.layoutOrientation === 'horizontal' ? child.width : child.height
}

const isCrossAxisAuto = (child: LayoutChildComponent, parent: LayoutComponent): boolean => {
  return parent.layoutOrientation === 'horizontal' ? child.autoHeight : child.autoWidth
}

const getCrossAxisSize = (child: LayoutChildComponent, parent: LayoutComponent): number => {
  return parent.layoutOrientation === 'horizontal' ? child.height : child.width
}

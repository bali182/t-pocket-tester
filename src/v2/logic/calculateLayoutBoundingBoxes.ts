import BigNumber from 'bignumber.js'

import type { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import type { RectSchema } from '../schemas/geometry'
import type { ProjectSchema } from '../schemas/project'
import { clamp } from '../utils/clamp'
import { getComponentChildren } from '../operations/project/utils/getComponentChildren'

type LayoutComponent = RootPanelSchema | PanelSchema
type LayoutChildComponent = PanelSchema | PocketClusterSchema

const ZERO = new BigNumber(0)

export const calculateLayoutBoundingBoxes = (
  component: LayoutComponent,
  project: ProjectSchema,
  rect: RectSchema,
): [LayoutChildComponent, RectSchema][] => {
  const children = getComponentChildren(component, project)
  const layoutChildren = assertLayoutChildren(children)

  return calculateChildBoundingBoxes(layoutChildren, rect, component)
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
): [LayoutChildComponent, RectSchema][] => {
  switch (parent.layoutOrientation) {
    case 'horizontal':
      return parent.layoutOrder === 'default'
        ? calculateHorizontalDefaultBoundingBoxes(children, parentBoundingBox, parent)
        : calculateHorizontalReverseBoundingBoxes(children, parentBoundingBox, parent)
    case 'vertical':
      return parent.layoutOrder === 'default'
        ? calculateVerticalDefaultBoundingBoxes(children, parentBoundingBox, parent)
        : calculateVerticalReverseBoundingBoxes(children, parentBoundingBox, parent)
  }
}

const calculateHorizontalDefaultBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
): [LayoutChildComponent, RectSchema][] => {
  const widths = calculateMainAxisSizes(children, parentBoundingBox, parent)
  const gap = new BigNumber(parent.layoutGap)
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
): [LayoutChildComponent, RectSchema][] => {
  const widths = calculateMainAxisSizes(children, parentBoundingBox, parent)
  const gap = new BigNumber(parent.layoutGap)
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
): [LayoutChildComponent, RectSchema][] => {
  const heights = calculateMainAxisSizes(children, parentBoundingBox, parent)
  const gap = new BigNumber(parent.layoutGap)
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
): [LayoutChildComponent, RectSchema][] => {
  const heights = calculateMainAxisSizes(children, parentBoundingBox, parent)
  const gap = new BigNumber(parent.layoutGap)
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
  const gapSpace = BigNumber.maximum(new BigNumber(children.length).minus(1), ZERO).times(
    new BigNumber(parent.layoutGap),
  )
  const availableComponentSpace = BigNumber.maximum(parentSpace.minus(gapSpace), ZERO)
  const sizesById: Record<string, BigNumber> = {}

  for (const child of children) {
    if (isMainAxisAuto(child, parent)) {
      continue
    }

    sizesById[child.id] = clamp(getMainAxisSize(child, parent), ZERO, parentSpace)
  }

  const fixedComponentSpace = Object.values(sizesById).reduce(
    (sum, componentSize) => sum.plus(componentSize),
    ZERO,
  )
  const autoComponentCount = new BigNumber(children.filter((child) => isMainAxisAuto(child, parent)).length)
  const autoComponentSize = autoComponentCount.isZero()
    ? ZERO
    : BigNumber.maximum(availableComponentSpace.minus(fixedComponentSpace), ZERO).dividedBy(autoComponentCount)

  for (const child of children) {
    if (!isMainAxisAuto(child, parent)) {
      continue
    }

    sizesById[child.id] = autoComponentSize
  }

  return sizesById
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

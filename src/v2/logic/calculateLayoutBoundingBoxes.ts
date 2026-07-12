import type { ComponentSchema, PanelSchema, PocketClusterSchema, RootPanelSchema } from '../schemas/components'
import type { RectSchema } from '../schemas/geometry'
import type { ProjectSchema } from '../schemas/project'
import { clamp } from '../utils/clamp'
import { getChildren } from '../utils/getChildren'

type LayoutComponent = RootPanelSchema | PanelSchema
type LayoutChildComponent = PanelSchema | PocketClusterSchema

export const calculateLayoutBoundingBoxes = (
  component: LayoutComponent,
  project: ProjectSchema,
  rect: RectSchema,
): [LayoutChildComponent, RectSchema][] => {
  const children = getChildren(component, project)
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

    nextLeft += width + parent.layoutGap

    return [child, boundingBox]
  })
}

const calculateHorizontalReverseBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
): [LayoutChildComponent, RectSchema][] => {
  const widths = calculateMainAxisSizes(children, parentBoundingBox, parent)
  let nextRight = parentBoundingBox.x + parentBoundingBox.width

  return children.map((child): [LayoutChildComponent, RectSchema] => {
    const width = widths[child.id]
    const height = calculateCrossAxisSize(child, parentBoundingBox, parent)
    const left = nextRight - width
    const boundingBox: RectSchema = {
      x: left,
      y: parentBoundingBox.y,
      width,
      height,
    }

    nextRight = left - parent.layoutGap

    return [child, boundingBox]
  })
}

const calculateVerticalDefaultBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
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

    nextTop += height + parent.layoutGap

    return [child, boundingBox]
  })
}

const calculateVerticalReverseBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
): [LayoutChildComponent, RectSchema][] => {
  const heights = calculateMainAxisSizes(children, parentBoundingBox, parent)
  let nextBottom = parentBoundingBox.y + parentBoundingBox.height

  return children.map((child): [LayoutChildComponent, RectSchema] => {
    const width = calculateCrossAxisSize(child, parentBoundingBox, parent)
    const height = heights[child.id]
    const top = nextBottom - height
    const boundingBox: RectSchema = {
      x: parentBoundingBox.x,
      y: top,
      width,
      height,
    }

    nextBottom = top - parent.layoutGap

    return [child, boundingBox]
  })
}

const calculateMainAxisSizes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  parent: LayoutComponent,
): Record<string, number> => {
  const parentSpace = parent.layoutOrientation === 'horizontal' ? parentBoundingBox.width : parentBoundingBox.height
  const gapSpace = Math.max(children.length - 1, 0) * parent.layoutGap
  const availableComponentSpace = Math.max(parentSpace - gapSpace, 0)
  const sizesById: Record<string, number> = {}

  for (const child of children) {
    if (isMainAxisAuto(child, parent)) {
      continue
    }

    sizesById[child.id] = clamp(getMainAxisSize(child, parent), 0, parentSpace)
  }

  const fixedComponentSpace = Object.values(sizesById).reduce((sum, componentSize) => sum + componentSize, 0)
  const autoComponentCount = children.filter((child) => isMainAxisAuto(child, parent)).length
  const autoComponentSize =
    autoComponentCount === 0 ? 0 : Math.max(availableComponentSpace - fixedComponentSpace, 0) / autoComponentCount

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
): number => {
  const parentSpace = parent.layoutOrientation === 'horizontal' ? parentBoundingBox.height : parentBoundingBox.width

  if (isCrossAxisAuto(child, parent)) {
    return parentSpace
  }

  return clamp(getCrossAxisSize(child, parent), 0, parentSpace)
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

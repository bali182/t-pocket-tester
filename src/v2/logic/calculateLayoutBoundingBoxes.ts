import type {
  ComponentSchema,
  LayoutSchema,
  PanelSchema,
  PocketClusterSchema,
  RootPanelSchema,
} from '../schemas/components'
import type { FillableSize, RectSchema } from '../schemas/geometry'
import { clamp } from '../utils/clamp'
import { isDefined } from '../utils/isDefined'
import { getChildren } from '../utils/getChildren'

type LayoutComponent = RootPanelSchema | PanelSchema
type LayoutChildComponent = PanelSchema | PocketClusterSchema

export const calculateLayoutBoundingBoxes = (
  component: LayoutComponent,
  components: Record<string, ComponentSchema>,
  rect: RectSchema,
): [LayoutChildComponent, RectSchema][] => {
  const children = getChildren(component, components)
  const layoutChildren = assertLayoutChildren(children)

  return calculateChildBoundingBoxes(layoutChildren, rect, component.layout)
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
  layout: LayoutSchema,
): [LayoutChildComponent, RectSchema][] => {
  switch (layout.orientation) {
    case 'horizontal': {
      switch (layout.order) {
        case 'default':
          return calculateHorizontalDefaultBoundingBoxes(children, parentBoundingBox, layout)
        case 'reverse':
          return calculateHorizontalReverseBoundingBoxes(children, parentBoundingBox, layout)
      }
    }
    case 'vertical': {
      switch (layout.order) {
        case 'default':
          return calculateVerticalDefaultBoundingBoxes(children, parentBoundingBox, layout)
        case 'reverse':
          return calculateVerticalReverseBoundingBoxes(children, parentBoundingBox, layout)
      }
    }
  }
}

const calculateHorizontalDefaultBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  layout: LayoutSchema,
): [LayoutChildComponent, RectSchema][] => {
  const widths = calculateMainAxisSizes(children, parentBoundingBox, layout)
  let nextLeft = parentBoundingBox.x

  return children.map((child): [LayoutChildComponent, RectSchema] => {
    const width = widths[child.id]
    const height = calculateCrossAxisSize(child, parentBoundingBox, layout)
    const boundingBox: RectSchema = {
      x: nextLeft,
      y: parentBoundingBox.y,
      width,
      height,
    }

    nextLeft += width + layout.gap

    return [child, boundingBox]
  })
}

const calculateHorizontalReverseBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  layout: LayoutSchema,
): [LayoutChildComponent, RectSchema][] => {
  const widths = calculateMainAxisSizes(children, parentBoundingBox, layout)
  let nextRight = parentBoundingBox.x + parentBoundingBox.width

  return children.map((child): [LayoutChildComponent, RectSchema] => {
    const width = widths[child.id]
    const height = calculateCrossAxisSize(child, parentBoundingBox, layout)
    const left = nextRight - width
    const boundingBox: RectSchema = {
      x: left,
      y: parentBoundingBox.y,
      width,
      height,
    }

    nextRight = left - layout.gap

    return [child, boundingBox]
  })
}

const calculateVerticalDefaultBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  layout: LayoutSchema,
): [LayoutChildComponent, RectSchema][] => {
  const heights = calculateMainAxisSizes(children, parentBoundingBox, layout)
  let nextTop = parentBoundingBox.y

  return children.map((child): [LayoutChildComponent, RectSchema] => {
    const width = calculateCrossAxisSize(child, parentBoundingBox, layout)
    const height = heights[child.id]
    const boundingBox: RectSchema = {
      x: parentBoundingBox.x,
      y: nextTop,
      width,
      height,
    }

    nextTop += height + layout.gap

    return [child, boundingBox]
  })
}

const calculateVerticalReverseBoundingBoxes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  layout: LayoutSchema,
): [LayoutChildComponent, RectSchema][] => {
  const heights = calculateMainAxisSizes(children, parentBoundingBox, layout)
  let nextBottom = parentBoundingBox.y + parentBoundingBox.height

  return children.map((child): [LayoutChildComponent, RectSchema] => {
    const width = calculateCrossAxisSize(child, parentBoundingBox, layout)
    const height = heights[child.id]
    const top = nextBottom - height
    const boundingBox: RectSchema = {
      x: parentBoundingBox.x,
      y: top,
      width,
      height,
    }

    nextBottom = top - layout.gap

    return [child, boundingBox]
  })
}

const calculateMainAxisSizes = (
  children: LayoutChildComponent[],
  parentBoundingBox: RectSchema,
  layout: LayoutSchema,
): Record<string, number> => {
  // Reserve the parent main-axis space that is actually available to children.
  const parentSpace = layout.orientation === 'horizontal' ? parentBoundingBox.width : parentBoundingBox.height
  const gapSpace = Math.max(children.length - 1, 0) * layout.gap
  const availableComponentSpace = Math.max(parentSpace - gapSpace, 0)
  const sizesById: Record<string, number> = {}

  // Save explicit sizes. Children missing from this record are fill children.
  for (const child of children) {
    const mainAxisSize = getMainAxisSize(child.size, layout)
    if (mainAxisSize !== 'fill') {
      sizesById[child.id] = clamp(mainAxisSize, 0, parentSpace)
    }
  }

  // Split the remaining non-negative space evenly between fill children.
  const fixedComponentSpace = Object.values(sizesById).reduce((sum, componentSize) => sum + componentSize, 0)
  const fillComponentCount = children.filter((child) => !isDefined(sizesById[child.id])).length
  const fillComponentSize =
    fillComponentCount === 0 ? 0 : Math.max(availableComponentSpace - fixedComponentSpace, 0) / fillComponentCount

  for (const child of children) {
    if (getMainAxisSize(child.size, layout) !== 'fill') {
      continue
    }
    sizesById[child.id] = fillComponentSize
  }

  return sizesById
}

const calculateCrossAxisSize = (
  child: LayoutChildComponent,
  parentBoundingBox: RectSchema,
  layout: LayoutSchema,
): number => {
  const parentSpace = layout.orientation === 'horizontal' ? parentBoundingBox.height : parentBoundingBox.width
  const crossAxisSize = getCrossAxisSize(child.size, layout)

  if (crossAxisSize === 'fill') {
    return parentSpace
  }

  return clamp(crossAxisSize, 0, parentSpace)
}

const getMainAxisSize = (size: FillableSize | undefined, layout: LayoutSchema): number | 'fill' => {
  const axisSize = layout.orientation === 'horizontal' ? size?.width : size?.height

  if (!isDefined(axisSize)) {
    return 'fill'
  }

  return axisSize
}

const getCrossAxisSize = (size: FillableSize | undefined, layout: LayoutSchema): number | 'fill' => {
  const axisSize = layout.orientation === 'horizontal' ? size?.height : size?.width

  if (!isDefined(axisSize)) {
    return 'fill'
  }

  return axisSize
}

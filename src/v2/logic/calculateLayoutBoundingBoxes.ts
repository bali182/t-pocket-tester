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
import { getChildren } from './getChildren'

type LayoutComponent = RootPanelSchema | PanelSchema
type LayoutChildComponent = PanelSchema | PocketClusterSchema

export const calculateLayoutBoundingBoxes = (
  component: LayoutComponent,
  components: Record<string, ComponentSchema>,
  rect: RectSchema,
): [LayoutChildComponent, RectSchema][] => {
  const children = getChildren(component, components)

  const layoutChildren = assertLayoutChildren(children)
  const availableComponentSpace = getAvailableComponentSpace(rect, component.layout, layoutChildren.length)
  const fixedComponentSizes = getFixedComponentSizes(layoutChildren, rect, component.layout)
  const componentSizes = shrinkFixedComponentSizesToFit(fixedComponentSizes, availableComponentSpace, component.layout)
  const fillComponentSize = getFillComponentSize(componentSizes, availableComponentSpace)

  return buildChildRects(rect, layoutChildren, componentSizes, fillComponentSize, component.layout)
}

const assertLayoutChildren = (children: ComponentSchema[]): LayoutChildComponent[] => {
  return children.map((child) => {
    if (child.type !== 'panel' && child.type !== 'pocket-cluster') {
      throw new Error(`Unsupported child component type: ${child.type}`)
    }

    return child
  })
}

const getReservedGapSpace = (componentCount: number, gap: number): number => {
  return Math.max(componentCount - 1, 0) * gap
}

const getAvailableComponentSpace = (parentRect: RectSchema, layout: LayoutSchema, componentCount: number): number => {
  const parentSpace = layout.orientation === 'horizontal' ? parentRect.width : parentRect.height
  const reservedGapSpace = getReservedGapSpace(componentCount, layout.gap)

  return Math.max(parentSpace - reservedGapSpace, 0)
}

const getFixedComponentSizes = (
  components: LayoutChildComponent[],
  parentRect: RectSchema,
  layout: LayoutSchema,
): (number | undefined)[] => {
  const parentSpace = layout.orientation === 'horizontal' ? parentRect.width : parentRect.height

  return components.map((component) => {
    const mainAxisSize = getMainAxisSize(component.size, layout)

    if (mainAxisSize === 'fill') {
      return undefined
    }

    return clamp(mainAxisSize, 0, parentSpace)
  })
}

const getFixedComponentSizeSum = (componentSizes: (number | undefined)[]): number => {
  return componentSizes.reduce<number>((sum, componentSize) => sum + (componentSize ?? 0), 0)
}

const shrinkFixedComponentSizesToFit = (
  componentSizes: (number | undefined)[],
  availableComponentSpace: number,
  layout: LayoutSchema,
): (number | undefined)[] => {
  const shrunkComponentSizes = [...componentSizes]
  let overflow = getFixedComponentSizeSum(shrunkComponentSizes) - availableComponentSpace

  for (
    let index = getShrinkStartIndex(shrunkComponentSizes.length, layout);
    isShrinkIndexInRange(index, shrunkComponentSizes.length, layout) && overflow > 0;
    index += getShrinkIndexStep(layout)
  ) {
    const componentSize = shrunkComponentSizes[index]

    if (!isDefined(componentSize)) {
      continue
    }

    const reduction = Math.min(componentSize, overflow)
    shrunkComponentSizes[index] = componentSize - reduction
    overflow -= reduction
  }

  return shrunkComponentSizes
}

const getShrinkStartIndex = (componentCount: number, layout: LayoutSchema): number => {
  return layout.order === 'default' ? componentCount - 1 : 0
}

const isShrinkIndexInRange = (index: number, componentCount: number, layout: LayoutSchema): boolean => {
  return layout.order === 'default' ? index >= 0 : index < componentCount
}

const getShrinkIndexStep = (layout: LayoutSchema): number => {
  return layout.order === 'default' ? -1 : 1
}

const getFillComponentSize = (componentSizes: (number | undefined)[], availableComponentSpace: number): number => {
  const fillComponentCount = componentSizes.filter((componentSize) => !isDefined(componentSize)).length

  if (fillComponentCount === 0) {
    return 0
  }

  const fixedComponentSpace = getFixedComponentSizeSum(componentSizes)
  return Math.max(availableComponentSpace - fixedComponentSpace, 0) / fillComponentCount
}

const getFixedOffDirectionComponentSize = (
  component: LayoutChildComponent,
  parentRect: RectSchema,
  layout: LayoutSchema,
): number => {
  const parentSpace = layout.orientation === 'horizontal' ? parentRect.height : parentRect.width
  const offAxisSize = getOffAxisSize(component.size, layout)

  if (offAxisSize === 'fill') {
    return parentSpace
  }

  return clamp(offAxisSize, 0, parentSpace)
}

const getMainAxisSize = (size: FillableSize | undefined, layout: LayoutSchema): number | 'fill' => {
  const axisSize = layout.orientation === 'horizontal' ? size?.width : size?.height

  if (!isDefined(axisSize)) {
    return 'fill'
  }

  return axisSize
}

const getOffAxisSize = (size: FillableSize | undefined, layout: LayoutSchema): number | 'fill' => {
  const axisSize = layout.orientation === 'horizontal' ? size?.height : size?.width

  if (!isDefined(axisSize)) {
    return 'fill'
  }

  return axisSize
}

const buildChildRects = (
  parentRect: RectSchema,
  components: LayoutChildComponent[],
  componentSizes: (number | undefined)[],
  fillComponentSize: number,
  layout: LayoutSchema,
): [LayoutChildComponent, RectSchema][] => {
  let cursor = getInitialCursor(parentRect, layout)

  return components.map((component, index): [LayoutChildComponent, RectSchema] => {
    const componentSize = componentSizes[index] ?? fillComponentSize
    const offDirectionComponentSize = getFixedOffDirectionComponentSize(component, parentRect, layout)
    const mainAxisStart = getMainAxisStart(cursor, componentSize, layout)
    const rect: RectSchema =
      layout.orientation === 'horizontal'
        ? {
            x: mainAxisStart,
            y: parentRect.y,
            width: componentSize,
            height: offDirectionComponentSize,
          }
        : {
            x: parentRect.x,
            y: mainAxisStart,
            width: offDirectionComponentSize,
            height: componentSize,
          }

    cursor = getNextCursor(cursor, componentSize, layout)

    return [component, rect]
  })
}

const getInitialCursor = (parentRect: RectSchema, layout: LayoutSchema): number => {
  if (layout.orientation === 'horizontal') {
    return layout.order === 'default' ? parentRect.x : parentRect.x + parentRect.width
  }

  return layout.order === 'default' ? parentRect.y : parentRect.y + parentRect.height
}

const getMainAxisStart = (cursor: number, componentSize: number, layout: LayoutSchema): number => {
  return layout.order === 'default' ? cursor : cursor - componentSize
}

const getNextCursor = (cursor: number, componentSize: number, layout: LayoutSchema): number => {
  return layout.order === 'default' ? cursor + componentSize + layout.gap : cursor - componentSize - layout.gap
}

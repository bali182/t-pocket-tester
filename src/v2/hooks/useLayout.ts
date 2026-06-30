import { useMemo } from 'react'

import typia from 'typia'
import type { LayoutSchema, PanelSchema, RootPanelSchema } from '../schemas/components'
import type { RectSchema, SizeSchema } from '../schemas/geometry'
import { clamp } from '../utils/clamp'
import { isDefined } from '../utils/isDefined'
import { useChildren } from './useChildren'

type LayoutComponent = RootPanelSchema | PanelSchema

type UseLayoutParams = {
  rect: RectSchema
  component: LayoutComponent
}

export const useLayout = ({ rect, component }: UseLayoutParams): [PanelSchema, RectSchema][] => {
  const children = useChildren(component.children)

  return useMemo<[PanelSchema, RectSchema][]>(() => {
    const panelChildren = assertPanelChildren(children)
    const availableComponentSpace = getAvailableComponentSpace(rect, component.layout, panelChildren.length)
    const fixedComponentSizes = getFixedComponentSizes(panelChildren, rect, component.layout)
    const componentSizes = shrinkFixedComponentSizesToFit(fixedComponentSizes, availableComponentSpace)
    const fillComponentSize = getFillComponentSize(componentSizes, availableComponentSpace)

    return buildChildRects(rect, panelChildren, componentSizes, fillComponentSize, component.layout)
  }, [children, component.layout.gap, component.layout.orientation, rect.height, rect.width, rect.x, rect.y])
}

const assertPanelChildren = (children: ReturnType<typeof useChildren>): PanelSchema[] => {
  return children.map((child) => {
    if (child.type !== 'panel') {
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
  components: PanelSchema[],
  parentRect: RectSchema,
  layout: LayoutSchema,
): (number | undefined)[] => {
  const parentSpace = layout.orientation === 'horizontal' ? parentRect.width : parentRect.height

  return components.map((component) => {
    if (!isDefined(component.size) || component.size === 'fill') {
      return undefined
    }

    if (typeof component.size === 'number') {
      return clamp(component.size, 0, parentSpace)
    }

    const componentSize = layout.orientation === 'horizontal' ? component.size.width : component.size.height
    return clamp(componentSize, 0, parentSpace)
  })
}

const getFixedComponentSizeSum = (componentSizes: (number | undefined)[]): number => {
  return componentSizes.reduce<number>((sum, componentSize) => sum + (componentSize ?? 0), 0)
}

const shrinkFixedComponentSizesToFit = (
  componentSizes: (number | undefined)[],
  availableComponentSpace: number,
): (number | undefined)[] => {
  const shrunkComponentSizes = [...componentSizes]
  let overflow = getFixedComponentSizeSum(shrunkComponentSizes) - availableComponentSpace

  for (let index = shrunkComponentSizes.length - 1; index >= 0 && overflow > 0; index -= 1) {
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

const getFillComponentSize = (componentSizes: (number | undefined)[], availableComponentSpace: number): number => {
  const fillComponentCount = componentSizes.filter((componentSize) => !isDefined(componentSize)).length

  if (fillComponentCount === 0) {
    return 0
  }

  const fixedComponentSpace = getFixedComponentSizeSum(componentSizes)
  return Math.max(availableComponentSpace - fixedComponentSpace, 0) / fillComponentCount
}

const getFixedOffDirectionComponentSize = (
  component: PanelSchema,
  parentRect: RectSchema,
  layout: LayoutSchema,
): number => {
  const parentSpace = layout.orientation === 'horizontal' ? parentRect.height : parentRect.width

  if (!typia.is<SizeSchema>(component.size)) {
    return parentSpace
  }

  const componentSize = layout.orientation === 'horizontal' ? component.size.height : component.size.width
  return clamp(componentSize, 0, parentSpace)
}

const buildChildRects = (
  parentRect: RectSchema,
  components: PanelSchema[],
  componentSizes: (number | undefined)[],
  fillComponentSize: number,
  layout: LayoutSchema,
): [PanelSchema, RectSchema][] => {
  let cursor = layout.orientation === 'horizontal' ? parentRect.x : parentRect.y

  return components.map((component, index): [PanelSchema, RectSchema] => {
    const componentSize = componentSizes[index] ?? fillComponentSize
    const offDirectionComponentSize = getFixedOffDirectionComponentSize(component, parentRect, layout)
    const rect: RectSchema =
      layout.orientation === 'horizontal'
        ? {
            x: cursor,
            y: parentRect.y,
            width: componentSize,
            height: offDirectionComponentSize,
          }
        : {
            x: parentRect.x,
            y: cursor,
            width: offDirectionComponentSize,
            height: componentSize,
          }

    cursor += componentSize + layout.gap

    return [component, rect]
  })
}

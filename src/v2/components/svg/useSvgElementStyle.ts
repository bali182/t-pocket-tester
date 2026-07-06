import { formatHex8, parse } from 'culori'
import { useMemo } from 'react'
import { SELECTED_STROKE_COLOR, STROKE_COLOR } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { ComponentSchema } from '../../schemas/components'
import { isDefined } from '../../utils/isDefined'

type ElementColors = {
  fill: string
  stroke: string
  filter: string | undefined
}

type UseSvgElementStyleOutput = {
  isSelected: boolean
  element: ElementColors
  child: ElementColors
}

const addAlpha = (color: string): string => {
  const parsed = parse(color)
  if (!isDefined(parsed)) {
    return color
  }
  return formatHex8({ ...parsed, alpha: 0.6 })
}

export const useSvgElementStyle = (component: ComponentSchema, isHovered: boolean): UseSvgElementStyleOutput => {
  const { isInteractive, component: editedComponent } = useDrawAreaContext()

  const normal = useMemo<ElementColors>(
    () => ({
      fill: component.color,
      stroke: STROKE_COLOR,
      filter: undefined,
    }),
    [component],
  )

  const elementSelected = useMemo<ElementColors>(
    () => ({
      fill: component.type === 'root-panel' ? component.color : addAlpha(component.color),
      stroke: SELECTED_STROKE_COLOR,
      filter: `drop-shadow(0px 0px 2px ${SELECTED_STROKE_COLOR})`,
    }),
    [component],
  )

  const childSelected = useMemo<ElementColors>(
    () => ({
      fill: addAlpha(component.color),
      stroke: SELECTED_STROKE_COLOR,
      filter: undefined,
    }),
    [component],
  )
  const isSelected = isInteractive && (component.id === editedComponent?.id || isHovered)

  return {
    isSelected,
    child: isSelected ? childSelected : normal,
    element: isSelected ? elementSelected : normal,
  }
}

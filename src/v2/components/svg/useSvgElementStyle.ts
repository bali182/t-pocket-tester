import { formatHex8, parse } from 'culori'
import { useMemo } from 'react'
import { SELECTED_STROKE_COLOR, STROKE_COLOR } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { ComponentSchema } from '../../schemas/components'
import { isDefined } from '../../utils/isDefined'

type UseSelectedStyleOutput = {
  fill: string
  stroke: string
  filter: string | undefined
}

const addAlpha = (color: string): string => {
  const parsed = parse(color)
  if (!isDefined(parsed)) {
    return color
  }
  return formatHex8({ ...parsed, alpha: 0.6 })
}

export const useSvgElementStyle = (component: ComponentSchema, isHovered: boolean): UseSelectedStyleOutput => {
  const { isInteractive, editedComponent } = useDrawAreaContext()

  const nonSelected = useMemo<UseSelectedStyleOutput>(
    () => ({
      fill: component.color,
      stroke: STROKE_COLOR,
      filter: undefined,
    }),
    [component],
  )

  const selected = useMemo<UseSelectedStyleOutput>(
    () => ({
      fill: component.type === 'root-panel' ? component.color : addAlpha(component.color),
      stroke: SELECTED_STROKE_COLOR,
      filter: `drop-shadow(0px 0px 2px ${SELECTED_STROKE_COLOR})`,
    }),
    [component],
  )

  return isInteractive && (component.id === editedComponent?.component?.id || isHovered) ? selected : nonSelected
}

import { STROKE_THICKNESS, VIEWBOX_PADDING } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useComputedComponent } from '../../hooks/useComputedComponent'
import { useSubProject } from '../../hooks/useSubProject'
import type { ComputedRootPanelSchema } from '../../schemas/computed'
import { getViewBox } from '../../utils/getViewBox'
import { RootPanel } from './RootPanel'

export const SvgRoot = () => {
  const { computedSubProject: computedProject } = useSubProject()
  const computedRootPanel = useComputedComponent<ComputedRootPanelSchema>(computedProject.root)
  const { isInteractive } = useDrawAreaContext()

  const padding = isInteractive ? VIEWBOX_PADDING : STROKE_THICKNESS / 2
  const viewBox = getViewBox(computedRootPanel.boundingRect, padding)
  const svgWidth = computedRootPanel.boundingRect.width.plus(padding * 2)
  const svgHeight = computedRootPanel.boundingRect.height.plus(padding * 2)

  return (
    <svg
      width={`${svgWidth.toString()}mm`}
      height={`${svgHeight.toString()}mm`}
      style={{ display: 'block' }}
      viewBox={viewBox}
    >
      <RootPanel componentId={computedProject.root} nestingLevel={0} />
    </svg>
  )
}

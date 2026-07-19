import { useAtomValue } from 'jotai'

import { STROKE_THICKNESS, VIEWBOX_PADDING } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useComponent } from '../../hooks/useComponent'
import { useComputedComponent } from '../../hooks/useComputedComponent'
import type { RootPanelSchema } from '../../schemas/components'
import type { ComputedRootPanelSchema } from '../../schemas/computed'
import { computedProjectAtom } from '../../state/projectAtom'
import { getViewBox } from '../../utils/getViewBox'
import { RootPanel } from './RootPanel'

export const SvgRoot = () => {
  const computedProject = useAtomValue(computedProjectAtom)
  const rootComponent = useComponent<RootPanelSchema>(computedProject.root)
  const computedRootPanel = useComputedComponent<ComputedRootPanelSchema>(computedProject.root)
  const { isInteractive } = useDrawAreaContext()

  const viewBox = getViewBox(computedRootPanel.boundingRect, isInteractive ? VIEWBOX_PADDING : STROKE_THICKNESS / 2)

  return (
    <svg
      width={`${rootComponent.width}mm`}
      height={`${rootComponent.height}mm`}
      style={{ display: 'block' }}
      viewBox={viewBox}
    >
      <RootPanel componentId={computedProject.root} />
    </svg>
  )
}

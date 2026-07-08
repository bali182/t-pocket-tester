import { makeStyles } from '@fluentui/react-components'
import { useAtomValue } from 'jotai'

import { STROKE_THICKNESS, VIEWBOX_PADDING } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { useComponent } from '../../hooks/useComponent'
import { useComputedComponent } from '../../hooks/useComputedComponent'
import type { RootPanelSchema } from '../../schemas/components'
import type { ComputedRootPanelSchema } from '../../schemas/computed2'
import { computedProjectAtom } from '../../state'
import { getViewBox } from '../../utils/getViewBox'
import { RootPanel } from './RootPanel'

const useStyles = makeStyles({
  svg: {
    display: 'block',
  },
})

export const SvgRoot = () => {
  const styles = useStyles()
  const computedProject = useAtomValue(computedProjectAtom)
  const rootComponent = useComponent<RootPanelSchema>(computedProject.root)
  const computedRootPanel = useComputedComponent<ComputedRootPanelSchema>(computedProject.root)
  const { isInteractive } = useDrawAreaContext()

  const viewBox = getViewBox(computedRootPanel.boundingRect, isInteractive ? VIEWBOX_PADDING : STROKE_THICKNESS / 2)

  return (
    <svg
      className={styles.svg}
      width={`${rootComponent.size.width}mm`}
      height={`${rootComponent.size.height}mm`}
      viewBox={viewBox}
    >
      <RootPanel componentId={computedProject.root} />
    </svg>
  )
}

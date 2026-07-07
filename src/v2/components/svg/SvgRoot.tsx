import { makeStyles } from '@fluentui/react-components'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { STROKE_THICKNESS, VIEWBOX_PADDING } from '../../constants/drawing'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { projectAtom } from '../../state'
import { getViewBox } from '../../utils/getViewBox'
import { isDefined } from '../../utils/isDefined'
import { RootPanel } from './RootPanel'

const useStyles = makeStyles({
  svg: {
    display: 'block',
  },
})

export const SvgRoot = () => {
  const styles = useStyles()
  const project = useAtomValue(projectAtom)
  const rootComponent = project.components[project.root]
  const { isInteractive } = useDrawAreaContext()

  const viewBox = useMemo((): string | undefined => {
    if (!isDefined(rootComponent) || rootComponent.type !== 'root-panel') {
      return undefined
    }
    return getViewBox(
      {
        x: 0,
        y: 0,
        width: rootComponent.size.width,
        height: rootComponent.size.height,
      },
      isInteractive ? VIEWBOX_PADDING : STROKE_THICKNESS / 2,
    )
  }, [isInteractive, rootComponent])

  if (!isDefined(rootComponent) || rootComponent.type !== 'root-panel') {
    return undefined
  }

  return (
    <svg
      className={styles.svg}
      width={`${rootComponent.size.width}mm`}
      height={`${rootComponent.size.height}mm`}
      viewBox={viewBox}
    >
      <RootPanel rootPanel={rootComponent} />
    </svg>
  )
}

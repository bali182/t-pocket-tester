import { makeStyles, tokens } from '@fluentui/react-components'
import { useAtomValue } from 'jotai'
import { useMemo, type FC } from 'react'

import { STROKE_THICKNESS } from '../constants/drawing'
import { componentsAtom, rootComponentIdAtom } from '../state'
import { getViewBox } from '../utils/getViewBox'
import { RootPanel } from './svg/RootPanel'

const useStyles = makeStyles({
  viewport: {
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground2,
    boxSizing: 'border-box',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    overflow: 'auto',
    width: '100%',
  },
  svg: {
    display: 'block',
  },
})

export const DrawArea: FC = () => {
  const styles = useStyles()
  const components = useAtomValue(componentsAtom)
  const rootComponentId = useAtomValue(rootComponentIdAtom)
  const rootComponent = components[rootComponentId]

  const viewBox = useMemo((): string => {
    if (!rootComponent || rootComponent.type !== 'root-panel') {
      throw new Error(`Root must be of type "root-panel"`)
    }
    return getViewBox(STROKE_THICKNESS, {
      x: 0,
      y: 0,
      width: rootComponent.size.width,
      height: rootComponent.size.height,
    })
  }, [rootComponent])

  if (!rootComponent || rootComponent.type !== 'root-panel') {
    throw new Error(`Root must be of type "root-panel"`)
  }

  return (
    <div className={styles.viewport}>
      <svg
        className={styles.svg}
        width={`${rootComponent.size.width}mm`}
        height={`${rootComponent.size.height}mm`}
        viewBox={viewBox}
      >
        <RootPanel rootPanel={rootComponent} />
      </svg>
    </div>
  )
}

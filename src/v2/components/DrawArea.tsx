import { makeStyles } from '@fluentui/react-components'
import { useAtomValue } from 'jotai'
import type { FC } from 'react'

import { componentsAtom, rootComponentIdAtom } from '../state'
import { RootPanel } from './svg/RootPanel'

const useStyles = makeStyles({
  viewport: {
    boxSizing: 'border-box',
    height: '100%',
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

  if (!rootComponent || rootComponent.type !== 'root-panel') {
    return null
  }

  return (
    <div className={styles.viewport}>
      <svg
        className={styles.svg}
        width={`${rootComponent.size.width}mm`}
        height={`${rootComponent.size.height}mm`}
        viewBox={`0 0 ${rootComponent.size.width} ${rootComponent.size.height}`}
      >
        <RootPanel rootPanel={rootComponent} />
      </svg>
    </div>
  )
}

import { makeStyles } from '@fluentui/react-components'
import { useAtomValue } from 'jotai'
import { useMemo, useState, type FC } from 'react'

import { DrawAreaContext, type DrawAreaContextValue } from '../contexts/DrawAreaContext'
import type { ComponentSchema } from '../schemas/components'
import { componentsAtom, rootComponentIdAtom } from '../state'
import { setOpacity } from '../utils/setOpacity'
import { FloatingEditor } from './editors/FloatingEditor'
import { RootPanel } from './svg/RootPanel'

const useStyles = makeStyles({
  viewport: {
    height: '100%',
    overflow: 'auto',
    width: '100%',
  },
})

type ComponentHoverCardTarget = {
  component: ComponentSchema
  element: SVGGraphicsElement
}

export const DrawArea: FC = () => {
  const styles = useStyles()
  const components = useAtomValue(componentsAtom)
  const rootComponentId = useAtomValue(rootComponentIdAtom)
  const rootComponent = components[rootComponentId]
  const [componentHoverCardTarget, setComponentHoverCardTarget] = useState<ComponentHoverCardTarget | undefined>()
  const drawAreaContextValue = useMemo<DrawAreaContextValue>(
    () => ({
      isInteractive: true,
      onComponentClick: (component, element) => {
        setComponentHoverCardTarget({
          component,
          element,
        })
      },
      getHoverBackgroundColor: (component) => setOpacity(component.color, 0.3),
    }),
    [],
  )

  if (!rootComponent || rootComponent.type !== 'root-panel') {
    return null
  }

  return (
    <DrawAreaContext.Provider value={drawAreaContextValue}>
      <div className={styles.viewport}>
        <svg
          width={`${rootComponent.size.width}mm`}
          height={`${rootComponent.size.height}mm`}
          viewBox={`0 0 ${rootComponent.size.width} ${rootComponent.size.height}`}
        >
          <RootPanel rootPanel={rootComponent} />
        </svg>

        {componentHoverCardTarget && (
          <FloatingEditor
            component={componentHoverCardTarget.component}
            anchorElement={componentHoverCardTarget.element}
            onClose={() => setComponentHoverCardTarget(undefined)}
          />
        )}
      </div>
    </DrawAreaContext.Provider>
  )
}

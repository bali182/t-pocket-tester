import { Box } from '@chakra-ui/react'
import { useAtomValue } from 'jotai'
import { useMemo, useState, type FC } from 'react'

import { DrawAreaContext, type DrawAreaContextValue } from '../contexts/DrawAreaContext'
import type { ComponentSchema } from '../schemas/components'
import { componentsAtom, rootComponentIdAtom } from '../state'
import { setOpacity } from '../utils/setOpacity'
import { RootPanel } from './svg/RootPanel'

type ComponentHoverCardTarget = {
  component: ComponentSchema
  element: SVGGraphicsElement
}

export const DrawArea: FC = () => {
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
      <Box height="100%" overflow="auto" width="100%">
        <svg
          width={`${rootComponent.size.width}mm`}
          height={`${rootComponent.size.height}mm`}
          viewBox={`0 0 ${rootComponent.size.width} ${rootComponent.size.height}`}
        >
          <RootPanel rootPanel={rootComponent} />
        </svg>

        {componentHoverCardTarget && <>TODO render item hovering and pointing at the selected SVG child</>}
      </Box>
    </DrawAreaContext.Provider>
  )
}

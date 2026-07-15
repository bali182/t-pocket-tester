import { Box } from '@chakra-ui/react'
import { useCallback, useMemo, useState, type FC } from 'react'

import { useAtomValue } from 'jotai'
import { DrawAreaContext, type DrawAreaContextValue } from '../contexts/DrawAreaContext'
import type { ComponentSchema } from '../schemas/components'
import { projectAtom } from '../state'
import { isDefined } from '../utils/isDefined'
import { ComponentTree } from './ComponentTree'
import { DrawArea } from './DrawArea'
import { FloatingEditor } from './editors/FloatingEditor'

export const Editor: FC = () => {
  const [componentId, setComponentId] = useState<string | undefined>()
  const [element, setElement] = useState<SVGGraphicsElement | undefined>()
  const project = useAtomValue(projectAtom)
  const component = isDefined(componentId) ? project.components[componentId] : undefined

  const handleComponentClick = useCallback((component: ComponentSchema, element: SVGGraphicsElement): void => {
    setComponentId(component.id)
    setElement(element)
  }, [])

  const handleFloatingEditorClose = useCallback((): void => {
    setComponentId(undefined)
    setElement(undefined)
  }, [])

  const drawAreaContextValue = useMemo<DrawAreaContextValue>(
    () => ({
      isInteractive: true,
      component,
      element,
      onComponentClick: handleComponentClick,
    }),
    [component, element, handleComponentClick],
  )

  return (
    <DrawAreaContext.Provider value={drawAreaContextValue}>
      <Box display="flex" height="100%" overflow="hidden">
        <Box
          flex="1"
          minHeight="0"
          minWidth="0"
          onClick={handleFloatingEditorClose}
          overflow="hidden"
          position="relative"
        >
          <DrawArea />

          {isDefined(component) && isDefined(element) && (
            <FloatingEditor component={component} anchorElement={element} onClose={handleFloatingEditorClose} />
          )}
        </Box>
        <Box flexShrink={0} height="100%" overflow="auto" padding="4" width="400px">
          <ComponentTree selectedComponentId={componentId} />
        </Box>
      </Box>
    </DrawAreaContext.Provider>
  )
}

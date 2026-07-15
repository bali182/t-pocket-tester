import { Box, Heading, Splitter, SplitterPanelData, SplitterResizeDetails } from '@chakra-ui/react'
import { useCallback, useMemo, useState, type FC } from 'react'

import { useAtomValue } from 'jotai'
import { DrawAreaContext, type DrawAreaContextValue } from '../contexts/DrawAreaContext'
import type { ComponentSchema } from '../schemas/components'
import { projectAtom } from '../state'
import { isDefined } from '../utils/isDefined'
import { ComponentTree } from './ComponentTree'
import { DrawArea } from './DrawArea'
import { StitchLineTree } from './StitchLineTree'
import { FloatingEditor } from './editors/FloatingEditor'

const panels: SplitterPanelData[] = [{ id: 'component' }, { id: 'stitching' }]

export const Editor: FC = () => {
  const [componentId, setComponentId] = useState<string | undefined>()
  const [element, setElement] = useState<SVGGraphicsElement | undefined>()
  const [sidebarPanelSizes, setSidebarPanelSizes] = useState([50, 50])
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

  const handlePanelResize = useCallback((details: SplitterResizeDetails) => {
    setSidebarPanelSizes(details.size)
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
        <Box bg="bg.panel" flexShrink={0} height="100%" width="400px">
          <Splitter.Root
            height="100%"
            onResize={handlePanelResize}
            orientation="vertical"
            panels={panels}
            size={sidebarPanelSizes}
            width="100%"
          >
            <Splitter.Panel display="flex" flexDirection="column" id="component" minHeight="0">
              <Heading px="4" py="3" size="sm">
                Bőr
              </Heading>
              <Box flex="1" minHeight="0" overflow="auto" padding="4">
                <ComponentTree selectedComponentId={componentId} />
              </Box>
            </Splitter.Panel>

            <Splitter.ResizeTrigger id="component:stitching">
              <Splitter.ResizeTriggerSeparator />
              <Splitter.ResizeTriggerIndicator />
            </Splitter.ResizeTrigger>

            <Splitter.Panel display="flex" flexDirection="column" id="stitching" minHeight="0">
              <Heading px="4" py="3" size="sm">
                Varrás
              </Heading>
              <Box flex="1" minHeight="0" overflow="auto" padding="4">
                <StitchLineTree />
              </Box>
            </Splitter.Panel>
          </Splitter.Root>
        </Box>
      </Box>
    </DrawAreaContext.Provider>
  )
}

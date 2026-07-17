import { Box, Button, Heading, HStack, Splitter, SplitterPanelData, SplitterResizeDetails } from '@chakra-ui/react'
import { useCallback, useMemo, useState, type FC } from 'react'

import { useAtomValue } from 'jotai'
import { PiPlus } from 'react-icons/pi'
import { DrawAreaContext, type DrawAreaContextValue } from '../contexts/DrawAreaContext'
import type { ComponentSchema } from '../schemas/components'
import { EditorSelectionSchema } from '../schemas/selection'
import type { StitchLineSchema } from '../schemas/stitching'
import { projectAtom } from '../state'
import { getComponentSvgElement } from '../utils/getComponentSvgElement'
import { isDefined } from '../utils/isDefined'
import { AddStitchLineMenu } from './AddStitchLineMenu'
import { ComponentFloatingEditor } from './component-editors/ComponentFloatingEditor'
import { ComponentTree } from './ComponentTree'
import { DrawArea } from './DrawArea'
import { StitchLineFloatingEditor } from './stitch-line-editors/StitchLineFloatingEditor'
import { StitchLineTree } from './StitchLineTree'

const panels: SplitterPanelData[] = [{ id: 'component' }, { id: 'stitching' }]

export const Editor: FC = () => {
  const [sidebarPanelSizes, setSidebarPanelSizes] = useState([50, 50])
  const [selection, setSelection] = useState<EditorSelectionSchema | undefined>()
  const project = useAtomValue(projectAtom)

  const selectComponent = useCallback((componentId: string): void => {
    setSelection({ componentId, type: 'component' })
  }, [])

  const selectStitchLine = useCallback((stitchLineId: string): void => {
    setSelection({ stitchLineId, type: 'stitch-line' })
  }, [])

  const clearSelection = useCallback((): void => {
    setSelection(undefined)
  }, [])

  const handlePanelResize = useCallback((details: SplitterResizeDetails) => {
    setSidebarPanelSizes(details.size)
  }, [])

  const selectedComponent = useMemo<ComponentSchema | undefined>(() => {
    if (!isDefined(selection) || selection.type !== 'component') {
      return undefined
    }

    return project.components[selection.componentId]
  }, [project.components, selection])

  const selectedStitchLine = useMemo<StitchLineSchema | undefined>(() => {
    if (!isDefined(selection) || selection.type !== 'stitch-line') {
      return undefined
    }

    return project.stitchLines.find((stitchLine) => stitchLine.id === selection.stitchLineId)
  }, [project.stitchLines, selection])

  const highlightedComponentId = useMemo<string | undefined>(() => {
    if (isDefined(selectedComponent)) {
      return selectedComponent.id
    }

    if (isDefined(selectedStitchLine)) {
      return selectedStitchLine.componentId
    }

    return undefined
  }, [selectedComponent, selectedStitchLine])

  const anchorElement = useMemo<SVGGraphicsElement | undefined>(() => {
    if (!isDefined(highlightedComponentId)) {
      return undefined
    }

    return getComponentSvgElement(highlightedComponentId)
  }, [highlightedComponentId])

  const selectedComponentId = useMemo<string | undefined>(() => {
    if (!isDefined(selection) || selection.type !== 'component') {
      return undefined
    }

    return selection.componentId
  }, [selection])

  const selectedStitchLineId = useMemo<string | undefined>(() => {
    if (!isDefined(selection) || selection.type !== 'stitch-line') {
      return undefined
    }

    return selection.stitchLineId
  }, [selection])

  const isComponentSelected = useCallback(
    (componentId: string): boolean => componentId === highlightedComponentId,
    [highlightedComponentId],
  )

  const drawAreaContextValue = useMemo<DrawAreaContextValue>(
    () => ({
      clearSelection,
      isComponentSelected,
      isInteractive: true,
      selectComponent,
      selectStitchLine,
    }),
    [clearSelection, isComponentSelected, selectComponent, selectStitchLine],
  )

  return (
    <DrawAreaContext.Provider value={drawAreaContextValue}>
      <Box display="flex" height="100%" overflow="hidden">
        <Box flex="1" minHeight="0" minWidth="0" onClick={clearSelection} overflow="hidden" position="relative">
          <DrawArea />

          {isDefined(selectedComponent) && isDefined(anchorElement) && (
            <ComponentFloatingEditor
              component={selectedComponent}
              anchorElement={anchorElement}
              onClose={clearSelection}
            />
          )}
          {isDefined(selectedStitchLine) && isDefined(anchorElement) && (
            <StitchLineFloatingEditor
              stitchLine={selectedStitchLine}
              anchorElement={anchorElement}
              onClose={clearSelection}
            />
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
                <ComponentTree selectedComponentId={selectedComponentId} />
              </Box>
            </Splitter.Panel>

            <Splitter.ResizeTrigger id="component:stitching">
              <Splitter.ResizeTriggerSeparator />
              <Splitter.ResizeTriggerIndicator />
            </Splitter.ResizeTrigger>

            <Splitter.Panel display="flex" flexDirection="column" id="stitching" minHeight="0">
              <HStack justify="space-between" px="4" py="3">
                <Heading size="sm">Varrás</Heading>
                <AddStitchLineMenu
                  trigger={
                    <Button size="2xs" variant="subtle">
                      <PiPlus />
                      Új varrás
                    </Button>
                  }
                />
              </HStack>
              <Box flex="1" minHeight="0" overflow="auto" padding="4">
                <StitchLineTree selectedStitchLineId={selectedStitchLineId} />
              </Box>
            </Splitter.Panel>
          </Splitter.Root>
        </Box>
      </Box>
    </DrawAreaContext.Provider>
  )
}

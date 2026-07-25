import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  IconButton,
  Splitter,
  SplitterPanelData,
  SplitterResizeDetails,
} from '@chakra-ui/react'
import { useCallback, useMemo, useState, type FC } from 'react'

import { PiArrowsDownUp, PiCaretLeft, PiCheck, PiGear, PiRuler } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import { DrawAreaContext } from '../contexts/DrawAreaContext'
import { useEditorDrawArea } from '../hooks/useEditorDrawArea'
import { useProject } from '../hooks/useProject'
import { useTranslation } from '../translations/translation'
import { getComponentSvgElement } from '../utils/getComponentSvgElement'
import { isDefined } from '../utils/isDefined'
import { ComponentFloatingEditor } from './component-editors/ComponentFloatingEditor'
import { ComponentTree } from './ComponentTree'
import { DrawArea } from './DrawArea'
import { ProjectSettingsPopover } from './ProjectSettingsPopover'
import { ScalingDialog } from './ScalingDialog'
import { StitchLineFloatingEditor } from './stitch-line-editors/StitchLineFloatingEditor'
import { StitchLineTree } from './StitchLineTree'

const panels: SplitterPanelData[] = [{ id: 'component' }, { id: 'stitching' }]

export const Editor: FC = () => {
  const t = useTranslation()
  const [sidebarPanelSizes, setSidebarPanelSizes] = useState([50, 50])
  const [isComponentTreeInReorderMode, setComponentTreeInReorderMode] = useState<boolean>(false)
  const [isScalingDialogOpen, setScalingDialogOpen] = useState<boolean>(false)
  const { project } = useProject()
  const drawAreaContextValue = useEditorDrawArea()
  const { highlightedComponentId, clearSelection, selectedComponent, selectedStitchLine } =
    drawAreaContextValue.selection

  const handlePanelResize = useCallback((details: SplitterResizeDetails) => {
    setSidebarPanelSizes(details.size)
  }, [])

  const handleToggleReorder = useCallback(() => {
    clearSelection()
    setComponentTreeInReorderMode((isInReorderMode) => !isInReorderMode)
  }, [clearSelection])

  const handleScalingButtonClick = useCallback(() => setScalingDialogOpen(true), [])

  const anchorElement = useMemo<SVGGraphicsElement | undefined>(() => {
    if (!isDefined(highlightedComponentId)) {
      return undefined
    }

    return getComponentSvgElement(highlightedComponentId)
  }, [highlightedComponentId])

  return (
    <DrawAreaContext.Provider value={drawAreaContextValue}>
      <Box display="flex" height="100%" overflow="hidden">
        <Box flex="1" minHeight="0" minWidth="0" onClick={clearSelection} overflow="hidden" position="relative">
          {/* Project menu (top left) */}
          <Card.Root position="absolute" left="2" top="2">
            <Card.Body padding="2" flexDirection="row" alignItems="center" gap="3">
              <Link to={`/projects`}>
                <IconButton size="sm" variant="ghost">
                  <PiCaretLeft />
                </IconButton>
              </Link>
              {project.name}
              <ProjectSettingsPopover
                trigger={
                  <IconButton size="sm" variant="ghost">
                    <PiGear />
                  </IconButton>
                }
              />
            </Card.Body>
          </Card.Root>
          <DrawArea />
          {/* Global menu (bottom left) */}
          <Card.Root position="absolute" left="2" bottom="2">
            <Card.Body padding="2" flexDirection="row" alignItems="center" gap="2">
              <IconButton size="xs" variant="ghost" px="2" onClick={handleScalingButtonClick}>
                <PiRuler />
                {t.common.actions.scaling}
              </IconButton>
            </Card.Body>
          </Card.Root>
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
          <ScalingDialog isOpen={isScalingDialogOpen} onOpenChange={setScalingDialogOpen} />
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
              <HStack justify="space-between" px="4" py="3">
                <Heading size="sm">{t.editor.panels.leather}</Heading>
                <Button
                  size="2xs"
                  variant={isComponentTreeInReorderMode ? 'solid' : 'subtle'}
                  onClick={handleToggleReorder}
                >
                  {isComponentTreeInReorderMode ? <PiCheck /> : <PiArrowsDownUp />}
                  {isComponentTreeInReorderMode ? t.common.reorder.finishReorder : t.common.reorder.reorder}
                </Button>
              </HStack>
              <Box flex="1" minHeight="0" overflow="auto" padding="4">
                <ComponentTree
                  selectedComponentId={selectedComponent?.id}
                  isInReorderMode={isComponentTreeInReorderMode}
                />
              </Box>
            </Splitter.Panel>

            <Splitter.ResizeTrigger id="component:stitching">
              <Splitter.ResizeTriggerSeparator />
              <Splitter.ResizeTriggerIndicator />
            </Splitter.ResizeTrigger>

            <Splitter.Panel display="flex" flexDirection="column" id="stitching" minHeight="0">
              <HStack justify="space-between" px="4" py="3">
                <Heading size="sm">{t.editor.panels.stitching}</Heading>
              </HStack>
              <Box flex="1" minHeight="0" overflow="auto" padding="4">
                <StitchLineTree selectedStitchLineId={selectedStitchLine?.id} />
              </Box>
            </Splitter.Panel>
          </Splitter.Root>
        </Box>
      </Box>
    </DrawAreaContext.Provider>
  )
}

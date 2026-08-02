import { Box, Card, Heading, HStack, IconButton, Splitter, SplitterPanelData } from '@chakra-ui/react'
import { useCallback, useMemo, useRef, useState, type FC } from 'react'

import { PiCaretLeft, PiExport, PiGear, PiRuler } from 'react-icons/pi'
import { Link } from 'react-router'
import { DrawAreaContext } from '../contexts/DrawAreaContext'
import { useEditorDrawArea } from '../hooks/useEditorDrawArea'
import { useProject } from '../hooks/useProject'
import { useTranslation } from '../translations/translation'
import { isDefined } from '../utils/isDefined'
import {
  getComponentFloatingAchor as getComponentFloatingAnchor,
  getHoleFloatingAnchor,
  getStitchLineFloatingAnchor,
} from '../utils/svgElementUtils'
import { ComponentFloatingEditor } from './component-editors/ComponentFloatingEditor'
import { DrawArea } from './DrawArea'
import { HoleFloatingEditor } from './hole-editors/HoleFloatingEditor'
import { ProjectSettingsPopover } from './ProjectSettingsPopover'
import { ScalingDialog } from './ScalingDialog'
import { StitchLineFloatingEditor } from './stitch-line-editors/StitchLineFloatingEditor'
import { SvgExportDialog } from './SvgExportDialog'
import { ComponentTree } from './tree/ComponentTree'

const panels: SplitterPanelData[] = [{ id: 'draw-area' }, { id: 'tree' }]
const defaultPanelSizes: string[] = ['auto', '350px']

export const Editor: FC = () => {
  const t = useTranslation()
  const { project } = useProject()
  const [isScalingDialogOpen, setScalingDialogOpen] = useState<boolean>(false)
  const [isSvgExportDialogOpen, setSvgExportDialogOpen] = useState<boolean>(false)
  const projectMenuRef = useRef<HTMLDivElement>(null)
  const drawAreaContextValue = useEditorDrawArea()
  const { clearSelection, selectedComponent, selectedHole, selectedStitchLine } = drawAreaContextValue.selection

  const handleScalingButtonClick = useCallback(() => setScalingDialogOpen(true), [])

  const handleExportClick = useCallback(() => setSvgExportDialogOpen(true), [])

  const componentAnchorElement = useMemo(() => {
    return isDefined(selectedComponent) ? getComponentFloatingAnchor(selectedComponent.id) : undefined
  }, [selectedComponent])

  const stitchLineAnchorElement = useMemo(() => {
    return isDefined(selectedStitchLine) ? getStitchLineFloatingAnchor(selectedStitchLine.id) : undefined
  }, [selectedStitchLine])

  const holeAnchorElement = useMemo(() => {
    return isDefined(selectedHole) ? getHoleFloatingAnchor(selectedHole.id) : undefined
  }, [selectedHole])

  return (
    <DrawAreaContext.Provider value={drawAreaContextValue}>
      <Splitter.Root defaultSize={defaultPanelSizes} orientation="horizontal" panels={panels}>
        <Splitter.Panel id="draw-area">
          <Box height="100%" minHeight="0" minWidth="0" onClick={clearSelection} overflow="hidden" position="relative">
            {/* Project menu (top left) */}
            <Card.Root ref={projectMenuRef} position="absolute" left="2" top="2">
              <Card.Body padding="2" flexDirection="row" alignItems="center" gap="3">
                <Link to={`/projects`}>
                  <IconButton size="sm" variant="ghost">
                    <PiCaretLeft />
                  </IconButton>
                </Link>
                {project.name}
                <ProjectSettingsPopover
                  anchorRef={projectMenuRef}
                  trigger={
                    <IconButton size="sm" variant="ghost">
                      <PiGear />
                    </IconButton>
                  }
                />
                <IconButton size="sm" variant="ghost" onClick={handleExportClick}>
                  <PiExport />
                </IconButton>
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
            {isDefined(selectedComponent) && isDefined(componentAnchorElement) && (
              <ComponentFloatingEditor
                component={selectedComponent}
                anchorElement={componentAnchorElement}
                onClose={clearSelection}
              />
            )}
            {isDefined(selectedStitchLine) && isDefined(stitchLineAnchorElement) && (
              <StitchLineFloatingEditor
                stitchLine={selectedStitchLine}
                anchorElement={stitchLineAnchorElement}
                onClose={clearSelection}
              />
            )}
            {isDefined(selectedHole) && isDefined(holeAnchorElement) && (
              <HoleFloatingEditor hole={selectedHole} anchorElement={holeAnchorElement} onClose={clearSelection} />
            )}
            <ScalingDialog isOpen={isScalingDialogOpen} onOpenChange={setScalingDialogOpen} />
            <SvgExportDialog isOpen={isSvgExportDialogOpen} onOpenChange={setSvgExportDialogOpen} />
          </Box>
        </Splitter.Panel>
        <Splitter.ResizeTrigger id="draw-area:tree" />
        <Splitter.Panel id="tree">
          <Box bg="bg.panel" height="100%">
            <HStack justify="space-between" px="4" py="3">
              <Heading size="sm">{t.editor.panels.leather}</Heading>
            </HStack>
            <Box flex="1" minHeight="0" overflow="auto" padding="4">
              <ComponentTree />
            </Box>
          </Box>
        </Splitter.Panel>
      </Splitter.Root>
    </DrawAreaContext.Provider>
  )
}

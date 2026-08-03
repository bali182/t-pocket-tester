import { Box, Card, Heading, Splitter, SplitterPanelData } from '@chakra-ui/react'
import { useMemo, type FC } from 'react'

import { DrawAreaContext } from '../contexts/DrawAreaContext'
import { useEditorDrawArea } from '../hooks/useEditorDrawArea'
import { useTranslation } from '../translations/translation'
import { isDefined } from '../utils/isDefined'
import {
  getComponentFloatingAchor as getComponentFloatingAnchor,
  getHoleFloatingAnchor,
  getStitchLineFloatingAnchor,
} from '../utils/svgElementUtils'
import { ComponentFloatingEditor } from './component-editors/ComponentFloatingEditor'
import { DrawArea } from './DrawArea'
import { EditorMenu } from './EditorMenu'
import { HoleFloatingEditor } from './hole-editors/HoleFloatingEditor'
import { StitchLineFloatingEditor } from './stitch-line-editors/StitchLineFloatingEditor'
import { ComponentTree } from './tree/ComponentTree'

const panels: SplitterPanelData[] = [{ id: 'draw-area' }, { id: 'tree' }]
const defaultPanelSizes: string[] = ['auto', '350px']

export const Editor: FC = () => {
  const t = useTranslation()
  const drawAreaContextValue = useEditorDrawArea()
  const { clearSelection, selectedComponent, selectedHole, selectedStitchLine } = drawAreaContextValue.selection

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
        <Splitter.Panel id="draw-area" bg="bg.emphasized">
          <Box height="100%" minHeight="0" minWidth="0" onClick={clearSelection} overflow="hidden" position="relative">
            {/* Project menu (top left) */}
            <EditorMenu />
            <DrawArea />
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
          </Box>
        </Splitter.Panel>
        <Splitter.ResizeTrigger id="draw-area:tree" mt="3" mb="3">
          <Splitter.ResizeTriggerIndicator />
        </Splitter.ResizeTrigger>
        <Splitter.Panel id="tree" bg="bg.emphasized" pt="2" pr="3" pb="2">
          <Card.Root bg="bg.panel" height="100%">
            <Card.Header>
              <Heading size="sm">{t.editor.panels.leather}</Heading>
            </Card.Header>
            <Card.Body flex="1" minHeight="0" overflow="auto" padding="4">
              <ComponentTree />
            </Card.Body>
          </Card.Root>
        </Splitter.Panel>
      </Splitter.Root>
    </DrawAreaContext.Provider>
  )
}

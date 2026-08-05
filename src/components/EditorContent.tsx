import { Box, Card, Heading, Splitter, SplitterPanelData } from '@chakra-ui/react'
import { FC } from 'react'
import { DrawAreaContext } from '../contexts/DrawAreaContext'
import { useEditorDrawArea } from '../hooks/useEditorDrawArea'
import { useTranslation } from '../translations/translation'
import { DrawArea } from './DrawArea'
import { FloatingEditors } from './FloatingEditors'
import { ComponentTree } from './tree/ComponentTree'

const panels: SplitterPanelData[] = [{ id: 'draw-area' }, { id: 'tree' }]
const defaultPanelSizes: string[] = ['auto', '350px']

export const EditorContent: FC = () => {
  const t = useTranslation()
  const editorContext = useEditorDrawArea()

  return (
    <DrawAreaContext.Provider value={editorContext}>
      <Splitter.Root
        defaultSize={defaultPanelSizes}
        height="100%"
        minHeight="0"
        minWidth="0"
        orientation="horizontal"
        panels={panels}
      >
        <Splitter.Panel id="draw-area" minHeight="0" minWidth="0">
          <Box height="100%" minHeight="0" minWidth="0" overflow="hidden" position="relative">
            <DrawArea />
            <FloatingEditors />
          </Box>
        </Splitter.Panel>

        <Splitter.ResizeTrigger id="draw-area:tree" mt="3" mb="3">
          <Splitter.ResizeTriggerIndicator />
        </Splitter.ResizeTrigger>

        <Splitter.Panel id="tree" minHeight="0" minWidth="0">
          <Card.Root bg="bg.panel" height="100%" minHeight="0" minWidth="0">
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

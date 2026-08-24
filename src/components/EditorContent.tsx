import { Box, Button, Card, Heading, Splitter, SplitterPanelData } from '@chakra-ui/react'
import { FC, useCallback, useMemo } from 'react'
import { PiPlus, PiWarningCircle } from 'react-icons/pi'
import { useNavigate } from 'react-router'
import { appRoutes } from '../appRoutes'
import { useProject } from '../hooks/useProject'
import { useProjectOperations } from '../hooks/useProjectOperations'
import { useTranslation } from '../translations/translation'
import { isDefined } from '../utils/isDefined'
import { DrawArea } from './DrawArea'
import { EditorMenu } from './EditorMenu'
import { EditorSubProjectTabs } from './EditorSubProjectTabs'
import { FloatingEditors } from './FloatingEditors'
import { CommonEmptyState } from './common/CommonEmptyState'
import { EditorComponentTree } from './component-tree/EditorComponentTree'

const panels: SplitterPanelData[] = [{ id: 'draw-area' }, { id: 'tree' }]
const defaultPanelSizes: string[] = ['auto', '350px']

type EditorContentProps = {
  subProjectId: string | undefined
}

export const EditorContent: FC<EditorContentProps> = ({ subProjectId }) => {
  const t = useTranslation()
  const { project } = useProject()
  const subProject = useMemo(
    () => project.subProjects.find((candidate) => candidate.id === subProjectId),
    [project.subProjects, subProjectId],
  )

  return (
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
          {isDefined(subProject) && <DrawArea />}
          {!isDefined(subProject) && isDefined(subProjectId) && <MissingSubProjectState />}
          {!isDefined(subProject) && !isDefined(subProjectId) && <EmptyProjectState />}

          <Box left="3" position="absolute" right="3" top="3" zIndex="1">
            <Box maxWidth="100%" width="fit-content">
              <EditorMenu />
            </Box>
          </Box>

          <Box bottom="0" left="0" overflowX="auto" overflowY="hidden" position="absolute" right="3" zIndex="1">
            <Box minWidth="100%" width="max-content">
              <EditorSubProjectTabs />
            </Box>
          </Box>

          {isDefined(subProject) && <FloatingEditors />}
        </Box>
      </Splitter.Panel>

      <Splitter.ResizeTrigger id="draw-area:tree" mt="3" mb="3">
        <Splitter.ResizeTriggerIndicator />
      </Splitter.ResizeTrigger>

      <Splitter.Panel id="tree" minHeight="0" minWidth="0">
        <Box height="100%" minHeight="0" minWidth="0" pb="3" pr="3" pt="3">
          <Card.Root bg="bg.panel" height="100%" minHeight="0" minWidth="0">
            <Card.Header>
              <Heading size="sm">{t.editor.panels.components.title}</Heading>
            </Card.Header>
            <Card.Body flex="1" minHeight="0" overflow="auto" padding="4">
              {isDefined(subProject) ? <EditorComponentTree /> : <EmptyComponentTreeState />}
            </Card.Body>
          </Card.Root>
        </Box>
      </Splitter.Panel>
    </Splitter.Root>
  )
}

const EmptyProjectState: FC = () => {
  const t = useTranslation()
  const { project } = useProject()
  const { createSubProject } = useProjectOperations()
  const navigate = useNavigate()

  const handleCreateSubProject = useCallback((): void => {
    const subProject = createSubProject()
    navigate(appRoutes.subProject(project.id, subProject.id))
  }, [createSubProject, navigate, project.id])

  return (
    <CommonEmptyState
      content={
        <Button onClick={handleCreateSubProject}>
          <PiPlus />
          {t.projects.actions.createModule}
        </Button>
      }
      description={t.projects.empty.noModules.description}
      icon={<PiWarningCircle />}
      title={t.projects.empty.noModules.title}
    />
  )
}

const MissingSubProjectState: FC = () => {
  const t = useTranslation()

  return (
    <CommonEmptyState
      description={t.projects.moduleNotFound.description}
      icon={<PiWarningCircle />}
      title={t.projects.moduleNotFound.title}
    />
  )
}

const EmptyComponentTreeState: FC = () => {
  const t = useTranslation()

  return (
    <CommonEmptyState
      description={t.editor.panels.components.empty.description}
      icon={<PiWarningCircle />}
      title={t.editor.panels.components.empty.title}
    />
  )
}

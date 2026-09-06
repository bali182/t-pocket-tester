import { Box, Button, Code, Spinner, Stack } from '@chakra-ui/react'
import { useEffect, useEffectEvent, useMemo, type FC } from 'react'
import { PiWarningCircle } from 'react-icons/pi'
import { useNavigate, useParams } from 'react-router'

import { CommonEmptyState } from '../../../common/components/common/CommonEmptyState'
import { EditorContext } from '../../../common/contexts/EditorContext'
import { useElectronProject } from '../../../common/hooks/useElectronProject'
import { Loadable } from '../../../common/loadable'
import type { ElectronProjectSchema } from '../../../common/schemas/electronProject'
import { useTranslation } from '../../../common/translations/translation'
import { isDefined } from '../../../common/utils/isDefined'
import { ElectronEditor } from '../ElectronEditor'
import { electronAppRoutes } from '../../electronAppRoutes'
import { useElectronEditorContextValue } from '../../hooks/useElectronEditorContextValue'
import type { ElectronSubProjectRouteParamsSchema } from '../../schemas/electronRouteParams'

export const ElectronProjectRoute: FC = () => {
  const { filePath, subProjectId } = useParams<ElectronSubProjectRouteParamsSchema>()
  const { electronProject, loadProject } = useElectronProject(filePath)
  const navigate = useNavigate()
  const editorContextValue = useElectronEditorContextValue()
  const isCurrentFilePath = useMemo<boolean>(
    () =>
      Loadable.get(
        Loadable.map(
          electronProject,
          (loadedElectronProject: ElectronProjectSchema): boolean => loadedElectronProject.filePath === filePath,
        ),
        false,
      ),
    [electronProject, filePath],
  )
  const targetPath = useMemo<string | undefined>(
    () =>
      Loadable.get(
        Loadable.map(electronProject, (loadedElectronProject: ElectronProjectSchema): string | undefined =>
          getTargetPath(loadedElectronProject, filePath, subProjectId),
        ),
      ),
    [electronProject, filePath, subProjectId],
  )
  const loadProjectInEffect = useEffectEvent((): Promise<void> => {
    return loadProject()
  })

  useEffect(() => {
    loadProjectInEffect()
  }, [filePath])

  useEffect(() => {
    if (!isDefined(targetPath)) {
      return
    }

    navigate(targetPath, { replace: true })
  }, [navigate, targetPath])

  if (electronProject.type === 'failed') {
    return <ElectronProjectLoadFailed filePath={filePath ?? ''} />
  }

  if (!Loadable.hasValue(electronProject) || isCurrentFilePath === false || isDefined(targetPath)) {
    return <ElectronProjectLoading />
  }

  return (
    <EditorContext.Provider value={editorContextValue}>
      <ElectronEditor />
    </EditorContext.Provider>
  )
}

const ElectronProjectLoading: FC = () => {
  return (
    <Box alignItems="center" display="flex" height="100%" justifyContent="center">
      <Spinner />
    </Box>
  )
}

type ElectronProjectLoadFailedProps = {
  filePath: string
}

const ElectronProjectLoadFailed: FC<ElectronProjectLoadFailedProps> = ({ filePath }) => {
  const t = useTranslation()
  const navigate = useNavigate()

  const handleBack = (): void => {
    navigate(electronAppRoutes.projects)
  }

  return (
    <CommonEmptyState
      content={
        <Button onClick={handleBack} variant="solid">
          {t.common.actions.back}
        </Button>
      }
      description={
        <Stack align="center" gap="2">
          <Box>{t.projects.openDialog.errors.openFailed}</Box>
          <Code>{filePath}</Code>
        </Stack>
      }
      icon={<PiWarningCircle />}
      title={t.projects.notFound.title}
    />
  )
}

const getTargetPath = (
  electronProject: ElectronProjectSchema,
  filePath: string | undefined,
  subProjectId: string | undefined,
): string | undefined => {
  if (!isDefined(filePath) || electronProject.filePath !== filePath) {
    return undefined
  }

  const selectedSubProject = isDefined(subProjectId)
    ? electronProject.project.subProjects.find((candidate) => candidate.id === subProjectId)
    : undefined

  if (isDefined(selectedSubProject)) {
    return undefined
  }

  const firstSubProject = electronProject.project.subProjects[0]
  return isDefined(firstSubProject)
    ? electronAppRoutes.subProject(filePath, firstSubProject.id)
    : electronAppRoutes.project(filePath)
}

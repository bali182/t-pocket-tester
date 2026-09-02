import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import typia from 'typia'

import { appRoutes } from '../appRoutes'
import { toaster } from '../components/Toaster'
import { FILE_EXTENSION } from '../extension'
import { fileManagement } from '../platform/fileManagement'
import type { ElectronProjectSchema } from '../schemas/electronProject'
import type { ProjectSchema } from '../schemas/project'
import { electronProjectAtom } from '../state/electronProjectAtom'
import { useTranslation } from '../translations/translation'
import { isDefined } from '../utils/isDefined'

type UseElectronProjectSchema = {
  electronProject: ElectronProjectSchema | undefined
  loadProject: (filePath: string, subProjectId?: string) => Promise<void>
  openProject: () => Promise<void>
}

export const useElectronProject = (): UseElectronProjectSchema => {
  const [electronProject, setElectronProject] = useAtom(electronProjectAtom)
  const navigate = useNavigate()
  const t = useTranslation()

  const showOpenFailedToast = useCallback((): void => {
    toaster.create({
      description: t.projects.openDialog.errors.openFailed,
      type: 'error',
    })
  }, [t.projects.openDialog.errors.openFailed])

  const loadProject = useCallback(
    async (filePath: string, subProjectId?: string): Promise<void> => {
      const response = await fileManagement.read({ filePath, type: 'read' })

      if (response.type === 'error') {
        showOpenFailedToast()
        return
      }

      let input: unknown

      try {
        input = JSON.parse(response.contents)
      } catch {
        showOpenFailedToast()
        return
      }

      if (!typia.is<ProjectSchema>(input)) {
        showOpenFailedToast()
        return
      }

      setElectronProject({
        filePath,
        isDirty: false,
        project: input,
      })

      const selectedSubProject = isDefined(subProjectId)
        ? input.subProjects.find((candidate) => candidate.id === subProjectId)
        : undefined
      const fallbackSubProject = input.subProjects[0]
      const targetSubProject = isDefined(selectedSubProject) ? selectedSubProject : fallbackSubProject

      if (!isDefined(targetSubProject)) {
        navigate(appRoutes.project(input.id))
        return
      }

      navigate(appRoutes.subProject(input.id, targetSubProject.id))
    },
    [navigate, setElectronProject, showOpenFailedToast],
  )

  const openProject = useCallback(async (): Promise<void> => {
    const response = await fileManagement.dialog({
      buttonLabel: t.projects.actions.open,
      fileFilter: {
        extension: FILE_EXTENSION,
        name: t.projects.openDialog.fileFilterLabel,
      },
      target: 'file',
      title: t.projects.openDialog.title,
      type: 'read',
    })

    if (response.type === 'error') {
      showOpenFailedToast()
      return
    }

    if (response.type === 'cancelled') {
      return
    }

    await loadProject(response.filePath)
  }, [
    loadProject,
    showOpenFailedToast,
    t.projects.actions.open,
    t.projects.openDialog.fileFilterLabel,
    t.projects.openDialog.title,
  ])

  return { electronProject, loadProject, openProject }
}

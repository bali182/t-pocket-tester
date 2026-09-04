import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import typia from 'typia'

import { appRoutes } from '../appRoutes'
import { toaster } from '../components/Toaster'
import { FILE_EXTENSION } from '../extension'
import { fileManagement } from '../platform/fileManagement'
import type { ElectronProjectSchema } from '../schemas/electronProject'
import type { ProjectSchema } from '../schemas/project'
import type { SubProjectRouteParams } from '../schemas/routeParams'
import { electronProjectAtom } from '../state/electronProjectAtom'
import { useTranslation } from '../translations/translation'
import { id } from '../utils/id'
import { isDefined } from '../utils/isDefined'

type UseElectronProjectSchema = {
  electronProject: ElectronProjectSchema | undefined
  loadProject: (filePath: string, subProjectId?: string) => Promise<void>
  openProject: () => Promise<void>
  saveProject: () => Promise<void>
  saveProjectAs: () => Promise<void>
}

export const useElectronProject = (): UseElectronProjectSchema => {
  const [electronProject, setElectronProject] = useAtom(electronProjectAtom)
  const navigate = useNavigate()
  const { subProjectId } = useParams<SubProjectRouteParams>()
  const t = useTranslation()

  const showOpenFailedToast = useCallback((): void => {
    toaster.create({
      description: t.projects.openDialog.errors.openFailed,
      type: 'error',
    })
  }, [t.projects.openDialog.errors.openFailed])

  const showSaveFailedToast = useCallback((): void => {
    toaster.create({
      description: t.projects.saveDialog.errors.saveFailed,
      type: 'error',
    })
  }, [t.projects.saveDialog.errors.saveFailed])

  const writeProject = useCallback(
    async (target: ElectronProjectSchema): Promise<boolean> => {
      const response = await fileManagement.write({
        contents: JSON.stringify(target.project, null, 2),
        filePath: target.filePath,
        type: 'write',
      })

      if (response.type === 'error') {
        showSaveFailedToast()
        return false
      }

      setElectronProject(target)

      return true
    },
    [setElectronProject, showSaveFailedToast],
  )

  const navigateToProject = useCallback(
    (project: ProjectSchema, preferredSubProjectId?: string): void => {
      const selectedSubProject = isDefined(preferredSubProjectId)
        ? project.subProjects.find((candidate) => candidate.id === preferredSubProjectId)
        : undefined
      const fallbackSubProject = project.subProjects[0]
      const targetSubProject = isDefined(selectedSubProject) ? selectedSubProject : fallbackSubProject

      if (!isDefined(targetSubProject)) {
        navigate(appRoutes.project(project.id))
        return
      }

      navigate(appRoutes.subProject(project.id, targetSubProject.id))
    },
    [navigate],
  )

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

      navigateToProject(input, subProjectId)
    },
    [navigateToProject, setElectronProject, showOpenFailedToast],
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

  const saveProject = useCallback(async (): Promise<void> => {
    if (!isDefined(electronProject)) {
      return
    }

    await writeProject({ ...electronProject, isDirty: false })
  }, [electronProject, writeProject])

  const saveProjectAs = useCallback(async (): Promise<void> => {
    if (!isDefined(electronProject)) {
      return
    }

    const response = await fileManagement.dialog({
      buttonLabel: t.editor.menus.file.file.save,
      fileFilter: {
        extension: FILE_EXTENSION,
        name: t.projects.openDialog.fileFilterLabel,
      },
      title: t.projects.saveDialog.title,
      type: 'write',
    })

    if (response.type === 'error') {
      showSaveFailedToast()
      return
    }

    if (response.type === 'cancelled') {
      return
    }

    const target: ElectronProjectSchema = {
      filePath: response.filePath,
      isDirty: false,
      project: {
        ...electronProject.project,
        id: id(),
      },
    }

    const hasSaved = await writeProject(target)

    if (!hasSaved) {
      return
    }

    navigateToProject(target.project, subProjectId)
  }, [
    electronProject,
    navigateToProject,
    showSaveFailedToast,
    subProjectId,
    t.editor.menus.file.file.save,
    t.projects.openDialog.fileFilterLabel,
    t.projects.saveDialog.title,
    writeProject,
  ])

  return { electronProject, loadProject, openProject, saveProject, saveProjectAs }
}

import { Button, Dialog, Portal } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState, type FC, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router'

import { toaster } from '../../common/components/Toaster'
import { LANGUAGE } from '../../common/constants/language'
import { useEditableModel } from '../../common/hooks/useEditableModel'
import { Loadable } from '../../common/loadable'
import { addSubProject } from '../../common/operations/project/addSubProject'
import { portalRef } from '../../common/portalRef'
import type { ProjectSchema } from '../../common/schemas/project'
import type { ProjectBasedValidationContextSchema } from '../../common/schemas/validation'
import { useTranslation } from '../../common/translations/translation'
import { createProject } from '../../common/utils/createProject'
import { hasValidationErrors } from '../../common/utils/hasValidationErrors'
import { isDefined } from '../../common/utils/isDefined'
import { validateProjectSchema } from '../../common/validators/validateProjectSchema'
import { electronApi } from '../electronApi'
import { electronAppRoutes } from '../electronAppRoutes'
import { useCreateProjectFilePath } from '../hooks/useCreateProjectFilePath'
import { ElectronProjectSettingsEditor } from './project-settings-editors/ElectronProjectSettingsEditor'

type ElectronCreateProjectDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const ElectronCreateProjectDialog: FC<ElectronCreateProjectDialogProps> = ({ isOpen, onOpenChange }) => {
  const navigate = useNavigate()
  const t = useTranslation()

  const createEmptyProject = useCallback((): ProjectSchema => {
    return createProject(t.defaults.projectName)
  }, [t.defaults.projectName])

  const [project, setProject] = useState<ProjectSchema>(() => createEmptyProject())

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setProject(createEmptyProject())
  }, [createEmptyProject, isOpen])

  const context = useMemo<ProjectBasedValidationContextSchema>(() => ({ language: LANGUAGE, projects: [], t }), [t])

  const commit = useCallback((updatedProject: ProjectSchema): void => {
    setProject(updatedProject)
  }, [])

  const { editableValue, setValue, validationIssues } = useEditableModel({
    commit,
    context,
    validate: validateProjectSchema,
    value: project,
  })
  const createProjectFilePath = useCreateProjectFilePath(editableValue.name)
  const filePathIssue = Loadable.get(createProjectFilePath.filePathIssue)
  const hasFilePathError = isDefined(filePathIssue) && filePathIssue.severity === 'error'
  const isCreateDisabled =
    hasValidationErrors<ProjectSchema>(validationIssues) ||
    !Loadable.isSettled(createProjectFilePath.filePathIssue) ||
    !Loadable.hasValue(createProjectFilePath.filePathIssue) ||
    hasFilePathError

  const handleOpenChange = useCallback(
    (details: Dialog.OpenChangeDetails): void => {
      onOpenChange(details.open)
    },
    [onOpenChange],
  )

  const showSaveFailedToast = useCallback((): void => {
    toaster.create({
      description: t.projects.saveDialog.errors.saveFailed,
      type: 'error',
    })
  }, [t.projects.saveDialog.errors.saveFailed])

  const handleSubmit = useCallback(
    async (event: SubmitEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault()

      const validationResult = validateProjectSchema(editableValue, project, context)

      if (!validationResult.isValid) {
        showSaveFailedToast()
        return
      }

      const { project: createdProject, subProject: initialSubProject } = addSubProject(validationResult.value, {
        baseRootComponentName: t.defaults.rootComponentName,
      })

      const response = await electronApi.write({
        contents: JSON.stringify(createdProject, null, 2),
        filePath: createProjectFilePath.filePath,
        type: 'write',
      })

      if (response.type === 'error') {
        showSaveFailedToast()
        return
      }

      onOpenChange(false)
      navigate(electronAppRoutes.subProject(createProjectFilePath.filePath, initialSubProject.id))
    },
    [
      context,
      createProjectFilePath.filePath,
      editableValue,
      navigate,
      onOpenChange,
      project,
      showSaveFailedToast,
      t.defaults.rootComponentName,
    ],
  )

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen} size="lg" placement="center">
      <Portal container={portalRef}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit}>
              <Dialog.Header>
                <Dialog.Title>{t.projects.createDialog.title}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body px="0">
                <ElectronProjectSettingsEditor
                  editable={editableValue}
                  filePath={createProjectFilePath.filePath}
                  filePathIssue={createProjectFilePath.filePathIssue}
                  isFilePathManuallyModified={createProjectFilePath.isManuallyModified}
                  issues={validationIssues}
                  onChange={setValue}
                  onFilePathChange={createProjectFilePath.onFilePathChange}
                  onFilePathReset={createProjectFilePath.onFilePathReset}
                  onFilePickerButtonPressed={createProjectFilePath.onFilePickerButtonPressed}
                />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">{t.common.actions.cancel}</Button>
                </Dialog.ActionTrigger>
                <Button disabled={isCreateDisabled} type="submit" variant="solid">
                  {t.projects.createDialog.actions.create}
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

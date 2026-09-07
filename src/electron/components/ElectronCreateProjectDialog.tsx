import { Button, Dialog, Portal } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState, type FC } from 'react'

import { LANGUAGE } from '../../common/constants/language'
import { useEditableModel } from '../../common/hooks/useEditableModel'
import { portalRef } from '../../common/portalRef'
import type { ProjectSchema } from '../../common/schemas/project'
import type { ProjectBasedValidationContextSchema } from '../../common/schemas/validation'
import { useTranslation } from '../../common/translations/translation'
import { createProject } from '../../common/utils/createProject'
import { validateProjectSchema } from '../../common/validators/validateProjectSchema'
import { ElectronProjectSettingsEditor } from './project-settings-editors/ElectronProjectSettingsEditor'

type ElectronCreateProjectDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const ElectronCreateProjectDialog: FC<ElectronCreateProjectDialogProps> = ({ isOpen, onOpenChange }) => {
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

  const handleOpenChange = useCallback(
    (details: Dialog.OpenChangeDetails): void => {
      onOpenChange(details.open)
    },
    [onOpenChange],
  )

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen} size="lg" placement="center">
      <Portal container={portalRef}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{t.projects.createDialog.title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body px="0">
              <ElectronProjectSettingsEditor editable={editableValue} issues={validationIssues} onChange={setValue} />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{t.common.actions.cancel}</Button>
              </Dialog.ActionTrigger>
              <Button disabled variant="solid">
                {t.projects.createDialog.actions.create}
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

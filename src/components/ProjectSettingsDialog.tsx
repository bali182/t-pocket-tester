import { Dialog, IconButton } from '@chakra-ui/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useMemo, type FC } from 'react'
import { PiX } from 'react-icons/pi'

import { LANGUAGE } from '../constants/language'
import { useEditableModel } from '../hooks/useEditableModel'
import type { ProjectBasedValidationContextSchema } from '../schemas/validation'
import { projectAtom } from '../state/projectAtom'
import { projectsAtom } from '../state/projectsAtom'
import { useTranslation } from '../translations/translation'
import { isDefined } from '../utils/isDefined'
import { validateProjectSchema } from '../validators/validateProjectSchema'
import { ProjectSettingsEditor } from './project-settings-editors/ProjectSettingsEditor'

type ProjectSettingsDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const ProjectSettingsDialog: FC<ProjectSettingsDialogProps> = ({ isOpen, onOpenChange }) => {
  const project = useAtomValue(projectAtom)
  const projects = useAtomValue(projectsAtom)
  const setProject = useSetAtom(projectAtom)
  const t = useTranslation()
  const context = useMemo<ProjectBasedValidationContextSchema>(
    () => ({ language: LANGUAGE, projects, t }),
    [projects, t],
  )
  const handleOpenChange = useCallback(
    (details: Dialog.OpenChangeDetails): void => {
      onOpenChange(details.open)
    },
    [onOpenChange],
  )

  if (!isDefined(project)) {
    throw new Error('ProjectSettingsDialog requires an opened project')
  }

  const { editableValue, setValue, validationIssues } = useEditableModel({
    commit: setProject,
    context,
    validate: validateProjectSchema,
    value: project,
  })

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen} size="xl">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger asChild>
            <IconButton size="sm" variant="ghost">
              <PiX />
            </IconButton>
          </Dialog.CloseTrigger>
          <Dialog.Header>
            <Dialog.Title>{t.projects.settingsDialog.title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <ProjectSettingsEditor editable={editableValue} issues={validationIssues} onChange={setValue} />
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

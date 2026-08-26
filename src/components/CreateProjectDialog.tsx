import { Button, Dialog } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState, type FC, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

import { appRoutes } from '../appRoutes'
import { LANGUAGE } from '../constants/language'
import { useEditableModel } from '../hooks/useEditableModel'
import { useProjects } from '../hooks/useProjects'
import { addSubProject } from '../operations/project/addSubProject'
import { getUnusedName } from '../operations/subProject/utils/getUnusedName'
import type { ProjectSchema } from '../schemas/project'
import type { ProjectBasedValidationContextSchema } from '../schemas/validation'
import { useTranslation } from '../translations/translation'
import { createProject } from '../utils/createProject'
import { hasValidationErrors } from '../utils/hasValidationErrors'
import { validateProjectSchema } from '../validators/validateProjectSchema'
import { ProjectSettingsEditor } from './project-settings-editors/ProjectSettingsEditor'

type CreateProjectDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

// Should be for creating real Projects not SubProjects
export const CreateProjectDialog: FC<CreateProjectDialogProps> = ({ isOpen, onOpenChange }) => {
  const { addProject, projects } = useProjects()
  const navigate = useNavigate()
  const t = useTranslation()

  const createEmptyProject = useCallback(() => {
    return createProject(getUnusedName(t.defaults.projectName, new Set(projects.map((p) => p.name))))
  }, [projects, t.defaults.projectName])

  const [project, setProject] = useState<ProjectSchema>(() => createEmptyProject())

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setProject(createEmptyProject())
  }, [createEmptyProject, isOpen, t])

  const context = useMemo<ProjectBasedValidationContextSchema>(
    () => ({ language: LANGUAGE, projects, t }),
    [projects, t],
  )

  const commit = useCallback((updatedProject: ProjectSchema): void => {
    setProject(updatedProject)
  }, [])

  const { editableValue, setValue, validationIssues } = useEditableModel({
    commit,
    context,
    validate: validateProjectSchema,
    value: project,
  })

  const hasErrors = useMemo(() => hasValidationErrors<ProjectSchema>(validationIssues), [validationIssues])

  const handleOpenChange = useCallback(
    (details: Dialog.OpenChangeDetails): void => {
      onOpenChange(details.open)
    },
    [onOpenChange],
  )

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault()

      const validationResult = validateProjectSchema(editableValue, project, context)

      if (!validationResult.isValid) {
        return
      }

      const { project: createdProject, subProject: initialSubProject } = addSubProject(validationResult.value, {
        baseRootComponentName: t.defaults.rootComponentName,
      })
      addProject(createdProject)
      onOpenChange(false)
      navigate(appRoutes.subProject(createdProject.id, initialSubProject.id))
    },
    [addProject, context, editableValue, navigate, onOpenChange, project, t],
  )

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen} size="lg" placement="center">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <form onSubmit={handleSubmit}>
            <Dialog.Header>
              <Dialog.Title>{t.projects.createDialog.title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body px="0">
              <ProjectSettingsEditor
                mode="create"
                editable={editableValue}
                issues={validationIssues}
                onChange={setValue}
              />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{t.common.actions.cancel}</Button>
              </Dialog.ActionTrigger>
              <Button disabled={hasErrors} type="submit">
                {t.projects.createDialog.actions.create}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

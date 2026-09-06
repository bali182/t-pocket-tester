import { Button, Dialog, Portal } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState, type FC, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

import { ProjectSettingsEditor } from '../../common/components/project-settings-editors/ProjectSettingsEditor'
import { LANGUAGE } from '../../common/constants/language'
import { useEditableModel } from '../../common/hooks/useEditableModel'
import { useProjects } from '../../common/hooks/useProjects'
import { addSubProject } from '../../common/operations/project/addSubProject'
import { getUnusedName } from '../../common/operations/subProject/utils/getUnusedName'
import { portalRef } from '../../common/portalRef'
import type { ProjectSchema } from '../../common/schemas/project'
import type { ProjectBasedValidationContextSchema } from '../../common/schemas/validation'
import { useTranslation } from '../../common/translations/translation'
import { createProject } from '../../common/utils/createProject'
import { hasValidationErrors } from '../../common/utils/hasValidationErrors'
import { validateProjectSchema } from '../../common/validators/validateProjectSchema'
import { webAppRoutes } from '../webAppRoutes'

type CreateProjectDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const CreateProjectDialog: FC<CreateProjectDialogProps> = ({ isOpen, onOpenChange }) => {
  const { addProject, projects } = useProjects()
  const navigate = useNavigate()
  const t = useTranslation()

  const createEmptyProject = useCallback((): ProjectSchema => {
    return createProject(
      getUnusedName(t.defaults.projectName, new Set(projects.map((project): string => project.name))),
    )
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

  const hasErrors = useMemo<boolean>(() => hasValidationErrors<ProjectSchema>(validationIssues), [validationIssues])

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
      navigate(webAppRoutes.subProject(createdProject.id, initialSubProject.id))
    },
    [addProject, context, editableValue, navigate, onOpenChange, project, t],
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
                <ProjectSettingsEditor editable={editableValue} issues={validationIssues} onChange={setValue} />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">{t.common.actions.cancel}</Button>
                </Dialog.ActionTrigger>
                <Button disabled={hasErrors} type="submit" variant="solid">
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

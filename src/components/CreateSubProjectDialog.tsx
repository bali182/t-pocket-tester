import { Button, Dialog, Field, Input } from '@chakra-ui/react'
import { useCallback, useState, type FC, type FormEvent, type ReactElement } from 'react'
import { useNavigate } from 'react-router'

import { useProject } from '../hooks/useProject'
import { useTranslation } from '../translations/translation'
import { createSubProject } from '../utils/createSubProject'

type CreateSubProjectDialogProps = {
  trigger: ReactElement
}

export const CreateSubProjectDialog: FC<CreateSubProjectDialogProps> = ({ trigger }) => {
  const { project, setProject } = useProject()
  const t = useTranslation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState(t.defaults.subProjectName)
  const hasDuplicateName = project.subProjects.some((subProject) => subProject.name === name)

  const handleOpenChange = useCallback((details: Dialog.OpenChangeDetails): void => {
    setIsOpen(details.open)
  }, [])

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault()

      if (hasDuplicateName) {
        return
      }

      const subProject = createSubProject(name, t)
      setProject({ ...project, subProjects: [...project.subProjects, subProject] })
      setIsOpen(false)
      navigate(`/projects/${project.id}/${subProject.id}`)
    },
    [hasDuplicateName, name, navigate, project, setProject, t],
  )

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <form onSubmit={handleSubmit}>
            <Dialog.Header>
              <Dialog.Title>{t.projects.createDialog.title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Field.Root invalid={hasDuplicateName}>
                <Field.Label>{t.common.labels.name}</Field.Label>
                <Input onChange={(event) => setName(event.target.value)} value={name} />
              </Field.Root>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{t.common.actions.cancel}</Button>
              </Dialog.ActionTrigger>
              <Button disabled={hasDuplicateName} type="submit">
                {t.common.actions.add}
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

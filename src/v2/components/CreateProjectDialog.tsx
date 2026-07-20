import { Button, Dialog, Field, Input, Stack } from '@chakra-ui/react'
import { useSetAtom } from 'jotai'
import { useCallback, useState, type FC, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { projectsAtom } from '../state/projectsAtom'
import { useTranslation } from '../translations/translation'
import { createProject } from '../utils/createProject'

type CreateProjectDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const CreateProjectDialog: FC<CreateProjectDialogProps> = ({ isOpen, onOpenChange }) => {
  const [name, setName] = useState('')
  const setProjects = useSetAtom(projectsAtom)
  const navigate = useNavigate()
  const t = useTranslation()

  const handleOpenChange = useCallback(
    (details: Dialog.OpenChangeDetails): void => {
      onOpenChange(details.open)
    },
    [onOpenChange],
  )

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault()

      const project = createProject(name, t)
      setProjects((projects) => [...projects, project])
      setName('')
      onOpenChange(false)
      navigate(`/projects/${project.id}`)
    },
    [name, navigate, onOpenChange, setProjects, t],
  )

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <form onSubmit={handleSubmit}>
            <Dialog.Header>
              <Dialog.Title>{t.projects.createDialog.title()}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack gap="3">
                <Field.Root>
                  <Field.Label>{t.common.labels.name()}</Field.Label>
                  <Input autoFocus onChange={(event) => setName(event.target.value)} value={name} />
                </Field.Root>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">{t.common.actions.cancel()}</Button>
              </Dialog.ActionTrigger>
              <Button type="submit">{t.projects.createDialog.actions.create()}</Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}

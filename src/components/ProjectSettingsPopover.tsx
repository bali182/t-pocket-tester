import { Popover } from '@chakra-ui/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useMemo, type FC, type ReactElement } from 'react'

import { LANGUAGE } from '../constants/language'
import { useEditableModel } from '../hooks/useEditableModel'
import type { ProjectBasedValidationContextSchema } from '../schemas/validation'
import { projectAtom } from '../state/projectAtom'
import { projectsAtom } from '../state/projectsAtom'
import { useTranslation } from '../translations/translation'
import { isDefined } from '../utils/isDefined'
import { validateProjectSchema } from '../validators/validateProjectSchema'
import { ProjectSettingsEditor } from './project-settings-editors/ProjectSettingsEditor'
import { ProjectActionsMenu } from './ProjectActionsMenu'

type ProjectSettingsPopoverProps = {
  trigger: ReactElement
}

export const ProjectSettingsPopover: FC<ProjectSettingsPopoverProps> = ({ trigger }) => {
  const project = useAtomValue(projectAtom)
  const projects = useAtomValue(projectsAtom)
  const setProject = useSetAtom(projectAtom)
  const t = useTranslation()
  const context = useMemo<ProjectBasedValidationContextSchema>(
    () => ({ language: LANGUAGE, projects, t }),
    [projects, t],
  )

  if (!isDefined(project)) {
    throw new Error('ProjectSettingsPopover requires an opened project')
  }

  const { editableValue, setValue, validationIssues } = useEditableModel({
    commit: setProject,
    context,
    validate: validateProjectSchema,
    value: project,
  })

  return (
    <Popover.Root positioning={{ placement: 'bottom-start' }}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content width="450px">
          <ProjectSettingsEditor
            editable={editableValue}
            issues={validationIssues}
            menu={<ProjectActionsMenu projectId={project.id} size="xs" />}
            onChange={setValue}
          />
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}

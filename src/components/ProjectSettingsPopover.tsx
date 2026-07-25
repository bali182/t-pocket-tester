import { Popover } from '@chakra-ui/react'
import { useMemo, type FC, type ReactElement, type RefObject } from 'react'

import { LANGUAGE } from '../constants/language'
import { useEditableModel } from '../hooks/useEditableModel'
import { useProject } from '../hooks/useProject'
import { useProjects } from '../hooks/useProjects'
import type { ProjectBasedValidationContextSchema } from '../schemas/validation'
import { useTranslation } from '../translations/translation'
import { validateProjectSchema } from '../validators/validateProjectSchema'
import { ProjectSettingsEditor } from './project-settings-editors/ProjectSettingsEditor'
import { ProjectActionsMenu } from './ProjectActionsMenu'

type ProjectSettingsPopoverProps = {
  anchorRef: RefObject<HTMLElement | null>
  trigger: ReactElement
}

export const ProjectSettingsPopover: FC<ProjectSettingsPopoverProps> = ({ anchorRef, trigger }) => {
  const t = useTranslation()

  const { project, setProject } = useProject()
  const { projects } = useProjects()

  const context = useMemo<ProjectBasedValidationContextSchema>(
    () => ({ language: LANGUAGE, projects, t }),
    [projects, t],
  )

  // Chakra not exporting the appropriate type. FFS.
  const positioning = useMemo(
    () => ({
      getAnchorElement: () => anchorRef.current,
      placement: 'bottom-start' as const,
    }),
    [anchorRef],
  )

  const { editableValue, setValue, validationIssues } = useEditableModel({
    commit: setProject,
    context,
    validate: validateProjectSchema,
    value: project,
  })

  return (
    <Popover.Root positioning={positioning}>
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

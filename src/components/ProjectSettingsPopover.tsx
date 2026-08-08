import { Popover } from '@chakra-ui/react'
import { useMemo, type FC, type ReactElement, type RefObject } from 'react'

import { useEditableProject } from '../hooks/useEditableProject'
import { ProjectSettingsEditor } from './project-settings-editors/ProjectSettingsEditor'
import { ProjectActionsMenu } from './ProjectActionsMenu'

type ProjectSettingsPopoverProps = {
  anchorRef: RefObject<HTMLElement | null>
  trigger: ReactElement
}

export const ProjectSettingsPopover: FC<ProjectSettingsPopoverProps> = ({ anchorRef, trigger }) => {
  const { editableProject, project, setProject, validationIssues } = useEditableProject()

  // Chakra not exporting the appropriate type. FFS.
  const positioning = useMemo(
    () => ({
      getAnchorElement: () => anchorRef.current,
      placement: 'bottom-start' as const,
    }),
    [anchorRef],
  )

  return (
    <Popover.Root positioning={positioning}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content width="450px">
          <ProjectSettingsEditor
            editable={editableProject}
            issues={validationIssues}
            menu={<ProjectActionsMenu projectId={project.id} size="xs" />}
            onChange={setProject}
          />
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}

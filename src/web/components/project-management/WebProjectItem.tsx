import { HStack, Listbox, Text } from '@chakra-ui/react'
import type { FC } from 'react'
import { PiWalletDuotone } from 'react-icons/pi'
import { Link } from 'react-router'

import type { RecentProjectItemProps } from '../../../common/components/project-management/RecentProjects'
import { ProjectActionsMenu } from '../ProjectActionsMenu'

export const WebProjectItem: FC<RecentProjectItemProps> = ({ project }) => {
  return (
    <Listbox.Item flex="none" item={project}>
      <HStack gap="3" width="100%">
        <Link style={{ flex: 1 }} to={project.link}>
          <HStack gap="3">
            <PiWalletDuotone size={18} />
            <Listbox.ItemText>
              {project.projectName}
              <Text color="fg.muted" fontSize="xs" mt="1">
                {project.formattedLastOpenedAt}
              </Text>
            </Listbox.ItemText>
          </HStack>
        </Link>
        <ProjectActionsMenu projectId={project.projectId} size="xs" />
      </HStack>
    </Listbox.Item>
  )
}

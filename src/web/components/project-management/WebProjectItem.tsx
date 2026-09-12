import { Box, HStack, Listbox, Text } from '@chakra-ui/react'
import type { FC } from 'react'
import { PiWalletDuotone } from 'react-icons/pi'
import { Link } from 'react-router'

import type { RecentProjectItemProps } from '../../../common/components/project-management/RecentProjects'
import { ProjectActionsMenu } from '../ProjectActionsMenu'

export const WebProjectItem: FC<RecentProjectItemProps> = ({ project }) => {
  return (
    <Box position="relative">
      <Link style={{ display: 'block' }} to={project.link}>
        <Listbox.Item flex="none" item={project} pe="10">
          <HStack gap="3">
            <PiWalletDuotone size={18} />
            <Listbox.ItemText>
              {project.label}
              <Text color="fg.muted" fontSize="xs" mt="1">
                {project.formattedLastOpenedAt}
              </Text>
            </Listbox.ItemText>
          </HStack>
        </Listbox.Item>
      </Link>
      <Box position="absolute" right="2" top="50%" transform="translateY(-50%)">
        <ProjectActionsMenu projectId={project.id} size="xs" />
      </Box>
    </Box>
  )
}

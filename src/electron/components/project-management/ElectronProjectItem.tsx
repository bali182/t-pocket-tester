import { HStack, Listbox, Text } from '@chakra-ui/react'
import type { FC } from 'react'
import { PiWalletDuotone } from 'react-icons/pi'
import { Link } from 'react-router'

import type { RecentProjectItemProps } from '../../../common/components/project-management/RecentProjects'

export const ElectronProjectItem: FC<RecentProjectItemProps> = ({ project }) => {
  return (
    <Link to={project.link}>
      <Listbox.Item flex="none" item={project}>
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
  )
}

import { HStack, Text } from '@chakra-ui/react'
import type { FC } from 'react'
import { LiaFrogSolid } from 'react-icons/lia'

export const ProjectManagementHeader: FC = () => {
  return (
    <HStack gap="1">
      <LiaFrogSolid size={30} />
      <Text fontWeight="semibold">T Pocket Tester</Text>
    </HStack>
  )
}

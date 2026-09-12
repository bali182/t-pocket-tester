import { HStack, Icon, Text, VStack } from '@chakra-ui/react'
import type { FC } from 'react'

import { ReactComponent as Logo } from '../../../../logo.svg?react'
import { useTranslation } from '../../translations/translation'

export const ProjectManagementHeader: FC = () => {
  const t = useTranslation()

  return (
    <HStack gap="2.5">
      <Icon as={Logo} boxSize="45px" fill="fg" />
      <VStack gap="0" align="start">
        <Text fontSize="large" fontWeight="semibold">
          {t.app.title}
        </Text>
        <Text fontSize="xs" color="fg.muted">
          {t.app.subtitle}
        </Text>
      </VStack>
    </HStack>
  )
}

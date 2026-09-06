import { Box, HStack, Icon, Text } from '@chakra-ui/react'
import { FC, ReactNode } from 'react'
import { PiNeedle } from 'react-icons/pi'

type StitchingSettingsMenuItemProps = {
  label: string
  children: ReactNode
}

export const StitchingSettingsMenuItem: FC<StitchingSettingsMenuItemProps> = ({ children, label }) => {
  return (
    <HStack gap="3" height="8" px="1">
      <Icon as={PiNeedle} />
      <Text flex="1" textStyle="sm">
        {label}
      </Text>
      <Box width="28">{children}</Box>
    </HStack>
  )
}

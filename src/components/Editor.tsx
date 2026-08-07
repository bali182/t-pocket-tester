import { Box } from '@chakra-ui/react'
import { type FC } from 'react'
import { Outlet } from 'react-router'

import { EditorMenu } from './EditorMenu'
import { EditorSubProjectTabs } from './EditorSubProjectTabs'

export const Editor: FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      bg="bg.emphasized"
      gap="3"
      height="100%"
      minHeight="0"
      minWidth="0"
      overflow="hidden"
      pt="3"
      px="3"
    >
      <EditorMenu />
      <Box flex="1" minHeight="0" minWidth="0" overflow="hidden">
        <Outlet />
      </Box>
      <Box flexShrink="0">
        <EditorSubProjectTabs />
      </Box>
    </Box>
  )
}

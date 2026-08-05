import { Box, Tabs } from '@chakra-ui/react'
import { type FC } from 'react'

import { EditorContent } from './EditorContent'
import { EditorMenu } from './EditorMenu'

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
      p="3"
    >
      <EditorMenu />
      <Box flex="1" minHeight="0" minWidth="0" overflow="hidden">
        <EditorContent />
      </Box>
      <Box flexShrink="0">
        <Tabs.Root defaultValue="sub-project" size="sm" variant="line" width="100%">
          <Tabs.List>
            <Tabs.Trigger value="sub-project">Sub-project</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </Box>
    </Box>
  )
}

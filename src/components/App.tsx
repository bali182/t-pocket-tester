import { Box, Button } from '@chakra-ui/react'
import { useSetAtom } from 'jotai'
import type { FC } from 'react'

import { isInputDrawerOpenAtom } from '../state'
import { CardHolderInputDrawer } from './CardHolderInputDrawer'
import { DrawArea } from './DrawArea'

export const App: FC = () => {
  const setIsInputDrawerOpen = useSetAtom(isInputDrawerOpenAtom)

  return (
    <Box height="100dvh" position="relative" overflow="hidden">
      <DrawArea />

      <Button position="absolute" top="4" right="4" colorPalette="blue" onClick={() => setIsInputDrawerOpen(true)}>
        Input
      </Button>

      <CardHolderInputDrawer />
    </Box>
  )
}

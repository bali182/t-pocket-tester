import { Box } from '@chakra-ui/react'
import { type FC } from 'react'
import { Outlet } from 'react-router'

import { NumberEditorStepContext } from '../contexts/NumberEditorStepContext'
import { useNumberEditorStep } from '../hooks/useNumberEditorStep'

export const Editor: FC = () => {
  const numberEditorStep = useNumberEditorStep()

  return (
    <NumberEditorStepContext.Provider value={numberEditorStep}>
      <Box bg="bg.emphasized" height="100%" minHeight="0" minWidth="0" overflow="hidden" position="relative">
        <Box inset="0" minHeight="0" minWidth="0" overflow="hidden" position="absolute">
          <Outlet />
        </Box>
      </Box>
    </NumberEditorStepContext.Provider>
  )
}

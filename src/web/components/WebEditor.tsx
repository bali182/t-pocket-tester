import { Box } from '@chakra-ui/react'
import { type FC } from 'react'
import { Outlet } from 'react-router'
import { NumberEditorStepContext } from '../../common/contexts/NumberEditorStepContext'
import { useNumberEditorStep } from '../../common/hooks/useNumberEditorStep'
import { WebCommandManager } from '../context/WebCommandManager'

export const WebEditor: FC = () => {
  const numberEditorStep = useNumberEditorStep()

  return (
    <WebCommandManager>
      <NumberEditorStepContext.Provider value={numberEditorStep}>
        <Box bg="bg.emphasized" height="100%" minHeight="0" minWidth="0" overflow="hidden" position="relative">
          <Box inset="0" minHeight="0" minWidth="0" overflow="hidden" position="absolute">
            <Outlet />
          </Box>
        </Box>
      </NumberEditorStepContext.Provider>
    </WebCommandManager>
  )
}

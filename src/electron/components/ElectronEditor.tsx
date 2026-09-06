import { Box } from '@chakra-ui/react'
import { type FC } from 'react'
import { Outlet } from 'react-router'
import { ElectronCommandsContext } from '../../common/contexts/ElectronCommandsContext'
import { NumberEditorStepContext } from '../../common/contexts/NumberEditorStepContext'
import { useElectronCommandsContextValue } from '../../common/hooks/useElectronCommandsContextValue'
import { useNumberEditorStep } from '../../common/hooks/useNumberEditorStep'

export const ElectronEditor: FC = () => {
  const numberEditorStep = useNumberEditorStep()
  const electronCommandsContextValue = useElectronCommandsContextValue()

  return (
    <ElectronCommandsContext.Provider value={electronCommandsContextValue}>
      <NumberEditorStepContext.Provider value={numberEditorStep}>
        <Box bg="bg.emphasized" height="100%" minHeight="0" minWidth="0" overflow="hidden" position="relative">
          <Box inset="0" minHeight="0" minWidth="0" overflow="hidden" position="absolute">
            <Outlet />
          </Box>
        </Box>
      </NumberEditorStepContext.Provider>
    </ElectronCommandsContext.Provider>
  )
}

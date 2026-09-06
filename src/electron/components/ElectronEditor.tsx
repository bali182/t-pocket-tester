import { Box } from '@chakra-ui/react'
import { type FC } from 'react'
import { Outlet } from 'react-router'
import { CommandsContext, CommandsContextValue } from '../../common/contexts/CommandsContext'
import { NumberEditorStepContext } from '../../common/contexts/NumberEditorStepContext'
import { useNumberEditorStep } from '../../common/hooks/useNumberEditorStep'
import { useElectronCommandsContextValue } from '../hooks/useElectronCommandsContextValue'

export const ElectronEditor: FC = () => {
  const numberEditorStep = useNumberEditorStep()
  const electronCommandsContextValue = useElectronCommandsContextValue()

  return (
    // No generic context provider, ffs
    <CommandsContext.Provider value={electronCommandsContextValue as CommandsContextValue<string>}>
      <NumberEditorStepContext.Provider value={numberEditorStep}>
        <Box bg="bg.emphasized" height="100%" minHeight="0" minWidth="0" overflow="hidden" position="relative">
          <Box inset="0" minHeight="0" minWidth="0" overflow="hidden" position="absolute">
            <Outlet />
          </Box>
        </Box>
      </NumberEditorStepContext.Provider>
    </CommandsContext.Provider>
  )
}

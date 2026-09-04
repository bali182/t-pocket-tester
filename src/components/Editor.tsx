import { Box } from '@chakra-ui/react'
import { type FC } from 'react'
import { Outlet } from 'react-router'

import { ElectronCommandsContext } from '../contexts/ElectronCommandsContext'
import { NumberEditorStepContext } from '../contexts/NumberEditorStepContext'
import { useElectronCommandsContextValue } from '../hooks/useElectronCommandsContextValue'
import { useNumberEditorStep } from '../hooks/useNumberEditorStep'
import { isElectron } from '../platform/isElectron'

export const Editor: FC = () => {
  const numberEditorStep = useNumberEditorStep()

  return (
    <NumberEditorStepContext.Provider value={numberEditorStep}>
      {isElectron() ? <ElectronEditorContent /> : <EditorContent />}
    </NumberEditorStepContext.Provider>
  )
}

const ElectronEditorContent: FC = () => {
  const electronCommandsContextValue = useElectronCommandsContextValue()

  return (
    <ElectronCommandsContext.Provider value={electronCommandsContextValue}>
      <EditorContent />
    </ElectronCommandsContext.Provider>
  )
}

const EditorContent: FC = () => {
  return (
    <Box bg="bg.emphasized" height="100%" minHeight="0" minWidth="0" overflow="hidden" position="relative">
      <Box inset="0" minHeight="0" minWidth="0" overflow="hidden" position="absolute">
        <Outlet />
      </Box>
    </Box>
  )
}

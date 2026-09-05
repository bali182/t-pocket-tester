import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Provider as JotaiProvider } from 'jotai'
import { createRoot } from 'react-dom/client'
import { AppRouter } from '../common/components/AppRouter'
import { appStore } from '../common/state/store'
import { ElectronApp } from './ElectronApp'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <JotaiProvider store={appStore}>
    <ChakraProvider value={defaultSystem}>
      <AppRouter>
        <ElectronApp />
      </AppRouter>
    </ChakraProvider>
  </JotaiProvider>,
)

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Provider as JotaiProvider } from 'jotai'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import { appStore } from '../common/state/store'
import { ElectronApp } from './ElectronApp'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <JotaiProvider store={appStore}>
    <ChakraProvider value={defaultSystem}>
      <HashRouter useTransitions={false}>
        <ElectronApp />
      </HashRouter>
    </ChakraProvider>
  </JotaiProvider>,
)

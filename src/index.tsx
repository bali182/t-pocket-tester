import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Provider as JotaiProvider } from 'jotai'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './components/App'
import { appStore } from './state'
import { initializeAtomsFromStorage, subscribeToAtoms } from './storage'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

initializeAtomsFromStorage(appStore)
subscribeToAtoms(appStore)

createRoot(rootElement).render(
<ChakraProvider value={defaultSystem}>
  <JotaiProvider store={appStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </JotaiProvider>
</ChakraProvider>,
)

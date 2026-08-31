import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Provider as JotaiProvider } from 'jotai'
import { createRoot } from 'react-dom/client'
import { App } from './components/App'
import { AppRouter } from './components/AppRouter'
import { appStore } from './state/store'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <JotaiProvider store={appStore}>
    <ChakraProvider value={defaultSystem}>
      <AppRouter>
        <App />
      </AppRouter>
    </ChakraProvider>
  </JotaiProvider>,
)

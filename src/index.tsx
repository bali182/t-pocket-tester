import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Provider as JotaiProvider } from 'jotai'
import { createRoot } from 'react-dom/client'
import { App } from './components/App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <ChakraProvider value={defaultSystem}>
    <JotaiProvider>
      <App />
    </JotaiProvider>
  </ChakraProvider>,
)

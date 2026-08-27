import { ChakraProvider, defaultSystem, Theme } from '@chakra-ui/react'
import { Provider as JotaiProvider } from 'jotai'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './components/App'
import { portalRef } from './portalRef'
import { appStore } from './state/store'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <JotaiProvider store={appStore}>
    <ChakraProvider value={defaultSystem}>
      <Theme appearance="light">
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <App />
        </BrowserRouter>
        <div ref={portalRef} />
      </Theme>
    </ChakraProvider>
  </JotaiProvider>,
)

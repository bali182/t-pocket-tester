import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Provider as JotaiProvider } from 'jotai'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { appStore } from '../common/state/store'
import { WebApp } from './WebApp'
import { WebGlobalSettingsContextProvider } from './components/WebGlobalSettingsContextProvider'
import { WebThemeContextProvider } from './components/WebThemeContextProvider'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <JotaiProvider store={appStore}>
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter basename={import.meta.env.BASE_URL} useTransitions={false}>
        <WebGlobalSettingsContextProvider>
          <WebThemeContextProvider>
            <WebApp />
          </WebThemeContextProvider>
        </WebGlobalSettingsContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  </JotaiProvider>,
)

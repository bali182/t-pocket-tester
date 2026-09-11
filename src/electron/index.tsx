import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { Provider as JotaiProvider } from 'jotai'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import type { GlobalSettingsSchema } from '../common/schemas/settings'
import type { ThemeSchema } from '../common/schemas/theme'
import { appStore } from '../common/state/store'
import { createDefaultGlobalSettings } from '../common/utils/createDefaultGlobalSettings'
import { getSystemTheme } from '../common/utils/getSystemTheme'
import { setDocumentBackgroundColor } from '../common/utils/setDocumentBackgroundColor'
import { ElectronApp } from './ElectronApp'
import { ElectronGlobalSettingsContextProvider } from './components/ElectronGlobalSettingsContextProvider'
import { ElectronThemeContextProvider } from './components/ElectronThemeContextProvider'
import { electronApi } from './electronApi'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

const renderElectronApp = async (): Promise<void> => {
  let initialTheme: ThemeSchema
  let initialSettings: GlobalSettingsSchema

  try {
    initialTheme = await electronApi.getTheme()
  } catch (error) {
    console.error('Unable to initialize Electron theme:', error)
    initialTheme = getSystemTheme()
  }

  try {
    initialSettings = await electronApi.getSettings()
  } catch (error) {
    console.error('Unable to initialize Electron global settings:', error)
    initialSettings = createDefaultGlobalSettings(getSystemTheme())
  }

  setDocumentBackgroundColor(initialTheme)

  createRoot(rootElement).render(
    <JotaiProvider store={appStore}>
      <ChakraProvider value={defaultSystem}>
        <HashRouter useTransitions={false}>
          <ElectronGlobalSettingsContextProvider initialSettings={initialSettings}>
            <ElectronThemeContextProvider initialTheme={initialTheme}>
              <ElectronApp />
            </ElectronThemeContextProvider>
          </ElectronGlobalSettingsContextProvider>
        </HashRouter>
      </ChakraProvider>
    </JotaiProvider>,
  )
}

renderElectronApp()

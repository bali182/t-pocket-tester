import { useContext } from 'react'

import type { GlobalSettingsContextValue } from '../contexts/GlobalSettingsContext'
import { GlobalSettingsContext } from '../contexts/GlobalSettingsContext'
import { isDefined } from '../utils/isDefined'

export const useGlobalSettings = (): GlobalSettingsContextValue => {
  const globalSettingsContext = useContext(GlobalSettingsContext)

  if (!isDefined(globalSettingsContext)) {
    throw new Error('useGlobalSettings must be used inside GlobalSettingsContext.Provider')
  }

  return globalSettingsContext
}

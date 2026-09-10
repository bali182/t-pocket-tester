import { useSetAtom } from 'jotai'
import { useCallback } from 'react'

import { subProjectHistoryAtom } from '../state/subProjectHistoryAtom'

export type UseClearSubProjectHistoryOutput = {
  clearSubProjectHistory: () => void
}

export const useClearSubProjectHistory = (): UseClearSubProjectHistoryOutput => {
  const setSubProjectHistory = useSetAtom(subProjectHistoryAtom)

  const clearSubProjectHistory = useCallback((): void => {
    setSubProjectHistory({ histories: new Map(), activeThrottle: undefined })
  }, [setSubProjectHistory])

  return { clearSubProjectHistory }
}

import { useMemo } from 'react'
import { defaultNumberEditorStep, NumberEditorStepContextValue } from '../contexts/NumberEditorStepContext'
import { useGlobalSettings } from './useGlobalSettings'
import { useOptionalProject } from './useOptionalProject'

export const useNumberEditorStep = (): NumberEditorStepContextValue => {
  const { project } = useOptionalProject()
  const { settings } = useGlobalSettings()

  const step = settings.edit.step
  const stitchHoleDistance = project?.stitchingSettings.stitchHoleDistance ?? 1

  const value = useMemo((): NumberEditorStepContextValue => {
    if (typeof step === 'number') {
      return { step }
    }
    if (step === 'stitch-hole-distance') {
      return { step: stitchHoleDistance }
    }
    return defaultNumberEditorStep
  }, [step, stitchHoleDistance])

  return value
}

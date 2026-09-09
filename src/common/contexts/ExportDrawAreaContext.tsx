import { createContext, useContext } from 'react'

import type { DrawAreaContextValue } from '../schemas/drawArea'
import { defaultDrawAreaContext } from './drawAreaContextDefaults'

// Export rendering can run in a renderer other than the editor's React DOM renderer.
// Keep this context separate so React never renders the editor context with multiple renderers concurrently.
export const ExportDrawAreaContext = createContext<DrawAreaContextValue>(defaultDrawAreaContext)

export const useExportDrawAreaContext = (): DrawAreaContextValue => {
  return useContext(ExportDrawAreaContext)
}

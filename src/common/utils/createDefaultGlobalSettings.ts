import { defaultPdfExportParams, defaultSvgExportParams } from '../defaultStates'
import type { GlobalSettingsSchema } from '../schemas/settings'
import type { ThemeSchema } from '../schemas/theme'

export const createDefaultGlobalSettings = (theme: ThemeSchema): GlobalSettingsSchema => {
  return {
    app: {
      splitterSizes: ['auto', '350px'],
      theme,
    },
    edit: {
      addBaseColor: false,
      step: 1,
    },
    pdfExport: defaultPdfExportParams,
    recents: {},
    svgExport: defaultSvgExportParams,
    view: {
      scale: 1,
      stitchCountVisible: true,
      stitchHolesVisible: true,
      stitchLinesVisible: true,
      stitchesVisible: true,
    },
  }
}

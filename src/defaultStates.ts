import { STITCH_HOLE_COLOR, STITCH_LINE_STORKE_COLOR, STROKE_THICKNESS } from './constants/drawing'
import { PdfExportSettingsSchema } from './schemas/pdfExport'
import { BaseExportSettingsSchema } from './schemas/settings'
import { StitchLineCommonConfigSchema } from './schemas/stitching'

export const defaultStitchingSettings: StitchLineCommonConfigSchema = {
  stitchMargin: 4,
  stitchHoleLength: 1.7,
  stitchHoleDistance: 3.35,
  stitchHoleThickness: 0.3,
  stitchHoleColor: STITCH_HOLE_COLOR,
  stitchLineColor: STITCH_LINE_STORKE_COLOR,
  stitchLineThickness: STROKE_THICKNESS,
}

export const defaultSvgExportParams: BaseExportSettingsSchema = {
  gap: 10,
  padding: 10,
  stitchLineMode: 'all-stitch-lines',
  showNames: true,
  showDimensions: true,
  childMarkers: true,
  cutHelperDistance: 0,
}

export const defaultPdfExportParams: PdfExportSettingsSchema = {
  ...defaultSvgExportParams,
  page: 'A4',
  orientation: 'portrait',
  layout: 'compact',
}

import { PdfExportSettingsSchema } from './pdfExport'
import { RecentProjectsSchema } from './recentProject'
import type { ThemeSchema } from './theme'

export type NumberEditorStepSchema = number | 'stitch-hole-distance'

// Remove this type
export type ProjectEditingSettingSchema = {
  addBaseColorByDefault: boolean
  numberEditorStep: NumberEditorStepSchema
}

export type ColorSettingsSchema = {
  leatherColor: string
  stitchHoleColor: string
  stitchLineColor: string
  strokeColor: string
  selectionColor: string
  cardColor: string
  threadColor: string
}

export type ExportStitchLineModeSchema = 'own-stitch-lines' | 'all-stitch-lines'

export type BaseExportSettingsSchema = {
  gap: number
  padding: number
  stitchLineMode: ExportStitchLineModeSchema
  showNames: boolean
  showDimensions: boolean
  childMarkers: boolean
  cutHelperDistance: number
}

export type AppSettingsSchema = {
  theme: ThemeSchema
  splitterSizes: [number | string, number | string]
}

export type EditSettingSchema = {
  step: NumberEditorStepSchema
  addBaseColor: boolean
}

export type ViewSettingsSchema = {
  stitchLinesVisible: boolean
  stitchHolesVisible: boolean
  stitchesVisible: boolean
  stitchCountVisible: boolean
  scale: number
}

export type GlobalSettingsSchema = {
  app: AppSettingsSchema
  edit: EditSettingSchema
  view: ViewSettingsSchema
  svgExport: BaseExportSettingsSchema
  pdfExport: PdfExportSettingsSchema
  recents: RecentProjectsSchema
}

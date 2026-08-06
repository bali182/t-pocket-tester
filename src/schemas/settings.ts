export type AdjustCornerRadiiSchema = 'never' | 'increase' | 'sync'

export type ProjectEditingSettingSchema = {
  addComputedSizesToAutoSized: boolean
  adjustCornerRadiiToParent: boolean
  addBaseColorByDefault: boolean
}

export type ComponentBaseSettings = {
  baseColor: string
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

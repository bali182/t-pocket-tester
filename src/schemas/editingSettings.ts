export type AdjustCornerRadiiSchema = 'never' | 'increase' | 'sync'

export type ProjectEditingSettingSchema = {
  addComputedSizesToAutoSized: boolean
  adjustCornerRadiiToParent: boolean
  addBaseColorByDefault: boolean
}

export type ComponentBaseSettings = {
  baseColor: string
}

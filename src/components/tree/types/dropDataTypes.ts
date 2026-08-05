export type ComponentTreeDropPosition = 'after' | 'before' | 'inside'

export type ComponentReorderDropData = {
  kind: 'component-reorder'
  beforeComponentId: string | undefined
  targetParentId: string
}

export type ComponentAttachmentDropData = {
  kind: 'component-attachment'
  componentId: string
}

export type HoleStitchLineDropData = {
  kind: 'hole-stitch-line'
  holeId: string
}

export type TreeDropData = ComponentReorderDropData | ComponentAttachmentDropData | HoleStitchLineDropData

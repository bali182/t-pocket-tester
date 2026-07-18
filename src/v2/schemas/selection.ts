export type ComponentSelectionSchema = {
  componentId: string
  type: 'component'
}

export type StitchLineSelectionSchema = {
  stitchLineId: string
  type: 'stitch-line'
}

export type EditorSelectionSchema = ComponentSelectionSchema | StitchLineSelectionSchema

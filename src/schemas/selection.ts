export type ComponentSelectionSchema = {
  componentId: string
  type: 'component'
}

export type StitchLineSelectionSchema = {
  stitchLineId: string
  type: 'stitch-line'
}

export type HoleSelectionSchema = {
  holeId: string
  type: 'hole'
}

export type EditorSelectionSchema = ComponentSelectionSchema | StitchLineSelectionSchema | HoleSelectionSchema

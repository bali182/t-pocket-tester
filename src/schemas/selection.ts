import { HasTypeSchema } from './common'

export type ComponentSelectionSchema = HasTypeSchema<'component'> & { componentId: string }
export type StitchLineSelectionSchema = HasTypeSchema<'stitch-line'> & { stitchLineId: string }
export type HoleSelectionSchema = HasTypeSchema<'hole'> & { holeId: string }

export type SelectionSchema = ComponentSelectionSchema | StitchLineSelectionSchema | HoleSelectionSchema

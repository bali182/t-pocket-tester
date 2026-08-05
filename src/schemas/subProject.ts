import { HasIdentitySchema } from './common'
import { ComponentSchema } from './components'
import { ComputedComponentSchema, ComputedHoleSchema, ComputedStitchLineSchema } from './computed'
import { HoleSchema } from './hole'
import { StitchLineSchema } from './stitching'

export type SubProjectSchema = HasIdentitySchema & {
  root: string
  components: Record<string, ComponentSchema>
  holes: HoleSchema[]
  stitchLines: StitchLineSchema[]
}

export type ComputedSubProjectSchema = HasIdentitySchema & {
  root: string
  components: Record<string, ComputedComponentSchema>
  holes: ComputedHoleSchema[]
  stitchLines: ComputedStitchLineSchema[]
}

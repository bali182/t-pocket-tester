import { HasIdentitySchema } from './components'
import { PointSchema } from './geometry'

export type StitchHoleSchema = {
  center: PointSchema
  rotation: number
}

export type StitchingSettingsSchema = {
  stitchMargin: number
  stitchHoleLength: number
  stitchHoleDistance: number
  stitchHoleThickness: number
  stitchHoleColor: string
  stitchThreadColor: string
}

export type HorizontalStitchDirectionSchema = 'left-to-right' | 'right-to-left'
export type VerticalStitchDirectionSchema = 'top-to-bottom' | 'bottom-to-top'

export type StitchLineSchema = HasIdentitySchema &
  StitchingSettingsSchema & {
    /** Which component's bounding box are we stitching? */
    componentId: string

    // Are we stitching the given side?
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean

    topStitchDirection: HorizontalStitchDirectionSchema
    rightStitchDirection: VerticalStitchDirectionSchema
    bottomStitchDirection: HorizontalStitchDirectionSchema
    leftStitchDirection: VerticalStitchDirectionSchema

    // Are we stitching the given corner (which may or may not have a radius)?
    topLeftCorner: boolean
    topRightCorner: boolean
    bottomRightCorner: boolean
    bottomLeftCorner: boolean

    // Offsets of the sides we stitch. What are these used for?
    // For example when stitching the side of a panel to another (forming a pocket)
    // we can start stitching in between the top of the back panel and the front one, forming a stronger stitch.
    topStartOffset: number
    topEndOffset: number

    rightStartOffset: number
    rightEndOffset: number

    bottomStartOffset: number
    bottomEndOffset: number

    leftStartOffset: number
    leftEndOffset: number
  }

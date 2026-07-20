import { STROKE_THICKNESS } from '../v1/constants'
import { STITCH_HOLE_COLOR, STITCH_LINE_STORKE_COLOR } from './constants/drawing'
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

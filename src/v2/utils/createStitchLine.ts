import { STITCH_LINE_STORKE_COLOR } from '../constants/drawing'
import type { ProjectSchema } from '../schemas/project'
import type {
  StitchLineComponentReferencesSchema,
  StitchLineConfigSchema,
  StitchLineSchema,
} from '../schemas/stitching'
import { getUnusedStitchLineName } from './getUnusedStitchLineName'
import { id } from './id'

export const createStitchLine = (
  project: ProjectSchema,
  componentReferences: StitchLineComponentReferencesSchema,
): StitchLineSchema => ({
  ...defaultStitchLine,
  ...project.stitchingSettings,
  ...componentReferences,
  color: STITCH_LINE_STORKE_COLOR,
  id: id(),
  name: getUnusedStitchLineName(project),
})

const defaultStitchLine: StitchLineConfigSchema = {
  top: false,
  right: false,
  bottom: false,
  left: false,
  topLeftCorner: false,
  topRightCorner: false,
  bottomRightCorner: false,
  bottomLeftCorner: false,
  topStitchDirection: 'left-to-right',
  rightStitchDirection: 'top-to-bottom',
  bottomStitchDirection: 'right-to-left',
  leftStitchDirection: 'bottom-to-top',
  topStartOffset: 0,
  topEndOffset: 0,
  rightStartOffset: 0,
  rightEndOffset: 0,
  bottomStartOffset: 0,
  bottomEndOffset: 0,
  leftStartOffset: 0,
  leftEndOffset: 0,
}

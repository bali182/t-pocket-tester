import { ResolvedComponentBoundsStitchLineSchema } from '../../schemas/stitching'
import { StitchSidePathFragment } from './calculateStitchLinePaths'

export const isCanonicalDirection = (
  stitchLine: ResolvedComponentBoundsStitchLineSchema,
  side: StitchSidePathFragment,
): boolean => {
  switch (side.side) {
    case 'top':
      return stitchLine.topStitchDirection === 'left-to-right'
    case 'right':
      return stitchLine.rightStitchDirection === 'top-to-bottom'
    case 'bottom':
      return stitchLine.bottomStitchDirection === 'right-to-left'
    case 'left':
      return stitchLine.leftStitchDirection === 'bottom-to-top'
  }
}

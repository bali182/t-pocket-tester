import type { ComponentBoundsStitchLineSchema } from '../schemas/stitching'

export type ComponentBoundsStitchLineFlipAxis = 'horizontal' | 'vertical'

export const flipComponentBoundsStitchLine = (
  stitchLine: ComponentBoundsStitchLineSchema,
  axis: ComponentBoundsStitchLineFlipAxis,
): ComponentBoundsStitchLineSchema => {
  switch (axis) {
    case 'horizontal':
      return flipHorizontally(stitchLine)
    case 'vertical':
      return flipVertically(stitchLine)
  }
}

const flipHorizontally = (stitchLine: ComponentBoundsStitchLineSchema): ComponentBoundsStitchLineSchema => {
  return {
    ...stitchLine,
    bottomEndOffset: stitchLine.bottomStartOffset,
    bottomLeftCorner: stitchLine.bottomRightCorner,
    bottomRightCorner: stitchLine.bottomLeftCorner,
    bottomStartOffset: stitchLine.bottomEndOffset,
    left: stitchLine.right,
    leftEndOffset: stitchLine.rightStartOffset,
    leftStartOffset: stitchLine.rightEndOffset,
    leftStitchDirection: stitchLine.rightStitchDirection,
    right: stitchLine.left,
    rightEndOffset: stitchLine.leftStartOffset,
    rightStartOffset: stitchLine.leftEndOffset,
    rightStitchDirection: stitchLine.leftStitchDirection,
    topEndOffset: stitchLine.topStartOffset,
    topLeftCorner: stitchLine.topRightCorner,
    topRightCorner: stitchLine.topLeftCorner,
    topStartOffset: stitchLine.topEndOffset,
  }
}

const flipVertically = (stitchLine: ComponentBoundsStitchLineSchema): ComponentBoundsStitchLineSchema => {
  return {
    ...stitchLine,
    bottom: stitchLine.top,
    bottomEndOffset: stitchLine.topStartOffset,
    bottomLeftCorner: stitchLine.topLeftCorner,
    bottomRightCorner: stitchLine.topRightCorner,
    bottomStartOffset: stitchLine.topEndOffset,
    bottomStitchDirection: stitchLine.topStitchDirection,
    leftEndOffset: stitchLine.leftStartOffset,
    leftStartOffset: stitchLine.leftEndOffset,
    rightEndOffset: stitchLine.rightStartOffset,
    rightStartOffset: stitchLine.rightEndOffset,
    top: stitchLine.bottom,
    topEndOffset: stitchLine.bottomStartOffset,
    topLeftCorner: stitchLine.bottomLeftCorner,
    topRightCorner: stitchLine.bottomRightCorner,
    topStartOffset: stitchLine.bottomEndOffset,
    topStitchDirection: stitchLine.bottomStitchDirection,
  }
}

import type { ComputedProjectSchema, ProjectSchema } from '../schemas/project'
import type { ComponentBoundsStitchLineSchema } from '../schemas/stitching'

export const adjustStitchLines = (project: ProjectSchema, _computedProject: ComputedProjectSchema): ProjectSchema => {
  let stitchLines = project.stitchLines

  project.stitchLines.forEach((stitchLine, index) => {
    if (stitchLine.type !== 'component-bounds-stitch-line') {
      return
    }

    const adjustedStitchLine = adjustComponentBoundsStitchLine(stitchLine)

    if (adjustedStitchLine === stitchLine) {
      return
    }

    if (stitchLines === project.stitchLines) {
      stitchLines = [...project.stitchLines]
    }

    stitchLines[index] = adjustedStitchLine
  })

  return stitchLines === project.stitchLines ? project : { ...project, stitchLines }
}

const adjustComponentBoundsStitchLine = (
  stitchLine: ComponentBoundsStitchLineSchema,
): ComponentBoundsStitchLineSchema => {
  const topLeftCorner = stitchLine.topLeftCorner && (stitchLine.top || stitchLine.left)
  const topRightCorner = stitchLine.topRightCorner && (stitchLine.top || stitchLine.right)
  const bottomRightCorner = stitchLine.bottomRightCorner && (stitchLine.bottom || stitchLine.right)
  const bottomLeftCorner = stitchLine.bottomLeftCorner && (stitchLine.bottom || stitchLine.left)

  const topStitchDirection = topLeftCorner || topRightCorner ? 'left-to-right' : stitchLine.topStitchDirection
  const rightStitchDirection = topRightCorner || bottomRightCorner ? 'top-to-bottom' : stitchLine.rightStitchDirection
  const bottomStitchDirection =
    bottomLeftCorner || bottomRightCorner ? 'right-to-left' : stitchLine.bottomStitchDirection
  const leftStitchDirection = topLeftCorner || bottomLeftCorner ? 'bottom-to-top' : stitchLine.leftStitchDirection

  const topStartOffset = stitchLine.top === false || topLeftCorner ? 0 : stitchLine.topStartOffset
  const topEndOffset = stitchLine.top === false || topRightCorner ? 0 : stitchLine.topEndOffset
  const rightStartOffset = stitchLine.right === false || topRightCorner ? 0 : stitchLine.rightStartOffset
  const rightEndOffset = stitchLine.right === false || bottomRightCorner ? 0 : stitchLine.rightEndOffset
  const bottomStartOffset = stitchLine.bottom === false || bottomRightCorner ? 0 : stitchLine.bottomStartOffset
  const bottomEndOffset = stitchLine.bottom === false || bottomLeftCorner ? 0 : stitchLine.bottomEndOffset
  const leftStartOffset = stitchLine.left === false || bottomLeftCorner ? 0 : stitchLine.leftStartOffset
  const leftEndOffset = stitchLine.left === false || topLeftCorner ? 0 : stitchLine.leftEndOffset

  const isUnchanged =
    topLeftCorner === stitchLine.topLeftCorner &&
    topRightCorner === stitchLine.topRightCorner &&
    bottomRightCorner === stitchLine.bottomRightCorner &&
    bottomLeftCorner === stitchLine.bottomLeftCorner &&
    topStitchDirection === stitchLine.topStitchDirection &&
    rightStitchDirection === stitchLine.rightStitchDirection &&
    bottomStitchDirection === stitchLine.bottomStitchDirection &&
    leftStitchDirection === stitchLine.leftStitchDirection &&
    topStartOffset === stitchLine.topStartOffset &&
    topEndOffset === stitchLine.topEndOffset &&
    rightStartOffset === stitchLine.rightStartOffset &&
    rightEndOffset === stitchLine.rightEndOffset &&
    bottomStartOffset === stitchLine.bottomStartOffset &&
    bottomEndOffset === stitchLine.bottomEndOffset &&
    leftStartOffset === stitchLine.leftStartOffset &&
    leftEndOffset === stitchLine.leftEndOffset

  if (isUnchanged) {
    return stitchLine
  }

  return {
    ...stitchLine,
    topLeftCorner,
    topRightCorner,
    bottomRightCorner,
    bottomLeftCorner,
    topStitchDirection,
    rightStitchDirection,
    bottomStitchDirection,
    leftStitchDirection,
    topStartOffset,
    topEndOffset,
    rightStartOffset,
    rightEndOffset,
    bottomStartOffset,
    bottomEndOffset,
    leftStartOffset,
    leftEndOffset,
  }
}

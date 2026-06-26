import type { CardHolderInput, TopPocketModel, TopPocketStitchLinesModel } from '../types'

export const calculateTopPocketStitchLines = (
  input: CardHolderInput,
  pocket: TopPocketModel,
): TopPocketStitchLinesModel => {
  const leftX = pocket.outline.x + input.stitchMargin
  const rightX = pocket.outline.x + pocket.outline.width - input.stitchMargin
  const topY = pocket.outline.y
  const bottomY = pocket.outline.y + pocket.outline.height
  const bottomStitchY = bottomY - input.stitchMargin

  return {
    leftStitchLine: {
      start: {
        x: leftX,
        y: topY,
      },
      end: {
        x: leftX,
        y: bottomStitchY,
      },
    },
    rightStitchLine: {
      start: {
        x: rightX,
        y: topY,
      },
      end: {
        x: rightX,
        y: bottomStitchY,
      },
    },
    bottomStitchLine: {
      start: {
        x: leftX,
        y: bottomStitchY,
      },
      end: {
        x: rightX,
        y: bottomStitchY,
      },
    },
  }
}

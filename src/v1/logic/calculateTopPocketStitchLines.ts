import type { CardHolderInputSchema } from '../schemas/CardHolderInputSchema'
import type { TopPocketSchema } from '../schemas/TopPocketSchema'
import type { TopPocketStitchLinesSchema } from '../schemas/TopPocketStitchLinesSchema'

export const calculateTopPocketStitchLines = (
  input: CardHolderInputSchema,
  pocket: TopPocketSchema,
): TopPocketStitchLinesSchema => {
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

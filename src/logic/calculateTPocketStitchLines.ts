import type { CardHolderInputSchema } from '../schemas/CardHolderInputSchema'
import type { PointSchema } from '../schemas/PointSchema'
import type { TPocketSchema } from '../schemas/TPocketSchema'
import type { TPocketStitchLinesSchema } from '../schemas/TPocketStitchLinesSchema'

const interpolateXAtY = (start: PointSchema, end: PointSchema, y: number): number => {
  const ratio = (y - start.y) / (end.y - start.y)

  return start.x + (end.x - start.x) * ratio
}

export const calculateTPocketStitchLines = (
  input: CardHolderInputSchema,
  pocket: TPocketSchema,
): TPocketStitchLinesSchema => {
  const bottomStitchY = pocket.leftBottom.y - input.stitchMargin

  return {
    leftTabStitchLine: {
      start: {
        x: pocket.topLeft.x + input.stitchMargin,
        y: pocket.topLeft.y,
      },
      end: {
        x: pocket.leftTabBottom.x + input.stitchMargin,
        y: pocket.leftTabBottom.y,
      },
    },
    rightTabStitchLine: {
      start: {
        x: pocket.topRight.x - input.stitchMargin,
        y: pocket.topRight.y,
      },
      end: {
        x: pocket.rightTabBottom.x - input.stitchMargin,
        y: pocket.rightTabBottom.y,
      },
    },
    bottomStitchLine: {
      start: {
        x: interpolateXAtY(pocket.leftTrapezoidTop, pocket.leftBottom, bottomStitchY),
        y: bottomStitchY,
      },
      end: {
        x: interpolateXAtY(pocket.rightTrapezoidTop, pocket.rightBottom, bottomStitchY),
        y: bottomStitchY,
      },
    },
  }
}

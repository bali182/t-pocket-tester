import type { TopPocketSchema } from '../schemas/TopPocketSchema'

export const transformTopPocketToOrigin = (pocket: TopPocketSchema): TopPocketSchema => {
  return {
    kind: pocket.kind,
    outline: {
      x: 0,
      y: 0,
      width: pocket.outline.width,
      height: pocket.outline.height,
    },
  }
}

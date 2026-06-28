import type { TopPocketModel } from '../schemas/TopPocketModelSchema'

export const transformTopPocketToOrigin = (pocket: TopPocketModel): TopPocketModel => {
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

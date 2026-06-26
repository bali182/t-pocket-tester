import type { TopPocketModel } from '../types'

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

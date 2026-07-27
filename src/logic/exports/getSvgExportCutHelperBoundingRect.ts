import type { RectSchema } from '../../schemas/geometry'

export const getSvgExportCutHelperBoundingRect = (
  boundingRect: RectSchema,
  cutHelperDistance: number,
): RectSchema | undefined => {
  if (cutHelperDistance === 0) {
    return undefined
  }

  return {
    x: boundingRect.x.minus(cutHelperDistance),
    y: boundingRect.y.minus(cutHelperDistance),
    width: boundingRect.width.plus(cutHelperDistance * 2),
    height: boundingRect.height.plus(cutHelperDistance * 2),
  }
}

import type { RectSchema } from '../../schemas/geometry'
import type { SvgExportElementSchema } from '../../schemas/svgExport'
import { isDefined } from '../../utils/isDefined'
import { getSvgExportElementBoundingRect } from './getSvgExportElementBoundingRect'

export const getSvgExportElementLayoutBoundingRect = (element: SvgExportElementSchema): RectSchema => {
  if (isDefined(element.cutHelperBoundingRect)) {
    return element.cutHelperBoundingRect
  }

  return getSvgExportElementBoundingRect(element)
}

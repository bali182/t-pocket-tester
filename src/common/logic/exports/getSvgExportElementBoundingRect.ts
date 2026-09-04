import type { RectSchema } from '../../schemas/geometry'
import type { SvgExportElementSchema } from '../../schemas/svgExport'

export const getSvgExportElementBoundingRect = (element: SvgExportElementSchema): RectSchema => {
  switch (element.type) {
    case 'svg-export-panel':
      return element.boundingRect
    case 'svg-export-front-pocket':
    case 'svg-export-t-pocket':
      return element.pocket.boundingRect
  }
}

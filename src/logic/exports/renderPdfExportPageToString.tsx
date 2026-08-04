import { renderToString } from 'react-dom/server'

import { PdfExportPageRoot } from '../../components/pdf-export/PdfExportPageRoot'
import type { ProjectSchema } from '../../schemas/project'
import type { PdfExportPageSchema, PdfExportParamsSchema, SvgExportElementSchema } from '../../schemas/svgExport'
import type { SizeSchema } from '../../schemas/geometry'

export const renderPdfExportPageToString = (
  project: ProjectSchema,
  params: PdfExportParamsSchema,
  elements: SvgExportElementSchema[],
  page: PdfExportPageSchema,
  pageSize: SizeSchema,
): string => {
  return renderToString(
    <PdfExportPageRoot
      elements={elements}
      page={page}
      pageHeight={pageSize.height}
      pageWidth={pageSize.width}
      params={params}
      project={project}
    />,
  )
}

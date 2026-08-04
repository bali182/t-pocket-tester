import { Document, Page } from '@react-pdf/renderer'
import type { FC } from 'react'

import type { SizeSchema } from '../../schemas/geometry'
import type { ProjectSchema } from '../../schemas/project'
import type {
  PdfExportParamsSchema,
  SuccessfulPdfExportLayoutSchema,
  SvgExportElementSchema,
} from '../../schemas/svgExport'
import { PdfPageRoot } from './PdfPageRoot'

type PdfDocumentProps = {
  elements: SvgExportElementSchema[]
  layout: SuccessfulPdfExportLayoutSchema
  pageSize: SizeSchema
  params: PdfExportParamsSchema
  project: ProjectSchema
}

export const PdfDocument: FC<PdfDocumentProps> = ({ elements, layout, pageSize, params, project }) => {
  return (
    <Document>
      {layout.pages.map((page, pageIndex) => (
        <Page
          key={pageIndex}
          size={[`${pageSize.width.toString()}mm`, `${pageSize.height.toString()}mm`]}
          style={{ padding: 0 }}
        >
          <PdfPageRoot elements={elements} page={page} params={params} project={project} />
        </Page>
      ))}
    </Document>
  )
}

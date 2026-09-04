import { Document, Page } from '@react-pdf/renderer'
import type { FC } from 'react'

import type { SizeSchema } from '../../schemas/geometry'
import type { PdfExportSettingsSchema, PdfExportSuccessfulLayoutSchema } from '../../schemas/pdfExport'
import type { ProjectSchema } from '../../schemas/project'
import { PdfPageRoot } from './PdfPageRoot'

type PdfDocumentProps = {
  layout: PdfExportSuccessfulLayoutSchema
  pageSize: SizeSchema
  settings: PdfExportSettingsSchema
  project: ProjectSchema
}

export const PdfDocument: FC<PdfDocumentProps> = ({ layout, pageSize, settings, project }) => {
  return (
    <Document>
      {layout.pages.map((page, pageIndex) => (
        <Page
          key={pageIndex}
          size={[`${pageSize.width.toString()}mm`, `${pageSize.height.toString()}mm`]}
          style={{ padding: 0 }}
        >
          <PdfPageRoot page={page} project={project} settings={settings} />
        </Page>
      ))}
    </Document>
  )
}

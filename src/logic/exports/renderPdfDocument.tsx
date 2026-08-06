import { PdfDocument } from '../../components/pdf-export/PdfDocument'
import type { SizeSchema } from '../../schemas/geometry'
import type { PdfExportSettingsSchema, PdfExportSuccessfulLayoutSchema } from '../../schemas/pdfExport'
import type { ProjectSchema } from '../../schemas/project'

export const renderPdfDocument = (
  project: ProjectSchema,
  settings: PdfExportSettingsSchema,
  layout: PdfExportSuccessfulLayoutSchema,
  pageSize: SizeSchema,
) => {
  return (
    <PdfDocument
      layout={layout}
      pageSize={pageSize}
      settings={settings}
      project={project}
    />
  )
}

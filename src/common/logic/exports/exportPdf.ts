import { pdf } from '@react-pdf/renderer'

import type { PdfExportSettingsSchema, PdfExportSuccessfulLayoutSchema } from '../../schemas/pdfExport'
import type { ProjectSchema } from '../../schemas/project'
import { getPdfExportPageSize } from './getPdfExportLayout'
import { renderPdfDocument } from './renderPdfDocument'

export const exportPdf = async (
  project: ProjectSchema,
  settings: PdfExportSettingsSchema,
  layout: PdfExportSuccessfulLayoutSchema,
): Promise<void> => {
  const pageSize = getPdfExportPageSize(settings)
  const blob = await pdf(renderPdfDocument(project, settings, layout, pageSize)).toBlob()

  downloadPdf(blob, `${project.name}.pdf`)
}

const downloadPdf = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  anchor.click()

  URL.revokeObjectURL(url)
}

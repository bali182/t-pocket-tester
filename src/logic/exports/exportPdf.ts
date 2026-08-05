import { pdf } from '@react-pdf/renderer'

import type { SubProjectSchema } from '../../schemas/subProject'
import type { ProjectSchema } from '../../schemas/project'
import type {
  PdfExportParamsSchema,
  SuccessfulPdfExportLayoutSchema,
  SvgExportElementSchema,
} from '../../schemas/svgExport'
import { getPdfExportPageSize } from './getPdfExportLayout'
import { renderPdfDocument } from './renderPdfDocument'

export const exportPdf = async (
  project: ProjectSchema,
  subProject: SubProjectSchema,
  params: PdfExportParamsSchema,
  elements: SvgExportElementSchema[],
  layout: SuccessfulPdfExportLayoutSchema,
): Promise<void> => {
  const pageSize = getPdfExportPageSize(params)
  const blob = await pdf(renderPdfDocument(project, subProject, params, elements, layout, pageSize)).toBlob()

  downloadPdf(blob, `${subProject.name}.pdf`)
}

const downloadPdf = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  anchor.click()

  URL.revokeObjectURL(url)
}

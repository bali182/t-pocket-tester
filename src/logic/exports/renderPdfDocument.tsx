import { PdfDocument } from '../../components/pdf-export/PdfDocument'
import type { SizeSchema } from '../../schemas/geometry'
import { PdfExportSettingsSchema, PdfExportSuccessfulLayoutSchema } from '../../schemas/pdfExport'
import type { ProjectSchema } from '../../schemas/project'
import type { SubProjectSchema } from '../../schemas/subProject'
import type { SvgExportElementSchema } from '../../schemas/svgExport'

export const renderPdfDocument = (
  project: ProjectSchema,
  subProject: SubProjectSchema,
  params: PdfExportSettingsSchema,
  elements: SvgExportElementSchema[],
  layout: PdfExportSuccessfulLayoutSchema,
  pageSize: SizeSchema,
) => {
  return (
    <PdfDocument
      elements={elements}
      layout={layout}
      pageSize={pageSize}
      params={params}
      project={project}
      subProject={subProject}
    />
  )
}

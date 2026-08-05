import { PdfDocument } from '../../components/pdf-export/PdfDocument'
import type { SizeSchema } from '../../schemas/geometry'
import type { ProjectSchema } from '../../schemas/project'
import type {
  PdfExportParamsSchema,
  SuccessfulPdfExportLayoutSchema,
  SvgExportElementSchema,
} from '../../schemas/svgExport'

export const renderPdfDocument = (
  project: ProjectSchema,
  params: PdfExportParamsSchema,
  elements: SvgExportElementSchema[],
  layout: SuccessfulPdfExportLayoutSchema,
  pageSize: SizeSchema,
) => {
  return <PdfDocument elements={elements} layout={layout} pageSize={pageSize} params={params} project={project} />
}

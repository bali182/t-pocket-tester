import { PdfDocument } from '../../components/pdf-export/PdfDocument'
import type { SizeSchema } from '../../schemas/geometry'
import type { SubProjectSchema } from '../../schemas/subProject'
import type { ProjectSchema } from '../../schemas/project'
import type {
  PdfExportParamsSchema,
  SuccessfulPdfExportLayoutSchema,
  SvgExportElementSchema,
} from '../../schemas/svgExport'

export const renderPdfDocument = (
  project: ProjectSchema,
  subProject: SubProjectSchema,
  params: PdfExportParamsSchema,
  elements: SvgExportElementSchema[],
  layout: SuccessfulPdfExportLayoutSchema,
  pageSize: SizeSchema,
) => {
  return <PdfDocument elements={elements} layout={layout} pageSize={pageSize} params={params} project={project} subProject={subProject} />
}

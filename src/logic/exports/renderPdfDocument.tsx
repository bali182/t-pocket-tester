import { PdfDocument } from '../../components/pdf-export/PdfDocument'
import type { SizeSchema } from '../../schemas/geometry'
import type { SubProjectSchema } from '../../schemas/subProject'
import type {
  PdfExportParamsSchema,
  SuccessfulPdfExportLayoutSchema,
  SvgExportElementSchema,
} from '../../schemas/svgExport'

export const renderPdfDocument = (
  subProject: SubProjectSchema,
  params: PdfExportParamsSchema,
  elements: SvgExportElementSchema[],
  layout: SuccessfulPdfExportLayoutSchema,
  pageSize: SizeSchema,
) => {
  return <PdfDocument elements={elements} layout={layout} pageSize={pageSize} params={params} subProject={subProject} />
}

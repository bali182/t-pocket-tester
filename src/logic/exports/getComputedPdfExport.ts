import type { ComputedProjectSchema, ProjectSchema } from '../../schemas/project'
import type { PdfExportLayoutSchema, PdfExportParamsSchema, SvgExportElementSchema } from '../../schemas/svgExport'
import { getPdfExportLayout } from './getPdfExportLayout'
import { getSvgExportElementsForComponent } from './getComputedSvgExport'

export const getComputedPdfExport = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
  params: PdfExportParamsSchema,
): {
  elements: SvgExportElementSchema[]
  layout: PdfExportLayoutSchema
} => {
  const elements = getSvgExportElementsForComponent(project, computedProject, project.root, params)

  return {
    elements,
    layout: getPdfExportLayout(elements, params),
  }
}

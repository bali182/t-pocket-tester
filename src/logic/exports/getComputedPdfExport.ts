import type { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'
import type { ProjectSchema } from '../../schemas/project'
import type { PdfExportLayoutSchema, PdfExportParamsSchema, SvgExportElementSchema } from '../../schemas/svgExport'
import { getPdfExportLayout } from './getPdfExportLayout'
import { getSvgExportElementsForComponent } from './getComputedSvgExport'

export const getComputedPdfExport = (
  project: ProjectSchema,
  subProject: SubProjectSchema,
  computedProject: ComputedSubProjectSchema,
  params: PdfExportParamsSchema,
): {
  elements: SvgExportElementSchema[]
  layout: PdfExportLayoutSchema
} => {
  const elements = getSvgExportElementsForComponent(
    subProject,
    computedProject,
    subProject.root,
    params,
    project.stitchingSettings,
  )

  return {
    elements,
    layout: getPdfExportLayout(elements, params),
  }
}

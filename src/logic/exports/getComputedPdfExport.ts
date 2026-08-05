import type { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'
import type { PdfExportLayoutSchema, PdfExportParamsSchema, SvgExportElementSchema } from '../../schemas/svgExport'
import { getPdfExportLayout } from './getPdfExportLayout'
import { getSvgExportElementsForComponent } from './getComputedSvgExport'

export const getComputedPdfExport = (
  subProject: SubProjectSchema,
  computedProject: ComputedSubProjectSchema,
  params: PdfExportParamsSchema,
): {
  elements: SvgExportElementSchema[]
  layout: PdfExportLayoutSchema
} => {
  const elements = getSvgExportElementsForComponent(subProject, computedProject, subProject.root, params)

  return {
    elements,
    layout: getPdfExportLayout(elements, params),
  }
}

import { PdfExportLayoutSchema, PdfExportSettingsSchema } from '../../schemas/pdfExport'
import type { ProjectSchema } from '../../schemas/project'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'
import type { SvgExportElementSchema } from '../../schemas/svgExport'
import { getSvgExportElementsForComponent } from './getComputedSvgExport'
import { getPdfExportLayout } from './getPdfExportLayout'

// TODO WTF IS THIS RETURN TYPE????
export const getComputedPdfExport = (
  project: ProjectSchema,
  subProject: SubProjectSchema,
  computedProject: ComputedSubProjectSchema,
  params: PdfExportSettingsSchema,
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

import { jsPDF } from 'jspdf'
import 'svg2pdf.js'

import type { ProjectSchema } from '../../schemas/project'
import type {
  PdfExportParamsSchema,
  SuccessfulPdfExportLayoutSchema,
  SvgExportElementSchema,
} from '../../schemas/svgExport'
import { getPdfExportPageSize } from './getPdfExportLayout'
import { renderPdfExportPageToString } from './renderPdfExportPageToString'

export const exportPdf = async (
  project: ProjectSchema,
  params: PdfExportParamsSchema,
  elements: SvgExportElementSchema[],
  layout: SuccessfulPdfExportLayoutSchema,
): Promise<void> => {
  const pageSize = getPdfExportPageSize(params)
  const pdf = new jsPDF({
    format: [pageSize.width.toNumber(), pageSize.height.toNumber()],
    orientation: params.orientation,
    unit: 'mm',
  })

  for (const [index, page] of layout.pages.entries()) {
    if (index > 0) {
      pdf.addPage([pageSize.width.toNumber(), pageSize.height.toNumber()], params.orientation)
    }

    const svg = renderPdfExportPageToString(project, params, elements, page, pageSize)
    const svgElement = getSvgElement(svg)

    await pdf.svg(svgElement, {
      height: pageSize.height.toNumber(),
      width: pageSize.width.toNumber(),
      x: 0,
      y: 0,
    })
  }

  pdf.save(`${project.name}.pdf`)
}

const getSvgElement = (svg: string): SVGSVGElement => {
  const documentFragment = new DOMParser().parseFromString(svg, 'image/svg+xml')
  const svgElement = documentFragment.documentElement

  if (!(svgElement instanceof SVGSVGElement)) {
    throw new Error('Expected an SVG export root')
  }

  return svgElement
}

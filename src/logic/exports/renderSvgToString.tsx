import { renderToString } from 'react-dom/server'

import { SvgExportRoot } from '../../components/svg-export/SvgExportRoot'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'
import type { SvgExportParamsSchema } from '../../schemas/svgExport'
import { getComputedSvgExport } from './getComputedSvgExport'

export const renderSvgToString = (
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
  params: SvgExportParamsSchema,
): string => {
  const svgExport = getComputedSvgExport(subProject, computedSubProject, params)
  return renderToString(<SvgExportRoot subProject={subProject} svgExport={svgExport} />)
}

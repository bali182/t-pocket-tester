import { renderToString } from 'react-dom/server'

import { SvgExportRoot } from '../../components/svg-export/SvgExportRoot'
import type { ComputedProjectSchema, ProjectSchema } from '../../schemas/project'
import type { SvgExportParamsSchema } from '../../schemas/svgExport'
import { getComputedSvgExport } from './getComputedSvgExport'

export const renderSvgToString = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
  params: SvgExportParamsSchema,
): string => {
  const svgExport = getComputedSvgExport(project, computedProject, params)

  return renderToString(<SvgExportRoot project={project} svgExport={svgExport} />)
}

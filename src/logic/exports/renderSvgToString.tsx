import { renderToString } from 'react-dom/server'

import { SvgExportRoot } from '../../components/svg-export/SvgExportRoot'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'
import type { ProjectSchema } from '../../schemas/project'
import type { SvgExportParamsSchema } from '../../schemas/svgExport'
import { getComputedSvgExport } from './getComputedSvgExport'

export const renderSvgToString = (
  project: ProjectSchema,
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
  params: SvgExportParamsSchema,
): string => {
  const svgExport = getComputedSvgExport(subProject, computedSubProject, params, project.stitchingSettings)
  return renderToString(<SvgExportRoot project={project} subProject={subProject} svgExport={svgExport} />)
}

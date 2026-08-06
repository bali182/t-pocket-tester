import { renderToString } from 'react-dom/server'

import { SvgExportRoot } from '../../components/svg-export/SvgExportRoot'
import type { ProjectSchema } from '../../schemas/project'
import { BaseExportSettingsSchema } from '../../schemas/settings'
import type { ComputedSubProjectSchema, SubProjectSchema } from '../../schemas/subProject'
import { getComputedSvgExport } from './getComputedSvgExport'

export const renderSvgToString = (
  project: ProjectSchema,
  subProject: SubProjectSchema,
  computedSubProject: ComputedSubProjectSchema,
  params: BaseExportSettingsSchema,
): string => {
  const svgExport = getComputedSvgExport(subProject, computedSubProject, params, project.stitchingSettings)
  return renderToString(<SvgExportRoot project={project} subProject={subProject} svgExport={svgExport} />)
}

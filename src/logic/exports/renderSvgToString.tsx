import { renderToString } from 'react-dom/server'

import { SvgExportRoot } from '../../components/svg-export/SvgExportRoot'
import type { ComputedProjectSchema, ProjectSchema } from '../../schemas/project'
import type { BaseExportSettingsSchema } from '../../schemas/settings'
import { getComputedSvgExport } from './getComputedSvgExport'

export const renderSvgToString = (
  project: ProjectSchema,
  computedProject: ComputedProjectSchema,
  settings: BaseExportSettingsSchema,
): string => {
  const svgExport = getComputedSvgExport(project, computedProject, settings)
  return renderToString(<SvgExportRoot project={project} svgExport={svgExport} />)
}

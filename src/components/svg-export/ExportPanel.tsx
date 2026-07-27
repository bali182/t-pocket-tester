import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import type { SvgExportPanelSchema } from '../../schemas/svgExport'
import { isDefined } from '../../utils/isDefined'
import { ExportElementText } from './ExportElementText'
import { ExportMarkerPath } from './ExportMarkerPath'
import { ExportStitchLine } from './ExportStitchLine'

type ExportPanelProps = {
  element: SvgExportPanelSchema
}

export const ExportPanel: FC<ExportPanelProps> = ({ element }) => {
  const { componentStyles } = useDrawAreaContext()
  const pathData = usePath(element.path)

  return (
    <g>
      {isDefined(element.cutHelper) && <ExportMarkerPath path={element.cutHelper} />}
      <path
        d={pathData}
        fill={componentStyles.getBackgroundColor(element.component, 0, false)}
        stroke={componentStyles.getBorderColor(element.component, false)}
        strokeWidth={componentStyles.getBorderThickness(element.component, false)}
      />

      {element.childMarkerPaths.map((path, index) => (
        <ExportMarkerPath key={index} path={path} />
      ))}

      {element.stitchLines.map((stitchLine) => (
        <ExportStitchLine key={stitchLine.stitchLine.id} stitchLine={stitchLine} />
      ))}

      <ExportElementText element={element} />
    </g>
  )
}

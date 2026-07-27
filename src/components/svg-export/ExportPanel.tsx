import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import { PathSchema } from '../../schemas/geometry'
import type { SvgExportPanelSchema } from '../../schemas/svgExport'
import { ExportElementText } from './ExportElementText'
import { ExportStitchLine } from './ExportStitchLine'

type ExportPanelProps = {
  element: SvgExportPanelSchema
}

export const ExportPanel: FC<ExportPanelProps> = ({ element }) => {
  const { componentStyles } = useDrawAreaContext()
  const pathData = usePath(element.path)

  return (
    <g>
      <path
        d={pathData}
        fill={componentStyles.getBackgroundColor(element.component, 0, false)}
        stroke={componentStyles.getBorderColor(element.component, false)}
        strokeWidth={componentStyles.getBorderThickness(element.component, false)}
      />

      {element.childMarkerPaths.map((path, index) => (
        <ExportChildMarkerPath key={index} path={path} />
      ))}

      {element.stitchLines.map((stitchLine) => (
        <ExportStitchLine key={stitchLine.stitchLine.id} stitchLine={stitchLine} />
      ))}

      <ExportElementText element={element} />
    </g>
  )
}

type ExportChildMarkerPathProps = {
  path: PathSchema
}

const ExportChildMarkerPath: FC<ExportChildMarkerPathProps> = ({ path }) => {
  const { childMarkerStyles } = useDrawAreaContext()
  const pathData = usePath(path)

  return (
    <path
      d={pathData}
      fill="none"
      stroke={childMarkerStyles.getColor()}
      strokeWidth={childMarkerStyles.getThickness()}
    />
  )
}

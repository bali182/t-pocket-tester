import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import type { SvgExportTPocketSchema } from '../../schemas/svgExport'
import { ExportElementText } from './ExportElementText'
import { ExportStitchLine } from './ExportStitchLine'

type ExportTPocketProps = {
  element: SvgExportTPocketSchema
}

export const ExportTPocket: FC<ExportTPocketProps> = ({ element }) => {
  const { componentStyles } = useDrawAreaContext()
  const pathData = usePath(element.pocket.path)

  return (
    <g>
      <path
        d={pathData}
        fill={componentStyles.getBackgroundColor(element.ownerComponent, 0, false)}
        stroke={componentStyles.getBorderColor(element.ownerComponent, false)}
        strokeWidth={componentStyles.getBorderThickness(element.ownerComponent, false)}
      />

      {element.stitchLines.map((stitchLine) => (
        <ExportStitchLine key={stitchLine.stitchLine.id} stitchLine={stitchLine} />
      ))}

      <ExportElementText element={element} />
    </g>
  )
}

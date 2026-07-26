import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import type { SvgExportPanelSchema } from '../../schemas/svgExport'
import { ExportStitchLine } from './ExportStitchLine'

type ExportPanelProps = {
  element: SvgExportPanelSchema
}

export const ExportPanel: FC<ExportPanelProps> = ({ element }) => {
  const { componentStyles } = useDrawAreaContext()
  const pathData = usePath(element.path)

  return (
    <>
      <path
        d={pathData}
        fill={componentStyles.getBackgroundColor(element.component, 0, false)}
        stroke={componentStyles.getBorderColor(element.component, false)}
        strokeWidth={componentStyles.getBorderThickness(element.component, false)}
      />

      {element.stitchLines.map((stitchLine) => (
        <ExportStitchLine key={stitchLine.stitchLine.id} stitchLine={stitchLine} />
      ))}
    </>
  )
}

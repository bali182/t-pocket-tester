import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import type { SvgExportFrontPocketSchema } from '../../schemas/svgExport'
import { ExportStitchLine } from './ExportStitchLine'

type ExportFrontPocketProps = {
  element: SvgExportFrontPocketSchema
}

export const ExportFrontPocket: FC<ExportFrontPocketProps> = ({ element }) => {
  const { componentStyles } = useDrawAreaContext()
  const pathData = usePath(element.pocket.path)

  return (
    <>
      <path
        d={pathData}
        fill={componentStyles.getBackgroundColor(element.ownerComponent, 0, false)}
        stroke={componentStyles.getBorderColor(element.ownerComponent, false)}
        strokeWidth={componentStyles.getBorderThickness(element.ownerComponent, false)}
      />

      {element.stitchLines.map((stitchLine) => (
        <ExportStitchLine key={stitchLine.stitchLine.id} stitchLine={stitchLine} />
      ))}
    </>
  )
}

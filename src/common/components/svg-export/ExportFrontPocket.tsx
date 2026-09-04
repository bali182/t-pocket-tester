import type { FC } from 'react'

import { useDrawAreaContext, type DrawAreaComponentStyleParams } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import type { SvgExportFrontPocketSchema } from '../../schemas/svgExport'
import { isDefined } from '../../utils/isDefined'
import { ExportElementText } from './ExportElementText'
import { ExportMarkerPath } from './ExportMarkerPath'
import { ExportStitchLine } from './ExportStitchLine'

type ExportFrontPocketProps = {
  element: SvgExportFrontPocketSchema
}

export const ExportFrontPocket: FC<ExportFrontPocketProps> = ({ element }) => {
  const { componentStyles, exportIdentifiers } = useDrawAreaContext()
  const pathData = usePath(element.pocket.path)
  const styleParams: DrawAreaComponentStyleParams = {
    component: element.ownerComponent,
    isHovered: false,
    nestingLevel: 0,
  }

  return (
    <g data-element-id={exportIdentifiers.getElementId(element)}>
      {isDefined(element.cutHelper) && <ExportMarkerPath path={element.cutHelper} />}
      <path
        d={pathData}
        fill={componentStyles.getBackgroundColor(styleParams)}
        stroke={componentStyles.getBorderColor(styleParams)}
        strokeWidth={componentStyles.getBorderThickness(styleParams)}
      />

      {element.stitchLines.map((stitchLine) => (
        <ExportStitchLine key={stitchLine.stitchLine.id} stitchLine={stitchLine} />
      ))}

      <ExportElementText element={element} />
    </g>
  )
}

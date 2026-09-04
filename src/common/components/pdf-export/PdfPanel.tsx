import { G, Path } from '@react-pdf/renderer'
import type { FC } from 'react'

import { useDrawAreaContext, type DrawAreaComponentStyleParams } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import type { SvgExportPanelSchema } from '../../schemas/svgExport'
import { isDefined } from '../../utils/isDefined'
import { PdfElementText } from './PdfElementText'
import { PdfMarkerPath } from './PdfMarkerPath'
import { PdfStitchLine } from './PdfStitchLine'

type PdfPanelProps = {
  element: SvgExportPanelSchema
}

export const PdfPanel: FC<PdfPanelProps> = ({ element }) => {
  const { componentStyles } = useDrawAreaContext()
  const pathData = usePath(element.path)
  const styleParams: DrawAreaComponentStyleParams = {
    component: element.component,
    isHovered: false,
    nestingLevel: 0,
  }

  return (
    <G>
      {isDefined(element.cutHelper) && <PdfMarkerPath path={element.cutHelper} />}
      <Path
        d={pathData}
        fill={componentStyles.getBackgroundColor(styleParams)}
        stroke={componentStyles.getBorderColor(styleParams)}
        strokeWidth={componentStyles.getBorderThickness(styleParams)}
      />
      {element.childMarkerPaths.map((path, index) => (
        <PdfMarkerPath key={index} path={path} />
      ))}
      {element.stitchLines.map((stitchLine) => (
        <PdfStitchLine key={stitchLine.stitchLine.id} stitchLine={stitchLine} />
      ))}
      <PdfElementText element={element} />
    </G>
  )
}

import { G, Path } from '@react-pdf/renderer'
import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import type { SvgExportTPocketSchema } from '../../schemas/svgExport'
import { isDefined } from '../../utils/isDefined'
import { PdfElementText } from './PdfElementText'
import { PdfMarkerPath } from './PdfMarkerPath'
import { PdfStitchLine } from './PdfStitchLine'

type PdfTPocketProps = {
  element: SvgExportTPocketSchema
}

export const PdfTPocket: FC<PdfTPocketProps> = ({ element }) => {
  const { componentStyles } = useDrawAreaContext()
  const pathData = usePath(element.pocket.path)

  return (
    <G>
      {isDefined(element.cutHelper) && <PdfMarkerPath path={element.cutHelper} />}
      <Path
        d={pathData}
        fill={componentStyles.getBackgroundColor(element.ownerComponent, 0, false)}
        stroke={componentStyles.getBorderColor(element.ownerComponent, false)}
        strokeWidth={componentStyles.getBorderThickness(element.ownerComponent, false)}
      />
      {element.stitchLines.map((stitchLine) => (
        <PdfStitchLine key={stitchLine.stitchLine.id} stitchLine={stitchLine} />
      ))}
      <PdfElementText element={element} />
    </G>
  )
}

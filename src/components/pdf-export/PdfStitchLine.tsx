import { G, Path } from '@react-pdf/renderer'
import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import type { PathSchema } from '../../schemas/geometry'
import type { SvgExportStitchLineSchema } from '../../schemas/svgExport'
import { PdfStitchHole } from './PdfStitchHole'

type PdfStitchLineProps = {
  stitchLine: SvgExportStitchLineSchema
}

type PdfStitchPathProps = {
  path: PathSchema
  stitchLine: SvgExportStitchLineSchema
}

export const PdfStitchLine: FC<PdfStitchLineProps> = ({ stitchLine }) => {
  return (
    <G>
      {stitchLine.paths.map((path, index) => (
        <PdfStitchPath key={index} path={path} stitchLine={stitchLine} />
      ))}
      {stitchLine.holes.map((hole, index) => (
        <PdfStitchHole
          hole={hole}
          key={index}
          stitchHoleLength={stitchLine.stitchLine.stitchHoleLength}
          stitchLine={stitchLine.stitchLine}
        />
      ))}
    </G>
  )
}

const PdfStitchPath: FC<PdfStitchPathProps> = ({ path, stitchLine }) => {
  const { stitchLineStyles } = useDrawAreaContext()
  const pathData = usePath(path)

  return (
    <Path
      d={pathData}
      fill="none"
      stroke={stitchLineStyles.getLineColor(stitchLine.stitchLine)}
      strokeWidth={stitchLineStyles.getLineThickness(stitchLine.stitchLine)}
    />
  )
}

import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import type { PathSchema } from '../../schemas/geometry'
import type { SvgExportStitchLineSchema } from '../../schemas/svgExport'
import { StitchHole } from '../svg/StitchHole'

type ExportStitchLineProps = {
  stitchLine: SvgExportStitchLineSchema
}

type ExportStitchPathProps = {
  path: PathSchema
  stitchLine: SvgExportStitchLineSchema
}

export const ExportStitchLine: FC<ExportStitchLineProps> = ({ stitchLine }) => {
  return (
    <g>
      {stitchLine.paths.map((path, index) => (
        <ExportStitchPath key={index} path={path} stitchLine={stitchLine} />
      ))}

      {stitchLine.holes.map((hole, index) => (
        <StitchHole hole={hole} key={index} stitchLine={stitchLine.stitchLine} />
      ))}
    </g>
  )
}

const ExportStitchPath: FC<ExportStitchPathProps> = ({ path, stitchLine }) => {
  const { stitchLineStyles, exportIdentifiers } = useDrawAreaContext()
  const pathData = usePath(path)

  return (
    <path
      data-stitch-line={exportIdentifiers.getStitchLineId(stitchLine.stitchLine)}
      d={pathData}
      fill="none"
      stroke={stitchLineStyles.getLineColor(stitchLine.stitchLine)}
      strokeWidth={stitchLineStyles.getLineThickness(stitchLine.stitchLine)}
    />
  )
}

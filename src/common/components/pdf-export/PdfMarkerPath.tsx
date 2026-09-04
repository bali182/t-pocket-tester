import { Path } from '@react-pdf/renderer'
import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { usePath } from '../../hooks/usePath'
import type { PathSchema } from '../../schemas/geometry'

type PdfMarkerPathProps = {
  path: PathSchema
}

export const PdfMarkerPath: FC<PdfMarkerPathProps> = ({ path }) => {
  const { markerStyles } = useDrawAreaContext()
  const pathData = usePath(path)

  return <Path d={pathData} fill="none" stroke={markerStyles.getColor()} strokeWidth={markerStyles.getThickness()} />
}

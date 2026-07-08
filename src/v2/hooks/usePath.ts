import { useMemo } from 'react'

import { getSvgPathData } from '../logic/path/getSvgPathData'
import type { Path } from '../schemas/geometry'

export const usePath = (path: Path): string => {
  return useMemo(() => getSvgPathData(path), [path])
}

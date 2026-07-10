import { useMemo } from 'react'

import { getSvgPathData } from '../logic/getSvgPathData'
import type { PathSchema } from '../schemas/geometry'

export const usePath = (path: PathSchema): string => {
  return useMemo(() => getSvgPathData(path), [path])
}

import type { FC } from 'react'

import { getStitchingHoles } from '../logic/getStitchingHoles'
import type { LineModel, StitchingConfig } from '../types'
import { CenteredLayout } from './CenteredLayout'
import { Line } from './svg/Line'
import { StitchHoles } from './svg/StitchHoles'

const lines: LineModel[] = [
  {
    start: { x: 10, y: 10 },
    end: { x: 10, y: 40 },
  },
  {
    start: { x: 20, y: 10 },
    end: { x: 100, y: 10 },
  },
  {
    start: { x: 20, y: 20 },
    end: { x: 50, y: 50 },
  },
  {
    start: { x: 70, y: 90 },
    end: { x: 10, y: 50 },
  },
]

const stitchingConfig: StitchingConfig = {
  stitchDistance: 3.38,
  stitchLength: 1.7,
}

const holes = lines.map((line) => getStitchingHoles(line, stitchingConfig))

export const TestRoute: FC = () => {
  return (
    <CenteredLayout>
      <svg width="200mm" height="200mm" viewBox="0 0 200 200">
        {lines.map((l, i) => (
          <Line line={l} key={i} />
        ))}
        {holes.map((h, i) => (
          <StitchHoles holes={h} key={i} />
        ))}
      </svg>
    </CenteredLayout>
  )
}

import type BigNumber from 'bignumber.js'

import type { PathSchema, PointSchema } from '../schemas/geometry'

export const calculateCirclePath = (center: PointSchema, radius: BigNumber): PathSchema => {
  const top: PointSchema = {
    x: center.x,
    y: center.y.minus(radius),
  }
  const right: PointSchema = {
    x: center.x.plus(radius),
    y: center.y,
  }
  const bottom: PointSchema = {
    x: center.x,
    y: center.y.plus(radius),
  }
  const left: PointSchema = {
    x: center.x.minus(radius),
    y: center.y,
  }

  return {
    commands: [
      { type: 'moveTo', point: top },
      { type: 'arcTo', radius, point: right },
      { type: 'arcTo', radius, point: bottom },
      { type: 'arcTo', radius, point: left },
      { type: 'arcTo', radius, point: top },
      { type: 'close' },
    ],
  }
}

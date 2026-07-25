import BigNumber from 'bignumber.js'
import { useMemo, type FC } from 'react'
import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { NumberLineSchema } from '../../schemas/geometry'
import { StitchHoleSchema, StitchLineSchema } from '../../schemas/stitching'

type StitchHoleProps = {
  hole: StitchHoleSchema
  stitchHoleLength: number
  stitchLine: StitchLineSchema
}

export const StitchHole: FC<StitchHoleProps> = ({ hole, stitchHoleLength, stitchLine }) => {
  const { stitchLineStyles } = useDrawAreaContext()
  const line = useStitchHoleLine(hole, stitchHoleLength)

  return (
    <line
      x1={line.start.x}
      y1={line.start.y}
      x2={line.end.x}
      y2={line.end.y}
      stroke={stitchLineStyles.getStitchHoleColor(stitchLine)}
      strokeWidth={stitchLineStyles.getStitchHoleThickness(stitchLine)}
    />
  )
}

const useStitchHoleLine = (hole: StitchHoleSchema, stitchHoleLength: number): NumberLineSchema => {
  return useMemo<NumberLineSchema>(() => {
    const angleInRadians = new BigNumber(45).plus(hole.rotation).times(Math.PI).div(180)
    const halfLength = new BigNumber(stitchHoleLength).div(2)

    // TODO replace BigNumber lib to one that has sin/cos.
    const dx = new BigNumber(Math.cos(angleInRadians.toNumber())).times(halfLength)
    const dy = new BigNumber(Math.sin(angleInRadians.toNumber())).times(halfLength)

    const centerX = new BigNumber(hole.center.x)
    const centerY = new BigNumber(hole.center.y)

    return {
      start: { x: centerX.minus(dx).toNumber(), y: centerY.minus(dy).toNumber() },
      end: { x: centerX.plus(dx).toNumber(), y: centerY.plus(dy).toNumber() },
    }
  }, [hole.center.x, hole.center.y, hole.rotation, stitchHoleLength])
}

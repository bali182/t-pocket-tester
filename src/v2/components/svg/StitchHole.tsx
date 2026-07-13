import BigNumber from 'bignumber.js'
import { useMemo, type FC } from 'react'
import { NumberLineSchema } from '../../schemas/geometry'
import { StitchHoleSchema, StitchingSettingsSchema } from '../../schemas/stitching'

type StitchHoleProps = {
  hole: StitchHoleSchema
  settings: StitchingSettingsSchema
}

export const StitchHole: FC<StitchHoleProps> = (props) => {
  const line = useStitchHoleLine(props)
  const { settings } = props
  return (
    <line
      x1={line.start.x}
      y1={line.start.y}
      x2={line.end.x}
      y2={line.end.y}
      stroke={settings.stitchHoleColor}
      strokeWidth={settings.stitchHoleThickness}
    />
  )
}

const useStitchHoleLine = (props: StitchHoleProps) => {
  const { hole, settings } = props

  return useMemo<NumberLineSchema>(() => {
    const angleInRadians = new BigNumber(45).plus(hole.rotation).times(Math.PI).div(180)
    const halfLength = new BigNumber(settings.stitchHoleLength).div(2)

    // TODO replace BigNumber lib to one that has sin/cos.
    const dx = new BigNumber(Math.cos(angleInRadians.toNumber())).times(halfLength)
    const dy = new BigNumber(Math.sin(angleInRadians.toNumber())).times(halfLength)

    const centerX = new BigNumber(hole.center.x)
    const centerY = new BigNumber(hole.center.y)

    return {
      start: { x: centerX.minus(dx).toNumber(), y: centerY.minus(dy).toNumber() },
      end: { x: centerX.plus(dx).toNumber(), y: centerY.plus(dy).toNumber() },
    }
  }, [hole.center.x, hole.center.y, hole.rotation, settings.stitchHoleLength])
}

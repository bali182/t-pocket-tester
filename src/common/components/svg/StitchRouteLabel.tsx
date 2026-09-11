import { type CSSProperties, type FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import type { ComputedStitchRouteSchema } from '../../schemas/computed'
import { positionInside } from './stitchRouteLabelPositioners'

type StitchRouteLabelProps = {
  route: ComputedStitchRouteSchema
}

export const StitchRouteLabel: FC<StitchRouteLabelProps> = ({ route }) => {
  const { stitchRouteLabelStyles } = useDrawAreaContext()
  const color = stitchRouteLabelStyles.getLabelColor()
  const strokeColor = stitchRouteLabelStyles.getLabelStrokeColor()
  const fontFamily = stitchRouteLabelStyles.getLabelFontFamily()
  const fontSize = stitchRouteLabelStyles.getLabelFontSize()
  const position = positionInside(route)
  const textStyle: CSSProperties = { color, fontFamily, fontSize }

  return (
    <text
      alignmentBaseline={position.alignmentBaseline}
      fill={color}
      stroke={strokeColor}
      strokeWidth={0.6}
      paintOrder="stroke fill"
      strokeLinejoin="round"
      fontFamily={fontFamily}
      fontSize={fontSize}
      pointerEvents="none"
      textAnchor={position.textAnchor}
      x={position.x}
      y={position.y}
      style={textStyle}
    >
      {route.holes.length}
    </text>
  )
}

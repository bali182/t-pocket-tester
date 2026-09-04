import BigNumber from 'bignumber.js'
import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { getSvgExportElementBoundingRect } from '../../logic/exports/getSvgExportElementBoundingRect'
import type { SvgExportElementSchema } from '../../schemas/svgExport'
import { isDefined } from '../../utils/isDefined'

type ExportElementTextProps = {
  element: SvgExportElementSchema
}

export const ExportElementText: FC<ExportElementTextProps> = ({ element }) => {
  const { exportTextStyles, exportIdentifiers } = useDrawAreaContext()
  const lines = [
    getExportTextLine(
      exportIdentifiers.getNameText(element),
      exportTextStyles.getNameTextColor(element),
      exportTextStyles.getNameTextFontFamily(element),
      exportTextStyles.getNameTextFontSize(element),
    ),
    getExportTextLine(
      exportTextStyles.getDimensionsText(element),
      exportTextStyles.getDimensionsTextColor(element),
      exportTextStyles.getDimensionsTextFontFamily(element),
      exportTextStyles.getDimensionsTextFontSize(element),
    ),
  ].filter(isDefined)

  if (lines.length === 0) {
    return null
  }

  const boundingRect = getSvgExportElementBoundingRect(element)
  const positionedLines = getExportTextLinePositions(
    lines,
    boundingRect.x.plus(boundingRect.width.dividedBy(2)),
    boundingRect.y.plus(boundingRect.height.dividedBy(2)),
    new BigNumber(exportTextStyles.getNameDimensionsGap(element) ?? 0),
  )

  return (
    <g data-text-for-component={exportIdentifiers.getElementId(element)}>
      {positionedLines.map((position) => (
        <text
          alignmentBaseline="middle"
          dominantBaseline="middle"
          fill={position.line.color}
          fontFamily={position.line.fontFamily}
          fontSize={position.line.fontSize}
          key={position.line.text}
          textAnchor="middle"
          x={position.x.toString()}
          y={position.y.toString()}
        >
          {position.line.text}
        </text>
      ))}
    </g>
  )
}

type ExportTextLine = {
  text: string
  color: string | undefined
  fontFamily: string | undefined
  fontSize: number
}

type ExportTextLinePosition = {
  line: ExportTextLine
  x: BigNumber
  y: BigNumber
}

const getExportTextLine = (
  text: string | undefined,
  color: string | undefined,
  fontFamily: string | undefined,
  fontSize: number | undefined,
): ExportTextLine | undefined => {
  if (isDefined(text) && isDefined(fontSize)) {
    return {
      text,
      color,
      fontFamily,
      fontSize,
    }
  }

  return undefined
}

const getExportTextLinePositions = (
  lines: ExportTextLine[],
  centerX: BigNumber,
  centerY: BigNumber,
  gap: BigNumber,
): ExportTextLinePosition[] => {
  const linesHeight = lines.reduce((height, line) => height.plus(line.fontSize), new BigNumber(0))
  const contentHeight = linesHeight.plus(gap.times(lines.length - 1))
  const contentTop = centerY.minus(contentHeight.dividedBy(2))

  return lines.map((line, lineIndex) => {
    const previousLinesHeight = lines
      .slice(0, lineIndex)
      .reduce((height, previousLine) => height.plus(previousLine.fontSize), new BigNumber(0))

    return {
      line,
      x: centerX,
      y: contentTop
        .plus(previousLinesHeight)
        .plus(gap.times(lineIndex))
        .plus(new BigNumber(line.fontSize).dividedBy(2)),
    }
  })
}

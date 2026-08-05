import BigNumber from 'bignumber.js'
import { G, Text } from '@react-pdf/renderer'
import type { FC } from 'react'

import { useDrawAreaContext } from '../../contexts/DrawAreaContext'
import { getSvgExportElementBoundingRect } from '../../logic/exports/getSvgExportElementBoundingRect'
import type { SvgExportElementSchema } from '../../schemas/svgExport'
import { isDefined } from '../../utils/isDefined'

type PdfElementTextProps = {
  element: SvgExportElementSchema
}

type PdfTextLine = {
  text: string
  color: string | undefined
  fontSize: number
}

type PdfTextLinePosition = {
  line: PdfTextLine
  x: BigNumber
  y: BigNumber
}

export const PdfElementText: FC<PdfElementTextProps> = ({ element }) => {
  const { exportTextStyles, exportIdentifiers } = useDrawAreaContext()
  const lines = [
    getPdfTextLine(
      exportIdentifiers.getNameText(element),
      exportTextStyles.getNameTextColor(element),
      exportTextStyles.getNameTextFontSize(element),
    ),
    getPdfTextLine(
      exportTextStyles.getDimensionsText(element),
      exportTextStyles.getDimensionsTextColor(element),
      exportTextStyles.getDimensionsTextFontSize(element),
    ),
  ].filter(isDefined)

  if (lines.length === 0) {
    return null
  }

  const boundingRect = getSvgExportElementBoundingRect(element)
  const positionedLines = getPdfTextLinePositions(
    lines,
    boundingRect.x.plus(boundingRect.width.dividedBy(2)),
    boundingRect.y.plus(boundingRect.height.dividedBy(2)),
    new BigNumber(exportTextStyles.getNameDimensionsGap(element) ?? 0),
  )

  return (
    <G>
      {positionedLines.map((position) => (
        <Text
          dominantBaseline="middle"
          fill={position.line.color}
          key={position.line.text}
          textAnchor="middle"
          x={position.x.toString()}
          y={position.y.toString()}
          {...{ fontSize: position.line.fontSize }}
        >
          {position.line.text}
        </Text>
      ))}
    </G>
  )
}

const getPdfTextLine = (
  text: string | undefined,
  color: string | undefined,
  fontSize: number | undefined,
): PdfTextLine | undefined => {
  if (isDefined(text) && isDefined(fontSize)) {
    return { text, color, fontSize }
  }

  return undefined
}

const getPdfTextLinePositions = (
  lines: PdfTextLine[],
  centerX: BigNumber,
  centerY: BigNumber,
  gap: BigNumber,
): PdfTextLinePosition[] => {
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

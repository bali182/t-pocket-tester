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
  const { exportTextStyles } = useDrawAreaContext()
  const nameText = exportTextStyles.getNameText(element)
  const nameTextColor = exportTextStyles.getNameTextColor(element)
  const nameTextFontFamily = exportTextStyles.getNameTextFontFamily(element)
  const nameTextFontSize = exportTextStyles.getNameTextFontSize(element)
  const dimensionsText = exportTextStyles.getDimensionsText(element)
  const dimensionsTextColor = exportTextStyles.getDimensionsTextColor(element)
  const dimensionsTextFontFamily = exportTextStyles.getDimensionsTextFontFamily(element)
  const dimensionsTextFontSize = exportTextStyles.getDimensionsTextFontSize(element)
  const nameDimensionsGap = exportTextStyles.getNameDimensionsGap(element)

  const hasName = isDefined(nameText) && isDefined(nameTextFontSize)
  const hasDimensions = isDefined(dimensionsText) && isDefined(dimensionsTextFontSize)

  if (!hasName && !hasDimensions) {
    return null
  }

  const boundingRect = getSvgExportElementBoundingRect(element)
  const centerX = boundingRect.x.plus(boundingRect.width.dividedBy(2))
  const centerY = boundingRect.y.plus(boundingRect.height.dividedBy(2))
  const gap = isDefined(nameDimensionsGap) ? new BigNumber(nameDimensionsGap) : new BigNumber(0)
  const nameY = hasName && hasDimensions
    ? centerY.minus(new BigNumber(nameTextFontSize).plus(gap).plus(dimensionsTextFontSize).dividedBy(2)).plus(new BigNumber(nameTextFontSize).dividedBy(2))
    : centerY
  const dimensionsY = hasName && hasDimensions
    ? centerY.plus(new BigNumber(nameTextFontSize).plus(gap).plus(dimensionsTextFontSize).dividedBy(2)).minus(new BigNumber(dimensionsTextFontSize).dividedBy(2))
    : centerY

  return (
    <text textAnchor="middle">
      {hasName && (
        <tspan
          dominantBaseline="middle"
          fill={nameTextColor}
          fontFamily={nameTextFontFamily}
          fontSize={nameTextFontSize}
          x={centerX.toString()}
          y={nameY.toString()}
        >
          {nameText}
        </tspan>
      )}
      {hasDimensions && (
        <tspan
          dominantBaseline="middle"
          fill={dimensionsTextColor}
          fontFamily={dimensionsTextFontFamily}
          fontSize={dimensionsTextFontSize}
          x={centerX.toString()}
          y={dimensionsY.toString()}
        >
          {dimensionsText}
        </tspan>
      )}
    </text>
  )
}

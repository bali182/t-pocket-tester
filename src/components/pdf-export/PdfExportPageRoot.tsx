import BigNumber from 'bignumber.js'
import type { FC } from 'react'

import { DrawAreaContext } from '../../contexts/DrawAreaContext'
import { useSvgDrawArea } from '../../hooks/useSvgDrawArea'
import { getSvgExportElementLayoutBoundingRect } from '../../logic/exports/getSvgExportElementLayoutBoundingRect'
import type { ProjectSchema } from '../../schemas/project'
import type { PdfExportPageSchema, PdfExportParamsSchema, PdfExportPlacementSchema, SvgExportElementSchema } from '../../schemas/svgExport'
import { isDefined } from '../../utils/isDefined'
import { ExportFrontPocket } from '../svg-export/ExportFrontPocket'
import { ExportPanel } from '../svg-export/ExportPanel'
import { ExportTPocket } from '../svg-export/ExportTPocket'

type PdfExportPageRootProps = {
  elements: SvgExportElementSchema[]
  page: PdfExportPageSchema
  pageWidth: BigNumber
  pageHeight: BigNumber
  project: ProjectSchema
  params: PdfExportParamsSchema
}

export const PdfExportPageRoot: FC<PdfExportPageRootProps> = ({
  elements,
  page,
  pageWidth,
  pageHeight,
  project,
  params,
}) => {
  const drawAreaContextValue = useSvgDrawArea(project, params)
  const elementsById = new Map(elements.map((element) => [element.id, element]))

  return (
    <DrawAreaContext.Provider value={drawAreaContextValue}>
      <svg
        width={`${pageWidth.toString()}mm`}
        height={`${pageHeight.toString()}mm`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
        viewBox={`0 0 ${pageWidth.toString()} ${pageHeight.toString()}`}
      >
        {[...page.placements].map(([elementId, placement]) => {
          const element = elementsById.get(elementId)

          if (!isDefined(element)) {
            throw new Error(`Export element not found: ${elementId}`)
          }

          return <PdfExportPageElement element={element} key={element.id} placement={placement} />
        })}
      </svg>
    </DrawAreaContext.Provider>
  )
}

type PdfExportPageElementProps = {
  element: SvgExportElementSchema
  placement: PdfExportPlacementSchema
}

const PdfExportPageElement: FC<PdfExportPageElementProps> = ({ element, placement }) => {
  const transform = getElementTransform(element, placement)

  return <g transform={transform}>{renderElement(element)}</g>
}

const renderElement = (element: SvgExportElementSchema) => {
  switch (element.type) {
    case 'svg-export-panel':
      return <ExportPanel element={element} />
    case 'svg-export-front-pocket':
      return <ExportFrontPocket element={element} />
    case 'svg-export-t-pocket':
      return <ExportTPocket element={element} />
  }
}

const getElementTransform = (element: SvgExportElementSchema, placement: PdfExportPlacementSchema): string => {
  const sourceRect = getSvgExportElementLayoutBoundingRect(element)

  if (placement.rotation === 0) {
    return `translate(${placement.boundingRect.x.minus(sourceRect.x).toString()} ${placement.boundingRect.y.minus(sourceRect.y).toString()})`
  }

  return `translate(${placement.boundingRect.x.plus(sourceRect.y).plus(sourceRect.height).toString()} ${placement.boundingRect.y.minus(sourceRect.x).toString()}) rotate(90)`
}

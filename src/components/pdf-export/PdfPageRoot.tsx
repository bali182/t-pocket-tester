import { Svg } from '@react-pdf/renderer'
import { useMemo, type FC, type ReactNode } from 'react'

import { DrawAreaContext } from '../../contexts/DrawAreaContext'
import { useSvgDrawArea } from '../../hooks/useSvgDrawArea'
import { getSvgExportElementLayoutBoundingRect } from '../../logic/exports/getSvgExportElementLayoutBoundingRect'
import type { SubProjectSchema } from '../../schemas/subProject'
import type { ProjectSchema } from '../../schemas/project'
import type {
  PdfExportPageSchema,
  PdfExportParamsSchema,
  PdfExportPlacementSchema,
  SvgExportElementSchema,
} from '../../schemas/svgExport'
import { isDefined } from '../../utils/isDefined'
import { PdfFrontPocket } from './PdfFrontPocket'
import { PdfPanel } from './PdfPanel'
import { PdfTPocket } from './PdfTPocket'

type PdfPageRootProps = {
  elements: SvgExportElementSchema[]
  page: PdfExportPageSchema
  params: PdfExportParamsSchema
  project: ProjectSchema
  subProject: SubProjectSchema
}

type PdfPageElementProps = {
  element: SvgExportElementSchema
  placement: PdfExportPlacementSchema
}

export const PdfPageRoot: FC<PdfPageRootProps> = ({ elements, page, params, project, subProject }) => {
  const drawAreaContextValue = useSvgDrawArea(subProject, project.stitchingSettings, params)
  const elementsById = new Map(elements.map((element) => [element.id, element]))

  return (
    <DrawAreaContext.Provider value={drawAreaContextValue}>
      {[...page.placements].map(([elementId, placement]) => {
        const element = elementsById.get(elementId)

        if (!isDefined(element)) {
          throw new Error(`Export element not found: ${elementId}`)
        }

        return <PdfPageElement element={element} key={element.id} placement={placement} />
      })}
    </DrawAreaContext.Provider>
  )
}

const PdfPageElement: FC<PdfPageElementProps> = ({ element, placement }) => {
  const sourceRect = useMemo(() => getSvgExportElementLayoutBoundingRect(element), [element])

  return (
    <Svg
      height={`${sourceRect.height.toString()}mm`}
      style={{
        height: `${sourceRect.height.toString()}mm`,
        left: `${placement.x.toString()}mm`,
        position: 'absolute',
        top: `${placement.y.toString()}mm`,
        transform: placement.rotation === 90 ? [{ operation: 'rotate', value: [90, 0, 0] }] : undefined,
        width: `${sourceRect.width.toString()}mm`,
      }}
      viewBox={`${sourceRect.x.toString()} ${sourceRect.y.toString()} ${sourceRect.width.toString()} ${sourceRect.height.toString()}`}
      width={`${sourceRect.width.toString()}mm`}
    >
      {renderPdfElement(element)}
    </Svg>
  )
}

const renderPdfElement = (element: SvgExportElementSchema): ReactNode => {
  switch (element.type) {
    case 'svg-export-panel':
      return <PdfPanel element={element} />
    case 'svg-export-front-pocket':
      return <PdfFrontPocket element={element} />
    case 'svg-export-t-pocket':
      return <PdfTPocket element={element} />
  }
}

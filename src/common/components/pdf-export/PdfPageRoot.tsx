import { Svg } from '@react-pdf/renderer'
import { useMemo, type FC, type ReactNode } from 'react'

import { DrawAreaContext } from '../../contexts/DrawAreaContext'
import { useSvgDrawArea } from '../../hooks/useSvgDrawArea'
import { getSvgExportElementLayoutBoundingRect } from '../../logic/exports/getSvgExportElementLayoutBoundingRect'
import type { PdfExportElement, PdfExportPageSchema, PdfExportSettingsSchema } from '../../schemas/pdfExport'
import type { ProjectSchema } from '../../schemas/project'
import type { SvgExportElementSchema } from '../../schemas/svgExport'
import { PdfFrontPocket } from './PdfFrontPocket'
import { PdfPanel } from './PdfPanel'
import { PdfTPocket } from './PdfTPocket'

type PdfPageRootProps = {
  page: PdfExportPageSchema
  project: ProjectSchema
  settings: PdfExportSettingsSchema
}

export const PdfPageRoot: FC<PdfPageRootProps> = ({ page, project, settings }) => {
  return (
    <>
      {page.elements.map((pageElement) => (
        <PdfElement
          key={`${pageElement.element.subProject.id}:${pageElement.element.id}`}
          element={pageElement}
          project={project}
          settings={settings}
        />
      ))}
    </>
  )
}

type PdfElementProps = {
  element: PdfExportElement
  project: ProjectSchema
  settings: PdfExportSettingsSchema
}

const PdfElement: FC<PdfElementProps> = ({ element: { element, placement }, project, settings }) => {
  const drawAreaContextValue = useSvgDrawArea(element.subProject, project.stitchingSettings, settings)
  const sourceRect = useMemo(() => getSvgExportElementLayoutBoundingRect(element), [element])

  return (
    <DrawAreaContext.Provider value={drawAreaContextValue}>
      <Svg
        fixed
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
    </DrawAreaContext.Provider>
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

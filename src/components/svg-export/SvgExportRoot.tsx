import BigNumber from 'bignumber.js'
import type { FC } from 'react'

import { DrawAreaContext } from '../../contexts/DrawAreaContext'
import { useSvgDrawArea } from '../../hooks/useSvgDrawArea'
import type { SvgExportSchema } from '../../schemas/svgExport'
import { ExportFrontPocket } from './ExportFrontPocket'
import { ExportPanel } from './ExportPanel'
import { ExportTPocket } from './ExportTPocket'

type SvgExportRootProps = {
  svgExport: SvgExportSchema
}

export const SvgExportRoot: FC<SvgExportRootProps> = ({ svgExport }) => {
  const drawAreaContextValue = useSvgDrawArea()
  const padding = new BigNumber(svgExport.params.padding)
  const width = svgExport.contentWidth.plus(padding.times(2))
  const height = svgExport.contentHeight.plus(padding.times(2))
  const viewBox = `${padding.negated().toString()} ${padding.negated().toString()} ${width.toString()} ${height.toString()}`

  return (
    <DrawAreaContext.Provider value={drawAreaContextValue}>
      <svg width={`${width.toString()}mm`} height={`${height.toString()}mm`} style={{ display: 'block' }} viewBox={viewBox}>
        {svgExport.elements.map((element) => {
          switch (element.type) {
            case 'svg-export-panel':
              return <ExportPanel element={element} key={element.component.id} />
            case 'svg-export-front-pocket':
              return <ExportFrontPocket element={element} key={element.pocket.id} />
            case 'svg-export-t-pocket':
              return <ExportTPocket element={element} key={element.pocket.id} />
          }
        })}
      </svg>
    </DrawAreaContext.Provider>
  )
}
